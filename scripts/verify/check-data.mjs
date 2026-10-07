// Data-quality checks for mock products (TASK-014/015). Usage: node check-data.mjs <moduleSpecifier:EXPORT>...
const { CATEGORIES } = await import("@nivora/shared/data/categories");
let products = [];
for (const arg of process.argv.slice(2)) { const [mod, name] = arg.split(":"); products.push(...(await import(mod))[name]); }
let fail = 0; const ok = (c, m) => { console.log((c ? "PASS " : "FAIL ") + m); if (!c) fail++; };
const subs = new Map(CATEGORIES.flatMap(c => c.subcategories.map(s => [s.id, s])));
const cats = new Set(products.map(p => p.categoryId));
for (const c of CATEGORIES.filter(c => cats.has(c.id))) for (const s of c.subcategories) {
  const n = products.filter(p => p.subcategoryId === s.id).length; ok(n >= 6, `${s.id}: ${n} products (≥6)`);
}
const uniq = (arr, label) => { const d = arr.filter((x, i) => arr.indexOf(x) !== i); ok(d.length === 0, `${label} unique${d.length ? " — dupes: " + d.slice(0,3) : ""}`); };
uniq(products.map(p => p.id), "product ids"); uniq(products.map(p => p.slug), "slugs");
uniq(products.flatMap(p => p.variants.map(v => v.id)), "variant ids");
ok(products.every(p => subs.get(p.subcategoryId)?.categoryId === p.categoryId), "every product's subcategory belongs to its category");
ok(products.every(p => p.variants.length >= 1), "every product has ≥1 variant");
ok(products.every(p => p.variants.every(v => Number.isInteger(v.price) && v.price > 0 && v.price <= v.originalPrice)), "all variants: integer price > 0 and ≤ original price");
ok(products.every(p => p.variants.every(v => Number.isInteger(v.initialStock) && v.initialStock >= 0)), "stock is a non-negative integer");
ok(products.every(p => p.variants.every(v => p.options.every(o => o.values.includes(v.optionValues[o.name])) && Object.keys(v.optionValues).length === p.options.length)), "every variant has exactly one valid value per option");
ok(products.every(p => p.images.length >= 1 && p.images.every(u => /^https:\/\/images\.unsplash\.com\/photo-[0-9]+-[0-9a-f]+\?/.test(u))), "all images use the images.unsplash.com host");
ok(products.every(p => p.rating >= 1 && p.rating <= 5 && Number.isInteger(p.reviewCount)), "ratings in 1–5, integer review counts");
ok(products.every(p => p.description.length > 40 && p.specifications.length >= 2 && p.tags.length >= 1), "descriptions, ≥2 specs and tags present");
const inStock = v => v.initialStock > 0;
const fullyOOS = products.filter(p => p.variants.every(v => !inStock(v)));
const partialOOS = products.filter(p => p.variants.some(inStock) && p.variants.some(v => !inStock(v)));
const low = products.filter(p => p.variants.some(v => v.initialStock >= 1 && v.initialStock <= 3));
const disc = products.map(p => Math.round((1 - p.variants[0].price / p.variants[0].originalPrice) * 100));
ok(fullyOOS.length >= 1, `fully out-of-stock products: ${fullyOOS.length} (${fullyOOS.map(p=>p.name).join(", ")})`);
ok(partialOOS.length >= 1, `products with some out-of-stock variants: ${partialOOS.length}`);
ok(low.length >= 1, `products with low-stock (1–3) variants: ${low.length}`);
ok(disc.some(d => d === 0) && disc.some(d => d > 0 && d < 20) && disc.some(d => d >= 40), `discount spread incl. none: min ${Math.min(...disc)}%, max ${Math.max(...disc)}%`);
ok(products.some(p => p.variants.some(v => v.price <= 999)) && products.some(p => p.variants.some(v => v.price >= 20000)), "has products ≤ ₹999 and premium ≥ ₹20,000");
ok(products.some(p => p.isBestSeller) && products.some(p => p.isNewArrival), `best sellers: ${products.filter(p=>p.isBestSeller).length}, new arrivals: ${products.filter(p=>p.isNewArrival).length}`);
ok(products.some(p => p.variants.length > 1 && new Set(p.variants.map(v=>v.price)).size > 1), "some products have per-variant prices");
ok(products.some(p => p.options.length === 0), "some products have no options");
for (const c of CATEGORIES.filter(c => cats.has(c.id))) { const bs = products.filter(p => p.categoryId === c.id); ok(new Set(bs.map(p=>p.brand)).size >= 4, `${c.name}: ${new Set(bs.map(p=>p.brand)).size} brands`); }
console.log(`${products.length} products, ${products.reduce((n,p)=>n+p.variants.length,0)} variants — ${fail ? fail + " FAILED" : "ALL PASS"}`);
