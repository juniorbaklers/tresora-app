"use client";

import { useMemo, useState } from "react";
import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { formatFCFA } from "@/lib/format";

export function ClotureForm({ responsable }: { responsable: string }) {
  const [offrandeOrdinaire, setOffrandeOrdinaire] = useState("");
  const [offrandeSpeciale, setOffrandeSpeciale] = useState("");
  const [dimes, setDimes] = useState("");
  const [autres, setAutres] = useState("");
  const [totalCompte, setTotalCompte] = useState("");
  const [valide, setValide] = useState(false);

  const totalAttendu = useMemo(
    () => (Number(offrandeOrdinaire) || 0) + (Number(offrandeSpeciale) || 0) + (Number(dimes) || 0) + (Number(autres) || 0),
    [offrandeOrdinaire, offrandeSpeciale, dimes, autres]
  );
  const ecart = (Number(totalCompte) || 0) - totalAttendu;

  if (valide) {
    return (
      <Card className="ledger-card">
        <CardContent className="flex items-center gap-3 py-6">
          <CheckCircle2 className="h-5 w-5 shrink-0 text-positive" />
          <div>
            <p className="text-sm font-medium">Clôture validée</p>
            <p className="text-xs text-muted-foreground">Total compté : {formatFCFA(Number(totalCompte) || 0)} — écart {formatFCFA(ecart)}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="ledger-card">
      <CardContent className="space-y-5 pt-2">
        <div className="grid gap-5 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="offrande-ordinaire">Offrande ordinaire</Label>
            <Input id="offrande-ordinaire" type="number" min={0} value={offrandeOrdinaire} onChange={(e) => setOffrandeOrdinaire(e.target.value)} placeholder="0" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="offrande-speciale">Offrande spéciale</Label>
            <Input id="offrande-speciale" type="number" min={0} value={offrandeSpeciale} onChange={(e) => setOffrandeSpeciale(e.target.value)} placeholder="0" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="dimes">Dîmes</Label>
            <Input id="dimes" type="number" min={0} value={dimes} onChange={(e) => setDimes(e.target.value)} placeholder="0" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="autres">Autres recettes</Label>
            <Input id="autres" type="number" min={0} value={autres} onChange={(e) => setAutres(e.target.value)} placeholder="0" />
          </div>
        </div>

        <div className="rounded-lg bg-secondary px-4 py-3 text-sm">
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Total attendu</span>
            <span className="font-tabular">{formatFCFA(totalAttendu)}</span>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="total-compte">Total compté</Label>
          <Input id="total-compte" type="number" min={0} value={totalCompte} onChange={(e) => setTotalCompte(e.target.value)} placeholder="0" />
        </div>

        {totalCompte !== "" && (
          <div className={`rounded-lg px-4 py-3 text-sm ${ecart === 0 ? "bg-positive/10 text-positive" : "bg-destructive/10 text-destructive"}`}>
            Écart : {formatFCFA(ecart)} {ecart === 0 ? "— comptage exact" : ecart > 0 ? "— excédent" : "— manquant"}
          </div>
        )}

        {ecart !== 0 && totalCompte !== "" && (
          <div className="space-y-2">
            <Label htmlFor="justification">Justification de l&apos;écart</Label>
            <Textarea id="justification" rows={2} placeholder="Expliquez la raison de l'écart constaté" />
          </div>
        )}

        <div className="space-y-2">
          <Label htmlFor="responsable">Responsable du comptage</Label>
          <Input id="responsable" defaultValue={responsable} />
        </div>

        <Button size="lg" onClick={() => setValide(true)} disabled={totalCompte === ""}>
          <CheckCircle2 className="h-4 w-4" />
          Valider la clôture
        </Button>
      </CardContent>
    </Card>
  );
}
