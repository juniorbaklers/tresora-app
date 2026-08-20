import { getDepenses, getEspace, getRecettes } from "./data";
import type { CategorieRecette } from "./types";

function semaineDuMois(iso: string): number {
  const jour = Number(iso.slice(8, 10));
  return Math.min(4, Math.ceil(jour / 7));
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

export function repartitionRecettes(espaceId: string) {
  const recettes = getRecettes(espaceId);
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

const PALETTE_DEPENSES = ["var(--chart-3)", "var(--chart-4)", "var(--chart-1)", "var(--chart-2)", "var(--chart-5)", "#8A6D3B"];

export function depensesParCategorie(espaceId: string) {
  const depenses = getDepenses(espaceId);
  const totals = new Map<string, number>();
  for (const d of depenses) totals.set(d.categorie, (totals.get(d.categorie) ?? 0) + d.montant);
  return Array.from(totals.entries())
    .map(([categorie, montant], i) => ({ categorie, montant, couleur: PALETTE_DEPENSES[i % PALETTE_DEPENSES.length] }))
    .sort((a, b) => b.montant - a.montant);
}
