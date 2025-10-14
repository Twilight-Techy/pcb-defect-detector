const CACHE_NAME = 'pcb-detect-v1';
const ASSETS_TO_CACHE = [
    '/',
    '/offline.html',
    '/manifest.json',
    '/icon.png',
];

self.addEventListener('install', (event) => {
    self.skipWaiting();
    event.waitUntil(
        caches.open(CACHE_NAME).then(async (cache) => {
            // cache.addAll will fail the whole install if any item 404s.
            // Use Promise.allSettled to avoid that and log failures.
            await Promise.allSettled(
                ASSETS_TO_CACHE.map(async (url) => {
                    try {
                        await cache.add(url);
                    } catch (err) {
                        // don't fail install on missing files (e.g. dev-only paths)
                        console.warn('Failed to cache', url, err);
                    }
                })
            );
        })
    );
});

self.addEventListener('activate', (event) => {
    event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', (event) => {
    const req = event.request;
    const url = new URL(req.url);

    // If this is a third‑party request (e.g. safeframe.googlesyndication.com),
    // don't try to precache or put it in our cache. Just forward to network
    // and provide a minimal offline fallback for images.
    if (url.origin !== self.location.origin) {
        event.respondWith(
            fetch(req).catch(() => {
                if (req.destination === 'image') {
                    // return a cached local image or a 1x1 transparent response
                    return caches.match('/icon.png') || new Response('', { status: 404 });
                }
                // Let the page handle other failures (return simple response)
                return new Response('Network error', { status: 504, statusText: 'Gateway Timeout' });
            })
        );
        return;
    }

    // Network-first for API requests (so analysis results stay fresh)
    if (url.pathname.startsWith('/api/')) {
        event.respondWith(
            fetch(req)
                .then((resp) => {
                    const copy = resp.clone();
                    caches.open(CACHE_NAME).then((cache) => cache.put(req, copy));
                    return resp;
                })
                .catch(() => caches.match(req))
        );
        return;
    }

    // Cache-first for same-origin navigation/static assets
    if (req.mode === 'navigate' || req.destination === 'document') {
        event.respondWith(
            fetch(req)
                .then((res) => res)
                .catch(() => caches.match('/offline.html'))
        );
        return;
    }

    event.respondWith(
        caches.match(req).then((cached) => {
            return cached || fetch(req).then((resp) => {
                // optionally cache same-origin assets
                if (req.method === 'GET' && req.url.startsWith(self.location.origin)) {
                    const copy = resp.clone();
                    caches.open(CACHE_NAME).then((cache) => cache.put(req, copy));
                }
                return resp;
            }).catch(() => {
                // fallback for images
                if (req.destination === 'image') {
                    return new Response('', { status: 404 });
                }
            });
        })
    );
});