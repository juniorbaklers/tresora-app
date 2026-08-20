import { notFound } from "next/navigation";
import { PageContainer } from "@/components/app-shell/page-container";
import { PageHeader } from "@/components/app-shell/page-header";
import { NouvelleDepenseForm } from "@/components/finances/nouvelle-depense-form";
import { getEspace, UTILISATEUR } from "@/lib/data";

export default async function NouvelleDepensePage(props: PageProps<"/espace/[espaceId]/finances/depenses/nouvelle">) {
  const { espaceId } = await props.params;
  const espace = getEspace(espaceId);
  if (!espace) notFound();

  return (
    <PageContainer>
      <PageHeader eyebrow={espace.nom} title="Nouvelle dépense" subtitle="Enregistrez une sortie d'argent pour cet espace." />
      <NouvelleDepenseForm espaceId={espaceId} responsable={UTILISATEUR.nom} />
    </PageContainer>
  );
}
