"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { Layers, HandCoins, ShieldCheck, ChevronRight } from "lucide-react";
import { LogoMark } from "@/components/brand/logo";
import { BandeTissee, TrameLosange } from "@/components/brand/motif";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Diapo = {
  icone?: typeof Layers;
  titre: string;
  description: string;
};

const DIAPOS: Diapo[] = [
  {
    titre: "Trésora",
    description: "Gérez votre trésorerie simplement.",
  },
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
];

const SEUIL_GLISSEMENT = 45;

export function AccueilCarousel() {
  const [index, setIndex] = useState(0);
  const debut = useRef<number | null>(null);
  const derniere = DIAPOS.length - 1;

  function aller(cible: number) {
    setIndex(Math.max(0, Math.min(derniere, cible)));
  }

  function onTouchStart(e: React.TouchEvent) {
    debut.current = e.touches[0]!.clientX;
  }

  function onTouchEnd(e: React.TouchEvent) {
    if (debut.current === null) return;
    const delta = e.changedTouches[0]!.clientX - debut.current;
    debut.current = null;
    if (delta > SEUIL_GLISSEMENT) aller(index - 1);
    else if (delta < -SEUIL_GLISSEMENT) aller(index + 1);
  }

  function onKeyDown(e: React.KeyboardEvent) {
    if (e.key === "ArrowRight") aller(index + 1);
    if (e.key === "ArrowLeft") aller(index - 1);
  }

  return (
    <div
      className="relative flex h-svh flex-col overflow-hidden bg-[var(--indigo-deep)] outline-none"
      tabIndex={0}
      onKeyDown={onKeyDown}
    >
      <TrameLosange opacite={0.05} taille={64} />
      <div
        className="absolute inset-0 -z-0"
        style={{ background: "radial-gradient(circle at 50% 38%, rgba(200,138,46,0.16), transparent 60%)" }}
        aria-hidden
      />

      <div
        className="relative flex flex-1 touch-pan-y overflow-hidden"
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        <div
          className="flex h-full w-full transition-transform duration-[400ms] ease-out"
          style={{ transform: `translateX(-${index * 100}%)` }}
        >
          {DIAPOS.map((d, i) => (
            <div key={d.titre} className="flex h-full w-full shrink-0 flex-col items-center justify-center px-8 text-center">
              {i === 0 ? (
                <div className="relative mb-8">
                  <div className="absolute inset-0 scale-150 rounded-[28px] bg-gold/30 blur-2xl" aria-hidden />
                  <LogoMark
                    size={104}
                    className="relative shadow-[0_24px_60px_-12px_rgba(200,138,46,0.55)]"
                  />
                </div>
              ) : (
                <span className="mb-7 flex h-16 w-16 items-center justify-center rounded-2xl bg-gold/15 text-gold">
                  {d.icone && <d.icone className="h-7 w-7" strokeWidth={1.75} />}
                </span>
              )}

              <h1 className={cn("font-heading text-[#F6F1E7]", i === 0 ? "text-[30px] tracking-tight" : "text-[24px] leading-tight")}>
                {d.titre}
              </h1>
              <BandeTissee tonalite="or" className="my-5 w-14" epaisseur={3} />
              <p className="max-w-[280px] text-[15px] leading-relaxed text-[#9B937F]">{d.description}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="relative flex flex-col items-center gap-7 px-8 pb-10 pt-2">
        <div className="flex items-center gap-2">
          {DIAPOS.map((d, i) => (
            <button
              key={d.titre}
              type="button"
              aria-label={`Aller à l'écran ${i + 1}`}
              onClick={() => aller(i)}
              className={cn(
                "h-1.5 rounded-full transition-all",
                i === index ? "w-6 bg-gold" : "w-1.5 bg-white/20 hover:bg-white/35"
              )}
            />
          ))}
        </div>

        {index < derniere ? (
          <div className="flex w-full max-w-xs items-center justify-between">
            <Link href="/espaces" className="text-sm text-[#9B937F] underline underline-offset-4 hover:text-[#F6F1E7]">
              Passer
            </Link>
            <button
              type="button"
              onClick={() => aller(index + 1)}
              aria-label="Écran suivant"
              className="flex h-11 w-11 items-center justify-center rounded-full bg-gold text-gold-foreground transition-transform hover:scale-105"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        ) : (
          <div className="w-full max-w-xs space-y-3">
            <Button asChild size="lg" className="w-full">
              <Link href="/espaces">Découvrir avec des données de démo</Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="w-full border-white/15 bg-transparent text-[#F6F1E7] hover:bg-white/10 hover:text-[#F6F1E7]"
            >
              <Link href="/inscription">Créer un compte</Link>
            </Button>
            <p className="pt-1 text-center text-xs text-[#9B937F]">
              Déjà un compte ?{" "}
              <Link href="/connexion" className="font-medium text-[#F6F1E7] underline underline-offset-4">
                Se connecter
              </Link>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
