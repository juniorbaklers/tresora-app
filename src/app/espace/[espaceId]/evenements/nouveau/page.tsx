import { notFound } from "next/navigation";
import { PageContainer } from "@/components/app-shell/page-container";
import { PageHeader } from "@/components/app-shell/page-header";
import { NouvelEvenementForm } from "@/components/evenements/nouveau-form";
import { getEspace } from "@/lib/data";

export default async function NouvelEvenementPage(props: PageProps<"/espace/[espaceId]/evenements/nouveau">) {
  const { espaceId } = await props.params;
  const espace = getEspace(espaceId);
  if (!espace) notFound();

  return (
    <PageContainer>
      <PageHeader eyebrow={espace.nom} title="Créer un événement" subtitle="Définissez un objectif financier et suivez sa progression." />
      <NouvelEvenementForm espaceId={espaceId} />
    </PageContainer>
  );
}
