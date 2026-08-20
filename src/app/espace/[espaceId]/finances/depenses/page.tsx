import Link from "next/link";
import { notFound } from "next/navigation";
import { Plus, TrendingDown, Paperclip } from "lucide-react";
import { PageContainer } from "@/components/app-shell/page-container";
import { PageHeader } from "@/components/app-shell/page-header";
import { FinancesTabs } from "@/components/finances/finances-tabs";
import { EmptyState } from "@/components/app-shell/empty-state";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { getEspace, getDepenses, totalDepenses } from "@/lib/data";
import { formatDate, formatFCFA } from "@/lib/format";

export default async function DepensesPage(props: PageProps<"/espace/[espaceId]/finances/depenses">) {
  const { espaceId } = await props.params;
  const espace = getEspace(espaceId);
  if (!espace) notFound();

  const depenses = [...getDepenses(espaceId)].sort((a, b) => b.date.localeCompare(a.date));

  return (
    <PageContainer>
      <PageHeader
        eyebrow={espace.nom}
        title="Dépenses"
        subtitle={`${formatFCFA(totalDepenses(espaceId))} de dépenses enregistrées.`}
        action={
          <Button asChild>
            <Link href={`/espace/${espaceId}/finances/depenses/nouvelle`}>
              <Plus className="h-4 w-4" />
              Nouvelle dépense
            </Link>
          </Button>
        }
      />
      <FinancesTabs espaceId={espaceId} showCloture={espace.modules.includes("dimes") || espace.modules.includes("offrandes")} />

      {depenses.length === 0 ? (
        <EmptyState icon={TrendingDown} title="Aucune dépense pour le moment" description="Enregistrez votre première dépense pour commencer." />
      ) : (
        <div className="overflow-x-auto rounded-xl border border-border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Catégorie</TableHead>
                <TableHead>Bénéficiaire</TableHead>
                <TableHead>Justificatif</TableHead>
                <TableHead className="text-right">Montant</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {depenses.map((d) => (
                <TableRow key={d.id}>
                  <TableCell className="whitespace-nowrap text-muted-foreground">{formatDate(d.date)}</TableCell>
                  <TableCell className="font-medium">{d.description}</TableCell>
                  <TableCell>
                    <Badge variant="secondary" className="font-normal">
                      {d.categorie}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{d.beneficiaire}</TableCell>
                  <TableCell>
                    {d.justificatif ? (
                      <span className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Paperclip className="h-3.5 w-3.5" /> Joint
                      </span>
                    ) : (
                      <span className="text-xs text-muted-foreground">—</span>
                    )}
                  </TableCell>
                  <TableCell className="text-right font-tabular text-destructive">-{formatFCFA(d.montant)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </PageContainer>
  );
}
