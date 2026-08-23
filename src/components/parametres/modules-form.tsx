"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { useTresoraStore } from "@/lib/store";
import type { ModuleKey } from "@/lib/types";

const TOUS_LES_MODULES: { value: ModuleKey; label: string }[] = [
  { value: "membres", label: "Membres" },
  { value: "cotisations", label: "Cotisations" },
  { value: "evenements", label: "Événements" },
  { value: "recettes", label: "Recettes" },
  { value: "depenses", label: "Dépenses" },
  { value: "rapports", label: "Rapports" },
  { value: "dimes", label: "Dîmes" },
  { value: "offrandes", label: "Offrandes" },
  { value: "dons", label: "Dons" },
  { value: "contributions", label: "Contributions inter-espaces" },
];

export function ModulesForm({ espaceId, modules }: { espaceId: string; modules: ModuleKey[] }) {
  const mettreAJourEspace = useTresoraStore((s) => s.mettreAJourEspace);

  function toggle(module: ModuleKey) {
    const actifs = modules.includes(module) ? modules.filter((m) => m !== module) : [...modules, module];
    mettreAJourEspace(espaceId, { modules: actifs });
  }

  return (
    <div className="grid gap-2.5 sm:grid-cols-2">
      {TOUS_LES_MODULES.map((m) => (
        <label
          key={m.value}
          className="flex items-center gap-2.5 rounded-lg border border-border px-3 py-2.5 text-sm transition-colors hover:bg-secondary"
        >
          <Checkbox checked={modules.includes(m.value)} onCheckedChange={() => toggle(m.value)} />
          {m.label}
        </label>
      ))}
    </div>
  );
}
