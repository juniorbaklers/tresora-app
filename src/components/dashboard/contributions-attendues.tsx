import { getEspace } from "@/lib/data";
import { formatFCFA, pct } from "@/lib/format";
import { Progress } from "@/components/ui/progress";
import { ContributionStatutBadge } from "@/components/contributions/statut-badge";
import type { Contribution } from "@/lib/types";

export function ContributionsAttendues({ contributions }: { contributions: Contribution[] }) {
  return (
    <ul className="divide-y divide-ledger-line">
      {contributions.map((c) => {
        const espace = getEspace(c.espaceCibleId);
        return (
          <li key={c.id} className="py-3">
            <div className="flex items-center justify-between gap-3">
              <div className="flex min-w-0 items-center gap-2.5">
                {espace && (
                  <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded text-[10px] font-semibold text-white ${espace.couleur}`}>
                    {espace.initiales}
                  </span>
                )}
                <span className="truncate text-[13.5px] font-medium">{espace?.nom}</span>
              </div>
              <ContributionStatutBadge statut={c.statut} />
            </div>
            <div className="mt-2 flex items-center gap-3">
              <Progress value={pct(c.montantRecu, c.montantDemande)} className="h-1.5 flex-1" />
              <span className="shrink-0 font-tabular text-xs text-muted-foreground">
                {formatFCFA(c.montantRecu)} / {formatFCFA(c.montantDemande)}
              </span>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
