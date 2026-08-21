"use client";

import { useState } from "react";
import { Pencil, CheckCircle2, History } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { formatDate } from "@/lib/format";
import type { Correction } from "@/lib/types";

/**
 * Corriger une saisie sans jamais l'effacer : la raison est obligatoire et
 * l'historique des corrections déjà faites reste visible avant d'en ajouter
 * une nouvelle — c'est ce qui rend une correction traçable et distinguable
 * d'un vol déguisé en « faute de frappe ».
 */
export function CorrectionDialog({
  champLabel,
  valeurActuelle,
  type = "texte",
  corrections = [],
  onValider,
}: {
  champLabel: string;
  valeurActuelle: string;
  type?: "montant" | "texte";
  corrections?: Correction[];
  onValider: (nouvelleValeur: string, raison: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const [valeur, setValeur] = useState(valeurActuelle);
  const [raison, setRaison] = useState("");

  function valider() {
    const propre = valeur.trim();
    if (!propre || !raison.trim() || propre === valeurActuelle) return;
    onValider(propre, raison.trim());
    setOpen(false);
    setRaison("");
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(o) => {
        setOpen(o);
        if (o) {
          setValeur(valeurActuelle);
          setRaison("");
        }
      }}
    >
      <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setOpen(true)} aria-label={`Corriger ${champLabel.toLowerCase()}`}>
        <Pencil className="h-3.5 w-3.5" />
      </Button>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Corriger — {champLabel}</DialogTitle>
          <DialogDescription>
            Une raison est obligatoire. La valeur d&apos;origine reste conservée dans le journal d&apos;activité.
          </DialogDescription>
        </DialogHeader>

        {corrections.length > 0 && (
          <div className="rounded-lg bg-secondary/60 p-3">
            <p className="mb-2 flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
              <History className="h-3 w-3" />
              Déjà corrigé {corrections.length} fois
            </p>
            <ul className="space-y-1.5">
              {[...corrections].reverse().map((c) => (
                <li key={c.id} className="text-xs">
                  <span className="text-muted-foreground">{formatDate(c.date)} — </span>
                  <span className="line-through decoration-muted-foreground/60">{c.ancienneValeur}</span>
                  <span className="text-muted-foreground"> → </span>
                  <span className="font-medium">{c.nouvelleValeur}</span>
                  <span className="text-muted-foreground"> ({c.raison})</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="space-y-4 py-1">
          <div className="space-y-2">
            <Label htmlFor="correction-valeur">Valeur actuelle : {valeurActuelle}</Label>
            <Input
              id="correction-valeur"
              type={type === "montant" ? "number" : "text"}
              value={valeur}
              onChange={(e) => setValeur(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="correction-raison">Raison de la correction</Label>
            <Textarea
              id="correction-raison"
              rows={2}
              placeholder="Ex : erreur de saisie, montant mal lu sur le reçu…"
              value={raison}
              onChange={(e) => setRaison(e.target.value)}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Annuler
          </Button>
          <Button onClick={valider} disabled={!raison.trim() || !valeur.trim() || valeur.trim() === valeurActuelle}>
            <CheckCircle2 className="h-4 w-4" />
            Valider la correction
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
