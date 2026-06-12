# V5 Junho (Dia dos Namorados) — Re-edição

## Session 1 — 2026-06-11

**Strategy:** Melhorar o render final do V5 (sem takes brutos disponíveis). Três queixas do Rafael: transições dos takes, posição/animação das legendas, música. Solução: crossfades suaves no lugar dos cortes secos, textos queimados removidos/contornados e recriados em Georgia serif com fade+rise na zona segura do Reels, trilha substituída por música gerada via ElevenLabs sound-generation.

**Decisions:**
- Take 1 (0.25–3.42): texto do topo removido via **crop-zoom 1.31x** (crop 1653×2940 @ 253,900) — zero artefato, enquadramento melhorou.
- Takes 2–5: intactos.
- Take 6 (11.71–14.33): **descartado** — texto 2 entra em ~12.0s sobre legging estampada; remoção impossível com qualidade (delogo e inpaint testados, ambos mancham).
- Take 7: usada só a fatia **15.62–16.85** (risada do casal) — texto 3 ("Feliz Dia dos Namorados" com máquina de escrever + drift) removido por **inpaint por glifo** (OpenCV Telea, máscara branca min-área 120, dilate 61px, edge-melt gaussian). Região t3: (505,1435,1745,2300).
- Final: cartão branco (frame 19.4 congelado) + coração laranja + "Feliz Dia dos Namorados." Georgia Bold + logo — via xfade fadewhite 0.6s.
- Transições: xfade fade 0.3s entre takes.
- Textos novos: Georgia Italic 104px branco com sombra suave, y=62% (zona segura). t1 0.55–2.70s, t2 8.25–10.05s.
- Música: ElevenLabs **/v1/sound-generation** (Music API = 402 no plano free). Prompt romântico acústico, 22s. Loudnorm -14 LUFS, fades 0.5/1.6s. Decay natural da trilha casa com o cartão.
- Saída: 14.0s, 2160×3840@24, ~40MB. `edit/final.mp4` + cópia em Downloads.

**Reasoning log:**
- delogo box grande = mancha; inpaint por glifo sem dilate = fantasma escuro (sombra difusa das letras); dilate 61px resolve em bokeh, nunca em estampa.
- Cortar o take 6 doeu menos que manchar a modelo; a risada do take 7 preserva o payoff emocional.
- Timebase: xfade exige settb=AVTB em todos os branches quando um input vem de PNG-sequence re-encodada.

**Outstanding:**
- Se o Rafael não gostar da trilha gerada, ele pode mandar um MP3 — basta trocar o input 6 no render.sh e re-rodar.
- Takes brutos permitiriam re-edição completa (transições com mais conteúdo, sem inpaint).
