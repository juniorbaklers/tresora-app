import { getDepenses, getEspace, getRecettes } from "./data";
import type { CategorieRecette, Depense, Recette } from "./types";

export function semaineDuMois(iso: string): number {
  const jour = Number(iso.slice(8, 10));
  return Math.min(4, Math.ceil(jour / 7));
}

export type PeriodeRapport = "S1" | "S2" | "S3" | "S4" | "M1" | "M2" | "M3" | "ANNEE" | "PERSONNALISE";

export interface OptionPeriode {
  value: PeriodeRapport;
  label: string;
  debut?: string;
  fin?: string;
}

export const PERIODES_RAPPORT: OptionPeriode[] = [
  { value: "S1", label: "Semaine 1 (1–7 août)", debut: "2026-08-01", fin: "2026-08-07" },
  { value: "S2", label: "Semaine 2 (8–14 août)", debut: "2026-08-08", fin: "2026-08-14" },
  { value: "S3", label: "Semaine 3 (15–21 août)", debut: "2026-08-15", fin: "2026-08-21" },
  { value: "S4", label: "Semaine 4 (22–31 août)", debut: "2026-08-22", fin: "2026-08-31" },
  { value: "M1", label: "1 mois — Août 2026", debut: "2026-08-01", fin: "2026-08-31" },
  { value: "M2", label: "2 derniers mois — Juil.–Août 2026", debut: "2026-07-01", fin: "2026-08-31" },
  { value: "M3", label: "3 derniers mois — Juin–Août 2026", debut: "2026-06-01", fin: "2026-08-31" },
  { value: "ANNEE", label: "Année 2026", debut: "2026-01-01", fin: "2026-12-31" },
  { value: "PERSONNALISE", label: "Période personnalisée…" },
];

export function filtrerParIntervalle<T extends { date: string }>(items: T[], debut: string, fin: string): T[] {
  return items.filter((item) => item.date >= debut && item.date <= fin);
}

export function serieHebdomadaire(espaceId: string) {
  const recettes = getRecettes(espaceId);
  const depenses = getDepenses(espaceId);
  const semaines = [1, 2, 3, 4].map((s) => ({
    semaine: `S${s}`,
    recettes: 0,
    depenses: 0,
  }));
  for (const r of recettes) semaines[semaineDuMois(r.date) - 1].recettes += r.montant;
  for (const d of depenses) semaines[semaineDuMois(d.date) - 1].depenses += d.montant;
  return semaines;
}

export function evolutionSolde(espaceId: string) {
  const espace = getEspace(espaceId);
  const serie = serieHebdomadaire(espaceId);
  let solde = espace?.soldeInitial ?? 0;
  return serie.map((s) => {
    solde = solde + s.recettes - s.depenses;
    return { semaine: s.semaine, solde };
  });
}

export const LABELS_CATEGORIE_RECETTE: Record<CategorieRecette, string> = {
  dime: "Dîmes",
  offrande_ordinaire: "Offrandes ordinaires",
  offrande_speciale: "Offrandes spéciales",
  offrande_culte_soir: "Offrandes cultes du soir",
  cotisation: "Cotisations",
  don: "Dons",
  activite: "Activités",
  autre: "Autres recettes",
};

export const COULEURS_CATEGORIE_RECETTE: Record<CategorieRecette, string> = {
  dime: "var(--chart-1)",
  offrande_ordinaire: "var(--chart-2)",
  offrande_speciale: "var(--chart-3)",
  offrande_culte_soir: "var(--chart-4)",
  cotisation: "var(--chart-2)",
  don: "var(--chart-3)",
  activite: "var(--chart-4)",
  autre: "var(--chart-5)",
};

export function repartitionRecettesListe(recettes: Recette[]) {
  const totals = new Map<CategorieRecette, number>();
  for (const r of recettes) totals.set(r.categorie, (totals.get(r.categorie) ?? 0) + r.montant);
  return Array.from(totals.entries())
    .map(([categorie, montant]) => ({
      categorie,
      label: LABELS_CATEGORIE_RECETTE[categorie],
      montant,
      couleur: COULEURS_CATEGORIE_RECETTE[categorie],
    }))
    .sort((a, b) => b.montant - a.montant);
}

export function repartitionRecettes(espaceId: string) {
  return repartitionRecettesListe(getRecettes(espaceId));
}

const PALETTE_DEPENSES = ["var(--chart-3)", "var(--chart-4)", "var(--chart-1)", "var(--chart-2)", "var(--chart-5)", "var(--terre)"];

export function depensesParCategorieListe(depenses: Depense[]) {
  const totals = new Map<string, number>();
  for (const d of depenses) totals.set(d.categorie, (totals.get(d.categorie) ?? 0) + d.montant);
  return Array.from(totals.entries())
    .map(([categorie, montant], i) => ({ categorie, montant, couleur: PALETTE_DEPENSES[i % PALETTE_DEPENSES.length] }))
    .sort((a, b) => b.montant - a.montant);
}

export function depensesParCategorie(espaceId: string) {
  return depensesParCategorieListe(getDepenses(espaceId));
}
