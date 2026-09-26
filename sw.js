self.addEventListener('install', e => self.skipWaiting());
self.addEventListener('activate', e => self.clients.claim());
self.addEventListener('fetch', e => {
  // Não cacheia chamadas da API
  if (e.request.url.includes('script.google.com')) return;

  e.respondWith(
    caches.open('confecflow-v1').then(cache =>
      fetch(e.request).then(res => {
        cache.put(e.request, res.clone());
        return res;
      }).catch(() => cache.match(e.request))
    )
  );
});