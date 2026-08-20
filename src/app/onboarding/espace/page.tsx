import { OnboardingShell } from "@/components/onboarding/onboarding-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";

const LIBELLES: Record<string, string> = {
  eglise: "église",
  groupe: "groupe",
  association: "association ou organisation",
  autre: "espace",
};

const SUGGESTIONS: Record<string, string[]> = {
  eglise: ["Église Emmanuel", "Assemblée de la Grâce"],
  groupe: ["Disciples d'Emmaüs", "Servantes de Béthanie", "Hommes de Galilée"],
  association: ["Association des jeunes leaders"],
  autre: ["Mon espace"],
};

export default async function OnboardingEspacePage({
  searchParams,
}: {
  searchParams: Promise<{ type?: string }>;
}) {
  const { type = "groupe" } = await searchParams;
  const libelle = LIBELLES[type] ?? LIBELLES.autre;
  const suggestions = SUGGESTIONS[type] ?? SUGGESTIONS.autre;

  return (
    <OnboardingShell
      etape={2}
      title={`Quel est le nom de votre ${libelle} ?`}
      subtitle="Ce nom sera visible par tous les membres invités dans cet espace."
    >
      <div className="max-w-md space-y-6">
        <div className="space-y-2">
          <Label htmlFor="nom-espace">Nom de l&apos;espace</Label>
          <Input id="nom-espace" placeholder={suggestions[0]} defaultValue={suggestions[0]} autoFocus />
          <p className="text-xs text-muted-foreground">
            Exemple{suggestions.length > 1 ? "s" : ""} : {suggestions.join(", ")}
          </p>
        </div>
        <Button asChild size="lg">
          <Link href={`/onboarding/modules?type=${type}`}>Continuer</Link>
        </Button>
      </div>
    </OnboardingShell>
  );
}
