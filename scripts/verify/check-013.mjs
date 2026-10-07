const { CATEGORIES } = await import("@nivora/shared/data/categories");
const { COLLECTIONS } = await import("@nivora/shared/data/collections");
const expected = {
  "Fashion": ["Men", "Women", "Kids", "Footwear", "Accessories"],
  "Home Appliances": ["Refrigerators", "Washing Machines", "Air Conditioner", "Kitchen"],
  "Beauty": ["Skincare", "Haircare", "Makeup", "Fragrances", "Personal Care"],
  "Toys": ["Educational Toys", "Action Figures", "Dolls", "Remote Control Toys", "Outdoor Toys", "Board Games"],
  "Mobiles": ["Smartphones", "Mobile Accessories", "Cases & Covers", "Chargers"],
};
let fail = 0; const ok = (c, m) => { console.log((c ? "PASS " : "FAIL ") + m); if (!c) fail++; };
ok(JSON.stringify(CATEGORIES.map(c => c.name)) === JSON.stringify(Object.keys(expected)), "5 categories, exact names and nav order");
for (const c of CATEGORIES) ok(JSON.stringify(c.subcategories.map(s => s.name)) === JSON.stringify(expected[c.name]), `${c.name}: ${c.subcategories.length} subcategories match exactly`);
const subs = CATEGORIES.flatMap(c => c.subcategories);
ok(subs.length === 24, `24 subcategories total (got ${subs.length})`);
ok(new Set(subs.map(s => s.id)).size === 24, "subcategory ids unique");
ok(subs.every(s => /^[a-z0-9-]+$/.test(s.slug) && s.id === `${s.categoryId}-${s.slug}`), "slugs are URL-safe and ids consistent");
ok(CATEGORIES.every(c => c.id === c.slug && c.description.length > 20), "category slugs = ids, descriptions present");
const taxonomyNames = new Set([...CATEGORIES.map(c => c.name), ...subs.map(s => s.name)]);
ok(COLLECTIONS.every(col => !taxonomyNames.has(col.name)), "collections are not in the taxonomy");
ok(JSON.stringify(COLLECTIONS.map(c => c.id)) === '["best-sellers","special-offers","new-arrivals"]', "3 collections: best-sellers, special-offers, new-arrivals");
console.log(fail ? `${fail} FAILED` : "ALL PASS");
