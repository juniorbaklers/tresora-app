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
  | "contributions";

export type Role =
  | "proprietaire"
  | "administrateur"
  | "tresorier"
  | "responsable"
  | "membre";

export interface Espace {
  id: string;
  nom: string;
  type: EspaceType;
  initiales: string;
  couleur: string; // classe tailwind bg-*
  devise: "XOF";
  modules: ModuleKey[];
  soldeInitial: number;
  role: Role; // rôle de l'utilisateur courant dans cet espace
  membresCount: number;
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

export interface PaiementCotisation {
  membreId: string;
  montantDu: number;
  montantPaye: number;
  statut: StatutPaiement;
  dernierPaiement?: string;
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
