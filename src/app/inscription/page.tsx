import Link from "next/link";
import { AuthShell } from "@/components/auth/auth-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function InscriptionPage() {
  return (
    <AuthShell
      eyebrow="Nouveau compte"
      title="Créez votre compte Trésora"
      subtitle="Une minute suffit. Vous choisirez ensuite ce que vous souhaitez gérer."
      footer={
        <>
          Déjà un compte ?{" "}
          <Link href="/connexion" className="font-medium text-foreground underline underline-offset-4">
            Se connecter
          </Link>
        </>
      }
    >
      <div className="space-y-5">
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-2">
            <Label htmlFor="prenom">Prénom</Label>
            <Input id="prenom" placeholder="Jean" defaultValue="Jean" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="nom">Nom</Label>
            <Input id="nom" placeholder="Koffi" defaultValue="Koffi" required />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Adresse email</Label>
          <Input id="email" type="email" placeholder="vous@exemple.ci" required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">Mot de passe</Label>
          <Input id="password" type="password" placeholder="8 caractères minimum" required />
        </div>
        <Button asChild className="w-full" size="lg">
          <Link href="/onboarding/type">Créer mon compte</Link>
        </Button>
        <p className="text-center text-xs text-muted-foreground">
          En continuant, vous acceptez les conditions d&apos;utilisation et la politique de confidentialité.
        </p>
      </div>
    </AuthShell>
  );
}
