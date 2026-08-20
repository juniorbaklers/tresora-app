import { cn } from "@/lib/utils";

export function Logo({ className, tone = "dark" }: { className?: string; tone?: "dark" | "light" }) {
  return (
    <span className={cn("inline-flex items-center gap-2", className)}>
      <span
        className={cn(
          "flex h-7 w-7 items-center justify-center rounded-[6px] text-[13px] font-semibold",
          tone === "dark" ? "bg-gold text-gold-foreground" : "bg-primary text-primary-foreground"
        )}
      >
        T
      </span>
      <span className="font-heading text-[22px] leading-none tracking-tight">Trésora</span>
    </span>
  );
}
