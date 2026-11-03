const CACHE='homevet-v3';
self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(['./','index.html','manifest.json','icon.svg'])));self.skipWaiting();});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==CACHE).map(x=>caches.delete(x)))).then(()=>self.clients.claim()));});
self.addEventListener('fetch',e=>{
  const u=new URL(e.request.url);
  if(e.request.method!=='GET'||u.origin!==location.origin)return;
  e.respondWith(fetch(e.request).then(r=>{
    if(r.ok){
      const nav=e.request.mode==='navigate',a=r.clone(),b=nav?r.clone():null,d=nav?r.clone():null;
      e.waitUntil(caches.open(CACHE).then(c=>nav?Promise.all([c.put('./',a),c.put('index.html',b),c.put(e.request,d)]):c.put(e.request,a)));
    }
    return r;
  }).catch(()=>caches.match(e.request,{ignoreSearch:true}).then(m=>m||(e.request.mode==='navigate'?caches.match('index.html'):Response.error()))));
});
