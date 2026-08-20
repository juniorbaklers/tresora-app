import { Suspense } from "react";
import { ModulesStep } from "@/components/onboarding/modules-step";

export default function OnboardingModulesPage() {
  return (
    <Suspense>
      <ModulesStep />
    </Suspense>
  );
}
