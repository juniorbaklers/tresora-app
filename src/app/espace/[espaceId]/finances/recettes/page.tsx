import { notFound } from "next/navigation";
import { PageContainer } from "@/components/app-shell/page-container";
import { RecettesListe } from "@/components/finances/recettes-liste";
import { getEspace } from "@/lib/data";

export default async function RecettesPage(props: PageProps<"/espace/[espaceId]/finances/recettes">) {
  const { espaceId } = await props.params;
  const espace = getEspace(espaceId);
  if (!espace) notFound();

  return (
    <PageContainer>
      <RecettesListe espace={espace} />
    </PageContainer>
  );
}
