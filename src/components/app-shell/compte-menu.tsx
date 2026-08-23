"use client";

import Link from "next/link";
import { LogOut, UserCircle } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useUtilisateur } from "@/lib/selecteurs";
import { initialesDeNom } from "@/lib/format";

/**
 * Avatar cliquable du header (page « Vos espaces »). Purement décoratif
 * auparavant — on ne pouvait rien en faire au clic ou au toucher.
 */
export function CompteMenu() {
  const utilisateur = useUtilisateur();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button aria-label="Menu du compte" className="rounded-full transition-opacity hover:opacity-80">
          <Avatar className="h-9 w-9">
            <AvatarFallback className="bg-primary text-primary-foreground text-xs">{initialesDeNom(utilisateur.nom)}</AvatarFallback>
          </Avatar>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-52">
        <DropdownMenuLabel>{utilisateur.nom}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/compte" className="flex items-center gap-2.5">
            <UserCircle className="h-4 w-4" />
            Mon compte
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/connexion" className="flex items-center gap-2.5">
            <LogOut className="h-4 w-4" />
            Se déconnecter
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
