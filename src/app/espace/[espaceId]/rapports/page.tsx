import { notFound } from "next/navigation";
import { PageContainer } from "@/components/app-shell/page-container";
import { PageHeader } from "@/components/app-shell/page-header";
import { ExportButtons } from "@/components/rapports/export-buttons";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getEspace, totalDepenses, totalRecettes } from "@/lib/data";
import { repartitionRecettes, depensesParCategorie } from "@/lib/charts";
import { formatFCFA } from "@/lib/format";

export default async function RapportsPage(props: PageProps<"/espace/[espaceId]/rapports">) {
  const { espaceId } = await props.params;
  const espace = getEspace(espaceId);
  if (!espace) notFound();

  const recettes = repartitionRecettes(espaceId);
  const depenses = depensesParCategorie(espaceId);
  const totalR = totalRecettes(espaceId);
  const totalD = totalDepenses(espaceId);
  const soldeNet = totalR - totalD;
  const periode = "Août 2026";

  return (
    <PageContainer className="max-w-3xl">
      <PageHeader
        eyebrow={espace.nom}
        title={`Rapport financier — ${periode}`}
        subtitle="Généré automatiquement à partir des opérations enregistrées."
        action={
          <ExportButtons
            espaceNom={espace.nom}
            periode={periode}
            recettes={recettes.map((r) => ({ label: r.label, montant: r.montant }))}
            depenses={depenses.map((d) => ({ label: d.categorie, montant: d.montant }))}
            totalRecettes={totalR}
            totalDepenses={totalD}
          />
        }
      />

      <Card className="ledger-card mb-4">
        <CardHeader>
          <CardTitle className="text-[15px] font-medium">Recettes</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="divide-y divide-ledger-line">
            {recettes.map((r) => (
              <li key={r.categorie} className="flex items-center justify-between py-2.5 text-sm">
                <span className="text-muted-foreground">{r.label}</span>
                <span className="font-tabular">{formatFCFA(r.montant)}</span>
              </li>
            ))}
          </ul>
          <div className="mt-2 flex items-center justify-between border-t border-ledger-line pt-3 font-medium">
            <span>Total recettes</span>
            <span className="font-tabular text-positive">{formatFCFA(totalR)}</span>
          </div>
        </CardContent>
      </Card>

      <Card className="ledger-card mb-4">
        <CardHeader>
          <CardTitle className="text-[15px] font-medium">Dépenses</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="divide-y divide-ledger-line">
            {depenses.map((d) => (
              <li key={d.categorie} className="flex items-center justify-between py-2.5 text-sm">
                <span className="text-muted-foreground">{d.categorie}</span>
                <span className="font-tabular">{formatFCFA(d.montant)}</span>
              </li>
            ))}
          </ul>
          <div className="mt-2 flex items-center justify-between border-t border-ledger-line pt-3 font-medium">
            <span>Total dépenses</span>
            <span className="font-tabular text-destructive">{formatFCFA(totalD)}</span>
          </div>
        </CardContent>
      </Card>

      <Card className="ledger-card">
        <CardContent className="flex items-center justify-between py-5">
          <span className="font-heading text-[19px]">Solde net</span>
          <span className="font-tabular text-[22px] font-medium text-gold">{formatFCFA(soldeNet)}</span>
        </CardContent>
      </Card>
    </PageContainer>
  );
}
