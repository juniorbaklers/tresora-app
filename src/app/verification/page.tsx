import { AuthShell } from "@/components/auth/auth-shell";
import { VerificationForm } from "@/components/auth/verification-form";

export default function VerificationPage() {
  return (
    <AuthShell
      eyebrow="Dernière étape"
      title="Vérifiez votre adresse email"
      subtitle="Saisissez le code à 6 chiffres que nous venons de vous envoyer."
    >
      <VerificationForm email="jean.koffi@example.ci" />
    </AuthShell>
  );
}
