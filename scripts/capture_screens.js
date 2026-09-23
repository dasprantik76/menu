const { spawn } = require("child_process");
const http = require("http");
const fs = require("fs");
const path = require("path");

function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}

function getJson(url) {
  return new Promise((resolve, reject) => {
    http.get(url, res => {
      let data = "";
      res.on("data", chunk => data += chunk);
      res.on("end", () => resolve(JSON.parse(data)));
    }).on("error", reject);
  });
}

async function captureWithCDP(wsUrl, cookieVal, targetUrl, outputPath, tabClickSelector = null) {
  return new Promise((resolve, reject) => {
    const ws = new WebSocket(wsUrl);
    let id = 1;
    const callbacks = new Map();

    function send(method, params = {}) {
      const msgId = id++;
      return new Promise((res, rej) => {
        callbacks.set(msgId, { resolve: res, reject: rej });
        ws.send(JSON.stringify({ id: msgId, method, params }));
      });
    }

    ws.onopen = async () => {
      try {
        await send("Page.enable");
        await send("Network.enable");
        await send("Runtime.enable");

        // Set session cookie
        if (cookieVal) {
          await send("Network.setCookie", {
            name: "menucard_session",
            value: cookieVal,
            domain: "localhost",
            path: "/"
          });
        }

        // Navigate
        await send("Page.navigate", { url: targetUrl });
        await sleep(2000);

        if (tabClickSelector) {
          await send("Runtime.evaluate", {
            expression: `document.querySelector('${tabClickSelector}')?.click()`
          });
          await sleep(1000);
        }

        // Capture screenshot
        const result = await send("Page.captureScreenshot", { format: "png" });
        fs.writeFileSync(outputPath, Buffer.from(result.data, "base64"));
        console.log(`Saved screenshot to: ${outputPath}`);
        ws.close();
        resolve();
      } catch (e) {
        ws.close();
        reject(e);
      }
    };

    ws.onmessage = (event) => {
      const msg = JSON.parse(event.data);
      if (msg.id && callbacks.has(msg.id)) {
        const { resolve, reject } = callbacks.get(msg.id);
        callbacks.delete(msg.id);
        if (msg.error) reject(new Error(msg.error.message));
        else resolve(msg.result);
      }
    };

    ws.onerror = reject;
  });
}

(async () => {
  const chromePath = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
  const userDir = "/tmp/chrome_test_profile_" + Date.now();

  const chromeProc = spawn(chromePath, [
    "--headless",
    "--remote-debugging-port=9222",
    `--user-data-dir=${userDir}`,
    "--disable-gpu",
    "--window-size=1280,960",
    "about:blank"
  ]);

  await sleep(1500);

  try {
    const list = await getJson("http://127.0.0.1:9222/json");
    const page = list[0];
    const wsUrl = page.webSocketDebuggerUrl;

    // 1. Get Owner & Admin Cookies via live API login
    async function loginAndGetCookie(email, name) {
      return new Promise((resolve, reject) => {
        const data = JSON.stringify({ devEmail: email, devName: name });
        const req = http.request({
          hostname: "localhost",
          port: 3000,
          path: "/api/auth/google",
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Content-Length": Buffer.byteLength(data)
          }
        }, (res) => {
          const cookieHeader = res.headers["set-cookie"] || [];
          const sessionMatch = cookieHeader[0]?.match(/menucard_session=([^;]+)/);
          resolve(sessionMatch ? sessionMatch[1] : "");
        });
        req.on("error", reject);
        req.write(data);
        req.end();
      });
    }

    const ownerToken = await loginAndGetCookie("owner@spicyhut.com", "Spicy Owner");
    const adminToken = await loginAndGetCookie("admin@yourdomain.com", "Super Admin");

    const artifactDir = "/Users/pratikdas/.gemini/antigravity-ide/brain/fe467dab-8c87-412a-aa19-bb770b0f86eb";

    // Screenshot 1: Owner Dashboard
    await captureWithCDP(wsUrl, ownerToken, "http://localhost:3000/owner/", path.join(artifactDir, "owner_dashboard.png"));

    // Screenshot 2: Admin Dashboard (Pending Applications)
    await captureWithCDP(wsUrl, adminToken, "http://localhost:3000/admin/", path.join(artifactDir, "admin_dashboard.png"));

    // Screenshot 3: Admin Dashboard (All Restaurants)
    await captureWithCDP(wsUrl, adminToken, "http://localhost:3000/admin/", path.join(artifactDir, "admin_all_restaurants.png"), "button[data-tab='all']");

    console.log("All screenshots captured successfully!");
  } finally {
    chromeProc.kill();
  }
})();
