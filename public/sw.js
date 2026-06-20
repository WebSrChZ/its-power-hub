/* ─── SERVICE WORKER — ITS Power Portal ─── */
/* Atualizar CACHE_NAME junto com o ?v dos assets em cada deploy. */
const CACHE_NAME = 'its-power-v20260620';
const BASE = '/its-power-hub/';
const VER = '?v=20260620';
const ASSETS = [
  BASE,
  BASE + 'index.html',
  BASE + 'css/styles.css' + VER,
  BASE + 'js/api.js' + VER,
  BASE + 'js/auth.js' + VER,
  BASE + 'js/router.js' + VER,
  BASE + 'js/app.js' + VER,
  BASE + 'manifest.json',
  BASE + 'offline.html',
  BASE + 'assets/LogoItsPower.jpg',
  BASE + 'assets/favicon.png',
  BASE + 'assets/icon-192.png',
  BASE + 'assets/icon-512.png',
];

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME)
      // addAll falha tudo se 1 recurso 404; cacheamos individualmente p/ robustez
      .then(cache => Promise.allSettled(ASSETS.map(u => cache.add(u))))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (e) => {
  const req = e.request;
  const url = new URL(req.url);
  if (req.method !== 'GET') return;
  // APIs e CDNs externos: deixar passar direto (sem cache)
  if (url.origin !== self.location.origin) return;

  // Navegação (index.html): network-first → pega o deploy mais novo, cai pro cache offline
  if (req.mode === 'navigate') {
    e.respondWith(
      fetch(req).then(res => {
        const clone = res.clone();
        caches.open(CACHE_NAME).then(c => c.put(BASE + 'index.html', clone));
        return res;
      }).catch(() => caches.match(req).then(r => r || caches.match(BASE + 'index.html')).then(r => r || caches.match(BASE + 'offline.html')))
    );
    return;
  }

  // Estáticos same-origin: stale-while-revalidate (responde do cache na hora, revalida em background)
  e.respondWith(
    caches.match(req).then(cached => {
      const network = fetch(req).then(res => {
        if (res && res.ok) {
          const clone = res.clone();
          caches.open(CACHE_NAME).then(c => c.put(req, clone));
        }
        return res;
      }).catch(() => cached);
      return cached || network;
    })
  );
});
