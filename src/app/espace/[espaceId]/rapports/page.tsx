import { notFound } from "next/navigation";
import { PageContainer } from "@/components/app-shell/page-container";
import { RapportView } from "@/components/rapports/rapport-view";
import { getDepenses, getEspace, getRecettes } from "@/lib/data";

export default async function RapportsPage(props: PageProps<"/espace/[espaceId]/rapports">) {
  const { espaceId } = await props.params;
  const espace = getEspace(espaceId);
  if (!espace) notFound();

  return (
    <PageContainer className="max-w-3xl">
      <RapportView espace={espace} recettes={getRecettes(espaceId)} depenses={getDepenses(espaceId)} />
    </PageContainer>
  );
}
