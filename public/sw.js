const CACHE_PREFIX='gate-prep-shell-';
const CACHE_NAME=CACHE_PREFIX+Date.now().toString(36);
const APP_SHELL=['/','/index.html','/manifest.webmanifest','/icons/gate-prep.svg'];

self.addEventListener('install',event=>{
  event.waitUntil((async()=>{
    const cache=await caches.open(CACHE_NAME);
    await cache.addAll(APP_SHELL);
    const indexResponse=await cache.match('/index.html');
    if(indexResponse){
      const html=await indexResponse.text();
      const assets=[...html.matchAll(/(?:src|href)="([^"]+)"/g)]
        .map(match=>match[1])
        .filter(path=>path.startsWith('/')&&/\.(js|css)(\?|$)/.test(path));
      await Promise.all(assets.map(async path=>{try{await cache.add(path);}catch{}}));
    }
  })());
});

self.addEventListener('activate',event=>{
  event.waitUntil((async()=>{
    const keys=await caches.keys();
    await Promise.all(keys.filter(key=>key.startsWith(CACHE_PREFIX)&&key!==CACHE_NAME).map(key=>caches.delete(key)));
    await self.clients.claim();
  })());
});

self.addEventListener('message',event=>{
  if(event.data?.type==='SKIP_WAITING') self.skipWaiting();
});

self.addEventListener('fetch',event=>{
  const request=event.request;
  const url=new URL(request.url);
  if(request.method!=='GET'||url.origin!==self.location.origin) return;

  if(request.mode==='navigate'){
    event.respondWith((async()=>{
      const cache=await caches.open(CACHE_NAME);
      return (await cache.match(request))||(await cache.match('/index.html'))||(await cache.match('/'))||fetch(request);
    })());
    return;
  }

  event.respondWith((async()=>{
    const cache=await caches.open(CACHE_NAME);
    const cached=await cache.match(request);
    if(cached) return cached;
    try{
      const response=await fetch(request);
      if(response.ok) await cache.put(request,response.clone());
      return response;
    }catch(error){
      if(request.destination==='image') return new Response('',{status:503,statusText:'Offline'});
      throw error;
    }
  })());
});
