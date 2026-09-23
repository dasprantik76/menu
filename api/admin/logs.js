const { connectToDatabase } = require("../_lib/mongodb");
const { COLLECTIONS, USER_ROLES } = require("../_lib/models");
const { requireRole } = require("../_lib/auth");

/**
 * Super Admin Audit Logs API
 * GET /api/admin/logs
 */
module.exports = async function handler(req, res) {
  const adminUser = requireRole(req, res, USER_ROLES.ADMIN);
  if (!adminUser) return;

  if (req.method !== "GET") {
    return res.status(405).json({ success: false, error: "Method not allowed. Only GET is supported." });
  }

  try {
    const { db } = await connectToDatabase();

    const logs = await db.collection(COLLECTIONS.ADMIN_LOGS)
      .find({})
      .sort({ timestamp: -1 })
      .limit(100)
      .toArray();

    return res.status(200).json({
      success: true,
      logs
    });
  } catch (error) {
    console.error("[Admin /logs] Error:", error);
    return res.status(500).json({ success: false, error: "An internal server error occurred." });
  }
};
