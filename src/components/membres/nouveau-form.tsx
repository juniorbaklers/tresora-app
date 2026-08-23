"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { useTresoraStore } from "@/lib/store";

export function NouveauMembreForm({ espaceId }: { espaceId: string }) {
  const router = useRouter();
  const ajouterMembre = useTresoraStore((s) => s.ajouterMembre);
  const [submitting, setSubmitting] = useState(false);

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    const donnees = new FormData(e.currentTarget);
    const id = ajouterMembre({
      espaceId,
      prenom: String(donnees.get("prenom")),
      nom: String(donnees.get("nom")),
      telephone: String(donnees.get("telephone")),
      email: String(donnees.get("email") || "") || undefined,
      fonction: String(donnees.get("fonction") || "") || undefined,
    });
    setTimeout(() => router.push(`/espace/${espaceId}/membres/${id}`), 400);
  }

  return (
    <form onSubmit={onSubmit} className="max-w-xl space-y-6">
      <Card className="ledger-card">
        <CardContent className="space-y-5 pt-2">
          <div className="grid gap-5 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="prenom">Prénom</Label>
              <Input id="prenom" name="prenom" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="nom">Nom</Label>
              <Input id="nom" name="nom" required />
            </div>
          </div>
          <div className="grid gap-5 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="telephone">Téléphone</Label>
              <Input id="telephone" name="telephone" placeholder="07 00 00 00 00" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email (optionnel)</Label>
              <Input id="email" name="email" type="email" />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="fonction">Fonction (optionnel)</Label>
            <Input id="fonction" name="fonction" placeholder="Responsable, Trésorier adjoint…" />
          </div>
        </CardContent>
      </Card>
      <div className="flex items-center gap-3">
        <Button type="submit" size="lg" disabled={submitting}>
          <CheckCircle2 className="h-4 w-4" />
          {submitting ? "Enregistrement…" : "Ajouter le membre"}
        </Button>
        <Button type="button" variant="ghost" size="lg" onClick={() => router.back()}>
          Annuler
        </Button>
      </div>
    </form>
  );
}
