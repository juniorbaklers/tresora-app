"use client";

import Link from "next/link";
import { Coins, Plus, ArrowRight } from "lucide-react";
import { PageHeader } from "@/components/app-shell/page-header";
import { EmptyState } from "@/components/app-shell/empty-state";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { cotisationStats } from "@/lib/data";
import { useCotisations } from "@/lib/selecteurs";
import { formatDate, formatFCFA } from "@/lib/format";
import type { Espace } from "@/lib/types";

export function CotisationsListe({ espace }: { espace: Espace }) {
  const cotisations = useCotisations(espace.id);

  return (
    <>
      <PageHeader
        eyebrow="Collectes internes"
        title="Cotisations"
        subtitle={`${espace.nom} — suivez les cotisations et le taux de recouvrement des membres.`}
        action={
          <Button asChild>
            <Link href={`/espace/${espace.id}/cotisations/nouvelle`}>
              <Plus className="h-4 w-4" />
              Nouvelle cotisation
            </Link>
          </Button>
        }
      />

      {cotisations.length === 0 ? (
        <EmptyState
          icon={Coins}
          title="Aucune cotisation pour le moment"
          description="Créez votre première cotisation pour commencer à suivre les paiements des membres."
          action={
            <Button asChild>
              <Link href={`/espace/${espace.id}/cotisations/nouvelle`}>Créer une cotisation</Link>
            </Button>
          }
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {cotisations.map((c, i) => {
            const stats = cotisationStats(c);
            return (
              <Link
                key={c.id}
                href={`/espace/${espace.id}/cotisations/${c.id}`}
                className="carte-vive group animate-in fade-in slide-in-from-bottom-3 flex flex-col rounded-xl border border-border bg-card shadow-[0_1px_2px_rgba(27,35,56,0.04),0_10px_28px_-16px_rgba(27,35,56,0.16)] p-5 duration-700 fill-mode-both hover:border-gold"
                style={{ animationDelay: `${i * 80}ms` }}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-heading text-[19px] leading-tight">{c.nom}</p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {formatDate(c.dateDebut)} → {formatDate(c.dateLimite)}
                    </p>
                  </div>
                  <Badge variant={c.statut === "active" ? "default" : "secondary"} className="shrink-0 font-normal">
                    {c.statut === "active" ? "Active" : "Clôturée"}
                  </Badge>
                </div>

                <div className="mt-4 flex items-center gap-3">
                  <Progress value={stats.tauxRecouvrement} className="h-2 flex-1" />
                  <span className="font-tabular text-sm font-medium">{stats.tauxRecouvrement}%</span>
                </div>
                <p className="mt-2 font-tabular text-sm text-muted-foreground">
                  {formatFCFA(stats.totalCollecte)} collectés sur {formatFCFA(stats.totalAttendu)}
                </p>

                <div className="mt-4 flex items-center justify-between border-t border-ledger-line pt-3 text-xs text-muted-foreground">
                  <span>
                    {formatFCFA(c.montant)} / membre · {c.paiements.length} membres
                  </span>
                  <ArrowRight className="h-4 w-4 opacity-0 transition-opacity group-hover:opacity-100" />
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </>
  );
}
