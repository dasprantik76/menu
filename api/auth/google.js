const { OAuth2Client } = require("google-auth-library");
const { connectToDatabase } = require("../_lib/mongodb");
const { COLLECTIONS, USER_ROLES } = require("../_lib/models");
const { signSessionToken, setSessionCookie } = require("../_lib/auth");

/**
 * Google Authentication Handler
 * POST /api/auth/google
 * Body: { credential } (Google ID token from Google Identity Services)
 */
module.exports = async function handler(req, res) {
  if (req.method === "GET") {
    res.writeHead(302, { Location: "/" });
    return res.end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ success: false, error: "Method not allowed. Only POST is supported." });
  }

  // Detect whether request comes from a browser form redirection (GIS redirect mode)
  const isFormRedirect = Boolean(
    (req.headers["content-type"] && req.headers["content-type"].includes("application/x-www-form-urlencoded")) ||
    (req.headers["sec-fetch-mode"] === "navigate") ||
    (req.headers.accept && req.headers.accept.includes("text/html"))
  );

  // Parse body if not already parsed by serverless runtime
  let body = req.body;
  if (typeof body === "string") {
    try {
      body = JSON.parse(body);
    } catch (e) {
      const querystring = require("querystring");
      body = querystring.parse(body);
    }
  }
  body = body || {};

  const { credential, accessToken, devEmail, devName } = body;

  let googleUser = null;

  // 1. Google OAuth ID Token or Access Token Verification
  if (credential) {
    try {
      const fs = require("fs");
      const path = require("path");
      const envPath = path.resolve(process.cwd(), ".env");
      if (fs.existsSync(envPath)) {
        const envContent = fs.readFileSync(envPath, "utf8");
        const match = envContent.match(/^GOOGLE_CLIENT_ID=(.+)$/m);
        if (match) process.env.GOOGLE_CLIENT_ID = match[1].trim();
      }
    } catch (e) {}

    const clientId = process.env.GOOGLE_CLIENT_ID;
    if (!clientId) {
      const errText = "GOOGLE_CLIENT_ID is not configured in server environment.";
      if (isFormRedirect) {
        res.writeHead(302, { Location: "/?auth_error=" + encodeURIComponent(errText) });
        return res.end();
      }
      return res.status(500).json({ success: false, error: errText });
    }

    try {
      const client = new OAuth2Client(clientId);
      const ticket = await client.verifyIdToken({
        idToken: credential,
        audience: clientId
      });
      const payload = ticket.getPayload();

      if (!payload || !payload.email) {
        const errText = "Invalid Google ID token payload.";
        if (isFormRedirect) {
          res.writeHead(302, { Location: "/?auth_error=" + encodeURIComponent(errText) });
          return res.end();
        }
        return res.status(400).json({ success: false, error: errText });
      }

      googleUser = {
        googleId: payload.sub,
        email: payload.email.toLowerCase(),
        name: payload.name || "User",
        picture: payload.picture || ""
      };
    } catch (err) {
      console.error("[Auth /google] Verification failed:", err.message);
      const errText = `Google token verification failed: ${err.message}`;
      if (isFormRedirect) {
        res.writeHead(302, { Location: "/?auth_error=" + encodeURIComponent(errText) });
        return res.end();
      }
      return res.status(401).json({ success: false, error: errText });
    }
  } else if (accessToken) {
    try {
      const userinfoRes = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
        headers: { Authorization: `Bearer ${accessToken}` }
      });
      if (!userinfoRes.ok) {
        const errText = "Failed to verify Google access token.";
        if (isFormRedirect) {
          res.writeHead(302, { Location: "/?auth_error=" + encodeURIComponent(errText) });
          return res.end();
        }
        return res.status(401).json({ success: false, error: errText });
      }
      const payload = await userinfoRes.json();
      if (!payload || !payload.email) {
        const errText = "Invalid Google user profile payload.";
        if (isFormRedirect) {
          res.writeHead(302, { Location: "/?auth_error=" + encodeURIComponent(errText) });
          return res.end();
        }
        return res.status(400).json({ success: false, error: errText });
      }

      googleUser = {
        googleId: payload.sub,
        email: payload.email.toLowerCase(),
        name: payload.name || "User",
        picture: payload.picture || ""
      };
    } catch (err) {
      console.error("[Auth /google] Access token verification failed:", err.message);
      const errText = `Google token verification failed: ${err.message}`;
      if (isFormRedirect) {
        res.writeHead(302, { Location: "/?auth_error=" + encodeURIComponent(errText) });
        return res.end();
      }
      return res.status(401).json({ success: false, error: errText });
    }
  } else if (process.env.NODE_ENV !== "production" && devEmail) {
    // Local dev fallback for testing without Google Cloud setup
    googleUser = {
      googleId: `dev_${Date.now()}`,
      email: devEmail.trim().toLowerCase(),
      name: devName ? devName.trim() : "Development User",
      picture: ""
    };
  } else {
    const errText = "Missing required 'credential' or 'accessToken'.";
    if (isFormRedirect) {
      res.writeHead(302, { Location: "/?auth_error=" + encodeURIComponent(errText) });
      return res.end();
    }
    return res.status(400).json({ success: false, error: errText });
  }

  try {
    const { db } = await connectToDatabase();

    // 2. Strict Super-Admin Bootstrapping Rule
    // Only users whose email exactly matches SUPER_ADMIN_EMAIL get the 'admin' role.
    const superAdminEmail = (process.env.SUPER_ADMIN_EMAIL || "").trim().toLowerCase();
    const isSuperAdmin = superAdminEmail && googleUser.email === superAdminEmail;
    const assignedRole = isSuperAdmin ? USER_ROLES.ADMIN : USER_ROLES.OWNER;

    // 3. Upsert user record
    const updateDoc = {
      $set: {
        googleId: googleUser.googleId,
        name: googleUser.name,
        picture: googleUser.picture,
        accountStatus: "active",
        lastLoginAt: new Date()
      },
      $setOnInsert: {
        email: googleUser.email,
        role: assignedRole,
        createdAt: new Date()
      }
    };

    // If email is configured as super admin, always ensure role is admin
    if (isSuperAdmin) {
      updateDoc.$set.role = USER_ROLES.ADMIN;
    }

    const userRes = await db.collection(COLLECTIONS.USERS).findOneAndUpdate(
      { email: googleUser.email },
      updateDoc,
      { upsert: true, returnDocument: "after" }
    );

    const user = userRes._id ? userRes : (userRes.value || userRes);
    const userId = user._id;

    // 4. Check if user already owns a business
    const business = await db.collection(COLLECTIONS.BUSINESSES).findOne({ ownerId: userId });

    // 5. Generate secure session token & set HttpOnly cookie
    const tokenPayload = {
      userId: String(userId),
      email: user.email,
      role: user.role,
      name: user.name
    };

    const sessionToken = signSessionToken(tokenPayload);
    setSessionCookie(res, sessionToken);

    if (isFormRedirect) {
      res.writeHead(302, { Location: "/" });
      return res.end();
    }

    return res.status(200).json({
      success: true,
      user: {
        id: String(userId),
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
        isPublished: business.isPublished
      } : null
    });
  } catch (error) {
    console.error("[Auth /google] Server error:", error);
    return res.status(500).json({
      success: false,
      error: "An internal server error occurred during authentication."
    });
  }
};
