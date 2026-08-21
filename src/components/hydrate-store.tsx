"use client";

import { useEffect } from "react";
import { useTresoraStore } from "@/lib/store";

/**
 * Relit le store persisté depuis localStorage une fois dans le navigateur.
 * `skipHydration: true` sur le store évite que ça se produise pendant le
 * rendu statique côté serveur (où localStorage n'existe pas).
 */
export function HydrateStore() {
  useEffect(() => {
    useTresoraStore.persist.rehydrate();
  }, []);

  return null;
}
