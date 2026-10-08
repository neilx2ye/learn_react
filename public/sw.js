// Service Worker：第一次联网打开之后，以后没网也能学。
// 页面本身用「先问网络、拿不到再用缓存」；构建产物（带指纹的文件名）直接用缓存。
const CACHE = 'react-learn-v1'
const CORE = ['/', '/manifest.webmanifest', '/favicon.svg']

// 光缓存 '/' 是不够的：首页引用的 JS/CSS 名字里带指纹，只有把它们也存下来，
// 「联网打开过一次」才真的等于「以后离线也能用」。
async function warmUp() {
  const cache = await caches.open(CACHE)
  await cache.addAll(CORE).catch(() => {})
  try {
    const response = await fetch('/', { cache: 'reload' })
    if (!response.ok) return
    await cache.put('/', response.clone())
    const html = await response.text()
    const urls = [...html.matchAll(/(?:src|href)="(\/[^"]+)"/g)].map((match) => match[1])
    await Promise.all(urls.map((url) => cache.add(url).catch(() => {})))
  } catch {
    // 离线或首屏拿不到就先算了，等下一次能联网时再补
  }
}

self.addEventListener('install', (event) => {
  event.waitUntil(warmUp().then(() => self.skipWaiting()))
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(keys.filter((key) => key !== CACHE).map((key) => caches.delete(key))),
      )
      .then(() => warmUp())
      .then(() => self.clients.claim()),
  )
})

self.addEventListener('fetch', (event) => {
  const request = event.request
  if (request.method !== 'GET') return
  if (new URL(request.url).origin !== self.location.origin) return

  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((response) => {
          const copy = response.clone()
          caches.open(CACHE).then((cache) => cache.put('/', copy))
          return response
        })
        .catch(() => caches.match('/').then((hit) => hit || caches.match(request))),
    )
    return
  }

  event.respondWith(
    caches.match(request).then((hit) => {
      if (hit) return hit
      return fetch(request).then((response) => {
        if (response.ok) {
          const copy = response.clone()
          caches.open(CACHE).then((cache) => cache.put(request, copy))
        }
        return response
      })
    }),
  )
})