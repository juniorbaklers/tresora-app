import { notFound } from "next/navigation";
import { Check, X } from "lucide-react";
import { PageContainer } from "@/components/app-shell/page-container";
import { PageHeader } from "@/components/app-shell/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { getEspace, PERMISSIONS_LIST, ROLES } from "@/lib/data";

export default async function RolesPage(props: PageProps<"/espace/[espaceId]/roles">) {
  const { espaceId } = await props.params;
  const espace = getEspace(espaceId);
  if (!espace) notFound();

  return (
    <PageContainer className="max-w-4xl">
      <PageHeader
        eyebrow={espace.nom}
        title="Rôles et permissions"
        subtitle="Chaque rôle donne accès à un ensemble précis d'actions, propre à cet espace."
        action={
          <Button variant="outline" size="sm">
            Créer un rôle personnalisé
          </Button>
        }
      />

      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {ROLES.map((r) => (
          <Card key={r.role} className="ledger-card">
            <CardContent className="pt-2">
              <p className="font-heading text-[18px]">{r.label}</p>
              <p className="mt-1 text-sm text-muted-foreground">{r.description}</p>
              <p className="mt-3 text-xs text-muted-foreground">{r.permissions.length} permission{r.permissions.length > 1 ? "s" : ""}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="overflow-x-auto rounded-xl border border-border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Permission</TableHead>
              {ROLES.map((r) => (
                <TableHead key={r.role} className="text-center">
                  {r.label}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {PERMISSIONS_LIST.map((permission) => (
              <TableRow key={permission}>
                <TableCell className="font-medium">{permission}</TableCell>
                {ROLES.map((r) => (
                  <TableCell key={r.role} className="text-center">
                    {r.permissions.includes(permission) ? (
                      <Check className="mx-auto h-4 w-4 text-positive" />
                    ) : (
                      <X className="mx-auto h-4 w-4 text-muted-foreground/30" />
                    )}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </PageContainer>
  );
}
