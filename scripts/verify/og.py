import sys
from PIL import Image, ImageDraw, ImageFont
SP=sys.argv[1]; OUT=sys.argv[2]
W,H=1200,630
img=Image.new("RGB",(W,H),"#0b645c"); d=ImageDraw.Draw(img)
# soft decorative circles
d.ellipse((780,-160,1360,420),fill="#0d504b"); d.ellipse((900,330,1300,730),fill="#0a7d72")
def font(size, weight):
    try:
        f=ImageFont.truetype(f"{SP}/jakarta.ttf",size)
        f.set_variation_by_name(weight); return f
    except Exception as e:
        print("fallback font:",e); return ImageFont.truetype("/usr/share/fonts/truetype/noto/NotoSans-Bold.ttf",size)
# mark: white tile with lagoon arch and coral spark
x,y,s=96,150,150
d.rounded_rectangle((x,y,x+s,y+s),radius=38,fill="#ffffff")
k=s/64
d.arc((x+19*k,y+17*k,x+45*k,y+43*k),180,360,fill="#0b645c",width=int(7*k))
d.line((x+19*k,y+30*k,x+19*k,y+47*k),fill="#0b645c",width=int(7*k))
d.line((x+45*k,y+30*k,x+45*k,y+47*k),fill="#0b645c",width=int(7*k))
for cx in (19,45): d.ellipse((x+(cx-3.5)*k,y+(47-3.5)*k,x+(cx+3.5)*k,y+(47+3.5)*k),fill="#0b645c")
d.ellipse((x+42*k,y+12*k,x+52*k,y+22*k),fill="#ff7f5e")
d.text((x+s+40,y-6),"nivora",font=font(150,"ExtraBold"),fill="#ffffff")
d.text((x,y+s+70),"Fashion · Home Appliances · Beauty · Toys · Mobiles",font=font(40,"SemiBold"),fill="#c9f5ec")
d.text((x,y+s+130),"Great prices. Cash on Delivery.",font=font(40,"Medium"),fill="#ffad97")
img.save(OUT,optimize=True); print("saved",img.size)
