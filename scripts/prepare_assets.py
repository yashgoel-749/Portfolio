"""Create restrained portrait crops from the original; never overwrite it."""
from pathlib import Path
from PIL import Image, ImageEnhance, ImageFilter, ImageOps, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / 'public'
OUT.mkdir(exist_ok=True)
original = ImageOps.exif_transpose(Image.open(ROOT / 'yash.jpg')).convert('RGB')
# Retain the campus setting; focus on the face and upper body.
portrait = original.crop((61, 89, 440, 650))
portrait = ImageEnhance.Color(portrait).enhance(0.88)
portrait = ImageEnhance.Contrast(portrait).enhance(1.06)
portrait = ImageEnhance.Brightness(portrait).enhance(1.035)
portrait = portrait.resize((448, 660), Image.Resampling.LANCZOS)
portrait = portrait.filter(ImageFilter.UnsharpMask(radius=1.1, percent=65, threshold=3))
portrait.save(OUT / 'yash-portrait.webp', quality=88, method=6)

card = Image.new('RGB', (1200, 630), '#2354f4')
draw = ImageDraw.Draw(card)
font_path = next((path for path in [
    Path('C:/Windows/Fonts/arialbd.ttf'),
    Path('/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf'),
    Path('/System/Library/Fonts/Supplemental/Arial Bold.ttf'),
] if path.exists()), None)
if font_path is None:
    raise SystemExit('Install Arial Bold or DejaVu Sans Bold to generate the sharing image.')
title = ImageFont.truetype(str(font_path), 86)
body = ImageFont.truetype(str(font_path), 23)
draw.text((66, 125), 'YASH GOEL', fill='white', font=title)
draw.text((66, 245), 'CODE WITH', fill='white', font=title)
draw.text((66, 345), 'PURPOSE.', fill='#e6fb68', font=title)
draw.text((71, 495), 'FULL-STACK DEVELOPER / SELECTED WORK', fill='white', font=body)
card.paste(ImageOps.fit(portrait, (330, 490)), (820, 70))
card.save(OUT / 'social-card.jpg', quality=88, optimize=True)
print(f'Portrait: {(OUT / "yash-portrait.webp").stat().st_size:,} bytes')
