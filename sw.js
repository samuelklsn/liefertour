// Offline-Cache: Seite funktioniert auch ohne Netz (z. B. Funkloch auf der Tour).
// Bei jedem Laden wird im Hintergrund die neue Version geholt.
const CACHE='liefertour-v4';
const CORE=['./','./index.html','./manifest.webmanifest','./icon-180.png','./icon-512.png'];
self.addEventListener('install',e=>{ e.waitUntil(caches.open(CACHE).then(c=>c.addAll(CORE))); self.skipWaiting(); });
self.addEventListener('activate',e=>{ e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==CACHE).map(k=>caches.delete(k))))); self.clients.claim(); });
self.addEventListener('fetch',e=>{
  const req=e.request; if(req.method!=='GET') return;
  e.respondWith(caches.open(CACHE).then(async c=>{
    const hit=await c.match(req,{ignoreSearch:true});
    const net=fetch(req).then(r=>{ if(r.ok||r.type==='opaque') c.put(req,r.clone()); return r; }).catch(()=>hit);
    return hit||net;
  }));
});
