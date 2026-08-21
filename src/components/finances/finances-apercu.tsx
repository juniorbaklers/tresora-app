"use client";

import { Wallet, TrendingUp, TrendingDown, Scale } from "lucide-react";
import { PageHeader } from "@/components/app-shell/page-header";
import { FinancesTabs } from "@/components/finances/finances-tabs";
import { StatCard } from "@/components/dashboard/stat-card";
import { SoldeChart } from "@/components/dashboard/charts";
import { OperationsRecentes } from "@/components/dashboard/operations-recentes";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useRecettes, useDepenses, useSoldeActuel, useTotalRecettes, useTotalDepenses } from "@/lib/selecteurs";
import { evolutionSoldeListe } from "@/lib/charts";
import { formatFCFA } from "@/lib/format";
import type { Espace } from "@/lib/types";

export function FinancesApercu({ espace }: { espace: Espace }) {
  const recettes = useRecettes(espace.id);
  const depenses = useDepenses(espace.id);
  const solde = useSoldeActuel(espace.id);
  const totalR = useTotalRecettes(espace.id);
  const totalD = useTotalDepenses(espace.id);
  const showCloture = espace.modules.includes("dimes") || espace.modules.includes("offrandes");

  return (
    <>
      <PageHeader eyebrow={espace.nom} title="Trésorerie" subtitle="Solde, recettes et dépenses de cet espace, en temps réel." />
      <FinancesTabs espaceId={espace.id} showCloture={showCloture} />

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="Solde initial" value={formatFCFA(espace.soldeInitial)} icon={Scale} />
        <StatCard label="Total recettes" value={formatFCFA(totalR)} icon={TrendingUp} accent="positive" />
        <StatCard label="Total dépenses" value={formatFCFA(totalD)} icon={TrendingDown} accent="negative" />
        <StatCard label="Solde actuel" value={formatFCFA(solde)} icon={Wallet} accent="gold" />
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-3">
        <Card className="ledger-card lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-[15px] font-medium">Évolution du solde — Août 2026</CardTitle>
          </CardHeader>
          <CardContent>
            <SoldeChart data={evolutionSoldeListe(espace.soldeInitial, recettes, depenses)} />
          </CardContent>
        </Card>
        <Card className="ledger-card">
          <CardHeader>
            <CardTitle className="text-[15px] font-medium">Historique récent</CardTitle>
          </CardHeader>
          <CardContent>
            <OperationsRecentes espaceId={espace.id} />
          </CardContent>
        </Card>
      </div>
    </>
  );
}
