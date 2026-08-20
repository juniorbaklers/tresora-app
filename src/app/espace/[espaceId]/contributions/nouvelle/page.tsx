import { notFound } from "next/navigation";
import { PageContainer } from "@/components/app-shell/page-container";
import { PageHeader } from "@/components/app-shell/page-header";
import { NouvelleContributionForm } from "@/components/contributions/nouvelle-form";
import { ESPACES, getEspace } from "@/lib/data";

export default async function NouvelleContributionPage(props: PageProps<"/espace/[espaceId]/contributions/nouvelle">) {
  const { espaceId } = await props.params;
  const espace = getEspace(espaceId);
  if (!espace) notFound();

  const cibles = ESPACES.filter((e) => e.id !== espaceId);

  return (
    <PageContainer>
      <PageHeader eyebrow={espace.nom} title="Nouvelle demande de contribution" subtitle="Sollicitez un autre espace pour financer un projet commun." />
      <NouvelleContributionForm espaceId={espaceId} cibles={cibles} />
    </PageContainer>
  );
}
