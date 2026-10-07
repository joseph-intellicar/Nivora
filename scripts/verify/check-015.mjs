const { PRODUCTS } = await import("@nivora/shared/data/products");
const { SEED_ORDERS, SEED_ORDER_COUNTER } = await import("@nivora/shared/data/seedOrders");
const { TEST_USER } = await import("@nivora/shared/data/seedUsers");
const { INDIAN_STATES } = await import("@nivora/shared/config/indianStates");
const { INFO_PAGES_CONTENT } = await import("@nivora/shared/data/infoPages");
const { INFO_PAGES } = await import("@nivora/shared/config/infoPages");
let fail = 0; const ok = (c, m) => { console.log((c ? "PASS " : "FAIL ") + m); if (!c) fail++; };
ok(PRODUCTS.every(p => /^[a-z0-9]+(-[a-z0-9]+)*$/.test(p.slug)), "all slugs are clean ASCII kebab-case");
const attrs = (cat, keys) => PRODUCTS.filter(p => p.categoryId === cat).every(p => keys.every(k => k in p.attributes));
ok(PRODUCTS.filter(p => p.categoryId === "home-appliances").every(p => "capacity" in p.attributes) &&
   PRODUCTS.filter(p => p.categoryId === "home-appliances" && p.subcategoryId !== "home-appliances-kitchen").every(p => "energyRating" in p.attributes), "Home Appliances: capacity (+ energy rating for large appliances)");
ok(attrs("beauty", ["productType", "skinHairType"]), "Beauty: productType + skinHairType");
ok(attrs("toys", ["ageGroup"]), "Toys: ageGroup");
for (const o of SEED_ORDERS) {
  const sub = o.items.reduce((s, i) => s + i.unitOriginalPrice * i.quantity, 0), dis = o.items.reduce((s, i) => s + (i.unitOriginalPrice - i.unitPrice) * i.quantity, 0);
  const value = sub - dis, del = o.deliveryOption === "express" ? 99 : value >= 499 ? 0 : 40;
  const snap = o.items.every(i => { const p = PRODUCTS.find(p => p.id === i.productId); const v = p?.variants.find(v => v.id === i.variantId); return p && v && i.productName === p.name && i.unitPrice === v.price && i.lineTotal === v.price * i.quantity; });
  ok(o.subtotal === sub && o.discount === dis && o.deliveryCharge === del && o.total === value + del && snap, `${o.orderId} (${o.status}): totals recomputed ${o.total} = ${sub} − ${dis} + ${del}; snapshots match catalog`);
  ok(o.customerId === TEST_USER.id && o.paymentMethod === "Cash on Delivery" && o.isSample === true && o.statusHistory.at(-1).status === o.status, `${o.orderId}: test user, COD, isSample, history ends with status`);
}
ok(new Set(SEED_ORDERS.map(o => o.status)).size === 4 && ["Delivered","Shipped","Confirmed","Cancelled"].every(s => SEED_ORDERS.some(o => o.status === s)), "seed orders cover Delivered, Shipped, Confirmed, Cancelled");
ok(SEED_ORDER_COUNTER === SEED_ORDERS.length, "order counter continues after seeds");
ok(INDIAN_STATES.length === 36 && INDIAN_STATES.includes("Karnataka") && INDIAN_STATES.includes("Ladakh"), "36 states and union territories");
ok(JSON.stringify(INFO_PAGES_CONTENT.map(p => p.slug)) === JSON.stringify(INFO_PAGES.map(p => p.slug)), "info page copy for all 6 footer pages");
console.log(fail ? `${fail} FAILED` : "ALL PASS");
