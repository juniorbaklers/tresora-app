import Link from "next/link";
import { Church, Users, Building2, Plus, ArrowRight } from "lucide-react";
import { OnboardingShell } from "@/components/onboarding/onboarding-shell";

const OPTIONS = [
  {
    type: "eglise",
    icon: Church,
    titre: "Une église",
    description: "Gérez la trésorerie : dîmes, offrandes, dépenses et rapports du dimanche.",
  },
  {
    type: "groupe",
    icon: Users,
    titre: "Un groupe",
    description: "Gérez la trésorerie, les cotisations et les événements de votre groupe.",
  },
  {
    type: "association",
    icon: Building2,
    titre: "Une association / organisation",
    description: "Gérez les finances et activités de votre organisation.",
  },
  {
    type: "autre",
    icon: Plus,
    titre: "Autre",
    description: "Créez un espace personnalisé, sans modèle imposé.",
  },
];

export default function OnboardingTypePage() {
  return (
    <OnboardingShell
      etape={1}
      title="Que souhaitez-vous gérer ?"
      subtitle="Vous ne créez que l'espace dont vous avez besoin. Vous pourrez en ajouter d'autres plus tard."
    >
      <div className="grid gap-4 sm:grid-cols-2">
        {OPTIONS.map((o) => (
          <Link
            key={o.type}
            href={`/onboarding/espace?type=${o.type}`}
            className="group flex flex-col gap-4 rounded-xl border border-border bg-card p-6 transition-colors hover:border-gold"
          >
            <div className="flex items-center justify-between">
              <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-secondary text-foreground">
                <o.icon className="h-5 w-5" strokeWidth={1.75} />
              </span>
              <ArrowRight className="h-4 w-4 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
            </div>
            <div>
              <p className="font-heading text-[19px]">{o.titre}</p>
              <p className="mt-1 text-sm text-muted-foreground">{o.description}</p>
            </div>
          </Link>
        ))}
      </div>
    </OnboardingShell>
  );
}
