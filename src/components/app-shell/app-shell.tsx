"use client";

import type { ReactNode } from "react";
import { Sidebar } from "@/components/app-shell/sidebar";
import { Topbar } from "@/components/app-shell/topbar";
import { MobileNav } from "@/components/app-shell/mobile-nav";
import { useEspaceEffectif } from "@/lib/selecteurs";
import type { Espace } from "@/lib/types";

export function AppShell({ espace: espaceBase, children }: { espace: Espace; children: ReactNode }) {
  const espace = useEspaceEffectif(espaceBase);

  return (
    <div className="min-h-svh bg-background">
      <div className="print:hidden">
        <Sidebar espace={espace} />
      </div>
      <div className="lg:pl-64 print:pl-0">
        <div className="print:hidden">
          <Topbar espace={espace} />
        </div>
        <main className="pb-24 lg:pb-10 print:pb-0">{children}</main>
      </div>
      <div className="print:hidden">
        <MobileNav espace={espace} />
      </div>
    </div>
  );
}
