"use client";

import Link from "next/link";
import { Plus, CalendarDays, ArrowRight, Users } from "lucide-react";
import { PageHeader } from "@/components/app-shell/page-header";
import { EmptyState } from "@/components/app-shell/empty-state";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useEvenements } from "@/lib/selecteurs";
import { formatDate, formatFCFA, pct } from "@/lib/format";
import type { Espace } from "@/lib/types";

const STATUT_LABELS: Record<string, string> = { planifie: "Planifié", actif: "Actif", termine: "Terminé" };

export function EvenementsListe({ espace }: { espace: Espace }) {
  const evenements = useEvenements(espace.id);

  return (
    <>
      <PageHeader
        eyebrow={espace.nom}
        title="Événements"
        subtitle="Sorties, projets et collectes avec un objectif financier."
        action={
          <Button asChild>
            <Link href={`/espace/${espace.id}/evenements/nouveau`}>
              <Plus className="h-4 w-4" />
              Créer un événement
            </Link>
          </Button>
        }
      />

      {evenements.length === 0 ? (
        <EmptyState icon={CalendarDays} title="Aucun événement pour le moment" description="Créez un événement pour suivre sa collecte financière." />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {evenements.map((e, i) => (
            <Link
              key={e.id}
              href={`/espace/${espace.id}/evenements/${e.id}`}
              className="carte-vive group animate-in fade-in slide-in-from-bottom-3 flex flex-col rounded-xl border border-border bg-card shadow-[0_1px_2px_rgba(27,35,56,0.04),0_10px_28px_-16px_rgba(27,35,56,0.16)] p-5 duration-700 fill-mode-both hover:border-gold"
              style={{ animationDelay: `${i * 80}ms` }}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-heading text-[19px] leading-tight">{e.nom}</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {formatDate(e.dateDebut)} → {formatDate(e.dateFin)}
                  </p>
                </div>
                <Badge variant={e.statut === "actif" ? "default" : "secondary"} className="shrink-0 font-normal">
                  {STATUT_LABELS[e.statut]}
                </Badge>
              </div>
              <p className="mt-3 line-clamp-2 text-sm text-muted-foreground">{e.description}</p>

              {e.montantCible && (
                <>
                  <div className="mt-4 flex items-center gap-3">
                    <Progress value={pct(e.montantCollecte, e.montantCible)} className="h-2 flex-1" />
                    <span className="font-tabular text-sm font-medium">{pct(e.montantCollecte, e.montantCible)}%</span>
                  </div>
                  <p className="mt-2 font-tabular text-sm text-muted-foreground">
                    {formatFCFA(e.montantCollecte)} / {formatFCFA(e.montantCible)}
                  </p>
                </>
              )}

              <div className="mt-4 flex items-center justify-between border-t border-ledger-line pt-3 text-xs text-muted-foreground">
                <span className="flex items-center gap-1.5">
                  <Users className="h-3.5 w-3.5" /> {e.participants} participants
                </span>
                <ArrowRight className="h-4 w-4 opacity-0 transition-opacity group-hover:opacity-100" />
              </div>
            </Link>
          ))}
        </div>
      )}
    </>
  );
}
