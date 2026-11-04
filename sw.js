/* Acer Atlas v10.5.10 — force-update cache strategy */
const CACHE = 'acer-atlas-pwa-v10.5.10';
const APP_FILES = [
  './', './index.html', './manifest.webmanifest', './icon.svg',
  './apple-touch-icon.png', './acer-maple-leaf.png', './cultivar-database.json'
];

self.addEventListener('install', event => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE);
    // Always fetch the new app shell from the server, never from the browser's HTTP cache.
    for (const file of APP_FILES) {
      const request = new Request(file, {cache: 'reload'});
      const response = await fetch(request);
      if (!response.ok) throw new Error(`Could not update ${file}: ${response.status}`);
      await cache.put(file, response);
    }
    await self.skipWaiting();
  })());
});

self.addEventListener('activate', event => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys
      .filter(key => (key.startsWith('acer-atlas-') || key.startsWith('acer-atlas-pwa-')) && key !== CACHE)
      .map(key => caches.delete(key)));
    await self.clients.claim();
  })());
});

self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;
  const url = new URL(event.request.url);
  if (url.origin !== self.location.origin) return;

  const isAppDocument = event.request.mode === 'navigate' ||
    url.pathname.endsWith('/index.html') || url.pathname.endsWith('/');
  const isDatabase = url.pathname.endsWith('/cultivar-database.json');

  if (isAppDocument || isDatabase) {
    event.respondWith((async () => {
      const cache = await caches.open(CACHE);
      try {
        const response = await fetch(new Request(event.request, {cache: 'no-store'}));
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        await cache.put(isDatabase ? './cultivar-database.json' : './index.html', response.clone());
        return response;
      } catch (error) {
        // Offline fallback is limited to the current release's cache only.
        const fallback = await cache.match(isDatabase ? './cultivar-database.json' : './index.html');
        if (fallback) return fallback;
        return new Response('Acer Atlas kan niet worden bijgewerkt. Controleer je internetverbinding en probeer opnieuw.', {
          status: 503, headers: {'Content-Type': 'text/plain; charset=utf-8'}
        });
      }
    })());
    return;
  }

  event.respondWith((async () => {
    const cache = await caches.open(CACHE);
    const cached = await cache.match(event.request);
    if (cached) return cached;
    const response = await fetch(event.request);
    if (response.ok) await cache.put(event.request, response.clone());
    return response;
  })());
});
