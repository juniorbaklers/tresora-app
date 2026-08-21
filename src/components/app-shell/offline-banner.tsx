"use client";

import { useEffect, useState } from "react";
import { WifiOff } from "lucide-react";

export function OfflineBanner() {
  // Initialisé à `false` pour matcher le rendu serveur (où `navigator`
  // n'existe pas) : la vraie valeur n'est lue qu'au montage côté client,
  // sinon un premier rendu hors ligne provoquerait une erreur d'hydratation.
  const [horsLigne, setHorsLigne] = useState(false);

  useEffect(() => {
    setHorsLigne(!navigator.onLine);
    const surHorsLigne = () => setHorsLigne(true);
    const surEnLigne = () => setHorsLigne(false);
    window.addEventListener("offline", surHorsLigne);
    window.addEventListener("online", surEnLigne);
    return () => {
      window.removeEventListener("offline", surHorsLigne);
      window.removeEventListener("online", surEnLigne);
    };
  }, []);

  if (!horsLigne) return null;

  return (
    <div className="animate-in slide-in-from-top fade-in sticky top-0 z-50 flex items-center justify-center gap-2 bg-[#16203A] px-3 py-1.5 text-center text-xs font-medium text-[#F6F1E7] duration-300">
      <WifiOff className="h-3.5 w-3.5" />
      Hors ligne — vous pouvez continuer à consulter et saisir, tout reste enregistré sur cet appareil.
    </div>
  );
}
