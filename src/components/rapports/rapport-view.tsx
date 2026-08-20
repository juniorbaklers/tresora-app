"use client";

import { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ExportButtons } from "@/components/rapports/export-buttons";
import { PageHeader } from "@/components/app-shell/page-header";
import {
  PERIODES_RAPPORT,
  depensesParCategorieListe,
  filtrerParPeriode,
  repartitionRecettesListe,
  type PeriodeRapport,
} from "@/lib/charts";
import { formatFCFA } from "@/lib/format";
import type { Depense, Espace, Recette } from "@/lib/types";

export function RapportView({ espace, recettes, depenses }: { espace: Espace; recettes: Recette[]; depenses: Depense[] }) {
  const [periode, setPeriode] = useState<PeriodeRapport>("tout");

  const { recettesPeriode, depensesPeriode, repartitionR, repartitionD, totalR, totalD } = useMemo(() => {
    const recettesPeriode = filtrerParPeriode(recettes, periode);
    const depensesPeriode = filtrerParPeriode(depenses, periode);
    const repartitionR = repartitionRecettesListe(recettesPeriode);
    const repartitionD = depensesParCategorieListe(depensesPeriode);
    return {
      recettesPeriode,
      depensesPeriode,
      repartitionR,
      repartitionD,
      totalR: repartitionR.reduce((s, r) => s + r.montant, 0),
      totalD: repartitionD.reduce((s, d) => s + d.montant, 0),
    };
  }, [recettes, depenses, periode]);

  const soldeNet = totalR - totalD;
  const periodeLabel = PERIODES_RAPPORT.find((p) => p.value === periode)?.label ?? "";

  return (
    <div>
      <PageHeader
        eyebrow={espace.nom}
        title="Rapport financier"
        subtitle="Choisissez la période à consulter ou à exporter."
        action={
          <ExportButtons
            espaceNom={espace.nom}
            periode={periodeLabel}
            recettes={repartitionR.map((r) => ({ label: r.label, montant: r.montant }))}
            depenses={repartitionD.map((d) => ({ label: d.categorie, montant: d.montant }))}
            totalRecettes={totalR}
            totalDepenses={totalD}
          />
        }
      />

      <div className="mb-6 max-w-xs print:hidden">
        <Select value={periode} onValueChange={(v) => setPeriode(v as PeriodeRapport)}>
          <SelectTrigger className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {PERIODES_RAPPORT.map((p) => (
              <SelectItem key={p.value} value={p.value}>
                {p.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <p className="mb-6 hidden text-sm text-muted-foreground print:block">{periodeLabel}</p>

      {recettesPeriode.length === 0 && depensesPeriode.length === 0 ? (
        <Card className="ledger-card">
          <CardContent className="py-10 text-center text-sm text-muted-foreground">
            Aucune opération enregistrée sur cette période.
          </CardContent>
        </Card>
      ) : (
        <>
          <Card className="ledger-card mb-4">
            <CardHeader>
              <CardTitle className="text-[15px] font-medium">Recettes</CardTitle>
            </CardHeader>
            <CardContent>
              {repartitionR.length === 0 ? (
                <p className="py-2 text-sm text-muted-foreground">Aucune recette sur cette période.</p>
              ) : (
                <ul className="divide-y divide-ledger-line">
                  {repartitionR.map((r) => (
                    <li key={r.categorie} className="flex items-center justify-between py-2.5 text-sm">
                      <span className="text-muted-foreground">{r.label}</span>
                      <span className="font-tabular">{formatFCFA(r.montant)}</span>
                    </li>
                  ))}
                </ul>
              )}
              <div className="mt-2 flex items-center justify-between border-t border-ledger-line pt-3 font-medium">
                <span>Total recettes</span>
                <span className="font-tabular text-positive">{formatFCFA(totalR)}</span>
              </div>
            </CardContent>
          </Card>

          <Card className="ledger-card mb-4">
            <CardHeader>
              <CardTitle className="text-[15px] font-medium">Dépenses</CardTitle>
            </CardHeader>
            <CardContent>
              {repartitionD.length === 0 ? (
                <p className="py-2 text-sm text-muted-foreground">Aucune dépense sur cette période.</p>
              ) : (
                <ul className="divide-y divide-ledger-line">
                  {repartitionD.map((d) => (
                    <li key={d.categorie} className="flex items-center justify-between py-2.5 text-sm">
                      <span className="text-muted-foreground">{d.categorie}</span>
                      <span className="font-tabular">{formatFCFA(d.montant)}</span>
                    </li>
                  ))}
                </ul>
              )}
              <div className="mt-2 flex items-center justify-between border-t border-ledger-line pt-3 font-medium">
                <span>Total dépenses</span>
                <span className="font-tabular text-destructive">{formatFCFA(totalD)}</span>
              </div>
            </CardContent>
          </Card>

          <Card className="ledger-card">
            <CardContent className="flex items-center justify-between py-5">
              <span className="font-heading text-[19px]">Solde net</span>
              <span className="font-tabular text-[22px] font-medium text-gold">{formatFCFA(soldeNet)}</span>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
