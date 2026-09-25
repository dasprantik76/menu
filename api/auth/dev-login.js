const { connectToDatabase } = require("../_lib/mongodb");
const { COLLECTIONS } = require("../_lib/models");
const { signSessionToken, setSessionCookie } = require("../_lib/auth");

/**
 * Fast Dev Login Helper (Local Development Only)
 * GET /api/auth/dev-login?email=owner@royalfoodcorner.com
 * Immediately authenticates as an approved owner and redirects to the owner dashboard.
 */
module.exports = async function handler(req, res) {
  if (process.env.NODE_ENV === "production") {
    return res.status(403).json({ success: false, error: "Dev login is disabled in production." });
  }

  try {
    const { db } = await connectToDatabase();
    const emailQuery = req.query && req.query.email ? req.query.email.toLowerCase().trim() : null;

    let user = null;
    if (emailQuery) {
      user = await db.collection(COLLECTIONS.USERS).findOne({ email: emailQuery });
    }
    if (!user) {
      // Default to Rajput Hotel owner
      user = await db.collection(COLLECTIONS.USERS).findOne({ email: "rcavirup@gmail.com" });
    }
    if (!user) {
      const approvedBiz = await db.collection(COLLECTIONS.BUSINESSES).findOne({ approvalStatus: "approved" });
      if (approvedBiz && approvedBiz.ownerId) {
        user = await db.collection(COLLECTIONS.USERS).findOne({ _id: approvedBiz.ownerId });
      }
    }
    if (!user) {
      user = await db.collection(COLLECTIONS.USERS).findOne({ role: "owner" });
    }

    if (!user) {
      return res.status(404).json({ success: false, error: "Approved owner user not found." });
    }

    const token = signSessionToken({
      userId: String(user._id),
      email: user.email,
      role: user.role || "owner"
    });

    setSessionCookie(res, token);

    res.setHeader("Location", "/?view=dashboard#dashboard");
    res.writeHead(302);
    return res.end();
  } catch (err) {
    console.error("[Dev Login Error]:", err);
    return res.status(500).json({ success: false, error: err.message });
  }
};
