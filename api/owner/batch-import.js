const { ObjectId } = require("mongodb");
const { connectToDatabase } = require("../_lib/mongodb");
const { COLLECTIONS, APPROVAL_STATUS, checkAndExpireApproval } = require("../_lib/models");
const { requireAuth } = require("../_lib/auth");

function escapeRegex(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/**
 * Batch Menu Import API
 * POST /api/owner/batch-import
 * Persists approved categories and dishes from the AI preview into MongoDB.
 */
module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ success: false, error: "Method not allowed. Use POST." });
  }

  const sessionUser = requireAuth(req, res);
  if (!sessionUser) return;

  const ownerId = new ObjectId(sessionUser.userId);

  try {
    const { db } = await connectToDatabase();

    let business = await db.collection(COLLECTIONS.BUSINESSES).findOne({ ownerId });
    if (!business) {
      return res.status(404).json({
        success: false,
        error: "No restaurant business found for your account."
      });
    }

    business = await checkAndExpireApproval(db, business);
    if (business.approvalStatus !== APPROVAL_STATUS.APPROVED) {
      return res.status(403).json({
        success: false,
        error: "Your restaurant application is currently pending or suspended. Menu import is disabled."
      });
    }

    let body = req.body;
    if (typeof body === "string") {
      try {
        body = JSON.parse(body);
      } catch (e) {
        return res.status(400).json({ success: false, error: "Invalid JSON payload." });
      }
    }

    const { categories, mode } = body || {};
    if (!categories || !Array.isArray(categories) || categories.length === 0) {
      return res.status(400).json({
        success: false,
        error: "No categories or dishes provided to import."
      });
    }

    const isReplaceMode = (mode === "replace");

    if (isReplaceMode) {
      // Remove existing items and custom categories (preserve fixed specials if any)
      await db.collection(COLLECTIONS.MENU_ITEMS).deleteMany({ businessId: business._id });
      await db.collection(COLLECTIONS.CATEGORIES).deleteMany({
        businessId: business._id,
        isFixed: { $ne: true }
      });
    }

    let createdCategoriesCount = 0;
    let createdItemsCount = 0;

    for (const catData of categories) {
      const catName = String(catData.name || "").trim().toUpperCase();
      if (!catName) continue;

      const validItems = (Array.isArray(catData.items) ? catData.items : [])
        .filter(it => it && it.selected !== false && typeof it.name === "string" && it.name.trim().length > 0);

      if (validItems.length === 0) continue;

      // Find or create category
      let category = await db.collection(COLLECTIONS.CATEGORIES).findOne({
        businessId: business._id,
        name: { $regex: new RegExp("^" + escapeRegex(catName) + "$", "i") }
      });

      if (!category) {
        const lastCat = await db.collection(COLLECTIONS.CATEGORIES)
          .find({ businessId: business._id })
          .sort({ displayOrder: -1 })
          .limit(1)
          .toArray();

        const nextOrder = (lastCat.length > 0 && typeof lastCat[0].displayOrder === "number")
          ? lastCat[0].displayOrder + 1
          : 0;

        const newCatDoc = {
          businessId: business._id,
          name: catName,
          displayOrder: nextOrder,
          isVisible: true,
          isAvailable: true,
          createdAt: new Date()
        };

        const insertCatRes = await db.collection(COLLECTIONS.CATEGORIES).insertOne(newCatDoc);
        category = { _id: insertCatRes.insertedId, ...newCatDoc };
        createdCategoriesCount++;
      }

      // Find current max order for this category
      const lastItem = await db.collection(COLLECTIONS.MENU_ITEMS)
        .find({ businessId: business._id, categoryId: category._id })
        .sort({ displayOrder: -1 })
        .limit(1)
        .toArray();

      let currentItemOrder = (lastItem.length > 0 && typeof lastItem[0].displayOrder === "number")
        ? lastItem[0].displayOrder + 1
        : 0;

      const itemsDocs = validItems.map(it => ({
        businessId: business._id,
        categoryId: category._id,
        name: String(it.name).trim(),
        price: typeof it.price === "number" && !isNaN(it.price) ? Math.max(0, it.price) : Number(it.price) || 0,
        description: it.description ? String(it.description).trim() : "",
        image: "",
        isAvailable: true,
        isFeatured: false,
        displayOrder: currentItemOrder++,
        createdAt: new Date()
      }));

      if (itemsDocs.length > 0) {
        await db.collection(COLLECTIONS.MENU_ITEMS).insertMany(itemsDocs);
        createdItemsCount += itemsDocs.length;
      }
    }

    return res.status(200).json({
      success: true,
      createdCategoriesCount,
      createdItemsCount,
      message: `Successfully imported ${createdItemsCount} dish${createdItemsCount === 1 ? "" : "es"}.`
    });
  } catch (err) {
    console.error("[batch-import Handler Error]:", err);
    return res.status(500).json({
      success: false,
      error: err.message || "Failed to import menu items."
    });
  }
};
