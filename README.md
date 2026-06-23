<div align="center">

![It's Power — Portal do Projeto](public/assets/og-image.png)

# It's Power — Portal do Projeto

**Portal SaaS de gestão de conteúdo digital** para a Academia It's Power (Cláudio/MG), desenvolvido pela [SrChZ Technologies](https://github.com/WebSrChZ).

[![Acessar Portal](https://img.shields.io/badge/▶_Acessar_Portal-1A7EC8?style=for-the-badge&logo=google-chrome&logoColor=white)](https://websrchz.github.io/its-power-hub/)
&nbsp;
![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=flat-square&logo=html5&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat-square&logo=javascript&logoColor=black)
![Supabase](https://img.shields.io/badge/Supabase-3FCF8E?style=flat-square&logo=supabase&logoColor=white)
![PWA](https://img.shields.io/badge/PWA-5A0FC8?style=flat-square&logo=pwa&logoColor=white)
![GitHub Pages](https://img.shields.io/badge/GitHub_Pages-222?style=flat-square&logo=github&logoColor=white)

</div>

---

## Sobre

Painel onde a agência e o cliente acompanham o projeto de conteúdo da academia em um só lugar: **calendário editorial**, **roteiros detalhados** de cada vídeo, **feedback em tempo real**, **métricas do Instagram** e **acompanhamento de fases**. Construído como SPA estática (sem build step) com backend Supabase, e publicado automaticamente no GitHub Pages.

## Recursos

- 📅 **Calendário editorial** — 12 vídeos/mês por mês, cobrindo os 8 pilares de conteúdo, com status de produção por post
- 🎬 **Roteiros completos** — cortes cena a cena, legendas e ideias de stories de cada vídeo (jun/jul/ago)
- ⭐ **Feedback do cliente** — avaliação por estrelas e observações, sincronizados em tempo real
- 🔔 **Notificações realtime** — pedidos, mudanças de status e atividade via Supabase Realtime
- 🔄 **Sincronização multi-device** — status, fase, anotações e checklist de cada roteiro espelhados entre portal e dispositivos em tempo real
- 📊 **Resultados** — métricas de desempenho do Instagram das duas unidades
- 🔐 **Acesso autenticado** + consentimento **LGPD** persistente
- 📱 **PWA instalável** — ícones maskable, modo standalone, offline com service worker
- 🌗 **Dark mode** e layout responsivo mobile-first

## Stack & Arquitetura

```
Front-end   HTML + CSS + JavaScript vanilla (sem framework, sem build)
Backend     Supabase (Postgres, Auth via RPC, Realtime)
Hospedagem  GitHub Pages
CI/CD       GitHub Actions → deploy automático a cada push na master
PWA         manifest + service worker (stale-while-revalidate)
```

A pasta `public/` é publicada como está — o que está no repositório é exatamente o que vai ao ar.

## Estrutura

```
public/
├── index.html                       Portal (landing + auth + abas)
├── css/styles.css                   Estilos, dark mode, responsivo
├── js/
│   ├── app.js                       Dados, render, realtime, LGPD, export PDF
│   ├── api.js                       Cliente Supabase
│   ├── auth.js                      Login (RPC) + sessão
│   └── router.js                    Navegação por abas (hash)
├── its_power_videos_*2026.html      Páginas de roteiros (jun/jul/ago)
├── manifest.json · sw.js            PWA
└── assets/                          Logo, ícones, og-image
supabase_setup.sql                   Schema do backend (referência)
.github/workflows/deploy.yml         Deploy GitHub Pages
```

## Desenvolvimento local

Não há build — basta servir a pasta `public/`:

```bash
python -m http.server 8000 --directory public
# abra http://localhost:8000
```

As credenciais do Supabase no front-end são a `anon key` pública (protegida por RLS no banco).

## Deploy

Push na `master` → GitHub Actions publica no GitHub Pages (~1 min). Como há service worker, a versão de cache (`CACHE_NAME` + os `?v=` dos assets) deve ser bumpada junto para o deploy chegar aos usuários — use o helper:

```bash
./bump-cache.sh          # versão automática AAAAMMDD-<sha-curto>
```

## Status

🟢 Em produção · deploy contínuo na branch `master`.

---

<div align="center">
<sub>© 2026 SrChZ Technologies — projeto proprietário de cliente. Todos os direitos reservados.</sub>
</div>
