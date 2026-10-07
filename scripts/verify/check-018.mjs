const { ApiError, isApiError } = await import("@nivora/shared/errors");
const { messageFor, getErrorMessage } = await import("@nivora/shared/errorMessages");
const v = await import("@nivora/shared/domain/validation");
let fail = 0; const ok = (c, m) => { console.log((c ? "PASS " : "FAIL ") + m); if (!c) fail++; };
const first = (schema, input) => schema.safeParse(input).error?.issues[0]?.message;
const addr = { fullName: "J", phone: "9876543210", line1: "1", city: "B", state: "Karnataka", postalCode: "560038", country: "India" };
const rows = [ // requirements §28 table → message the customer will see
  ["Invalid login", messageFor("INVALID_CREDENTIALS"), "Incorrect email or password."],
  ["Existing signup email", messageFor("EMAIL_TAKEN"), "An account with this email already exists. Try logging in."],
  ["Password mismatch", first(v.signupSchema, { name: "A", email: "a@b.co", password: "password123", confirmPassword: "x" }), "Passwords do not match."],
  ["Weak password", first(v.signupSchema, { name: "A", email: "a@b.co", password: "short", confirmPassword: "short" }), "Password must be at least 8 characters and include a letter and a number."],
  ["Missing fields", first(v.loginSchema, { email: "", password: "x" }), "Please enter your email."],
  ["Invalid email", first(v.loginSchema, { email: "nope", password: "x" }), "Please enter a valid email address."],
  ["Invalid quantity", messageFor("INVALID_QUANTITY"), "Please choose a valid quantity."],
  ["Required variant not selected", messageFor("VARIANT_REQUIRED", { option: "Size" }), "Please select a size."],
  ["Out of stock", messageFor("OUT_OF_STOCK"), "This item is currently out of stock."],
  ["Insufficient stock", messageFor("INSUFFICIENT_STOCK", { available: 3 }), "Only 3 left in stock."],
  ["Invalid address", first(v.addressSchema, { ...addr, postalCode: "12" }), "Please enter a valid 6-digit PIN code."],
  ["Checkout without an address", messageFor("ADDRESS_REQUIRED"), "Please add or select a delivery address."],
  ["Empty cart checkout", messageFor("EMPTY_CART"), "Your cart is empty."],
  ["Invalid product/variant", messageFor("INVALID_VARIANT"), "This product is no longer available."],
  ["Protected feature as guest", messageFor("UNAUTHENTICATED"), "Please log in to continue."],
];
for (const [row, got, want] of rows) ok(got === want, `req §28 "${row}" → "${got}"`);
ok(messageFor("INSUFFICIENT_STOCK", { available: 2, productName: "Aurora Sneakers" }) === "Only 2 units of Aurora Sneakers are available. Please update the quantity.", "insufficient stock with product name matches the req §24.1 example");
const codes = ["VALIDATION","UNAUTHENTICATED","NOT_FOUND","INVALID_CREDENTIALS","EMAIL_TAKEN","VARIANT_REQUIRED","INVALID_VARIANT","OUT_OF_STOCK","INSUFFICIENT_STOCK","INVALID_QUANTITY","EMPTY_CART","ADDRESS_REQUIRED","INVALID_ADDRESS","ORDER_NOT_CANCELLABLE","UNKNOWN"];
const all = codes.map(c => messageFor(c));
ok(all.every(m => m && !/undefined|null|error|exception|[A-Z]{2,}_[A-Z]/.test(m)), `all ${codes.length} codes have messages with no technical text`);
const e = new ApiError("OUT_OF_STOCK", { productName: "X" });
ok(isApiError(e) && e instanceof Error && e.code === "OUT_OF_STOCK" && getErrorMessage(e) === "X is currently out of stock.", "ApiError carries code + details");
ok(getErrorMessage(new TypeError("Cannot read properties of undefined")) === "Something went wrong. Please try again." && getErrorMessage("boom") === "Something went wrong. Please try again.", "non-ApiError values get the friendly fallback (no technical text leaks)");
console.log(fail ? `${fail} FAILED` : "ALL PASS");
