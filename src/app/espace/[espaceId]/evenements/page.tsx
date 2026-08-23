import { notFound } from "next/navigation";
import { PageContainer } from "@/components/app-shell/page-container";
import { EvenementsListe } from "@/components/evenements/evenements-liste";
import { getEspace } from "@/lib/data";

export default async function EvenementsPage(props: PageProps<"/espace/[espaceId]/evenements">) {
  const { espaceId } = await props.params;
  const espace = getEspace(espaceId);
  if (!espace) notFound();

  return (
    <PageContainer>
      <EvenementsListe espace={espace} />
    </PageContainer>
  );
}
