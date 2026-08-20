import type { ReactNode } from "react";
import { Logo } from "@/components/brand/logo";
import { cn } from "@/lib/utils";

const ETAPES = [
  { id: 1, label: "Type d'espace" },
  { id: 2, label: "Nom de l'espace" },
  { id: 3, label: "Modules" },
];

export function OnboardingShell({
  etape,
  title,
  subtitle,
  children,
}: {
  etape: 1 | 2 | 3;
  title: string;
  subtitle: string;
  children: ReactNode;
}) {
  return (
    <div className="min-h-svh bg-background">
      <header className="border-b border-border">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-6 py-5">
          <Logo />
          <ol className="hidden items-center gap-3 sm:flex">
            {ETAPES.map((e, i) => (
              <li key={e.id} className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <span
                    className={cn(
                      "flex h-6 w-6 items-center justify-center rounded-full text-[11px] font-medium",
                      e.id === etape
                        ? "bg-primary text-primary-foreground"
                        : e.id < etape
                          ? "bg-positive text-positive-foreground"
                          : "bg-muted text-muted-foreground"
                    )}
                  >
                    {e.id}
                  </span>
                  <span className={cn("text-xs", e.id === etape ? "text-foreground font-medium" : "text-muted-foreground")}>
                    {e.label}
                  </span>
                </div>
                {i < ETAPES.length - 1 && <div className="h-px w-8 bg-border" />}
              </li>
            ))}
          </ol>
        </div>
      </header>
      <main className="mx-auto max-w-3xl px-6 py-14">
        <p className="text-xs font-medium uppercase tracking-[0.14em] text-gold">
          Étape {etape} sur 3
        </p>
        <h1 className="mt-2 font-heading text-[34px] leading-tight">{title}</h1>
        <p className="mt-2 max-w-xl text-[15px] text-muted-foreground">{subtitle}</p>
        <div className="mt-10">{children}</div>
      </main>
    </div>
  );
}
