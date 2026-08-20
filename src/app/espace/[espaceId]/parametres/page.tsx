import Link from "next/link";
import { notFound } from "next/navigation";
import { ShieldCheck, ScrollText, ChevronRight } from "lucide-react";
import { PageContainer } from "@/components/app-shell/page-container";
import { PageHeader } from "@/components/app-shell/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getEspace } from "@/lib/data";

const MODULE_LABELS: Record<string, string> = {
  membres: "Membres",
  cotisations: "Cotisations",
  evenements: "Événements",
  recettes: "Recettes",
  depenses: "Dépenses",
  rapports: "Rapports",
  dimes: "Dîmes",
  offrandes: "Offrandes",
  dons: "Dons",
  contributions: "Contributions inter-espaces",
};

const ROLES = [
  { nom: "Jean Koffi", role: "Trésorier", email: "jean.koffi@example.ci" },
  { nom: "Marie Kouassi", role: "Responsable", email: "marie.kouassi@example.ci" },
  { nom: "Paul Bakayoko", role: "Membre", email: "paul.bakayoko@example.ci" },
];

export default async function ParametresPage(props: PageProps<"/espace/[espaceId]/parametres">) {
  const { espaceId } = await props.params;
  const espace = getEspace(espaceId);
  if (!espace) notFound();

  return (
    <PageContainer className="max-w-2xl">
      <PageHeader eyebrow="Paramètres" title={espace.nom} subtitle="Informations générales, modules activés et utilisateurs de cet espace." />

      <Card className="ledger-card mb-6">
        <CardHeader>
          <CardTitle className="text-[15px] font-medium">Informations générales</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="nom">Nom de l&apos;espace</Label>
            <Input id="nom" defaultValue={espace.nom} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="devise">Devise</Label>
            <Input id="devise" defaultValue="FCFA — XOF" disabled />
          </div>
          <Button size="sm">Enregistrer</Button>
        </CardContent>
      </Card>

      <Card className="ledger-card mb-6">
        <CardHeader>
          <CardTitle className="text-[15px] font-medium">Modules activés</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {espace.modules.map((m) => (
              <Badge key={m} variant="secondary" className="font-normal">
                {MODULE_LABELS[m]}
              </Badge>
            ))}
          </div>
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
          <Button variant="outline" size="sm" className="mt-4">
            Inviter un utilisateur
          </Button>
        </CardContent>
      </Card>

      <Card className="ledger-card mt-6">
        <CardHeader>
          <CardTitle className="text-[15px] font-medium">Administration</CardTitle>
        </CardHeader>
        <CardContent className="space-y-1">
          <Link
            href={`/espace/${espaceId}/roles`}
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
            href={`/espace/${espaceId}/journal`}
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
    </PageContainer>
  );
}
