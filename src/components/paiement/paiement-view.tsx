"use client";

import { useMemo, useState } from "react";
import { Search, ChevronDown, Wallet } from "lucide-react";
import { PageHeader } from "@/components/app-shell/page-header";
import { EmptyState } from "@/components/app-shell/empty-state";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { VersementDialog, type CibleVersement } from "@/components/cotisations/versement-dialog";
import { useCotisations, useMembres } from "@/lib/selecteurs";
import { formatFCFA } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { Espace } from "@/lib/types";

export function PaiementView({ espace }: { espace: Espace }) {
  const membres = useMembres(espace.id);
  const cotisations = useCotisations(espace.id);
  const [recherche, setRecherche] = useState("");
  const [ouverts, setOuverts] = useState<Set<string>>(new Set());
  const [cible, setCible] = useState<CibleVersement | null>(null);

  const donnees = useMemo(() => {
    const parMembre = membres.map((membre) => {
      const dus = cotisations
        .map((c) => {
          const p = c.paiements.find((pm) => pm.membreId === membre.id);
          if (!p || p.statut === "paye" || p.statut === "exonere") return null;
          return {
            cotisationId: c.id,
            cotisationNom: c.nom,
            montantDu: p.montantDu,
            montantPaye: p.montantPaye,
            tranches: p.tranches,
          };
        })
        .filter((d): d is NonNullable<typeof d> => d !== null);
      const totalDu = dus.reduce((s, d) => s + (d.montantDu - d.montantPaye), 0);
      return { membre, dus, totalDu };
    });

    const q = recherche.trim().toLowerCase();
    const filtres = q ? parMembre.filter((x) => `${x.membre.prenom} ${x.membre.nom}`.toLowerCase().includes(q)) : parMembre;
    return [...filtres].sort((a, b) => b.totalDu - a.totalDu);
  }, [membres, cotisations, recherche]);

  function toggleOuvert(membreId: string) {
    setOuverts((prev) => {
      const next = new Set(prev);
      if (next.has(membreId)) next.delete(membreId);
      else next.add(membreId);
      return next;
    });
  }

  return (
    <>
      <PageHeader
        eyebrow={espace.nom}
        title="Paiement"
        subtitle="Recherchez un membre pour encaisser sa cotisation directement, sans passer par une cotisation précise."
      />

      <div className="relative mb-6 max-w-md">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          className="pl-9"
          placeholder="Rechercher un membre à qui enregistrer un paiement…"
          value={recherche}
          onChange={(e) => setRecherche(e.target.value)}
          autoFocus
        />
      </div>

      {donnees.length === 0 ? (
        <EmptyState icon={Wallet} title="Aucun membre trouvé" description="Essayez un autre nom, ou vérifiez l'orthographe." />
      ) : (
        <div className="space-y-2">
          {donnees.map(({ membre, dus, totalDu }) => {
            const ouvert = ouverts.has(membre.id);
            return (
              <div key={membre.id} className="overflow-hidden rounded-xl border border-border bg-card">
                <button
                  type="button"
                  onClick={() => dus.length > 0 && toggleOuvert(membre.id)}
                  disabled={dus.length === 0}
                  className="flex w-full items-center gap-3 p-4 text-left disabled:cursor-default"
                >
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-secondary text-xs font-medium">
                    {membre.initiales}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-medium">
                      {membre.prenom} {membre.nom}
                    </span>
                    <span className="block truncate font-tabular text-xs text-muted-foreground">{membre.telephone}</span>
                  </span>
                  {totalDu > 0 ? (
                    <Badge className="shrink-0 font-tabular font-normal">{formatFCFA(totalDu)} dû</Badge>
                  ) : (
                    <Badge variant="secondary" className="shrink-0 font-normal">
                      À jour
                    </Badge>
                  )}
                  {dus.length > 0 && (
                    <ChevronDown className={cn("h-4 w-4 shrink-0 text-muted-foreground transition-transform", ouvert && "rotate-180")} />
                  )}
                </button>

                {ouvert && dus.length > 0 && (
                  <div className="divide-y divide-ledger-line border-t border-border">
                    {dus.map((d) => (
                      <div key={d.cotisationId} className="flex items-center justify-between gap-3 px-4 py-2.5">
                        <span className="min-w-0 truncate text-sm text-muted-foreground">
                          {d.cotisationNom} · reste{" "}
                          <span className="font-tabular text-foreground">{formatFCFA(d.montantDu - d.montantPaye)}</span>
                        </span>
                        <Button
                          size="sm"
                          onClick={() =>
                            setCible({
                              cotisationId: d.cotisationId,
                              cotisationNom: d.cotisationNom,
                              membreId: membre.id,
                              membreNom: `${membre.prenom} ${membre.nom}`,
                              montantDu: d.montantDu,
                              montantPaye: d.montantPaye,
                              tranches: d.tranches,
                            })
                          }
                        >
                          Verser
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {cible && <VersementDialog key={`${cible.cotisationId}-${cible.membreId}`} cible={cible} onClose={() => setCible(null)} />}
    </>
  );
}
