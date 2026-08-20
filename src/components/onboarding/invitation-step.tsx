"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Plus, X, UserPlus } from "lucide-react";
import { OnboardingShell } from "@/components/onboarding/onboarding-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface Invitation {
  email: string;
  role: string;
}

const ROLES = [
  { value: "administrateur", label: "Administrateur" },
  { value: "tresorier", label: "Trésorier" },
  { value: "responsable", label: "Responsable" },
  { value: "membre", label: "Membre" },
];

export function InvitationStep() {
  const searchParams = useSearchParams();
  const espaceId = searchParams.get("espaceId") ?? "emmaus";
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [role, setRole] = useState("tresorier");
  const [invitations, setInvitations] = useState<Invitation[]>([]);

  function ajouter() {
    const value = email.trim();
    if (!value || invitations.some((i) => i.email === value)) return;
    setInvitations((prev) => [...prev, { email: value, role }]);
    setEmail("");
  }

  function retirer(target: string) {
    setInvitations((prev) => prev.filter((i) => i.email !== target));
  }

  function continuer() {
    router.push(`/espace/${espaceId}/dashboard?bienvenue=1`);
  }

  return (
    <OnboardingShell
      etape={4}
      title="Invitez votre équipe"
      subtitle="Ajoutez les personnes qui géreront cet espace avec vous. Vous pourrez en inviter d'autres plus tard depuis les paramètres."
    >
      <div className="max-w-lg space-y-6">
        <div className="flex gap-2">
          <Input
            type="email"
            placeholder="email@exemple.ci"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), ajouter())}
            className="flex-1"
          />
          <Select value={role} onValueChange={setRole}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {ROLES.map((r) => (
                <SelectItem key={r.value} value={r.value}>
                  {r.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button type="button" variant="outline" onClick={ajouter}>
            <Plus className="h-4 w-4" />
          </Button>
        </div>

        {invitations.length > 0 && (
          <ul className="divide-y divide-ledger-line rounded-xl border border-border">
            {invitations.map((inv) => (
              <li key={inv.email} className="flex items-center justify-between gap-3 px-4 py-3">
                <div className="flex items-center gap-2.5">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-secondary text-muted-foreground">
                    <UserPlus className="h-4 w-4" strokeWidth={1.75} />
                  </span>
                  <div>
                    <p className="text-sm font-medium">{inv.email}</p>
                    <p className="text-xs text-muted-foreground">{ROLES.find((r) => r.value === inv.role)?.label}</p>
                  </div>
                </div>
                <button type="button" onClick={() => retirer(inv.email)} aria-label={`Retirer ${inv.email}`} className="text-muted-foreground hover:text-foreground">
                  <X className="h-4 w-4" />
                </button>
              </li>
            ))}
          </ul>
        )}

        <div className="flex items-center gap-4">
          <Button size="lg" onClick={continuer}>
            {invitations.length > 0 ? `Inviter ${invitations.length} personne${invitations.length > 1 ? "s" : ""} et continuer` : "Terminer"}
          </Button>
          {invitations.length === 0 && (
            <button type="button" onClick={continuer} className="text-sm text-muted-foreground underline underline-offset-4 hover:text-foreground">
              Passer cette étape
            </button>
          )}
        </div>
      </div>
    </OnboardingShell>
  );
}
