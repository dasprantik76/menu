const { ObjectId } = require("mongodb");
const { connectToDatabase } = require("../_lib/mongodb");
const { COLLECTIONS } = require("../_lib/models");
const { getSessionUser, clearSessionCookie } = require("../_lib/auth");

/**
 * Session Profile API
 * GET /api/auth/me
 * Returns current authenticated user profile and business info from the secure session cookie.
 */
module.exports = async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ success: false, error: "Method not allowed. Only GET is supported." });
  }

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
    const business = await db.collection(COLLECTIONS.BUSINESSES).findOne({ ownerId: user._id });

    return res.status(200).json({
      success: true,
      authenticated: true,
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
        slug: business.slug,
        approvalStatus: business.approvalStatus,
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
