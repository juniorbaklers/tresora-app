"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export function VerificationForm({ email }: { email: string }) {
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const [envoiRenouvele, setEnvoiRenouvele] = useState(false);
  const router = useRouter();
  const inputs = useRef<(HTMLInputElement | null)[]>([]);

  const complet = code.every((c) => c !== "");

  function setChiffre(index: number, valeur: string) {
    const chiffre = valeur.replace(/\D/g, "").slice(-1);
    setCode((prev) => {
      const next = [...prev];
      next[index] = chiffre;
      return next;
    });
    if (chiffre && index < 5) inputs.current[index + 1]?.focus();
  }

  function onKeyDown(index: number, e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      inputs.current[index - 1]?.focus();
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between gap-2">
        {code.map((chiffre, i) => (
          <input
            key={i}
            ref={(el) => {
              inputs.current[i] = el;
            }}
            value={chiffre}
            onChange={(e) => setChiffre(i, e.target.value)}
            onKeyDown={(e) => onKeyDown(i, e)}
            inputMode="numeric"
            maxLength={1}
            className="h-14 w-12 rounded-lg border border-border bg-card text-center font-tabular text-xl focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/30"
          />
        ))}
      </div>

      <Button className="w-full" size="lg" disabled={!complet} onClick={() => router.push("/onboarding/type")}>
        Vérifier
      </Button>

      <p className="text-center text-sm text-muted-foreground">
        {envoiRenouvele ? (
          "Un nouveau code a été envoyé."
        ) : (
          <>
            Vous n&apos;avez rien reçu ?{" "}
            <button type="button" onClick={() => setEnvoiRenouvele(true)} className="font-medium text-foreground underline underline-offset-4">
              Renvoyer le code
            </button>
          </>
        )}
      </p>
      <p className="text-center text-xs text-muted-foreground">Code envoyé à {email}</p>
    </div>
  );
}
