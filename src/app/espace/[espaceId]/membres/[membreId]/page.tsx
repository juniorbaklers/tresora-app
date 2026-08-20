import { notFound } from "next/navigation";
import { Phone, Mail, CalendarDays } from "lucide-react";
import { PageContainer } from "@/components/app-shell/page-container";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PaiementStatutBadge } from "@/components/cotisations/statut-badge";
import { MEMBRES, getCotisations, getEspace, getMembre } from "@/lib/data";
import { formatDate, formatFCFA } from "@/lib/format";

export function generateStaticParams() {
  return Object.values(MEMBRES)
    .flat()
    .map((m) => ({ espaceId: m.espaceId, membreId: m.id }));
}

export default async function MembreDetailPage(props: PageProps<"/espace/[espaceId]/membres/[membreId]">) {
  const { espaceId, membreId } = await props.params;
  const espace = getEspace(espaceId);
  const membre = getMembre(espaceId, membreId);
  if (!espace || !membre) notFound();

  const cotisations = getCotisations(espaceId)
    .map((c) => ({ cotisation: c, paiement: c.paiements.find((p) => p.membreId === membreId) }))
    .filter((x) => x.paiement);

  return (
    <PageContainer className="max-w-3xl">
      <div className="mb-8 flex items-center gap-4">
        <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-primary text-lg font-medium text-primary-foreground">
          {membre.initiales}
        </span>
        <div>
          <h1 className="font-heading text-[26px] leading-tight">
            {membre.prenom} {membre.nom}
          </h1>
          <div className="mt-1 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
            {membre.fonction && <span>{membre.fonction}</span>}
            <Badge variant={membre.statut === "actif" ? "default" : "secondary"} className="font-normal">
              {membre.statut === "actif" ? "Actif" : "Inactif"}
            </Badge>
          </div>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Card className="ledger-card">
          <CardHeader>
            <CardTitle className="text-[15px] font-medium">Informations</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <p className="flex items-center gap-2.5">
              <Phone className="h-4 w-4 text-muted-foreground" /> <span className="font-tabular">{membre.telephone}</span>
            </p>
            {membre.email && (
              <p className="flex items-center gap-2.5">
                <Mail className="h-4 w-4 text-muted-foreground" /> {membre.email}
              </p>
            )}
            <p className="flex items-center gap-2.5">
              <CalendarDays className="h-4 w-4 text-muted-foreground" /> Inscrit le {formatDate(membre.dateInscription)}
            </p>
          </CardContent>
        </Card>

        <Card className="ledger-card">
          <CardHeader>
            <CardTitle className="text-[15px] font-medium">Historique financier</CardTitle>
          </CardHeader>
          <CardContent>
            {cotisations.length === 0 ? (
              <p className="text-sm text-muted-foreground">Aucune cotisation associée à ce membre.</p>
            ) : (
              <ul className="divide-y divide-ledger-line">
                {cotisations.map(({ cotisation, paiement }) => (
                  <li key={cotisation.id} className="flex items-center justify-between gap-3 py-2.5">
                    <div className="min-w-0">
                      <p className="truncate text-[13px] font-medium">{cotisation.nom}</p>
                      <p className="font-tabular text-xs text-muted-foreground">
                        {formatFCFA(paiement!.montantPaye)} / {formatFCFA(paiement!.montantDu)}
                      </p>
                    </div>
                    <PaiementStatutBadge statut={paiement!.statut} />
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>
    </PageContainer>
  );
}
