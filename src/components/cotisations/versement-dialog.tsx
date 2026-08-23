"use client";

import { useState } from "react";
import { CheckCircle2, Banknote, Smartphone, Landmark, FileText } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { useTresoraStore } from "@/lib/store";
import { formatDate, formatFCFA } from "@/lib/format";
import type { ModePaiement, OperateurMobileMoney, Tranche } from "@/lib/types";

export interface CibleVersement {
  cotisationId: string;
  cotisationNom: string;
  membreId: string;
  membreNom: string;
  montantDu: number;
  montantPaye: number;
  tranches: Tranche[];
}

const LABELS_MODE: Record<ModePaiement, string> = {
  especes: "Espèces",
  mobile_money: "Mobile Money",
  virement: "Virement",
  cheque: "Chèque",
};

const ICONES_MODE: Record<ModePaiement, typeof Banknote> = {
  especes: Banknote,
  mobile_money: Smartphone,
  virement: Landmark,
  cheque: FileText,
};

const OPERATEURS: { value: OperateurMobileMoney; label: string }[] = [
  { value: "orange_money", label: "Orange Money" },
  { value: "mtn_money", label: "MTN Money" },
  { value: "moov_money", label: "Moov Money" },
  { value: "wave", label: "Wave" },
];

/**
 * Le point d'entrée unique pour encaisser une cotisation, que ce soit depuis
 * le suivi d'une cotisation précise ou depuis l'écran Paiement global. Monté
 * uniquement le temps qu'une cible soit choisie (voir `key` côté appelant),
 * ce qui donne un état de saisie neuf à chaque ouverture sans effet de reset.
 */
export function VersementDialog({ cible, onClose }: { cible: CibleVersement; onClose: () => void }) {
  const enregistrerPaiement = useTresoraStore((s) => s.enregistrerPaiement);
  const reste = cible.montantDu - cible.montantPaye;
  const [montantSaisi, setMontantSaisi] = useState(String(Math.max(0, reste)));
  const [modePaiement, setModePaiement] = useState<ModePaiement>("especes");
  const [operateur, setOperateur] = useState<OperateurMobileMoney>("orange_money");
  const [reference, setReference] = useState("");

  function enregistrer() {
    const valeur = Math.max(0, Math.min(reste, Number(montantSaisi) || 0));
    if (valeur <= 0) return;
    enregistrerPaiement(cible.cotisationId, cible.membreId, valeur, undefined, {
      modePaiement,
      operateur: modePaiement === "mobile_money" ? operateur : undefined,
      reference: reference.trim() || undefined,
    });
    onClose();
  }

  return (
    <Dialog open onOpenChange={(o) => !o && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Enregistrer un versement</DialogTitle>
          <DialogDescription>
            {cible.membreNom} — {cible.cotisationNom} — reste {formatFCFA(reste)} sur {formatFCFA(cible.montantDu)}
          </DialogDescription>
        </DialogHeader>

        {cible.tranches.length > 0 && (
          <div className="rounded-lg bg-secondary/60 p-3">
            <p className="mb-2 text-xs font-medium text-muted-foreground">Versements déjà reçus</p>
            <ul className="space-y-1">
              {cible.tranches.map((t) => {
                const Icone = ICONES_MODE[t.modePaiement ?? "especes"];
                return (
                  <li key={t.id} className="flex items-center justify-between text-xs">
                    <span className="flex items-center gap-1.5 text-muted-foreground">
                      <Icone className="h-3 w-3" />
                      {formatDate(t.date)}
                    </span>
                    <span className="font-tabular">{formatFCFA(t.montant)}</span>
                  </li>
                );
              })}
            </ul>
          </div>
        )}

        <div className="space-y-4 py-2">
          <div className="space-y-2">
            <label className="text-sm font-medium">Montant de ce versement</label>
            <Input type="number" value={montantSaisi} onChange={(e) => setMontantSaisi(e.target.value)} min={0} max={reste} />
            <p className="text-xs text-muted-foreground">
              La cotisation peut être réglée en plusieurs fois : ce versement s&apos;ajoute aux précédents.
            </p>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Moyen de paiement</label>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              {(Object.keys(LABELS_MODE) as ModePaiement[]).map((m) => {
                const Icone = ICONES_MODE[m];
                const actif = modePaiement === m;
                return (
                  <button
                    key={m}
                    type="button"
                    onClick={() => setModePaiement(m)}
                    className={`flex flex-col items-center gap-1.5 rounded-lg border px-2 py-2.5 text-xs transition-colors ${
                      actif ? "border-gold bg-gold/10 text-gold-foreground" : "border-border text-muted-foreground hover:bg-secondary"
                    }`}
                  >
                    <Icone className="h-4 w-4" />
                    {LABELS_MODE[m]}
                  </button>
                );
              })}
            </div>
          </div>

          {modePaiement === "mobile_money" && (
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-medium">Opérateur</label>
                <Select value={operateur} onValueChange={(v) => setOperateur(v as OperateurMobileMoney)}>
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {OPERATEURS.map((o) => (
                      <SelectItem key={o.value} value={o.value}>
                        {o.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Référence (optionnel)</label>
                <Input placeholder="Ex : MP240815.1234" value={reference} onChange={(e) => setReference(e.target.value)} />
              </div>
            </div>
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Annuler
          </Button>
          <Button onClick={enregistrer}>
            <CheckCircle2 className="h-4 w-4" />
            Valider le versement
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
