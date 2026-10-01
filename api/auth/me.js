const { ObjectId } = require("mongodb");
const { connectToDatabase } = require("../_lib/mongodb");
const { COLLECTIONS, checkAndExpireApproval } = require("../_lib/models");
const { getSessionUser, clearSessionCookie } = require("../_lib/auth");
const { getTrustedDate } = require("../_lib/time");

/**
 * Session Profile API
 * GET /api/auth/me
 * Returns current authenticated user profile and business info from the secure session cookie.
 */
module.exports = async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ success: false, error: "Method not allowed. Only GET is supported." });
  }

  res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");

  const session = getSessionUser(req);
  if (!session) {
    return res.status(200).json({
      success: true,
      authenticated: false,
      user: null,
      business: null
    });
  }

  try {
    const { db } = await connectToDatabase();
    const now = await getTrustedDate();

    const user = await db.collection(COLLECTIONS.USERS).findOne(
      { _id: new ObjectId(session.userId) },
      { projection: { _id: 1, email: 1, name: 1, picture: 1, role: 1, accountStatus: 1 } }
    );

    if (!user || user.accountStatus === "suspended") {
      clearSessionCookie(res);
      return res.status(200).json({
        success: true,
        authenticated: false,
        user: null,
        business: null,
        error: "Account suspended or not found."
      });
    }

    // Fetch business associated with this user
    let business = await db.collection(COLLECTIONS.BUSINESSES).findOne({ ownerId: user._id });
    if (business) {
      business = await checkAndExpireApproval(db, business);
    }

    const daysLeft = (business && business.approvalExpiry)
      ? Math.max(0, Math.ceil((new Date(business.approvalExpiry).getTime() - now.getTime()) / 86400000))
      : null;

    return res.status(200).json({
      success: true,
      authenticated: true,
      serverTime: now.toISOString(),
      user: {
        id: String(user._id),
        email: user.email,
        name: user.name,
        picture: user.picture,
        role: user.role
      },
      business: business ? {
        id: String(business._id),
        name: business.name,
        ownerName: business.ownerName || "",
        slug: business.slug,
        contact: business.contact || {},
        branding: business.branding || { accentColor: "#991e2e", logoUrl: "" },
        approvalStatus: business.approvalStatus,
        approvalExpiry: business.approvalExpiry,
        approvalDays: business.approvalDays,
        approvalDaysLeft: daysLeft,
        serverTime: now.toISOString(),
        subscriptionStatus: business.subscriptionStatus,
        subscriptionExpiry: business.subscriptionExpiry,
        enabledFeatures: business.enabledFeatures || [],
        isPublished: business.isPublished
      } : null
    });
  } catch (error) {
    console.error("[Auth /me] Database error:", error);
    return res.status(500).json({
      success: false,
      error: "An internal server error occurred retrieving your session."
    });
  }
};
