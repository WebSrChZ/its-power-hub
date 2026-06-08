/* ─── SERVICE WORKER — ITS Power Portal ─── */
const CACHE_NAME = 'its-power-v2';
const ASSETS = [
  '/its-power-hub/',
  '/its-power-hub/index.html',
  '/its-power-hub/css/styles.css',
  '/its-power-hub/js/api.js',
  '/its-power-hub/js/auth.js',
  '/its-power-hub/js/router.js',
  '/its-power-hub/js/app.js',
  '/its-power-hub/manifest.json',
  '/its-power-hub/assets/LogoItsPower.jpg',
];

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS)).then(() => self.skipWaiting())
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
  const url = new URL(e.request.url);
  // Skip non-GET and Supabase API calls
  if (e.request.method !== 'GET') return;
  if (url.hostname.includes('supabase')) return;
  if (url.hostname.includes('googleapis') || url.hostname.includes('gstatic')) return;
  if (url.hostname.includes('cdn.jsdelivr.net')) return;

  e.respondWith(
    fetch(e.request).then(response => {
      // Cache successful responses
      if (response.ok) {
        const clone = response.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(e.request, clone));
      }
      return response;
    }).catch(() => {
      // Serve from cache when offline
      return caches.match(e.request).then(cached => {
        if (cached) return cached;
        // Fallback to index for navigation
        if (e.request.mode === 'navigate') return caches.match('/its-power-hub/index.html');
        return new Response('Offline', { status: 503 });
      });
    })
  );
});
