"use client";

import { TrendingUp, TrendingDown, Landmark, HandCoins, ArrowLeftRight } from "lucide-react";
import { StatCard, SoldeHero } from "@/components/dashboard/stat-card";
import { WidgetResume } from "@/components/dashboard/widget-resume";
import { RecettesDepensesChart, SoldeChart, RepartitionChart } from "@/components/dashboard/charts";
import { OperationsRecentes } from "@/components/dashboard/operations-recentes";
import { ContributionsAttendues } from "@/components/dashboard/contributions-attendues";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  useContributionsDemandeesPar,
  useRecettes,
  useDepenses,
  useSoldeActuel,
  useTotalRecettes,
  useTotalDepenses,
} from "@/lib/selecteurs";
import { depensesParCategorieListe, evolutionSoldeListe, repartitionRecettesListe, serieHebdomadaireListe } from "@/lib/charts";
import { formatFCFA } from "@/lib/format";
import type { Espace } from "@/lib/types";

export function DashboardEglise({ espace }: { espace: Espace }) {
  const recettes = useRecettes(espace.id);
  const depenses = useDepenses(espace.id);
  const dimes = recettes.filter((r) => r.categorie === "dime").reduce((s, r) => s + r.montant, 0);
  const offrandes = recettes
    .filter((r) => r.categorie === "offrande_ordinaire" || r.categorie === "offrande_speciale" || r.categorie === "offrande_culte_soir")
    .reduce((s, r) => s + r.montant, 0);
  const contributions = useContributionsDemandeesPar(espace.id);
  const contributionsRecues = contributions.reduce((s, c) => s + c.montantRecu, 0);
  const solde = useSoldeActuel(espace.id);
  const totalR = useTotalRecettes(espace.id);
  const totalD = useTotalDepenses(espace.id);
  const depensesCategorisees = depensesParCategorieListe(depenses);

  return (
    <div className="space-y-8">
      {/* 70/30 : le solde domine, le reste se range en colonne à côté. */}
      <div className="grid gap-4 lg:grid-cols-[1.6fr_1fr]">
        <SoldeHero
          label="Solde actuel"
          montant={solde}
          sub={`${formatFCFA(totalR)} de recettes et ${formatFCFA(totalD)} de dépenses ce mois-ci.`}
        />
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-1">
          <StatCard label="Recettes du mois" value={formatFCFA(totalR)} icon={TrendingUp} accent="positive" index={0} />
          <StatCard label="Dépenses du mois" value={formatFCFA(totalD)} icon={TrendingDown} accent="negative" index={1} />
        </div>
      </div>

      <WidgetResume espaceId={espace.id} />

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
        <StatCard label="Dîmes" value={formatFCFA(dimes)} icon={Landmark} accent="gold" index={2} />
        <StatCard label="Offrandes" value={formatFCFA(offrandes)} icon={HandCoins} accent="gold" index={3} />
        <StatCard label="Contributions reçues" value={formatFCFA(contributionsRecues)} icon={ArrowLeftRight} accent="positive" index={4} />
      </div>

      <div className="grid animate-in fade-in slide-in-from-bottom-2 gap-4 duration-700 fill-mode-both lg:grid-cols-3" style={{ animationDelay: "220ms" }}>
        <Card className="ledger-card lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-[15px] font-medium">Recettes et dépenses — Août 2026</CardTitle>
          </CardHeader>
          <CardContent>
            <RecettesDepensesChart data={serieHebdomadaireListe(recettes, depenses)} />
          </CardContent>
        </Card>
        <Card className="ledger-card">
          <CardHeader>
            <CardTitle className="text-[15px] font-medium">Évolution du solde</CardTitle>
          </CardHeader>
          <CardContent>
            <SoldeChart data={evolutionSoldeListe(espace.soldeInitial, recettes, depenses)} />
          </CardContent>
        </Card>
      </div>

      <div className="grid animate-in fade-in slide-in-from-bottom-2 gap-4 duration-700 fill-mode-both lg:grid-cols-2" style={{ animationDelay: "280ms" }}>
        <Card className="ledger-card">
          <CardHeader>
            <CardTitle className="text-[15px] font-medium">Répartition des recettes</CardTitle>
          </CardHeader>
          <CardContent>
            <RepartitionChart data={repartitionRecettesListe(recettes)} />
          </CardContent>
        </Card>
        <Card className="ledger-card">
          <CardHeader>
            <CardTitle className="text-[15px] font-medium">Dépenses par catégorie</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {depensesCategorisees.map((d) => (
                <li key={d.categorie}>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">{d.categorie}</span>
                    <span className="font-tabular">{formatFCFA(d.montant)}</span>
                  </div>
                  <div className="mt-1.5 h-1.5 w-full rounded-full bg-muted">
                    <div
                      className="h-1.5 rounded-full"
                      style={{ width: `${(d.montant / depensesCategorisees[0]!.montant) * 100}%`, backgroundColor: d.couleur }}
                    />
                  </div>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>

      <div className="grid animate-in fade-in slide-in-from-bottom-2 gap-4 duration-700 fill-mode-both lg:grid-cols-2" style={{ animationDelay: "340ms" }}>
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
