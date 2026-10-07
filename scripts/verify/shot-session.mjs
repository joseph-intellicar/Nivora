// Screenshot pages as a logged-in customer (or a guest with a cart): logs in through the API,
// optionally prepares state, then drives headless Chrome over the DevTools protocol with the
// session cookie. Usage: node shot-session.mjs <outDir> <width> <height> <path>...
// Env: FRONTEND (default http://localhost:3100), LOGIN=0 to stay a guest, PREP=cart to add items.
import { spawn } from "node:child_process";
import { mkdirSync, writeFileSync } from "node:fs";
const [outDir, width, height, ...pages] = process.argv.slice(2);
const FRONTEND = process.env.FRONTEND ?? "http://localhost:3100";
const cookies = new Map();
async function call(path, method = "GET", body) {
  const res = await fetch(FRONTEND + path, {
    method,
    headers: { "Content-Type": "application/json", Origin: FRONTEND, Cookie: [...cookies].map(([k, v]) => `${k}=${v}`).join("; ") },
    body: body ? JSON.stringify(body) : undefined,
  });
  for (const line of res.headers.getSetCookie()) {
    const [pair] = line.split(";"); const [k, ...v] = pair.split("="); if (v.join("=")) cookies.set(k, v.join("="));
  }
  return res.status === 204 ? null : res.json();
}
if (process.env.LOGIN !== "0") await call("/api/auth/login", "POST", { email: "joseph@example.com", password: "password123" });
if (process.env.PREP === "cart") {
  await call("/api/cart/items", "POST", { variantId: "urbano-classic-oxford-shirt-sky-blue-m", quantity: 2 });
  await call("/api/cart/items", "POST", { variantId: "northline-pique-polo-t-shirt-black-l", quantity: 1 });
  if (process.env.LOGIN !== "0") await call("/api/checkout/cart", "POST");
}
mkdirSync(outDir, { recursive: true });
const chrome = spawn("google-chrome", ["--headless=new", "--disable-gpu", "--hide-scrollbars", "--no-first-run", "--remote-debugging-port=9333", `--user-data-dir=${outDir}/.chrome`, `--window-size=${width},${height}`, "about:blank"], { stdio: "ignore" });
let target;
for (let i = 0; i < 50 && !target; i++) {
  await new Promise((r) => setTimeout(r, 200));
  target = await fetch("http://127.0.0.1:9333/json").then((r) => r.json()).then((t) => t.find((x) => x.type === "page")).catch(() => undefined);
}
const ws = new WebSocket(target.webSocketDebuggerUrl);
await new Promise((r) => ws.addEventListener("open", r, { once: true }));
let id = 0; const pending = new Map(); const events = [];
ws.addEventListener("message", (e) => { const m = JSON.parse(e.data); if (m.id && pending.has(m.id)) { pending.get(m.id)(m.result); pending.delete(m.id); } else events.push(m.method); });
const send = (method, params = {}) => new Promise((r) => { pending.set(++id, r); ws.send(JSON.stringify({ id, method, params })); });
await send("Page.enable"); await send("Network.enable");
await send("Emulation.setDeviceMetricsOverride", { width: Number(width), height: Number(height), deviceScaleFactor: 1, mobile: Number(width) < 600 });
for (const [name, value] of cookies) await send("Network.setCookie", { name, value, url: FRONTEND, httpOnly: true });
for (const path of pages) {
  events.length = 0;
  await send("Page.navigate", { url: FRONTEND + path });
  for (let i = 0; i < 100 && !events.includes("Page.loadEventFired"); i++) await new Promise((r) => setTimeout(r, 100));
  await new Promise((r) => setTimeout(r, 3500)); // client islands fetch from the API (~1–2 s from India)
  const { data } = await send("Page.captureScreenshot", { format: "png" });
  const file = `${outDir}/${path.replace(/[^a-z0-9]+/gi, "_").replace(/^_|_$/g, "") || "home"}-${width}.png`;
  writeFileSync(file, Buffer.from(data, "base64")); console.log("saved", file);
}
ws.close(); chrome.kill();
