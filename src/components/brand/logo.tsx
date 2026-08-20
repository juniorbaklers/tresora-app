import { cn } from "@/lib/utils";

/**
 * Marque Trésora. Le sigle est un losange tissé — le motif de base d'une bande
 * de coton — plutôt qu'une lettre dans un carré arrondi.
 */
export function Logo({ className, tone = "dark" }: { className?: string; tone?: "dark" | "light" }) {
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <span
        className={cn(
          "flex h-8 w-8 shrink-0 items-center justify-center rounded-[7px]",
          tone === "dark" ? "bg-gold" : "bg-primary"
        )}
      >
        <svg width="17" height="17" viewBox="0 0 20 20" aria-hidden>
          <path
            d="M10 1 L19 10 L10 19 L1 10 Z"
            fill="none"
            stroke={tone === "dark" ? "var(--gold-foreground)" : "var(--primary-foreground)"}
            strokeWidth="1.6"
          />
          <path d="M10 5.5 L14.5 10 L10 14.5 L5.5 10 Z" fill={tone === "dark" ? "var(--gold-foreground)" : "var(--primary-foreground)"} />
        </svg>
      </span>
      <span className="font-heading text-[23px] leading-none tracking-tight">Trésora</span>
    </span>
  );
}
