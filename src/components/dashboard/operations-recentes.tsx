"use client";

import { ArrowDownLeft, ArrowUpRight } from "lucide-react";
import { useRecettes, useDepenses } from "@/lib/selecteurs";
import { formatDateCourte, formatFCFA } from "@/lib/format";
import { LABELS_CATEGORIE_RECETTE } from "@/lib/charts";

export function OperationsRecentes({ espaceId }: { espaceId: string }) {
  const recettes = useRecettes(espaceId);
  const depenses = useDepenses(espaceId);

  const operations = [
    ...recettes.map((r) => ({
      id: r.id,
      date: r.date,
      libelle: r.libelle ?? LABELS_CATEGORIE_RECETTE[r.categorie],
      responsable: r.responsable,
      montant: r.montant,
      sens: "entree" as const,
    })),
    ...depenses.map((d) => ({
      id: d.id,
      date: d.date,
      libelle: d.description,
      responsable: d.responsable,
      montant: d.montant,
      sens: "sortie" as const,
    })),
  ]
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, 6);

  return (
    <ul className="divide-y divide-ledger-line">
      {operations.map((op) => (
        <li key={op.id} className="flex items-center gap-3 py-3">
          <span
            className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
              op.sens === "entree" ? "bg-positive/10 text-positive" : "bg-destructive/10 text-destructive"
            }`}
          >
            {op.sens === "entree" ? <ArrowDownLeft className="h-4 w-4" /> : <ArrowUpRight className="h-4 w-4" />}
          </span>
          <div className="min-w-0 flex-1">
            <p className="truncate text-[13.5px] font-medium">{op.libelle}</p>
            <p className="text-xs text-muted-foreground">
              {formatDateCourte(op.date)} · {op.responsable}
            </p>
          </div>
          <span className={`shrink-0 font-tabular text-[13.5px] ${op.sens === "entree" ? "text-positive" : "text-destructive"}`}>
            {op.sens === "entree" ? "+" : "-"}
            {formatFCFA(op.montant)}
          </span>
        </li>
      ))}
    </ul>
  );
}
