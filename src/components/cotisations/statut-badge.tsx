import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { StatutPaiement } from "@/lib/types";

const CONFIG: Record<StatutPaiement, { label: string; className: string }> = {
  paye: { label: "Payé", className: "bg-positive/15 text-positive border-positive/30" },
  partiel: { label: "Partiel", className: "bg-gold/15 text-gold-foreground border-gold/30" },
  impaye: { label: "Impayé", className: "bg-muted text-muted-foreground" },
  en_retard: { label: "En retard", className: "bg-destructive/15 text-destructive border-destructive/30" },
  exonere: { label: "Exonéré", className: "bg-secondary text-secondary-foreground" },
};

export function PaiementStatutBadge({ statut }: { statut: StatutPaiement }) {
  const c = CONFIG[statut];
  return (
    <Badge variant="outline" className={cn("border font-normal", c.className)}>
      {c.label}
    </Badge>
  );
}
