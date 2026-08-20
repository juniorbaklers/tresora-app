"use client";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { formatFCFA } from "@/lib/format";

const axisStyle = { fontSize: 11, fill: "var(--muted-foreground)" };

function CustomTooltip({ active, payload, label }: { active?: boolean; payload?: { name: string; value: number; color: string }[]; label?: string }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border border-border bg-popover px-3 py-2 text-xs shadow-md">
      {label && <p className="mb-1 font-medium text-popover-foreground">{label}</p>}
      {payload.map((p) => (
        <p key={p.name} className="flex items-center gap-1.5 text-muted-foreground">
          <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: p.color }} />
          {p.name} : <span className="font-tabular text-popover-foreground">{formatFCFA(p.value)}</span>
        </p>
      ))}
    </div>
  );
}

export function RecettesDepensesChart({ data }: { data: { semaine: string; recettes: number; depenses: number }[] }) {
  return (
    <ResponsiveContainer width="100%" height={220}>
      <BarChart data={data} barGap={6}>
        <CartesianGrid vertical={false} stroke="var(--ledger-line)" />
        <XAxis dataKey="semaine" tickLine={false} axisLine={false} tick={axisStyle} />
        <YAxis tickLine={false} axisLine={false} tick={axisStyle} width={40} tickFormatter={(v) => `${v / 1000}k`} />
        <Tooltip content={<CustomTooltip />} cursor={{ fill: "var(--muted)" }} />
        <Bar dataKey="recettes" name="Recettes" fill="var(--positive)" radius={[4, 4, 0, 0]} maxBarSize={28} />
        <Bar dataKey="depenses" name="Dépenses" fill="var(--destructive)" radius={[4, 4, 0, 0]} maxBarSize={28} />
      </BarChart>
    </ResponsiveContainer>
  );
}

export function SoldeChart({ data }: { data: { semaine: string; solde: number }[] }) {
  return (
    <ResponsiveContainer width="100%" height={220}>
      <AreaChart data={data}>
        <defs>
          <linearGradient id="soldeGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--gold)" stopOpacity={0.35} />
            <stop offset="100%" stopColor="var(--gold)" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid vertical={false} stroke="var(--ledger-line)" />
        <XAxis dataKey="semaine" tickLine={false} axisLine={false} tick={axisStyle} />
        <YAxis tickLine={false} axisLine={false} tick={axisStyle} width={44} tickFormatter={(v) => `${v / 1000}k`} />
        <Tooltip content={<CustomTooltip />} />
        <Area type="monotone" dataKey="solde" name="Solde" stroke="var(--gold)" strokeWidth={2} fill="url(#soldeGradient)" />
      </AreaChart>
    </ResponsiveContainer>
  );
}

export function RepartitionChart({ data }: { data: { label: string; montant: number; couleur: string }[] }) {
  const total = data.reduce((s, d) => s + d.montant, 0);
  return (
    <div className="flex flex-col items-center gap-4 sm:flex-row">
      <div className="relative shrink-0">
        <ResponsiveContainer width={160} height={160}>
          <PieChart>
            <Pie data={data} dataKey="montant" nameKey="label" innerRadius={52} outerRadius={72} paddingAngle={2} stroke="none">
              {data.map((d) => (
                <Cell key={d.label} fill={d.couleur} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
          <span className="font-tabular text-[13px] font-medium">{formatFCFA(total)}</span>
          <span className="text-[10px] text-muted-foreground">total</span>
        </div>
      </div>
      <ul className="min-w-0 flex-1 space-y-2">
        {data.map((d) => (
          <li key={d.label} className="flex items-center justify-between gap-3 text-xs">
            <span className="flex min-w-0 items-center gap-2 text-muted-foreground">
              <span className="h-2 w-2 shrink-0 rounded-full" style={{ backgroundColor: d.couleur }} />
              <span className="truncate">{d.label}</span>
            </span>
            <span className="shrink-0 font-tabular text-foreground">{formatFCFA(d.montant)}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
