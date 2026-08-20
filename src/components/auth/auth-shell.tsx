import { Logo } from "@/components/brand/logo";
import { EspaceStack } from "@/components/brand/espace-stack";
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
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="relative hidden flex-col justify-between overflow-hidden bg-[#0F1B2D] p-12 lg:flex">
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.05]"
          style={{
            backgroundImage:
              "repeating-linear-gradient(0deg, transparent, transparent 27px, #FFFFFF 28px)",
          }}
        />
        <Logo tone="dark" className="[&_span:last-child]:text-[#F5F6F3]" />
        <EspaceStack />
        <div className="max-w-sm">
          <p className="font-heading text-[26px] italic leading-snug text-[#F5F6F3]">
            « Chaque espace gère sa trésorerie. Vous ne voyez que ce qui vous concerne. »
          </p>
          <p className="mt-4 text-sm text-[#8A93A3]">
            Église, groupe, association : un même compte, des finances toujours séparées.
          </p>
        </div>
      </div>

      <div className="flex flex-col justify-center px-6 py-12 sm:px-12 lg:px-20">
        <div className="mx-auto w-full max-w-sm">
          <div className="mb-10 lg:hidden">
            <Logo />
          </div>
          <p className="text-xs font-medium uppercase tracking-[0.14em] text-gold">{eyebrow}</p>
          <h1 className="mt-2 font-heading text-[32px] leading-tight">{title}</h1>
          <p className="mt-2 text-sm text-muted-foreground">{subtitle}</p>
          <div className="mt-8">{children}</div>
          {footer && <div className="mt-8 text-sm text-muted-foreground">{footer}</div>}
        </div>
      </div>
    </div>
  );
}
