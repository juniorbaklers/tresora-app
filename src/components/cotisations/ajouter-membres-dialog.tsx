"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { UserPlus, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { useMembres } from "@/lib/selecteurs";
import { useTresoraStore } from "@/lib/store";

export function AjouterMembresDialog({
  espaceId,
  cotisationId,
  membresDejaInclus,
}: {
  espaceId: string;
  cotisationId: string;
  membresDejaInclus: Set<string>;
}) {
  const tousLesMembres = useMembres(espaceId);
  const ajouterMembresACotisation = useTresoraStore((s) => s.ajouterMembresACotisation);
  const [open, setOpen] = useState(false);
  const [recherche, setRecherche] = useState("");
  const [selectionnes, setSelectionnes] = useState<Set<string>>(new Set());

  const disponibles = useMemo(() => {
    const q = recherche.trim().toLowerCase();
    return tousLesMembres.filter((m) => {
      if (membresDejaInclus.has(m.id)) return false;
      if (!q) return true;
      return `${m.prenom} ${m.nom}`.toLowerCase().includes(q);
    });
  }, [tousLesMembres, membresDejaInclus, recherche]);

  function toggle(id: string) {
    setSelectionnes((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function valider() {
    if (selectionnes.size === 0) return;
    ajouterMembresACotisation(cotisationId, Array.from(selectionnes));
    setOpen(false);
    setSelectionnes(new Set());
    setRecherche("");
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <Button type="button" variant="outline" onClick={() => setOpen(true)}>
        <UserPlus className="h-4 w-4" />
        Ajouter un membre
      </Button>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Ajouter des membres à cette cotisation</DialogTitle>
          <DialogDescription>
            Seuls les membres qui n&apos;en font pas encore partie sont proposés ci-dessous.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3 py-1">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input className="pl-9" placeholder="Rechercher un membre…" value={recherche} onChange={(e) => setRecherche(e.target.value)} />
          </div>

          {tousLesMembres.length === 0 ? (
            <p className="py-6 text-center text-sm text-muted-foreground">Cet espace n&apos;a encore aucun membre.</p>
          ) : disponibles.length === 0 ? (
            <p className="py-6 text-center text-sm text-muted-foreground">
              {recherche ? "Aucun membre trouvé." : "Tous les membres de cet espace font déjà partie de cette cotisation."}
            </p>
          ) : (
            <ScrollArea className="h-64 rounded-lg border border-border">
              <div className="divide-y divide-ledger-line">
                {disponibles.map((m) => (
                  <label key={m.id} className="flex cursor-pointer items-center gap-3 px-3 py-2.5 text-sm hover:bg-secondary">
                    <Checkbox checked={selectionnes.has(m.id)} onCheckedChange={() => toggle(m.id)} />
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-secondary text-[10px] font-medium">
                      {m.initiales}
                    </span>
                    <span className="min-w-0 flex-1 truncate">
                      {m.prenom} {m.nom}
                    </span>
                  </label>
                ))}
              </div>
            </ScrollArea>
          )}

          <p className="text-xs text-muted-foreground">
            La personne n&apos;est pas encore enregistrée ?{" "}
            <Link href={`/espace/${espaceId}/membres/nouveau`} className="font-medium text-foreground underline underline-offset-4">
              Ajoutez-la d&apos;abord
            </Link>
            , puis revenez ici.
          </p>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Annuler
          </Button>
          <Button onClick={valider} disabled={selectionnes.size === 0}>
            <UserPlus className="h-4 w-4" />
            Ajouter {selectionnes.size > 0 ? `(${selectionnes.size})` : ""}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
