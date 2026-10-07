const cart = await import("@nivora/shared/domain/cart");
const orders = await import("@nivora/shared/domain/orders");
const v = await import("@nivora/shared/domain/validation");
let fail = 0; const ok = (c, m) => { console.log((c ? "PASS " : "FAIL ") + m); if (!c) fail++; };
const L = (variantId, quantity) => ({ variantId, productId: "p-" + variantId, quantity });
// add / identity
let lines = cart.addLine([], L("a", 1)); lines = cart.addLine(lines, L("a", 2)); lines = cart.addLine(lines, L("b", 1));
ok(lines.length === 2 && cart.quantityInCart(lines, "a") === 3, "same variant increments one line; different variant adds a line");
ok(cart.removeLine(lines, "a").length === 1 && cart.quantityInCart(cart.setLineQuantity(lines, "b", 4), "b") === 4, "remove and set quantity");
ok(JSON.stringify(cart.checkQuantity(2, 3, 4)) === '{"ok":false,"reason":"INSUFFICIENT_STOCK","available":1}', "3 in cart + 2 requested with 4 available → INSUFFICIENT_STOCK (1 more)");
ok(cart.checkQuantity(1, 0, 0).reason === "OUT_OF_STOCK" && cart.checkQuantity(0, 0, 5).reason === "INVALID_QUANTITY" && cart.checkQuantity(1.5, 0, 5).reason === "INVALID_QUANTITY" && cart.checkQuantity(2, 0, 2).ok, "out of stock, invalid quantities, exact fit");
// merge
const avail = { a: 4, b: 10, c: 10, d: 0 };
const m1 = cart.mergeCarts([L("a", 3), L("c", 1)], [L("a", 2), L("b", 1)], id => avail[id]);
ok(cart.quantityInCart(m1.lines, "a") === 4 && cart.quantityInCart(m1.lines, "b") === 1 && cart.quantityInCart(m1.lines, "c") === 1 && m1.mergedSavedItems, "merge: overlapping summed and capped at stock (3+2→4), new lines added, saved items detected");
const m2 = cart.mergeCarts([], [L("a", 1)], id => avail[id]);
ok(!m2.mergedSavedItems && m2.lines.length === 1, "merge with empty saved cart → mergedSavedItems false");
const m3 = cart.mergeCarts([L("a", 1)], [L("a", 1)], id => avail[id]);
ok(m3.mergedSavedItems && cart.quantityInCart(m3.lines, "a") === 2, "same variant in both carts → quantity grows, counts as saved items");
ok(cart.assessLine({ variantId: "x", productName: "X", exists: false, quantity: 1, available: 0 }).type === "unavailable" && cart.assessLine({ variantId: "x", productName: "X", exists: true, quantity: 3, available: 2 }).type === "insufficient_stock" && cart.assessLine({ variantId: "x", productName: "X", exists: true, quantity: 1, available: 0 }).type === "out_of_stock" && cart.assessLine({ variantId: "x", productName: "X", exists: true, quantity: 2, available: 2 }) === null, "line issues: unavailable, out of stock, insufficient stock, ok");
// orders
const line = { variantId: "a", productId: "p", productSlug: "p", productName: "P", brand: "B", image: "i", options: { Size: "M" }, quantity: 2, unitPrice: 300, unitOriginalPrice: 400, lineTotal: 600, available: 5, issue: null };
const address = { fullName: "Joseph", phone: "9876543210", line1: "1 St", city: "Bengaluru", state: "Karnataka", postalCode: "560038", country: "India" };
const o = orders.buildOrder({ orderId: orders.formatOrderId(5, 2026), customerId: "u", orderDate: "2026-10-06T00:00:00.000Z", source: "cart", lines: [line], deliveryOption: "standard", address });
ok(o.orderId === "NIV-2026-000005" && o.subtotal === 800 && o.discount === 200 && o.deliveryCharge === 0 && o.total === 600 && o.items[0].discount === 200 && o.paymentMethod === "Cash on Delivery" && o.status === "Placed" && o.statusHistory.length === 1, "buildOrder: id format, recomputed totals, snapshot, COD, Placed");
line.unitPrice = 1; ok(o.items[0].unitPrice === 300, "order items are snapshots (later line changes don't affect the order)");
const c = orders.cancelOrder(o, "2026-10-07T00:00:00.000Z");
ok(c.status === "Cancelled" && c.statusHistory.at(-1).status === "Cancelled" && o.status === "Placed", "cancelOrder appends history without mutating the original");
ok(["Placed", "Confirmed"].every(orders.canCancel) && !["Shipped", "Delivered", "Cancelled"].some(orders.canCancel), "canCancel: Placed, Confirmed only");
ok(orders.toOrderSummary(o).otherItemsCount === 0 && orders.toOrderSummary(o).itemCount === 2, "order summary");
// validation
const msg = (schema, input) => schema.safeParse(input).error?.issues.map(i => i.message) ?? [];
const signup = (pw, confirm = pw) => ({ name: "A", email: "a@b.co", password: pw, confirmPassword: confirm });
ok(v.signupSchema.safeParse(signup("password123")).success, "password123 is valid");
ok(msg(v.signupSchema, signup("password")).includes(v.PASSWORD_RULE_MESSAGE) && msg(v.signupSchema, signup("12345678")).includes(v.PASSWORD_RULE_MESSAGE) && msg(v.signupSchema, signup("abc1")).includes(v.PASSWORD_RULE_MESSAGE), "password, 12345678 and abc1 rejected with the password rule message");
ok(msg(v.signupSchema, signup("password123", "password124")).includes("Passwords do not match."), "password mismatch message");
ok(msg(v.loginSchema, { email: "", password: "" }).join("|") === "Please enter your email.|Please enter your password.", "login: required-field messages");
ok(msg(v.loginSchema, { email: "joseph@", password: "x" })[0] === "Please enter a valid email address." && v.loginSchema.parse({ email: " joseph@example.com ", password: "x" }).email === "joseph@example.com", "login: invalid email message; email trimmed");
const addr = (over) => ({ ...address, ...over });
ok(v.addressSchema.safeParse(addr({ line2: "" })).success && v.addressSchema.parse(addr({ line2: "" })).line2 === undefined, "valid address; empty line 2 becomes undefined");
ok(msg(v.addressSchema, addr({ postalCode: "000000" }))[0] === "Please enter a valid 6-digit PIN code." && msg(v.addressSchema, addr({ postalCode: "56003" }))[0] === "Please enter a valid 6-digit PIN code.", "PIN 000000 and 56003 rejected");
ok(msg(v.addressSchema, addr({ phone: "5123456789" }))[0] === "Please enter a valid 10-digit mobile number." && msg(v.addressSchema, addr({ phone: "98765" }))[0] === "Please enter a valid 10-digit mobile number.", "mobile 5123456789 and 98765 rejected");
ok(msg(v.addressSchema, addr({ state: "Atlantis" }))[0] === "Please select a state." && msg(v.addressSchema, addr({ country: "Nepal" }))[0] === "Nivora delivers within India only.", "unknown state and non-India country rejected");
ok(msg(v.addressSchema, addr({ fullName: "  ", city: "" })).join("|") === "Please enter the full name.|Please enter the city.", "required address fields");
ok(v.profileSchema.safeParse({ name: "Joseph", phone: "" }).success && msg(v.profileSchema, { name: "Joseph", phone: "123" })[0] === "Please enter a valid 10-digit mobile number.", "profile: phone optional but validated");
ok(v.cartItemInputSchema.safeParse({ variantId: "x", quantity: 2 }).success && !v.cartItemInputSchema.safeParse({ variantId: "x", quantity: 0 }).success && !v.cartItemInputSchema.safeParse({ variantId: "x", quantity: 1.5 }).success, "data-layer quantity: integers ≥ 1 only");
console.log(fail ? `${fail} FAILED` : "ALL PASS");
