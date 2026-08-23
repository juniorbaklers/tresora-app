"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { useTresoraStore } from "@/lib/store";

export function NouvelEvenementForm({ espaceId }: { espaceId: string }) {
  const router = useRouter();
  const ajouterEvenement = useTresoraStore((s) => s.ajouterEvenement);
  const [submitting, setSubmitting] = useState(false);

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    const donnees = new FormData(e.currentTarget);
    const objectif = Number(donnees.get("objectif"));
    const suggere = Number(donnees.get("suggere"));
    const id = ajouterEvenement({
      espaceId,
      nom: String(donnees.get("nom")),
      description: String(donnees.get("description")),
      dateDebut: String(donnees.get("debut")),
      dateFin: String(donnees.get("fin")),
      montantCible: objectif > 0 ? objectif : undefined,
      montantSuggere: suggere > 0 ? suggere : undefined,
    });
    setTimeout(() => router.push(`/espace/${espaceId}/evenements/${id}`), 400);
  }

  return (
    <form onSubmit={onSubmit} className="max-w-xl space-y-6">
      <Card className="ledger-card">
        <CardContent className="space-y-5 pt-2">
          <div className="space-y-2">
            <Label htmlFor="nom">Nom de l&apos;événement</Label>
            <Input id="nom" name="nom" placeholder="Sortie annuelle des jeunes" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" name="description" rows={3} required />
          </div>
          <div className="grid gap-5 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="debut">Date de début</Label>
              <Input id="debut" name="debut" type="date" defaultValue={new Date().toISOString().slice(0, 10)} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="fin">Date de fin</Label>
              <Input id="fin" name="fin" type="date" required />
            </div>
          </div>
          <div className="grid gap-5 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="objectif">Montant cible (FCFA)</Label>
              <Input id="objectif" name="objectif" type="number" min={0} placeholder="500 000" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="suggere">Montant suggéré / participant</Label>
              <Input id="suggere" name="suggere" type="number" min={0} placeholder="10 000" />
            </div>
          </div>
        </CardContent>
      </Card>
      <div className="flex items-center gap-3">
        <Button type="submit" size="lg" disabled={submitting}>
          <CheckCircle2 className="h-4 w-4" />
          {submitting ? "Création…" : "Créer l'événement"}
        </Button>
        <Button type="button" variant="ghost" size="lg" onClick={() => router.back()}>
          Annuler
        </Button>
      </div>
    </form>
  );
}
