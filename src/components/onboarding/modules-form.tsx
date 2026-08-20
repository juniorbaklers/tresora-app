"use client";

import { useState } from "react";
import Link from "next/link";
import { Users, Wallet, CalendarDays, TrendingUp, TrendingDown, FileBarChart, Coins, HandCoins, ArrowLeftRight } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { ModuleKey } from "@/lib/types";

const MODULES: { key: ModuleKey; label: string; description: string; icon: typeof Users; eglise?: boolean }[] = [
  { key: "membres", label: "Membres", description: "Fiches, coordonnées, statut", icon: Users },
  { key: "cotisations", label: "Cotisations", description: "Collectes internes récurrentes", icon: Coins },
  { key: "evenements", label: "Événements", description: "Objectifs financiers, participants", icon: CalendarDays },
  { key: "recettes", label: "Recettes", description: "Toutes les entrées d'argent", icon: TrendingUp },
  { key: "depenses", label: "Dépenses", description: "Sorties, justificatifs", icon: TrendingDown },
  { key: "rapports", label: "Rapports", description: "Exports PDF, Excel, Word", icon: FileBarChart },
  { key: "dimes", label: "Dîmes", description: "Suivi des dîmes par culte", icon: Wallet, eglise: true },
  { key: "offrandes", label: "Offrandes", description: "Ordinaires, spéciales, cultes du soir", icon: HandCoins, eglise: true },
  { key: "contributions", label: "Contributions inter-espaces", description: "Demandes de fonds entre espaces", icon: ArrowLeftRight },
];

export function ModulesForm({ type, espaceId }: { type: string; espaceId: string }) {
  const [selected, setSelected] = useState<Set<ModuleKey>>(
    new Set(
      MODULES.filter((m) => !m.eglise || type === "eglise").map((m) => m.key)
    )
  );

  function toggle(key: ModuleKey) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  }

  return (
    <div>
      <div className="grid gap-3 sm:grid-cols-2">
        {MODULES.map((m) => {
          const active = selected.has(m.key);
          return (
            <div
              role="button"
              tabIndex={0}
              key={m.key}
              onClick={() => toggle(m.key)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  toggle(m.key);
                }
              }}
              className={cn(
                "flex cursor-pointer items-start gap-3 rounded-xl border p-4 text-left transition-colors",
                active ? "border-gold bg-gold/[0.06]" : "border-border bg-card hover:border-foreground/20"
              )}
            >
              <span className={cn("flex h-9 w-9 shrink-0 items-center justify-center rounded-lg", active ? "bg-gold text-gold-foreground" : "bg-secondary text-muted-foreground")}>
                <m.icon className="h-4 w-4" strokeWidth={1.75} />
              </span>
              <span className="flex-1">
                <span className="flex items-center justify-between">
                  <span className="text-sm font-medium">{m.label}</span>
                  <Checkbox checked={active} onCheckedChange={() => toggle(m.key)} onClick={(e) => e.stopPropagation()} />
                </span>
                <span className="mt-0.5 block text-xs text-muted-foreground">{m.description}</span>
              </span>
            </div>
          );
        })}
      </div>
      <div className="mt-8 flex items-center gap-3">
        <Button asChild size="lg">
          <Link href={`/espace/${espaceId}/dashboard?bienvenue=1`}>Créer mon espace</Link>
        </Button>
        <p className="text-xs text-muted-foreground">
          {selected.size} module{selected.size > 1 ? "s" : ""} activé{selected.size > 1 ? "s" : ""} — modifiable à tout moment dans les paramètres.
        </p>
      </div>
    </div>
  );
}
