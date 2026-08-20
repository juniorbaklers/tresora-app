import type {
  Cloture,
  Contribution,
  Cotisation,
  Depense,
  EntreeJournal,
  Espace,
  Evenement,
  Membre,
  NotificationItem,
  PaiementCotisation,
  PermissionRole,
  Recette,
} from "./types";

const PRENOMS = [
  "Jean", "Marie", "Paul", "Grace", "Serge", "Adjoua", "Kouadio", "Aya",
  "Yves", "Fatou", "Ismaël", "Chantal", "Didier", "Affoué", "Landry",
  "Nadège", "Boris", "Aïcha", "Cyrille", "Josiane", "Armand", "Sandrine",
  "Fabrice", "Mireille", "Prisca", "Éric", "Solange", "Guy", "Rachel", "Bertin",
];
const NOMS = [
  "Koffi", "Kouassi", "Bakayoko", "Diomandé", "Yao", "Konan", "Aka",
  "N'Guessan", "Traoré", "Ouattara", "Kacou", "Assi", "Brou", "Kra",
  "Kouamé", "Adou", "Gnahoré", "Diabaté", "Silué", "Tanoh",
];

function initiales(prenom: string, nom: string) {
  return `${prenom[0]}${nom[0]}`.toUpperCase();
}

function generateMembres(espaceId: string, count: number, startYear = 2022): Membre[] {
  const membres: Membre[] = [];
  for (let i = 0; i < count; i++) {
    const prenom = PRENOMS[i % PRENOMS.length];
    const nom = NOMS[(i * 7 + 3) % NOMS.length];
    const suffix = i >= PRENOMS.length ? ` ${Math.floor(i / PRENOMS.length) + 1}` : "";
    const mois = (i % 12) + 1;
    membres.push({
      id: `${espaceId}-m${i + 1}`,
      espaceId,
      nom: `${nom}${suffix}`,
      prenom,
      telephone: `07 ${String(10000000 + i * 37 % 89999999).slice(0, 8)}`,
      email: i % 3 === 0 ? `${prenom.toLowerCase()}.${nom.toLowerCase()}@mail.ci` : undefined,
      fonction: i === 0 ? "Responsable" : i === 1 ? "Trésorier adjoint" : undefined,
      statut: i % 17 === 0 ? "inactif" : "actif",
      dateInscription: `${startYear + (i % 3)}-${String(mois).padStart(2, "0")}-${String((i % 27) + 1).padStart(2, "0")}`,
      initiales: initiales(prenom, `${nom}${suffix}`),
    });
  }
  return membres;
}

export const ESPACES: Espace[] = [
  {
    id: "eglise",
    nom: "Église Emmanuel",
    type: "eglise",
    initiales: "EE",
    couleur: "bg-[#0F1B2D]",
    devise: "XOF",
    modules: ["membres", "cotisations", "evenements", "recettes", "depenses", "rapports", "dimes", "offrandes", "dons", "contributions"],
    soldeInitial: 2_005_000,
    role: "tresorier",
    membresCount: 250,
  },
  {
    id: "emmaus",
    nom: "Disciples d'Emmaüs",
    type: "groupe",
    initiales: "DE",
    couleur: "bg-[#C89A4B]",
    devise: "XOF",
    modules: ["membres", "cotisations", "evenements", "recettes", "depenses", "rapports", "dons", "contributions"],
    soldeInitial: 96_000,
    role: "tresorier",
    membresCount: 60,
  },
  {
    id: "bethanie",
    nom: "Servantes de Béthanie",
    type: "groupe",
    initiales: "SB",
    couleur: "bg-[#1E6E64]",
    devise: "XOF",
    modules: ["membres", "cotisations", "evenements", "recettes", "depenses", "contributions"],
    soldeInitial: 142_000,
    role: "membre",
    membresCount: 34,
  },
  {
    id: "galilee",
    nom: "Hommes de Galilée",
    type: "groupe",
    initiales: "HG",
    couleur: "bg-[#B3432E]",
    devise: "XOF",
    modules: ["membres", "cotisations", "evenements", "recettes", "depenses", "contributions"],
    soldeInitial: 58_000,
    role: "membre",
    membresCount: 41,
  },
  {
    id: "chorale",
    nom: "Chorale",
    type: "groupe",
    initiales: "CH",
    couleur: "bg-[#6C7580]",
    devise: "XOF",
    modules: ["membres", "cotisations", "evenements", "recettes", "depenses", "contributions"],
    soldeInitial: 21_000,
    role: "membre",
    membresCount: 22,
  },
  {
    id: "ecodim",
    nom: "ECODIM",
    type: "groupe",
    initiales: "EC",
    couleur: "bg-[#8A6D3B]",
    devise: "XOF",
    modules: ["membres", "cotisations", "evenements", "recettes", "depenses", "contributions"],
    soldeInitial: 12_000,
    role: "membre",
    membresCount: 28,
  },
];

// Espaces où l'utilisateur courant (Jean) a un accès direct (dashboard complet)
export const MES_ESPACES_IDS = ["eglise", "emmaus"];

export const MEMBRES: Record<string, Membre[]> = {
  eglise: generateMembres("eglise", 250, 2018),
  emmaus: generateMembres("emmaus", 60, 2023),
};

const emmausMembres = MEMBRES.emmaus;
const paiementsEmmaus: PaiementCotisation[] = emmausMembres.map((m, i) => {
  if (i < 36) {
    return { membreId: m.id, montantDu: 2000, montantPaye: 2000, statut: "paye", dernierPaiement: "2026-08-14" };
  }
  if (i < 42) {
    return { membreId: m.id, montantDu: 2000, montantPaye: 1000, statut: "partiel", dernierPaiement: "2026-08-09" };
  }
  if (i < 47) {
    return { membreId: m.id, montantDu: 2000, montantPaye: 0, statut: "en_retard" };
  }
  return { membreId: m.id, montantDu: 2000, montantPaye: 0, statut: "impaye" };
});

export const COTISATIONS: Cotisation[] = [
  {
    id: "cot-emmaus-aout",
    espaceId: "emmaus",
    nom: "Cotisation mensuelle — Août 2026",
    description: "Cotisation mensuelle obligatoire des membres actifs.",
    montant: 2000,
    periodicite: "mensuelle",
    dateDebut: "2026-08-01",
    dateLimite: "2026-08-31",
    responsable: "Jean Koffi",
    statut: "active",
    paiements: paiementsEmmaus,
  },
  {
    id: "cot-emmaus-juillet",
    espaceId: "emmaus",
    nom: "Cotisation mensuelle — Juillet 2026",
    description: "Cotisation mensuelle obligatoire des membres actifs.",
    montant: 2000,
    periodicite: "mensuelle",
    dateDebut: "2026-07-01",
    dateLimite: "2026-07-31",
    responsable: "Jean Koffi",
    statut: "cloturee",
    paiements: emmausMembres.map((m, i) => ({
      membreId: m.id,
      montantDu: 2000,
      montantPaye: i < 52 ? 2000 : 0,
      statut: i < 52 ? "paye" : "impaye",
    })),
  },
];

export const EVENEMENTS: Evenement[] = [
  {
    id: "evt-emmaus-sortie",
    espaceId: "emmaus",
    nom: "Sortie annuelle des jeunes",
    description: "Retraite spirituelle et sortie récréative de fin d'année à Grand-Bassam.",
    dateDebut: "2026-09-12",
    dateFin: "2026-09-14",
    montantCible: 500_000,
    montantCollecte: 120_000,
    participants: 48,
    statut: "actif",
  },
  {
    id: "evt-eglise-renovation",
    espaceId: "eglise",
    nom: "Projet rénovation de la salle de culte",
    description: "Réfection de la toiture, peinture et sonorisation de la grande salle.",
    dateDebut: "2026-08-01",
    dateFin: "2026-11-30",
    montantCible: 1_000_000,
    montantCollecte: 300_000,
    participants: 0,
    statut: "actif",
  },
];

export const CONTRIBUTIONS: Contribution[] = [
  {
    id: "ctr-emmaus",
    projet: "Projet rénovation de la salle de culte",
    description: "Contribution demandée à la jeunesse pour la rénovation de la salle de culte.",
    espaceDemandeurId: "eglise",
    espaceCibleId: "emmaus",
    montantDemande: 200_000,
    montantRecu: 100_000,
    dateLimite: "2026-10-15",
    statut: "partiel",
    historique: [{ date: "2026-08-05", montant: 100_000 }],
  },
  {
    id: "ctr-bethanie",
    projet: "Projet rénovation de la salle de culte",
    description: "Contribution demandée aux Servantes de Béthanie.",
    espaceDemandeurId: "eglise",
    espaceCibleId: "bethanie",
    montantDemande: 200_000,
    montantRecu: 50_000,
    dateLimite: "2026-10-15",
    statut: "partiel",
    historique: [{ date: "2026-08-11", montant: 50_000 }],
  },
  {
    id: "ctr-galilee",
    projet: "Projet rénovation de la salle de culte",
    description: "Contribution demandée aux Hommes de Galilée.",
    espaceDemandeurId: "eglise",
    espaceCibleId: "galilee",
    montantDemande: 150_000,
    montantRecu: 150_000,
    dateLimite: "2026-10-15",
    statut: "paye",
    historique: [{ date: "2026-08-02", montant: 150_000 }],
  },
  {
    id: "ctr-chorale",
    projet: "Projet rénovation de la salle de culte",
    description: "Contribution demandée à la Chorale.",
    espaceDemandeurId: "eglise",
    espaceCibleId: "chorale",
    montantDemande: 100_000,
    montantRecu: 0,
    dateLimite: "2026-10-15",
    statut: "en_attente",
    historique: [],
  },
  {
    id: "ctr-ecodim",
    projet: "Projet rénovation de la salle de culte",
    description: "Contribution demandée à ECODIM.",
    espaceDemandeurId: "eglise",
    espaceCibleId: "ecodim",
    montantDemande: 50_000,
    montantRecu: 0,
    dateLimite: "2026-10-15",
    statut: "en_attente",
    historique: [],
  },
];

export const RECETTES: Record<string, Recette[]> = {
  eglise: [
    { id: "r1", espaceId: "eglise", date: "2026-08-02", montant: 138_000, categorie: "dime", libelle: "Dîmes du dimanche", responsable: "Jean Koffi" },
    { id: "r2", espaceId: "eglise", date: "2026-08-02", montant: 92_000, categorie: "offrande_ordinaire", libelle: "Offrande ordinaire", responsable: "Jean Koffi" },
    { id: "r3", espaceId: "eglise", date: "2026-08-05", montant: 18_000, categorie: "offrande_culte_soir", libelle: "Culte de prière", responsable: "Marie Kouassi" },
    { id: "r4", espaceId: "eglise", date: "2026-08-09", montant: 145_000, categorie: "dime", libelle: "Dîmes du dimanche", responsable: "Jean Koffi" },
    { id: "r5", espaceId: "eglise", date: "2026-08-09", montant: 88_000, categorie: "offrande_ordinaire", libelle: "Offrande ordinaire", responsable: "Jean Koffi" },
    { id: "r6", espaceId: "eglise", date: "2026-08-09", montant: 100_000, categorie: "offrande_speciale", libelle: "Offrande spéciale — Missions", responsable: "Paul Bakayoko" },
    { id: "r7", espaceId: "eglise", date: "2026-08-12", montant: 20_000, categorie: "offrande_culte_soir", libelle: "Culte de prière", responsable: "Marie Kouassi" },
    { id: "r8", espaceId: "eglise", date: "2026-08-16", montant: 141_000, categorie: "dime", libelle: "Dîmes du dimanche", responsable: "Jean Koffi" },
    { id: "r9", espaceId: "eglise", date: "2026-08-16", montant: 96_000, categorie: "offrande_ordinaire", libelle: "Offrande ordinaire", responsable: "Jean Koffi" },
    { id: "r10", espaceId: "eglise", date: "2026-08-19", montant: 22_000, categorie: "offrande_culte_soir", libelle: "Culte de prière", responsable: "Marie Kouassi" },
    { id: "r11", espaceId: "eglise", date: "2026-08-19", montant: 126_000, categorie: "dime", libelle: "Dîmes du dimanche", responsable: "Jean Koffi" },
    { id: "r12", espaceId: "eglise", date: "2026-08-19", montant: 74_000, categorie: "offrande_ordinaire", libelle: "Offrande ordinaire", responsable: "Jean Koffi" },
    { id: "r13", espaceId: "eglise", date: "2026-08-19", montant: 50_000, categorie: "autre", libelle: "Vente de plats — journée des femmes", responsable: "Chantal Traoré" },
    { id: "r14", espaceId: "eglise", date: "2026-08-26", montant: 15_000, categorie: "offrande_culte_soir", libelle: "Culte de prière", responsable: "Marie Kouassi" },
  ],
  emmaus: [
    { id: "e1", espaceId: "emmaus", date: "2026-08-03", montant: 66_000, categorie: "cotisation", libelle: "Cotisations d'août (1ère collecte)", responsable: "Jean Koffi" },
    { id: "e2", espaceId: "emmaus", date: "2026-08-09", montant: 100_000, categorie: "don", libelle: "Don d'un membre pour la sortie annuelle", responsable: "Grace Konan" },
    { id: "e3", espaceId: "emmaus", date: "2026-08-14", montant: 12_000, categorie: "cotisation", libelle: "Cotisations d'août (2e collecte)", responsable: "Jean Koffi" },
    { id: "e4", espaceId: "emmaus", date: "2026-08-16", montant: 20_000, categorie: "activite", libelle: "Vente de gâteaux", responsable: "Nadège Aka" },
  ],
};

export const DEPENSES: Record<string, Depense[]> = {
  eglise: [
    { id: "d1", espaceId: "eglise", date: "2026-08-03", montant: 180_000, categorie: "Électricité & eau", description: "Facture CIE et SODECI — juillet", beneficiaire: "CIE / SODECI", modePaiement: "virement", responsable: "Jean Koffi", justificatif: true },
    { id: "d2", espaceId: "eglise", date: "2026-08-06", montant: 250_000, categorie: "Entretien bâtiment", description: "Réparation toiture — acompte", beneficiaire: "Ets Kouadio BTP", modePaiement: "mobile_money", responsable: "Jean Koffi", justificatif: true },
    { id: "d3", espaceId: "eglise", date: "2026-08-10", montant: 95_000, categorie: "Sonorisation", description: "Location matériel — conférence spéciale", beneficiaire: "SoundPro CI", modePaiement: "especes", responsable: "Paul Bakayoko", justificatif: true },
    { id: "d4", espaceId: "eglise", date: "2026-08-14", montant: 60_000, categorie: "Fournitures", description: "Achat fournitures bureau et culte", beneficiaire: "Papeterie Le Trait", modePaiement: "especes", responsable: "Marie Kouassi", justificatif: false },
    { id: "d5", espaceId: "eglise", date: "2026-08-18", montant: 95_000, categorie: "Communication", description: "Impression bulletins & bannières", beneficiaire: "Imprimerie Sonatel", modePaiement: "mobile_money", responsable: "Jean Koffi", justificatif: true },
  ],
  emmaus: [
    { id: "ed1", espaceId: "emmaus", date: "2026-08-08", montant: 15_000, categorie: "Communication", description: "Affiches et flyers — sortie annuelle", beneficiaire: "PrintExpress", modePaiement: "mobile_money", responsable: "Jean Koffi", justificatif: true, evenementId: "evt-emmaus-sortie" },
    { id: "ed2", espaceId: "emmaus", date: "2026-08-12", montant: 8_000, categorie: "Réunion", description: "Collation réunion de préparation", beneficiaire: "Maquis Chez Aya", modePaiement: "especes", responsable: "Grace Konan", justificatif: false, evenementId: "evt-emmaus-sortie" },
    { id: "ed3", espaceId: "emmaus", date: "2026-08-17", montant: 25_000, categorie: "Transport", description: "Reconnaissance du site — Grand-Bassam", beneficiaire: "Transport UTB", modePaiement: "mobile_money", responsable: "Jean Koffi", justificatif: true, evenementId: "evt-emmaus-sortie" },
  ],
};

export function getEspace(id: string): Espace | undefined {
  return ESPACES.find((e) => e.id === id);
}

export function getMembres(espaceId: string): Membre[] {
  return MEMBRES[espaceId] ?? [];
}

export function getMembre(espaceId: string, membreId: string): Membre | undefined {
  return getMembres(espaceId).find((m) => m.id === membreId);
}

export function getCotisations(espaceId: string): Cotisation[] {
  return COTISATIONS.filter((c) => c.espaceId === espaceId);
}

export function getCotisation(id: string): Cotisation | undefined {
  return COTISATIONS.find((c) => c.id === id);
}

export function getEvenements(espaceId: string): Evenement[] {
  return EVENEMENTS.filter((e) => e.espaceId === espaceId);
}

export function getEvenement(id: string): Evenement | undefined {
  return EVENEMENTS.find((e) => e.id === id);
}

export function getDepensesEvenement(evenementId: string): Depense[] {
  return Object.values(DEPENSES)
    .flat()
    .filter((d) => d.evenementId === evenementId);
}

export function getContributionsDemandeesPar(espaceId: string): Contribution[] {
  return CONTRIBUTIONS.filter((c) => c.espaceDemandeurId === espaceId);
}

export function getContributionsRequisesA(espaceId: string): Contribution[] {
  return CONTRIBUTIONS.filter((c) => c.espaceCibleId === espaceId);
}

export function getRecettes(espaceId: string): Recette[] {
  return RECETTES[espaceId] ?? [];
}

export function getDepenses(espaceId: string): Depense[] {
  return DEPENSES[espaceId] ?? [];
}

export function totalRecettes(espaceId: string): number {
  return getRecettes(espaceId).reduce((s, r) => s + r.montant, 0);
}

export function totalDepenses(espaceId: string): number {
  return getDepenses(espaceId).reduce((s, d) => s + d.montant, 0);
}

export function soldeActuel(espaceId: string): number {
  const espace = getEspace(espaceId);
  if (!espace) return 0;
  return espace.soldeInitial + totalRecettes(espaceId) - totalDepenses(espaceId);
}

export interface CotisationStats {
  totalAttendu: number;
  totalCollecte: number;
  tauxRecouvrement: number;
  nbPaye: number;
  nbPartiel: number;
  nbImpaye: number;
  nbEnRetard: number;
}

export function cotisationStats(cotisation: Cotisation): CotisationStats {
  const totalAttendu = cotisation.paiements.reduce((s, p) => s + p.montantDu, 0);
  const totalCollecte = cotisation.paiements.reduce((s, p) => s + p.montantPaye, 0);
  return {
    totalAttendu,
    totalCollecte,
    tauxRecouvrement: totalAttendu > 0 ? Math.round((totalCollecte / totalAttendu) * 100) : 0,
    nbPaye: cotisation.paiements.filter((p) => p.statut === "paye").length,
    nbPartiel: cotisation.paiements.filter((p) => p.statut === "partiel").length,
    nbImpaye: cotisation.paiements.filter((p) => p.statut === "impaye").length,
    nbEnRetard: cotisation.paiements.filter((p) => p.statut === "en_retard").length,
  };
}

export function getDerniersPaiements(cotisationId: string, limit = 5) {
  const cotisation = getCotisation(cotisationId);
  if (!cotisation) return [];
  return cotisation.paiements
    .filter((p) => p.dernierPaiement)
    .sort((a, b) => (b.dernierPaiement ?? "").localeCompare(a.dernierPaiement ?? ""))
    .slice(0, limit)
    .map((p) => ({ ...p, membre: getMembre(cotisation.espaceId, p.membreId) }));
}

export const UTILISATEUR = {
  nom: "Jean Koffi",
  email: "jean.koffi@example.ci",
  initiales: "JK",
};

export const NOTIFICATIONS: NotificationItem[] = [
  {
    id: "n-eglise-1",
    espaceId: "eglise",
    type: "contribution_recue",
    titre: "Contribution reçue",
    description: "Hommes de Galilée a versé 150 000 FCFA pour le projet de rénovation.",
    date: "2026-08-02",
    lue: true,
  },
  {
    id: "n-eglise-2",
    espaceId: "eglise",
    type: "contribution_recue",
    titre: "Contribution reçue",
    description: "Disciples d'Emmaüs a versé 100 000 FCFA pour le projet de rénovation.",
    date: "2026-08-05",
    lue: true,
  },
  {
    id: "n-eglise-3",
    espaceId: "eglise",
    type: "contribution_demandee",
    titre: "Contribution en attente",
    description: "La Chorale n'a pas encore répondu à la demande de 100 000 FCFA.",
    date: "2026-08-15",
    lue: false,
  },
  {
    id: "n-eglise-4",
    espaceId: "eglise",
    type: "rapport_disponible",
    titre: "Rapport mensuel disponible",
    description: "Le rapport financier d'août 2026 est prêt à être consulté.",
    date: "2026-08-20",
    lue: false,
  },
  {
    id: "n-emmaus-1",
    espaceId: "emmaus",
    type: "cotisation_retard",
    titre: "Cotisation en retard",
    description: "5 membres n'ont pas encore réglé la cotisation d'août 2026.",
    date: "2026-08-16",
    lue: false,
  },
  {
    id: "n-emmaus-2",
    espaceId: "emmaus",
    type: "nouveau_paiement",
    titre: "Nouveau paiement enregistré",
    description: "Serge Assi a payé 2 000 FCFA pour la cotisation d'août.",
    date: "2026-08-14",
    lue: true,
  },
  {
    id: "n-emmaus-3",
    espaceId: "emmaus",
    type: "contribution_demandee",
    titre: "L'église demande une contribution",
    description: "200 000 FCFA sont demandés pour le projet de rénovation de la salle de culte.",
    date: "2026-08-05",
    lue: true,
  },
  {
    id: "n-emmaus-4",
    espaceId: "emmaus",
    type: "evenement_bientot",
    titre: "Événement à venir",
    description: "La sortie annuelle des jeunes commence dans quelques semaines.",
    date: "2026-08-18",
    lue: false,
  },
];

export function getNotifications(espaceId: string): NotificationItem[] {
  return NOTIFICATIONS.filter((n) => n.espaceId === espaceId).sort((a, b) => b.date.localeCompare(a.date));
}

export const JOURNAL: EntreeJournal[] = [
  {
    id: "j-1",
    espaceId: "emmaus",
    date: "2026-08-14",
    heure: "14:32",
    utilisateur: "Jean Koffi",
    role: "Trésorier",
    action: "A enregistré un paiement de cotisation",
    ancienneValeur: "0 FCFA",
    nouvelleValeur: "Serge Assi — 2 000 FCFA",
  },
  {
    id: "j-2",
    espaceId: "emmaus",
    date: "2026-08-17",
    heure: "09:10",
    utilisateur: "Jean Koffi",
    role: "Trésorier",
    action: "A enregistré une dépense",
    nouvelleValeur: "Reconnaissance du site — 25 000 FCFA",
  },
  {
    id: "j-3",
    espaceId: "emmaus",
    date: "2026-08-05",
    heure: "18:47",
    utilisateur: "Grace Konan",
    role: "Responsable",
    action: "A enregistré un versement de contribution",
    ancienneValeur: "0 FCFA",
    nouvelleValeur: "100 000 FCFA vers Église Emmanuel",
  },
  {
    id: "j-4",
    espaceId: "eglise",
    date: "2026-08-19",
    heure: "12:05",
    utilisateur: "Jean Koffi",
    role: "Trésorier",
    action: "A enregistré une recette",
    nouvelleValeur: "Dîmes du dimanche — 126 000 FCFA",
  },
  {
    id: "j-5",
    espaceId: "eglise",
    date: "2026-08-18",
    heure: "16:20",
    utilisateur: "Jean Koffi",
    role: "Trésorier",
    action: "A enregistré une dépense",
    nouvelleValeur: "Impression bulletins & bannières — 95 000 FCFA",
  },
  {
    id: "j-6",
    espaceId: "eglise",
    date: "2026-08-02",
    heure: "11:15",
    utilisateur: "Jean Koffi",
    role: "Trésorier",
    action: "A validé une clôture du dimanche",
    nouvelleValeur: "02 août 2026 — écart 0 FCFA",
  },
  {
    id: "j-7",
    espaceId: "eglise",
    date: "2026-08-01",
    heure: "08:52",
    utilisateur: "Marie Kouassi",
    role: "Responsable",
    action: "A modifié le montant d'une cotisation",
    ancienneValeur: "1 500 FCFA",
    nouvelleValeur: "2 000 FCFA",
  },
];

export function getJournal(espaceId: string): EntreeJournal[] {
  return JOURNAL.filter((j) => j.espaceId === espaceId).sort(
    (a, b) => `${b.date}${b.heure}`.localeCompare(`${a.date}${a.heure}`)
  );
}

export const CLOTURES: Cloture[] = [
  {
    id: "cl-1",
    espaceId: "eglise",
    date: "2026-08-02",
    culte: "Culte du dimanche matin",
    offrandeOrdinaire: 92_000,
    offrandeSpeciale: 100_000,
    dimes: 138_000,
    autresRecettes: 0,
    totalCompte: 330_000,
    responsable: "Jean Koffi",
  },
  {
    id: "cl-2",
    espaceId: "eglise",
    date: "2026-08-09",
    culte: "Culte du dimanche matin",
    offrandeOrdinaire: 88_000,
    offrandeSpeciale: 0,
    dimes: 145_000,
    autresRecettes: 0,
    totalCompte: 233_000,
    responsable: "Jean Koffi",
  },
  {
    id: "cl-3",
    espaceId: "eglise",
    date: "2026-08-16",
    culte: "Culte du dimanche matin",
    offrandeOrdinaire: 96_000,
    offrandeSpeciale: 0,
    dimes: 141_000,
    autresRecettes: 50_000,
    totalCompte: 286_500,
    responsable: "Jean Koffi",
    justification: "Écart de 500 FCFA — pièce manquante lors du comptage, à vérifier.",
  },
  {
    id: "cl-4",
    espaceId: "eglise",
    date: "2026-08-19",
    culte: "Culte du dimanche matin",
    offrandeOrdinaire: 74_000,
    offrandeSpeciale: 0,
    dimes: 126_000,
    autresRecettes: 0,
    totalCompte: 200_000,
    responsable: "Jean Koffi",
  },
];

export function getClotures(espaceId: string): Cloture[] {
  return CLOTURES.filter((c) => c.espaceId === espaceId).sort((a, b) => b.date.localeCompare(a.date));
}

export const PERMISSIONS_LIST = [
  "Voir",
  "Créer",
  "Modifier",
  "Supprimer",
  "Valider",
  "Exporter",
  "Gérer les membres",
  "Gérer les cotisations",
  "Gérer les événements",
  "Gérer les recettes",
  "Gérer les dépenses",
  "Gérer les rapports",
  "Inviter des utilisateurs",
  "Gérer les paramètres",
] as const;

export const ROLES: PermissionRole[] = [
  {
    role: "proprietaire",
    label: "Propriétaire",
    description: "Contrôle total de l'espace.",
    permissions: [...PERMISSIONS_LIST],
  },
  {
    role: "administrateur",
    label: "Administrateur",
    description: "Gestion globale de l'espace, sans pouvoir le supprimer.",
    permissions: PERMISSIONS_LIST.filter((p) => p !== "Supprimer"),
  },
  {
    role: "tresorier",
    label: "Trésorier",
    description: "Gestion financière complète : recettes, dépenses, cotisations, rapports.",
    permissions: ["Voir", "Créer", "Modifier", "Valider", "Exporter", "Gérer les cotisations", "Gérer les recettes", "Gérer les dépenses", "Gérer les rapports"],
  },
  {
    role: "responsable",
    label: "Responsable",
    description: "Accès aux modules qui lui sont confiés.",
    permissions: ["Voir", "Créer", "Modifier", "Gérer les membres", "Gérer les événements"],
  },
  {
    role: "membre",
    label: "Membre",
    description: "Accès limité à ses propres informations.",
    permissions: ["Voir"],
  },
];
