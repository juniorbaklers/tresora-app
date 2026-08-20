"use client";

import { Bell } from "lucide-react";
import { EspaceSwitcher } from "@/components/app-shell/espace-switcher";
import type { Espace } from "@/lib/types";

export function Topbar({ espace }: { espace: Espace }) {
  return (
    <header className="sticky top-0 z-20 flex items-center gap-3 border-b border-border bg-background/95 px-3 py-2.5 backdrop-blur lg:hidden">
      <div className="min-w-0 flex-1">
        <EspaceSwitcher espace={espace} tone="light" />
      </div>
      <button className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-secondary" aria-label="Notifications">
        <Bell className="h-4 w-4" />
      </button>
    </header>
  );
}
