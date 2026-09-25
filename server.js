const fs = require("fs");
const path = require("path");

if (fs.existsSync(path.join(__dirname, ".env.local"))) {
  require("dotenv").config({ path: path.join(__dirname, ".env.local") });
}
require("dotenv").config();

const http = require("http");
const url = require("url");

const PORT = process.env.PORT || 3000;

const MIME_TYPES = {
  ".html": "text/html",
  ".css": "text/css",
  ".js": "application/javascript",
  ".json": "application/json",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
  ".webp": "image/webp"
};

// Polyfill Vercel serverless response helpers for local dev
function enhanceResponse(res) {
  res.status = function (statusCode) {
    res.statusCode = statusCode;
    return res;
  };
  res.json = function (data) {
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify(data));
    return res;
  };
}

const server = http.createServer(async (req, res) => {
  enhanceResponse(res);
  const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname;
  req.query = parsedUrl.query;

  // 1. API Route Dispatcher (/api/*)
  if (pathname.startsWith("/api/")) {
    require("dotenv").config({ override: true });
    const apiPath = path.join(__dirname, pathname + ".js");
    if (fs.existsSync(apiPath)) {
      try {
        if (req.method === "POST" || req.method === "PATCH" || req.method === "PUT" || req.method === "DELETE") {
          let rawBody = "";
          for await (const chunk of req) {
            rawBody += chunk;
          }
          if (rawBody) {
            try {
              req.body = JSON.parse(rawBody);
            } catch (e) {
              req.body = rawBody;
            }
          }
        }
        Object.keys(require.cache).forEach(k => {
          if (k.includes("/api/")) delete require.cache[k];
        });
        const handler = require(apiPath);
        return await handler(req, res);
      } catch (err) {
        console.error(`[API Error] ${pathname}:`, err);
        return res.status(500).json({ success: false, error: err.message });
      }
    } else {
      return res.status(404).json({ success: false, error: `API route '${pathname}' not found.` });
    }
  }

  // 2. Explicit Root / Login Route (/ or /index.html)
  if (pathname === "/" || pathname === "/index.html") {
    const indexPath = path.join(__dirname, "index.html");
    const cwdIndexPath = path.join(process.cwd(), "index.html");
    const target = fs.existsSync(indexPath) ? indexPath : (fs.existsSync(cwdIndexPath) ? cwdIndexPath : null);
    if (target) {
      const content = fs.readFileSync(target, "utf8");
      res.setHeader("Content-Type", "text/html; charset=utf-8");
      res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
      return res.end(content);
    }
  }

  // 2b. Multi-Tenant Restaurant Route (/r/:slug or /menu)
  if (pathname.startsWith("/r/") || pathname === "/menu" || pathname === "/menu.html") {
    if (pathname.startsWith("/r/")) {
      const slug = pathname.replace(/^\/r\//, "").split("/")[0];
      req.query.restaurant = slug;
    }
    const menuPath = path.join(__dirname, "menu.html");
    const cwdMenuPath = path.join(process.cwd(), "menu.html");
    const target = fs.existsSync(menuPath) ? menuPath : (fs.existsSync(cwdMenuPath) ? cwdMenuPath : null);
    if (target) {
      const content = fs.readFileSync(target, "utf8");
      res.setHeader("Content-Type", "text/html; charset=utf-8");
      res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
      return res.end(content);
    }
  }

  // 2c. Owner Portal URL Canonicalization (/owner -> /)
  if (pathname === "/owner" || pathname === "/owner/") {
    const search = parsedUrl.search || "";
    res.writeHead(302, { Location: "/" + search });
    return res.end();
  }

  // 2d. Admin Route (/admin or /admin/)
  if (pathname === "/admin" || pathname === "/admin/" || pathname === "/admin/index.html") {
    const adminPath = path.join(__dirname, "admin/index.html");
    const cwdAdminPath = path.join(process.cwd(), "admin/index.html");
    const target = fs.existsSync(adminPath) ? adminPath : (fs.existsSync(cwdAdminPath) ? cwdAdminPath : null);
    if (target) {
      const content = fs.readFileSync(target, "utf8");
      res.setHeader("Content-Type", "text/html; charset=utf-8");
      res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
      return res.end(content);
    }
  }

  // 3. Static Files with multi-path resolution
  const relPath = pathname.startsWith("/") ? pathname.slice(1) : pathname;
  const candidates = [
    path.join(__dirname, relPath),
    path.join(process.cwd(), relPath)
  ];

  for (let candidate of candidates) {
    if (fs.existsSync(candidate)) {
      if (fs.statSync(candidate).isDirectory()) {
        const subIndex = path.join(candidate, "index.html");
        if (fs.existsSync(subIndex) && fs.statSync(subIndex).isFile()) {
          candidate = subIndex;
        } else {
          continue;
        }
      }
      if (fs.statSync(candidate).isFile()) {
        const ext = path.extname(candidate).toLowerCase();
        const contentType = MIME_TYPES[ext] || "application/octet-stream";
        res.setHeader("Content-Type", contentType);
        res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
        return fs.createReadStream(candidate).pipe(res);
      }
    }
  }

  // Fallback 404
  res.status(404).setHeader("Content-Type", "text/html");
  res.end(`<h1>404 - Not Found</h1><p>The path <code>${pathname}</code> was not found.</p>`);
});

server.listen(PORT, () => {
  console.log(`🚀 Menu by PixelSetu running on http://localhost:${PORT}`);
  console.log(`- Public Customer Menu: http://localhost:${PORT}/r/royal-food-corner`);
  console.log(`- Public API:          http://localhost:${PORT}/api/public/menu?slug=royal-food-corner`);
});
