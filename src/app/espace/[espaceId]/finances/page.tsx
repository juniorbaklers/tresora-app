import { notFound } from "next/navigation";
import { Wallet, TrendingUp, TrendingDown, Scale } from "lucide-react";
import { PageContainer } from "@/components/app-shell/page-container";
import { PageHeader } from "@/components/app-shell/page-header";
import { FinancesTabs } from "@/components/finances/finances-tabs";
import { StatCard } from "@/components/dashboard/stat-card";
import { SoldeChart } from "@/components/dashboard/charts";
import { OperationsRecentes } from "@/components/dashboard/operations-recentes";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getEspace, soldeActuel, totalDepenses, totalRecettes } from "@/lib/data";
import { evolutionSolde } from "@/lib/charts";
import { formatFCFA } from "@/lib/format";

export default async function FinancesPage(props: PageProps<"/espace/[espaceId]/finances">) {
  const { espaceId } = await props.params;
  const espace = getEspace(espaceId);
  if (!espace) notFound();

  const solde = soldeActuel(espaceId);
  const recettes = totalRecettes(espaceId);
  const depenses = totalDepenses(espaceId);

  return (
    <PageContainer>
      <PageHeader eyebrow={espace.nom} title="Trésorerie" subtitle="Solde, recettes et dépenses de cet espace, en temps réel." />
      <FinancesTabs espaceId={espaceId} showCloture={espace.modules.includes("dimes") || espace.modules.includes("offrandes")} />

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="Solde initial" value={formatFCFA(espace.soldeInitial)} icon={Scale} />
        <StatCard label="Total recettes" value={formatFCFA(recettes)} icon={TrendingUp} accent="positive" />
        <StatCard label="Total dépenses" value={formatFCFA(depenses)} icon={TrendingDown} accent="negative" />
        <StatCard label="Solde actuel" value={formatFCFA(solde)} icon={Wallet} accent="gold" />
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-3">
        <Card className="ledger-card lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-[15px] font-medium">Évolution du solde — Août 2026</CardTitle>
          </CardHeader>
          <CardContent>
            <SoldeChart data={evolutionSolde(espaceId)} />
          </CardContent>
        </Card>
        <Card className="ledger-card">
          <CardHeader>
            <CardTitle className="text-[15px] font-medium">Historique récent</CardTitle>
          </CardHeader>
          <CardContent>
            <OperationsRecentes espaceId={espaceId} />
          </CardContent>
        </Card>
      </div>
    </PageContainer>
  );
}
