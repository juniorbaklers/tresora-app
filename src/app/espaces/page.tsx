import Link from "next/link";
import { Plus, ArrowRight, Church, Users2 } from "lucide-react";
import { Logo } from "@/components/brand/logo";
import { BandeTissee } from "@/components/brand/motif";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ESPACES, MES_ESPACES_IDS, UTILISATEUR, soldeActuel } from "@/lib/data";
import { formatFCFA } from "@/lib/format";

const ROLE_LABELS: Record<string, string> = {
  proprietaire: "Propriétaire",
  administrateur: "Administrateur",
  tresorier: "Trésorier",
  responsable: "Responsable",
  membre: "Membre",
};

export default function EspacesPage() {
  const espaces = ESPACES.filter((e) => MES_ESPACES_IDS.includes(e.id));

  return (
    <div className="min-h-svh bg-background">
      <header className="border-b border-border">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-5">
          <Logo />
          <Avatar className="h-9 w-9">
            <AvatarFallback className="bg-primary text-primary-foreground text-xs">{UTILISATEUR.initiales}</AvatarFallback>
          </Avatar>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-6 py-14">
        <BandeTissee tonalite="mixte" className="mb-5 w-16" epaisseur={4} />
        <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-muted-foreground">
          Bonjour {UTILISATEUR.nom.split(" ")[0]} 👋
        </p>
        <h1 className="mt-2 font-heading text-[38px] leading-[1.05]">Vos espaces</h1>
        <p className="mt-3 max-w-xl text-[15px] leading-relaxed text-muted-foreground">
          Chaque espace a ses propres finances, ses membres et ses permissions. Choisissez celui que vous souhaitez gérer.
        </p>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {espaces.map((e) => (
            <Link
              key={e.id}
              href={`/espace/${e.id}/dashboard`}
              className="group flex flex-col justify-between overflow-hidden rounded-xl border border-border bg-card transition-colors hover:border-gold"
            >
              <BandeTissee tonalite={e.type === "eglise" ? "mixte" : "or"} className="rounded-none" epaisseur={4} />
              <div className="flex flex-1 flex-col justify-between p-6">
                <div>
                  <div className="flex items-center justify-between">
                    <span className={`flex h-11 w-11 items-center justify-center rounded-lg text-sm font-semibold text-white ${e.couleur}`}>
                      {e.initiales}
                    </span>
                    <ArrowRight className="h-4 w-4 text-muted-foreground transition-all group-hover:translate-x-0.5 group-hover:text-gold-foreground" />
                  </div>
                  <p className="mt-4 font-heading text-[21px] leading-tight">{e.nom}</p>
                  <p className="mt-1.5 flex items-center gap-1.5 text-xs text-muted-foreground">
                    {e.type === "eglise" ? <Church className="h-3.5 w-3.5" /> : <Users2 className="h-3.5 w-3.5" />}
                    {e.membresCount} membres
                  </p>
                </div>
                <div className="mt-6 flex items-center justify-between border-t border-ledger-line pt-4">
                  <Badge variant="secondary">{ROLE_LABELS[e.role]}</Badge>
                  <span className="font-tabular text-sm">{formatFCFA(soldeActuel(e.id))}</span>
                </div>
              </div>
            </Link>
          ))}

          <Link
            href="/onboarding/type"
            className="flex min-h-[188px] flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-border text-muted-foreground transition-colors hover:border-gold hover:text-foreground"
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary">
              <Plus className="h-5 w-5" />
            </span>
            <span className="text-sm font-medium">Créer un nouvel espace</span>
          </Link>
        </div>
      </main>
    </div>
  );
}
