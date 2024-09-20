self.addEventListener('install', event => {
    event.waitUntil(
        caches.open('offline-cache').then(cache => {
            return cache.addAll([
                '/5478943.png',
                '/offline.html',
                '/main.css',
                '/js/script.js'
                // รายการอื่นๆ ที่ต้องการเก็บไว้
            ]);
        })
    );
});

self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request).then(cachedResponse => {
            if (cachedResponse) {
                return cachedResponse;
            }

            return fetch(event.request).catch(() => {
                if (event.request.mode === 'navigate') {
                    return caches.match('/offline.html');
                }
            });
        })
    );
});
