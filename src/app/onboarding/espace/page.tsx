import { Suspense } from "react";
import { EspaceStep } from "@/components/onboarding/espace-step";

export default function OnboardingEspacePage() {
  return (
    <Suspense>
      <EspaceStep />
    </Suspense>
  );
}
