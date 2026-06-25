from pathlib import Path
from PIL import Image, ImageDraw
root = Path(r'D:\study\网页设计与开发\结课')
album_dir = root/'public/images/desktop-album-library'
book_dir = root/'public/images/desktop-books-cropped'
preview_dir = root/'tmp_media_recrop_preview'
preview_dir.mkdir(exist_ok=True)

# Albums: remove screenshot/UI edge pixels with a slight center crop.
for p in sorted(album_dir.glob('album-*.webp')):
    im = Image.open(p).convert('RGB')
    w,h = im.size
    trim = max(4, round(min(w,h) * 0.025))
    im = im.crop((trim, trim, w-trim, h-trim))
    im = im.resize((220,220), Image.LANCZOS)
    im.save(preview_dir/p.name, 'WEBP', quality=94, method=6)

# Books: remove only outside near-white border, keep pale covers intact.
def crop_white_border(im, threshold=246, padding=1):
    im = im.convert('RGB')
    px = im.load()
    w,h = im.size
    xs=[]; ys=[]
    for y in range(h):
        for x in range(w):
            r,g,b = px[x,y]
            if not (r >= threshold and g >= threshold and b >= threshold):
                xs.append(x); ys.append(y)
    if not xs:
        return im
    l=max(0,min(xs)-padding); t=max(0,min(ys)-padding)
    r=min(w,max(xs)+1+padding); b=min(h,max(ys)+1+padding)
    return im.crop((l,t,r,b))

for p in sorted(book_dir.glob('book-*.webp')):
    im = Image.open(p).convert('RGB')
    cropped = crop_white_border(im, 246, 1)
    # A second conservative pass catches anti-aliased white gutters.
    cropped = crop_white_border(cropped, 250, 0)
    cropped.save(preview_dir/p.name, 'WEBP', quality=94, method=6)

# Contact sheet for quick visual check.
items=[]
for p in sorted(preview_dir.glob('album-*.webp'))[:18]:
    im=Image.open(p).convert('RGB'); im.thumbnail((96,96), Image.LANCZOS)
    canvas=Image.new('RGB',(112,126),'#d8eafd')
    canvas.paste(im,((112-im.width)//2,8))
    ImageDraw.Draw(canvas).text((5,108),p.stem[-3:],fill=(0,0,0))
    items.append(canvas)
for p in sorted(preview_dir.glob('book-*.webp')):
    im=Image.open(p).convert('RGB'); im.thumbnail((96,118), Image.LANCZOS)
    canvas=Image.new('RGB',(112,136),'#d8eafd')
    canvas.paste(im,((112-im.width)//2,8))
    ImageDraw.Draw(canvas).text((5,120),p.stem,fill=(0,0,0))
    items.append(canvas)
cols=6; rows=(len(items)+cols-1)//cols
sheet=Image.new('RGB',(cols*112, rows*136),'#d8eafd')
for i,item in enumerate(items): sheet.paste(item,((i%cols)*112,(i//cols)*136))
sheet.save(root/'media-recrops-preview.jpg', quality=92)
print(root/'media-recrops-preview.jpg')
