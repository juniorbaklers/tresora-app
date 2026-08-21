"use client";

import Link from "next/link";
import { Plus, TrendingUp } from "lucide-react";
import { PageHeader } from "@/components/app-shell/page-header";
import { FinancesTabs } from "@/components/finances/finances-tabs";
import { EmptyState } from "@/components/app-shell/empty-state";
import { CategorieRecetteBadge } from "@/components/finances/categorie-recette-badge";
import { CorrectionDialog } from "@/components/finances/correction-dialog";
import { Button } from "@/components/ui/button";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { useRecettes, useTotalRecettes } from "@/lib/selecteurs";
import { useTresoraStore } from "@/lib/store";
import { formatDate, formatFCFA } from "@/lib/format";
import type { Espace } from "@/lib/types";

export function RecettesListe({ espace }: { espace: Espace }) {
  const recettes = [...useRecettes(espace.id)].sort((a, b) => b.date.localeCompare(a.date));
  const total = useTotalRecettes(espace.id);
  const corrigerRecette = useTresoraStore((s) => s.corrigerRecette);
  const showCloture = espace.modules.includes("dimes") || espace.modules.includes("offrandes");

  return (
    <>
      <PageHeader
        eyebrow={espace.nom}
        title="Recettes"
        subtitle={`${formatFCFA(total)} de recettes enregistrées.`}
        action={
          <Button asChild>
            <Link href={`/espace/${espace.id}/finances/recettes/nouvelle`}>
              <Plus className="h-4 w-4" />
              Nouvelle recette
            </Link>
          </Button>
        }
      />
      <FinancesTabs espaceId={espace.id} showCloture={showCloture} />

      {recettes.length === 0 ? (
        <EmptyState icon={TrendingUp} title="Aucune recette pour le moment" description="Enregistrez votre première recette pour commencer." />
      ) : (
        <div className="overflow-x-auto rounded-xl border border-border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Libellé</TableHead>
                <TableHead>Catégorie</TableHead>
                <TableHead>Responsable</TableHead>
                <TableHead className="text-right">Montant</TableHead>
                <TableHead className="w-10" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {recettes.map((r) => (
                <TableRow key={r.id}>
                  <TableCell className="whitespace-nowrap text-muted-foreground">{formatDate(r.date)}</TableCell>
                  <TableCell className="font-medium">
                    {r.libelle}
                    {r.corrections && r.corrections.length > 0 && (
                      <span className="ml-2 rounded-full bg-secondary px-1.5 py-0.5 text-[10px] font-normal text-muted-foreground">
                        corrigé
                      </span>
                    )}
                  </TableCell>
                  <TableCell>
                    <CategorieRecetteBadge categorie={r.categorie} />
                  </TableCell>
                  <TableCell className="text-muted-foreground">{r.responsable}</TableCell>
                  <TableCell className="text-right font-tabular text-positive">+{formatFCFA(r.montant)}</TableCell>
                  <TableCell>
                    <CorrectionDialog
                      champLabel="Montant"
                      valeurActuelle={String(r.montant)}
                      type="montant"
                      corrections={r.corrections}
                      onValider={(nouvelle, raison) => corrigerRecette(espace.id, r.id, "montant", nouvelle, raison)}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </>
  );
}
