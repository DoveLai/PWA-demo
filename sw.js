var cacheStorageKey = 'minimal-pwa-2';

var cacheList = [
    '/',
    "index.html",
    "main.css",
    "e.jpg"
]

self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(cacheStorageKey)
        .then(cache => cache.addAll(cacheList))
        .then(self.skipWaiting())
    );
});

self.addEventListener('fetch', e => {
    e.respondWith(
        caches.match(e.request).then(response => {
            if (response) {
                return response
            }
            return fetch(e.request.url)
        })
    )
})

self.addEventListener('activate', e => {
    e.waitUntil(
        Promise.all(
            caches.keys().then(cacheNames => {
                return cacheNames.map(name => {
                    if (name !== cacheStorageKey) {
                        return caches.delete(name)
                    }
                })
            })
        ).then(() => {
            return self.clients.claim()
        })
    )
})