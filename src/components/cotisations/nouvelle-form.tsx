"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { CheckCircle2, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { useTresoraStore } from "@/lib/store";
import { useMembres } from "@/lib/selecteurs";
import type { Periodicite } from "@/lib/types";

export function NouvelleCotisationForm({
  espaceId,
  responsable,
}: {
  espaceId: string;
  responsable: string;
}) {
  const router = useRouter();
  const ajouterCotisation = useTresoraStore((s) => s.ajouterCotisation);
  const membres = useMembres(espaceId).filter((m) => m.statut === "actif");
  const [submitting, setSubmitting] = useState(false);
  const [periodicite, setPeriodicite] = useState<Periodicite>("mensuelle");
  const [portee, setPortee] = useState<"tous" | "selection">("tous");
  const [recherche, setRecherche] = useState("");
  const [selectionnes, setSelectionnes] = useState<Set<string>>(new Set());

  const membresFiltres = useMemo(() => {
    const q = recherche.trim().toLowerCase();
    if (!q) return membres;
    return membres.filter((m) => `${m.prenom} ${m.nom}`.toLowerCase().includes(q));
  }, [membres, recherche]);

  function toggleMembre(id: string) {
    setSelectionnes((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  const membreIds = portee === "tous" ? membres.map((m) => m.id) : Array.from(selectionnes);

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (membreIds.length === 0) return;
    setSubmitting(true);
    const donnees = new FormData(e.currentTarget);
    const id = ajouterCotisation({
      espaceId,
      nom: String(donnees.get("nom")),
      description: String(donnees.get("description") || ""),
      montant: Number(donnees.get("montant")) || 0,
      periodicite,
      dateDebut: String(donnees.get("debut")),
      dateLimite: String(donnees.get("limite")),
      responsable: String(donnees.get("responsable") || responsable),
      membreIds,
    });
    setTimeout(() => router.push(`/espace/${espaceId}/cotisations/${id}`), 400);
  }

  return (
    <form onSubmit={onSubmit} className="max-w-2xl space-y-6">
      <Card className="ledger-card">
        <CardContent className="space-y-5 pt-2">
          <div className="space-y-2">
            <Label htmlFor="nom">Nom de la cotisation</Label>
            <Input id="nom" name="nom" placeholder="Cotisation mensuelle — Septembre 2026" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" name="description" placeholder="Objectif et précisions sur cette cotisation" rows={3} />
          </div>
          <div className="grid gap-5 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="montant">Montant par membre (FCFA)</Label>
              <Input id="montant" name="montant" type="number" min={0} placeholder="2000" required />
            </div>
            <div className="space-y-2">
              <Label>Périodicité</Label>
              <Select value={periodicite} onValueChange={(v) => setPeriodicite(v as Periodicite)}>
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
              <Input id="debut" name="debut" type="date" defaultValue={new Date().toISOString().slice(0, 10)} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="limite">Date limite</Label>
              <Input id="limite" name="limite" type="date" required />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="responsable">Responsable</Label>
            <Input id="responsable" name="responsable" defaultValue={responsable} />
          </div>
        </CardContent>
      </Card>

      <Card className="ledger-card">
        <CardContent className="space-y-4 pt-2">
          <div className="space-y-2">
            <Label>Membres concernés</Label>
            <Select value={portee} onValueChange={(v) => setPortee(v as "tous" | "selection")}>
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="tous">Tous les membres actifs ({membres.length})</SelectItem>
                <SelectItem value="selection">Sélection personnalisée</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {portee === "selection" && (
            <div className="space-y-3">
              <div className="relative">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  className="pl-9"
                  placeholder="Rechercher un membre…"
                  value={recherche}
                  onChange={(e) => setRecherche(e.target.value)}
                />
              </div>
              <p className="text-xs text-muted-foreground">{selectionnes.size} membre(s) sélectionné(s)</p>
              <ScrollArea className="h-64 rounded-lg border border-border">
                <div className="divide-y divide-ledger-line">
                  {membresFiltres.map((m) => (
                    <label key={m.id} className="flex cursor-pointer items-center gap-3 px-3 py-2.5 text-sm hover:bg-secondary">
                      <Checkbox checked={selectionnes.has(m.id)} onCheckedChange={() => toggleMembre(m.id)} />
                      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-secondary text-[10px] font-medium">
                        {m.initiales}
                      </span>
                      <span className="min-w-0 flex-1 truncate">
                        {m.prenom} {m.nom}
                      </span>
                    </label>
                  ))}
                  {membresFiltres.length === 0 && (
                    <p className="px-3 py-6 text-center text-sm text-muted-foreground">Aucun membre trouvé.</p>
                  )}
                </div>
              </ScrollArea>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="flex items-center gap-3">
        <Button type="submit" size="lg" disabled={submitting || membreIds.length === 0}>
          <CheckCircle2 className="h-4 w-4" />
          {submitting ? "Création…" : `Créer la cotisation (${membreIds.length} membre${membreIds.length > 1 ? "s" : ""})`}
        </Button>
        <Button type="button" variant="ghost" size="lg" onClick={() => router.back()}>
          Annuler
        </Button>
      </div>
    </form>
  );
}
