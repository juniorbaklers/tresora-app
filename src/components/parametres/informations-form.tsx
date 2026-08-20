"use client";

import { useState } from "react";
import { CheckCircle2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const DEVISES = [
  { value: "XOF", label: "FCFA — XOF (Afrique de l'Ouest)" },
  { value: "XAF", label: "FCFA — XAF (Afrique centrale)" },
  { value: "GHS", label: "Cedi ghanéen — GHS" },
  { value: "EUR", label: "Euro — EUR" },
  { value: "USD", label: "Dollar américain — USD" },
];

export function InformationsGeneralesForm({ nom }: { nom: string }) {
  const [devise, setDevise] = useState("XOF");
  const [enregistre, setEnregistre] = useState(false);

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="nom">Nom de l&apos;espace</Label>
        <Input id="nom" defaultValue={nom} />
      </div>
      <div className="space-y-2">
        <Label>Devise</Label>
        <Select value={devise} onValueChange={setDevise}>
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
        {devise !== "XOF" && (
          <p className="text-xs text-muted-foreground">
            Cette démo affiche toujours les montants en FCFA — la conversion complète arrivera avec la prochaine version.
          </p>
        )}
      </div>
      <Button size="sm" onClick={() => setEnregistre(true)}>
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
