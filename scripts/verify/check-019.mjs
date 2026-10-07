const { catalog, content, collections } = await import("@/api/server");
const { PRODUCTS } = await import("@nivora/shared/data/products");
let fail = 0; const ok = (c, m) => { console.log((c ? "PASS " : "FAIL ") + m); if (!c) fail++; };
const base = { sort: "relevance", page: 1 };
const cats = await catalog.getCategories(); cats[0].name = "MUTATED";
ok((await catalog.getCategories())[0].name === "Fashion", "getCategories returns copies (callers can't mutate the taxonomy)");
const fashion = await catalog.listProducts({ ...base, categoryId: "fashion" });
ok(fashion.total === 34 && fashion.items.length === 24 && fashion.pageCount === 2 && fashion.pageSize === 24, `category: fashion total ${fashion.total}, page of 24, ${fashion.pageCount} pages`);
const men = await catalog.listProducts({ ...base, categoryId: "fashion", subcategoryIds: ["fashion-men"] });
ok(men.total === PRODUCTS.filter(p => p.subcategoryId === "fashion-men").length && men.facets.subcategories.length === 5, `subcategory: men ${men.total}; subcategory facet still lists all 5`);
const bp = await catalog.listProducts({ ...base, categoryId: "mobiles", brands: ["Samsung"], priceMax: 30000 });
ok(bp.total > 0 && bp.items.every(p => p.brand === "Samsung" && p.price <= 30000), `brand + price filter: ${bp.items.map(p => p.name).join(", ")}`);
const phone = await catalog.listProducts({ ...base, q: "phone" });
ok(phone.total > 0 && phone.facets.categories.some(c => c.value === "mobiles"), `q=phone: ${phone.total} results across ${phone.facets.categories.length} categories`);
for (const id of ["best-sellers", "special-offers", "new-arrivals"]) {
  const items = await catalog.getCollection(id, 10); const meta = collections.getMeta(id);
  const rule = { "best-sellers": p => p.isBestSeller, "special-offers": p => p.discountPercent > 0, "new-arrivals": p => p.isNewArrival }[id];
  ok(items.length === 10 && items.every(rule) && meta?.name, `collection ${id}: 10 items, all match "${meta?.name}"`);
}
const na = await catalog.getCollection("new-arrivals", 50);
ok(na.every((p, i) => i === 0 || na[i-1].createdAt >= p.createdAt), "new arrivals sorted newest first");
const so = await catalog.getCollection("special-offers", 50);
ok(so.every((p, i) => i === 0 || so[i-1].discountPercent >= p.discountPercent), "special offers sorted by discount");
ok((await catalog.getProduct("apple-iphone-15"))?.name === "Apple iPhone 15" && (await catalog.getProduct("does-not-exist")) === null, "getProduct: known slug → product, unknown → null");
ok((await catalog.getAllProductSlugs()).length === 154, "getAllProductSlugs: 154");
ok((await content.getInfoPage("about"))?.title === "About Nivora" && (await content.getInfoPage("nope")) === null, "getInfoPage: known → page, unknown → null");
const t0 = performance.now(); for (let i = 0; i < 50; i++) await catalog.listProducts({ ...base, q: "black" }); const ms = (performance.now() - t0) / 50;
ok(ms < 50, `listProducts with search averages ${ms.toFixed(1)} ms (no artificial latency)`);
console.log(fail ? `${fail} FAILED` : "ALL PASS");
