import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Logo } from "@/components/brand/logo";
import { CompteMenu } from "@/components/app-shell/compte-menu";
import { CompteForm } from "@/components/compte/compte-form";

export default function ComptePage() {
  return (
    <div className="min-h-svh bg-background">
      <header className="border-b border-border">
        <div className="mx-auto flex max-w-2xl items-center justify-between px-6 py-5">
          <Link href="/espaces" aria-label="Accueil Trésora">
            <Logo />
          </Link>
          <CompteMenu />
        </div>
      </header>

      <main className="mx-auto max-w-2xl px-6 py-10">
        <Link href="/espaces" className="mb-6 flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4" />
          Retour à mes espaces
        </Link>

        <h1 className="font-heading text-[30px] leading-tight">Mon compte</h1>
        <p className="mt-1 text-[15px] text-muted-foreground">Informations personnelles, mot de passe et sécurité.</p>

        <div className="mt-8">
          <CompteForm />
        </div>
      </main>
    </div>
  );
}
