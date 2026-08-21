"use client";

import { useEffect } from "react";

/**
 * Enregistré seulement en production : en dev, un service worker mettrait en
 * cache des bundles que le hot-reload remplace sans arrêt, ce qui produirait
 * des pages figées sur d'anciennes versions du code.
 */
export function RegisterServiceWorker() {
  useEffect(() => {
    if (process.env.NODE_ENV !== "production") return;
    if (!("serviceWorker" in navigator)) return;
    navigator.serviceWorker.register("/sw.js").catch(() => {});
  }, []);

  return null;
}
