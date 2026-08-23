export type EspaceType = "eglise" | "groupe" | "association" | "autre";

export type ModuleKey =
  | "membres"
  | "cotisations"
  | "evenements"
  | "recettes"
  | "depenses"
  | "rapports"
  | "dimes"
  | "offrandes"
  | "dons"
  | "contributions";

export type Role =
  | "proprietaire"
  | "administrateur"
  | "tresorier"
  | "responsable"
  | "membre";

export type DeviseCode = "XOF" | "XAF" | "GHS" | "EUR" | "USD";

export interface Espace {
  id: string;
  nom: string;
  type: EspaceType;
  initiales: string;
  couleur: string; // classe tailwind bg-*
  devise: DeviseCode;
  modules: ModuleKey[];
  soldeInitial: number;
  role: Role; // rôle de l'utilisateur courant dans cet espace
  membresCount: number;
}

export interface Invitation {
  id: string;
  espaceId: string;
  email: string;
  date: string;
}

export type StatutPaiement = "paye" | "partiel" | "impaye" | "en_retard" | "exonere";

export interface Membre {
  id: string;
  espaceId: string;
  nom: string;
  prenom: string;
  telephone: string;
  email?: string;
  fonction?: string;
  statut: "actif" | "inactif";
  dateInscription: string;
  initiales: string;
}

/** Un versement isolé — une cotisation peut être réglée en plusieurs fois. */
export interface Tranche {
  id: string;
  date: string;
  montant: number;
  responsable: string;
}

export interface PaiementCotisation {
  membreId: string;
  montantDu: number;
  /** Somme des tranches — tenu à jour par le store à chaque versement. */
  montantPaye: number;
  statut: StatutPaiement;
  dernierPaiement?: string;
  tranches: Tranche[];
}

/**
 * Une correction apportée après coup à un montant ou un texte déjà enregistré.
 * Toujours conservée intégralement (jamais écrasée) : c'est la trace qui
 * protège contre une saisie malhonnête déguisée en « faute de frappe ».
 */
export interface Correction {
  id: string;
  date: string;
  heure: string;
  responsable: string;
  raison: string;
  champ: string;
  ancienneValeur: string;
  nouvelleValeur: string;
}

/** Rappel envoyé (ou programmé) à un membre pour une cotisation impayée. */
export interface Rappel {
  id: string;
  cotisationId: string;
  membreId: string;
  date: string;
  automatique: boolean;
}

export type Periodicite =
  | "unique"
  | "hebdomadaire"
  | "mensuelle"
  | "trimestrielle"
  | "annuelle"
  | "personnalisee";

export interface Cotisation {
  id: string;
  espaceId: string;
  nom: string;
  description: string;
  montant: number;
  periodicite: Periodicite;
  dateDebut: string;
  dateLimite: string;
  responsable: string;
  statut: "active" | "cloturee";
  paiements: PaiementCotisation[];
}

export type CategorieRecette =
  | "dime"
  | "offrande_ordinaire"
  | "offrande_speciale"
  | "offrande_culte_soir"
  | "cotisation"
  | "don"
  | "activite"
  | "autre";

export interface Recette {
  id: string;
  espaceId: string;
  date: string;
  montant: number;
  categorie: CategorieRecette;
  libelle: string;
  responsable: string;
  commentaire?: string;
  corrections?: Correction[];
}

export interface Depense {
  id: string;
  espaceId: string;
  date: string;
  montant: number;
  categorie: string;
  description: string;
  beneficiaire: string;
  modePaiement: "especes" | "mobile_money" | "virement" | "cheque";
  responsable: string;
  justificatif: boolean;
  evenementId?: string;
  corrections?: Correction[];
}

export interface Evenement {
  id: string;
  espaceId: string;
  nom: string;
  description: string;
  dateDebut: string;
  dateFin: string;
  montantCible?: number;
  montantCollecte: number;
  participants: number;
  statut: "planifie" | "actif" | "termine";
}

export type StatutContribution = "en_attente" | "partiel" | "paye";

export interface Contribution {
  id: string;
  projet: string;
  description: string;
  espaceDemandeurId: string;
  espaceCibleId: string;
  montantDemande: number;
  montantRecu: number;
  dateLimite: string;
  statut: StatutContribution;
  historique: { date: string; montant: number }[];
}

export type TypeNotification =
  | "cotisation_retard"
  | "nouveau_paiement"
  | "contribution_demandee"
  | "contribution_recue"
  | "evenement_bientot"
  | "rapport_disponible";

export interface NotificationItem {
  id: string;
  espaceId: string;
  type: TypeNotification;
  titre: string;
  description: string;
  date: string;
  lue: boolean;
}

export interface EntreeJournal {
  id: string;
  espaceId: string;
  date: string;
  heure: string;
  utilisateur: string;
  role: string;
  action: string;
  ancienneValeur?: string;
  nouvelleValeur?: string;
}

export interface Cloture {
  id: string;
  espaceId: string;
  date: string;
  culte: string;
  offrandeOrdinaire: number;
  offrandeSpeciale: number;
  dimes: number;
  autresRecettes: number;
  totalCompte: number;
  responsable: string;
  justification?: string;
}

export interface PermissionRole {
  role: Role;
  label: string;
  description: string;
  permissions: string[];
}

export type StyleRapport = "classique" | "moderne" | "compact";
