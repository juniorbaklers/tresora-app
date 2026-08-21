"use client";

import { Bell, AlertCircle, CheckCircle2, ArrowLeftRight, HandCoins, CalendarDays, FileBarChart } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { formatDate } from "@/lib/format";
import { useTresoraStore } from "@/lib/store";
import { useNotificationsCombinees, useIdsRappelsActifs } from "@/lib/selecteurs";
import type { TypeNotification } from "@/lib/types";

const ICONS: Record<TypeNotification, typeof Bell> = {
  cotisation_retard: AlertCircle,
  nouveau_paiement: CheckCircle2,
  contribution_demandee: ArrowLeftRight,
  contribution_recue: HandCoins,
  evenement_bientot: CalendarDays,
  rapport_disponible: FileBarChart,
};

export function NotificationBell({ espaceId, tone = "dark" }: { espaceId: string; tone?: "dark" | "light" }) {
  const notifications = useNotificationsCombinees(espaceId);
  const idsRappelsActifs = useIdsRappelsActifs(espaceId);
  const marquerNotificationLue = useTresoraStore((s) => s.marquerNotificationLue);
  const marquerToutesLues = useTresoraStore((s) => s.marquerToutesLues);
  const nonLues = notifications.filter((n) => !n.lue).length;

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          aria-label="Notifications"
          className={cn(
            "relative flex h-9 w-9 shrink-0 items-center justify-center rounded-full transition-colors",
            tone === "dark" ? "text-[#9B937F] hover:bg-white/[0.06] hover:text-[#F6F1E7]" : "bg-secondary text-foreground hover:opacity-80"
          )}
        >
          <Bell className="h-4 w-4" />
          {nonLues > 0 && (
            <span className="animate-in zoom-in-50 fade-in absolute right-1 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-[9px] font-medium text-destructive-foreground duration-300">
              {nonLues}
            </span>
          )}
        </button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-80 p-0">
        <div className="flex items-center justify-between border-b border-border px-4 py-3">
          <p className="text-sm font-medium">Notifications</p>
          {nonLues > 0 && (
            <Button variant="ghost" size="sm" className="h-auto p-0 text-xs" onClick={() => marquerToutesLues(espaceId, idsRappelsActifs)}>
              Tout marquer comme lu
            </Button>
          )}
        </div>
        <div className="max-h-96 overflow-y-auto">
          {notifications.length === 0 ? (
            <p className="px-4 py-8 text-center text-sm text-muted-foreground">Aucune notification.</p>
          ) : (
            <ul className="divide-y divide-border">
              {notifications.map((n) => {
                const Icon = ICONS[n.type];
                return (
                  <li
                    key={n.id}
                    onClick={() => !n.lue && marquerNotificationLue(n.id)}
                    className={cn("flex cursor-pointer gap-3 px-4 py-3", !n.lue && "bg-secondary/50")}
                  >
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-secondary text-muted-foreground">
                      <Icon className="h-4 w-4" strokeWidth={1.75} />
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="text-[13px] font-medium">{n.titre}</p>
                      <p className="mt-0.5 text-xs text-muted-foreground">{n.description}</p>
                      <p className="mt-1 text-[11px] text-muted-foreground">{formatDate(n.date)}</p>
                    </div>
                    {!n.lue && <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-gold" />}
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
