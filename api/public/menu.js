const { connectToDatabase } = require("../_lib/mongodb");
const { COLLECTIONS, APPROVAL_STATUS, checkAndExpireApproval } = require("../_lib/models");

/**
 * Public Read-Only Menu API
 * GET /api/public/menu?slug=:slug
 * Returns published categories and dishes for a verified, approved restaurant.
 */
module.exports = async function handler(req, res) {
  // CORS Preflight
  if (req.method === "OPTIONS") {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    return res.status(200).end();
  }

  if (req.method !== "GET") {
    return res.status(405).json({ success: false, error: "Method not allowed. Only GET is supported." });
  }

  const { slug } = req.query;

  if (!slug || typeof slug !== "string" || !slug.trim()) {
    return res.status(400).json({
      success: false,
      error: "Missing required parameter: 'slug'. Example: /api/public/menu?slug=your-restaurant"
    });
  }

  const cleanSlug = slug.trim().toLowerCase();

  try {
    const { db } = await connectToDatabase();

    // 1. Fetch business by permanent slug (or fallback by business _id)
    let businessQuery = { slug: cleanSlug };
    if (/^[0-9a-fA-F]{24}$/.test(cleanSlug)) {
      const { ObjectId } = require("mongodb");
      businessQuery = { $or: [{ slug: cleanSlug }, { _id: new ObjectId(cleanSlug) }] };
    }

    let business = await db.collection(COLLECTIONS.BUSINESSES).findOne(
      businessQuery,
      {
        projection: {
          _id: 1,
          name: 1,
          slug: 1,
          branding: 1,
          contact: 1,
          approvalStatus: 1,
          approvalExpiry: 1,
          isPublished: 1
        }
      }
    );

    if (!business) {
      return res.status(404).json({
        success: false,
        error: `Restaurant with slug '${cleanSlug}' was not found.`
      });
    }

    business = await checkAndExpireApproval(db, business);

    // Public security gate: Only approved & published restaurants are visible to customers
    if (business.approvalStatus !== APPROVAL_STATUS.APPROVED) {
      return res.status(403).json({
        success: false,
        error: "This restaurant's menu is currently pending review or inactive."
      });
    }

    if (business.isPublished === false) {
      return res.status(404).json({
        success: false,
        error: "This restaurant's menu is currently unpublished."
      });
    }

    // 2. Fetch all categories for this restaurant sorted by display order
    const allCategories = await db.collection(COLLECTIONS.CATEGORIES)
      .find({ businessId: business._id })
      .sort({ displayOrder: 1, _id: 1 })
      .toArray();

    // Clean up or find Today's Special if present
    const specials = allCategories.filter(c => c.isFixed || (c.name && c.name.toUpperCase() === "TODAY'S SPECIAL"));
    let specialCat = null;

    if (specials.length > 0) {
      specialCat = specials[0];
      // Clean up any duplicate specials created previously
      if (specials.length > 1) {
        for (let i = 1; i < specials.length; i++) {
          const dupId = specials[i]._id;
          await db.collection(COLLECTIONS.MENU_ITEMS).updateMany(
            { categoryId: dupId, businessId: business._id },
            { $set: { categoryId: specialCat._id } }
          );
          await db.collection(COLLECTIONS.CATEGORIES).deleteOne({ _id: dupId, businessId: business._id });
        }
      }
    } else {
      // Only insert if no special category exists at all in the database for this restaurant
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
      allCategories.unshift(newFixedCat);
      specialCat = newFixedCat;
    }

    // Filter categories: A category is ACTIVE only when its toggle switch is ON
    // (both isVisible !== false and isAvailable !== false)
    // When a category's toggle switch is off (including Today's Special), it is excluded completely.
    const activeCategories = allCategories.filter(cat => {
      return cat.isVisible !== false && cat.isAvailable !== false;
    });

    // 3. Fetch available menu items whose toggle switch is ON (isAvailable !== false && isVisible !== false)
    const menuItems = await db.collection(COLLECTIONS.MENU_ITEMS)
      .find({
        businessId: business._id,
        isAvailable: { $ne: false },
        isVisible: { $ne: false }
      })
      .sort({ displayOrder: 1, _id: 1 })
      .toArray();

    // 4. Group items under active categories to match frontend schema
    const formattedCategories = activeCategories
      .map(cat => {
        const isSpecial = cat.isFixed || (cat.name && cat.name.toUpperCase() === "TODAY'S SPECIAL");
        const itemsInCat = menuItems
          .filter(item => {
            if (item.isAvailable === false || item.isVisible === false) return false;
            if (isSpecial) {
              return !!(item.isSpecial || item.isFeatured || String(item.categoryId) === String(cat._id));
            }
            return String(item.categoryId) === String(cat._id);
          })
          .map(item => ({
            name: item.name,
            price: typeof item.price === "number" ? `₹${item.price}` : String(item.price || ""),
            description: item.description || "",
            image: item.image || "",
            isFeatured: isSpecial || !!(item.isSpecial || item.isFeatured)
          }));

        return {
          category: cat.name,
          items: itemsInCat,
          isFixed: isSpecial,
          isVisible: true
        };
      })
      .filter(cat => {
        // Only show categories that have at least 1 menu item added (including Today's Special)
        return Array.isArray(cat.items) && cat.items.length > 0;
      });

    // Disable caching so newly added items/categories reflect immediately
    res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
    res.setHeader("Pragma", "no-cache");
    res.setHeader("Expires", "0");
    res.setHeader("Access-Control-Allow-Origin", "*");

    return res.status(200).json({
      success: true,
      restaurant: {
        name: business.name,
        slug: business.slug,
        branding: business.branding || { accentColor: "#991e2e" },
        contact: business.contact || {}
      },
      categories: formattedCategories
    });
  } catch (error) {
    console.error(`[API /public/menu] Error fetching menu for slug '${cleanSlug}':`, error);
    return res.status(500).json({
      success: false,
      error: "An internal server error occurred while retrieving the menu."
    });
  }
};
