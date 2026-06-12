"""Render text overlay PNGs (2160x3840, transparent) for V5 Namorados re-edit.

t1.png       "Casais que treinam juntos..."          Georgia Italic, white, lower third
t2.png       "...têm algo que vai / além da academia." Georgia Italic, white, lower third
card_text.png "Feliz Dia dos Namorados." + orange heart, Georgia Bold, dark slate (card)
"""
from PIL import Image, ImageDraw, ImageFont, ImageFilter

W, H = 2160, 3840
GEORGIA_I = r"C:\Windows\Fonts\georgiai.ttf"
GEORGIA_B = r"C:\Windows\Fonts\georgiab.ttf"
WHITE = (255, 255, 255, 255)
SLATE = (47, 58, 69, 255)
ORANGE = (245, 130, 31, 255)

def draw_text_block(lines, font, fill, center_y, line_gap=36,
                    shadow=True, shadow_alpha=150, shadow_blur=18, shadow_dy=8):
    """Centered multi-line text with a soft blurred shadow. Returns RGBA canvas."""
    canvas = Image.new('RGBA', (W, H), (0, 0, 0, 0))
    tmp = ImageDraw.Draw(canvas)
    sizes = []
    for ln in lines:
        bb = tmp.textbbox((0, 0), ln, font=font)
        sizes.append((bb[2] - bb[0], bb[3] - bb[1], bb[0], bb[1]))
    total_h = sum(s[1] for s in sizes) + line_gap * (len(lines) - 1)
    y = center_y - total_h // 2

    text_layer = Image.new('RGBA', (W, H), (0, 0, 0, 0))
    td = ImageDraw.Draw(text_layer)
    for ln, (tw, th, ox, oy) in zip(lines, sizes):
        x = (W - tw) // 2 - ox
        td.text((x, y - oy), ln, font=font, fill=fill)
        y += th + line_gap

    if shadow:
        sh = Image.new('RGBA', (W, H), (0, 0, 0, 0))
        alpha = text_layer.split()[3].point(lambda a: int(a * shadow_alpha / 255))
        black = Image.new('RGBA', (W, H), (0, 0, 0, 255))
        sh.paste(black, (0, shadow_dy), alpha)
        sh = sh.filter(ImageFilter.GaussianBlur(shadow_blur))
        canvas = Image.alpha_composite(canvas, sh)
    canvas = Image.alpha_composite(canvas, text_layer)
    return canvas

def draw_heart(canvas, cx, cy, size, fill):
    """Classic heart: two circles + triangle."""
    d = ImageDraw.Draw(canvas)
    r = size // 4
    d.ellipse([cx - 2 * r, cy - r, cx, cy + r], fill=fill)
    d.ellipse([cx, cy - r, cx + 2 * r, cy + r], fill=fill)
    d.polygon([(cx - 2 * r + int(r * 0.13), cy + int(r * 0.6)),
               (cx + 2 * r - int(r * 0.13), cy + int(r * 0.6)),
               (cx, cy + int(2.1 * r))], fill=fill)
    return canvas

# t1 — lower third (62% height)
f100i = ImageFont.truetype(GEORGIA_I, 104)
t1 = draw_text_block(["Casais que treinam juntos..."], f100i, WHITE, int(H * 0.62))
t1.save('edit/t1.png')

# t2 — two lines, same anchor
t2 = draw_text_block(["...têm algo que vai", "além da academia."], f100i, WHITE, int(H * 0.62))
t2.save('edit/t2.png')

# card text — one line above the logo (logo ≈ y 1750-2150) + heart above
f130b = ImageFont.truetype(GEORGIA_B, 126)
card = draw_text_block(["Feliz Dia dos Namorados."], f130b, SLATE, 1430,
                       shadow=False)
card = draw_heart(card, W // 2, 1130, 130, ORANGE)
card.save('edit/card_text.png')

print("overlays OK")
for name in ('t1', 't2', 'card_text'):
    im = Image.open(f'edit/{name}.png')
    print(name, im.size)
