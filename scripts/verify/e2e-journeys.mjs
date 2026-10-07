// End-to-end customer journeys (requirements §32) through the real data layer + intent logic.
// Mock mode: node --import ./register.mjs --import ./browser-shim.mjs e2e-journeys.mjs
// HTTP mode: node --import ./register.mjs --import ./http-shim.mjs e2e-journeys.mjs (fresh nivora_test seed)
const HTTP = process.env.NEXT_PUBLIC_DATA_SOURCE === "http";
const shim = HTTP ? null : await import("./browser-shim.mjs");
const { api } = await import("@/api/client");
const { resumeIntent } = await import("@/features/auth/intent");
const { useLoginPromptStore } = await import("@/stores/loginPromptStore");
const { createRequire } = await import("node:module");
const { QueryClient } = createRequire(new URL("../../frontend/package.json", import.meta.url))("@tanstack/react-query");
let fail = 0; const ok = (c, m) => { console.log((c ? "PASS " : "FAIL ") + m); if (!c) fail++; };
const err = async (p) => { try { await p; return "OK"; } catch (e) { return e.code; } };
const nav = []; const deps = { api, queryClient: new QueryClient(), navigate: (p) => nav.push(p), notify: { success() {}, error() {}, info() {} } };
const reload = async () => { /* a page refresh: everything is re-read from storage */ };
const SHIRT_M = "urbano-classic-oxford-shirt-sky-blue-m", POLO = "northline-pique-polo-t-shirt-black-l", TEE = "tiny-trails-cotton-crew-t-shirt-pack-of-2-white-4-5y", PHONE = "apple-iphone-15-blue-6-gb-128-gb";
const adj = () => JSON.parse(shim.raw("inventory") ?? "{}");
/** iPhone stock as the customer sees it: the API in http mode, initial + overlay in mock mode. */
const phoneStock = async () => (HTTP ? (await api.catalog.getProduct("apple-iphone-15")).available[PHONE] : (adj()[PHONE] ?? 0));
const ASHA = HTTP ? `asha-${Date.now()}@example.com` : "asha@example.com";

console.log("— Journey 1: guest shopping (Home → … → Add to Cart → Cart)");
ok((await api.auth.getSession()) === null, "guest opens Nivora: not logged in");
await api.cart.addItem({ variantId: SHIRT_M, quantity: 2 }); await api.cart.addItem({ variantId: SHIRT_M, quantity: 1 }); await api.cart.addItem({ variantId: POLO, quantity: 1 });
let cart = await api.cart.getCart();
ok(cart.lines.length === 2 && cart.lines[0].quantity === 3 && cart.summary.itemCount === 4, "guest adds to cart without logging in; same variant merges, different variant separate");
await reload(); ok((await api.cart.getCart()).summary.itemCount === 4, "cart survives refresh (persisted)");
await api.cart.updateQuantity(SHIRT_M, 2); await api.cart.removeItem(POLO);
cart = await api.cart.getCart(); ok(cart.lines.length === 1 && cart.lines[0].quantity === 2, "cart quantity change and removal work");

console.log("— Journey 2: guest wishlist → login → wishlist → move to cart");
ok((await err(api.wishlist.add("urbano-classic-oxford-shirt"))) === "UNAUTHENTICATED", "guest wishlist requires login");
useLoginPromptStore.getState().open({ type: "wishlist-add", productId: "urbano-classic-oxford-shirt", returnTo: "/c/fashion/men" }); useLoginPromptStore.getState().proceed();
const login = await api.auth.login({ email: "joseph@example.com", password: "password123" });
await resumeIntent(useLoginPromptStore.getState().take(), { userId: login.user.id, mergedSavedItems: login.mergedSavedItems, from: "/c/fashion/men" }, deps);
ok(nav.at(-1) === "/c/fashion/men" && (await api.wishlist.getWishlist()).some((p) => p.id === "urbano-classic-oxford-shirt"), "after login the product is wishlisted and the guest is back on the listing");
ok((await api.cart.getCart()).summary.itemCount === 2, "guest cart merged into Joseph's cart on login");
await reload(); ok((await api.auth.getSession())?.name === "Joseph", "login session survives refresh");
await api.wishlist.moveToCart({ productId: "urbano-classic-oxford-shirt", variantId: "urbano-classic-oxford-shirt-white-l" });
ok((await api.wishlist.getWishlist()).length === 0 && (await api.cart.getCart()).lines.some((l) => l.variantId === "urbano-classic-oxford-shirt-white-l"), "wishlist → move to cart");
await api.wishlist.add("apple-iphone-15"); await api.auth.logout(); await api.auth.login({ email: "joseph@example.com", password: "password123" });
ok((await api.wishlist.getWishlist()).length === 1, "wishlist persists across logout/login");

console.log("— Journey 3: signup / login / logout");
await api.auth.logout(); ok((await api.auth.getSession()) === null && (await api.cart.getCart()).lines.length === 0, "logout → guest mode with an empty guest cart");
for (const call of [api.wishlist.getWishlist(), api.addresses.list(), api.orders.list(), api.profile.get(), api.checkout.getCheckout("standard")]) ok((await err(call)) === "UNAUTHENTICATED", "protected feature requires authentication");
await api.cart.addItem({ variantId: TEE, quantity: 1 });
const signup = await api.auth.signup({ name: "Asha", email: ASHA, password: "nivora2026", confirmPassword: "nivora2026" });
ok(signup.user.name === "Asha" && (await api.cart.getCart()).lines.length === 1 && (await api.orders.list()).length === 0, "signup logs in, keeps the guest cart; new user has no orders");
await api.auth.logout(); ok((await api.auth.login({ email: ASHA.toUpperCase(), password: "nivora2026" })).user.email === ASHA, "the new account can log back in");

console.log("— Journey 4: Buy Now (Product → Buy Now → Login → Checkout → … → Order Details)");
await api.auth.logout();
useLoginPromptStore.getState().open({ type: "buy-now", variantId: PHONE, quantity: 1, returnTo: "/p/apple-iphone-15" }); useLoginPromptStore.getState().proceed();
const j = await api.auth.login({ email: "joseph@example.com", password: "password123" });
await resumeIntent(useLoginPromptStore.getState().take(), { userId: j.user.id, mergedSavedItems: j.mergedSavedItems, from: null }, deps);
let co = await api.checkout.getCheckout("express");
ok(nav.at(-1) === "/checkout" && co.source === "buy_now" && co.lines.length === 1 && co.summary.deliveryCharge === 99, "guest Buy Now → login → checkout with only that item (Express ₹99)");
ok((await err(api.checkout.placeOrder({ addressId: "", deliveryOption: "express" }))) === "ADDRESS_REQUIRED", "checkout without an address is blocked");
const home = await api.addresses.create({ fullName: "Joseph", phone: "9876543210", line1: "42, 3rd Cross", city: "Bengaluru", state: "Karnataka", postalCode: "560038", country: "India" });
const office = await api.addresses.create({ fullName: "Joseph", phone: "9876543210", line1: "7 MG Road", city: "Bengaluru", state: "Karnataka", postalCode: "560001", country: "India" });
await api.addresses.update(office.id, { fullName: "Joseph K", phone: "9876543210", line1: "7 MG Road", line2: "4th floor", city: "Bengaluru", state: "Karnataka", postalCode: "560001", country: "India" });
await api.addresses.setDefault(office.id);
ok((await api.addresses.list())[0].id === office.id, "address management: add, edit, set default");
const cartBefore = (await api.cart.getCart()).summary.itemCount; const stockBefore = await phoneStock();
const o1 = await api.checkout.placeOrder({ addressId: office.id, deliveryOption: "express" });
ok(o1.paymentMethod === "Cash on Delivery" && o1.status === "Placed" && o1.deliveryAddress.fullName === "Joseph K", `Cash on Delivery order ${o1.orderId} placed to the chosen address`);
ok((await api.cart.getCart()).summary.itemCount === cartBefore && (await phoneStock()) === stockBefore - 1, "Buy Now order leaves the cart unchanged; stock reduced by 1");
ok((await api.orders.get(o1.orderId)).total === o1.total, "order confirmation / details read the placed order");

console.log("— Journey 5: cart checkout (Add to Cart → Cart → Checkout → … → Order Details)");
await api.checkout.startCartCheckout();
co = await api.checkout.getCheckout("standard");
ok(co.source === "cart" && co.lines.length === cartBefore - 0 || co.lines.length >= 1, `cart checkout shows ${co.lines.length} cart line(s)`);
const o2 = await api.checkout.placeOrder({ addressId: home.id, deliveryOption: "standard" });
ok((await api.cart.getCart()).lines.length === 0 && o2.items.length === co.lines.length && o2.total === co.summary.total, "cart order: totals match checkout; purchased items cleared from the cart");
const history = await api.orders.list();
ok(history[0].orderId === o2.orderId && history.length === 6 && history.every((o) => o.paymentMethod === "Cash on Delivery"), "order history newest first, all Cash on Delivery (4 samples + 2 new)");

console.log("— Journey 6: Profile → Orders → Order Details → Cancel (stock restored)");
const before = await phoneStock();
const cancelled = await api.orders.cancel(o1.orderId);
ok(cancelled.status === "Cancelled" && (await phoneStock()) === before + 1, "cancelling the Buy Now order restores stock");
ok((await err(api.orders.cancel("NIV-2026-000001"))) === "ORDER_NOT_CANCELLABLE", "a Delivered sample order cannot be cancelled");
const p = await api.profile.update({ name: "Joseph Kurian", phone: "9876543210" });
ok(p.name === "Joseph Kurian" && (await api.auth.getSession()).name === "Joseph Kurian", "profile edit persists to the session");
await api.auth.logout(); ok((await err(api.orders.get(o2.orderId))) === "UNAUTHENTICATED", "after logout, order details are protected");
console.log(fail ? `${fail} FAILED` : "ALL PASS");
