import { notFound } from "next/navigation";
import { PageContainer } from "@/components/app-shell/page-container";
import { MembresView } from "@/components/membres/membres-view";
import { getEspace } from "@/lib/data";

export default async function MembresPage(props: PageProps<"/espace/[espaceId]/membres">) {
  const { espaceId } = await props.params;
  const espace = getEspace(espaceId);
  if (!espace) notFound();

  return (
    <PageContainer>
      <MembresView espace={espace} />
    </PageContainer>
  );
}
