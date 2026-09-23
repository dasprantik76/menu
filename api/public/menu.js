const { connectToDatabase } = require("../_lib/mongodb");
const { COLLECTIONS, APPROVAL_STATUS } = require("../_lib/models");

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

    // 1. Fetch business by slug
    const business = await db.collection(COLLECTIONS.BUSINESSES).findOne(
      { slug: cleanSlug },
      {
        projection: {
          _id: 1,
          name: 1,
          slug: 1,
          branding: 1,
          contact: 1,
          approvalStatus: 1,
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

    // 2. Fetch visible categories sorted by display order
    let categories = await db.collection(COLLECTIONS.CATEGORIES)
      .find({
        businessId: business._id,
        isVisible: { $ne: false }
      })
      .sort({ displayOrder: 1, _id: 1 })
      .toArray();

    // Ensure fixed "TODAY'S SPECIAL" is present at the top
    let specialCat = categories.find(c => c.isFixed || (c.name && c.name.toUpperCase() === "TODAY'S SPECIAL"));
    if (!specialCat) {
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
      categories.unshift(newFixedCat);
    }

    // 3. Fetch available menu items
    const menuItems = await db.collection(COLLECTIONS.MENU_ITEMS)
      .find({
        businessId: business._id,
        isAvailable: { $ne: false }
      })
      .sort({ displayOrder: 1, _id: 1 })
      .toArray();

    // 4. Group items under categories to match the frontend schema
    // Always include fixed "TODAY'S SPECIAL" category at the top; for other categories only include if they have items
    const formattedCategories = categories
      .map(cat => {
        const itemsInCat = menuItems
          .filter(item => String(item.categoryId) === String(cat._id))
          .map(item => ({
            name: item.name,
            price: typeof item.price === "number" ? `₹${item.price}` : String(item.price || ""),
            description: item.description || "",
            image: item.image || "",
            isFeatured: !!item.isFeatured
          }));

        return {
          category: cat.name,
          items: itemsInCat,
          isFixed: !!cat.isFixed
        };
      })
      .filter(cat => cat.isFixed || cat.category === "TODAY'S SPECIAL" || cat.items.length > 0);

    // Set caching headers for optimal edge delivery
    res.setHeader("Cache-Control", "public, max-age=60, s-maxage=300, stale-while-revalidate=600");
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
