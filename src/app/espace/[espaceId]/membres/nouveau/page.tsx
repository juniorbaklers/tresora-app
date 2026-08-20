import { notFound } from "next/navigation";
import { PageContainer } from "@/components/app-shell/page-container";
import { PageHeader } from "@/components/app-shell/page-header";
import { NouveauMembreForm } from "@/components/membres/nouveau-form";
import { getEspace } from "@/lib/data";

export default async function NouveauMembrePage(props: PageProps<"/espace/[espaceId]/membres/nouveau">) {
  const { espaceId } = await props.params;
  const espace = getEspace(espaceId);
  if (!espace) notFound();

  return (
    <PageContainer>
      <PageHeader eyebrow={espace.nom} title="Ajouter un membre" subtitle="Renseignez les informations du nouveau membre." />
      <NouveauMembreForm espaceId={espaceId} />
    </PageContainer>
  );
}
