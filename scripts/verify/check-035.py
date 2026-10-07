import re, urllib.request, json, subprocess
BASE="http://localhost:3100"
def get(path):
    try:
        r=urllib.request.urlopen(BASE+path); return r.status, r.read().decode()
    except urllib.error.HTTPError as e: return e.code, e.read().decode()
fail=0
def ok(c,m):
    global fail; print(("PASS " if c else "FAIL ")+m); fail+= (not c)
cats={"fashion":["men","women","kids","footwear","accessories"],"home-appliances":["refrigerators","washing-machines","air-conditioner","kitchen"],"beauty":["skincare","haircare","makeup","fragrances","personal-care"],"toys":["educational-toys","action-figures","dolls","remote-control-toys","outdoor-toys","board-games"],"mobiles":["smartphones","mobile-accessories","cases-covers","chargers"]}
paths=[f"/c/{c}" for c in cats]+[f"/c/{c}/{s}" for c,subs in cats.items() for s in subs]
good=0
for p in paths:
    st,h=get(p)
    h1=re.findall(r"<h1[^>]*>(.*?)</h1>",h,re.S)
    count=re.search(r"Showing [0-9,]+–[0-9,]+ of ([0-9,]+) products?",h)
    chips=len(re.findall(r'aria-label="[^"]+ subcategories"',h))
    if st==200 and len(h1)==1 and count and chips>=1: good+=1
    else: print("  problem:",p,st,h1,bool(count))
ok(good==29, f"{good}/29 category + subcategory pages: 200, one <h1>, product count, subcategory nav")
st,h=get("/c/fashion"); ok("Showing 1–24 of 34 products" in h and h.count("<article")==24, "Fashion page 1: 'Showing 1–24 of 34 products', 24 cards")
st,h=get("/c/fashion?page=2"); ok("Showing 25–34 of 34 products" in h and h.count("<article")==10 and 'aria-current="page" class="inline-flex h-10 min-w-10' in h, "Fashion page 2: 'Showing 25–34', 10 cards, page 2 current")
st,h=get("/c/fashion/men"); ok(re.search(r'href="/c/fashion/men"[^>]*aria-current="page"|aria-current="page"[^>]*href="/c/fashion/men"',h) is not None and "Men · Fashion" in h, "subcategory chip marked current; heading 'Men · Fashion'")
for p in ["/c/unknown","/c/fashion/unknown","/c/mobiles/men"]:
    st,h=get(p); ok(st==404 and ("We couldn&#x27;t find that page." in h or "We couldn't find that page." in h), f"{p} → {st} Nivora 404")
def prices(h): return [int(x.replace(",","")) for x in re.findall(r'<span class="sr-only">Price </span>₹([0-9,]+)',h)]
st,h=get("/c/mobiles?sort=price-asc"); pa=prices(h); ok(len(pa)>5 and pa==sorted(pa), f"price-asc in HTML: {pa[:4]}…")
st,h=get("/c/mobiles?sort=price-desc"); pd=prices(h); ok(len(pd)>5 and pd==sorted(pd,reverse=True), f"price-desc in HTML: {pd[:3]}…")
st,h=get("/c/fashion/men"); names=re.findall(r'<h2[^>]*><a [^>]*href="/p/([a-z0-9-]+)"',h); oos=h.count(">Out of Stock</span>")
ok(oos>=1 and names[-1]=="northline-formal-striped-shirt", f"out-of-stock product shows the badge and sorts last under relevance ({oos} badge)")
st,h=get("/c/fashion?sort=bogus&page=999"); ok(st==200 and "Showing 25–34 of 34" in h, "bogus sort and out-of-range page are handled (last page, default sort)")
print("ALL PASS" if not fail else f"{fail} FAILED")
