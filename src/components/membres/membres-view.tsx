"use client";

import Link from "next/link";
import { Plus, Users } from "lucide-react";
import { PageHeader } from "@/components/app-shell/page-header";
import { EmptyState } from "@/components/app-shell/empty-state";
import { MembresTable } from "@/components/membres/table";
import { Button } from "@/components/ui/button";
import { useMembres } from "@/lib/selecteurs";
import type { Espace } from "@/lib/types";

export function MembresView({ espace }: { espace: Espace }) {
  const membres = useMembres(espace.id);

  return (
    <>
      <PageHeader
        eyebrow={espace.nom}
        title="Membres"
        subtitle={`${membres.length} membres enregistrés dans cet espace.`}
        action={
          <Button asChild>
            <Link href={`/espace/${espace.id}/membres/nouveau`}>
              <Plus className="h-4 w-4" />
              Ajouter un membre
            </Link>
          </Button>
        }
      />

      {membres.length === 0 ? (
        <EmptyState icon={Users} title="Aucun membre pour le moment" description="Ajoutez votre premier membre pour commencer." />
      ) : (
        <MembresTable espaceId={espace.id} membres={membres} />
      )}
    </>
  );
}
