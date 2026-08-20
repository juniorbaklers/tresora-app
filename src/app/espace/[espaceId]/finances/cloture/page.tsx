import { notFound } from "next/navigation";
import { PageContainer } from "@/components/app-shell/page-container";
import { PageHeader } from "@/components/app-shell/page-header";
import { FinancesTabs } from "@/components/finances/finances-tabs";
import { ClotureForm } from "@/components/finances/cloture-form";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { getClotures, getEspace, UTILISATEUR } from "@/lib/data";
import { formatDate, formatFCFA } from "@/lib/format";

export default async function CloturePage(props: PageProps<"/espace/[espaceId]/finances/cloture">) {
  const { espaceId } = await props.params;
  const espace = getEspace(espaceId);
  if (!espace) notFound();

  const clotures = getClotures(espaceId);

  return (
    <PageContainer>
      <PageHeader
        eyebrow={espace.nom}
        title="Clôture du dimanche"
        subtitle="Comptez et validez les recettes du culte pour clôturer la journée."
      />
      <FinancesTabs espaceId={espaceId} showCloture />

      <div className="grid gap-8 lg:grid-cols-[420px_1fr]">
        <ClotureForm responsable={UTILISATEUR.nom} />

        <div>
          <h3 className="mb-3 text-sm font-medium">Historique des clôtures</h3>
          {clotures.length === 0 ? (
            <p className="text-sm text-muted-foreground">Aucune clôture enregistrée pour le moment.</p>
          ) : (
            <div className="overflow-x-auto rounded-xl border border-border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Culte</TableHead>
                    <TableHead className="text-right">Total compté</TableHead>
                    <TableHead className="text-right">Écart</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {clotures.map((c) => {
                    const attendu = c.offrandeOrdinaire + c.offrandeSpeciale + c.dimes + c.autresRecettes;
                    const ecart = c.totalCompte - attendu;
                    return (
                      <TableRow key={c.id}>
                        <TableCell className="whitespace-nowrap text-muted-foreground">{formatDate(c.date)}</TableCell>
                        <TableCell>{c.culte}</TableCell>
                        <TableCell className="text-right font-tabular">{formatFCFA(c.totalCompte)}</TableCell>
                        <TableCell className={`text-right font-tabular ${ecart === 0 ? "text-positive" : "text-destructive"}`}>
                          {formatFCFA(ecart)}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </div>
      </div>
    </PageContainer>
  );
}
