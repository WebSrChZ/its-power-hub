#!/bin/bash
# V5 Namorados re-edit — full assembly
# usage: render.sh preview|final
cd "$(dirname "$0")/.."

MODE="${1:-preview}"
if [ "$MODE" = "final" ]; then
  OUT="edit/final.mp4"; SCALE=""; CRF=17; PRESET=medium
else
  OUT="edit/preview.mp4"; SCALE="scale=1080:1920,"; CRF=19; PRESET=fast
fi

ffmpeg -hide_banner -y \
  -i ItsPowerV5.mp4 \
  -i edit/seg6p.mp4 \
  -loop 1 -t 3.4 -i edit/card_bg.png \
  -loop 1 -i edit/card_text.png \
  -loop 1 -i edit/t1.png \
  -loop 1 -i edit/t2.png \
  -i edit/music_sfx.mp3 \
  -filter_complex "\
[0:v]split=5[i0][i1][i2][i3][i4];\
[i0]trim=0.25:3.4166,setpts=PTS-STARTPTS,crop=1653:2940:253:900,scale=2160:3840,setsar=1,settb=AVTB,fps=24,format=yuv420p[v0];\
[i1]trim=3.4167:4.9166,setpts=PTS-STARTPTS,setsar=1,settb=AVTB,fps=24,format=yuv420p[v1];\
[i2]trim=4.9167:6.2499,setpts=PTS-STARTPTS,setsar=1,settb=AVTB,fps=24,format=yuv420p[v2];\
[i3]trim=6.25:9.2080,setpts=PTS-STARTPTS,setsar=1,settb=AVTB,fps=24,format=yuv420p[v3];\
[i4]trim=9.2084:11.7080,setpts=PTS-STARTPTS,setsar=1,settb=AVTB,fps=24,format=yuv420p[v4];\
[1:v]setpts=PTS-STARTPTS,setsar=1,settb=AVTB,fps=24,format=yuv420p[v5];\
[3:v]format=rgba,fade=t=in:st=0.75:d=0.6:alpha=1[ct];\
[2:v]setsar=1,settb=AVTB,fps=24,format=yuv420p[cb];\
[cb][ct]overlay=x=0:y='44*pow(1-min(max(t-0.75\,0)/0.7\,1)\,3)',settb=AVTB,fps=24,format=yuv420p[v6];\
[v0][v1]xfade=transition=fade:duration=0.3:offset=2.8667[x1];\
[x1][v2]xfade=transition=fade:duration=0.3:offset=4.0667[x2];\
[x2][v3]xfade=transition=fade:duration=0.3:offset=5.1000[x3];\
[x3][v4]xfade=transition=fade:duration=0.3:offset=7.7583[x4];\
[x4][v5]xfade=transition=fade:duration=0.3:offset=9.9583[x5];\
[x5][v6]xfade=transition=fadewhite:duration=0.6:offset=10.6083[x6];\
[4:v]format=rgba,fade=t=in:st=0.55:d=0.5:alpha=1,fade=t=out:st=2.30:d=0.4:alpha=1[t1f];\
[5:v]format=rgba,fade=t=in:st=8.25:d=0.5:alpha=1,fade=t=out:st=9.60:d=0.45:alpha=1[t2f];\
[x6][t1f]overlay=x=0:y='40*pow(1-min(max(t-0.55\,0)/0.7\,1)\,3)'[y1];\
[y1][t2f]overlay=x=0:y='40*pow(1-min(max(t-8.25\,0)/0.7\,1)\,3)'[y2];\
[y2]${SCALE}format=yuv420p[vout];\
[6:a]loudnorm=I=-14:TP=-1.5:LRA=11,atrim=0:14.0083,afade=t=in:st=0:d=0.5,afade=t=out:st=12.4:d=1.6[aout]" \
  -map "[vout]" -map "[aout]" -t 14.0083 -r 24 \
  -c:v libx264 -crf $CRF -preset $PRESET -c:a aac -b:a 192k \
  -movflags +faststart "$OUT"
