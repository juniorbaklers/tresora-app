"use client";

import { useMemo, useState } from "react";
import { Search, History, ScanLine } from "lucide-react";
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
import { PaiementStatutBadge } from "@/components/cotisations/statut-badge";
import { ScannerMembreDialog } from "@/components/cotisations/scanner-membre-dialog";
import { AjouterMembresDialog } from "@/components/cotisations/ajouter-membres-dialog";
import { VersementDialog, type CibleVersement } from "@/components/cotisations/versement-dialog";
import { formatFCFA } from "@/lib/format";
import type { Membre, PaiementCotisation } from "@/lib/types";

interface Ligne extends PaiementCotisation {
  membre: Membre;
}

export function SuiviTable({
  espaceId,
  cotisationId,
  cotisationNom,
  paiements,
}: {
  espaceId: string;
  cotisationId: string;
  cotisationNom: string;
  paiements: Ligne[];
}) {
  const [recherche, setRecherche] = useState("");
  const [filtreStatut, setFiltreStatut] = useState<string>("tous");
  const [cible, setCible] = useState<CibleVersement | null>(null);
  const [scannerOuvert, setScannerOuvert] = useState(false);

  const filtres = useMemo(() => {
    return paiements.filter((p) => {
      const nomComplet = `${p.membre.prenom} ${p.membre.nom}`.toLowerCase();
      if (recherche && !nomComplet.includes(recherche.toLowerCase())) return false;
      if (filtreStatut !== "tous" && p.statut !== filtreStatut) return false;
      return true;
    });
  }, [paiements, recherche, filtreStatut]);

  function ouvrirDialog(p: Ligne) {
    setCible({
      cotisationId,
      cotisationNom,
      membreId: p.membreId,
      membreNom: `${p.membre.prenom} ${p.membre.nom}`,
      montantDu: p.montantDu,
      montantPaye: p.montantPaye,
      tranches: p.tranches,
    });
  }

  function surScan(membreId: string) {
    const ligne = paiements.find((p) => p.membreId === membreId);
    setScannerOuvert(false);
    if (ligne && ligne.statut !== "paye" && ligne.statut !== "exonere") ouvrirDialog(ligne);
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

      {cible && <VersementDialog key={`${cible.cotisationId}-${cible.membreId}`} cible={cible} onClose={() => setCible(null)} />}
      <ScannerMembreDialog open={scannerOuvert} onOpenChange={setScannerOuvert} onMembreScanne={surScan} />
    </div>
  );
}
