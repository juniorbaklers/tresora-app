import { notFound } from "next/navigation";
import { PageContainer } from "@/components/app-shell/page-container";
import { PageHeader } from "@/components/app-shell/page-header";
import { DashboardEglise } from "@/components/dashboard/dashboard-eglise";
import { DashboardGroupe } from "@/components/dashboard/dashboard-groupe";
import { getEspace, UTILISATEUR } from "@/lib/data";

export default async function DashboardPage(props: PageProps<"/espace/[espaceId]/dashboard">) {
  const { espaceId } = await props.params;
  const espace = getEspace(espaceId);
  if (!espace) notFound();

  return (
    <PageContainer>
      <PageHeader
        eyebrow={`Espace actuel : ${espace.nom}`}
        title={`Bonjour, ${UTILISATEUR.nom.split(" ")[0]} 👋`}
        subtitle="Voici la synthèse financière de cet espace."
      />
      {espace.type === "eglise" ? <DashboardEglise espace={espace} /> : <DashboardGroupe espace={espace} />}
    </PageContainer>
  );
}
