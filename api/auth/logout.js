const { clearSessionCookie } = require("../_lib/auth");

/**
 * Logout Handler
 * POST /api/auth/logout
 * Clears HttpOnly session cookie
 */
module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ success: false, error: "Method not allowed. Only POST is supported." });
  }

  clearSessionCookie(res);
  return res.status(200).json({
    success: true,
    message: "Logged out successfully."
  });
};
