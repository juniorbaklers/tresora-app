"use client";

import { useMemo, useState } from "react";
import { Search, CheckCircle2 } from "lucide-react";
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
import { formatFCFA } from "@/lib/format";
import type { Membre, PaiementCotisation, StatutPaiement } from "@/lib/types";

interface Ligne extends PaiementCotisation {
  membre: Membre;
}

export function SuiviTable({ paiements: initial, montant }: { paiements: Ligne[]; montant: number }) {
  const [paiements, setPaiements] = useState(initial);
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

  function ouvrirDialog(p: Ligne) {
    setDialogMembreId(p.membreId);
    setMontantSaisi(String(p.montantPaye || montant));
  }

  function enregistrer() {
    if (!dialogMembreId) return;
    const valeur = Math.max(0, Math.min(montant, Number(montantSaisi) || 0));
    setPaiements((prev) =>
      prev.map((p) => {
        if (p.membreId !== dialogMembreId) return p;
        const statut: StatutPaiement = valeur >= montant ? "paye" : valeur > 0 ? "partiel" : "impaye";
        return { ...p, montantPaye: valeur, statut, dernierPaiement: new Date().toISOString().slice(0, 10) };
      })
    );
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
                  </div>
                </TableCell>
                <TableCell className="text-right font-tabular">{formatFCFA(p.montantDu)}</TableCell>
                <TableCell className="text-right font-tabular">{formatFCFA(p.montantPaye)}</TableCell>
                <TableCell className="text-right font-tabular">{formatFCFA(p.montantDu - p.montantPaye)}</TableCell>
                <TableCell>
                  <PaiementStatutBadge statut={p.statut} />
                </TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="sm" onClick={() => ouvrirDialog(p)}>
                    Enregistrer
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
            <DialogTitle>Enregistrer un paiement</DialogTitle>
            <DialogDescription>
              {ligneActive?.membre.prenom} {ligneActive?.membre.nom} — montant dû : {formatFCFA(montant)}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-2 py-2">
            <label className="text-sm font-medium">Montant reçu</label>
            <Input type="number" value={montantSaisi} onChange={(e) => setMontantSaisi(e.target.value)} min={0} max={montant} />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogMembreId(null)}>
              Annuler
            </Button>
            <Button onClick={enregistrer}>
              <CheckCircle2 className="h-4 w-4" />
              Valider le paiement
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
