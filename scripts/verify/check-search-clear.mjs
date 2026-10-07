// Header search clearing (real browser, DevTools protocol): leaving the results page when the search
// is cleared (× button, Escape, empty submit), but not while backspacing. Needs a server on :3100.
import { spawn } from "node:child_process";
const BASE = process.env.FRONTEND ?? "http://localhost:3100";
const chrome = spawn("google-chrome", ["--headless=new", "--disable-gpu", "--no-first-run", "--remote-debugging-port=9334", `--user-data-dir=${new URL(".out/chrome-search", import.meta.url).pathname}`, "--window-size=1280,900", "about:blank"], { stdio: "ignore" });
let target;
for (let i = 0; i < 50 && !target; i++) {
  await new Promise((r) => setTimeout(r, 200));
  target = await fetch("http://127.0.0.1:9334/json").then((r) => r.json()).then((t) => t.find((x) => x.type === "page")).catch(() => undefined);
}
const ws = new WebSocket(target.webSocketDebuggerUrl);
await new Promise((r) => ws.addEventListener("open", r, { once: true }));
let id = 0; const pending = new Map();
ws.addEventListener("message", (e) => { const m = JSON.parse(e.data); if (m.id && pending.has(m.id)) { pending.get(m.id)(m.result); pending.delete(m.id); } });
const send = (method, params = {}) => new Promise((r) => { pending.set(++id, r); ws.send(JSON.stringify({ id, method, params })); });
const evaluate = async (expression) => (await send("Runtime.evaluate", { expression, awaitPromise: true, returnByValue: true })).result.value;
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const until = async (expression, ms = 8000) => { for (let t = 0; t < ms; t += 100) { if (await evaluate(expression)) return true; await sleep(100); } return false; };
const key = async (k, code = k, keyCode = 0) => {
  const text = k === "Enter" ? "\r" : undefined;
  await send("Input.dispatchKeyEvent", { type: "keyDown", key: k, code, windowsVirtualKeyCode: keyCode, ...(text ? { text } : {}) });
  await send("Input.dispatchKeyEvent", { type: "keyUp", key: k, code, windowsVirtualKeyCode: keyCode });
};
const type = async (text) => { for (const ch of text) await send("Input.insertText", { text: ch }); };
const BOX = `document.getElementById("header-search-desktop")`;
let fail = 0; const ok = (c, m) => { console.log((c ? "PASS " : "FAIL ") + m); if (!c) fail++; };
await send("Page.enable"); await send("Runtime.enable");
async function openResults(q) {
  await send("Page.navigate", { url: `${BASE}/search?q=${q}` });
  await until(`document.querySelector("h1")?.textContent.includes("Results for")`);
  await until(`${BOX}?.value === ${JSON.stringify(q)}`);
  // Like a click at the end of the text: focus with the caret after the query.
  await evaluate(`(() => { const b = ${BOX}; b.focus(); b.setSelectionRange(b.value.length, b.value.length); })()`);
}
const path = () => evaluate("location.pathname + location.search");

await openResults("phone");
ok((await path()) === "/search?q=phone" && (await evaluate(`!!document.querySelector('[aria-label="Clear search"]')`)), "results page shows the query and a × clear button");
await evaluate(`document.querySelector('[aria-label="Clear search"]').click()`);
ok(await until(`location.pathname === "/"`), `× clears the search and leaves the results page (now ${await path()})`);
ok((await evaluate(`${BOX}.value`)) === "" && !(await evaluate(`!!document.querySelector('[aria-label="Clear search"]')`)), "box empty, × hidden");

await openResults("shoes");
await key("Escape", "Escape", 27);
ok(await until(`location.pathname === "/"`), `Escape clears the search and leaves the results page (now ${await path()})`);

await openResults("mixer");
for (let i = 0; i < 5; i++) await key("Backspace", "Backspace", 8);
await sleep(800);
console.log(`     box after 5× Backspace: "${await evaluate(`${BOX}.value`)}"`);
ok((await path()) === "/search?q=mixer" && (await evaluate(`${BOX}.value`)) === "", "backspacing to empty does not navigate (customer may type a new search)");
await type("kettle"); await key("Enter", "Enter", 13);
ok(await until(`location.search === "?q=kettle"`), `typing a new term and Enter searches for it (now ${await path()})`);
for (let i = 0; i < 6; i++) await key("Backspace", "Backspace", 8);
await key("Enter", "Enter", 13);
ok(await until(`location.pathname === "/"`), `submitting an empty box leaves the results page (now ${await path()})`);

await send("Page.navigate", { url: `${BASE}/c/fashion` });
await until(`!!${BOX}`); await evaluate(`${BOX}.focus()`); await type("abc");
await evaluate(`document.querySelector('[aria-label="Clear search"]').click()`);
await sleep(600);
ok((await path()) === "/c/fashion" && (await evaluate(`${BOX}.value`)) === "", "on other pages × just empties the box (no navigation)");

console.log(fail ? `${fail} FAILED` : "ALL PASS");
ws.close(); chrome.kill();
process.exit(fail ? 1 : 0);
