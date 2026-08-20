import { cn } from "@/lib/utils";

/*
  Motifs de tissage — la signature visuelle de Trésora.

  Géométrie inspirée des bandes de coton tissées ouest-africaines : segments de
  largeurs inégales, losanges, trames croisées. Volontairement abstraite : aucun
  symbole adinkra n'est repris, ceux-ci portant des significations précises
  qu'il serait négligent d'employer en simple décor.
*/

type Tonalite = "or" | "palme" | "terre" | "indigo" | "mixte";

const SEGMENTS: Record<Tonalite, { flex: number; couleur: string }[]> = {
  or: [
    { flex: 7, couleur: "var(--gold)" },
    { flex: 2, couleur: "var(--indigo-deep)" },
    { flex: 4, couleur: "var(--gold)" },
    { flex: 1, couleur: "var(--terre)" },
    { flex: 3, couleur: "var(--gold)" },
    { flex: 2, couleur: "var(--indigo-deep)" },
  ],
  palme: [
    { flex: 5, couleur: "var(--palme)" },
    { flex: 2, couleur: "var(--gold)" },
    { flex: 6, couleur: "var(--palme)" },
    { flex: 1, couleur: "var(--indigo-deep)" },
    { flex: 3, couleur: "var(--palme)" },
  ],
  terre: [
    { flex: 4, couleur: "var(--terre)" },
    { flex: 1, couleur: "var(--gold)" },
    { flex: 7, couleur: "var(--terre)" },
    { flex: 2, couleur: "var(--indigo-deep)" },
    { flex: 3, couleur: "var(--terre)" },
  ],
  indigo: [
    { flex: 6, couleur: "var(--indigo-deep)" },
    { flex: 2, couleur: "var(--gold)" },
    { flex: 4, couleur: "var(--indigo-deep)" },
    { flex: 1, couleur: "var(--palme)" },
    { flex: 5, couleur: "var(--indigo-deep)" },
  ],
  mixte: [
    { flex: 4, couleur: "var(--gold)" },
    { flex: 3, couleur: "var(--palme)" },
    { flex: 1, couleur: "var(--indigo-deep)" },
    { flex: 5, couleur: "var(--terre)" },
    { flex: 2, couleur: "var(--gold)" },
    { flex: 3, couleur: "var(--indigo-deep)" },
  ],
};

/**
 * Bande tissée horizontale — remplace le filet uni en tête de carte.
 * Chaque segment a une largeur différente, comme les duites d'un vrai pagne.
 */
export function BandeTissee({
  tonalite = "or",
  className,
  epaisseur = 3,
}: {
  tonalite?: Tonalite;
  className?: string;
  epaisseur?: number;
}) {
  return (
    <span
      aria-hidden
      className={cn("flex w-full overflow-hidden rounded-full", className)}
      style={{ height: epaisseur }}
    >
      {SEGMENTS[tonalite].map((s, i) => (
        <span key={i} style={{ flex: s.flex, backgroundColor: s.couleur }} />
      ))}
    </span>
  );
}

/**
 * Lisière verticale — bande tissée pivotée, pour border un panneau sur sa hauteur.
 */
export function LisiereVerticale({ tonalite = "or", className }: { tonalite?: Tonalite; className?: string }) {
  return (
    <span aria-hidden className={cn("flex w-[3px] flex-col overflow-hidden", className)}>
      {SEGMENTS[tonalite].map((s, i) => (
        <span key={i} style={{ flex: s.flex, backgroundColor: s.couleur }} />
      ))}
    </span>
  );
}

/**
 * Trame de fond en losanges — texture large pour les aplats sombres.
 * Dessinée en SVG pour rester nette à toutes les densités d'écran.
 */
export function TrameLosange({
  className,
  couleur = "#E0A33E",
  opacite = 0.07,
  taille = 44,
}: {
  className?: string;
  couleur?: string;
  opacite?: number;
  taille?: number;
}) {
  const id = `losange-${taille}-${String(couleur).replace(/[^a-z0-9]/gi, "")}`;
  return (
    <svg aria-hidden className={cn("pointer-events-none absolute inset-0 h-full w-full", className)} style={{ opacity: opacite }}>
      <defs>
        <pattern id={id} width={taille} height={taille} patternUnits="userSpaceOnUse">
          {/* losange central */}
          <path
            d={`M${taille / 2} 0 L${taille} ${taille / 2} L${taille / 2} ${taille} L0 ${taille / 2} Z`}
            fill="none"
            stroke={couleur}
            strokeWidth="1"
          />
          {/* petit losange interne, comme la double trame d'une bande */}
          <path
            d={`M${taille / 2} ${taille * 0.3} L${taille * 0.7} ${taille / 2} L${taille / 2} ${taille * 0.7} L${taille * 0.3} ${taille / 2} Z`}
            fill={couleur}
            fillOpacity="0.5"
          />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${id})`} />
    </svg>
  );
}

/**
 * Chevrons tissés — motif directionnel, utilisé en pied de page ou en bandeau.
 */
export function TrameChevron({
  className,
  couleur = "#E0A33E",
  opacite = 0.09,
  taille = 26,
}: {
  className?: string;
  couleur?: string;
  opacite?: number;
  taille?: number;
}) {
  const id = `chevron-${taille}-${String(couleur).replace(/[^a-z0-9]/gi, "")}`;
  return (
    <svg aria-hidden className={cn("pointer-events-none absolute inset-0 h-full w-full", className)} style={{ opacity: opacite }}>
      <defs>
        <pattern id={id} width={taille} height={taille} patternUnits="userSpaceOnUse">
          <path
            d={`M0 ${taille * 0.75} L${taille / 2} ${taille * 0.25} L${taille} ${taille * 0.75}`}
            fill="none"
            stroke={couleur}
            strokeWidth="1.5"
          />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${id})`} />
    </svg>
  );
}
