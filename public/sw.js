/* Transpose — offline-first service worker.
   Strategy: precache the app shell on install; serve cache-first for same-origin
   GET requests; fall back to the cached index.html for navigations. */
const VERSION = 'transpose-v4';

self.addEventListener('install', (event) => {
  event.waitUntil(
    (async () => {
      const cache = await caches.open(VERSION);
      // Precache the entry page; everything else is cached at runtime on first fetch.
      await cache.add(new Request('./', { cache: 'reload' }));
      self.skipWaiting();
    })()
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys();
      await Promise.all(keys.filter((k) => k !== VERSION).map((k) => caches.delete(k)));
      await self.clients.claim();
    })()
  );
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET') return;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  event.respondWith(
    (async () => {
      const cache = await caches.open(VERSION);
      const cached = await cache.match(request, { ignoreSearch: false });
      if (cached) return cached;
      try {
        const response = await fetch(request);
        if (response.ok) {
          // Cache same-origin assets (JS, CSS, fonts, icons, demo video) for offline use.
          cache.put(request, response.clone());
        }
        return response;
      } catch (err) {
        // Offline and not cached: if it's a page navigation, serve the app shell.
        if (request.mode === 'navigate') {
          const shell = await cache.match('./');
          if (shell) return shell;
        }
        throw err;
      }
    })()
  );
});
