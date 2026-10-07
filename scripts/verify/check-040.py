import re,json,urllib.request
fail=0
def ok(c,m):
    global fail; print(("PASS " if c else "FAIL ")+m); fail+=(not c)
def get(p):
    try: r=urllib.request.urlopen("http://localhost:3100"+p); return r.status,r.read().decode()
    except urllib.error.HTTPError as e: return e.code,e.read().decode()
head=lambda h:h[h.find("<head"):h.find("</head>")]
st,h=get("/p/samsung-galaxy-s24-ultra")
ok(st==200 and re.search(r"<h1[^>]*>Samsung Galaxy S24 Ultra</h1>",h) and h.count("<h1")==1, "S24 Ultra: 200, single <h1> with the product name")
ok(re.search(r"<title>Samsung Galaxy S24 Ultra \| Nivora</title>",head(h)) is not None and 'property="og:image" content="https://images.unsplash.com/photo-' in head(h), "title and product photo as og:image")
ok(">From<" in h and "₹1,29,999" in h and "₹1,39,999" in h, "price shows From ₹1,29,999 with MRP struck")
ok("Snapdragon 8 Gen 3" in h and ">Specifications<" in h and ">Product details<" in h and "200 MP camera" in h, "description and specifications server-rendered")
ok(all(x in h for x in ['aria-label="Previous image"','aria-label="Show image 2"','aria-roledescription="carousel"']), "gallery: thumbnails + prev/next controls")
ok(h.count('role="radiogroup"')==3 and 'value="512 GB"' in h, "variant selector: Color, RAM, Storage radio groups")
L=[json.loads(b) for b in re.findall(r'<script type="application/ld\+json">(.*?)</script>',h,re.S)]
prod=[d for d in (L[0] if isinstance(L[0],list) else L) if d["@type"]=="Product"][0]
ok(prod["offers"]["priceCurrency"]=="INR" and prod["offers"]["lowPrice"]==129999 and prod["offers"]["highPrice"]==149999-10000 and prod["aggregateRating"]["ratingValue"]==4.6 and prod["offers"]["availability"].endswith("InStock"), f"Product JSON-LD: INR {prod['offers']['lowPrice']}–{prod['offers']['highPrice']}, rating {prod['aggregateRating']['ratingValue']}, InStock")
ok([i["name"] for i in [d for d in L[0] if d["@type"]=="BreadcrumbList"][0]["itemListElement"]]==["Home","Mobiles","Smartphones","Samsung Galaxy S24 Ultra"], "BreadcrumbList Home › Mobiles › Smartphones › product")
st,h=get("/p/realme-narzo-70-pro-5g")
ok("Out of Stock" in h and len(re.findall(r'<button[^>]*disabled=""[^>]*>[^<]*(?:<[^>]+>)*\s*(?:Add to Cart|Buy Now)',h))>=2, "fully out-of-stock product: 'Out of Stock' and purchase buttons disabled")
ok("OutOfStock" in h, "out-of-stock product JSON-LD availability = OutOfStock")
st,h=get("/p/urbano-classic-oxford-shirt")
ok(re.search(r'id="pdp-Color-White"[^>]*>|value="White"',h) and "Please select" not in h, "shirt: options rendered, no premature error message")
st,h=get("/p/does-not-exist")
ok(st==404 and "<main" in h and "We couldn&#x27;t find that page." in h, "unknown product slug → static 404 fully rendered in HTML")
st,h=get("/")
ok(h.count('aria-label="Add ')>=20 and h.count("to wishlist")>=20, f"cards on Home have Add to Cart ({h.count('aria-label=\"Add ')}) and wishlist hearts")
print("ALL PASS" if not fail else f"{fail} FAILED")
