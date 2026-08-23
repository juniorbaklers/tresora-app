"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  MoreHorizontal,
  TrendingUp,
  TrendingDown,
  Coins,
  CalendarPlus,
  ArrowLeftRight,
  Users,
  FileBarChart,
  ScrollText,
  ShieldCheck,
  Settings,
  UserCircle,
  LogOut,
  ChevronRight,
} from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { navForEspace } from "@/lib/nav";
import { cn } from "@/lib/utils";
import { useUtilisateur } from "@/lib/selecteurs";
import { initialesDeNom } from "@/lib/format";
import { TrameLosange } from "@/components/brand/motif";
import type { Espace } from "@/lib/types";

interface LigneMenu {
  label: string;
  description?: string;
  icon: typeof TrendingUp;
  href: string;
  teinte: "positive" | "destructive" | "gold" | "palme" | "terre" | "neutre";
}

const TEINTES: Record<LigneMenu["teinte"], string> = {
  positive: "bg-positive/15 text-positive",
  destructive: "bg-destructive/15 text-destructive",
  gold: "bg-gold/15 text-gold",
  palme: "bg-palme/15 text-palme",
  terre: "bg-terre/15 text-terre",
  neutre: "bg-secondary text-muted-foreground",
};

export function MobileNav({ espace }: { espace: Espace }) {
  const pathname = usePathname();
  const items = navForEspace(espace);
  const primary = items.slice(0, 4);
  const rest = items.slice(4);
  const utilisateur = useUtilisateur();
  const [menuOpen, setMenuOpen] = useState(false);

  const operations: LigneMenu[] = [
    { label: "Ajouter une recette", icon: TrendingUp, href: `/espace/${espace.id}/finances/recettes/nouvelle`, teinte: "positive" },
    { label: "Ajouter une dépense", icon: TrendingDown, href: `/espace/${espace.id}/finances/depenses/nouvelle`, teinte: "destructive" },
    ...(espace.modules.includes("cotisations")
      ? [{ label: "Nouvelle cotisation", icon: Coins, href: `/espace/${espace.id}/cotisations/nouvelle`, teinte: "gold" as const }]
      : []),
    ...(espace.modules.includes("evenements")
      ? [{ label: "Créer un événement", icon: CalendarPlus, href: `/espace/${espace.id}/evenements/nouveau`, teinte: "palme" as const }]
      : []),
  ];

  const ICONES_SERVICE: Record<string, typeof TrendingUp> = {
    Contributions: ArrowLeftRight,
    Membres: Users,
    Rapports: FileBarChart,
    Paramètres: Settings,
  };
  const TEINTES_SERVICE: Record<string, LigneMenu["teinte"]> = {
    Contributions: "terre",
    Membres: "neutre",
    Rapports: "gold",
    Paramètres: "neutre",
  };

  const services: LigneMenu[] = [
    ...rest.map((item) => ({
      label: item.label,
      icon: ICONES_SERVICE[item.label] ?? item.icon,
      href: item.href(espace.id),
      teinte: TEINTES_SERVICE[item.label] ?? "neutre",
    })),
    { label: "Journal d'activité", icon: ScrollText, href: `/espace/${espace.id}/journal`, teinte: "neutre" },
    { label: "Rôles et permissions", icon: ShieldCheck, href: `/espace/${espace.id}/roles`, teinte: "neutre" },
  ];

  return (
    <>
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
          onClick={() => setMenuOpen(true)}
          className="flex flex-col items-center gap-1 py-2.5 text-[10.5px] text-muted-foreground"
        >
          <MoreHorizontal className="h-[19px] w-[19px]" strokeWidth={1.75} />
          Plus
        </button>
      </nav>

      <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
        <SheetContent side="bottom" className="max-h-[85svh] overflow-y-auto rounded-t-2xl p-0">
          <SheetHeader className="sr-only">
            <SheetTitle>Menu</SheetTitle>
          </SheetHeader>

          <Link
            href="/compte"
            onClick={() => setMenuOpen(false)}
            className="relative flex items-center gap-3 overflow-hidden bg-[var(--indigo-deep)] px-5 pb-6 pt-7"
          >
            <TrameLosange opacite={0.08} taille={40} />
            <span className="relative flex h-14 w-14 shrink-0 items-center justify-center rounded-full border-2 border-white/15 bg-[#1F2B4A] text-lg font-medium text-[#F6F1E7]">
              {initialesDeNom(utilisateur.nom)}
            </span>
            <span className="relative min-w-0 flex-1">
              <span className="block truncate font-heading text-[17px] text-[#F6F1E7]">{utilisateur.nom}</span>
              <span className="block text-xs text-[#9B937F]">{utilisateur.telephone}</span>
            </span>
            <ChevronRight className="relative h-4 w-4 shrink-0 text-[#9B937F]" />
          </Link>

          <div className="px-4 pb-6 pt-4">
            <p className="mb-1.5 px-1 text-[11px] font-medium uppercase tracking-[0.14em] text-muted-foreground">Opérations</p>
            <div className="space-y-0.5">
              {operations.map((op) => (
                <Link
                  key={op.label}
                  href={op.href}
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-3 rounded-lg px-1 py-2.5 transition-colors hover:bg-secondary"
                >
                  <span className={cn("flex h-9 w-9 shrink-0 items-center justify-center rounded-lg", TEINTES[op.teinte])}>
                    <op.icon className="h-4 w-4" strokeWidth={1.75} />
                  </span>
                  <span className="flex-1 text-sm">{op.label}</span>
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                </Link>
              ))}
            </div>

            <p className="mb-1.5 mt-5 px-1 text-[11px] font-medium uppercase tracking-[0.14em] text-muted-foreground">Services</p>
            <div className="space-y-0.5">
              {services.map((s) => (
                <Link
                  key={s.label}
                  href={s.href}
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-3 rounded-lg px-1 py-2.5 transition-colors hover:bg-secondary"
                >
                  <span className={cn("flex h-9 w-9 shrink-0 items-center justify-center rounded-lg", TEINTES[s.teinte])}>
                    <s.icon className="h-4 w-4" strokeWidth={1.75} />
                  </span>
                  <span className="flex-1 text-sm">{s.label}</span>
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                </Link>
              ))}
              <Link
                href="/compte"
                onClick={() => setMenuOpen(false)}
                className="flex items-center gap-3 rounded-lg px-1 py-2.5 transition-colors hover:bg-secondary"
              >
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-secondary text-muted-foreground">
                  <UserCircle className="h-4 w-4" strokeWidth={1.75} />
                </span>
                <span className="flex-1 text-sm">Mon compte</span>
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
              </Link>
            </div>

            <Link
              href="/connexion"
              onClick={() => setMenuOpen(false)}
              className="mt-5 flex items-center gap-3 rounded-lg px-1 py-2.5 text-destructive transition-colors hover:bg-destructive/10"
            >
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-destructive/10">
                <LogOut className="h-4 w-4" strokeWidth={1.75} />
              </span>
              <span className="flex-1 text-sm font-medium">Se déconnecter</span>
            </Link>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}
