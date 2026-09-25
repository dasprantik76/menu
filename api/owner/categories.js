const { ObjectId } = require("mongodb");
const { connectToDatabase } = require("../_lib/mongodb");
const { COLLECTIONS, APPROVAL_STATUS, checkAndExpireApproval } = require("../_lib/models");
const { requireAuth } = require("../_lib/auth");

/**
 * Owner Category Management API
 * GET /api/owner/categories — List categories for owner's business
 * POST /api/owner/categories — Create new category (requires approved status)
 * PATCH /api/owner/categories — Update category name, visibility, or order
 * DELETE /api/owner/categories?id=:id — Delete category and associated dishes
 */
module.exports = async function handler(req, res) {
  const sessionUser = requireAuth(req, res);
  if (!sessionUser) return;

  const ownerId = new ObjectId(sessionUser.userId);

  // Parse body
  let body = req.body;
  if (typeof body === "string") {
    try {
      body = JSON.parse(body);
    } catch (e) {
      return res.status(400).json({ success: false, error: "Invalid JSON body." });
    }
  }
  body = body || {};

  try {
    const { db } = await connectToDatabase();

    // Verify owner's business
    let business = await db.collection(COLLECTIONS.BUSINESSES).findOne({ ownerId });
    if (!business) {
      return res.status(404).json({
        success: false,
        error: "No restaurant business found for your account. Please register first."
      });
    }
    business = await checkAndExpireApproval(db, business);

    // -------------------------------------------------------------
    // GET: List all categories for this restaurant
    // -------------------------------------------------------------
    if (req.method === "GET") {
      // Ensure fixed undeletable "TODAY'S SPECIAL" category exists (and deduplicate if any duplicates exist)
      const allBusinessCats = await db.collection(COLLECTIONS.CATEGORIES)
        .find({ businessId: business._id })
        .toArray();

      const specials = allBusinessCats.filter(c => c.isFixed || (c.name && c.name.toUpperCase() === "TODAY'S SPECIAL"));

      let primarySpecial = null;

      if (specials.length === 0) {
        const newFixedCat = {
          businessId: business._id,
          name: "TODAY'S SPECIAL",
          displayOrder: -1,
          isFixed: true,
          isVisible: true,
          isAvailable: true,
          createdAt: new Date()
        };
        const insertRes = await db.collection(COLLECTIONS.CATEGORIES).insertOne(newFixedCat);
        newFixedCat._id = insertRes.insertedId;
        primarySpecial = newFixedCat;
      } else {
        primarySpecial = specials[0];
        if (!primarySpecial.isFixed || primarySpecial.displayOrder !== -1) {
          await db.collection(COLLECTIONS.CATEGORIES).updateOne(
            { _id: new ObjectId(primarySpecial._id) },
            { $set: { isFixed: true, displayOrder: -1 } }
          );
        }

        // If duplicate specials exist, reassign any items to primarySpecial and delete duplicates
        if (specials.length > 1) {
          for (let i = 1; i < specials.length; i++) {
            const dupId = new ObjectId(specials[i]._id);
            await db.collection(COLLECTIONS.MENU_ITEMS).updateMany(
              { categoryId: dupId, businessId: business._id },
              { $set: { categoryId: new ObjectId(primarySpecial._id) } }
            );
            await db.collection(COLLECTIONS.CATEGORIES).deleteOne({ _id: dupId, businessId: business._id });
          }
        }
      }

      const categories = await db.collection(COLLECTIONS.CATEGORIES)
        .find({ businessId: business._id })
        .sort({ displayOrder: 1, _id: 1 })
        .toArray();

      return res.status(200).json({
        success: true,
        categories
      });
    }

    // Mutating actions require approved business status
    if (business.approvalStatus !== APPROVAL_STATUS.APPROVED) {
      return res.status(403).json({
        success: false,
        error: "Your restaurant application is currently pending or suspended. You cannot edit categories until approved."
      });
    }

    // -------------------------------------------------------------
    // POST: Create a new category
    // -------------------------------------------------------------
    if (req.method === "POST") {
      const { name, displayOrder, isAvailable, isVisible } = body;
      if (!name || typeof name !== "string" || !name.trim()) {
        return res.status(400).json({ success: false, error: "Category name is required." });
      }

      let nextOrder = 0;
      if (typeof displayOrder === "number") {
        nextOrder = displayOrder;
      } else {
        // By default, insert right below Today's Special (displayOrder: 0), shifting existing non-special categories forward
        await db.collection(COLLECTIONS.CATEGORIES).updateMany(
          { businessId: business._id, displayOrder: { $gte: 0 } },
          { $inc: { displayOrder: 1 } }
        );
        nextOrder = 0;
      }

      const avail = typeof isAvailable === "boolean" ? isAvailable : (typeof isVisible === "boolean" ? isVisible : true);

      const newCategory = {
        businessId: business._id,
        name: name.trim().toUpperCase(),
        displayOrder: nextOrder,
        isVisible: avail,
        isAvailable: avail,
        createdAt: new Date()
      };

      const result = await db.collection(COLLECTIONS.CATEGORIES).insertOne(newCategory);
      newCategory._id = result.insertedId;

      return res.status(201).json({
        success: true,
        message: "Category created successfully.",
        category: newCategory
      });
    }

    // -------------------------------------------------------------
    // PATCH: Update category
    // -------------------------------------------------------------
    if (req.method === "PATCH") {
      const { id, name, isVisible, isAvailable, displayOrder } = body;
      if (!id) {
        return res.status(400).json({ success: false, error: "Category ID ('id') is required." });
      }

      let catId = null;
      try {
        catId = new ObjectId(id);
      } catch (e) {
        catId = null;
      }

      let existing = catId ? await db.collection(COLLECTIONS.CATEGORIES).findOne({
        _id: catId,
        businessId: business._id
      }) : null;

      if (!existing && (id === "today_special_fixed" || id === "today_special")) {
        existing = await db.collection(COLLECTIONS.CATEGORIES).findOne({
          businessId: business._id,
          $or: [{ isFixed: true }, { name: "TODAY'S SPECIAL" }]
        });
        if (existing) {
          catId = existing._id;
        } else {
          const targetAvail = typeof isAvailable === "boolean" ? isAvailable : (typeof isVisible === "boolean" ? isVisible : true);
          const newFixedCat = {
            businessId: business._id,
            name: "TODAY'S SPECIAL",
            displayOrder: -1,
            isFixed: true,
            isVisible: targetAvail,
            isAvailable: targetAvail,
            createdAt: new Date()
          };
          const insertRes = await db.collection(COLLECTIONS.CATEGORIES).insertOne(newFixedCat);
          existing = newFixedCat;
          catId = insertRes.insertedId;
        }
      }

      if (!existing) {
        return res.status(404).json({ success: false, error: "Category not found or does not belong to your restaurant." });
      }

      const updates = {};
      const isFixedCat = existing.isFixed || (existing.name && existing.name.toUpperCase() === "TODAY'S SPECIAL");

      if (name && typeof name === "string" && name.trim()) {
        if (isFixedCat && name.trim().toUpperCase() !== "TODAY'S SPECIAL") {
          return res.status(400).json({ success: false, error: "'Today's Special' is a fixed category and cannot be renamed." });
        }
        updates.name = name.trim().toUpperCase();
      }
      if (typeof isAvailable === "boolean") {
        updates.isAvailable = isAvailable;
        updates.isVisible = isAvailable;
      } else if (typeof isVisible === "boolean") {
        updates.isVisible = isVisible;
        updates.isAvailable = isVisible;
      }
      if (typeof displayOrder === "number") {
        if (isFixedCat) {
          updates.displayOrder = -1;
        } else {
          updates.displayOrder = displayOrder;
        }
      }

      await db.collection(COLLECTIONS.CATEGORIES).updateOne(
        { _id: catId, businessId: business._id },
        { $set: updates }
      );

      const updatedCat = await db.collection(COLLECTIONS.CATEGORIES).findOne({ _id: catId });

      return res.status(200).json({
        success: true,
        message: "Category updated.",
        category: updatedCat
      });
    }

    // -------------------------------------------------------------
    // DELETE: Delete category & associated menu items
    // -------------------------------------------------------------
    if (req.method === "DELETE") {
      const id = req.query.id || body.id;
      if (!id) {
        return res.status(400).json({ success: false, error: "Category ID is required to delete." });
      }

      const catId = new ObjectId(id);
      const existing = await db.collection(COLLECTIONS.CATEGORIES).findOne({
        _id: catId,
        businessId: business._id
      });

      if (!existing) {
        return res.status(404).json({ success: false, error: "Category not found or does not belong to your restaurant." });
      }

      if (existing.isFixed || (existing.name && existing.name.toUpperCase() === "TODAY'S SPECIAL")) {
        return res.status(400).json({
          success: false,
          error: "'Today's Special' is a fixed category and cannot be deleted."
        });
      }

      await db.collection(COLLECTIONS.CATEGORIES).deleteOne({ _id: catId, businessId: business._id });
      await db.collection(COLLECTIONS.MENU_ITEMS).deleteMany({ categoryId: catId, businessId: business._id });

      return res.status(200).json({
        success: true,
        message: "Category and associated items deleted successfully."
      });
    }

    return res.status(405).json({ success: false, error: "Method not allowed." });
  } catch (error) {
    console.error("[Owner /categories] Error:", error);
    return res.status(500).json({ success: false, error: "An internal server error occurred." });
  }
};
