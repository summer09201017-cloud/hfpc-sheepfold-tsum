var CACHE_NAME = 'sheepfold-tsum-v21';
var SHELL = ['./', './game.js', './manifest.webmanifest',
             './voice/intro.mp3', './voice/bless.mp3', './voice/win.mp3'];
self.addEventListener('install', function(e){
  e.waitUntil(caches.open(CACHE_NAME).then(function(c){
    return Promise.all(SHELL.map(function(u){ return c.add(u).catch(function(){}); }));
  }).then(function(){ return self.skipWaiting(); }));
});
self.addEventListener('activate', function(e){
  e.waitUntil(caches.keys().then(function(keys){
    return Promise.all(keys.filter(function(k){ return k !== CACHE_NAME; })
      .map(function(k){ return caches.delete(k); }));
  }).then(function(){ return self.clients.claim(); }));
});
self.addEventListener('fetch', function(e){
  if (e.request.method !== 'GET') return;
  if (new URL(e.request.url).hostname.indexOf('hfpc-play-stats') !== -1) return;
  e.respondWith(caches.match(e.request).then(function(hit){
    return hit || fetch(e.request).then(function(res){
      var copy = res.clone();
      if (res.ok) caches.open(CACHE_NAME).then(function(c){ c.put(e.request, copy); });
      return res;
    }).catch(function(){
      // 離線退路(2026-09-14):導覽請求退回殼層 './'。名單不放 ./index.html —— CF 把 /index.html 308 到 /,
      // 快取到 redirected 回應、導覽拿到就 ERR_FAILED;/index.html 在快取永遠撲空,所以離線要改拿 './'。
      return hit || (e.request.mode === 'navigate' ? caches.match('./') : undefined);
    });
  }));
});

// 🏷️ 版號回報(0820 全艦隊批次):頁尾徽章問「實際執行中的版本」,答案=本 SW 的快取名。
self.addEventListener('message', function (e) {
  if (e && e.data === 'GET_VERSION' && e.source) e.source.postMessage({ type: 'SW_VERSION', v: CACHE_NAME });
});
