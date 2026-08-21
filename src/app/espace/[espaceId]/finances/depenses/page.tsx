import { notFound } from "next/navigation";
import { PageContainer } from "@/components/app-shell/page-container";
import { DepensesListe } from "@/components/finances/depenses-liste";
import { getEspace } from "@/lib/data";

export default async function DepensesPage(props: PageProps<"/espace/[espaceId]/finances/depenses">) {
  const { espaceId } = await props.params;
  const espace = getEspace(espaceId);
  if (!espace) notFound();

  return (
    <PageContainer>
      <DepensesListe espace={espace} />
    </PageContainer>
  );
}
