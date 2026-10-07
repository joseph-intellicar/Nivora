def lum(h):
    h=h.lstrip('#'); c=[int(h[i:i+2],16)/255 for i in (0,2,4)]
    c=[x/12.92 if x<=0.03928 else ((x+0.055)/1.055)**2.4 for x in c]
    return 0.2126*c[0]+0.7152*c[1]+0.0722*c[2]
def cr(a,b):
    l1,l2=sorted([lum(a),lum(b)],reverse=True); return (l1+0.05)/(l2+0.05)
W='#ffffff'; CANVAS='#f6f8f8'
pairs=[
 ("ink on white","#13201f",W),("ink on canvas","#13201f",CANVAS),
 ("ink-muted on white","#4b5958",W),("ink-subtle on white","#647170",W),("ink-subtle on canvas","#647170",CANVAS),
 ("white on brand-700 (primary btn)",W,"#0b645c"),("white on brand-800 (btn hover)",W,"#0d504b"),
 ("brand-700 link on white","#0b645c",W),("brand-700 on brand-50","#0b645c","#effcf9"),
 ("sale text on white","#c2361b",W),("white on accent-600","#ffffff","#c2361b"),
 ("success text on white","#15803d",W),("warning text on white","#a14a06",W),("danger text on white","#b42318",W),
 ("focus ring brand-600 vs white (non-text >=3)","#0a7d72",W),("border-strong vs white (inputs >=3)","#8a9897",W),
]
for n,f,b in pairs:
    r=cr(f,b); need=3 if '>=3' in n else 4.5
    print(f"{'PASS' if r>=need else 'FAIL'} {r:5.2f}  {n}")
