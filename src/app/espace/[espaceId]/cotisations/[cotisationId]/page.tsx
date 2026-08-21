import { notFound } from "next/navigation";
import { PageContainer } from "@/components/app-shell/page-container";
import { CotisationDetail } from "@/components/cotisations/cotisation-detail";
import { COTISATIONS, getEspace } from "@/lib/data";

export function generateStaticParams() {
  return COTISATIONS.map((c) => ({ espaceId: c.espaceId, cotisationId: c.id }));
}

export default async function CotisationDetailPage(props: PageProps<"/espace/[espaceId]/cotisations/[cotisationId]">) {
  const { espaceId, cotisationId } = await props.params;
  const espace = getEspace(espaceId);
  if (!espace) notFound();

  return (
    <PageContainer>
      <CotisationDetail espace={espace} cotisationId={cotisationId} />
    </PageContainer>
  );
}
