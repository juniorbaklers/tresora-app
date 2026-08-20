import { notFound } from "next/navigation";
import { Users, Target, TrendingDown, CalendarRange } from "lucide-react";
import { PageContainer } from "@/components/app-shell/page-container";
import { PageHeader } from "@/components/app-shell/page-header";
import { StatCard } from "@/components/dashboard/stat-card";
import { Progress } from "@/components/ui/progress";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { getDepensesEvenement, getEspace, getEvenement } from "@/lib/data";
import { formatDate, formatFCFA, pct } from "@/lib/format";

export default async function EvenementDetailPage(props: PageProps<"/espace/[espaceId]/evenements/[evenementId]">) {
  const { espaceId, evenementId } = await props.params;
  const espace = getEspace(espaceId);
  const evenement = getEvenement(evenementId);
  if (!espace || !evenement || evenement.espaceId !== espaceId) notFound();

  const depenses = getDepensesEvenement(evenementId);
  const totalDepenses = depenses.reduce((s, d) => s + d.montant, 0);

  return (
    <PageContainer className="max-w-4xl">
      <PageHeader eyebrow={espace.nom} title={evenement.nom} subtitle={evenement.description} />

      <p className="mb-6 flex items-center gap-1.5 text-sm text-muted-foreground">
        <CalendarRange className="h-4 w-4" />
        Du {formatDate(evenement.dateDebut)} au {formatDate(evenement.dateFin)}
      </p>

      {evenement.montantCible && (
        <div className="mb-8 rounded-xl border border-border bg-card p-6">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">Progression financière</p>
            <span className="font-tabular text-sm text-muted-foreground">
              {formatFCFA(evenement.montantCollecte)} / {formatFCFA(evenement.montantCible)}
            </span>
          </div>
          <div className="mt-3 flex items-center gap-3">
            <Progress value={pct(evenement.montantCollecte, evenement.montantCible)} className="h-3 flex-1" />
            <span className="font-tabular text-lg font-medium">{pct(evenement.montantCollecte, evenement.montantCible)}%</span>
          </div>
        </div>
      )}

      <div className="mb-8 grid grid-cols-2 gap-4 lg:grid-cols-3">
        <StatCard label="Objectif" value={evenement.montantCible ? formatFCFA(evenement.montantCible) : "—"} icon={Target} accent="gold" />
        <StatCard label="Participants" value={String(evenement.participants)} icon={Users} />
        <StatCard label="Dépenses liées" value={formatFCFA(totalDepenses)} icon={TrendingDown} accent="negative" />
      </div>

      {depenses.length > 0 && (
        <div>
          <h3 className="mb-3 text-sm font-medium">Dépenses de l&apos;événement</h3>
          <div className="overflow-x-auto rounded-xl border border-border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Bénéficiaire</TableHead>
                  <TableHead className="text-right">Montant</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {depenses.map((d) => (
                  <TableRow key={d.id}>
                    <TableCell className="whitespace-nowrap text-muted-foreground">{formatDate(d.date)}</TableCell>
                    <TableCell className="font-medium">{d.description}</TableCell>
                    <TableCell className="text-muted-foreground">{d.beneficiaire}</TableCell>
                    <TableCell className="text-right font-tabular text-destructive">-{formatFCFA(d.montant)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      )}
    </PageContainer>
  );
}
