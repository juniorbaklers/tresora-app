import { notFound } from "next/navigation";
import { PageContainer } from "@/components/app-shell/page-container";
import { MembreDetail } from "@/components/membres/membre-detail";
import { MEMBRES, getEspace } from "@/lib/data";

export function generateStaticParams() {
  return Object.values(MEMBRES)
    .flat()
    .map((m) => ({ espaceId: m.espaceId, membreId: m.id }));
}

export default async function MembreDetailPage(props: PageProps<"/espace/[espaceId]/membres/[membreId]">) {
  const { espaceId, membreId } = await props.params;
  const espace = getEspace(espaceId);
  if (!espace) notFound();

  return (
    <PageContainer className="max-w-3xl">
      <MembreDetail espaceId={espaceId} membreId={membreId} />
    </PageContainer>
  );
}
