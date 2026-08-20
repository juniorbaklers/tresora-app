"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import type { Espace } from "@/lib/types";

export function NouvelleContributionForm({ espaceId, cibles }: { espaceId: string; cibles: Espace[] }) {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setTimeout(() => router.push(`/espace/${espaceId}/contributions`), 500);
  }

  return (
    <form onSubmit={onSubmit} className="max-w-xl space-y-6">
      <Card className="ledger-card">
        <CardContent className="space-y-5 pt-2">
          <div className="space-y-2">
            <Label htmlFor="projet">Nom du projet</Label>
            <Input id="projet" placeholder="Projet rénovation de la salle de culte" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" rows={3} placeholder="Précisez l'objectif de cette demande" />
          </div>
          <div className="space-y-2">
            <Label>Espace sollicité</Label>
            <Select defaultValue={cibles[0]?.id}>
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {cibles.map((c) => (
                  <SelectItem key={c.id} value={c.id}>
                    {c.nom}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              Vous ne verrez jamais les finances internes de cet espace, uniquement le suivi de cette demande.
            </p>
          </div>
          <div className="grid gap-5 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="montant">Montant demandé (FCFA)</Label>
              <Input id="montant" type="number" min={0} placeholder="200 000" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="limite">Date limite</Label>
              <Input id="limite" type="date" required />
            </div>
          </div>
        </CardContent>
      </Card>
      <div className="flex items-center gap-3">
        <Button type="submit" size="lg" disabled={submitting}>
          <CheckCircle2 className="h-4 w-4" />
          {submitting ? "Envoi…" : "Envoyer la demande"}
        </Button>
        <Button type="button" variant="ghost" size="lg" onClick={() => router.back()}>
          Annuler
        </Button>
      </div>
    </form>
  );
}
