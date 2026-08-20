"use client";

import { FileSpreadsheet, FileText, Printer } from "lucide-react";
import { Button } from "@/components/ui/button";
import { exportCSV, exportWord } from "@/lib/export";
import { formatFCFA } from "@/lib/format";

interface Ligne {
  label: string;
  montant: number;
}

export function ExportButtons({
  espaceNom,
  periode,
  recettes,
  depenses,
  totalRecettes,
  totalDepenses,
}: {
  espaceNom: string;
  periode: string;
  recettes: Ligne[];
  depenses: Ligne[];
  totalRecettes: number;
  totalDepenses: number;
}) {
  const soldeNet = totalRecettes - totalDepenses;
  const slug = `rapport-${espaceNom.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${periode.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;

  function handleCSV() {
    const rows: (string | number)[][] = [
      [`Rapport financier — ${espaceNom} — ${periode}`],
      [],
      ["Recettes", "Montant"],
      ...recettes.map((r) => [r.label, r.montant]),
      ["Total recettes", totalRecettes],
      [],
      ["Dépenses", "Montant"],
      ...depenses.map((d) => [d.label, d.montant]),
      ["Total dépenses", totalDepenses],
      [],
      ["Solde net", soldeNet],
    ];
    exportCSV(`${slug}.csv`, rows);
  }

  function handleWord() {
    const ligne = (r: Ligne) => `<tr><td>${r.label}</td><td>${formatFCFA(r.montant)}</td></tr>`;
    const html = `
      <h1>Rapport financier</h1>
      <p class="sub">${espaceNom} — ${periode}</p>
      <h3>Recettes</h3>
      <table><tr><th>Catégorie</th><th>Montant</th></tr>${recettes.map(ligne).join("")}<tr class="total"><td>Total recettes</td><td>${formatFCFA(totalRecettes)}</td></tr></table>
      <h3>Dépenses</h3>
      <table><tr><th>Catégorie</th><th>Montant</th></tr>${depenses.map(ligne).join("")}<tr class="total"><td>Total dépenses</td><td>${formatFCFA(totalDepenses)}</td></tr></table>
      <h3>Solde net : ${formatFCFA(soldeNet)}</h3>
    `;
    exportWord(`${slug}.doc`, `Rapport financier — ${espaceNom}`, html);
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
