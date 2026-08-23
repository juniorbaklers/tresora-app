"use client";

import { useMemo, useState } from "react";
import { Search, CheckCircle2, History, Banknote, Smartphone, Landmark, FileText, ScanLine } from "lucide-react";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { PaiementStatutBadge } from "@/components/cotisations/statut-badge";
import { ScannerMembreDialog } from "@/components/cotisations/scanner-membre-dialog";
import { AjouterMembresDialog } from "@/components/cotisations/ajouter-membres-dialog";
import { useTresoraStore } from "@/lib/store";
import { formatDate, formatFCFA } from "@/lib/format";
import type { Membre, ModePaiement, OperateurMobileMoney, PaiementCotisation } from "@/lib/types";

interface Ligne extends PaiementCotisation {
  membre: Membre;
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

export function SuiviTable({
  espaceId,
  cotisationId,
  paiements,
  montant,
}: {
  espaceId: string;
  cotisationId: string;
  paiements: Ligne[];
  montant: number;
}) {
  const enregistrerPaiement = useTresoraStore((s) => s.enregistrerPaiement);
  const [recherche, setRecherche] = useState("");
  const [filtreStatut, setFiltreStatut] = useState<string>("tous");
  const [dialogMembreId, setDialogMembreId] = useState<string | null>(null);
  const [montantSaisi, setMontantSaisi] = useState("");
  const [modePaiement, setModePaiement] = useState<ModePaiement>("especes");
  const [operateur, setOperateur] = useState<OperateurMobileMoney>("orange_money");
  const [reference, setReference] = useState("");
  const [scannerOuvert, setScannerOuvert] = useState(false);

  const filtres = useMemo(() => {
    return paiements.filter((p) => {
      const nomComplet = `${p.membre.prenom} ${p.membre.nom}`.toLowerCase();
      if (recherche && !nomComplet.includes(recherche.toLowerCase())) return false;
      if (filtreStatut !== "tous" && p.statut !== filtreStatut) return false;
      return true;
    });
  }, [paiements, recherche, filtreStatut]);

  const ligneActive = paiements.find((p) => p.membreId === dialogMembreId);
  const resteActif = ligneActive ? ligneActive.montantDu - ligneActive.montantPaye : montant;

  function ouvrirDialog(p: Ligne) {
    setDialogMembreId(p.membreId);
    setMontantSaisi(String(Math.max(0, p.montantDu - p.montantPaye)));
    setModePaiement("especes");
    setOperateur("orange_money");
    setReference("");
  }

  function surScan(membreId: string) {
    const ligne = paiements.find((p) => p.membreId === membreId);
    setScannerOuvert(false);
    if (ligne && ligne.statut !== "paye" && ligne.statut !== "exonere") ouvrirDialog(ligne);
  }

  function enregistrer() {
    if (!dialogMembreId || !ligneActive) return;
    const valeur = Math.max(0, Math.min(resteActif, Number(montantSaisi) || 0));
    if (valeur <= 0) return;
    enregistrerPaiement(cotisationId, dialogMembreId, valeur, undefined, {
      modePaiement,
      operateur: modePaiement === "mobile_money" ? operateur : undefined,
      reference: reference.trim() || undefined,
    });
    setDialogMembreId(null);
  }

  return (
    <div>
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Rechercher un membre…" className="pl-9" value={recherche} onChange={(e) => setRecherche(e.target.value)} />
        </div>
        <Select value={filtreStatut} onValueChange={setFiltreStatut}>
          <SelectTrigger className="sm:w-44">
            <SelectValue placeholder="Statut" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="tous">Tous les statuts</SelectItem>
            <SelectItem value="paye">Payé</SelectItem>
            <SelectItem value="partiel">Partiel</SelectItem>
            <SelectItem value="impaye">Impayé</SelectItem>
            <SelectItem value="en_retard">En retard</SelectItem>
          </SelectContent>
        </Select>
        <Button type="button" variant="outline" onClick={() => setScannerOuvert(true)}>
          <ScanLine className="h-4 w-4" />
          Scanner un membre
        </Button>
        <AjouterMembresDialog
          espaceId={espaceId}
          cotisationId={cotisationId}
          membresDejaInclus={new Set(paiements.map((p) => p.membreId))}
        />
      </div>

      <div className="overflow-x-auto rounded-xl border border-border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Membre</TableHead>
              <TableHead className="text-right">Montant dû</TableHead>
              <TableHead className="text-right">Payé</TableHead>
              <TableHead className="text-right">Reste</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtres.map((p) => (
              <TableRow key={p.membreId}>
                <TableCell>
                  <div className="flex items-center gap-2.5">
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-secondary text-[10px] font-medium">
                      {p.membre.initiales}
                    </span>
                    <span className="min-w-0 truncate">
                      {p.membre.prenom} {p.membre.nom}
                    </span>
                    {p.tranches.length > 1 && (
                      <span className="flex shrink-0 items-center gap-1 rounded-full bg-secondary px-1.5 py-0.5 text-[10px] text-muted-foreground">
                        <History className="h-2.5 w-2.5" />×{p.tranches.length}
                      </span>
                    )}
                  </div>
                </TableCell>
                <TableCell className="text-right font-tabular">{formatFCFA(p.montantDu)}</TableCell>
                <TableCell className="text-right font-tabular">{formatFCFA(p.montantPaye)}</TableCell>
                <TableCell className="text-right font-tabular">{formatFCFA(p.montantDu - p.montantPaye)}</TableCell>
                <TableCell>
                  <PaiementStatutBadge statut={p.statut} />
                </TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="sm" onClick={() => ouvrirDialog(p)} disabled={p.statut === "paye" || p.statut === "exonere"}>
                    Verser
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Dialog open={!!dialogMembreId} onOpenChange={(open) => !open && setDialogMembreId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Enregistrer un versement</DialogTitle>
            <DialogDescription>
              {ligneActive?.membre.prenom} {ligneActive?.membre.nom} — reste {formatFCFA(resteActif)} sur {formatFCFA(montant)}
            </DialogDescription>
          </DialogHeader>

          {ligneActive && ligneActive.tranches.length > 0 && (
            <div className="rounded-lg bg-secondary/60 p-3">
              <p className="mb-2 text-xs font-medium text-muted-foreground">Versements déjà reçus</p>
              <ul className="space-y-1">
                {ligneActive.tranches.map((t) => {
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
              <Input type="number" value={montantSaisi} onChange={(e) => setMontantSaisi(e.target.value)} min={0} max={resteActif} />
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
            <Button variant="outline" onClick={() => setDialogMembreId(null)}>
              Annuler
            </Button>
            <Button onClick={enregistrer}>
              <CheckCircle2 className="h-4 w-4" />
              Valider le versement
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <ScannerMembreDialog open={scannerOuvert} onOpenChange={setScannerOuvert} onMembreScanne={surScan} />
    </div>
  );
}
