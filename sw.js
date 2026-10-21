// Service worker: เปิดออฟไลน์ได้ + อัปเดตข้อมูลใหม่ทุกครั้งที่มีเน็ต
const CACHE = 'schedule-v1';
const FILES = ['./', 'index.html', 'data.js', 'style.css', 'manifest.webmanifest', 'icon-192.png', 'icon-512.png'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(FILES)));
  self.skipWaiting();
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))));
  self.clients.claim();
});
// ลองโหลดใหม่จากเน็ตก่อน ถ้าไม่มีเน็ตค่อยใช้ของที่เก็บไว้
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  e.respondWith(
    fetch(e.request).then(res => {
      const copy = res.clone();
      caches.open(CACHE).then(c => c.put(e.request, copy));
      return res;
    }).catch(() => caches.match(e.request))
  );
});
