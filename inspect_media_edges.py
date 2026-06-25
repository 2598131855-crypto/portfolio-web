from pathlib import Path
from PIL import Image
root = Path(r'D:\study\网页设计与开发\结课')
for folder in ['desktop-album-library','desktop-books-cropped']:
    print(folder)
    for p in sorted((root/'public/images'/folder).glob('*.webp'))[:8]:
        im=Image.open(p)
        print(p.name, im.size)
