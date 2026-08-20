import { notFound } from "next/navigation";
import { Coins, Users, TrendingUp, AlertCircle } from "lucide-react";
import { PageContainer } from "@/components/app-shell/page-container";
import { PageHeader } from "@/components/app-shell/page-header";
import { StatCard } from "@/components/dashboard/stat-card";
import { SuiviTable } from "@/components/cotisations/suivi-table";
import { Badge } from "@/components/ui/badge";
import { cotisationStats, getCotisation, getEspace, getMembre } from "@/lib/data";
import { formatDate, formatFCFA } from "@/lib/format";

const PERIODICITE_LABELS: Record<string, string> = {
  unique: "Unique",
  hebdomadaire: "Hebdomadaire",
  mensuelle: "Mensuelle",
  trimestrielle: "Trimestrielle",
  annuelle: "Annuelle",
  personnalisee: "Personnalisée",
};

export default async function CotisationDetailPage(props: PageProps<"/espace/[espaceId]/cotisations/[cotisationId]">) {
  const { espaceId, cotisationId } = await props.params;
  const espace = getEspace(espaceId);
  const cotisation = getCotisation(cotisationId);
  if (!espace || !cotisation || cotisation.espaceId !== espaceId) notFound();

  const stats = cotisationStats(cotisation);
  const lignes = cotisation.paiements
    .map((p) => {
      const membre = getMembre(espaceId, p.membreId);
      return membre ? { ...p, membre } : null;
    })
    .filter((l): l is NonNullable<typeof l> => l !== null);

  return (
    <PageContainer>
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
        <span>Montant : <span className="font-tabular text-foreground">{formatFCFA(cotisation.montant)}</span> / membre</span>
        <span>Périodicité : {PERIODICITE_LABELS[cotisation.periodicite]}</span>
        <span>Du {formatDate(cotisation.dateDebut)} au {formatDate(cotisation.dateLimite)}</span>
        <span>Responsable : {cotisation.responsable}</span>
      </div>

      <div className="mb-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="Total attendu" value={formatFCFA(stats.totalAttendu)} icon={Coins} />
        <StatCard label="Total collecté" value={formatFCFA(stats.totalCollecte)} icon={TrendingUp} accent="positive" />
        <StatCard label="Taux de recouvrement" value={`${stats.tauxRecouvrement}%`} icon={Users} accent="gold" />
        <StatCard label="Impayés / en retard" value={String(stats.nbImpaye + stats.nbEnRetard)} icon={AlertCircle} accent="negative" />
      </div>

      <SuiviTable paiements={lignes} montant={cotisation.montant} />
    </PageContainer>
  );
}
