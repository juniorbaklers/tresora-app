import { BandeTissee } from "@/components/brand/motif";

const CARTES = [
  { nom: "Chorale", tonalite: "indigo", solde: "•••• 000", rot: -11, x: -66, y: 48, z: 1 },
  { nom: "Hommes de Galilée", tonalite: "terre", solde: "•••• 000", rot: -4, x: -30, y: 21, z: 2 },
  { nom: "Servantes de Béthanie", tonalite: "palme", solde: "•••• 000", rot: 3, x: 12, y: 4, z: 3 },
  { nom: "Disciples d'Emmaüs", tonalite: "or", solde: "96 000 FCFA", rot: 9, x: 54, y: -17, z: 4 },
  { nom: "Église Emmanuel", tonalite: "mixte", solde: "1 805 000 FCFA", rot: -2, x: 0, y: -50, z: 5 },
] as const;

/**
 * Pile de « carnets » : chaque espace est un livret de compte, empilé et légèrement
 * pivoté. C'est la métaphore centrale du produit — des trésoreries distinctes qui
 * coexistent sans se mélanger.
 */
export function EspaceStack() {
  return (
    <div className="relative mx-auto h-[300px] w-[320px]" aria-hidden>
      {CARTES.map((c) => (
        <div
          key={c.nom}
          className="absolute left-1/2 top-1/2 w-[214px] overflow-hidden rounded-xl border border-white/[0.09] bg-[#1B2740] p-4 shadow-[0_22px_46px_-14px_rgba(0,0,0,0.65)]"
          style={{
            transform: `translate(-50%, -50%) translate(${c.x}px, ${c.y}px) rotate(${c.rot}deg)`,
            zIndex: c.z,
          }}
        >
          <BandeTissee tonalite={c.tonalite} className="mb-3.5 w-11" />
          <p className="text-[10px] uppercase tracking-[0.16em] text-[#9B937F]">Espace</p>
          <p className="mt-1 truncate font-heading text-[18px] text-[#F6F1E7]">{c.nom}</p>
          <p className="mt-3 font-tabular text-[12px] text-[#C9BFA9]/75">{c.solde}</p>
        </div>
      ))}
    </div>
  );
}
