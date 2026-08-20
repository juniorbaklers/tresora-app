import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export function StatCard({
  label,
  value,
  icon: Icon,
  sub,
  accent = "neutral",
}: {
  label: string;
  value: string;
  icon: LucideIcon;
  sub?: string;
  accent?: "neutral" | "positive" | "negative" | "gold";
}) {
  const barColor = {
    neutral: "bg-primary",
    positive: "bg-positive",
    negative: "bg-destructive",
    gold: "bg-gold",
  }[accent];

  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <div className={cn("mb-4 h-[3px] w-8 rounded-full", barColor)} />
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="text-xs text-muted-foreground">{label}</p>
          <p className="mt-1.5 font-tabular text-[22px] font-medium leading-none">{value}</p>
          {sub && <p className="mt-2 text-xs text-muted-foreground">{sub}</p>}
        </div>
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-secondary text-muted-foreground">
          <Icon className="h-4 w-4" strokeWidth={1.75} />
        </span>
      </div>
    </div>
  );
}
