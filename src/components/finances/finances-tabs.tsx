"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export function FinancesTabs({ espaceId, showCloture = false }: { espaceId: string; showCloture?: boolean }) {
  const pathname = usePathname();
  const tabs = [
    { href: `/espace/${espaceId}/finances`, label: "Vue d'ensemble" },
    { href: `/espace/${espaceId}/finances/recettes`, label: "Recettes" },
    { href: `/espace/${espaceId}/finances/depenses`, label: "Dépenses" },
    ...(showCloture ? [{ href: `/espace/${espaceId}/finances/cloture`, label: "Clôture du dimanche" }] : []),
  ];

  return (
    <div className="mb-6 flex gap-1 border-b border-border">
      {tabs.map((tab) => {
        const active = pathname === tab.href;
        return (
          <Link
            key={tab.href}
            href={tab.href}
            className={cn(
              "border-b-2 px-3 pb-3 text-[13.5px] transition-colors",
              active ? "border-primary font-medium text-foreground" : "border-transparent text-muted-foreground hover:text-foreground"
            )}
          >
            {tab.label}
          </Link>
        );
      })}
    </div>
  );
}
