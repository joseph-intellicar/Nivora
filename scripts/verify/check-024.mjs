await import("./browser-shim.mjs");
const { api } = await import("@/api/client");
const { readAdjustments } = await import("@/api/client/mock/inventory");
let fail = 0; const ok = (c, m) => { console.log((c ? "PASS " : "FAIL ") + m); if (!c) fail++; };
const err = async (p) => { try { await p; return "OK"; } catch (e) { return [e.code, e.details?.available].filter(x => x !== undefined).join(":"); } };
const POLO = "northline-pique-polo-t-shirt-black-l";      // stock 25
const SHIRT = "urbano-classic-oxford-shirt-sky-blue-m";   // stock 25
const LOW = "urbano-classic-oxford-shirt-sky-blue-s";     // stock 2
const IPHONE = "apple-iphone-15-black-6-gb-128-gb";       // stock 15
const adj = (v) => readAdjustments()[v] ?? 0;
const good = { fullName: "Joseph", phone: "9876543210", line1: "42, 3rd Cross", city: "Bengaluru", state: "Karnataka", postalCode: "560038", country: "India" };
ok((await err(api.checkout.getCheckout("standard"))) === "UNAUTHENTICATED" && (await err(api.checkout.startBuyNow({ variantId: POLO, quantity: 1 }))) === "UNAUTHENTICATED", "checkout requires login");
await api.auth.login({ email: "joseph@example.com", password: "password123" });
ok((await err(api.checkout.placeOrder({ addressId: "x", deliveryOption: "standard" }))) === "EMPTY_CART", "empty cart checkout → EMPTY_CART");
await api.cart.addItem({ variantId: POLO, quantity: 2 }); await api.cart.addItem({ variantId: SHIRT, quantity: 1 });
await api.checkout.startCartCheckout();
let view = await api.checkout.getCheckout("standard");
ok(view.source === "cart" && view.lines.length === 2 && view.summary.deliveryCharge === 0, `cart checkout view: 2 lines, total ${view.summary.total}`);
const express = await api.checkout.getCheckout("express");
ok(express.summary.deliveryCharge === 99 && express.summary.total === view.summary.total + 99, "Express adds ₹99 to the total");
ok((await err(api.checkout.placeOrder({ addressId: "", deliveryOption: "standard" }))) === "ADDRESS_REQUIRED" && (await err(api.checkout.placeOrder({ addressId: "addr-missing", deliveryOption: "standard" }))) === "ADDRESS_REQUIRED", "no / unknown address → ADDRESS_REQUIRED");
const address = await api.addresses.create(good);
// Buy Now
await api.checkout.startBuyNow({ variantId: LOW, quantity: 1 });
await api.checkout.startBuyNow({ variantId: IPHONE, quantity: 2 });
view = await api.checkout.getCheckout("standard");
ok(view.source === "buy_now" && view.lines.length === 1 && view.lines[0].variantId === IPHONE && view.lines[0].quantity === 2, "a new Buy Now replaces the previous pending Buy Now");
ok((await err(api.checkout.startBuyNow({ variantId: LOW, quantity: 3 }))) === "INSUFFICIENT_STOCK:2", "Buy Now quantity limited by stock");
const cartBefore = JSON.stringify((await api.cart.getCart()).lines.map(l => [l.variantId, l.quantity]));
const o1 = await api.checkout.placeOrder({ addressId: address.id, deliveryOption: "express" });
ok(o1.orderId === `NIV-${new Date().getFullYear()}-000005` && o1.source === "buy_now" && o1.status === "Placed" && o1.paymentMethod === "Cash on Delivery" && o1.deliveryCharge === 99, `Buy Now order ${o1.orderId}: COD, Placed, express ₹99`);
ok(JSON.stringify((await api.cart.getCart()).lines.map(l => [l.variantId, l.quantity])) === cartBefore, "Buy Now order leaves the cart unchanged");
ok(adj(IPHONE) === -2, "placing the order reduced iPhone stock by 2");
ok((await api.checkout.getCheckout("standard")).source === "cart", "after a Buy Now order, checkout falls back to the cart");
ok(o1.total === 2 * 69900 + 99 && o1.subtotal === 2 * 79900 && o1.discount === 2 * 10000 && o1.deliveryAddress.city === "Bengaluru" && o1.items[0].productName === "Apple iPhone 15", "order totals recomputed, address and item snapshots stored");
// Cart order removes only purchased lines
await api.checkout.startCartCheckout();
const o2 = await api.checkout.placeOrder({ addressId: address.id, deliveryOption: "standard" });
ok(o2.orderId.endsWith("000006") && o2.source === "cart" && o2.items.length === 2, "order ids are sequential (000006)");
ok((await api.cart.getCart()).lines.length === 0 && adj(POLO) === -2 && adj(SHIRT) === -1, "cart order: purchased lines removed from cart, stock reduced");
// stock check at place time
await api.cart.addItem({ variantId: LOW, quantity: 2 });
await api.checkout.startBuyNow({ variantId: LOW, quantity: 1 });
await api.checkout.placeOrder({ addressId: address.id, deliveryOption: "standard" }); // sells 1 of 2
await api.checkout.startCartCheckout();
ok((await err(api.checkout.placeOrder({ addressId: address.id, deliveryOption: "standard" }))) === "INSUFFICIENT_STOCK:1", "cart now wants 2 but only 1 left → INSUFFICIENT_STOCK, no order created");
await api.cart.updateQuantity(LOW, 1);
// orders list / get / cancel
const list = await api.orders.list();
ok(list.length === 7 && list[0].orderDate >= list[1].orderDate && list.every(o => o.paymentMethod === "Cash on Delivery"), `orders newest first (${list.length} incl. 4 samples)`);
ok((await api.orders.get(o2.orderId)).total === o2.total, "get own order");
const before = adj(IPHONE);
const c = await api.orders.cancel(o1.orderId);
ok(c.status === "Cancelled" && c.statusHistory.at(-1).status === "Cancelled" && adj(IPHONE) === before + 2, "cancel restores stock (+2) and records history");
ok((await err(api.orders.cancel(o1.orderId))) === "ORDER_NOT_CANCELLABLE" && (await err(api.orders.cancel("NIV-2026-000003"))) === "ORDER_NOT_CANCELLABLE", "already-cancelled and Shipped orders → ORDER_NOT_CANCELLABLE");
const sample = (await api.orders.get("NIV-2026-000004")).items[0].variantId; const sBefore = adj(sample);
await api.orders.cancel("NIV-2026-000004"); ok(adj(sample) === sBefore, "cancelling a sample (Confirmed) order does not change stock");
await api.auth.logout(); await api.auth.signup({ name: "Other", email: "other@example.com", password: "password123", confirmPassword: "password123" });
ok((await err(api.orders.get(o2.orderId))) === "NOT_FOUND" && (await err(api.orders.cancel(o2.orderId))) === "NOT_FOUND" && (await api.orders.list()).length === 0, "another user's order → NOT_FOUND; new user has no orders");
console.log(fail ? `${fail} FAILED` : "ALL PASS");
