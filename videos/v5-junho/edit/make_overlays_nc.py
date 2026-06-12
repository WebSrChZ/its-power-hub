"""Overlays para Jun.Vid05_NoCaptions (2160x3840, 30fps).

nc_t1.png   "Eles podiam treinar em qualquer lugar."        Georgia Italic
nc_t2.png   "Mas escolheram treinar juntos." / "Aqui."      Georgia Italic
nc_t3.png   "Na It's Power, eles encontraram" / "algo diferente."  Georgia Italic
nc_cta.png  coracao laranja + "Marca quem treinaria contigo."     Georgia Bold
"""
from PIL import Image, ImageDraw, ImageFont, ImageFilter

W, H = 2160, 3840
GEORGIA_I = r"C:\Windows\Fonts\georgiai.ttf"
GEORGIA_B = r"C:\Windows\Fonts\georgiab.ttf"
WHITE = (255, 255, 255, 255)
ORANGE = (245, 130, 31, 255)

def draw_text_block(lines, font, fill, center_y, line_gap=36,
                    shadow_alpha=150, shadow_blur=18, shadow_dy=8):
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

    sh = Image.new('RGBA', (W, H), (0, 0, 0, 0))
    alpha = text_layer.split()[3].point(lambda a: int(a * shadow_alpha / 255))
    black = Image.new('RGBA', (W, H), (0, 0, 0, 255))
    sh.paste(black, (0, shadow_dy), alpha)
    sh = sh.filter(ImageFilter.GaussianBlur(shadow_blur))
    canvas = Image.alpha_composite(canvas, sh)
    canvas = Image.alpha_composite(canvas, text_layer)
    return canvas

def draw_heart(canvas, cx, cy, size, fill):
    d = ImageDraw.Draw(canvas)
    r = size // 4
    d.ellipse([cx - 2 * r, cy - r, cx, cy + r], fill=fill)
    d.ellipse([cx, cy - r, cx + 2 * r, cy + r], fill=fill)
    d.polygon([(cx - 2 * r + int(r * 0.13), cy + int(r * 0.6)),
               (cx + 2 * r - int(r * 0.13), cy + int(r * 0.6)),
               (cx, cy + int(2.1 * r))], fill=fill)
    return canvas

YC = int(H * 0.62)
f104i = ImageFont.truetype(GEORGIA_I, 104)
f108b = ImageFont.truetype(GEORGIA_B, 108)

draw_text_block(["Eles podiam treinar", "em qualquer lugar."], f104i, WHITE, YC).save('edit/nc_t1.png')
draw_text_block(["Mas escolheram", "treinar juntos. Aqui."], f104i, WHITE, YC).save('edit/nc_t2.png')
draw_text_block(["Na It's Power, eles", "encontraram algo diferente."], f104i, WHITE, YC).save('edit/nc_t3.png')

cta = draw_text_block(["Marca quem", "treinaria contigo."], f108b, WHITE, YC)
cta = draw_heart(cta, W // 2, YC - 330, 110, ORANGE)
cta.save('edit/nc_cta.png')

print("overlays nc OK")
