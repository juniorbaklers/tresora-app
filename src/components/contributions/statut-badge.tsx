import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { StatutContribution } from "@/lib/types";

const CONFIG: Record<StatutContribution, { label: string; className: string }> = {
  en_attente: { label: "En attente", className: "bg-muted text-muted-foreground" },
  partiel: { label: "Partiel", className: "bg-gold/15 text-gold-foreground border-gold/30" },
  paye: { label: "Payé", className: "bg-positive/15 text-positive border-positive/30" },
};

export function ContributionStatutBadge({ statut }: { statut: StatutContribution }) {
  const c = CONFIG[statut];
  return (
    <Badge variant="outline" className={cn("border font-normal", c.className)}>
      {c.label}
    </Badge>
  );
}
