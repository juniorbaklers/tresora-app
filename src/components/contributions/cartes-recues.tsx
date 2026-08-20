"use client";

import { useState } from "react";
import Link from "next/link";
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
import { ContributionStatutBadge } from "@/components/contributions/statut-badge";
import { formatDate, formatFCFA, pct } from "@/lib/format";
import type { Contribution, StatutContribution } from "@/lib/types";

export function CartesContributionsRecues({ espaceId, contributions: initial }: { espaceId: string; contributions: Contribution[] }) {
  const [contributions, setContributions] = useState(initial);
  const [dialogId, setDialogId] = useState<string | null>(null);
  const [montant, setMontant] = useState("");

  const active = contributions.find((c) => c.id === dialogId);

  function ouvrir(c: Contribution) {
    setDialogId(c.id);
    setMontant(String(c.montantDemande - c.montantRecu));
  }

  function enregistrer() {
    if (!dialogId) return;
    const valeur = Math.max(0, Number(montant) || 0);
    setContributions((prev) =>
      prev.map((c) => {
        if (c.id !== dialogId) return c;
        const montantRecu = Math.min(c.montantDemande, c.montantRecu + valeur);
        const statut: StatutContribution = montantRecu >= c.montantDemande ? "paye" : montantRecu > 0 ? "partiel" : "en_attente";
        return {
          ...c,
          montantRecu,
          statut,
          historique: [...c.historique, { date: new Date().toISOString().slice(0, 10), montant: valeur }],
        };
      })
    );
    setDialogId(null);
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {contributions.map((c) => (
        <div key={c.id} className="flex flex-col rounded-xl border border-border bg-card p-5">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-xs text-muted-foreground">Demandé par l&apos;église</p>
              <Link href={`/espace/${espaceId}/contributions/${c.id}`} className="font-heading text-[18px] leading-tight hover:underline">
                {c.projet}
              </Link>
            </div>
            <ContributionStatutBadge statut={c.statut} />
          </div>
          <p className="mt-2 text-sm text-muted-foreground">{c.description}</p>

          <div className="mt-4 flex items-center gap-3">
            <Progress value={pct(c.montantRecu, c.montantDemande)} className="h-2 flex-1" />
            <span className="font-tabular text-sm">{pct(c.montantRecu, c.montantDemande)}%</span>
          </div>
          <p className="mt-2 font-tabular text-sm text-muted-foreground">
            {formatFCFA(c.montantRecu)} versés sur {formatFCFA(c.montantDemande)}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">Échéance : {formatDate(c.dateLimite)}</p>

          {c.statut !== "paye" && (
            <Button className="mt-4 w-full" variant="outline" onClick={() => ouvrir(c)}>
              <HandCoins className="h-4 w-4" />
              Enregistrer un versement
            </Button>
          )}
        </div>
      ))}

      <Dialog open={!!dialogId} onOpenChange={(open) => !open && setDialogId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Enregistrer un versement</DialogTitle>
            <DialogDescription>
              {active?.projet} — reste dû : {active && formatFCFA(active.montantDemande - active.montantRecu)}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-2 py-2">
            <label className="text-sm font-medium">Montant versé</label>
            <Input type="number" value={montant} onChange={(e) => setMontant(e.target.value)} min={0} />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogId(null)}>
              Annuler
            </Button>
            <Button onClick={enregistrer}>
              <CheckCircle2 className="h-4 w-4" />
              Valider le versement
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
