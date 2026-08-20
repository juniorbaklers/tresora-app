"use client";

import { useSearchParams } from "next/navigation";
import { OnboardingShell } from "@/components/onboarding/onboarding-shell";
import { ModulesForm } from "@/components/onboarding/modules-form";

export function ModulesStep() {
  const searchParams = useSearchParams();
  const type = searchParams.get("type") ?? "groupe";
  const espaceId = type === "eglise" ? "eglise" : "emmaus";

  return (
    <OnboardingShell
      etape={3}
      title="Que souhaitez-vous activer ?"
      subtitle="Sélectionnez uniquement les fonctionnalités dont vous avez besoin aujourd'hui. Vous pourrez en activer d'autres plus tard, sans recréer votre espace."
    >
      <ModulesForm type={type} espaceId={espaceId} />
    </OnboardingShell>
  );
}
