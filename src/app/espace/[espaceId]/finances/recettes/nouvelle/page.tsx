import { notFound } from "next/navigation";
import { PageContainer } from "@/components/app-shell/page-container";
import { PageHeader } from "@/components/app-shell/page-header";
import { NouvelleRecetteForm } from "@/components/finances/nouvelle-recette-form";
import { getEspace, UTILISATEUR } from "@/lib/data";
import type { CategorieRecette } from "@/lib/types";

export default async function NouvelleRecettePage(props: PageProps<"/espace/[espaceId]/finances/recettes/nouvelle">) {
  const { espaceId } = await props.params;
  const espace = getEspace(espaceId);
  if (!espace) notFound();

  const categories: CategorieRecette[] = espace.modules.includes("dimes") || espace.modules.includes("offrandes")
    ? ["dime", "offrande_ordinaire", "offrande_speciale", "offrande_culte_soir", "don", "autre"]
    : ["cotisation", "don", "activite", "autre"];

  return (
    <PageContainer>
      <PageHeader eyebrow={espace.nom} title="Nouvelle recette" subtitle="Enregistrez une entrée d'argent pour cet espace." />
      <NouvelleRecetteForm espaceId={espaceId} categories={categories} responsable={UTILISATEUR.nom} />
    </PageContainer>
  );
}
