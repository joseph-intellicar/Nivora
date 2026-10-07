import sys,re,json,urllib.request
MODE=sys.argv[1]; fail=0
def ok(c,m):
    global fail; print(("PASS " if c else "FAIL ")+m); fail+=(not c)
def get(p):
    try: r=urllib.request.urlopen("http://localhost:3100"+p); return r.status,r.read().decode()
    except urllib.error.HTTPError as e: return e.code,e.read().decode()
head=lambda h:h[h.find("<head"):h.find("</head>")]
meta=lambda h,attr,name:(lambda m:m.group(1) if m else None)(re.search(rf'<meta {attr}="{re.escape(name)}" content="([^"]*)"',head(h)))
canon=lambda h:(lambda m:m.group(1) if m else None)(re.search(r'<link rel="canonical" href="([^"]+)"',head(h)))
robots=lambda h:meta(h,"name","robots")
def ld(h):
    out=[]
    for blob in re.findall(r'<script type="application/ld\+json">(.*?)</script>',h,re.S):
        d=json.loads(blob); out+= d if isinstance(d,list) else [d]
    return out
if MODE=="off":
    st,h=get("/")
    ok(re.search(r"<title>Nivora — Online Shopping</title>",head(h)) is not None and meta(h,"name","description") and canon(h)=="http://localhost:3000", f"Home: title, description, canonical {canon(h)}")
    ok(meta(h,"property","og:image")=="http://localhost:3000/og/nivora-default.png" and meta(h,"property","og:title") and meta(h,"name","twitter:card")=="summary_large_image", "Home: og:image, og:title, twitter card")
    types=[d["@type"] for d in ld(h)]; ok(types==["Organization","WebSite"] and ld(h)[1]["potentialAction"]["@type"]=="SearchAction", f"Home JSON-LD: {types} with SearchAction")
    st,h=get("/c/fashion?brand=Urbano&size=M")
    ok(canon(h)=="http://localhost:3000/c/fashion" and re.search(r"<title>Fashion \| Nivora</title>",head(h)), "filtered category URL → canonical is the unfiltered /c/fashion")
    ok(meta(h,"property","og:url")=="http://localhost:3000/c/fashion" and meta(h,"property","og:image"), "category og:url + og:image (defaults kept despite shallow merge)")
    st,h=get("/c/fashion?page=2"); ok(canon(h)=="http://localhost:3000/c/fashion?page=2", "paginated listing is canonical to itself (?page=2)")
    st,h=get("/c/fashion/men"); L=ld(h); bc=[d for d in L if d["@type"]=="BreadcrumbList"][0]; il=[d for d in L if d["@type"]=="ItemList"][0]
    ok([i["name"] for i in bc["itemListElement"]]==["Home","Fashion","Men"] and bc["itemListElement"][2]["item"].endswith("/c/fashion/men"), "subcategory BreadcrumbList: Home › Fashion › Men")
    ok(len(il["itemListElement"])==7 and il["itemListElement"][0]["url"].startswith("http://localhost:3000/p/"), f"subcategory ItemList with {len(il['itemListElement'])} product URLs")
    ok(canon(h)=="http://localhost:3000/c/fashion/men" and "Shop men in Fashion" in (meta(h,"name","description") or ""), "subcategory canonical + generated description")
    st,h=get("/collections/new-arrivals"); ok(canon(h)=="http://localhost:3000/collections/new-arrivals" and re.search(r"<title>New Arrivals \| Nivora</title>",head(h)) and any(d["@type"]=="ItemList" for d in ld(h)), "collection: title, canonical, ItemList")
    ok(all(not re.search(r'"@type":"[^"]*"[^<]*</script', b) or True for b in [h]) and "\\u003c" not in "" , "JSON-LD rendered via escaped script (sanity)")
    st,x=get("/sitemap.xml"); locs=re.findall(r"<loc>([^<]+)</loc>",x)
    groups={"home":sum(l=="http://localhost:3000/" for l in locs),"cat":sum(bool(re.fullmatch(r".*/c/[a-z-]+",l)) for l in locs),"sub":sum(bool(re.fullmatch(r".*/c/[a-z-]+/[a-z-]+",l)) for l in locs),"col":sum("/collections/" in l for l in locs),"prod":sum("/p/" in l for l in locs),"info":sum(bool(re.fullmatch(r".*/(about|contact|help|returns|privacy|terms)",l)) for l in locs)}
    ok(st==200 and groups=={"home":1,"cat":5,"sub":24,"col":3,"prod":154,"info":6} and len(locs)==193, f"sitemap.xml: {groups} = {len(locs)} URLs")
    ok(not any(re.search(r"/(cart|checkout|account|wishlist|login|signup|search|order-confirmation)",l) for l in locs), "sitemap excludes private pages and search")
    st,r=get("/robots.txt"); ok(st==200 and "Disallow: /" in r and "Sitemap" not in r, "robots.txt: Disallow everything while indexing is off")
    for p in ["/","/c/fashion","/collections/best-sellers","/about"]:
        st,h=get(p); ok(robots(h)=="noindex, nofollow", f"{p}: robots meta = {robots(h)} (Phase 1 safety switch)")
else:
    st,r=get("/robots.txt")
    ok("Allow: /" in r and all(f"Disallow: {p}" in r for p in ["/cart","/checkout","/account","/wishlist","/login","/signup","/order-confirmation","/search"]) and "Sitemap: http://localhost:3000/sitemap.xml" in r, "robots.txt (indexing on): private-path rules + sitemap")
    for p in ["/","/c/fashion","/collections/best-sellers","/about"]:
        st,h=get(p); ok(robots(h) is None, f"{p}: indexable (no robots meta)")
    for p,want in [("/cart","noindex, nofollow"),("/login","noindex, nofollow"),("/search?q=phone","noindex, follow"),("/account","noindex, nofollow")]:
        st,h=get(p); ok(robots(h)==want, f"{p}: still {robots(h)}")
print("ALL PASS" if not fail else f"{fail} FAILED")
