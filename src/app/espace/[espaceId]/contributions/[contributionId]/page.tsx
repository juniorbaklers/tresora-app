import { notFound } from "next/navigation";
import { PageContainer } from "@/components/app-shell/page-container";
import { PageHeader } from "@/components/app-shell/page-header";
import { VersementPanel } from "@/components/contributions/versement-panel";
import { CONTRIBUTIONS, getEspace } from "@/lib/data";
import { formatDate } from "@/lib/format";

export function generateStaticParams() {
  return CONTRIBUTIONS.flatMap((c) => [
    { espaceId: c.espaceDemandeurId, contributionId: c.id },
    { espaceId: c.espaceCibleId, contributionId: c.id },
  ]);
}

export default async function ContributionDetailPage(props: PageProps<"/espace/[espaceId]/contributions/[contributionId]">) {
  const { espaceId, contributionId } = await props.params;
  const espace = getEspace(espaceId);
  const contribution = CONTRIBUTIONS.find((c) => c.id === contributionId);
  if (!espace || !contribution) notFound();
  if (contribution.espaceDemandeurId !== espaceId && contribution.espaceCibleId !== espaceId) notFound();

  const autreEspace = getEspace(
    contribution.espaceDemandeurId === espaceId ? contribution.espaceCibleId : contribution.espaceDemandeurId
  );
  const peutVerser = contribution.espaceCibleId === espaceId;

  return (
    <PageContainer className="max-w-3xl">
      <PageHeader
        eyebrow={contribution.espaceDemandeurId === espaceId ? `Demandé à ${autreEspace?.nom}` : `Demandé par ${autreEspace?.nom}`}
        title={contribution.projet}
        subtitle={contribution.description}
      />
      <p className="mb-6 text-sm text-muted-foreground">Échéance : {formatDate(contribution.dateLimite)}</p>
      <VersementPanel contribution={contribution} peutVerser={peutVerser} />
    </PageContainer>
  );
}
