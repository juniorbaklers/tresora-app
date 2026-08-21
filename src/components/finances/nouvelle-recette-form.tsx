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
import { LABELS_CATEGORIE_RECETTE } from "@/lib/charts";
import { useTresoraStore } from "@/lib/store";
import type { CategorieRecette } from "@/lib/types";

export function NouvelleRecetteForm({ espaceId, categories, responsable }: { espaceId: string; categories: CategorieRecette[]; responsable: string }) {
  const router = useRouter();
  const ajouterRecette = useTresoraStore((s) => s.ajouterRecette);
  const [submitting, setSubmitting] = useState(false);
  const [categorie, setCategorie] = useState<CategorieRecette>(categories[0]!);

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    const donnees = new FormData(e.currentTarget);
    ajouterRecette({
      id: `r-${espaceId}-${Date.now().toString(36)}`,
      espaceId,
      date: String(donnees.get("date")),
      montant: Number(donnees.get("montant")) || 0,
      categorie,
      libelle: String(donnees.get("libelle")),
      responsable: String(donnees.get("responsable") || responsable),
      commentaire: String(donnees.get("commentaire") || "") || undefined,
    });
    setTimeout(() => router.push(`/espace/${espaceId}/finances/recettes`), 400);
  }

  return (
    <form onSubmit={onSubmit} className="max-w-xl space-y-6">
      <Card className="ledger-card">
        <CardContent className="space-y-5 pt-2">
          <div className="grid gap-5 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="date">Date</Label>
              <Input id="date" name="date" type="date" defaultValue={new Date().toISOString().slice(0, 10)} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="montant">Montant (FCFA)</Label>
              <Input id="montant" name="montant" type="number" min={0} placeholder="50 000" required />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Catégorie</Label>
            <Select value={categorie} onValueChange={(v) => setCategorie(v as CategorieRecette)}>
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {categories.map((c) => (
                  <SelectItem key={c} value={c}>
                    {LABELS_CATEGORIE_RECETTE[c]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="libelle">Libellé</Label>
            <Input id="libelle" name="libelle" placeholder="Offrande ordinaire — culte du dimanche" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="commentaire">Commentaire (optionnel)</Label>
            <Textarea id="commentaire" name="commentaire" rows={3} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="responsable">Responsable</Label>
            <Input id="responsable" name="responsable" defaultValue={responsable} />
          </div>
        </CardContent>
      </Card>
      <div className="flex items-center gap-3">
        <Button type="submit" size="lg" disabled={submitting}>
          <CheckCircle2 className="h-4 w-4" />
          {submitting ? "Enregistrement…" : "Enregistrer la recette"}
        </Button>
        <Button type="button" variant="ghost" size="lg" onClick={() => router.back()}>
          Annuler
        </Button>
      </div>
    </form>
  );
}
