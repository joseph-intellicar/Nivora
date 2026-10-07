// Browser-like environment for running the HTTP adapters in Node: NEXT_PUBLIC_DATA_SOURCE=http,
// same-origin "/api/..." requests sent to the Next.js server (FRONTEND, default :3100) through its
// /api proxy, a cookie jar (session + guest cart cookies) and the browser's Origin header.
process.env.NEXT_PUBLIC_DATA_SOURCE = "http";
const FRONTEND = process.env.FRONTEND ?? "http://localhost:3100";
export const jar = new Map();
globalThis.window = { localStorage: { getItem: () => null, setItem() {}, removeItem() {}, clear() {} } };
const realFetch = globalThis.fetch;
globalThis.fetch = async (input, init = {}) => {
  const url = typeof input === "string" && input.startsWith("/") ? FRONTEND + input : input;
  const headers = new Headers(init.headers);
  if (jar.size) headers.set("Cookie", [...jar].map(([k, v]) => `${k}=${v}`).join("; "));
  if (init.method && init.method !== "GET") headers.set("Origin", FRONTEND);
  const res = await realFetch(url, { ...init, headers });
  for (const line of res.headers.getSetCookie()) {
    const [pair, ...attrs] = line.split(";");
    const [name, ...rest] = pair.split("=");
    const value = rest.join("=");
    const expired = !value || attrs.some((a) => /expires=thu, 01 jan 1970/i.test(a.trim()) || /^max-age=0$/i.test(a.trim()));
    if (expired) jar.delete(name.trim());
    else jar.set(name.trim(), value);
  }
  return res;
};
