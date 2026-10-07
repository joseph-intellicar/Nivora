const shim = await import("./browser-shim.mjs");
const storage = await import("@/api/client/mock/storage");
const { ensureSeeded } = await import("@/api/client/mock/seed");
const session = await import("@/api/client/mock/session");
const { request } = await import("@/api/client/mock/latency");
const { ApiError } = await import("@nivora/shared/errors");
let fail = 0; const ok = (c, m) => { console.log((c ? "PASS " : "FAIL ") + m); if (!c) fail++; };
// seeding
ensureSeeded();
const users = JSON.parse(shim.raw("users")), orders = JSON.parse(shim.raw("orders"));
ok(users.length === 1 && users[0].email === "joseph@example.com" && orders.length === 4 && shim.raw("order_counter") === "4", "first launch seeds the test user, 4 sample orders, order counter 4");
ok(shim.raw("auth_session") === undefined && session.currentUser() === null, "no session after seeding → isAuthenticated = false");
ensureSeeded(); shim.setRaw("seed_version", "0"); ensureSeeded();
ok(JSON.parse(shim.raw("users")).length === 1 && JSON.parse(shim.raw("orders")).length === 4, "seeding is idempotent (even when re-run after a version reset)");
ok([...shim.backing.keys()].every(k => k.startsWith("nivora:v1:")), "all keys namespaced nivora:v1:");
// corrupt data
shim.setRaw("cart", "{not json"); ok(JSON.stringify(storage.read("cart", { guest: [], byUser: {} }, storage.isRecord)) === '{"guest":[],"byUser":{}}', "corrupt cart JSON → safe empty default");
shim.setRaw("users", '"a string"'); ok(session.readUsers().length === 0, "users of the wrong shape → empty list, no crash");
shim.setRaw("users", JSON.stringify(users));
// sessions
session.startSession("user-joseph"); ok(session.currentUser()?.name === "Joseph" && session.toPublicUser(session.currentUser()).password === undefined, "valid session resolves the user; public user has no password");
shim.setRaw("auth_session", JSON.stringify({ userId: "user-deleted" })); ok(session.currentUser() === null, "session pointing to a missing user → guest");
shim.setRaw("auth_session", "garbage"); ok(session.currentUser() === null, "malformed session → guest");
let threw = null; try { session.requireUser(); } catch (e) { threw = e; } ok(threw instanceof ApiError && threw.code === "UNAUTHENTICATED", "requireUser throws UNAUTHENTICATED for guests");
session.startSession("user-joseph"); session.endSession(); ok(shim.raw("auth_session") === undefined && shim.raw("users") && shim.raw("orders"), "endSession removes only the session");
// request wrapper
ok((await request(() => 42)) === 42, "request() resolves handler results");
let e2 = null; try { await request(() => { throw new ApiError("EMPTY_CART"); }); } catch (e) { e2 = e; } ok(e2?.code === "EMPTY_CART", "ApiErrors pass through request()");
let e3 = null; try { await request(() => { throw new TypeError("boom"); }); } catch (e) { e3 = e; } ok(e3 instanceof ApiError && e3.code === "UNKNOWN", "unexpected errors become ApiError(UNKNOWN)");
// blocked storage → memory fallback
globalThis.window = { get localStorage() { throw new Error("SecurityError"); } };
storage.write("wishlist", { u: ["p1"] }); ok(JSON.stringify(storage.read("wishlist", {}, storage.isRecord)) === '{"u":["p1"]}', "blocked localStorage → in-memory fallback keeps working");
// server (no window)
delete globalThis.window;
ok(JSON.stringify(storage.read("cart", { guest: [] })) === '{"guest":[]}' && session.currentUser() === null, "on the server: reads return defaults, no session");
let e4 = null; try { storage.write("cart", {}); } catch (e) { e4 = e; } ok(e4?.code === "UNKNOWN", "on the server: writes are refused with ApiError(UNKNOWN)");
console.log(fail ? `${fail} FAILED` : "ALL PASS");
