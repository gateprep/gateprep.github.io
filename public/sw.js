const CACHE_PREFIX='gate-prep-shell-';
const CACHE_VERSION='v2';
const CACHE_NAME=CACHE_PREFIX+CACHE_VERSION;
const APP_SHELL=['/','/index.html','/manifest.webmanifest','/icons/gate-prep.svg'];

self.addEventListener('install',event=>{
  event.waitUntil((async()=>{
    const cache=await caches.open(CACHE_NAME);
    await cache.addAll(APP_SHELL);
    // Do not activate over an open app automatically: the user controls updates in Settings.
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

  // Navigation is network-first so a normal online visit can discover deployments;
  // the cached app shell remains available when offline.
  if(request.mode==='navigate'){
    event.respondWith((async()=>{
      try{
        const response=await fetch(request);
        if(response.ok){const cache=await caches.open(CACHE_NAME);await cache.put('/index.html',response.clone());}
        return response;
      }catch{
        return (await caches.match(request))||(await caches.match('/index.html'))||(await caches.match('/'));
      }
    })());
    return;
  }

  // App bundles and static assets are cache-first, then stored on first successful fetch.
  event.respondWith((async()=>{
    const cached=await caches.match(request);
    if(cached) return cached;
    try{
      const response=await fetch(request);
      if(response.ok){const cache=await caches.open(CACHE_NAME);await cache.put(request,response.clone());}
      return response;
    }catch(error){
      if(request.destination==='image') return new Response('',{status:503,statusText:'Offline'});
      throw error;
    }
  })());
});
