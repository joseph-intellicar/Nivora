import re, urllib.request, urllib.parse, html, collections, concurrent.futures as cf
BASE="http://localhost:3100"
PROTECTED=("/account","/checkout","/order-confirmation","/wishlist","/login","/signup","/cart")
def fetch(path):
    try:
        r=urllib.request.urlopen(BASE+path,timeout=30); return path,r.status,r.read().decode()
    except urllib.error.HTTPError as e: return path,e.code,""
def links(page):
    out=set()
    for href in re.findall(r'<a [^>]*href="([^"]+)"',page):
        href=html.unescape(href)
        if href.startswith("/") and not href.startswith("//") and not href.startswith("/_next"): out.add(href.split("#")[0])
    return out
seen={}; parents={}; queue=["/"]; cap=1500
while queue and len(seen)<cap:
    batch=[p for p in dict.fromkeys(queue) if p not in seen][:40]; queue=[q for q in queue if q not in batch and q not in seen]
    with cf.ThreadPoolExecutor(12) as ex:
        for path,status,body in ex.map(fetch,batch):
            seen[path]=status
            if status==200 and not path.startswith(PROTECTED) and not path.startswith("/search"):
                for l in links(body):
                    # Don't explode on every filter combination: follow filter links one level deep only.
                    if "?" in path and "?" in l and not re.search(r"[?&]page=\d+$",l): continue
                    if l not in seen: parents.setdefault(l,path); queue.append(l)
by=collections.Counter(seen.values())
broken={p:s for p,s in seen.items() if s!=200}
kinds=collections.Counter(("product" if p.startswith("/p/") else "category" if re.fullmatch(r"/c/[a-z-]+",p) else "subcategory" if re.fullmatch(r"/c/[a-z-]+/[a-z-]+",p) else "listing+params" if p.startswith(("/c/","/collections/")) and "?" in p else "collection" if p.startswith("/collections/") else "info" if re.fullmatch(r"/(about|contact|help|returns|privacy|terms)",p) else "account/auth/cart" if p.startswith(PROTECTED) else "other") for p in seen)
print("crawled",len(seen),"URLs; statuses",dict(by))
print("by kind:",dict(kinds))
print("broken internal links:", {p:(s,parents.get(p)) for p,s in broken.items()} or "none")
products=sum(1 for p in seen if p.startswith("/p/"))
print(("PASS" if not broken else "FAIL"),"no broken internal links")
print(("PASS" if products==154 else "FAIL"),f"all {products}/154 product pages reachable by following links from Home")
print(("PASS" if kinds["category"]==5 and kinds["subcategory"]==24 and kinds["info"]==6 else "FAIL"),"all 5 categories, 24 subcategories and 6 info pages reachable")
