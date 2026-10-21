/* Service worker: deja usar la app sin conexión.
   Sube el número de CACHE en cada publicación para que los alumnos
   reciban la versión nueva. */
const CACHE = "cuaderno-v13";
const SHELL = [
  "./",
  "./index.html",
  "./manifest.webmanifest",
  "./icon-192.png",
  "./icon-512.png",
  "./apple-touch-icon.png"
];

self.addEventListener("install", e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(SHELL)).then(() => self.skipWaiting()));
});

self.addEventListener("activate", e => {
  e.waitUntil(
    caches.keys()
      .then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", e => {
  const req = e.request;
  if (req.method !== "GET") return;

  // Firestore y el SDK nunca se cachean: necesitan la red.
  const url = new URL(req.url);
  if (url.hostname.indexOf("googleapis.com") >= 0 || url.hostname.indexOf("firebaseio") >= 0) return;

  // La página: primero la red (para traer la versión nueva), y si no hay, la copia.
  if (req.mode === "navigate") {
    e.respondWith(
      fetch(req).then(r => {
        const copy = r.clone();
        caches.open(CACHE).then(c => c.put("./index.html", copy));
        return r;
      }).catch(() => caches.match("./index.html"))
    );
    return;
  }

  // El resto: copia si la hay, y si no, red.
  e.respondWith(
    caches.match(req).then(hit => hit || fetch(req).then(r => {
      if (r.ok && url.origin === self.location.origin) {
        const copy = r.clone();
        caches.open(CACHE).then(c => c.put(req, copy));
      }
      return r;
    }).catch(() => hit))
  );
});
