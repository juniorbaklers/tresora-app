import type { LucideIcon } from "lucide-react";
import { BandeTissee, TrameLosange } from "@/components/brand/motif";
import { cn } from "@/lib/utils";

type Accent = "neutral" | "positive" | "negative" | "gold";

const TONALITE = {
  neutral: "indigo",
  positive: "palme",
  negative: "terre",
  gold: "or",
} as const;

/**
 * Carte de statistique secondaire. Une bande tissée en tête remplace le filet
 * uni : chaque famille de chiffre a sa tonalité.
 */
export function StatCard({
  label,
  value,
  icon: Icon,
  sub,
  accent = "neutral",
}: {
  label: string;
  value: string;
  icon: LucideIcon;
  sub?: string;
  accent?: Accent;
}) {
  return (
    <div className="group rounded-xl border border-border bg-card p-5 transition-colors hover:border-gold/50">
      <BandeTissee tonalite={TONALITE[accent]} className="mb-4 w-10" />
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="text-xs text-muted-foreground">{label}</p>
          <p className="mt-1.5 font-tabular text-[21px] font-medium leading-none">{value}</p>
          {sub && <p className="mt-2 text-xs text-muted-foreground">{sub}</p>}
        </div>
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-secondary text-muted-foreground transition-colors group-hover:bg-gold/15 group-hover:text-gold-foreground">
          <Icon className="h-4 w-4" strokeWidth={1.75} />
        </span>
      </div>
    </div>
  );
}

/**
 * Carte héroïque du solde. C'est le chiffre qui compte : il est traité en
 * Fraunces, à une échelle sans rapport avec le reste, sur fond indigo tramé.
 */
export function SoldeHero({
  label,
  value,
  sub,
  children,
}: {
  label: string;
  value: string;
  sub?: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-[var(--indigo-deep)] p-6 sm:p-8">
      <TrameLosange opacite={0.08} taille={52} />
      <div className="relative">
        <div className="flex items-center gap-3">
          <BandeTissee tonalite="mixte" className="w-14" epaisseur={4} />
          <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-[#C9BFA9]">{label}</p>
        </div>
        <p
          className={cn(
            "mt-4 font-heading text-[clamp(2.4rem,7vw,4rem)] leading-[0.95] text-[#F6F1E7]",
            "tabular-nums"
          )}
        >
          {value}
        </p>
        {sub && <p className="mt-3 text-sm text-[#9B937F]">{sub}</p>}
        {children && <div className="mt-6">{children}</div>}
      </div>
    </div>
  );
}
