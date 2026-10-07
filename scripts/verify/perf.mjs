// p50/p95 latency of the main API endpoints (P2-037). Talks to the API directly.
// Usage: node perf.mjs [n=100]   (API at API=http://localhost:4100, seeded nivora_test)
const API = (process.env.API ?? "http://localhost:4100") + "/api/v1";
const ORIGIN = process.env.ORIGIN ?? "http://localhost:3100";
const N = Number(process.argv[2] ?? 100);
let cookie = "";
async function call(path, method = "GET", body, headers = {}) {
  const res = await fetch(API + path, {
    method,
    headers: { "Content-Type": "application/json", Origin: ORIGIN, Cookie: cookie, ...headers },
    body: body ? JSON.stringify(body) : undefined,
  });
  for (const line of res.headers.getSetCookie()) {
    const [pair] = line.split(";");
    if (pair.startsWith("nivora_session=")) cookie = pair;
  }
  if (!res.ok && res.status !== 404) throw new Error(`${method} ${path} → ${res.status} ${await res.text()}`);
  return res.status === 204 ? null : res.json();
}
const pct = (sorted, p) => sorted[Math.min(sorted.length - 1, Math.ceil((p / 100) * sorted.length) - 1)];
async function measure(name, count, fn) {
  const times = [];
  for (let i = 0; i < count; i++) {
    const start = performance.now();
    await fn(i);
    times.push(performance.now() - start);
  }
  times.sort((a, b) => a - b);
  console.log(`${name.padEnd(26)} n=${String(count).padEnd(4)} p50 ${pct(times, 50).toFixed(0).padStart(5)} ms   p95 ${pct(times, 95).toFixed(0).padStart(5)} ms   max ${times.at(-1).toFixed(0).padStart(5)} ms`);
}
await call("/auth/login", "POST", { email: "joseph@example.com", password: "password123" });
const address = await call("/addresses", "POST", { fullName: "Perf", phone: "9876543210", line1: "1", city: "Bengaluru", state: "Karnataka", postalCode: "560038", country: "India" });
const queries = ["in_category=fashion&sort=relevance", "q=phone", "in_category=mobiles&brand=Samsung,Apple&sort=price-asc", "in_collection=best-sellers&sort=relevance"];
const slugs = ["apple-iphone-15", "urbano-classic-oxford-shirt", "samsung-galaxy-s24-ultra", "saanjh-printed-kaftan"];
await measure("GET /health", N, () => call("/health"));
await measure("GET /products (listing)", N, (i) => call(`/products?${queries[i % queries.length]}`));
await measure("GET /products/:slug", N, (i) => call(`/products/${slugs[i % slugs.length]}`));
await measure("GET /auth/session", N, () => call("/auth/session"));
await measure("GET /cart", N, () => call("/cart"));
await measure("POST /cart/items", Math.min(N, 40), () => call("/cart/items", "POST", { variantId: "kesh-ayur-onion-hair-oil", quantity: 1 }));
await call("/cart/items/kesh-ayur-onion-hair-oil", "DELETE");
await call("/checkout/buy-now", "POST", { variantId: "kesh-ayur-onion-hair-oil", quantity: 1 });
await measure("GET /checkout", Math.min(N, 40), () => call("/checkout?deliveryOption=standard"));
await measure("POST /orders (Buy Now)", Math.min(N, 20), async (i) => {
  await call("/checkout/buy-now", "POST", { variantId: "kesh-ayur-onion-hair-oil", quantity: 1 });
  const start = performance.now();
  await call("/orders", "POST", { addressId: address.id, deliveryOption: "standard" }, { "Idempotency-Key": `perf-${Date.now()}-${i}` });
  return performance.now() - start;
});
await measure("GET /orders", Math.min(N, 40), () => call("/orders"));
