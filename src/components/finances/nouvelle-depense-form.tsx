"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { CheckCircle2, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";

export function NouvelleDepenseForm({ espaceId, responsable }: { espaceId: string; responsable: string }) {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setTimeout(() => router.push(`/espace/${espaceId}/finances/depenses`), 500);
  }

  return (
    <form onSubmit={onSubmit} className="max-w-xl space-y-6">
      <Card className="ledger-card">
        <CardContent className="space-y-5 pt-2">
          <div className="grid gap-5 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="date">Date</Label>
              <Input id="date" type="date" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="montant">Montant (FCFA)</Label>
              <Input id="montant" type="number" min={0} placeholder="95 000" required />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="categorie">Catégorie</Label>
            <Input id="categorie" placeholder="Entretien bâtiment, Transport, Communication…" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" rows={3} placeholder="Objet de la dépense" required />
          </div>
          <div className="grid gap-5 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="beneficiaire">Bénéficiaire</Label>
              <Input id="beneficiaire" placeholder="Nom du fournisseur ou de la personne" required />
            </div>
            <div className="space-y-2">
              <Label>Mode de paiement</Label>
              <Select defaultValue="mobile_money">
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="especes">Espèces</SelectItem>
                  <SelectItem value="mobile_money">Mobile Money</SelectItem>
                  <SelectItem value="virement">Virement</SelectItem>
                  <SelectItem value="cheque">Chèque</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="responsable">Responsable</Label>
            <Input id="responsable" defaultValue={responsable} />
          </div>
          <div className="space-y-2">
            <Label>Justificatif</Label>
            <button type="button" className="flex w-full items-center justify-center gap-2 rounded-lg border border-dashed border-border py-6 text-sm text-muted-foreground hover:border-gold hover:text-foreground">
              <Upload className="h-4 w-4" />
              Joindre une photo du reçu
            </button>
          </div>
        </CardContent>
      </Card>
      <div className="flex items-center gap-3">
        <Button type="submit" size="lg" disabled={submitting}>
          <CheckCircle2 className="h-4 w-4" />
          {submitting ? "Enregistrement…" : "Enregistrer la dépense"}
        </Button>
        <Button type="button" variant="ghost" size="lg" onClick={() => router.back()}>
          Annuler
        </Button>
      </div>
    </form>
  );
}
