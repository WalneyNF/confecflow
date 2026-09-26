// Service Worker do ConfecFlow — versão corrigida
const CACHE = 'confecflow-v2';

self.addEventListener('install', e => self.skipWaiting());
self.addEventListener('activate', e => self.clients.claim());

self.addEventListener('fetch', e => {
  const req = e.request;

  // 1) Não mexe em POST/PUT/DELETE (o Cache API não suporta)
  if (req.method !== 'GET') return;

  // 2) Não cacheia chamadas da API (Apps Script)
  if (req.url.includes('script.google.com')) return;

  // 3) Não cacheia chamadas externas (Tailwind, Chart.js, etc)
  if (!req.url.startsWith(self.location.origin)) return;

  // 4) Só cacheia GET de mesma origem (HTML, CSS, JS, imagens)
  e.respondWith(
    caches.open(CACHE).then(cache =>
      fetch(req)
        .then(res => {
          // Só cacheia resposta válida
          if (res && res.status === 200 && res.type === 'basic') {
            cache.put(req, res.clone());
          }
          return res;
        })
        .catch(() => cache.match(req).then(cached => cached || Response.error()))
    )
  );
});