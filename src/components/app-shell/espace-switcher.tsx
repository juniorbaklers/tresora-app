"use client";

import Link from "next/link";
import { ChevronsUpDown, Check, Plus, LayoutGrid } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ESPACES, MES_ESPACES_IDS } from "@/lib/data";
import { cn } from "@/lib/utils";
import type { Espace } from "@/lib/types";

const ROLE_LABELS: Record<string, string> = {
  proprietaire: "Propriétaire",
  administrateur: "Administrateur",
  tresorier: "Trésorier",
  responsable: "Responsable",
  membre: "Membre",
};

export function EspaceSwitcher({ espace, tone = "dark" }: { espace: Espace; tone?: "dark" | "light" }) {
  const mesEspaces = ESPACES.filter((e) => MES_ESPACES_IDS.includes(e.id));

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className={
          tone === "dark"
            ? "flex w-full items-center gap-2.5 rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2.5 text-left transition-colors hover:bg-white/[0.06]"
            : "flex w-full items-center gap-2.5 rounded-lg px-1.5 py-1.5 text-left transition-colors"
        }
      >
        <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-xs font-semibold text-white ${espace.couleur}`}>
          {espace.initiales}
        </span>
        <span className="min-w-0 flex-1">
          <span className={cn("block truncate text-[13px] font-medium", tone === "dark" ? "text-[#F6F1E7]" : "text-foreground")}>
            {espace.nom}
          </span>
          <span className={cn("block truncate text-[11px]", tone === "dark" ? "text-[#9B937F]" : "text-muted-foreground")}>
            {ROLE_LABELS[espace.role]}
          </span>
        </span>
        <ChevronsUpDown className={cn("h-3.5 w-3.5 shrink-0", tone === "dark" ? "text-[#9B937F]" : "text-muted-foreground")} />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-64">
        <DropdownMenuLabel>Vos espaces</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {mesEspaces.map((e) => (
          <DropdownMenuItem key={e.id} asChild>
            <Link href={`/espace/${e.id}/dashboard`} className="flex items-center gap-2.5">
              <span className={`flex h-6 w-6 shrink-0 items-center justify-center rounded text-[10px] font-semibold text-white ${e.couleur}`}>
                {e.initiales}
              </span>
              <span className="min-w-0 flex-1 truncate">{e.nom}</span>
              {e.id === espace.id && <Check className="h-4 w-4 text-gold" />}
            </Link>
          </DropdownMenuItem>
        ))}
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/espaces" className="flex items-center gap-2.5">
            <LayoutGrid className="h-4 w-4" />
            Voir tous mes espaces
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/onboarding/type" className="flex items-center gap-2.5">
            <Plus className="h-4 w-4" />
            Créer un nouvel espace
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
