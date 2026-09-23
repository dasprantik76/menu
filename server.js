require("dotenv").config();
const http = require("http");
const fs = require("fs");
const path = require("path");
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

  // 2. Multi-Tenant Restaurant Route (/r/:slug or /menu)
  if (pathname.startsWith("/r/") || pathname === "/menu" || pathname === "/menu.html") {
    if (pathname.startsWith("/r/")) {
      const slug = pathname.replace(/^\/r\//, "").split("/")[0];
      req.query.restaurant = slug;
    }
    const menuPath = path.join(__dirname, "menu.html");
    const content = fs.readFileSync(menuPath, "utf8");
    res.setHeader("Content-Type", "text/html");
    res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
    return res.end(content);
  }

  // 2b. Owner Portal URL Canonicalization (/owner -> /)
  if (pathname === "/owner" || pathname === "/owner/") {
    const search = parsedUrl.search || "";
    res.writeHead(302, { Location: "/" + search });
    return res.end();
  }

  // 3. Static Files
  let filePath = path.join(__dirname, pathname === "/" ? "index.html" : pathname);

  // If path is a directory, look for index.html
  if (fs.existsSync(filePath) && fs.statSync(filePath).isDirectory()) {
    filePath = path.join(filePath, "index.html");
  }

  if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || "application/octet-stream";
    res.setHeader("Content-Type", contentType);
    res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
    return fs.createReadStream(filePath).pipe(res);
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
