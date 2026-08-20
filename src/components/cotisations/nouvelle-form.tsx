"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";

export function NouvelleCotisationForm({ espaceId, membresCount, responsable }: { espaceId: string; membresCount: number; responsable: string }) {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setTimeout(() => {
      router.push(`/espace/${espaceId}/cotisations`);
    }, 500);
  }

  return (
    <form onSubmit={onSubmit} className="max-w-2xl space-y-6">
      <Card className="ledger-card">
        <CardContent className="space-y-5 pt-2">
          <div className="space-y-2">
            <Label htmlFor="nom">Nom de la cotisation</Label>
            <Input id="nom" placeholder="Cotisation mensuelle — Septembre 2026" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" placeholder="Objectif et précisions sur cette cotisation" rows={3} />
          </div>
          <div className="grid gap-5 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="montant">Montant par membre (FCFA)</Label>
              <Input id="montant" type="number" min={0} placeholder="2000" required />
            </div>
            <div className="space-y-2">
              <Label>Périodicité</Label>
              <Select defaultValue="mensuelle">
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="unique">Unique</SelectItem>
                  <SelectItem value="hebdomadaire">Hebdomadaire</SelectItem>
                  <SelectItem value="mensuelle">Mensuelle</SelectItem>
                  <SelectItem value="trimestrielle">Trimestrielle</SelectItem>
                  <SelectItem value="annuelle">Annuelle</SelectItem>
                  <SelectItem value="personnalisee">Personnalisée</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid gap-5 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="debut">Date de début</Label>
              <Input id="debut" type="date" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="limite">Date limite</Label>
              <Input id="limite" type="date" required />
            </div>
          </div>
          <div className="grid gap-5 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="responsable">Responsable</Label>
              <Input id="responsable" defaultValue={responsable} />
            </div>
            <div className="space-y-2">
              <Label>Membres concernés</Label>
              <Select defaultValue="tous">
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="tous">Tous les membres actifs ({membresCount})</SelectItem>
                  <SelectItem value="selection">Sélection personnalisée</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex items-center gap-3">
        <Button type="submit" size="lg" disabled={submitting}>
          <CheckCircle2 className="h-4 w-4" />
          {submitting ? "Création…" : "Créer la cotisation"}
        </Button>
        <Button type="button" variant="ghost" size="lg" onClick={() => router.back()}>
          Annuler
        </Button>
      </div>
    </form>
  );
}
