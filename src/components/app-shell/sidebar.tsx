"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo } from "@/components/brand/logo";
import { TrameLosange } from "@/components/brand/motif";
import { EspaceSwitcher } from "@/components/app-shell/espace-switcher";
import { NotificationBell } from "@/components/app-shell/notification-bell";
import { ThemeToggle } from "@/components/app-shell/theme-toggle";
import { navForEspace } from "@/lib/nav";
import { cn } from "@/lib/utils";
import { useUtilisateur } from "@/lib/selecteurs";
import { initialesDeNom } from "@/lib/format";
import type { Espace } from "@/lib/types";

export function Sidebar({ espace }: { espace: Espace }) {
  const pathname = usePathname();
  const items = navForEspace(espace);
  const utilisateur = useUtilisateur();

  return (
    <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 flex-col overflow-hidden bg-[var(--indigo-deep)] lg:flex">
      <TrameLosange opacite={0.055} taille={40} />

      <div className="relative px-4 pt-5">
        <Link href="/espaces" className="block px-1">
          <Logo tone="dark" className="[&_span:last-child]:text-[#F6F1E7]" />
        </Link>
      </div>

      <div className="relative px-4 pt-6">
        <EspaceSwitcher espace={espace} />
      </div>

      <nav className="relative mt-6 flex-1 space-y-0.5 overflow-y-auto px-3">
        {items.map((item) => {
          const href = item.href(espace.id);
          const active = item.matchPrefix
            ? pathname.includes(`/${item.matchPrefix}`)
            : pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "relative flex items-center gap-3 rounded-lg py-2.5 pl-4 pr-3 text-[13.5px] transition-colors",
                active
                  ? "bg-[#1F2B4A] font-medium text-[#F6F1E7]"
                  : "text-[#9B937F] hover:bg-white/[0.04] hover:text-[#F6F1E7]"
              )}
            >
              {/* lisière tissée qui marque la page courante */}
              {active && <span className="absolute left-0 top-1/2 h-6 w-[3px] -translate-y-1/2 rounded-full bg-gold" />}
              <item.icon className="h-[17px] w-[17px]" strokeWidth={1.75} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="relative border-t border-white/[0.08] p-3">
        <div className="mb-1 flex items-center gap-1 px-1">
          <NotificationBell espaceId={espace.id} tone="dark" />
          <ThemeToggle tone="dark" />
        </div>
        <Link href="/compte" className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-[#9B937F] transition-colors hover:bg-white/[0.04] hover:text-[#F6F1E7]">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#1F2B4A] text-xs font-medium text-[#F6F1E7]">
            {initialesDeNom(utilisateur.nom)}
          </span>
          <span className="text-left">
            <span className="block text-[13px] font-medium text-[#F6F1E7]">{utilisateur.nom}</span>
            <span className="block text-[11px] text-[#9B937F]">Voir le profil</span>
          </span>
        </Link>
      </div>
    </aside>
  );
}
