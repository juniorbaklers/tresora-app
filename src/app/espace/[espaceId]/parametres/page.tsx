import { notFound } from "next/navigation";
import { PageContainer } from "@/components/app-shell/page-container";
import { ParametresView } from "@/components/parametres/parametres-view";
import { getEspace } from "@/lib/data";

export default async function ParametresPage(props: PageProps<"/espace/[espaceId]/parametres">) {
  const { espaceId } = await props.params;
  const espace = getEspace(espaceId);
  if (!espace) notFound();

  return (
    <PageContainer className="max-w-2xl">
      <ParametresView espace={espace} />
    </PageContainer>
  );
}
