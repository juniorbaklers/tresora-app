import { AuthShell } from "@/components/auth/auth-shell";
import { MotDePasseOublieForm } from "@/components/auth/mot-de-passe-oublie-form";

export default function MotDePasseOubliePage() {
  return (
    <AuthShell
      eyebrow="Sécurité"
      title="Mot de passe oublié"
      subtitle="Indiquez votre adresse email, nous vous envoyons un lien pour en choisir un nouveau."
    >
      <MotDePasseOublieForm />
    </AuthShell>
  );
}
