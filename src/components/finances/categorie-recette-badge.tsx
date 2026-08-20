import { Badge } from "@/components/ui/badge";
import { LABELS_CATEGORIE_RECETTE } from "@/lib/charts";
import type { CategorieRecette } from "@/lib/types";

export function CategorieRecetteBadge({ categorie }: { categorie: CategorieRecette }) {
  return (
    <Badge variant="secondary" className="font-normal">
      {LABELS_CATEGORIE_RECETTE[categorie]}
    </Badge>
  );
}
