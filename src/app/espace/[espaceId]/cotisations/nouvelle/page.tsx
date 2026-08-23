import { notFound } from "next/navigation";
import { PageContainer } from "@/components/app-shell/page-container";
import { PageHeader } from "@/components/app-shell/page-header";
import { NouvelleCotisationForm } from "@/components/cotisations/nouvelle-form";
import { getEspace, UTILISATEUR } from "@/lib/data";

export default async function NouvelleCotisationPage(props: PageProps<"/espace/[espaceId]/cotisations/nouvelle">) {
  const { espaceId } = await props.params;
  const espace = getEspace(espaceId);
  if (!espace) notFound();

  return (
    <PageContainer>
      <PageHeader eyebrow={espace.nom} title="Nouvelle cotisation" subtitle="Définissez le montant, la périodicité et les membres concernés." />
      <NouvelleCotisationForm espaceId={espaceId} responsable={UTILISATEUR.nom} />
    </PageContainer>
  );
}
