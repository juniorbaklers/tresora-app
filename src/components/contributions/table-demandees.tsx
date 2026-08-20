import Link from "next/link";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import { ContributionStatutBadge } from "@/components/contributions/statut-badge";
import { getEspace } from "@/lib/data";
import { formatFCFA, pct } from "@/lib/format";
import type { Contribution } from "@/lib/types";

export function TableContributionsDemandees({ espaceId, contributions }: { espaceId: string; contributions: Contribution[] }) {
  return (
    <div className="overflow-x-auto rounded-xl border border-border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Espace</TableHead>
            <TableHead>Progression</TableHead>
            <TableHead className="text-right">Demandé</TableHead>
            <TableHead className="text-right">Reçu</TableHead>
            <TableHead className="text-right">Reste</TableHead>
            <TableHead>Statut</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {contributions.map((c) => {
            const cible = getEspace(c.espaceCibleId);
            return (
              <TableRow key={c.id} className="cursor-pointer">
                <TableCell>
                  <Link href={`/espace/${espaceId}/contributions/${c.id}`} className="flex items-center gap-2.5">
                    {cible && (
                      <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded text-[10px] font-semibold text-white ${cible.couleur}`}>
                        {cible.initiales}
                      </span>
                    )}
                    <span className="font-medium">{cible?.nom}</span>
                  </Link>
                </TableCell>
                <TableCell className="min-w-[140px]">
                  <div className="flex items-center gap-2">
                    <Progress value={pct(c.montantRecu, c.montantDemande)} className="h-1.5 w-24" />
                    <span className="font-tabular text-xs text-muted-foreground">{pct(c.montantRecu, c.montantDemande)}%</span>
                  </div>
                </TableCell>
                <TableCell className="text-right font-tabular">{formatFCFA(c.montantDemande)}</TableCell>
                <TableCell className="text-right font-tabular text-positive">{formatFCFA(c.montantRecu)}</TableCell>
                <TableCell className="text-right font-tabular">{formatFCFA(c.montantDemande - c.montantRecu)}</TableCell>
                <TableCell>
                  <ContributionStatutBadge statut={c.statut} />
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
