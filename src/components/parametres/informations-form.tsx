"use client";

import { useState } from "react";
import { CheckCircle2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useTresoraStore } from "@/lib/store";
import type { DeviseCode } from "@/lib/types";

const DEVISES: { value: DeviseCode; label: string }[] = [
  { value: "XOF", label: "FCFA — XOF (Afrique de l'Ouest)" },
  { value: "XAF", label: "FCFA — XAF (Afrique centrale)" },
  { value: "GHS", label: "Cedi ghanéen — GHS" },
  { value: "EUR", label: "Euro — EUR" },
  { value: "USD", label: "Dollar américain — USD" },
];

export function InformationsGeneralesForm({ espaceId, nom, devise }: { espaceId: string; nom: string; devise: DeviseCode }) {
  const mettreAJourEspace = useTresoraStore((s) => s.mettreAJourEspace);
  const [nomLocal, setNomLocal] = useState(nom);
  const [deviseLocale, setDeviseLocale] = useState<DeviseCode>(devise);
  const [enregistre, setEnregistre] = useState(false);

  function onEnregistrer() {
    mettreAJourEspace(espaceId, { nom: nomLocal.trim() || nom, devise: deviseLocale });
    setEnregistre(true);
    setTimeout(() => setEnregistre(false), 2000);
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="nom">Nom de l&apos;espace</Label>
        <Input id="nom" value={nomLocal} onChange={(e) => setNomLocal(e.target.value)} />
      </div>
      <div className="space-y-2">
        <Label>Devise</Label>
        <Select value={deviseLocale} onValueChange={(v) => setDeviseLocale(v as DeviseCode)}>
          <SelectTrigger className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {DEVISES.map((d) => (
              <SelectItem key={d.value} value={d.value}>
                {d.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {deviseLocale !== "XOF" && (
          <p className="text-xs text-muted-foreground">
            Cette démo affiche toujours les montants en FCFA — la conversion complète arrivera avec la prochaine version.
          </p>
        )}
      </div>
      <Button size="sm" onClick={onEnregistrer}>
        {enregistre ? (
          <>
            <CheckCircle2 className="h-4 w-4" />
            Enregistré
          </>
        ) : (
          "Enregistrer"
        )}
      </Button>
    </div>
  );
}
