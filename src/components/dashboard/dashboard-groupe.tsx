"use client";

import Link from "next/link";
import { TrendingUp, TrendingDown, Coins, AlertCircle, CalendarDays, ArrowLeftRight, CheckCircle2 } from "lucide-react";
import { StatCard, SoldeHero } from "@/components/dashboard/stat-card";
import { WidgetResume } from "@/components/dashboard/widget-resume";
import { RecettesDepensesChart } from "@/components/dashboard/charts";
import { OperationsRecentes } from "@/components/dashboard/operations-recentes";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { cotisationStats, getDerniersPaiements } from "@/lib/data";
import { useCotisations, useEvenements, useContributionsRequisesA, useSoldeActuel, useTotalRecettes, useTotalDepenses, useRecettes, useDepenses } from "@/lib/selecteurs";
import { serieHebdomadaireListe } from "@/lib/charts";
import { formatFCFA, pct } from "@/lib/format";
import { ContributionStatutBadge } from "@/components/contributions/statut-badge";
import type { Espace } from "@/lib/types";

export function DashboardGroupe({ espace }: { espace: Espace }) {
  const cotisationActive = useCotisations(espace.id).find((c) => c.statut === "active");
  const stats = cotisationActive ? cotisationStats(cotisationActive) : null;
  const evenements = useEvenements(espace.id);
  const evenementsActifs = evenements.filter((e) => e.statut === "actif");
  const contributionsRequises = useContributionsRequisesA(espace.id);
  const derniersPaiements = cotisationActive ? getDerniersPaiements(cotisationActive, 5) : [];
  const recettes = useRecettes(espace.id);
  const depenses = useDepenses(espace.id);
  const solde = useSoldeActuel(espace.id);
  const totalR = useTotalRecettes(espace.id);
  const totalD = useTotalDepenses(espace.id);

  return (
    <div className="space-y-8">
      <div className="grid gap-4 lg:grid-cols-[1.6fr_1fr]">
        <SoldeHero
          label="Solde actuel"
          montant={solde}
          sub={`${formatFCFA(totalR)} de recettes et ${formatFCFA(totalD)} de dépenses ce mois-ci.`}
        />
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-1">
          <StatCard label="Recettes" value={formatFCFA(totalR)} icon={TrendingUp} accent="positive" index={0} />
          <StatCard label="Dépenses" value={formatFCFA(totalD)} icon={TrendingDown} accent="negative" index={1} />
        </div>
      </div>

      <WidgetResume espaceId={espace.id} />

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-3 xl:grid-cols-5">
        <StatCard
          label="Cotisations collectées"
          value={stats ? formatFCFA(stats.totalCollecte) : "—"}
          sub={stats ? `sur ${formatFCFA(stats.totalAttendu)} attendus` : undefined}
          icon={Coins}
          accent="gold"
          index={2}
        />
        <StatCard
          label="Reste à collecter"
          value={stats ? formatFCFA(stats.totalAttendu - stats.totalCollecte) : "—"}
          icon={Coins}
          accent="negative"
          index={3}
        />
        <StatCard
          label="Membres en retard"
          value={stats ? String(stats.nbEnRetard) : "0"}
          sub="cotisation en cours"
          icon={AlertCircle}
          accent="negative"
          index={4}
        />
        <StatCard label="Événements actifs" value={String(evenementsActifs.length)} icon={CalendarDays} accent="neutral" index={5} />
        <StatCard
          label="Contributions demandées"
          value={String(contributionsRequises.length)}
          sub={`${contributionsRequises.filter((c) => c.statut === "paye").length} réglée(s)`}
          icon={ArrowLeftRight}
          accent="neutral"
          index={6}
        />
      </div>

      <div className="grid animate-in fade-in slide-in-from-bottom-2 gap-4 duration-700 fill-mode-both lg:grid-cols-3" style={{ animationDelay: "260ms" }}>
        <Card className="ledger-card lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-[15px] font-medium">Évolution financière — Août 2026</CardTitle>
          </CardHeader>
          <CardContent>
            <RecettesDepensesChart data={serieHebdomadaireListe(recettes, depenses)} />
          </CardContent>
        </Card>

        <Card className="ledger-card">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-[15px] font-medium">Cotisation en cours</CardTitle>
            <Button variant="ghost" size="sm" asChild>
              <Link href={`/espace/${espace.id}/cotisations`}>Voir tout</Link>
            </Button>
          </CardHeader>
          <CardContent>
            {cotisationActive && stats ? (
              <div>
                <p className="text-sm font-medium">{cotisationActive.nom}</p>
                <div className="mt-3 flex items-center gap-3">
                  <Progress value={stats.tauxRecouvrement} className="h-2 flex-1" />
                  <span className="font-tabular text-sm">{stats.tauxRecouvrement}%</span>
                </div>
                <p className="mt-2 text-xs text-muted-foreground">
                  {formatFCFA(stats.totalCollecte)} collectés sur {formatFCFA(stats.totalAttendu)}
                </p>
                <div className="mt-4 grid grid-cols-3 gap-2 text-center">
                  <div className="rounded-lg bg-secondary py-2">
                    <p className="font-tabular text-sm font-medium">{stats.nbPaye}</p>
                    <p className="text-[10px] text-muted-foreground">Payé</p>
                  </div>
                  <div className="rounded-lg bg-secondary py-2">
                    <p className="font-tabular text-sm font-medium">{stats.nbPartiel}</p>
                    <p className="text-[10px] text-muted-foreground">Partiel</p>
                  </div>
                  <div className="rounded-lg bg-secondary py-2">
                    <p className="font-tabular text-sm font-medium">{stats.nbImpaye + stats.nbEnRetard}</p>
                    <p className="text-[10px] text-muted-foreground">Impayé</p>
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">Aucune cotisation active pour le moment.</p>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid animate-in fade-in slide-in-from-bottom-2 gap-4 duration-700 fill-mode-both lg:grid-cols-3" style={{ animationDelay: "320ms" }}>
        <Card className="ledger-card">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-[15px] font-medium">Événements</CardTitle>
            <Button variant="ghost" size="sm" asChild>
              <Link href={`/espace/${espace.id}/evenements`}>Voir tout</Link>
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            {evenements.map((e) => (
              <Link key={e.id} href={`/espace/${espace.id}/evenements/${e.id}`} className="block">
                <p className="text-[13.5px] font-medium">{e.nom}</p>
                {e.montantCible && (
                  <>
                    <div className="mt-2 flex items-center gap-2">
                      <Progress value={pct(e.montantCollecte, e.montantCible)} className="h-1.5 flex-1" />
                      <span className="font-tabular text-xs text-muted-foreground">{pct(e.montantCollecte, e.montantCible)}%</span>
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {formatFCFA(e.montantCollecte)} / {formatFCFA(e.montantCible)}
                    </p>
                  </>
                )}
              </Link>
            ))}
          </CardContent>
        </Card>

        <Card className="ledger-card">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-[15px] font-medium">Contributions demandées par l&apos;église</CardTitle>
            <Button variant="ghost" size="sm" asChild>
              <Link href={`/espace/${espace.id}/contributions`}>Voir tout</Link>
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            {contributionsRequises.map((c) => (
              <div key={c.id}>
                <div className="flex items-center justify-between">
                  <p className="text-[13.5px] font-medium">{c.projet}</p>
                  <ContributionStatutBadge statut={c.statut} />
                </div>
                <div className="mt-2 flex items-center gap-2">
                  <Progress value={pct(c.montantRecu, c.montantDemande)} className="h-1.5 flex-1" />
                  <span className="font-tabular text-xs text-muted-foreground">
                    {formatFCFA(c.montantRecu)} / {formatFCFA(c.montantDemande)}
                  </span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="ledger-card">
          <CardHeader>
            <CardTitle className="text-[15px] font-medium">Derniers paiements</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {derniersPaiements.map((p) => (
                <li key={p.membreId} className="flex items-center gap-2.5">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-secondary text-[10px] font-medium">
                    {p.membre?.initiales}
                  </span>
                  <span className="min-w-0 flex-1 truncate text-[13px]">
                    {p.membre?.prenom} {p.membre?.nom}
                  </span>
                  <span className="flex items-center gap-1 shrink-0 font-tabular text-xs text-positive">
                    <CheckCircle2 className="h-3 w-3" />
                    {formatFCFA(p.montantPaye)}
                  </span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>

      <Card className="ledger-card animate-in fade-in slide-in-from-bottom-2 duration-700 fill-mode-both" style={{ animationDelay: "380ms" }}>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-[15px] font-medium">Activité récente</CardTitle>
          <Badge variant="secondary" className="font-normal">
            {espace.membresCount} membres
          </Badge>
        </CardHeader>
        <CardContent>
          <OperationsRecentes espaceId={espace.id} />
        </CardContent>
      </Card>
    </div>
  );
}
