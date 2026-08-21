const CACHE_NAME = "tresora-cache-v1";
const PAGE_SECOURS = "/espaces";

self.addEventListener("install", () => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((clefs) => Promise.all(clefs.filter((clef) => clef !== CACHE_NAME).map((clef) => caches.delete(clef))))
      .then(() => self.clients.claim())
  );
});

// Réseau d'abord (pour rester à jour dès qu'une connexion existe), avec repli
// sur le cache local dès que la requête échoue — c'est ce qui permet de
// continuer à consulter l'espace une fois hors ligne.
self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET") return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  event.respondWith(
    caches.open(CACHE_NAME).then(async (cache) => {
      try {
        const reponse = await fetch(request);
        if (reponse && reponse.status === 200) cache.put(request, reponse.clone());
        return reponse;
      } catch {
        const enCache = await cache.match(request, { ignoreSearch: true });
        if (enCache) return enCache;

        if (request.mode === "navigate") {
          const accueil = await cache.match(PAGE_SECOURS);
          if (accueil) return accueil;
          return new Response(
            `<!DOCTYPE html><html lang="fr"><meta charset="utf-8"><body style="font-family:sans-serif;padding:2rem;color:#16203A"><h1>Hors ligne</h1><p>Cette page n'a pas encore été visitée en ligne. Reconnectez-vous puis réessayez.</p></body></html>`,
            { status: 200, headers: { "Content-Type": "text/html; charset=utf-8" } }
          );
        }

        throw new Error("Ressource indisponible hors ligne");
      }
    })
  );
});
