import Link from "next/link";
import { Layers, HandCoins, ShieldCheck } from "lucide-react";
import { Logo } from "@/components/brand/logo";
import { EspaceStack } from "@/components/brand/espace-stack";
import { BandeTissee, TrameLosange } from "@/components/brand/motif";
import { Button } from "@/components/ui/button";

const POINTS_FORTS = [
  {
    icone: Layers,
    titre: "Un espace, une trésorerie",
    description: "Église, groupe, association : chaque espace garde ses finances séparées sous un même compte, sans jamais se mélanger.",
  },
  {
    icone: HandCoins,
    titre: "Cotisations sous contrôle",
    description: "Paiements échelonnés, rappels automatiques et statut de chaque membre en un coup d'œil.",
  },
  {
    icone: ShieldCheck,
    titre: "Une confiance totale",
    description: "Historique complet et corrections toujours tracées : plus jamais de doute sur un chiffre.",
  },
] as const;

export default function AccueilPage() {
  return (
    <div className="relative min-h-svh overflow-hidden bg-[var(--indigo-deep)]">
      <TrameLosange opacite={0.06} taille={64} />

      <header className="relative flex items-center justify-between px-6 py-6 sm:px-10">
        <Logo tone="dark" className="[&_span:last-child]:text-[#F6F1E7]" />
        <Button asChild variant="outline" className="border-white/15 bg-transparent text-[#F6F1E7] hover:bg-white/10 hover:text-[#F6F1E7]">
          <Link href="/connexion">Se connecter</Link>
        </Button>
      </header>

      <main className="relative mx-auto max-w-5xl px-6 pb-20 pt-6 sm:px-10 lg:pt-14">
        <div className="grid items-center gap-14 lg:grid-cols-[1.1fr_1fr]">
          <div className="animate-in fade-in slide-in-from-bottom-2 duration-700 fill-mode-both">
            <BandeTissee tonalite="mixte" className="mb-6 w-16" epaisseur={4} />
            <p className="text-xs font-medium uppercase tracking-[0.16em] text-gold-foreground/70">Gestion financière multi-espace</p>
            <h1 className="mt-3 font-heading text-[38px] leading-[1.08] text-[#F6F1E7] sm:text-[46px]">
              Toute la trésorerie de votre communauté, un espace à la fois.
            </h1>
            <p className="mt-5 max-w-md text-[15px] leading-relaxed text-[#9B937F]">
              Trésora organise cotisations, dépenses et rapports de votre église, vos groupes et vos associations dans des espaces
              totalement séparés, sous un seul compte.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Button asChild size="lg">
                <Link href="/espaces">Découvrir avec des données de démo</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-white/15 bg-transparent text-[#F6F1E7] hover:bg-white/10 hover:text-[#F6F1E7]">
                <Link href="/inscription">Créer un compte</Link>
              </Button>
            </div>
            <p className="mt-4 text-xs text-[#9B937F]">
              Aucune carte bancaire requise pour explorer la démo. Déjà un compte ?{" "}
              <Link href="/connexion" className="font-medium text-[#F6F1E7] underline underline-offset-4">
                Se connecter
              </Link>
            </p>
          </div>

          <div className="flex justify-center lg:justify-end">
            <EspaceStack />
          </div>
        </div>

        <div className="mt-20 grid gap-8 border-t border-white/10 pt-12 sm:grid-cols-3 sm:gap-6">
          {POINTS_FORTS.map((p, i) => (
            <div
              key={p.titre}
              className="animate-in fade-in slide-in-from-bottom-2 duration-700 fill-mode-both"
              style={{ animationDelay: `${150 + i * 90}ms` }}
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-gold/15 text-gold">
                <p.icone className="h-[18px] w-[18px]" strokeWidth={1.75} />
              </span>
              <p className="mt-4 font-heading text-[17px] text-[#F6F1E7]">{p.titre}</p>
              <p className="mt-1.5 text-sm leading-relaxed text-[#9B937F]">{p.description}</p>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
