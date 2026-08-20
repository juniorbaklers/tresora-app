"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo } from "@/components/brand/logo";
import { EspaceSwitcher } from "@/components/app-shell/espace-switcher";
import { NotificationBell } from "@/components/app-shell/notification-bell";
import { ThemeToggle } from "@/components/app-shell/theme-toggle";
import { navForEspace } from "@/lib/nav";
import { cn } from "@/lib/utils";
import type { Espace } from "@/lib/types";
import { UTILISATEUR, getNotifications } from "@/lib/data";

export function Sidebar({ espace }: { espace: Espace }) {
  const pathname = usePathname();
  const items = navForEspace(espace);

  return (
    <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 flex-col bg-[#0F1B2D] lg:flex">
      <div className="px-4 pt-5">
        <Link href="/espaces" className="block px-1">
          <Logo tone="dark" className="[&_span:last-child]:text-[#F5F6F3]" />
        </Link>
      </div>

      <div className="px-4 pt-6">
        <EspaceSwitcher espace={espace} />
      </div>

      <nav className="mt-6 flex-1 space-y-0.5 overflow-y-auto px-3">
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
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-[13.5px] transition-colors",
                active
                  ? "bg-[#16273F] text-[#F5F6F3] font-medium"
                  : "text-[#9AA4B2] hover:bg-white/[0.04] hover:text-[#F5F6F3]"
              )}
            >
              <item.icon className="h-[17px] w-[17px]" strokeWidth={1.75} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-white/[0.08] p-3">
        <div className="mb-1 flex items-center gap-1 px-1">
          <NotificationBell notifications={getNotifications(espace.id)} tone="dark" />
          <ThemeToggle tone="dark" />
        </div>
        <button className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-[#9AA4B2] transition-colors hover:bg-white/[0.04] hover:text-[#F5F6F3]">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#16273F] text-xs font-medium text-[#F5F6F3]">
            {UTILISATEUR.initiales}
          </span>
          <span className="text-left">
            <span className="block text-[13px] font-medium text-[#F5F6F3]">{UTILISATEUR.nom}</span>
            <span className="block text-[11px] text-[#8A93A3]">Voir le profil</span>
          </span>
        </button>
      </div>
    </aside>
  );
}
