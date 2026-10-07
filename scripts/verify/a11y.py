import re, urllib.request
from html.parser import HTMLParser
PAGES=["/","/c/fashion","/c/fashion/men?brand=Urbano","/collections/new-arrivals","/search?q=phone","/p/samsung-galaxy-s24-ultra","/p/urbano-classic-oxford-shirt","/about","/login","/signup","/cart","/xyz"]
class Audit(HTMLParser):
    def __init__(s):
        super().__init__(); s.stack=[]; s.issues=[]; s.headings=[]; s.labels=set(); s.inputs=[]; s.landmarks=set(); s.lang=None; s.skip=False
        s.open_ctrl=None; s.text=""; s.in_script=False; s.label_depth=0
    def handle_starttag(s,tag,a):
        a=dict(a)
        if tag=="script": s.in_script=True
        if tag=="html": s.lang=a.get("lang")
        if tag in ("main","nav","header","footer"): s.landmarks.add(tag)
        if tag=="a" and a.get("href")=="#content": s.skip=True
        if re.fullmatch(r"h[1-6]",tag): s.headings.append(int(tag[1]))
        if tag=="img" and "alt" not in a: s.issues.append(f"<img> without alt: {a.get('src','')[:60]}")
        if tag=="label":
            s.label_depth+=1
            if a.get("for"): s.labels.add(a["for"])
        if tag in ("input","select","textarea") and a.get("type") not in ("hidden",):
            s.inputs.append((a.get("id"), bool(a.get("aria-label") or a.get("aria-labelledby")), s.label_depth>0, a.get("name")))
        if tag in ("button","a"):
            s.open_ctrl=(tag, a.get("aria-label") or a.get("title") or "", a.get("href","")); s.text=""
    def handle_endtag(s,tag):
        if tag=="script": s.in_script=False
        if tag=="label": s.label_depth-=1
        if tag in ("button","a") and s.open_ctrl:
            t,label,href=s.open_ctrl
            if not label.strip() and not s.text.strip() and not s.ctrl_hidden: s.issues.append(f"<{t}> without an accessible name {href[:40]}")
            s.open_ctrl=None
    ctrl_hidden=False
    def handle_data(s,d):
        if s.open_ctrl and not s.in_script: s.text+=d
fail=0
for page in PAGES:
    try: h=urllib.request.urlopen("http://localhost:3100"+page).read().decode()
    except urllib.error.HTTPError as e: h=e.read().decode()
    # links hidden from assistive tech (aria-hidden="true" + tabindex=-1) are exempt from naming
    h2=re.sub(r'<a [^>]*aria-hidden="true"[^>]*>.*?</a>','',h,flags=re.S)
    p=Audit(); p.feed(h2)
    issues=list(p.issues)
    if p.lang!="en": issues.append("html lang missing")
    if not p.skip: issues.append("no skip link")
    if not {"main","header","footer","nav"}<=p.landmarks: issues.append(f"landmarks {sorted(p.landmarks)}")
    if p.headings.count(1)!=1: issues.append(f"{p.headings.count(1)} <h1>")
    jumps=[(a,b) for a,b in zip(p.headings,p.headings[1:]) if b>a+1]
    if jumps: issues.append(f"heading level skips {jumps[:3]}")
    for iid,aria,wrapped,name in p.inputs:
        if not (aria or wrapped or (iid and iid in p.labels)): issues.append(f"unlabelled input name={name} id={iid}")
    fail+=bool(issues)
    print(("PASS " if not issues else "FAIL ")+f"{page:36} h1={p.headings.count(1)} headings={len(p.headings)} inputs={len(p.inputs)}"+("" if not issues else "\n      "+"\n      ".join(issues[:8])))
print("ALL PASS" if not fail else f"{fail} page(s) with issues")
