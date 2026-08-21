"use client";

import { useMemo, useState } from "react";
import { Search, CheckCircle2, History } from "lucide-react";
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
import { useTresoraStore } from "@/lib/store";
import { formatDate, formatFCFA } from "@/lib/format";
import type { Membre, PaiementCotisation } from "@/lib/types";

interface Ligne extends PaiementCotisation {
  membre: Membre;
}

export function SuiviTable({ cotisationId, paiements, montant }: { cotisationId: string; paiements: Ligne[]; montant: number }) {
  const enregistrerPaiement = useTresoraStore((s) => s.enregistrerPaiement);
  const [recherche, setRecherche] = useState("");
  const [filtreStatut, setFiltreStatut] = useState<string>("tous");
  const [dialogMembreId, setDialogMembreId] = useState<string | null>(null);
  const [montantSaisi, setMontantSaisi] = useState("");

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
  }

  function enregistrer() {
    if (!dialogMembreId || !ligneActive) return;
    const valeur = Math.max(0, Math.min(resteActif, Number(montantSaisi) || 0));
    if (valeur <= 0) return;
    enregistrerPaiement(cotisationId, dialogMembreId, valeur);
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
                {ligneActive.tranches.map((t) => (
                  <li key={t.id} className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">{formatDate(t.date)}</span>
                    <span className="font-tabular">{formatFCFA(t.montant)}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="space-y-2 py-2">
            <label className="text-sm font-medium">Montant de ce versement</label>
            <Input type="number" value={montantSaisi} onChange={(e) => setMontantSaisi(e.target.value)} min={0} max={resteActif} />
            <p className="text-xs text-muted-foreground">
              La cotisation peut être réglée en plusieurs fois : ce versement s&apos;ajoute aux précédents.
            </p>
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
    </div>
  );
}
