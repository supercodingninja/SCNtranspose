// ─────────────────────────────────────────────────────────────────────────────
// This Area Of Code Is: The offline-first service worker for PWA functionality.
// Explanation: I use a cache-first strategy for same-origin GET requests.
//   On install, I precache the app shell. On activate, I delete old caches
//   so returning visitors always get the latest version. On fetch, I serve
//   from cache when available, otherwise fetch from network and cache the
//   response. For navigations offline, I fall back to the cached shell.
// In Other Words: I saved a copy of my app on the device so it opens fast
//   and works without internet, and I clean up old copies so you always
//   see the newest version.
// ─────────────────────────────────────────────────────────────────────────────

const VERSION = 'transpose-v5-ghpages';

// ─────────────────────────────────────────────────────────────────────────────
// This Area Of Code Is: The install event handler that precaches the app shell.
// Explanation: When the service worker installs, I open the cache and add
//   the root page. The { cache: 'reload' } option ensures I get a fresh copy
//   from the network, not a cached one. skipWaiting() activates immediately
//   instead of waiting for old tabs to close.
// In Other Words: When you first visit, I save the main page so it's ready
//   to work offline right away.
// ─────────────────────────────────────────────────────────────────────────────

self.addEventListener('install', (event) => {
  event.waitUntil(
    (async () => {
      const cache = await caches.open(VERSION);
      await cache.add(new Request('./', { cache: 'reload' }));
      self.skipWaiting();
    })()
  );
});

// ─────────────────────────────────────────────────────────────────────────────
// This Area Of Code Is: The activate event handler that cleans up old caches.
// Explanation: When a new service worker activates, I delete every cache
//   except the current VERSION. This prevents stale code from lingering
//   and ensures users always get the latest deployment. clients.claim()
//   takes control of all open tabs immediately.
// In Other Words: When I update my app, I throw away all the old saved
//   copies so nobody sees outdated stuff.
// ─────────────────────────────────────────────────────────────────────────────

self.addEventListener('activate', (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys();
      await Promise.all(keys.filter((k) => k !== VERSION).map((k) => caches.delete(k)));
      await self.clients.claim();
    })()
  );
});

// ─────────────────────────────────────────────────────────────────────────────
// This Area Of Code Is: The fetch event handler that serves cached content.
// Explanation: For every same-origin GET request, I check the cache first.
//   If found, I return it instantly. If not, I fetch from network, cache
//   the response for next time, and return it. If offline and not cached,
//   I serve the app shell for page navigations so the app still loads.
// In Other Words: I check my saved copy first, save new things I download,
//   and if there's no internet, I still show you the main page.
// ─────────────────────────────────────────────────────────────────────────────

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
        if (response.ok) cache.put(request, response.clone());
        return response;
      } catch (err) {
        if (request.mode === 'navigate') {
          const shell = await cache.match('./');
          if (shell) return shell;
        }
        throw err;
      }
    })()
  );
});
