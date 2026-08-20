"use client";

import { useState } from "react";
import Link from "next/link";
import { MailCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function MotDePasseOublieForm() {
  const [email, setEmail] = useState("jean.koffi@example.ci");
  const [envoye, setEnvoye] = useState(false);

  if (envoye) {
    return (
      <div className="space-y-5 text-center">
        <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-positive/10 text-positive">
          <MailCheck className="h-5 w-5" />
        </span>
        <div>
          <p className="text-sm font-medium">Email envoyé</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Si un compte existe pour <span className="font-medium text-foreground">{email}</span>, un lien de réinitialisation vient de lui être envoyé.
          </p>
        </div>
        <Button variant="outline" className="w-full" onClick={() => setEnvoye(false)}>
          Renvoyer l&apos;email
        </Button>
      </div>
    );
  }

  return (
    <form
      className="space-y-5"
      onSubmit={(e) => {
        e.preventDefault();
        setEnvoye(true);
      }}
    >
      <div className="space-y-2">
        <Label htmlFor="email">Adresse email</Label>
        <Input id="email" type="email" placeholder="vous@exemple.ci" value={email} onChange={(e) => setEmail(e.target.value)} required />
      </div>
      <Button type="submit" className="w-full" size="lg">
        Envoyer le lien de réinitialisation
      </Button>
      <p className="text-center text-sm text-muted-foreground">
        <Link href="/connexion" className="font-medium text-foreground underline underline-offset-4">
          Retour à la connexion
        </Link>
      </p>
    </form>
  );
}
