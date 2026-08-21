"use client";

import { useEffect, useRef, useState } from "react";
import { formatFCFA } from "@/lib/format";

/**
 * Le solde ne s'affiche pas, il arrive : le chiffre défile de 0 jusqu'à sa
 * valeur en ~900 ms. C'est le seul moment « spectaculaire » de l'app — celui
 * qu'on garde en mémoire — le reste de l'interface reste calme autour.
 */
export function MontantAnime({ montant, className }: { montant: number; className?: string }) {
  const [affiche, setAffiche] = useState(0);
  const debut = useRef<number | null>(null);
  const reduitMouvement = useRef(false);

  useEffect(() => {
    reduitMouvement.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduitMouvement.current) {
      setAffiche(montant);
      return;
    }

    let frame: number;
    const duree = 900;
    debut.current = null;

    function etape(t: number) {
      if (debut.current === null) debut.current = t;
      const progres = Math.min(1, (t - debut.current) / duree);
      const progresAdouci = 1 - Math.pow(1 - progres, 3); // ease-out-cubic
      setAffiche(Math.round(montant * progresAdouci));
      if (progres < 1) frame = requestAnimationFrame(etape);
    }

    frame = requestAnimationFrame(etape);

    // Filet de sécurité : sur un onglet masqué au chargement (ou tout
    // contexte où rAF ne tourne pas), un solde figé à 0 serait trompeur
    // pour une app financière. On force la valeur finale passé ce délai,
    // sans jamais dépasser la durée normale de l'animation visible.
    const filet = window.setTimeout(() => setAffiche(montant), duree + 400);

    return () => {
      cancelAnimationFrame(frame);
      window.clearTimeout(filet);
    };
  }, [montant]);

  return <span className={className}>{formatFCFA(affiche)}</span>;
}
