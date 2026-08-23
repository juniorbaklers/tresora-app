"use client";

import { useState } from "react";
import { UserPlus, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { useTresoraStore } from "@/lib/store";

const EMAIL_VALIDE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function InviterDialog({ espaceId }: { espaceId: string }) {
  const inviterUtilisateur = useTresoraStore((s) => s.inviterUtilisateur);
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");

  function envoyer() {
    if (!EMAIL_VALIDE.test(email)) return;
    inviterUtilisateur(espaceId, email.trim());
    setOpen(false);
    setEmail("");
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <Button variant="outline" size="sm" className="mt-4" onClick={() => setOpen(true)}>
        <UserPlus className="h-4 w-4" />
        Inviter un utilisateur
      </Button>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Inviter un utilisateur</DialogTitle>
          <DialogDescription>Un lien d&apos;invitation sera envoyé à cette adresse pour rejoindre l&apos;espace.</DialogDescription>
        </DialogHeader>
        <div className="space-y-2 py-1">
          <Label htmlFor="invite-email">Adresse email</Label>
          <div className="relative">
            <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="invite-email"
              type="email"
              className="pl-9"
              placeholder="collegue@exemple.ci"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && envoyer()}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Annuler
          </Button>
          <Button onClick={envoyer} disabled={!EMAIL_VALIDE.test(email)}>
            <UserPlus className="h-4 w-4" />
            Envoyer l&apos;invitation
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
