import { notFound } from "next/navigation";
import { PageContainer } from "@/components/app-shell/page-container";
import { FinancesApercu } from "@/components/finances/finances-apercu";
import { getEspace } from "@/lib/data";

export default async function FinancesPage(props: PageProps<"/espace/[espaceId]/finances">) {
  const { espaceId } = await props.params;
  const espace = getEspace(espaceId);
  if (!espace) notFound();

  return (
    <PageContainer>
      <FinancesApercu espace={espace} />
    </PageContainer>
  );
}
