import { notFound } from "next/navigation";
import { ScrollText } from "lucide-react";
import { PageContainer } from "@/components/app-shell/page-container";
import { PageHeader } from "@/components/app-shell/page-header";
import { EmptyState } from "@/components/app-shell/empty-state";
import { getEspace, getJournal } from "@/lib/data";
import { formatDate } from "@/lib/format";

export default async function JournalPage(props: PageProps<"/espace/[espaceId]/journal">) {
  const { espaceId } = await props.params;
  const espace = getEspace(espaceId);
  if (!espace) notFound();

  const entrees = getJournal(espaceId);

  return (
    <PageContainer className="max-w-3xl">
      <PageHeader
        eyebrow={espace.nom}
        title="Journal d'activité"
        subtitle="Traçabilité complète des actions effectuées dans cet espace."
      />

      {entrees.length === 0 ? (
        <EmptyState icon={ScrollText} title="Aucune activité enregistrée" description="Les actions effectuées dans cet espace apparaîtront ici." />
      ) : (
        <ol className="relative space-y-6 border-l border-ledger-line pl-6">
          {entrees.map((e) => (
            <li key={e.id} className="relative">
              <span className="absolute -left-[27px] top-1 h-2.5 w-2.5 rounded-full border-2 border-background bg-gold" />
              <p className="text-xs text-muted-foreground">
                {formatDate(e.date)} — {e.heure}
              </p>
              <p className="mt-1 text-[14px] font-medium">
                {e.utilisateur} <span className="font-normal text-muted-foreground">— {e.role}</span>
              </p>
              <p className="mt-0.5 text-sm">{e.action}</p>
              {(e.ancienneValeur || e.nouvelleValeur) && (
                <div className="mt-2 flex flex-wrap items-center gap-2 text-xs">
                  {e.ancienneValeur && (
                    <span className="rounded-md bg-secondary px-2 py-1 font-tabular text-muted-foreground line-through decoration-muted-foreground/50">
                      {e.ancienneValeur}
                    </span>
                  )}
                  {e.nouvelleValeur && (
                    <span className="rounded-md bg-gold/15 px-2 py-1 font-tabular text-gold-foreground">{e.nouvelleValeur}</span>
                  )}
                </div>
              )}
            </li>
          ))}
        </ol>
      )}
    </PageContainer>
  );
}
