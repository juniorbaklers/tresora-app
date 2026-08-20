"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";

export function NouvelEvenementForm({ espaceId }: { espaceId: string }) {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setTimeout(() => router.push(`/espace/${espaceId}/evenements`), 500);
  }

  return (
    <form onSubmit={onSubmit} className="max-w-xl space-y-6">
      <Card className="ledger-card">
        <CardContent className="space-y-5 pt-2">
          <div className="space-y-2">
            <Label htmlFor="nom">Nom de l&apos;événement</Label>
            <Input id="nom" placeholder="Sortie annuelle des jeunes" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" rows={3} required />
          </div>
          <div className="grid gap-5 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="debut">Date de début</Label>
              <Input id="debut" type="date" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="fin">Date de fin</Label>
              <Input id="fin" type="date" required />
            </div>
          </div>
          <div className="grid gap-5 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="objectif">Montant cible (FCFA)</Label>
              <Input id="objectif" type="number" min={0} placeholder="500 000" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="suggere">Montant suggéré / participant</Label>
              <Input id="suggere" type="number" min={0} placeholder="10 000" />
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
