"use client";

import { notFound } from "next/navigation";
import { Coins, Users, TrendingUp, AlertCircle } from "lucide-react";
import { PageHeader } from "@/components/app-shell/page-header";
import { StatCard } from "@/components/dashboard/stat-card";
import { SuiviTable } from "@/components/cotisations/suivi-table";
import { RappelsCotisation } from "@/components/cotisations/rappels-cotisation";
import { Badge } from "@/components/ui/badge";
import { cotisationStats, getMembre } from "@/lib/data";
import { useCotisation } from "@/lib/selecteurs";
import { formatDate, formatFCFA } from "@/lib/format";
import type { Espace } from "@/lib/types";

const PERIODICITE_LABELS: Record<string, string> = {
  unique: "Unique",
  hebdomadaire: "Hebdomadaire",
  mensuelle: "Mensuelle",
  trimestrielle: "Trimestrielle",
  annuelle: "Annuelle",
  personnalisee: "Personnalisée",
};

export function CotisationDetail({ espace, cotisationId }: { espace: Espace; cotisationId: string }) {
  const cotisation = useCotisation(cotisationId);
  if (!cotisation || cotisation.espaceId !== espace.id) notFound();

  const stats = cotisationStats(cotisation);
  const lignes = cotisation.paiements
    .map((p) => {
      const membre = getMembre(espace.id, p.membreId);
      return membre ? { ...p, membre } : null;
    })
    .filter((l): l is NonNullable<typeof l> => l !== null);

  return (
    <>
      <PageHeader
        eyebrow={`Cotisations — ${espace.nom}`}
        title={cotisation.nom}
        subtitle={cotisation.description}
        action={
          <div className="flex items-center gap-3">
            <Badge variant={cotisation.statut === "active" ? "default" : "secondary"}>
              {cotisation.statut === "active" ? "Active" : "Clôturée"}
            </Badge>
          </div>
        }
      />

      <div className="mb-6 flex flex-wrap gap-x-6 gap-y-1 text-sm text-muted-foreground">
        <span>
          Montant : <span className="font-tabular text-foreground">{formatFCFA(cotisation.montant)}</span> / membre
        </span>
        <span>Périodicité : {PERIODICITE_LABELS[cotisation.periodicite]}</span>
        <span>
          Du {formatDate(cotisation.dateDebut)} au {formatDate(cotisation.dateLimite)}
        </span>
        <span>Responsable : {cotisation.responsable}</span>
      </div>

      <div className="mb-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="Total attendu" value={formatFCFA(stats.totalAttendu)} icon={Coins} />
        <StatCard label="Total collecté" value={formatFCFA(stats.totalCollecte)} icon={TrendingUp} accent="positive" />
        <StatCard label="Taux de recouvrement" value={`${stats.tauxRecouvrement}%`} icon={Users} accent="gold" />
        <StatCard label="Impayés / en retard" value={String(stats.nbImpaye + stats.nbEnRetard)} icon={AlertCircle} accent="negative" />
      </div>

      {cotisation.statut === "active" && (
        <div className="mb-8">
          <RappelsCotisation cotisation={cotisation} />
        </div>
      )}

      <SuiviTable cotisationId={cotisation.id} paiements={lignes} montant={cotisation.montant} />
    </>
  );
}
