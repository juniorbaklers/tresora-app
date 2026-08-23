"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import {
  COTISATIONS,
  RECETTES,
  DEPENSES,
  CONTRIBUTIONS,
  JOURNAL,
  NOTIFICATIONS,
  ESPACES,
  UTILISATEUR,
  getMembre,
} from "./data";
import type {
  Cotisation,
  Recette,
  Depense,
  Contribution,
  EntreeJournal,
  Rappel,
  NotificationItem,
  StatutPaiement,
  StatutContribution,
  StyleRapport,
  Correction,
  DeviseCode,
  ModuleKey,
  Invitation,
} from "./types";

function idCourt(prefixe: string): string {
  return `${prefixe}-${Date.now().toString(36)}-${Math.round(Math.random() * 1e4).toString(36)}`;
}

function maintenant() {
  const d = new Date();
  return { date: d.toISOString().slice(0, 10), heure: d.toTimeString().slice(0, 5) };
}

const LABELS_ROLE: Record<string, string> = {
  proprietaire: "Propriétaire",
  administrateur: "Administrateur",
  tresorier: "Trésorier",
  responsable: "Responsable",
  membre: "Membre",
};

function roleDans(espaceId: string): string {
  const e = ESPACES.find((x) => x.id === espaceId);
  return e ? (LABELS_ROLE[e.role] ?? e.role) : "Membre";
}

export function calculerStatutPaiement(montantPaye: number, montantDu: number): StatutPaiement {
  if (montantPaye <= 0) return "impaye";
  if (montantPaye >= montantDu) return "paye";
  return "partiel";
}

export interface EspaceOverride {
  nom?: string;
  devise?: DeviseCode;
  modules?: ModuleKey[];
}

export interface UtilisateurState {
  nom: string;
  email: string;
  telephone: string;
  deuxFA: boolean;
  motDePasseMisAJourLe: string;
}

interface TresoraState {
  cotisations: Cotisation[];
  recettes: Record<string, Recette[]>;
  depenses: Record<string, Depense[]>;
  contributions: Contribution[];
  journal: EntreeJournal[];
  rappels: Rappel[];
  notifications: NotificationItem[];
  rappelsLusIds: string[];
  styleRapport: StyleRapport;
  utilisateur: UtilisateurState;
  espaceOverrides: Record<string, EspaceOverride>;
  invitations: Invitation[];

  enregistrerPaiement: (cotisationId: string, membreId: string, montant: number, responsable?: string) => void;
  corrigerRecette: (
    espaceId: string,
    recetteId: string,
    champ: "montant" | "libelle",
    nouvelleValeur: string,
    raison: string,
    responsable?: string
  ) => void;
  corrigerDepense: (
    espaceId: string,
    depenseId: string,
    champ: "montant" | "description",
    nouvelleValeur: string,
    raison: string,
    responsable?: string
  ) => void;
  ajouterRecette: (recette: Recette) => void;
  ajouterDepense: (depense: Depense) => void;
  verserContribution: (contributionId: string, montant: number) => void;
  envoyerRappel: (cotisationId: string, membreId: string) => void;
  marquerNotificationLue: (id: string) => void;
  marquerToutesLues: (espaceId: string, idsRappelsActifs?: string[]) => void;
  setStyleRapport: (style: StyleRapport) => void;
  mettreAJourUtilisateur: (patch: Partial<Pick<UtilisateurState, "nom" | "email" | "telephone">>) => void;
  toggleDeuxFA: () => void;
  changerMotDePasse: () => void;
  mettreAJourEspace: (espaceId: string, patch: EspaceOverride) => void;
  inviterUtilisateur: (espaceId: string, email: string) => void;
  reinitialiser: () => void;
}

const etatInitial = {
  cotisations: COTISATIONS,
  recettes: RECETTES,
  depenses: DEPENSES,
  contributions: CONTRIBUTIONS,
  journal: JOURNAL,
  rappels: [] as Rappel[],
  notifications: NOTIFICATIONS,
  rappelsLusIds: [] as string[],
  styleRapport: "classique" as StyleRapport,
  utilisateur: {
    nom: UTILISATEUR.nom,
    email: UTILISATEUR.email,
    telephone: UTILISATEUR.telephone,
    deuxFA: false,
    motDePasseMisAJourLe: "2026-05-21",
  } as UtilisateurState,
  espaceOverrides: {} as Record<string, EspaceOverride>,
  invitations: [] as Invitation[],
};

export const useTresoraStore = create<TresoraState>()(
  persist(
    (set, get) => ({
      ...etatInitial,

      enregistrerPaiement: (cotisationId, membreId, montant, responsable = UTILISATEUR.nom) => {
        const { date, heure } = maintenant();
        const cotisation = get().cotisations.find((c) => c.id === cotisationId);
        const membre = cotisation ? getMembre(cotisation.espaceId, membreId) : undefined;

        set((state) => ({
          cotisations: state.cotisations.map((c) => {
            if (c.id !== cotisationId) return c;
            return {
              ...c,
              paiements: c.paiements.map((p) => {
                if (p.membreId !== membreId) return p;
                const tranches = [...p.tranches, { id: idCourt("tr"), date, montant, responsable }];
                const montantPaye = Math.min(p.montantDu, tranches.reduce((s, t) => s + t.montant, 0));
                return { ...p, tranches, montantPaye, statut: calculerStatutPaiement(montantPaye, p.montantDu), dernierPaiement: date };
              }),
            };
          }),
          journal:
            cotisation && membre
              ? [
                  ...state.journal,
                  {
                    id: idCourt("j"),
                    espaceId: cotisation.espaceId,
                    date,
                    heure,
                    utilisateur: responsable,
                    role: roleDans(cotisation.espaceId),
                    action: "A enregistré un versement de cotisation",
                    nouvelleValeur: `${membre.prenom} ${membre.nom} — ${montant.toLocaleString("fr-FR")} FCFA (${cotisation.nom})`,
                  } satisfies EntreeJournal,
                ]
              : state.journal,
        }));
      },

      corrigerRecette: (espaceId, recetteId, champ, nouvelleValeur, raison, responsable = UTILISATEUR.nom) => {
        const { date, heure } = maintenant();
        set((state) => {
          const liste = state.recettes[espaceId] ?? [];
          const recette = liste.find((r) => r.id === recetteId);
          if (!recette) return state;
          const ancienneValeur = String(recette[champ]);
          if (ancienneValeur === nouvelleValeur) return state;
          const correction: Correction = {
            id: idCourt("cor"),
            date,
            heure,
            responsable,
            raison,
            champ: champ === "montant" ? "Montant" : "Libellé",
            ancienneValeur,
            nouvelleValeur,
          };
          const recetteMaj: Recette = {
            ...recette,
            [champ]: champ === "montant" ? Number(nouvelleValeur) : nouvelleValeur,
            corrections: [...(recette.corrections ?? []), correction],
          };
          const entree: EntreeJournal = {
            id: idCourt("j"),
            espaceId,
            date,
            heure,
            utilisateur: responsable,
            role: roleDans(espaceId),
            action: `A corrigé une recette (${correction.champ.toLowerCase()}) — ${raison}`,
            ancienneValeur,
            nouvelleValeur,
          };
          return {
            recettes: { ...state.recettes, [espaceId]: liste.map((r) => (r.id === recetteId ? recetteMaj : r)) },
            journal: [...state.journal, entree],
          };
        });
      },

      corrigerDepense: (espaceId, depenseId, champ, nouvelleValeur, raison, responsable = UTILISATEUR.nom) => {
        const { date, heure } = maintenant();
        set((state) => {
          const liste = state.depenses[espaceId] ?? [];
          const depense = liste.find((d) => d.id === depenseId);
          if (!depense) return state;
          const ancienneValeur = String(depense[champ]);
          if (ancienneValeur === nouvelleValeur) return state;
          const correction: Correction = {
            id: idCourt("cor"),
            date,
            heure,
            responsable,
            raison,
            champ: champ === "montant" ? "Montant" : "Description",
            ancienneValeur,
            nouvelleValeur,
          };
          const depenseMaj: Depense = {
            ...depense,
            [champ]: champ === "montant" ? Number(nouvelleValeur) : nouvelleValeur,
            corrections: [...(depense.corrections ?? []), correction],
          };
          const entree: EntreeJournal = {
            id: idCourt("j"),
            espaceId,
            date,
            heure,
            utilisateur: responsable,
            role: roleDans(espaceId),
            action: `A corrigé une dépense (${correction.champ.toLowerCase()}) — ${raison}`,
            ancienneValeur,
            nouvelleValeur,
          };
          return {
            depenses: { ...state.depenses, [espaceId]: liste.map((d) => (d.id === depenseId ? depenseMaj : d)) },
            journal: [...state.journal, entree],
          };
        });
      },

      ajouterRecette: (recette) => {
        const { date, heure } = maintenant();
        set((state) => ({
          recettes: { ...state.recettes, [recette.espaceId]: [...(state.recettes[recette.espaceId] ?? []), recette] },
          journal: [
            ...state.journal,
            {
              id: idCourt("j"),
              espaceId: recette.espaceId,
              date,
              heure,
              utilisateur: recette.responsable,
              role: roleDans(recette.espaceId),
              action: "A enregistré une recette",
              nouvelleValeur: `${recette.libelle} — ${recette.montant.toLocaleString("fr-FR")} FCFA`,
            },
          ],
        }));
      },

      ajouterDepense: (depense) => {
        const { date, heure } = maintenant();
        set((state) => ({
          depenses: { ...state.depenses, [depense.espaceId]: [...(state.depenses[depense.espaceId] ?? []), depense] },
          journal: [
            ...state.journal,
            {
              id: idCourt("j"),
              espaceId: depense.espaceId,
              date,
              heure,
              utilisateur: depense.responsable,
              role: roleDans(depense.espaceId),
              action: "A enregistré une dépense",
              nouvelleValeur: `${depense.description} — ${depense.montant.toLocaleString("fr-FR")} FCFA`,
            },
          ],
        }));
      },

      verserContribution: (contributionId, montant) => {
        const { date } = maintenant();
        set((state) => ({
          contributions: state.contributions.map((c) => {
            if (c.id !== contributionId) return c;
            const montantRecu = Math.min(c.montantDemande, c.montantRecu + montant);
            const statut: StatutContribution = montantRecu >= c.montantDemande ? "paye" : montantRecu > 0 ? "partiel" : "en_attente";
            return { ...c, montantRecu, statut, historique: [...c.historique, { date, montant }] };
          }),
        }));
      },

      envoyerRappel: (cotisationId, membreId) => {
        const { date, heure } = maintenant();
        const cotisation = get().cotisations.find((c) => c.id === cotisationId);
        const membre = cotisation ? getMembre(cotisation.espaceId, membreId) : undefined;
        set((state) => ({
          rappels: [...state.rappels, { id: idCourt("rap"), cotisationId, membreId, date, automatique: false }],
          journal:
            cotisation && membre
              ? [
                  ...state.journal,
                  {
                    id: idCourt("j"),
                    espaceId: cotisation.espaceId,
                    date,
                    heure,
                    utilisateur: UTILISATEUR.nom,
                    role: roleDans(cotisation.espaceId),
                    action: "A envoyé un rappel de cotisation",
                    nouvelleValeur: `${membre.prenom} ${membre.nom} — ${cotisation.nom}`,
                  },
                ]
              : state.journal,
        }));
      },

      marquerNotificationLue: (id) =>
        id.startsWith("rappel-")
          ? set((state) => (state.rappelsLusIds.includes(id) ? state : { rappelsLusIds: [...state.rappelsLusIds, id] }))
          : set((state) => ({ notifications: state.notifications.map((n) => (n.id === id ? { ...n, lue: true } : n)) })),

      marquerToutesLues: (espaceId, idsRappelsActifs = []) =>
        set((state) => ({
          notifications: state.notifications.map((n) => (n.espaceId === espaceId ? { ...n, lue: true } : n)),
          rappelsLusIds: Array.from(new Set([...state.rappelsLusIds, ...idsRappelsActifs])),
        })),

      setStyleRapport: (style) => set({ styleRapport: style }),

      mettreAJourUtilisateur: (patch) => set((state) => ({ utilisateur: { ...state.utilisateur, ...patch } })),

      toggleDeuxFA: () => set((state) => ({ utilisateur: { ...state.utilisateur, deuxFA: !state.utilisateur.deuxFA } })),

      changerMotDePasse: () => {
        const { date } = maintenant();
        set((state) => ({ utilisateur: { ...state.utilisateur, motDePasseMisAJourLe: date } }));
      },

      mettreAJourEspace: (espaceId, patch) =>
        set((state) => ({
          espaceOverrides: { ...state.espaceOverrides, [espaceId]: { ...state.espaceOverrides[espaceId], ...patch } },
        })),

      inviterUtilisateur: (espaceId, email) => {
        const { date } = maintenant();
        set((state) => ({
          invitations: [...state.invitations, { id: idCourt("inv"), espaceId, email, date }],
        }));
      },

      reinitialiser: () => set(etatInitial),
    }),
    {
      name: "tresora-store",
      storage: createJSONStorage(() => localStorage),
      version: 1,
      // L'hydratation depuis localStorage est déclenchée manuellement côté
      // client (voir HydrateStore) : sur un export statique, ce module est
      // aussi évalué côté serveur au moment du build, où `localStorage`
      // n'existe pas.
      skipHydration: true,
    }
  )
);
