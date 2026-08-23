"use client";

import Link from "next/link";
import { ShieldCheck, ScrollText, ChevronRight, Mail } from "lucide-react";
import { PageHeader } from "@/components/app-shell/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { InformationsGeneralesForm } from "@/components/parametres/informations-form";
import { ModulesForm } from "@/components/parametres/modules-form";
import { InviterDialog } from "@/components/parametres/inviter-dialog";
import { useEspaceEffectif, useInvitations } from "@/lib/selecteurs";
import { formatDate } from "@/lib/format";
import type { Espace } from "@/lib/types";

const ROLES = [
  { nom: "Jean Koffi", role: "Trésorier", email: "jean.koffi@example.ci" },
  { nom: "Marie Kouassi", role: "Responsable", email: "marie.kouassi@example.ci" },
  { nom: "Paul Bakayoko", role: "Membre", email: "paul.bakayoko@example.ci" },
];

export function ParametresView({ espace: espaceBase }: { espace: Espace }) {
  const espace = useEspaceEffectif(espaceBase);
  const invitations = useInvitations(espace.id);

  return (
    <>
      <PageHeader eyebrow="Paramètres" title={espace.nom} subtitle="Informations générales, modules activés et utilisateurs de cet espace." />

      <Card className="ledger-card mb-6">
        <CardHeader>
          <CardTitle className="text-[15px] font-medium">Informations générales</CardTitle>
        </CardHeader>
        <CardContent>
          <InformationsGeneralesForm espaceId={espace.id} nom={espace.nom} devise={espace.devise} />
        </CardContent>
      </Card>

      <Card className="ledger-card mb-6">
        <CardHeader>
          <CardTitle className="text-[15px] font-medium">Modules activés</CardTitle>
        </CardHeader>
        <CardContent>
          <ModulesForm espaceId={espace.id} modules={espace.modules} />
          <p className="mt-3 text-xs text-muted-foreground">
            Activez ou retirez des modules à tout moment, sans perdre vos données existantes.
          </p>
        </CardContent>
      </Card>

      <Card className="ledger-card">
        <CardHeader>
          <CardTitle className="text-[15px] font-medium">Utilisateurs et rôles</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="divide-y divide-ledger-line">
            {ROLES.map((r) => (
              <li key={r.email} className="flex items-center justify-between py-2.5">
                <div>
                  <p className="text-sm font-medium">{r.nom}</p>
                  <p className="text-xs text-muted-foreground">{r.email}</p>
                </div>
                <Badge variant="outline" className="font-normal">
                  {r.role}
                </Badge>
              </li>
            ))}
          </ul>

          {invitations.length > 0 && (
            <div className="mt-4 space-y-1.5">
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Invitations en attente</p>
              <ul className="divide-y divide-ledger-line">
                {invitations.map((inv) => (
                  <li key={inv.id} className="flex items-center justify-between py-2">
                    <span className="flex items-center gap-2 text-sm">
                      <Mail className="h-3.5 w-3.5 text-muted-foreground" />
                      {inv.email}
                    </span>
                    <span className="text-xs text-muted-foreground">Envoyée le {formatDate(inv.date)}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <InviterDialog espaceId={espace.id} />
        </CardContent>
      </Card>

      <Card className="ledger-card mt-6">
        <CardHeader>
          <CardTitle className="text-[15px] font-medium">Administration</CardTitle>
        </CardHeader>
        <CardContent className="space-y-1">
          <Link
            href={`/espace/${espace.id}/roles`}
            className="flex items-center gap-3 rounded-lg px-2 py-2.5 transition-colors hover:bg-secondary"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-secondary text-muted-foreground">
              <ShieldCheck className="h-4 w-4" strokeWidth={1.75} />
            </span>
            <span className="flex-1">
              <span className="block text-sm font-medium">Rôles et permissions</span>
              <span className="block text-xs text-muted-foreground">Voir ce que chaque rôle peut faire dans cet espace</span>
            </span>
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
          </Link>
          <Link
            href={`/espace/${espace.id}/journal`}
            className="flex items-center gap-3 rounded-lg px-2 py-2.5 transition-colors hover:bg-secondary"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-secondary text-muted-foreground">
              <ScrollText className="h-4 w-4" strokeWidth={1.75} />
            </span>
            <span className="flex-1">
              <span className="block text-sm font-medium">Journal d&apos;activité</span>
              <span className="block text-xs text-muted-foreground">Historique des actions effectuées dans cet espace</span>
            </span>
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
          </Link>
        </CardContent>
      </Card>
    </>
  );
}
