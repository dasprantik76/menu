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

async function captureOne(width, height, cookieVal, clickSelector, outputPath) {
  const chromePath = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
  const userDir = "/tmp/chrome_snap_" + Date.now();
  const port = 9300 + Math.floor(Math.random() * 500);

  const chromeProc = spawn(chromePath, [
    "--headless",
    `--remote-debugging-port=${port}`,
    `--user-data-dir=${userDir}`,
    "--disable-gpu",
    `--window-size=${width},${height}`,
    "about:blank"
  ]);

  await sleep(1500);

  try {
    const list = await getJson(`http://127.0.0.1:${port}/json`);
    const wsUrl = list[0].webSocketDebuggerUrl;

    await new Promise((resolve, reject) => {
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

          if (cookieVal) {
            await send("Network.setCookie", {
              name: "menucard_session",
              value: cookieVal,
              domain: "localhost",
              path: "/"
            });
          }

          await send("Page.navigate", { url: "http://localhost:3000/owner/" });
          await sleep(1500);

          if (clickSelector) {
            await send("Runtime.evaluate", {
              expression: `document.querySelector('${clickSelector}')?.click()`
            });
            await sleep(800);
          }

          const result = await send("Page.captureScreenshot", { format: "png" });
          fs.writeFileSync(outputPath, Buffer.from(result.data, "base64"));
          console.log(`Saved screenshot: ${outputPath}`);
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
  } finally {
    chromeProc.kill();
  }
}

(async () => {
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

  const token = await loginAndGetCookie("owner@spicyhut.com", "Spicy Owner");
  const artifactDir = "/Users/pratikdas/.gemini/antigravity-ide/brain/fe467dab-8c87-412a-aa19-bb770b0f86eb";

  // Mobile Menu
  await captureOne(390, 844, token, "#capsuleMenuBtn", path.join(artifactDir, "mobile_capsule_menu_view.png"));

  // Mobile Category
  await captureOne(390, 844, token, "#capsuleCategoryBtn", path.join(artifactDir, "mobile_capsule_category_view.png"));

  console.log("All done!");
})();
