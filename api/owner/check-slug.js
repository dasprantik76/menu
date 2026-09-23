const { connectToDatabase } = require("../_lib/mongodb");
const { COLLECTIONS } = require("../_lib/models");
const { getSessionUser } = require("../_lib/auth");

function slugify(text) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/**
 * Check & Auto-generate Available Restaurant Slug
 * GET /api/owner/check-slug?name=...&slug=...
 */
module.exports = async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ success: false, error: "Method not allowed. Only GET is supported." });
  }

  const url = new URL(req.url, `http://${req.headers.host || "localhost"}`);
  const name = url.searchParams.get("name") || "";
  const rawSlug = url.searchParams.get("slug") || "";

  const baseInput = rawSlug.trim() || name.trim();
  const baseSlug = slugify(baseInput);

  if (!baseSlug || baseSlug.length < 2) {
    return res.status(200).json({
      success: true,
      baseSlug: baseSlug || "",
      availableSlug: "",
      isAvailable: false,
      message: "Please enter at least 2 characters"
    });
  }

  try {
    const { db } = await connectToDatabase();
    const sessionUser = getSessionUser(req);

    // If user already owns a business, exclude it
    let excludeQuery = {};
    if (sessionUser && sessionUser.userId) {
      excludeQuery = { ownerId: { $ne: sessionUser.userId } };
    }

    // 1. Check if baseSlug is available
    const existing = await db.collection(COLLECTIONS.BUSINESSES).findOne({
      slug: baseSlug,
      ...excludeQuery
    });

    if (!existing) {
      return res.status(200).json({
        success: true,
        baseSlug,
        availableSlug: baseSlug,
        isAvailable: true,
        isExactMatch: true
      });
    }

    // 2. Base slug is taken — find next available suffix: baseSlug-1, baseSlug-2, ...
    const escapedBase = baseSlug.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const regex = new RegExp(`^${escapedBase}(-\\d+)?$`);
    const matches = await db.collection(COLLECTIONS.BUSINESSES).find(
      { slug: regex, ...excludeQuery },
      { projection: { slug: 1 } }
    ).toArray();

    const takenSlugs = new Set(matches.map(m => m.slug));

    let counter = 1;
    let candidate = `${baseSlug}-${counter}`;
    while (takenSlugs.has(candidate)) {
      counter++;
      candidate = `${baseSlug}-${counter}`;
    }

    return res.status(200).json({
      success: true,
      baseSlug,
      availableSlug: candidate,
      isAvailable: true,
      isExactMatch: false,
      suggested: true
    });
  } catch (err) {
    console.error("Check slug error:", err);
    return res.status(500).json({ success: false, error: "Database error checking slug." });
  }
};
