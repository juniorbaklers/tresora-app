import type { Cotisation, Membre, PaiementCotisation } from "./types";

export function joursRestants(dateLimite: string): number {
  const auj = new Date();
  auj.setHours(0, 0, 0, 0);
  const limite = new Date(`${dateLimite}T00:00:00`);
  return Math.round((limite.getTime() - auj.getTime()) / 86_400_000);
}

export function estEnRetard(paiement: PaiementCotisation, dateLimite: string): boolean {
  if (paiement.statut === "paye" || paiement.statut === "exonere") return false;
  return joursRestants(dateLimite) < 0;
}

export function idRappel(cotisationId: string, membreId: string): string {
  return `rappel-${cotisationId}-${membreId}`;
}

export interface RappelDu {
  cotisation: Cotisation;
  paiement: PaiementCotisation;
  membre: Membre;
  reste: number;
  joursRestants: number;
  enRetard: boolean;
}

/**
 * Un membre « doit un rappel » dès qu'il n'a pas soldé sa cotisation active,
 * qu'elle soit encore dans les temps ou déjà en retard — c'est ce qui nourrit
 * le centre de notifications, le widget et la section rappels de l'écran de
 * cotisation.
 */
export function calculerRappelsDus(
  cotisations: Cotisation[],
  trouverMembre: (espaceId: string, membreId: string) => Membre | undefined
): RappelDu[] {
  const dus: RappelDu[] = [];
  for (const cotisation of cotisations) {
    if (cotisation.statut !== "active") continue;
    for (const paiement of cotisation.paiements) {
      if (paiement.statut === "paye" || paiement.statut === "exonere") continue;
      const membre = trouverMembre(cotisation.espaceId, paiement.membreId);
      if (!membre) continue;
      const restants = joursRestants(cotisation.dateLimite);
      dus.push({
        cotisation,
        paiement,
        membre,
        reste: paiement.montantDu - paiement.montantPaye,
        joursRestants: restants,
        enRetard: restants < 0,
      });
    }
  }
  return dus.sort((a, b) => a.joursRestants - b.joursRestants);
}

export function formatDelai(jours: number): string {
  if (jours < 0) {
    const n = Math.abs(jours);
    return `En retard de ${n} jour${n > 1 ? "s" : ""}`;
  }
  if (jours === 0) return "Échéance aujourd'hui";
  if (jours === 1) return "Reste 1 jour";
  return `Reste ${jours} jours`;
}
