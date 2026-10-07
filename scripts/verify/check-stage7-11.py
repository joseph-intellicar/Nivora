import re,urllib.request
fail=0
def ok(c,m):
    global fail; print(("PASS " if c else "FAIL ")+m); fail+=(not c)
def get(p):
    try: r=urllib.request.urlopen("http://localhost:3100"+p); return r.status,r.read().decode()
    except urllib.error.HTTPError as e: return e.code,e.read().decode()
LEAKS=r"Your Wishlist|Saved Addresses|Your Orders|Checkout</h1>|Thank you for shopping|Order NIV-|Save Changes|Place Order"
for p in ["/wishlist","/account","/account/orders","/account/orders/NIV-2026-000001","/account/addresses","/checkout","/order-confirmation/NIV-2026-000001"]:
    st,h=get(p)
    visible=re.sub(r"<script.*?</script>","",h,flags=re.S)  # RSC payload may carry static headings (TASK-060 rule)
    ok(st==200 and "Loading…" in h and not re.search(LEAKS,visible) and 'content="noindex, nofollow"' in h, f"{p}: guard skeleton only, noindex")
info={"about":"About Nivora","contact":"Contact","help":"Help","returns":"Returns","privacy":"Privacy","terms":"Terms"}
for slug,title in info.items():
    st,h=get("/"+slug)
    h2=re.findall(r"<h2[^>]*>([^<]+)</h2>",h)
    ok(st==200 and re.search(rf"<h1[^>]*>{re.escape(title)}</h1>",h) and h.count("<h1")==1 and len(h2)>=1 and f'<link rel="canonical" href="http://localhost:3000/{slug}"' in h, f"/{slug}: one h1 '{title}', {len(h2)} section(s), canonical")
st,h=get("/help"); ok("Cash on Delivery only" in h and "₹499" in h, "Help page explains COD-only payment and delivery charges")
st,h=get("/returns"); ok("not available yet" in h, "Returns page is policy text only (no returns feature)")
for p,kind in [("/p/does-not-exist","static"),("/xyz","static"),("/c/unknown","dynamic"),("/collections/unknown","dynamic")]:
    st,h=get(p); full="<main" in h and "We couldn&#x27;t find that page." in h
    ok(st==404 and (full if kind=="static" else "couldn't find that page." in h), f"{p} → {st} Nivora 404 ({'full HTML' if full else 'rendered in the browser'})")
st,x=get("/sitemap.xml"); ok(len(re.findall(r"<loc>",x))==193, "sitemap still 193 URLs")
print("ALL PASS" if not fail else f"{fail} FAILED")
