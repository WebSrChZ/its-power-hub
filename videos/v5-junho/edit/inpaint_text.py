"""Glyph-level text removal: mask near-white low-saturation pixels inside the
text region, dilate to swallow the tight shadow penumbra, Telea-inpaint.

Usage:
  inpaint_text.py frame  <in.png> <out.png> <region>            # single frame test
  inpaint_text.py batch  <in_dir> <out_dir> <region> [region2]  # frame sequence
Regions: t2 (lower-left lines), t3 (drifting center block), or t2+t3.
"""
import sys, os, glob
import cv2
import numpy as np

REGIONS = {
    't2': (240, 2380, 1990, 2830),   # x0,y0,x1,y1 — "...têm algo que vai / além da academia."
    't3': (505, 1435, 1745, 2300),   # "Feliz Dia / dos / Namorados." + drift margin
}

def build_mask(img, regions):
    h, w = img.shape[:2]
    region_mask = np.zeros((h, w), np.uint8)
    for (x0, y0, x1, y1) in regions:
        region_mask[y0:y1, x0:x1] = 255
    b, g, r = cv2.split(img.astype(np.int16))
    mn = np.minimum(np.minimum(b, g), r)
    mx = np.maximum(np.maximum(b, g), r)
    white = ((mn > 225) & ((mx - mn) < 32)).astype(np.uint8) * 255
    mask = cv2.bitwise_and(white, region_mask)
    # drop tiny specks (highlights on clothing), keep text strokes
    n, lab, stats, _ = cv2.connectedComponentsWithStats(mask, 8)
    clean = np.zeros_like(mask)
    for i in range(1, n):
        if stats[i, cv2.CC_STAT_AREA] >= 120:
            clean[lab == i] = 255
    # dilate well past the soft drop-shadow halo so the inpaint boundary
    # samples clean background, not shadow-darkened pixels
    clean = cv2.dilate(clean, cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (61, 61)))
    return clean

def process(img, regions):
    mask = build_mask(img, regions)
    if mask.max() == 0:
        return img, 0
    out = cv2.inpaint(img, mask, 7, cv2.INPAINT_TELEA)
    # melt patch edges: blend a blurred copy back in, only inside the mask
    soft = cv2.GaussianBlur(out, (17, 17), 0)
    m3 = cv2.GaussianBlur(mask, (31, 31), 0).astype(np.float32)[..., None] / 255.0
    out = (out.astype(np.float32) * (1 - m3) + soft.astype(np.float32) * m3).astype(np.uint8)
    return out, int(mask.sum() // 255)

if __name__ == '__main__':
    mode = sys.argv[1]
    if mode == 'frame':
        src, dst, reg = sys.argv[2], sys.argv[3], sys.argv[4]
        regions = [REGIONS[r] for r in reg.split('+')]
        img = cv2.imread(src)
        out, npx = process(img, regions)
        cv2.imwrite(dst, out)
        print(f"{os.path.basename(src)}: {npx} px inpainted")
    else:
        in_dir, out_dir, reg = sys.argv[2], sys.argv[3], sys.argv[4]
        regions = [REGIONS[r] for r in reg.split('+')]
        os.makedirs(out_dir, exist_ok=True)
        files = sorted(glob.glob(os.path.join(in_dir, '*.png')))
        for i, f in enumerate(files):
            img = cv2.imread(f)
            out, npx = process(img, regions)
            cv2.imwrite(os.path.join(out_dir, os.path.basename(f)), out)
            if i % 20 == 0:
                print(f"{i+1}/{len(files)}  {os.path.basename(f)}  {npx}px")
        print(f"done: {len(files)} frames")
