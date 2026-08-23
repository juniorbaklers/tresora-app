export function formatFCFA(montant: number): string {
  return `${new Intl.NumberFormat("fr-FR").format(Math.round(montant))} FCFA`;
}

export function formatDate(iso: string): string {
  return new Intl.DateTimeFormat("fr-FR", { day: "2-digit", month: "long", year: "numeric" }).format(new Date(iso));
}

export function formatDateCourte(iso: string): string {
  return new Intl.DateTimeFormat("fr-FR", { day: "2-digit", month: "short" }).format(new Date(iso));
}

export function pct(part: number, total: number): number {
  if (total <= 0) return 0;
  return Math.round((part / total) * 100);
}

export function initialesDeNom(nom: string): string {
  const mots = nom.trim().split(/\s+/).filter(Boolean);
  const initiales = mots.slice(0, 2).map((m) => m[0]);
  return initiales.join("").toUpperCase() || "?";
}
