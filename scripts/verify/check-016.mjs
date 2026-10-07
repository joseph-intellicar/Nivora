const { PRODUCTS } = await import("@nivora/shared/data/products");
const { CATEGORIES } = await import("@nivora/shared/data/categories");
const pricing = await import("@nivora/shared/domain/pricing");
const stock = await import("@nivora/shared/domain/stock");
const { createTaxonomy, toProductSummary, findVariant } = await import("@nivora/shared/domain/catalog");
const { queryCatalog, filterValues } = await import("@nivora/shared/domain/filters");
const { scoreProduct, tokenize } = await import("@nivora/shared/domain/search");
const tax = createTaxonomy(CATEGORIES);
let fail = 0; const ok = (c, m) => { console.log((c ? "PASS " : "FAIL ") + m); if (!c) fail++; };
const q = (over) => queryCatalog(PRODUCTS, { sort: "relevance", page: 1, ...over }, tax, 1000);
// delivery
ok(pricing.deliveryCharge(498, "standard") === 40 && pricing.deliveryCharge(499, "standard") === 0 && pricing.deliveryCharge(5000, "express") === 99 && pricing.deliveryCharge(0, "standard", 0) === 0, "delivery: ₹498→₹40, ₹499→free, express→₹99, empty→₹0");
const s = pricing.summarize([{ unitPrice: 799, unitOriginalPrice: 1299, quantity: 2 }, { unitPrice: 349, unitOriginalPrice: 699, quantity: 1 }], "standard");
ok(s.itemCount === 3 && s.subtotal === 3297 && s.discount === 1350 && s.deliveryCharge === 0 && s.total === 1947, `summary maths: ${JSON.stringify(s)}`);
ok(pricing.discountPercent(799, 1299) === 38 && pricing.discountPercent(849, 849) === 0, "discount %: 799/1299 → 38%, no discount → 0");
// stock
const v = { id: "x", optionValues: {}, price: 1, originalPrice: 1, initialStock: 5 };
ok(stock.effectiveStock(v, { x: -3 }) === 2 && stock.effectiveStock(v, { x: -9 }) === 0 && stock.maxAddable(5, 2) === 3 && stock.stockStatus(2) === "low_stock" && stock.stockStatus(0) === "out_of_stock", "effective stock, max addable and low/out-of-stock status");
// listing price for variant products
const s24 = PRODUCTS.find(p => p.slug === "samsung-galaxy-s24-ultra");
const sum24 = toProductSummary(s24);
ok(sum24.price === 129999 && sum24.hasPriceRange && sum24.requiresOptions && sum24.singleVariantId === null, "S24 Ultra lists at its lowest variant ₹1,29,999 with a price range");
const adj = Object.fromEntries(s24.variants.filter(v => v.optionValues.Storage === "256 GB").map(v => [v.id, -v.initialStock]));
ok(toProductSummary(s24, adj).price === 139999, "when the cheap variants sell out, listing price moves to the cheapest in-stock variant");
const allOut = Object.fromEntries(s24.variants.map(v => [v.id, -v.initialStock]));
ok(toProductSummary(s24, allOut).inStock === false && toProductSummary(s24, allOut).price === 129999, "fully sold out → not in stock, price falls back to cheapest variant");
ok(findVariant(s24, { Color: "Titanium Gray", RAM: "12 GB", Storage: "512 GB" })?.price === 139999 && !findVariant(s24, { Color: "Titanium Gray", RAM: "8 GB", Storage: "512 GB" }), "findVariant resolves valid combos and rejects invalid ones");
// scope + filters
const fashion = q({ categoryId: "fashion" });
ok(fashion.total === PRODUCTS.filter(p => p.categoryId === "fashion").length, `category scope: fashion ${fashion.total}`);
const two = q({ categoryId: "mobiles", brands: ["Samsung", "Apple"] });
ok(two.items.every(p => ["Samsung", "Apple"].includes(p.brand)) && two.items.some(p => p.brand === "Apple") && two.items.some(p => p.brand === "Samsung"), `OR within brand filter: ${two.total} Samsung/Apple products`);
const and = q({ categoryId: "mobiles", brands: ["Samsung", "Apple"], attributes: { storage: ["512 GB"] } });
ok(and.items.length >= 1 && and.items.every(p => p.brand === "Samsung" || p.brand === "Apple") && and.items.every(p => filterValues(PRODUCTS.find(x => x.id === p.id), "storage").includes("512 GB")), `AND across filters (brand × storage=512 GB): ${and.items.map(p=>p.name).join(", ")}`);
ok(and.facets.brands.some(b => b.value === "Samsung") && and.facets.brands.length >= 1 && two.facets.brands.length > 2, `brand facet ignores its own filter (shows ${two.facets.brands.length} brands while 2 selected)`);
const size = q({ categoryId: "fashion", attributes: { size: ["XXL"] } });
ok(size.total > 0 && size.facets.attributes.size.some(o => o.value === "S"), `variant-option filter: ${size.total} fashion products in XXL; size facet still offers other sizes`);
const price = q({ categoryId: "toys", priceMax: 999 });
ok(price.items.every(p => p.price <= 999) && price.total > 0, `price filter ≤ ₹999: ${price.total} toys`);
ok(q({ minRating: 4.5 }).items.every(p => p.rating >= 4.5) && q({ minDiscount: 50 }).items.every(p => p.discountPercent >= 50), "rating and discount minimums");
const inStock = q({ inStockOnly: true });
ok(inStock.items.every(p => p.inStock) && inStock.total < q({}).total, `in-stock-only removes ${q({}).total - inStock.total} sold-out products`);
const beauty = q({ categoryId: "beauty", attributes: { skinHairType: ["Oily"] } });
ok(beauty.total > 0 && beauty.items.every(p => filterValues(PRODUCTS.find(x => x.id === p.id), "skinHairType").includes("Oily")), `attribute filter on arrays (skin type Oily): ${beauty.total}`);
ok(Object.keys(q({ categoryId: "home-appliances" }).facets.attributes).sort().join() === "capacity,color,energyRating", "Home Appliances facets: capacity, color, energyRating");
ok(q({ categoryId: "fashion" }).facets.price.bands.length >= 2 && q({ categoryId: "fashion" }).facets.ratings.length >= 1, "price bands and rating facets present");
// sorting
const sorted = (sort, key, dir) => { const items = q({ categoryId: "fashion", sort }).items.map(key); return items.every((x, i) => i === 0 || (dir > 0 ? items[i-1] <= x : items[i-1] >= x)); };
ok(sorted("price-asc", p => p.price, 1) && sorted("price-desc", p => p.price, -1), "price low→high and high→low");
ok(sorted("rating", p => p.rating, -1) && sorted("newest", p => p.createdAt, -1) && sorted("discount", p => p.discountPercent, -1), "rating, newest and discount orders");
const rel = q({ categoryId: "fashion" }).items; const firstOut = rel.findIndex(p => !p.inStock);
ok(firstOut === -1 || rel.slice(firstOut).every(p => !p.inStock), "relevance: out-of-stock products last");
// search
const phone = q({ q: "phone" });
ok(phone.total > 0 && phone.items[0].subcategoryId === "mobiles-smartphones" || phone.items[0].name.toLowerCase().includes("phone"), `"phone" → ${phone.total} results, first: ${phone.items[0].name}`);
const shoes = q({ q: "shoes" });
ok(shoes.items.some(p => p.subcategoryId === "fashion-footwear"), `plural "shoes" finds footwear (${shoes.total})`);
const names = tax.names(PRODUCTS.find(p => p.slug === "stride-cloud-runner-sneakers"));
const byName = scoreProduct(PRODUCTS.find(p => p.slug === "stride-cloud-runner-sneakers"), tokenize("running"), names);
ok(q({ q: "samsung refrigerator" }).items.every(p => p.brand === "Samsung" && p.subcategoryId === "home-appliances-refrigerators"), "multi-word query requires every word (samsung + refrigerator)");
const mixer = q({ q: "mixer" }).items; ok(mixer[0]?.name.includes("Mixer"), `name match ranks first for "mixer": ${mixer[0]?.name}`);
ok(q({ q: "zzzqx" }).total === 0, "nonsense query → 0 results");
ok(q({ q: "pique" }).total >= 1 && q({ q: "Piqué" }).total >= 1, "accent-insensitive search (pique / Piqué)");
// collections + pagination
ok(q({ collection: "best-sellers" }).items.every(p => p.isBestSeller) && q({ collection: "special-offers" }).items.every(p => p.discountPercent > 0) && q({ collection: "new-arrivals" }).items.every(p => p.isNewArrival), "collections: best sellers, special offers, new arrivals");
const pg = queryCatalog(PRODUCTS, { sort: "price-asc", page: 2 }, tax, 24);
ok(pg.page === 2 && pg.items.length === 24 && pg.pageCount === Math.ceil(PRODUCTS.length / 24) && pg.total === PRODUCTS.length, `pagination: page 2 of ${pg.pageCount}, 24 items`);
ok(queryCatalog(PRODUCTS, { sort: "relevance", page: 99 }, tax, 24).page === pg.pageCount, "page beyond the end clamps to the last page");
console.log(fail ? `${fail} FAILED` : "ALL PASS");
