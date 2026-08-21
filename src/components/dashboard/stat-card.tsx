import type { LucideIcon } from "lucide-react";
import { BandeTissee, TrameLosange } from "@/components/brand/motif";
import { MontantAnime } from "@/components/dashboard/montant-anime";
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
 * uni : chaque famille de chiffre a sa tonalité. `index` échelonne son entrée
 * dans une grille (voir dashboards) sans que chaque appelant gère un délai.
 */
export function StatCard({
  label,
  value,
  icon: Icon,
  sub,
  accent = "neutral",
  index = 0,
}: {
  label: string;
  value: string;
  icon: LucideIcon;
  sub?: string;
  accent?: Accent;
  index?: number;
}) {
  return (
    <div
      className="carte-vive group animate-in fade-in slide-in-from-bottom-2 rounded-xl border border-border bg-card p-5 shadow-[0_1px_2px_rgba(27,35,56,0.04),0_10px_28px_-16px_rgba(27,35,56,0.16)] duration-500 fill-mode-both"
      style={{ animationDelay: `${Math.min(index, 8) * 60}ms` }}
    >
      <BandeTissee tonalite={TONALITE[accent]} className="mb-4 w-10" />
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="text-xs text-muted-foreground">{label}</p>
          <p className="mt-1.5 font-stat text-[24px] font-bold leading-none">{value}</p>
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
 * Carte héroïque du solde — le moment signature du tableau de bord. Le
 * chiffre défile jusqu'à sa valeur (voir MontantAnime) plutôt que de
 * s'afficher d'un bloc ; c'est la seule animation « spectaculaire » de
 * l'app, tout le reste autour d'elle reste sobre.
 */
export function SoldeHero({
  label,
  montant,
  sub,
  children,
}: {
  label: string;
  montant: number;
  sub?: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="relative animate-in fade-in slide-in-from-bottom-3 overflow-hidden rounded-2xl bg-[var(--indigo-deep)] p-6 duration-700 sm:p-8">
      <TrameLosange opacite={0.08} taille={52} />
      <div className="relative">
        <div className="flex items-center gap-3">
          <BandeTissee tonalite="mixte" className="w-14" epaisseur={4} />
          <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-[#C9BFA9]">{label}</p>
        </div>
        <MontantAnime
          montant={montant}
          className={cn("mt-4 block font-heading text-[clamp(2.4rem,7vw,4rem)] leading-[0.95] text-[#F6F1E7]", "tabular-nums")}
        />
        {sub && <p className="mt-3 text-sm text-[#9B937F]">{sub}</p>}
        {children && <div className="mt-6">{children}</div>}
      </div>
    </div>
  );
}
