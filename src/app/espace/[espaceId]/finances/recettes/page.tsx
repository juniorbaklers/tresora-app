import Link from "next/link";
import { notFound } from "next/navigation";
import { Plus, TrendingUp } from "lucide-react";
import { PageContainer } from "@/components/app-shell/page-container";
import { PageHeader } from "@/components/app-shell/page-header";
import { FinancesTabs } from "@/components/finances/finances-tabs";
import { EmptyState } from "@/components/app-shell/empty-state";
import { CategorieRecetteBadge } from "@/components/finances/categorie-recette-badge";
import { Button } from "@/components/ui/button";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { getEspace, getRecettes, totalRecettes } from "@/lib/data";
import { formatDate, formatFCFA } from "@/lib/format";

export default async function RecettesPage(props: PageProps<"/espace/[espaceId]/finances/recettes">) {
  const { espaceId } = await props.params;
  const espace = getEspace(espaceId);
  if (!espace) notFound();

  const recettes = [...getRecettes(espaceId)].sort((a, b) => b.date.localeCompare(a.date));

  return (
    <PageContainer>
      <PageHeader
        eyebrow={espace.nom}
        title="Recettes"
        subtitle={`${formatFCFA(totalRecettes(espaceId))} de recettes enregistrées.`}
        action={
          <Button asChild>
            <Link href={`/espace/${espaceId}/finances/recettes/nouvelle`}>
              <Plus className="h-4 w-4" />
              Nouvelle recette
            </Link>
          </Button>
        }
      />
      <FinancesTabs espaceId={espaceId} />

      {recettes.length === 0 ? (
        <EmptyState icon={TrendingUp} title="Aucune recette pour le moment" description="Enregistrez votre première recette pour commencer." />
      ) : (
        <div className="overflow-x-auto rounded-xl border border-border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Libellé</TableHead>
                <TableHead>Catégorie</TableHead>
                <TableHead>Responsable</TableHead>
                <TableHead className="text-right">Montant</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recettes.map((r) => (
                <TableRow key={r.id}>
                  <TableCell className="whitespace-nowrap text-muted-foreground">{formatDate(r.date)}</TableCell>
                  <TableCell className="font-medium">{r.libelle}</TableCell>
                  <TableCell>
                    <CategorieRecetteBadge categorie={r.categorie} />
                  </TableCell>
                  <TableCell className="text-muted-foreground">{r.responsable}</TableCell>
                  <TableCell className="text-right font-tabular text-positive">+{formatFCFA(r.montant)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </PageContainer>
  );
}
