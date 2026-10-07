# Server-side route protection in http mode (P2-033): guests get 307 → /login?from=…; a session
# cookie lets protected pages render; public pages are never redirected.
import json, urllib.request, urllib.error, http.cookiejar
BASE = "http://localhost:3100"
fail = 0
def ok(c, m):
    global fail; print(("PASS " if c else "FAIL ") + m); fail += (not c)
class NoRedirect(urllib.request.HTTPRedirectHandler):
    def redirect_request(self, *a, **k): return None
jar = http.cookiejar.CookieJar()
guest = urllib.request.build_opener(NoRedirect)
user = urllib.request.build_opener(NoRedirect, urllib.request.HTTPCookieProcessor(jar))
def get(opener, path):
    try: r = opener.open(BASE + path); return r.status, r.headers.get("Location")
    except urllib.error.HTTPError as e: return e.code, e.headers.get("Location")
PROTECTED = ["/account", "/account/orders", "/account/orders/NIV-2026-000001", "/account/addresses", "/checkout", "/wishlist", "/order-confirmation/NIV-2026-000001"]
for p in PROTECTED:
    st, loc = get(guest, p)
    ok(st == 307 and loc and loc.endswith("/login?from=" + urllib.parse.quote(p, safe="")), f"guest {p} → {st} {loc}")
st, loc = get(guest, "/account/orders?tab=1")
ok(st == 307 and loc.endswith("from=%2Faccount%2Forders%3Ftab%3D1"), "query string kept in from")
for p in ["/", "/c/fashion", "/p/apple-iphone-15", "/cart", "/login", "/signup", "/search?q=phone"]:
    ok(get(guest, p)[0] == 200, f"public {p} → 200 for guests")
req = urllib.request.Request(BASE + "/api/auth/login", data=json.dumps({"email": "joseph@example.com", "password": "password123"}).encode(),
                             headers={"Content-Type": "application/json", "Origin": BASE}, method="POST")
ok(user.open(req).status == 200 and any(c.name == "nivora_session" for c in jar), "login sets the session cookie")
for p in PROTECTED[:6]:
    ok(get(user, p)[0] == 200, f"logged in {p} → 200")
print("ALL PASS" if not fail else f"{fail} FAILED")
