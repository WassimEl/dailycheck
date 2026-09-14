const CACHE_NAME = "rituel-cache-v3";
const ASSETS = [
  "/",
  "/index.html",
  "/manifest.json",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// Réseau d'abord : on va toujours chercher la dernière version en ligne.
// Le cache ne sert que de secours si le réseau échoue (mode hors-ligne),
// et se met à jour à chaque requête réussie pour rester à jour.
//
// IMPORTANT : on ne gère QUE nos propres requêtes GET same-origin.
// Les requêtes cross-origin (ex: appels API d'OneSignal) ou non-GET
// (POST, etc.) sont laissées intactes — les intercepter ici cassait
// silencieusement les appels réseau d'OneSignal (Cache.put() ne
// supporte pas les requêtes POST et lève une erreur).
self.addEventListener("fetch", (event) => {
  const req = event.request;
  const sameOrigin = new URL(req.url).origin === self.location.origin;
  if (req.method !== "GET" || !sameOrigin) {
    return;
  }
  event.respondWith(
    fetch(req)
      .then((response) => {
        const copy = response.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(req, copy));
        return response;
      })
      .catch(() => caches.match(req))
  );
});
