"use client";

import { FileSpreadsheet, FileText, Printer } from "lucide-react";
import { Button } from "@/components/ui/button";
import { exportCSV, exportWord } from "@/lib/export";
import { formatDate, formatFCFA } from "@/lib/format";
import type { StyleRapport } from "@/lib/types";

interface Ligne {
  label: string;
  montant: number;
}

interface LigneDetail {
  date: string;
  libelle: string;
  categorie: string;
  montant: number;
}

export function ExportButtons({
  espaceNom,
  periode,
  style = "classique",
  recettes,
  depenses,
  totalRecettes,
  totalDepenses,
  detailRecettes = [],
  detailDepenses = [],
}: {
  espaceNom: string;
  periode: string;
  style?: StyleRapport;
  recettes: Ligne[];
  depenses: Ligne[];
  totalRecettes: number;
  totalDepenses: number;
  detailRecettes?: LigneDetail[];
  detailDepenses?: LigneDetail[];
}) {
  const soldeNet = totalRecettes - totalDepenses;
  const slug = `rapport-${espaceNom.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${periode.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;

  function handleCSV() {
    const rows: (string | number)[][] = [
      [`Rapport financier — ${espaceNom} — ${periode}`],
      [],
      ["Recettes par catégorie", "Montant"],
      ...recettes.map((r) => [r.label, r.montant]),
      ["Total recettes", totalRecettes],
      [],
      ["Dépenses par catégorie", "Montant"],
      ...depenses.map((d) => [d.label, d.montant]),
      ["Total dépenses", totalDepenses],
      [],
      ["Solde net", soldeNet],
    ];
    if (detailRecettes.length > 0) {
      rows.push([], ["Détail des recettes", "", "", ""], ["Date", "Libellé", "Catégorie", "Montant"]);
      for (const l of detailRecettes) rows.push([formatDate(l.date), l.libelle, l.categorie, l.montant]);
    }
    if (detailDepenses.length > 0) {
      rows.push([], ["Détail des dépenses", "", "", ""], ["Date", "Libellé", "Catégorie", "Montant"]);
      for (const l of detailDepenses) rows.push([formatDate(l.date), l.libelle, l.categorie, l.montant]);
    }
    exportCSV(`${slug}.csv`, rows);
  }

  function handleWord() {
    const ligne = (r: Ligne) => `<tr><td>${r.label}</td><td>${formatFCFA(r.montant)}</td></tr>`;
    const ligneDetail = (l: LigneDetail) => `<tr><td>${formatDate(l.date)}</td><td>${l.libelle}</td><td>${l.categorie}</td><td>${formatFCFA(l.montant)}</td></tr>`;
    const tableDetail = (titre: string, lignes: LigneDetail[]) =>
      lignes.length === 0
        ? ""
        : `<h3>${titre}</h3><table><tr><th>Date</th><th>Libellé</th><th>Catégorie</th><th>Montant</th></tr>${lignes.map(ligneDetail).join("")}</table>`;

    const html = `
      <h1>Rapport financier</h1>
      <p class="sub">${espaceNom} — ${periode}</p>
      <h3>Recettes par catégorie</h3>
      <table><tr><th>Catégorie</th><th>Montant</th></tr>${recettes.map(ligne).join("")}<tr class="total"><td>Total recettes</td><td>${formatFCFA(totalRecettes)}</td></tr></table>
      <h3>Dépenses par catégorie</h3>
      <table><tr><th>Catégorie</th><th>Montant</th></tr>${depenses.map(ligne).join("")}<tr class="total"><td>Total dépenses</td><td>${formatFCFA(totalDepenses)}</td></tr></table>
      <h3>Solde net : ${formatFCFA(soldeNet)}</h3>
      ${tableDetail("Détail des recettes", detailRecettes)}
      ${tableDetail("Détail des dépenses", detailDepenses)}
    `;
    exportWord(`${slug}.doc`, `Rapport financier — ${espaceNom}`, html, style);
  }

  return (
    <div className="flex gap-2 print:hidden">
      <Button variant="outline" size="sm" onClick={() => window.print()}>
        <Printer className="h-4 w-4" />
        PDF
      </Button>
      <Button variant="outline" size="sm" onClick={handleCSV}>
        <FileSpreadsheet className="h-4 w-4" />
        Excel
      </Button>
      <Button variant="outline" size="sm" onClick={handleWord}>
        <FileText className="h-4 w-4" />
        Word
      </Button>
    </div>
  );
}
