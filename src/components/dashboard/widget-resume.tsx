"use client";

import { AlertCircle, BellRing, CheckCircle2, Wallet } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useSoldeActuel, useNotificationsCombinees } from "@/lib/selecteurs";
import { useTresoraStore } from "@/lib/store";
import { formatFCFA } from "@/lib/format";

/**
 * Widget compact, pensé pour un coup d'œil : solde du moment et notifications
 * non lues (rappels de cotisation compris), avec une action rapide sans avoir
 * à quitter le tableau de bord.
 */
export function WidgetResume({ espaceId }: { espaceId: string }) {
  const solde = useSoldeActuel(espaceId);
  const notifications = useNotificationsCombinees(espaceId);
  const marquerNotificationLue = useTresoraStore((s) => s.marquerNotificationLue);
  const nonLues = notifications.filter((n) => !n.lue);

  return (
    <Card className="ledger-card border-l-4 border-l-gold">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-[15px] font-medium">
          <BellRing className="h-4 w-4 text-gold" />
          Résumé rapide
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between rounded-lg bg-secondary/60 px-3 py-2.5">
          <span className="flex items-center gap-2 text-sm text-muted-foreground">
            <Wallet className="h-3.5 w-3.5" />
            Solde actuel
          </span>
          <span className="font-tabular text-sm font-medium">{formatFCFA(solde)}</span>
        </div>

        {nonLues.length === 0 ? (
          <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <CheckCircle2 className="h-3.5 w-3.5 text-positive" />
            Rien à signaler pour le moment.
          </p>
        ) : (
          <div>
            <p className="mb-2 flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
              <AlertCircle className="h-3.5 w-3.5 text-destructive" />
              {nonLues.length} notification{nonLues.length > 1 ? "s" : ""} à traiter
            </p>
            <ul className="space-y-2">
              {nonLues.slice(0, 3).map((n) => (
                <li key={n.id} className="flex items-start justify-between gap-2 text-xs">
                  <span className="min-w-0 flex-1 truncate" title={n.titre}>
                    {n.titre}
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 shrink-0 px-2 text-[11px]"
                    onClick={() => marquerNotificationLue(n.id)}
                  >
                    Marquer lu
                  </Button>
                </li>
              ))}
            </ul>
            {nonLues.length > 3 && <p className="mt-2 text-[11px] text-muted-foreground">+{nonLues.length - 3} autre(s)</p>}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
