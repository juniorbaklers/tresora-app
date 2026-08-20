"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { formatDate } from "@/lib/format";
import type { Membre } from "@/lib/types";

export function MembresTable({ espaceId, membres }: { espaceId: string; membres: Membre[] }) {
  const [recherche, setRecherche] = useState("");
  const [limite, setLimite] = useState(30);

  const filtres = useMemo(() => {
    const q = recherche.toLowerCase();
    return membres.filter((m) => `${m.prenom} ${m.nom} ${m.telephone}`.toLowerCase().includes(q));
  }, [membres, recherche]);

  return (
    <div>
      <div className="relative mb-4 max-w-sm">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input placeholder="Rechercher un membre…" className="pl-9" value={recherche} onChange={(e) => { setRecherche(e.target.value); setLimite(30); }} />
      </div>

      <div className="overflow-x-auto rounded-xl border border-border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Membre</TableHead>
              <TableHead>Téléphone</TableHead>
              <TableHead>Fonction</TableHead>
              <TableHead>Inscrit le</TableHead>
              <TableHead>Statut</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtres.slice(0, limite).map((m) => (
              <TableRow key={m.id}>
                <TableCell>
                  <Link href={`/espace/${espaceId}/membres/${m.id}`} className="flex items-center gap-2.5 hover:underline">
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-secondary text-[10px] font-medium">
                      {m.initiales}
                    </span>
                    <span className="font-medium">
                      {m.prenom} {m.nom}
                    </span>
                  </Link>
                </TableCell>
                <TableCell className="font-tabular text-muted-foreground">{m.telephone}</TableCell>
                <TableCell className="text-muted-foreground">{m.fonction ?? "—"}</TableCell>
                <TableCell className="text-muted-foreground">{formatDate(m.dateInscription)}</TableCell>
                <TableCell>
                  <Badge variant={m.statut === "actif" ? "default" : "secondary"} className="font-normal">
                    {m.statut === "actif" ? "Actif" : "Inactif"}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {filtres.length > limite && (
        <button onClick={() => setLimite((l) => l + 30)} className="mt-4 text-sm text-muted-foreground underline underline-offset-4 hover:text-foreground">
          Afficher {Math.min(30, filtres.length - limite)} membres de plus ({filtres.length - limite} restants)
        </button>
      )}
    </div>
  );
}
