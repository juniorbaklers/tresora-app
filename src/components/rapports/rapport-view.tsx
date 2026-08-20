"use client";

import { useMemo, useState } from "react";
import { SlidersHorizontal } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { ExportButtons } from "@/components/rapports/export-buttons";
import { PageHeader } from "@/components/app-shell/page-header";
import {
  PERIODES_RAPPORT,
  depensesParCategorieListe,
  filtrerParIntervalle,
  repartitionRecettesListe,
  LABELS_CATEGORIE_RECETTE,
  type PeriodeRapport,
} from "@/lib/charts";
import { formatDate, formatFCFA } from "@/lib/format";
import type { CategorieRecette, Depense, Espace, Recette } from "@/lib/types";

export function RapportView({ espace, recettes, depenses }: { espace: Espace; recettes: Recette[]; depenses: Depense[] }) {
  const [periode, setPeriode] = useState<PeriodeRapport>("M1");
  const [debutPerso, setDebutPerso] = useState("2026-08-01");
  const [finPerso, setFinPerso] = useState("2026-08-31");

  const categoriesRecetteDisponibles = useMemo(
    () => Array.from(new Set(recettes.map((r) => r.categorie))) as CategorieRecette[],
    [recettes]
  );
  const categoriesDepenseDisponibles = useMemo(() => Array.from(new Set(depenses.map((d) => d.categorie))), [depenses]);

  const [categoriesRecetteExclues, setCategoriesRecetteExclues] = useState<Set<CategorieRecette>>(new Set());
  const [categoriesDepenseExclues, setCategoriesDepenseExclues] = useState<Set<string>>(new Set());

  function toggleRecetteCategorie(c: CategorieRecette) {
    setCategoriesRecetteExclues((prev) => {
      const next = new Set(prev);
      if (next.has(c)) next.delete(c);
      else next.add(c);
      return next;
    });
  }

  function toggleDepenseCategorie(c: string) {
    setCategoriesDepenseExclues((prev) => {
      const next = new Set(prev);
      if (next.has(c)) next.delete(c);
      else next.add(c);
      return next;
    });
  }

  const optionActive = PERIODES_RAPPORT.find((p) => p.value === periode);
  const debut = periode === "PERSONNALISE" ? debutPerso : optionActive?.debut ?? "2026-01-01";
  const fin = periode === "PERSONNALISE" ? finPerso : optionActive?.fin ?? "2026-12-31";

  const { repartitionR, repartitionD, totalR, totalD, recettesFiltrees, depensesFiltrees } = useMemo(() => {
    const recettesIntervalle = filtrerParIntervalle(recettes, debut, fin)
      .filter((r) => !categoriesRecetteExclues.has(r.categorie))
      .sort((a, b) => b.date.localeCompare(a.date));
    const depensesIntervalle = filtrerParIntervalle(depenses, debut, fin)
      .filter((d) => !categoriesDepenseExclues.has(d.categorie))
      .sort((a, b) => b.date.localeCompare(a.date));
    const repartitionR = repartitionRecettesListe(recettesIntervalle);
    const repartitionD = depensesParCategorieListe(depensesIntervalle);
    return {
      recettesFiltrees: recettesIntervalle,
      depensesFiltrees: depensesIntervalle,
      repartitionR,
      repartitionD,
      totalR: repartitionR.reduce((s, r) => s + r.montant, 0),
      totalD: repartitionD.reduce((s, d) => s + d.montant, 0),
    };
  }, [recettes, depenses, debut, fin, categoriesRecetteExclues, categoriesDepenseExclues]);

  const soldeNet = totalR - totalD;
  const filtresActifs = categoriesRecetteExclues.size + categoriesDepenseExclues.size;
  const periodeLabel = periode === "PERSONNALISE" ? `${debut} → ${fin}` : optionActive?.label ?? "";

  return (
    <div>
      <PageHeader
        eyebrow={espace.nom}
        title="Rapport financier"
        subtitle="Choisissez la période et le contenu à consulter ou à exporter."
        action={
          <ExportButtons
            espaceNom={espace.nom}
            periode={periodeLabel}
            recettes={repartitionR.map((r) => ({ label: r.label, montant: r.montant }))}
            depenses={repartitionD.map((d) => ({ label: d.categorie, montant: d.montant }))}
            totalRecettes={totalR}
            totalDepenses={totalD}
            detailRecettes={recettesFiltrees.map((r) => ({
              date: r.date,
              libelle: r.libelle,
              categorie: LABELS_CATEGORIE_RECETTE[r.categorie],
              montant: r.montant,
            }))}
            detailDepenses={depensesFiltrees.map((d) => ({
              date: d.date,
              libelle: d.description,
              categorie: d.categorie,
              montant: d.montant,
            }))}
          />
        }
      />

      <div className="mb-6 flex flex-wrap items-end gap-3 print:hidden">
        <div className="w-full max-w-xs">
          <Label className="mb-2 block text-xs text-muted-foreground">Période</Label>
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

        {periode === "PERSONNALISE" && (
          <>
            <div>
              <Label className="mb-2 block text-xs text-muted-foreground">Du</Label>
              <Input type="date" value={debutPerso} onChange={(e) => setDebutPerso(e.target.value)} className="w-40" />
            </div>
            <div>
              <Label className="mb-2 block text-xs text-muted-foreground">Au</Label>
              <Input type="date" value={finPerso} onChange={(e) => setFinPerso(e.target.value)} className="w-40" />
            </div>
          </>
        )}

        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline">
              <SlidersHorizontal className="h-4 w-4" />
              Contenu du rapport
              {filtresActifs > 0 && <span className="ml-1 rounded-full bg-gold px-1.5 text-xs text-gold-foreground">{filtresActifs}</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent align="start" className="w-72">
            <p className="mb-3 text-xs font-medium uppercase tracking-wide text-muted-foreground">Catégories de recettes</p>
            <div className="mb-4 space-y-2">
              {categoriesRecetteDisponibles.map((c) => (
                <label key={c} className="flex items-center gap-2.5 text-sm">
                  <Checkbox checked={!categoriesRecetteExclues.has(c)} onCheckedChange={() => toggleRecetteCategorie(c)} />
                  {LABELS_CATEGORIE_RECETTE[c]}
                </label>
              ))}
            </div>
            <p className="mb-3 text-xs font-medium uppercase tracking-wide text-muted-foreground">Catégories de dépenses</p>
            <div className="space-y-2">
              {categoriesDepenseDisponibles.map((c) => (
                <label key={c} className="flex items-center gap-2.5 text-sm">
                  <Checkbox checked={!categoriesDepenseExclues.has(c)} onCheckedChange={() => toggleDepenseCategorie(c)} />
                  {c}
                </label>
              ))}
            </div>
          </PopoverContent>
        </Popover>
      </div>

      <p className="mb-6 hidden text-sm text-muted-foreground print:block">{periodeLabel}</p>

      {recettesFiltrees.length === 0 && depensesFiltrees.length === 0 ? (
        <Card className="ledger-card">
          <CardContent className="py-10 text-center text-sm text-muted-foreground">
            Aucune opération enregistrée pour cette période et ces catégories.
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
                <p className="py-2 text-sm text-muted-foreground">Aucune recette pour ce filtre.</p>
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

          {recettesFiltrees.length > 0 && (
            <div className="mb-8">
              <h3 className="mb-3 text-sm font-medium">Détail des recettes</h3>
              <div className="overflow-x-auto rounded-xl border border-border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Libellé</TableHead>
                      <TableHead>Catégorie</TableHead>
                      <TableHead className="text-right">Montant</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {recettesFiltrees.map((r) => (
                      <TableRow key={r.id}>
                        <TableCell className="whitespace-nowrap text-muted-foreground">{formatDate(r.date)}</TableCell>
                        <TableCell className="font-medium">{r.libelle}</TableCell>
                        <TableCell className="text-muted-foreground">{LABELS_CATEGORIE_RECETTE[r.categorie]}</TableCell>
                        <TableCell className="text-right font-tabular text-positive">+{formatFCFA(r.montant)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          )}

          <Card className="ledger-card mb-4">
            <CardHeader>
              <CardTitle className="text-[15px] font-medium">Dépenses</CardTitle>
            </CardHeader>
            <CardContent>
              {repartitionD.length === 0 ? (
                <p className="py-2 text-sm text-muted-foreground">Aucune dépense pour ce filtre.</p>
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

          {depensesFiltrees.length > 0 && (
            <div className="mb-8">
              <h3 className="mb-3 text-sm font-medium">Détail des dépenses</h3>
              <div className="overflow-x-auto rounded-xl border border-border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Catégorie</TableHead>
                      <TableHead className="text-right">Montant</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {depensesFiltrees.map((d) => (
                      <TableRow key={d.id}>
                        <TableCell className="whitespace-nowrap text-muted-foreground">{formatDate(d.date)}</TableCell>
                        <TableCell className="font-medium">{d.description}</TableCell>
                        <TableCell className="text-muted-foreground">{d.categorie}</TableCell>
                        <TableCell className="text-right font-tabular text-destructive">-{formatFCFA(d.montant)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          )}

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
