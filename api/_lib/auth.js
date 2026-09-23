const jwt = require("jsonwebtoken");
const cookie = require("cookie");
const { USER_ROLES } = require("./models");

const SESSION_COOKIE_NAME = "menucard_session";
const JWT_SECRET = process.env.JWT_SECRET || "menucard-dev-jwt-secret-do-not-use-in-production";

/**
 * Creates a signed JWT session token
 */
function signSessionToken(payload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });
}

/**
 * Verifies a JWT session token
 */
function verifySessionToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (err) {
    return null;
  }
}

/**
 * Extracts session user from request cookies
 */
function getSessionUser(req) {
  const cookieHeader = req.headers.cookie || "";
  const cookies = cookie.parse(cookieHeader);
  const token = cookies[SESSION_COOKIE_NAME];

  if (!token) return null;
  return verifySessionToken(token);
}

/**
 * Sets secure session cookie on response
 */
function setSessionCookie(res, token) {
  const isProd = process.env.NODE_ENV === "production";
  const cookieStr = cookie.serialize(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: isProd,
    sameSite: "lax",
    path: "/",
    maxAge: 7 * 24 * 60 * 60 // 7 days
  });

  res.setHeader("Set-Cookie", cookieStr);
}

/**
 * Clears session cookie on logout
 */
function clearSessionCookie(res) {
  const isProd = process.env.NODE_ENV === "production";
  const cookieStr = cookie.serialize(SESSION_COOKIE_NAME, "", {
    httpOnly: true,
    secure: isProd,
    sameSite: "lax",
    path: "/",
    maxAge: 0
  });

  res.setHeader("Set-Cookie", cookieStr);
}

/**
 * Serverless authentication guard: requires valid session
 */
function requireAuth(req, res) {
  const sessionUser = getSessionUser(req);
  if (!sessionUser) {
    res.status(401).json({
      success: false,
      error: "Authentication required. Please sign in."
    });
    return null;
  }
  return sessionUser;
}

/**
 * Serverless role guard: requires specific role(s)
 */
function requireRole(req, res, allowedRoles = []) {
  const user = requireAuth(req, res);
  if (!user) return null;

  const roles = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];
  if (!roles.includes(user.role)) {
    res.status(403).json({
      success: false,
      error: "Forbidden. You do not have permission to access this resource."
    });
    return null;
  }

  return user;
}

module.exports = {
  SESSION_COOKIE_NAME,
  signSessionToken,
  verifySessionToken,
  getSessionUser,
  setSessionCookie,
  clearSessionCookie,
  requireAuth,
  requireRole,
  USER_ROLES
};
