"use client";

import { useState } from "react";
import { CheckCircle2, HandCoins } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { ContributionStatutBadge } from "@/components/contributions/statut-badge";
import { formatDate, formatFCFA, pct } from "@/lib/format";
import type { Contribution, StatutContribution } from "@/lib/types";

export function VersementPanel({ contribution: initial, peutVerser }: { contribution: Contribution; peutVerser: boolean }) {
  const [contribution, setContribution] = useState(initial);
  const [open, setOpen] = useState(false);
  const [montant, setMontant] = useState(String(initial.montantDemande - initial.montantRecu));

  function enregistrer() {
    const valeur = Math.max(0, Number(montant) || 0);
    setContribution((c) => {
      const montantRecu = Math.min(c.montantDemande, c.montantRecu + valeur);
      const statut: StatutContribution = montantRecu >= c.montantDemande ? "paye" : montantRecu > 0 ? "partiel" : "en_attente";
      return {
        ...c,
        montantRecu,
        statut,
        historique: [...c.historique, { date: new Date().toISOString().slice(0, 10), montant: valeur }],
      };
    });
    setOpen(false);
  }

  return (
    <div>
      <div className="rounded-xl border border-border bg-card shadow-[0_1px_2px_rgba(27,35,56,0.04),0_10px_28px_-16px_rgba(27,35,56,0.16)] p-6">
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">Progression</p>
          <ContributionStatutBadge statut={contribution.statut} />
        </div>
        <div className="mt-3 flex items-center gap-3">
          <Progress value={pct(contribution.montantRecu, contribution.montantDemande)} className="h-2.5 flex-1" />
          <span className="font-tabular text-base font-medium">{pct(contribution.montantRecu, contribution.montantDemande)}%</span>
        </div>
        <p className="mt-2 font-tabular text-sm text-muted-foreground">
          {formatFCFA(contribution.montantRecu)} reçus sur {formatFCFA(contribution.montantDemande)} · reste{" "}
          {formatFCFA(contribution.montantDemande - contribution.montantRecu)}
        </p>
        {peutVerser && contribution.statut !== "paye" && (
          <Button className="mt-4" onClick={() => setOpen(true)}>
            <HandCoins className="h-4 w-4" />
            Enregistrer un versement
          </Button>
        )}
      </div>

      <div className="mt-6">
        <h3 className="mb-3 text-sm font-medium">Historique des versements</h3>
        {contribution.historique.length === 0 ? (
          <p className="text-sm text-muted-foreground">Aucun versement enregistré pour le moment.</p>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">Montant</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {[...contribution.historique].reverse().map((h, i) => (
                  <TableRow key={i}>
                    <TableCell className="text-muted-foreground">{formatDate(h.date)}</TableCell>
                    <TableCell className="text-right font-tabular text-positive">+{formatFCFA(h.montant)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Enregistrer un versement</DialogTitle>
            <DialogDescription>{contribution.projet}</DialogDescription>
          </DialogHeader>
          <div className="space-y-2 py-2">
            <label className="text-sm font-medium">Montant versé</label>
            <Input type="number" value={montant} onChange={(e) => setMontant(e.target.value)} min={0} />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Annuler
            </Button>
            <Button onClick={enregistrer}>
              <CheckCircle2 className="h-4 w-4" />
              Valider
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
