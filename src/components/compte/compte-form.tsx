"use client";

import { useState } from "react";
import { ShieldCheck, CheckCircle2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { useUtilisateur } from "@/lib/selecteurs";
import { useTresoraStore } from "@/lib/store";
import { formatDate } from "@/lib/format";

export function CompteForm() {
  const utilisateur = useUtilisateur();
  const mettreAJourUtilisateur = useTresoraStore((s) => s.mettreAJourUtilisateur);
  const toggleDeuxFA = useTresoraStore((s) => s.toggleDeuxFA);
  const changerMotDePasse = useTresoraStore((s) => s.changerMotDePasse);

  const [prenom, setPrenom] = useState(utilisateur.nom.split(" ")[0] ?? "");
  const [nomFamille, setNomFamille] = useState(utilisateur.nom.split(" ").slice(1).join(" "));
  const [email, setEmail] = useState(utilisateur.email);
  const [telephone, setTelephone] = useState(utilisateur.telephone);
  const [enregistre, setEnregistre] = useState(false);

  const [motDePasseChange, setMotDePasseChange] = useState(false);
  const [motDePasseMisAJour, setMotDePasseMisAJour] = useState(false);

  function onEnregistrer() {
    mettreAJourUtilisateur({ nom: `${prenom} ${nomFamille}`.trim(), email, telephone });
    setEnregistre(true);
    setTimeout(() => setEnregistre(false), 2000);
  }

  function onMettreAJourMotDePasse() {
    changerMotDePasse();
    setMotDePasseChange(false);
    setMotDePasseMisAJour(true);
    setTimeout(() => setMotDePasseMisAJour(false), 2500);
  }

  return (
    <div className="space-y-6">
      <Card className="ledger-card">
        <CardHeader>
          <CardTitle className="text-[15px] font-medium">Informations personnelles</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="prenom">Prénom</Label>
              <Input id="prenom" value={prenom} onChange={(e) => setPrenom(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="nom">Nom</Label>
              <Input id="nom" value={nomFamille} onChange={(e) => setNomFamille(e.target.value)} />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Adresse email</Label>
            <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="telephone">Téléphone</Label>
            <Input id="telephone" type="tel" value={telephone} onChange={(e) => setTelephone(e.target.value)} />
          </div>
          <Button size="sm" onClick={onEnregistrer}>
            {enregistre ? (
              <>
                <CheckCircle2 className="h-4 w-4" />
                Enregistré
              </>
            ) : (
              "Enregistrer"
            )}
          </Button>
        </CardContent>
      </Card>

      <Card className="ledger-card">
        <CardHeader>
          <CardTitle className="text-[15px] font-medium">Mot de passe</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {motDePasseChange ? (
            <>
              <div className="space-y-2">
                <Label htmlFor="actuel">Mot de passe actuel</Label>
                <Input id="actuel" type="password" placeholder="••••••••" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="nouveau">Nouveau mot de passe</Label>
                <Input id="nouveau" type="password" placeholder="8 caractères minimum" />
              </div>
              <div className="flex items-center gap-3">
                <Button size="sm" onClick={onMettreAJourMotDePasse}>
                  <CheckCircle2 className="h-4 w-4" />
                  Mettre à jour
                </Button>
                <Button size="sm" variant="ghost" onClick={() => setMotDePasseChange(false)}>
                  Annuler
                </Button>
              </div>
            </>
          ) : (
            <>
              <p className="text-sm text-muted-foreground">
                {motDePasseMisAJour ? (
                  <span className="flex items-center gap-1.5 text-positive">
                    <CheckCircle2 className="h-3.5 w-3.5" /> Mot de passe mis à jour à l&apos;instant.
                  </span>
                ) : (
                  `Dernière modification le ${formatDate(utilisateur.motDePasseMisAJourLe)}.`
                )}
              </p>
              <Button size="sm" variant="outline" onClick={() => setMotDePasseChange(true)}>
                Changer le mot de passe
              </Button>
            </>
          )}
        </CardContent>
      </Card>

      <Card className="ledger-card">
        <CardHeader>
          <CardTitle className="text-[15px] font-medium">Sécurité</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-secondary text-muted-foreground">
                <ShieldCheck className="h-4 w-4" strokeWidth={1.75} />
              </span>
              <div>
                <p className="text-sm font-medium">Authentification à deux facteurs</p>
                <p className="text-xs text-muted-foreground">Un code supplémentaire vous sera demandé à chaque connexion.</p>
              </div>
            </div>
            <Switch checked={utilisateur.deuxFA} onCheckedChange={toggleDeuxFA} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
