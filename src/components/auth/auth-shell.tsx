import { Logo } from "@/components/brand/logo";
import { EspaceStack } from "@/components/brand/espace-stack";
import { BandeTissee, TrameLosange } from "@/components/brand/motif";
import type { ReactNode } from "react";

export function AuthShell({
  eyebrow,
  title,
  subtitle,
  children,
  footer,
}: {
  eyebrow: string;
  title: string;
  subtitle: string;
  children: ReactNode;
  footer?: ReactNode;
}) {
  return (
    <div className="grid min-h-svh lg:grid-cols-[1.05fr_1fr]">
      <div className="relative hidden flex-col justify-between overflow-hidden bg-[var(--indigo-deep)] p-12 lg:flex">
        <TrameLosange opacite={0.09} taille={56} />
        <div className="relative">
          <Logo tone="dark" className="[&_span:last-child]:text-[#F6F1E7]" />
        </div>
        <div className="relative">
          <EspaceStack />
        </div>
        <div className="relative max-w-sm">
          <BandeTissee tonalite="mixte" className="mb-6 w-24" epaisseur={4} />
          <p className="font-heading text-[27px] italic leading-snug text-[#F6F1E7]">
            « Chaque espace gère sa trésorerie. Vous ne voyez que ce qui vous concerne. »
          </p>
          <p className="mt-4 text-sm text-[#9B937F]">
            Église, groupe, association : un même compte, des finances toujours séparées.
          </p>
        </div>
      </div>

      <div className="flex flex-col justify-center px-6 py-12 sm:px-12 lg:px-20">
        <div className="mx-auto w-full max-w-sm">
          <div className="mb-10 lg:hidden">
            <Logo tone="light" />
          </div>
          <BandeTissee tonalite="or" className="mb-5 w-12" />
          <p className="text-xs font-medium uppercase tracking-[0.16em] text-gold-foreground/70">{eyebrow}</p>
          <h1 className="mt-2 font-heading text-[35px] leading-[1.05]">{title}</h1>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{subtitle}</p>
          <div className="mt-8">{children}</div>
          {footer && <div className="mt-8 text-sm text-muted-foreground">{footer}</div>}
        </div>
      </div>
    </div>
  );
}
