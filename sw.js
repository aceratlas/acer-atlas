/* Acer Atlas v10.5.33 — validated stale-while-revalidate database cache */
const CACHE = 'acer-atlas-pwa-v10.5.36';
const DATABASE_KEY = './cultivar-database.json';
const APP_FILES = [
  './', './index.html', './manifest.webmanifest', './icon.svg',
  './apple-touch-icon.png', './acer-maple-leaf.png'
];

// A database is cacheable only when it parses and its complete record count matches.
async function isCompleteDatabase(response) {
  if (!response || !response.ok) return false;
  try {
    const payload = await response.clone().json();
    return !!payload &&
      Array.isArray(payload.records) &&
      Number.isInteger(payload.record_count) &&
      payload.record_count > 0 &&
      payload.records.length === payload.record_count;
  } catch (_) {
    return false;
  }
}

async function refreshDatabase(cache) {
  const url = new URL(DATABASE_KEY, self.registration.scope);
  const response = await fetch(new Request(url.href, {cache: 'no-store'}));
  if (!(await isCompleteDatabase(response))) {
    throw new Error('Database response is incomplete or invalid; cached copy retained.');
  }
  await cache.put(DATABASE_KEY, response.clone());
  return true;
}

self.addEventListener('install', event => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE);

    // Keep a validated database from the previous release available during the update.
    const existingKeys = await caches.keys();
    let retainedDatabase = await cache.match(DATABASE_KEY);
    if (!(await isCompleteDatabase(retainedDatabase))) {
      retainedDatabase = null;
      for (const key of existingKeys) {
        if (key === CACHE || !key.startsWith('acer-atlas-')) continue;
        const oldCache = await caches.open(key);
        const candidate = await oldCache.match(DATABASE_KEY);
        if (await isCompleteDatabase(candidate)) {
          retainedDatabase = candidate;
          await cache.put(DATABASE_KEY, candidate.clone());
          break;
        }
      }
    }

    // Update the app shell. The old active worker remains in control if this fails.
    for (const file of APP_FILES) {
      const request = new Request(new URL(file, self.registration.scope).href, {cache: 'reload'});
      const response = await fetch(request);
      if (!response.ok) throw new Error(`Could not update ${file}: ${response.status}`);
      await cache.put(file, response);
    }

    // Prefer the latest complete database, but never replace a good copy with bad data.
    try {
      await refreshDatabase(cache);
    } catch (error) {
      if (!retainedDatabase && !(await isCompleteDatabase(await cache.match(DATABASE_KEY)))) {
        throw error;
      }
      console.warn('Acer Atlas: retained the previous complete database.', error);
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

  if (isDatabase) {
    // Return the last complete database immediately; refresh the cache in the background.
    const updatePromise = caches.open(CACHE).then(cache => refreshDatabase(cache));
    event.waitUntil(updatePromise.catch(error => {
      console.warn('Acer Atlas database refresh skipped; cached copy retained.', error);
    }));
    event.respondWith((async () => {
      const cache = await caches.open(CACHE);
      const cached = await cache.match(DATABASE_KEY);
      if (cached && await isCompleteDatabase(cached)) return cached;

      try {
        await updatePromise;
        const fresh = await cache.match(DATABASE_KEY);
        if (fresh && await isCompleteDatabase(fresh)) return fresh;
      } catch (error) {
        console.warn('Acer Atlas database unavailable.', error);
      }
      return new Response('De volledige Acer Atlas-database is nog niet beschikbaar. Controleer je internetverbinding en probeer opnieuw.', {
        status: 503, headers: {'Content-Type': 'text/plain; charset=utf-8'}
      });
    })());
    return;
  }

  if (isAppDocument) {
    event.respondWith((async () => {
      const cache = await caches.open(CACHE);
      try {
        const response = await fetch(new Request(event.request, {cache: 'no-store'}));
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        await cache.put(event.request.mode === 'navigate' || url.pathname.endsWith('/') ? './' : './index.html', response.clone());
        return response;
      } catch (error) {
        const fallback = await cache.match(event.request.mode === 'navigate' || url.pathname.endsWith('/') ? './' : './index.html');
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
