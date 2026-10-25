const CACHE = 'acer-atlas-pwa-v9.4.9';
const SHELL = [
  './', './index.html', './manifest.webmanifest', './icon.svg',
  './apple-touch-icon.png', './acer-maple-leaf.png', './cultivar-database.json'
];
self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE).then(cache => cache.addAll(SHELL)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(key => key.startsWith('acer-atlas-') && key !== CACHE).map(key => caches.delete(key))))
      .then(() => self.clients.claim())
  );
});
self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET' || new URL(event.request.url).origin !== self.location.origin) return;
  const url = new URL(event.request.url);
  const isHtml = event.request.mode === 'navigate' || url.pathname.endsWith('/index.html') || url.pathname.endsWith('/');
  const isDatabase = url.pathname.endsWith('/cultivar-database.json');
  if (isHtml || isDatabase) {
    event.respondWith(
      fetch(event.request, { cache: 'no-store' }).then(response => {
        if (!response.ok) throw new Error('Network response was not OK');
        const copy = response.clone();
        if (isHtml) caches.open(CACHE).then(cache => cache.put('./index.html', copy));
        if (isDatabase) caches.open(CACHE).then(cache => cache.put('./cultivar-database.json', copy));
        return response;
      }).catch(() => caches.match(isHtml ? './index.html' : './cultivar-database.json'))
    );
    return;
  }
  event.respondWith(
    caches.match(event.request).then(cached => cached || fetch(event.request).then(response => {
      if (response.ok) {
        const copy = response.clone();
        caches.open(CACHE).then(cache => cache.put(event.request, copy));
      }
      return response;
    }))
  );
});
