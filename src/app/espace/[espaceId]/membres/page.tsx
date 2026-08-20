import Link from "next/link";
import { notFound } from "next/navigation";
import { Plus, Users } from "lucide-react";
import { PageContainer } from "@/components/app-shell/page-container";
import { PageHeader } from "@/components/app-shell/page-header";
import { EmptyState } from "@/components/app-shell/empty-state";
import { MembresTable } from "@/components/membres/table";
import { Button } from "@/components/ui/button";
import { getEspace, getMembres } from "@/lib/data";

export default async function MembresPage(props: PageProps<"/espace/[espaceId]/membres">) {
  const { espaceId } = await props.params;
  const espace = getEspace(espaceId);
  if (!espace) notFound();

  const membres = getMembres(espaceId);

  return (
    <PageContainer>
      <PageHeader
        eyebrow={espace.nom}
        title="Membres"
        subtitle={`${membres.length} membres enregistrés dans cet espace.`}
        action={
          <Button asChild>
            <Link href={`/espace/${espaceId}/membres/nouveau`}>
              <Plus className="h-4 w-4" />
              Ajouter un membre
            </Link>
          </Button>
        }
      />

      {membres.length === 0 ? (
        <EmptyState icon={Users} title="Aucun membre pour le moment" description="Ajoutez votre premier membre pour commencer." />
      ) : (
        <MembresTable espaceId={espaceId} membres={membres} />
      )}
    </PageContainer>
  );
}
