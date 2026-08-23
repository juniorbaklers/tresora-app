import { notFound } from "next/navigation";
import { PageContainer } from "@/components/app-shell/page-container";
import { EvenementDetail } from "@/components/evenements/evenement-detail";
import { EVENEMENTS, getEspace } from "@/lib/data";

export function generateStaticParams() {
  return EVENEMENTS.map((e) => ({ espaceId: e.espaceId, evenementId: e.id }));
}

export default async function EvenementDetailPage(props: PageProps<"/espace/[espaceId]/evenements/[evenementId]">) {
  const { espaceId, evenementId } = await props.params;
  const espace = getEspace(espaceId);
  if (!espace) notFound();

  return (
    <PageContainer className="max-w-4xl">
      <EvenementDetail espace={espace} evenementId={evenementId} />
    </PageContainer>
  );
}
