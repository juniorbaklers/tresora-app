import Link from "next/link";
import { AuthShell } from "@/components/auth/auth-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function ConnexionPage() {
  return (
    <AuthShell
      eyebrow="Bienvenue"
      title="Connexion à votre compte"
      subtitle="Retrouvez tous vos espaces : église, groupes et associations."
      footer={
        <>
          Pas encore de compte ?{" "}
          <Link href="/inscription" className="font-medium text-foreground underline underline-offset-4">
            Créer un compte
          </Link>
        </>
      }
    >
      <div className="space-y-5">
        <div className="space-y-2">
          <Label htmlFor="email">Adresse email</Label>
          <Input id="email" type="email" placeholder="vous@exemple.ci" defaultValue="jean.koffi@example.ci" required />
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="password">Mot de passe</Label>
            <Link href="/mot-de-passe-oublie" className="text-xs text-muted-foreground underline underline-offset-4">
              Mot de passe oublié ?
            </Link>
          </div>
          <Input id="password" type="password" placeholder="••••••••" defaultValue="demo1234" required />
        </div>
        <Button asChild className="w-full" size="lg">
          <Link href="/espaces">Se connecter</Link>
        </Button>
      </div>
    </AuthShell>
  );
}
