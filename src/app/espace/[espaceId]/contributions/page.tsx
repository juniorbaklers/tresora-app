import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeftRight, Plus } from "lucide-react";
import { PageContainer } from "@/components/app-shell/page-container";
import { PageHeader } from "@/components/app-shell/page-header";
import { EmptyState } from "@/components/app-shell/empty-state";
import { TableContributionsDemandees } from "@/components/contributions/table-demandees";
import { CartesContributionsRecues } from "@/components/contributions/cartes-recues";
import { Button } from "@/components/ui/button";
import { getContributionsDemandeesPar, getContributionsRequisesA, getEspace } from "@/lib/data";
import { formatFCFA } from "@/lib/format";

export default async function ContributionsPage(props: PageProps<"/espace/[espaceId]/contributions">) {
  const { espaceId } = await props.params;
  const espace = getEspace(espaceId);
  if (!espace) notFound();

  const demandees = getContributionsDemandeesPar(espaceId);
  const recues = getContributionsRequisesA(espaceId);
  const totalDemande = demandees.reduce((s, c) => s + c.montantDemande, 0);
  const totalRecu = demandees.reduce((s, c) => s + c.montantRecu, 0);

  return (
    <PageContainer>
      <PageHeader
        eyebrow={espace.nom}
        title="Contributions inter-espaces"
        subtitle="Le seul canal financier entre deux espaces. Vous ne voyez jamais comment l'autre espace a réuni les fonds."
        action={
          demandees.length > 0 || espace.type === "eglise" ? (
            <Button asChild>
              <Link href={`/espace/${espaceId}/contributions/nouvelle`}>
                <Plus className="h-4 w-4" />
                Nouvelle demande
              </Link>
            </Button>
          ) : undefined
        }
      />

      {demandees.length === 0 && recues.length === 0 && (
        <EmptyState
          icon={ArrowLeftRight}
          title="Aucune contribution pour le moment"
          description="Les contributions permettent de demander des fonds à un autre espace, sans jamais voir ses finances internes."
          action={
            <Button asChild>
              <Link href={`/espace/${espaceId}/contributions/nouvelle`}>Créer une demande</Link>
            </Button>
          }
        />
      )}

      {demandees.length > 0 && (
        <section className="mb-10">
          <div className="mb-4 flex items-baseline justify-between">
            <h2 className="font-heading text-[20px]">Contributions demandées par vous</h2>
            <p className="font-tabular text-sm text-muted-foreground">
              {formatFCFA(totalRecu)} reçus sur {formatFCFA(totalDemande)}
            </p>
          </div>
          <TableContributionsDemandees espaceId={espaceId} contributions={demandees} />
        </section>
      )}

      {recues.length > 0 && (
        <section>
          <h2 className="mb-4 font-heading text-[20px]">Contributions demandées à vous</h2>
          <CartesContributionsRecues espaceId={espaceId} contributions={recues} />
        </section>
      )}
    </PageContainer>
  );
}
