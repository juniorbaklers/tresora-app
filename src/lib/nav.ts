import type { Espace, ModuleKey } from "./types";
import {
  LayoutGrid,
  Wallet,
  Coins,
  CalendarDays,
  ArrowLeftRight,
  Users,
  FileBarChart,
  Settings,
} from "lucide-react";

export interface NavItem {
  href: (espaceId: string) => string;
  label: string;
  icon: typeof LayoutGrid;
  module?: ModuleKey;
  mobile?: boolean;
  matchPrefix?: string;
}

export const NAV_ITEMS: NavItem[] = [
  { href: (id) => `/espace/${id}/dashboard`, label: "Tableau de bord", icon: LayoutGrid, mobile: true },
  { href: (id) => `/espace/${id}/finances`, label: "Trésorerie", icon: Wallet, mobile: true, matchPrefix: "finances" },
  { href: (id) => `/espace/${id}/cotisations`, label: "Cotisations", icon: Coins, module: "cotisations", mobile: true, matchPrefix: "cotisations" },
  { href: (id) => `/espace/${id}/evenements`, label: "Événements", icon: CalendarDays, module: "evenements", matchPrefix: "evenements" },
  { href: (id) => `/espace/${id}/contributions`, label: "Contributions", icon: ArrowLeftRight, module: "contributions", matchPrefix: "contributions" },
  { href: (id) => `/espace/${id}/membres`, label: "Membres", icon: Users, module: "membres", matchPrefix: "membres" },
  { href: (id) => `/espace/${id}/rapports`, label: "Rapports", icon: FileBarChart, matchPrefix: "rapports" },
  { href: (id) => `/espace/${id}/parametres`, label: "Paramètres", icon: Settings, matchPrefix: "parametres" },
];

export function navForEspace(espace: Espace): NavItem[] {
  return NAV_ITEMS.filter((item) => !item.module || espace.modules.includes(item.module));
}
