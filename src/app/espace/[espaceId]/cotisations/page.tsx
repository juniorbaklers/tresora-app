import { notFound } from "next/navigation";
import { PageContainer } from "@/components/app-shell/page-container";
import { CotisationsListe } from "@/components/cotisations/cotisations-liste";
import { getEspace } from "@/lib/data";

export default async function CotisationsPage(props: PageProps<"/espace/[espaceId]/cotisations">) {
  const { espaceId } = await props.params;
  const espace = getEspace(espaceId);
  if (!espace) notFound();

  return (
    <PageContainer>
      <CotisationsListe espace={espace} />
    </PageContainer>
  );
}
