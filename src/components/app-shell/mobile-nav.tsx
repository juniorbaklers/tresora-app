"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Plus, MoreHorizontal, TrendingUp, TrendingDown, Coins, CalendarPlus, X } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { navForEspace } from "@/lib/nav";
import { cn } from "@/lib/utils";
import type { Espace } from "@/lib/types";

export function MobileNav({ espace }: { espace: Espace }) {
  const pathname = usePathname();
  const items = navForEspace(espace);
  const primary = items.slice(0, 4);
  const rest = items.slice(4);
  const [plusOpen, setPlusOpen] = useState(false);
  const [fabOpen, setFabOpen] = useState(false);

  const quickActions = [
    { label: "Ajouter une recette", icon: TrendingUp, href: `/espace/${espace.id}/finances/recettes/nouvelle` },
    { label: "Ajouter une dépense", icon: TrendingDown, href: `/espace/${espace.id}/finances/depenses/nouvelle` },
    ...(espace.modules.includes("cotisations")
      ? [{ label: "Nouvelle cotisation", icon: Coins, href: `/espace/${espace.id}/cotisations/nouvelle` }]
      : []),
    ...(espace.modules.includes("evenements")
      ? [{ label: "Créer un événement", icon: CalendarPlus, href: `/espace/${espace.id}/evenements/nouveau` }]
      : []),
  ];

  return (
    <>
      <button
        onClick={() => setFabOpen(true)}
        className="fixed bottom-20 right-4 z-40 flex h-13 w-13 items-center justify-center rounded-full bg-gold text-gold-foreground shadow-[0_10px_24px_-6px_rgba(200,154,75,0.6)] lg:hidden"
        style={{ height: 52, width: 52 }}
        aria-label="Actions rapides"
      >
        <Plus className="h-6 w-6" />
      </button>

      <nav className="fixed inset-x-0 bottom-0 z-30 grid grid-cols-5 border-t border-border bg-card/95 backdrop-blur lg:hidden">
        {primary.map((item) => {
          const href = item.href(espace.id);
          const active = item.matchPrefix ? pathname.includes(`/${item.matchPrefix}`) : pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex flex-col items-center gap-1 py-2.5 text-[10.5px]",
                active ? "text-primary" : "text-muted-foreground"
              )}
            >
              <item.icon className="h-[19px] w-[19px]" strokeWidth={1.75} />
              {item.label}
            </Link>
          );
        })}
        <button
          onClick={() => setPlusOpen(true)}
          className="flex flex-col items-center gap-1 py-2.5 text-[10.5px] text-muted-foreground"
        >
          <MoreHorizontal className="h-[19px] w-[19px]" strokeWidth={1.75} />
          Plus
        </button>
      </nav>

      <Sheet open={plusOpen} onOpenChange={setPlusOpen}>
        <SheetContent side="bottom" className="rounded-t-2xl">
          <SheetHeader>
            <SheetTitle>Plus d&apos;options</SheetTitle>
          </SheetHeader>
          <div className="grid grid-cols-3 gap-3 px-4 pb-6">
            {rest.map((item) => (
              <Link
                key={item.label}
                href={item.href(espace.id)}
                onClick={() => setPlusOpen(false)}
                className="flex flex-col items-center gap-2 rounded-xl border border-border p-4 text-center text-xs"
              >
                <item.icon className="h-5 w-5" strokeWidth={1.75} />
                {item.label}
              </Link>
            ))}
          </div>
        </SheetContent>
      </Sheet>

      <Sheet open={fabOpen} onOpenChange={setFabOpen}>
        <SheetContent side="bottom" className="rounded-t-2xl">
          <SheetHeader>
            <SheetTitle className="flex items-center justify-between">
              Action rapide
              <button onClick={() => setFabOpen(false)} aria-label="Fermer">
                <X className="h-4 w-4" />
              </button>
            </SheetTitle>
          </SheetHeader>
          <div className="space-y-1 px-4 pb-6">
            {quickActions.map((a) => (
              <Link
                key={a.label}
                href={a.href}
                onClick={() => setFabOpen(false)}
                className="flex items-center gap-3 rounded-lg px-3 py-3 text-sm hover:bg-secondary"
              >
                <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-secondary">
                  <a.icon className="h-4 w-4" strokeWidth={1.75} />
                </span>
                {a.label}
              </Link>
            ))}
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}
