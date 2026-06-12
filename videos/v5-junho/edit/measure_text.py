"""Measure burned-in text bounding boxes by thresholding near-white pixels.

The texts are pure white with soft dark shadows; backgrounds are bokeh gym
(midtones) or cream ceiling. Strategy: threshold very bright pixels, cluster
rows/cols with enough hits, report bbox per frame.
"""
import sys, glob, os
from PIL import Image

def bbox_for(path, y_min_frac=0.0, y_max_frac=1.0, thr=242, min_row_hits=12):
    im = Image.open(path).convert('RGB')
    w, h = im.size
    px = im.load()
    y0s, y1s = int(h*y_min_frac), int(h*y_max_frac)
    rows = {}
    for y in range(y0s, y1s, 2):           # sample every 2px for speed
        hits = []
        for x in range(0, w, 2):
            r, g, b = px[x, y]
            if r > thr and g > thr and b > thr:
                hits.append(x)
        if len(hits) >= min_row_hits:
            rows[y] = (min(hits), max(hits))
    if not rows:
        return None
    ys = sorted(rows)
    # keep the largest contiguous-ish band (gap <= 60px)
    bands, cur = [], [ys[0]]
    for y in ys[1:]:
        if y - cur[-1] <= 60:
            cur.append(y)
        else:
            bands.append(cur); cur = [y]
    bands.append(cur)
    band = max(bands, key=len)
    x0 = min(rows[y][0] for y in band)
    x1 = max(rows[y][1] for y in band)
    return (x0, band[0], x1, band[-1])

if __name__ == '__main__':
    region = sys.argv[1] if len(sys.argv) > 1 else 'all'
    files = sorted(glob.glob('edit/verify/native/n_*.png'))
    for f in files:
        t = os.path.basename(f)[2:-4]
        if region == 'top':
            bb = bbox_for(f, 0.10, 0.30)
        elif region == 'mid':
            bb = bbox_for(f, 0.20, 0.75)
        else:
            bb = bbox_for(f, 0.10, 0.80)
        print(f"t={t}  bbox={bb}")
