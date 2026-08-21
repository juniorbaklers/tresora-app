import { cn } from "@/lib/utils";

/**
 * Le sigle seul : un losange tissé — le motif de base d'une bande de coton —
 * plutôt qu'une lettre dans un carré arrondi. Réutilisé en grand format pour
 * les écrans de bienvenue, en petit format dans `Logo`.
 */
export function LogoMark({ className, tone = "dark", size = 32 }: { className?: string; tone?: "dark" | "light"; size?: number }) {
  return (
    <span
      className={cn("flex shrink-0 items-center justify-center rounded-[22%]", tone === "dark" ? "bg-gold" : "bg-primary", className)}
      style={{ height: size, width: size }}
    >
      <svg width={size * 0.53} height={size * 0.53} viewBox="0 0 20 20" aria-hidden>
        <path
          d="M10 1 L19 10 L10 19 L1 10 Z"
          fill="none"
          stroke={tone === "dark" ? "var(--gold-foreground)" : "var(--primary-foreground)"}
          strokeWidth="1.6"
        />
        <path d="M10 5.5 L14.5 10 L10 14.5 L5.5 10 Z" fill={tone === "dark" ? "var(--gold-foreground)" : "var(--primary-foreground)"} />
      </svg>
    </span>
  );
}

/**
 * Marque Trésora. Le sigle est un losange tissé — le motif de base d'une bande
 * de coton — plutôt qu'une lettre dans un carré arrondi.
 */
export function Logo({ className, tone = "dark" }: { className?: string; tone?: "dark" | "light" }) {
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <LogoMark tone={tone} size={32} />
      <span className="font-heading text-[23px] leading-none tracking-tight">Trésora</span>
    </span>
  );
}
