"use client";

import Link from "next/link";
import { Plus, TrendingDown, Paperclip } from "lucide-react";
import { PageHeader } from "@/components/app-shell/page-header";
import { FinancesTabs } from "@/components/finances/finances-tabs";
import { EmptyState } from "@/components/app-shell/empty-state";
import { CorrectionDialog } from "@/components/finances/correction-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { useDepenses, useTotalDepenses } from "@/lib/selecteurs";
import { useTresoraStore } from "@/lib/store";
import { formatDate, formatFCFA } from "@/lib/format";
import type { Espace } from "@/lib/types";

export function DepensesListe({ espace }: { espace: Espace }) {
  const depenses = [...useDepenses(espace.id)].sort((a, b) => b.date.localeCompare(a.date));
  const total = useTotalDepenses(espace.id);
  const corrigerDepense = useTresoraStore((s) => s.corrigerDepense);
  const showCloture = espace.modules.includes("dimes") || espace.modules.includes("offrandes");

  return (
    <>
      <PageHeader
        eyebrow={espace.nom}
        title="Dépenses"
        subtitle={`${formatFCFA(total)} de dépenses enregistrées.`}
        action={
          <Button asChild>
            <Link href={`/espace/${espace.id}/finances/depenses/nouvelle`}>
              <Plus className="h-4 w-4" />
              Nouvelle dépense
            </Link>
          </Button>
        }
      />
      <FinancesTabs espaceId={espace.id} showCloture={showCloture} />

      {depenses.length === 0 ? (
        <EmptyState icon={TrendingDown} title="Aucune dépense pour le moment" description="Enregistrez votre première dépense pour commencer." />
      ) : (
        <div className="overflow-x-auto rounded-xl border border-border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Catégorie</TableHead>
                <TableHead>Bénéficiaire</TableHead>
                <TableHead>Justificatif</TableHead>
                <TableHead className="text-right">Montant</TableHead>
                <TableHead className="w-10" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {depenses.map((d) => (
                <TableRow key={d.id}>
                  <TableCell className="whitespace-nowrap text-muted-foreground">{formatDate(d.date)}</TableCell>
                  <TableCell className="font-medium">
                    {d.description}
                    {d.corrections && d.corrections.length > 0 && (
                      <span className="ml-2 rounded-full bg-secondary px-1.5 py-0.5 text-[10px] font-normal text-muted-foreground">
                        corrigé
                      </span>
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary" className="font-normal">
                      {d.categorie}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{d.beneficiaire}</TableCell>
                  <TableCell>
                    {d.justificatif ? (
                      <span className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Paperclip className="h-3.5 w-3.5" /> Joint
                      </span>
                    ) : (
                      <span className="text-xs text-muted-foreground">—</span>
                    )}
                  </TableCell>
                  <TableCell className="text-right font-tabular text-destructive">-{formatFCFA(d.montant)}</TableCell>
                  <TableCell>
                    <CorrectionDialog
                      champLabel="Montant"
                      valeurActuelle={String(d.montant)}
                      type="montant"
                      corrections={d.corrections}
                      onValider={(nouvelle, raison) => corrigerDepense(espace.id, d.id, "montant", nouvelle, raison)}
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
