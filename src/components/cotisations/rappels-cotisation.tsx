"use client";

import { useState } from "react";
import { AlarmClock, Send, CheckCircle2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useTresoraStore } from "@/lib/store";
import { useMembres } from "@/lib/selecteurs";
import { joursRestants, estEnRetard, formatDelai } from "@/lib/rappels";
import { formatFCFA } from "@/lib/format";
import type { Cotisation } from "@/lib/types";

export function RappelsCotisation({ cotisation }: { cotisation: Cotisation }) {
  const rappels = useTresoraStore((s) => s.rappels);
  const envoyerRappel = useTresoraStore((s) => s.envoyerRappel);
  const membresEspace = useMembres(cotisation.espaceId);
  const [envoiTousFait, setEnvoiTousFait] = useState(false);

  const impayes = cotisation.paiements.filter((p) => p.statut !== "paye" && p.statut !== "exonere");
  const restants = joursRestants(cotisation.dateLimite);

  if (impayes.length === 0) return null;

  function dernierRappel(membreId: string) {
    return rappels
      .filter((r) => r.cotisationId === cotisation.id && r.membreId === membreId)
      .sort((a, b) => b.date.localeCompare(a.date))[0];
  }

  function envoyerATous() {
    for (const p of impayes) envoyerRappel(cotisation.id, p.membreId);
    setEnvoiTousFait(true);
  }

  return (
    <Card className="ledger-card">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2 text-[15px] font-medium">
          <AlarmClock className="h-4 w-4 text-muted-foreground" />
          Rappels — {impayes.length} membre{impayes.length > 1 ? "s" : ""} n&apos;{impayes.length > 1 ? "ont" : "a"} pas encore soldé
        </CardTitle>
        <Button variant="outline" size="sm" onClick={envoyerATous}>
          {envoiTousFait ? <CheckCircle2 className="h-4 w-4" /> : <Send className="h-4 w-4" />}
          Rappeler tout le monde
        </Button>
      </CardHeader>
      <CardContent>
        <p className={cn("mb-3 text-xs font-medium", restants < 0 ? "text-destructive" : "text-muted-foreground")}>
          Échéance de la cotisation : {formatDelai(restants)}
        </p>
        <ul className="divide-y divide-ledger-line">
          {impayes.map((p) => {
            const membre = membresEspace.find((m) => m.id === p.membreId);
            if (!membre) return null;
            const rappel = dernierRappel(p.membreId);
            const enRetard = estEnRetard(p, cotisation.dateLimite);
            return (
              <li key={p.membreId} className="flex items-center justify-between gap-3 py-2.5">
                <div className="flex min-w-0 items-center gap-2.5">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-secondary text-[10px] font-medium">
                    {membre.initiales}
                  </span>
                  <div className="min-w-0">
                    <p className="truncate text-[13px] font-medium">
                      {membre.prenom} {membre.nom}
                    </p>
                    <p className={cn("text-[11px]", enRetard ? "text-destructive" : "text-muted-foreground")}>
                      Reste {formatFCFA(p.montantDu - p.montantPaye)} · {formatDelai(restants)}
                      {rappel && ` · rappelé le ${rappel.date}`}
                    </p>
                  </div>
                </div>
                <Button variant="ghost" size="sm" onClick={() => envoyerRappel(cotisation.id, p.membreId)}>
                  <Send className="h-3.5 w-3.5" />
                  Rappeler
                </Button>
              </li>
            );
          })}
        </ul>
      </CardContent>
    </Card>
  );
}
