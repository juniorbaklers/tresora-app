import { Suspense } from "react";
import { InvitationStep } from "@/components/onboarding/invitation-step";

export default function OnboardingInvitationPage() {
  return (
    <Suspense>
      <InvitationStep />
    </Suspense>
  );
}
