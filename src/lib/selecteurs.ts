"use client";

import { useMemo } from "react";
import { useShallow } from "zustand/react/shallow";
import { useTresoraStore } from "./store";
import { getEspace } from "./data";
import { calculerRappelsDus, formatDelai, idRappel } from "./rappels";
import type { NotificationItem, Espace } from "./types";

export function useCotisations(espaceId: string) {
  return useTresoraStore(useShallow((s) => s.cotisations.filter((c) => c.espaceId === espaceId)));
}

export function useCotisation(id: string) {
  return useTresoraStore((s) => s.cotisations.find((c) => c.id === id));
}

export function useToutesCotisations() {
  return useTresoraStore((s) => s.cotisations);
}

export function useRecettes(espaceId: string) {
  return useTresoraStore((s) => s.recettes[espaceId] ?? []);
}

export function useDepenses(espaceId: string) {
  return useTresoraStore((s) => s.depenses[espaceId] ?? []);
}

export function useTotalRecettes(espaceId: string): number {
  return useTresoraStore((s) => (s.recettes[espaceId] ?? []).reduce((sum, r) => sum + r.montant, 0));
}

export function useTotalDepenses(espaceId: string): number {
  return useTresoraStore((s) => (s.depenses[espaceId] ?? []).reduce((sum, d) => sum + d.montant, 0));
}

export function useSoldeActuel(espaceId: string): number {
  const totalR = useTotalRecettes(espaceId);
  const totalD = useTotalDepenses(espaceId);
  const espace = getEspace(espaceId);
  return (espace?.soldeInitial ?? 0) + totalR - totalD;
}

export function useContributionsDemandeesPar(espaceId: string) {
  return useTresoraStore(useShallow((s) => s.contributions.filter((c) => c.espaceDemandeurId === espaceId)));
}

export function useContributionsRequisesA(espaceId: string) {
  return useTresoraStore(useShallow((s) => s.contributions.filter((c) => c.espaceCibleId === espaceId)));
}

export function useContribution(id: string) {
  return useTresoraStore((s) => s.contributions.find((c) => c.id === id));
}

export function useJournal(espaceId: string) {
  return useTresoraStore(
    useShallow((s) =>
      s.journal.filter((j) => j.espaceId === espaceId).sort((a, b) => `${b.date}${b.heure}`.localeCompare(`${a.date}${a.heure}`))
    )
  );
}

export function useNotifications(espaceId: string) {
  return useTresoraStore(
    useShallow((s) => s.notifications.filter((n) => n.espaceId === espaceId).sort((a, b) => b.date.localeCompare(a.date)))
  );
}

/**
 * Fusionne les notifications enregistrées avec des rappels calculés à la volée
 * (cotisations non soldées) : ces derniers n'existent nulle part en base, leur
 * statut « lu » vit dans `rappelsLusIds` et leur id suit le format `rappel-*`.
 */
export function useNotificationsCombinees(espaceId: string): NotificationItem[] {
  const cotisations = useCotisations(espaceId);
  const statiques = useNotifications(espaceId);
  const rappelsLusIds = useTresoraStore((s) => s.rappelsLusIds);

  return useMemo(() => {
    const dynamiques: NotificationItem[] = calculerRappelsDus(cotisations).map((r) => {
      const id = idRappel(r.cotisation.id, r.membre.id);
      return {
        id,
        espaceId,
        type: "cotisation_retard",
        titre: `${r.membre.prenom} ${r.membre.nom} — cotisation à régler`,
        description: `${formatDelai(r.joursRestants)} · reste ${r.reste.toLocaleString("fr-FR")} FCFA sur « ${r.cotisation.nom} »`,
        date: r.cotisation.dateLimite,
        lue: rappelsLusIds.includes(id),
      };
    });
    return [...dynamiques, ...statiques].sort((a, b) => b.date.localeCompare(a.date));
  }, [cotisations, statiques, rappelsLusIds, espaceId]);
}

export function useIdsRappelsActifs(espaceId: string): string[] {
  const cotisations = useCotisations(espaceId);
  return useMemo(
    () => calculerRappelsDus(cotisations).map((r) => idRappel(r.cotisation.id, r.membre.id)),
    [cotisations]
  );
}

export function useStyleRapport() {
  return useTresoraStore((s) => s.styleRapport);
}

export function useUtilisateur() {
  return useTresoraStore((s) => s.utilisateur);
}

/**
 * Espace de base (statique, résolu côté serveur) fusionné avec les
 * corrections enregistrées dans le store (nom, devise, modules) : c'est cette
 * version qu'il faut afficher partout où l'espace peut avoir été modifié
 * depuis l'écran Paramètres.
 */
export function useEspaceEffectif(base: Espace): Espace {
  const override = useTresoraStore((s) => s.espaceOverrides[base.id]);
  return useMemo(() => (override ? { ...base, ...override } : base), [base, override]);
}

export function useInvitations(espaceId: string) {
  return useTresoraStore(useShallow((s) => s.invitations.filter((i) => i.espaceId === espaceId)));
}
