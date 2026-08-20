import { Wallet, TrendingUp, TrendingDown, Landmark, HandCoins, ArrowLeftRight } from "lucide-react";
import { StatCard } from "@/components/dashboard/stat-card";
import { RecettesDepensesChart, SoldeChart, RepartitionChart } from "@/components/dashboard/charts";
import { OperationsRecentes } from "@/components/dashboard/operations-recentes";
import { ContributionsAttendues } from "@/components/dashboard/contributions-attendues";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  getContributionsDemandeesPar,
  getRecettes,
  soldeActuel,
  totalDepenses,
  totalRecettes,
} from "@/lib/data";
import { depensesParCategorie, evolutionSolde, repartitionRecettes, serieHebdomadaire } from "@/lib/charts";
import { formatFCFA } from "@/lib/format";
import type { Espace } from "@/lib/types";

export function DashboardEglise({ espace }: { espace: Espace }) {
  const recettes = getRecettes(espace.id);
  const dimes = recettes.filter((r) => r.categorie === "dime").reduce((s, r) => s + r.montant, 0);
  const offrandes = recettes
    .filter((r) => r.categorie === "offrande_ordinaire" || r.categorie === "offrande_speciale" || r.categorie === "offrande_culte_soir")
    .reduce((s, r) => s + r.montant, 0);
  const contributionsRecues = getContributionsDemandeesPar(espace.id).reduce((s, c) => s + c.montantRecu, 0);
  const contributions = getContributionsDemandeesPar(espace.id);

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-3 xl:grid-cols-6">
        <StatCard label="Solde actuel" value={formatFCFA(soldeActuel(espace.id))} icon={Wallet} accent="neutral" />
        <StatCard label="Recettes du mois" value={formatFCFA(totalRecettes(espace.id))} icon={TrendingUp} accent="positive" />
        <StatCard label="Dépenses du mois" value={formatFCFA(totalDepenses(espace.id))} icon={TrendingDown} accent="negative" />
        <StatCard label="Dîmes" value={formatFCFA(dimes)} icon={Landmark} accent="gold" />
        <StatCard label="Offrandes" value={formatFCFA(offrandes)} icon={HandCoins} accent="gold" />
        <StatCard label="Contributions reçues" value={formatFCFA(contributionsRecues)} icon={ArrowLeftRight} accent="positive" />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="ledger-card lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-[15px] font-medium">Recettes et dépenses — Août 2026</CardTitle>
          </CardHeader>
          <CardContent>
            <RecettesDepensesChart data={serieHebdomadaire(espace.id)} />
          </CardContent>
        </Card>
        <Card className="ledger-card">
          <CardHeader>
            <CardTitle className="text-[15px] font-medium">Évolution du solde</CardTitle>
          </CardHeader>
          <CardContent>
            <SoldeChart data={evolutionSolde(espace.id)} />
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="ledger-card">
          <CardHeader>
            <CardTitle className="text-[15px] font-medium">Répartition des recettes</CardTitle>
          </CardHeader>
          <CardContent>
            <RepartitionChart data={repartitionRecettes(espace.id)} />
          </CardContent>
        </Card>
        <Card className="ledger-card">
          <CardHeader>
            <CardTitle className="text-[15px] font-medium">Dépenses par catégorie</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {depensesParCategorie(espace.id).map((d) => (
                <li key={d.categorie}>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">{d.categorie}</span>
                    <span className="font-tabular">{formatFCFA(d.montant)}</span>
                  </div>
                  <div className="mt-1.5 h-1.5 w-full rounded-full bg-muted">
                    <div
                      className="h-1.5 rounded-full"
                      style={{ width: `${(d.montant / depensesParCategorie(espace.id)[0].montant) * 100}%`, backgroundColor: d.couleur }}
                    />
                  </div>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="ledger-card">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-[15px] font-medium">Contributions attendues</CardTitle>
            <Button variant="ghost" size="sm" asChild>
              <Link href={`/espace/${espace.id}/contributions`}>Voir tout</Link>
            </Button>
          </CardHeader>
          <CardContent>
            <ContributionsAttendues contributions={contributions} />
          </CardContent>
        </Card>
        <Card className="ledger-card">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-[15px] font-medium">Activité récente</CardTitle>
            <Button variant="ghost" size="sm" asChild>
              <Link href={`/espace/${espace.id}/finances`}>Voir tout</Link>
            </Button>
          </CardHeader>
          <CardContent>
            <OperationsRecentes espaceId={espace.id} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
