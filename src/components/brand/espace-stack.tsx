const CARTES = [
  { nom: "Chorale", couleur: "#6C7580", solde: "•••• 000", rot: -10, x: -64, y: 46, z: 1 },
  { nom: "Hommes de Galilée", couleur: "#B3432E", solde: "•••• 000", rot: -4, x: -28, y: 20, z: 2 },
  { nom: "Servantes de Béthanie", couleur: "#1E6E64", solde: "•••• 000", rot: 3, x: 12, y: 4, z: 3 },
  { nom: "Disciples d'Emmaüs", couleur: "#C89A4B", solde: "96 000 FCFA", rot: 9, x: 52, y: -16, z: 4 },
  { nom: "Église Emmanuel", couleur: "#E7E9E4", solde: "1 805 000 FCFA", rot: -2, x: 0, y: -48, z: 5 },
];

export function EspaceStack() {
  return (
    <div className="relative mx-auto h-[300px] w-[320px]" aria-hidden>
      {CARTES.map((c) => (
        <div
          key={c.nom}
          className="absolute left-1/2 top-1/2 w-[210px] rounded-lg border border-white/10 bg-[#16273F] p-4 shadow-[0_18px_40px_-12px_rgba(0,0,0,0.55)]"
          style={{
            transform: `translate(-50%, -50%) translate(${c.x}px, ${c.y}px) rotate(${c.rot}deg)`,
            zIndex: c.z,
          }}
        >
          <div className="mb-3 h-[3px] w-9 rounded-full" style={{ backgroundColor: c.couleur }} />
          <p className="text-[11px] uppercase tracking-[0.14em] text-[#8A93A3]">Espace</p>
          <p className="mt-1 truncate font-heading text-[17px] text-[#F5F6F3]">{c.nom}</p>
          <p className="mt-3 font-tabular text-[12px] text-[#DDE2E6]/70">{c.solde}</p>
        </div>
      ))}
    </div>
  );
}
