import re,urllib.request
def get(p): return urllib.request.urlopen("http://localhost:3100"+p).read().decode()
fail=0
def ok(c,m):
    global fail; print(("PASS " if c else "FAIL ")+m); fail+=(not c)
# Guest shopping: Home → Category → Subcategory → Product (each step via a link found on the previous page)
h=get("/"); step1=re.search(r'href="(/c/fashion)"',h)
c=get(step1.group(1)); step2=re.search(r'href="(/c/fashion/men)"',c)
s=get(step2.group(1)); step3=re.search(r'<h2[^>]*><a [^>]*href="(/p/[a-z0-9-]+)"',s)
p=get(step3.group(1))
ok(all([step1,step2,step3]) and "Add to Cart" in p and "Buy Now" in p, f"Home → /c/fashion → /c/fashion/men → {step3.group(1)} (Add to Cart + Buy Now present)")
# Search → filter → product
r=get("/search?q=phone"); f=re.search(r'href="(/search\?q=phone&amp;[^"]*)"',r) or re.search(r'href="(/search\?q=phone[^"]*sort[^"]*)"',r)
fr=get("/search?q=phone&category=mobiles&brand=Samsung"); prod=re.search(r'<h2[^>]*><a [^>]*href="(/p/[a-z0-9-]+)"',fr)
ok("Results for “phone”" in r and prod and "samsung" in prod.group(1) and "Add to Cart" in get(prod.group(1)), f"Search 'phone' → filter Mobiles + Samsung → {prod.group(1) if prod else None}")
# Variant selection on a product page reached from search
ok(get("/p/samsung-galaxy-s24-ultra").count('role="radiogroup"')==3, "variant selectors present on the product page")
print("ALL PASS" if not fail else f"{fail} FAILED")
