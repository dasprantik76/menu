const { ObjectId } = require("mongodb");
const { connectToDatabase } = require("../_lib/mongodb");
const { COLLECTIONS, APPROVAL_STATUS, checkAndExpireApproval } = require("../_lib/models");
const { requireAuth } = require("../_lib/auth");

/**
 * Owner Menu Items Management API
 * GET /api/owner/items — List dishes for owner's restaurant (optional ?categoryId=...)
 * POST /api/owner/items — Add new dish
 * PATCH /api/owner/items — Update dish (name, price, availability, featured)
 * DELETE /api/owner/items?id=:id — Remove dish
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
    // GET: List dishes
    // -------------------------------------------------------------
    if (req.method === "GET") {
      const query = { businessId: business._id };
      if (req.query && req.query.categoryId) {
        query.categoryId = new ObjectId(req.query.categoryId);
      }

      const items = await db.collection(COLLECTIONS.MENU_ITEMS)
        .find(query)
        .sort({ displayOrder: 1, _id: 1 })
        .toArray();

      return res.status(200).json({
        success: true,
        items
      });
    }

    // Mutating actions require approved business status
    if (business.approvalStatus !== APPROVAL_STATUS.APPROVED) {
      return res.status(403).json({
        success: false,
        error: "Your restaurant application is currently pending or suspended. You cannot edit dishes until approved."
      });
    }

    // -------------------------------------------------------------
    // POST: Add new menu item
    // -------------------------------------------------------------
    if (req.method === "POST") {
      const { categoryId, name, price, description, isAvailable, isFeatured } = body;

      if (!categoryId) {
        return res.status(400).json({ success: false, error: "A valid categoryId is required." });
      }
      if (!name || typeof name !== "string" || !name.trim()) {
        return res.status(400).json({ success: false, error: "Dish name is required." });
      }
      if (price === undefined || price === null || isNaN(Number(price))) {
        return res.status(400).json({ success: false, error: "A valid numeric price is required." });
      }

      let catObjectId = null;
      try {
        catObjectId = new ObjectId(categoryId);
      } catch (e) {
        catObjectId = null;
      }

      let category = catObjectId ? await db.collection(COLLECTIONS.CATEGORIES).findOne({
        _id: catObjectId,
        businessId: business._id
      }) : null;

      if (!category && (categoryId === "today_special_fixed" || categoryId === "today_special")) {
        category = await db.collection(COLLECTIONS.CATEGORIES).findOne({
          businessId: business._id,
          $or: [{ isFixed: true }, { name: "TODAY'S SPECIAL" }]
        });
        if (category) {
          catObjectId = category._id;
        }
      }

      if (!category) {
        return res.status(400).json({ success: false, error: "Selected category does not exist in your restaurant." });
      }

      // Next display order
      const lastItem = await db.collection(COLLECTIONS.MENU_ITEMS)
        .find({ businessId: business._id, categoryId: catObjectId })
        .sort({ displayOrder: -1 })
        .limit(1)
        .toArray();

      const nextOrder = (lastItem.length > 0 && typeof lastItem[0].displayOrder === "number")
        ? lastItem[0].displayOrder + 1
        : 0;

      const newItem = {
        businessId: business._id,
        categoryId: catObjectId,
        name: name.trim(),
        price: Number(price),
        description: description ? String(description).trim() : "",
        image: "",
        isAvailable: isAvailable !== false,
        isFeatured: !!isFeatured,
        displayOrder: nextOrder,
        createdAt: new Date()
      };

      const result = await db.collection(COLLECTIONS.MENU_ITEMS).insertOne(newItem);
      newItem._id = result.insertedId;

      return res.status(201).json({
        success: true,
        message: "Dish added successfully.",
        item: newItem
      });
    }

    // -------------------------------------------------------------
    // PATCH: Update menu item (name, price, availability, featured, etc.)
    // -------------------------------------------------------------
    if (req.method === "PATCH") {
      const { id, name, price, description, isAvailable, isFeatured, categoryId, displayOrder } = body;

      if (!id) {
        return res.status(400).json({ success: false, error: "Item ID ('id') is required." });
      }

      const itemId = new ObjectId(id);
      const existing = await db.collection(COLLECTIONS.MENU_ITEMS).findOne({
        _id: itemId,
        businessId: business._id
      });

      if (!existing) {
        return res.status(404).json({ success: false, error: "Menu item not found or does not belong to your restaurant." });
      }

      const updates = {};
      if (name && typeof name === "string" && name.trim()) {
        updates.name = name.trim();
      }
      if (price !== undefined && price !== null && !isNaN(Number(price))) {
        updates.price = Number(price);
      }
      if (description !== undefined) {
        updates.description = String(description).trim();
      }
      if (typeof isAvailable === "boolean") {
        updates.isAvailable = isAvailable;
        updates.isVisible = isAvailable;
      } else if (typeof isVisible === "boolean") {
        updates.isVisible = isVisible;
        updates.isAvailable = isVisible;
      }
      if (typeof isFeatured === "boolean") {
        updates.isFeatured = isFeatured;
      }
      if (typeof displayOrder === "number") {
        updates.displayOrder = displayOrder;
      }
      if (categoryId) {
        let catObjectId = null;
        try {
          catObjectId = new ObjectId(categoryId);
        } catch (e) {
          catObjectId = null;
        }
        let catExists = catObjectId ? await db.collection(COLLECTIONS.CATEGORIES).findOne({
          _id: catObjectId,
          businessId: business._id
        }) : null;

        if (!catExists && (categoryId === "today_special_fixed" || categoryId === "today_special")) {
          catExists = await db.collection(COLLECTIONS.CATEGORIES).findOne({
            businessId: business._id,
            $or: [{ isFixed: true }, { name: "TODAY'S SPECIAL" }]
          });
          if (catExists) {
            catObjectId = catExists._id;
          }
        }

        if (catExists) {
          updates.categoryId = catObjectId;
        }
      }

      await db.collection(COLLECTIONS.MENU_ITEMS).updateOne(
        { _id: itemId, businessId: business._id },
        { $set: updates }
      );

      const updatedItem = await db.collection(COLLECTIONS.MENU_ITEMS).findOne({ _id: itemId });

      return res.status(200).json({
        success: true,
        message: "Menu item updated.",
        item: updatedItem
      });
    }

    // -------------------------------------------------------------
    // DELETE: Remove menu item
    // -------------------------------------------------------------
    if (req.method === "DELETE") {
      const id = req.query.id || body.id;
      if (!id) {
        return res.status(400).json({ success: false, error: "Item ID is required to delete." });
      }

      const itemId = new ObjectId(id);
      const existing = await db.collection(COLLECTIONS.MENU_ITEMS).findOne({
        _id: itemId,
        businessId: business._id
      });

      if (!existing) {
        return res.status(404).json({ success: false, error: "Item not found or does not belong to your restaurant." });
      }

      await db.collection(COLLECTIONS.MENU_ITEMS).deleteOne({ _id: itemId, businessId: business._id });

      return res.status(200).json({
        success: true,
        message: "Menu item removed."
      });
    }

    return res.status(405).json({ success: false, error: "Method not allowed." });
  } catch (error) {
    console.error("[Owner /items] Error:", error);
    return res.status(500).json({ success: false, error: "An internal server error occurred." });
  }
};
