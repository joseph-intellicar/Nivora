const shim = await import("./browser-shim.mjs");
const { mockCart: cart } = await import("@/api/client/mock/cart");
const { mockAuth: auth } = await import("@/api/client/mock/auth");
const { mockInventory: inventory, adjustStock } = await import("@/api/client/mock/inventory");
const { mockClientCatalog: catalog } = await import("@/api/client/mock/catalog");
const { writeLines, readLines } = await import("@/api/client/mock/cartStore");
let fail = 0; const ok = (c, m) => { console.log((c ? "PASS " : "FAIL ") + m); if (!c) fail++; };
const err = async (p) => { try { await p; return "OK"; } catch (e) { return [e.code, e.details?.available].filter(x => x !== undefined).join(":"); } };
const M = "urbano-classic-oxford-shirt-sky-blue-m", L = "urbano-classic-oxford-shirt-sky-blue-l";
const LOW = "urbano-classic-oxford-shirt-sky-blue-s"; // stock 2
const OOS = "urbano-classic-oxford-shirt-white-xxl";   // stock 0
let v = await cart.addItem({ variantId: M, quantity: 1 });
v = await cart.addItem({ variantId: M, quantity: 1 });
ok(v.lines.length === 1 && v.lines[0].quantity === 2, "same variant ×2 → one line, quantity 2");
v = await cart.addItem({ variantId: L, quantity: 1 });
ok(v.lines.length === 2 && v.lines[1].options.Size === "L" && v.lines[1].options.Color === "Sky Blue", "different variant → separate line with its options");
ok(v.summary.itemCount === 3 && v.summary.subtotal === 3 * 1999 && v.summary.discount === 3 * 700 && v.summary.deliveryCharge === 0 && v.summary.total === 3 * 1299, `summary: 3 items, MRP ${v.summary.subtotal}, discount ${v.summary.discount}, total ${v.summary.total}`);
ok((await err(cart.addItem({ variantId: LOW, quantity: 3 }))) === "INSUFFICIENT_STOCK:2", "3 of a 2-in-stock variant → INSUFFICIENT_STOCK (2 available)");
await cart.addItem({ variantId: LOW, quantity: 2 });
ok((await err(cart.addItem({ variantId: LOW, quantity: 1 }))) === "INSUFFICIENT_STOCK:0", "adding more when the cart already holds all stock → INSUFFICIENT_STOCK (0 more)");
ok((await err(cart.addItem({ variantId: OOS, quantity: 1 }))) === "OUT_OF_STOCK", "out-of-stock variant → OUT_OF_STOCK");
ok((await err(cart.addItem({ variantId: "nope", quantity: 1 }))) === "INVALID_VARIANT" && (await err(cart.addItem({ variantId: M, quantity: 0 }))) === "INVALID_QUANTITY" && (await err(cart.addItem({ variantId: M, quantity: 1.5 }))) === "INVALID_QUANTITY", "invalid variant and invalid quantities rejected");
v = await cart.updateQuantity(M, 5); ok(v.lines.find(l => l.variantId === M).quantity === 5, "update quantity");
ok((await err(cart.updateQuantity(LOW, 3))) === "INSUFFICIENT_STOCK:2" && (await err(cart.updateQuantity(M, 0))) === "INVALID_QUANTITY" && (await err(cart.updateQuantity("not-in-cart", 1))) === "NOT_FOUND", "update: stock cap, minimum 1, unknown line");
v = await cart.removeItem(L); ok(v.lines.length === 2 && !v.lines.some(l => l.variantId === L), "remove line");
// isolation guest vs user
await auth.login({ email: "joseph@example.com", password: "password123" });
v = await cart.getCart(); const joseph = v.lines.length;
await auth.logout(); v = await cart.getCart();
ok(v.lines.length === 0 && joseph === 2, "guest cart merged into Joseph's on login; after logout the guest cart is empty");
await cart.addItem({ variantId: L, quantity: 1 });
ok(readLines(null).length === 1 && readLines("user-joseph").length === 2, "guest and user carts are stored separately");
// revalidation: removed products + stock changes
writeLines(null, [...readLines(null), { variantId: "deleted-product-variant", productId: "deleted", quantity: 1 }]);
v = await cart.getCart(); ok(v.removed.length === 1 && v.removed[0].type === "unavailable" && readLines(null).length === 1, "missing product → removed with a notice and dropped from storage");
v = await cart.getCart(); ok(v.removed.length === 0, "the removal notice is reported only once");
adjustStock([{ variantId: L, delta: -999 }]);
v = await cart.getCart(); ok(v.issues[0]?.type === "out_of_stock" && v.lines[0].issue?.type === "out_of_stock" && v.lines[0].available === 0, "stock sold out after adding → line flagged out of stock");
ok(JSON.stringify(await inventory.getAdjustments()) === JSON.stringify({ [L]: -999 }), "inventory adjustments readable through the API");
const p = await catalog.getProduct("urbano-classic-oxford-shirt");
ok(p.available[L] === 0 && p.available[LOW] === 2 && p.available[OOS] === 0 && p.available[M] === 25 && p.variants.length === 10, "client product lookup returns live stock per variant");
ok((await catalog.getProduct("nope")) === null, "unknown slug → null");
adjustStock([{ variantId: L, delta: 999 }]); ok(shim.raw("inventory") === "{}", "zeroed adjustments are removed from storage");
v = await cart.getCart(); ok(v.issues.length === 0, "restored stock clears the issue");
console.log(fail ? `${fail} FAILED` : "ALL PASS");
