/**
 * Public Authentication Configuration Endpoint
 * GET /api/auth/config
 * Returns public auth settings such as the Google Client ID configured on the server.
 */
module.exports = async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({
      success: false,
      error: "Method not allowed. Only GET is supported."
    });
  }

  // Dynamically re-read .env so edits to GOOGLE_CLIENT_ID take effect immediately without restarting server
  try {
    const fs = require("fs");
    const path = require("path");
    const envPath = path.resolve(process.cwd(), ".env");
    if (fs.existsSync(envPath)) {
      const envContent = fs.readFileSync(envPath, "utf8");
      const match = envContent.match(/^GOOGLE_CLIENT_ID=(.+)$/m);
      if (match) {
        process.env.GOOGLE_CLIENT_ID = match[1].trim();
      }
    }
  } catch (e) {}

  const clientId = (process.env.GOOGLE_CLIENT_ID || "").trim();
  const isConfigured = Boolean(
    clientId &&
    clientId !== "your-google-oauth-client-id.apps.googleusercontent.com" &&
    clientId.includes(".apps.googleusercontent.com")
  );

  return res.status(200).json({
    success: true,
    googleClientId: isConfigured ? clientId : "",
    isConfigured
  });
};
