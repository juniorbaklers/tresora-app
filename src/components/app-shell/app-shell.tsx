import type { ReactNode } from "react";
import { Sidebar } from "@/components/app-shell/sidebar";
import { Topbar } from "@/components/app-shell/topbar";
import { MobileNav } from "@/components/app-shell/mobile-nav";
import type { Espace } from "@/lib/types";

export function AppShell({ espace, children }: { espace: Espace; children: ReactNode }) {
  return (
    <div className="min-h-svh bg-background">
      <Sidebar espace={espace} />
      <div className="lg:pl-64">
        <Topbar espace={espace} />
        <main className="pb-24 lg:pb-10">{children}</main>
      </div>
      <MobileNav espace={espace} />
    </div>
  );
}
