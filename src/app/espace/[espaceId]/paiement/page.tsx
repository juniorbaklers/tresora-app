import { notFound } from "next/navigation";
import { PageContainer } from "@/components/app-shell/page-container";
import { PaiementView } from "@/components/paiement/paiement-view";
import { getEspace } from "@/lib/data";

export default async function PaiementPage(props: PageProps<"/espace/[espaceId]/paiement">) {
  const { espaceId } = await props.params;
  const espace = getEspace(espaceId);
  if (!espace) notFound();

  return (
    <PageContainer>
      <PaiementView espace={espace} />
    </PageContainer>
  );
}
