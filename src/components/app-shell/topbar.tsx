"use client";

import { EspaceSwitcher } from "@/components/app-shell/espace-switcher";
import { NotificationBell } from "@/components/app-shell/notification-bell";
import { ThemeToggle } from "@/components/app-shell/theme-toggle";
import type { Espace } from "@/lib/types";

export function Topbar({ espace }: { espace: Espace }) {
  return (
    <header className="sticky top-0 z-20 flex items-center gap-2 border-b border-border bg-background/95 px-3 py-2.5 backdrop-blur lg:hidden">
      <div className="min-w-0 flex-1">
        <EspaceSwitcher espace={espace} tone="light" />
      </div>
      <ThemeToggle tone="light" />
      <NotificationBell espaceId={espace.id} tone="light" />
    </header>
  );
}
