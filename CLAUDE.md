# ItsPower — Video Editing Workspace

## Ferramentas de edição de vídeo instaladas

### video-use (corte, legendas, animações)

@tools/video-use/video-use-main/SKILL.md

### hyperframes (animações HTML/CSS/GSAP para vídeo)

@tools/hyperframes/hyperframes-main/CLAUDE.md

### remotion (animações React para vídeo)

@tools/remotion/SKILL.md

---

## Brand Kit (ler primeiro)

Identidade, vídeo, áudio e voz da SrChZ e dos clientes em **`../BRAND-KIT.md`** (um nível acima desta pasta). Para produzir vídeos no padrão, use o skill `/srchz-video`.

## Projeto ItsPower

**Contexto:** ItsPower é uma **academia** em Cláudio/MG (24 anos, 2 unidades — Bela Vista e Centro); IG `@academiaitspower`. Os vídeos são conteúdo educativo/motivacional em português do Brasil. Detalhes de marca, pilares e quadros no `../BRAND-KIT.md`.

**Estilo visual dos vídeos:**
- Logotipo disponível em: `LogoItsPower.jpg`
- Tom: profissional, motivacional, dinâmico
- Legendas: português, estilo bold-overlay (2–3 palavras em maiúsculas)
- Animações: HyperFrames (HTML/CSS/GSAP) ou Remotion (React/TSX) dependendo da complexidade

## Paths críticos (Windows)

```
Projeto:      C:\Users\rafae\OneDrive\Documentos\Trabalho\SrChZ Technologies\ItsPower\
Python venv:  tools\video-use\video-use-main\.venv\Scripts\python.exe
video-use:    tools\video-use\video-use-main\
hyperframes:  npx --yes hyperframes ...
remotion:     npx create-video@latest (por slot) | npx remotion render
FFmpeg:       ffmpeg (no PATH após instalação)
ElevenLabs:   tools\video-use\video-use-main\.env  (ELEVENLABS_API_KEY=...)
```

## Workflow padrão para edição de vídeo ItsPower

1. Coloque os arquivos brutos de vídeo em uma pasta, ex: `videos/gravacao-01/`
2. Inicie Claude Code nessa pasta: `cd videos/gravacao-01 && claude`
3. Diga: *"edite esses vídeos para o projeto ItsPower"*
4. O agente vai:
   - Transcrever com ElevenLabs Scribe (word-level)
   - Cortar silêncios, erros, repetições
   - Propor estratégia e aguardar confirmação
   - Gerar legendas em português (bold-overlay)
   - Criar animações HyperFrames quando necessário
   - Entregar `edit/final.mp4`

## Nota sobre ElevenLabs API key

Antes da primeira transcrição, adicione sua chave em:
`tools\video-use\video-use-main\.env`

```
ELEVENLABS_API_KEY=sua_chave_aqui
```

Obtenha em: https://elevenlabs.io/app/settings/api-keys
