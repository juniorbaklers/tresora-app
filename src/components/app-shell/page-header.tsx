import type { ReactNode } from "react";
import { BandeTissee } from "@/components/brand/motif";

export function PageHeader({
  eyebrow,
  title,
  subtitle,
  action,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  action?: ReactNode;
}) {
  return (
    <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
      <div>
        <BandeTissee tonalite="or" className="mb-3.5 w-10" />
        {eyebrow && (
          <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-muted-foreground">{eyebrow}</p>
        )}
        <h1 className="mt-1.5 font-heading text-[30px] leading-[1.08] sm:text-[35px]">{title}</h1>
        {subtitle && <p className="mt-2 max-w-xl text-[14px] leading-relaxed text-muted-foreground">{subtitle}</p>}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}
