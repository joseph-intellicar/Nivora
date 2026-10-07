const shim = await import("./browser-shim.mjs");
const { mockAuth: auth } = await import("@/api/client/mock/auth");
const { mockProfile: profile } = await import("@/api/client/mock/profile");
const { writeLines, readLines } = await import("@/api/client/mock/cartStore");
let fail = 0; const ok = (c, m) => { console.log((c ? "PASS " : "FAIL ") + m); if (!c) fail++; };
const code = async (p) => { try { await p; return "OK"; } catch (e) { return e.code + (e.details?.fields ? " " + JSON.stringify(e.details.fields) : ""); } };
ok((await auth.getSession()) === null, "fresh browser: not logged in");
ok((await code(auth.login({ email: "joseph@example.com", password: "wrong-pass1" }))) === "INVALID_CREDENTIALS", "wrong password → INVALID_CREDENTIALS");
ok((await code(auth.login({ email: "nobody@example.com", password: "password123" }))) === "INVALID_CREDENTIALS", "unknown email → same generic INVALID_CREDENTIALS");
const r = await auth.login({ email: "JOSEPH@example.com ", password: "password123" });
ok(r.user.name === "Joseph" && r.user.password === undefined && (await auth.getSession())?.email === "joseph@example.com", "JOSEPH@example.com␠ logs in (case-insensitive, trimmed); no password returned");
// data that must survive logout
shim.setRaw("wishlist", JSON.stringify({ "user-joseph": ["p1"] }));
shim.setRaw("addresses", JSON.stringify({ "user-joseph": [{ id: "a1" }] }));
shim.setRaw("checkout_session", JSON.stringify({ "user-joseph": { source: "buy_now", buyNow: { variantId: "v", quantity: 1 } }, "other": { source: "cart" } }));
await auth.logout();
ok((await auth.getSession()) === null && shim.raw("auth_session") === undefined, "logout clears the session");
ok(JSON.parse(shim.raw("wishlist"))["user-joseph"].length === 1 && JSON.parse(shim.raw("addresses"))["user-joseph"].length === 1 && JSON.parse(shim.raw("orders")).length === 4 && JSON.parse(shim.raw("users")).length === 1, "after logout the wishlist, addresses, orders and account still exist");
ok(JSON.stringify(JSON.parse(shim.raw("checkout_session"))) === '{"other":{"source":"cart"}}', "logout clears only this user's pending Buy Now");
// signup
ok((await code(auth.signup({ name: "Dup", email: "Joseph@Example.com", password: "password123", confirmPassword: "password123" }))).startsWith("EMAIL_TAKEN"), "duplicate email (any case) → EMAIL_TAKEN");
ok((await code(auth.signup({ name: "A", email: "a@b.co", password: "password", confirmPassword: "password" }))).startsWith("VALIDATION") , "weak password → VALIDATION with field message");
// merge: Joseph has a saved cart; guest adds items; login merges
const shirt = "urbano-classic-oxford-shirt-sky-blue-s"; // low stock: 2
const polo = "northline-pique-polo-t-shirt-black-l";
const tee = "tiny-trails-cotton-crew-t-shirt-pack-of-2-white-4-5y";
writeLines("user-joseph", [{ variantId: shirt, productId: "urbano-classic-oxford-shirt", quantity: 1 }]);
writeLines(null, [{ variantId: shirt, productId: "urbano-classic-oxford-shirt", quantity: 2 }, { variantId: polo, productId: "northline-pique-polo-t-shirt", quantity: 1 }]);
const m = await auth.login({ email: "joseph@example.com", password: "password123" });
const merged = readLines("user-joseph");
ok(merged.find(l => l.variantId === shirt)?.quantity === 2 && merged.find(l => l.variantId === polo)?.quantity === 1 && readLines(null).length === 0, "merge: same variant summed and capped at stock (1+2 → 2), new line added, guest cart emptied");
ok(m.mergedSavedItems === false, "mergedSavedItems false when the merged cart adds nothing beyond the guest cart (capped)");
await auth.logout();
writeLines(null, [{ variantId: tee, productId: "x", quantity: 1 }]);
ok((await auth.login({ email: "joseph@example.com", password: "password123" })).mergedSavedItems === true, "mergedSavedItems true when saved items were added to the guest's cart (D12)");
ok(readLines(null).length === 0 && readLines("user-joseph").length === 3, "each user sees their own cart; guest cart starts empty after logout/login");
// signup creates + logs in + merges
await auth.logout(); writeLines(null, [{ variantId: tee, productId: "x", quantity: 1 }]);
const s = await auth.signup({ name: "Priya", email: "Priya@Example.com", password: "secret123", confirmPassword: "secret123" });
ok(s.user.email === "priya@example.com" && (await auth.getSession())?.id === s.user.id && readLines(s.user.id).length === 1 && !s.mergedSavedItems, "signup creates the user, logs them in and keeps the guest cart");
await auth.logout(); ok((await auth.login({ email: "priya@example.com", password: "secret123" })).user.name === "Priya", "new account can log in again after logout");
// profile
const p1 = await profile.update({ name: "Priya S", phone: "9123456789", email: "hacker@x.com" });
ok(p1.name === "Priya S" && p1.phone === "9123456789" && p1.email === "priya@example.com", "profile update: name + phone saved; email stays read-only");
ok((await code(profile.update({ name: "Priya", phone: "123" }))).startsWith("VALIDATION") && (await code(profile.update({ name: " " }))).startsWith("VALIDATION"), "invalid phone or empty name → VALIDATION");
ok((await profile.update({ name: "Priya", phone: "" })).phone === undefined, "clearing the phone removes it");
await auth.logout(); ok((await code(profile.get())) === "UNAUTHENTICATED", "guest profile access → UNAUTHENTICATED");
console.log(fail ? `${fail} FAILED` : "ALL PASS");
