import type { NextConfig } from "next";

// Pas d'export statique : les cotisations, événements et paiements créés
// côté client ont besoin du rendu dynamique de Vercel pour leurs pages de
// détail (un ID créé après le build n'existerait dans aucun fichier HTML
// pré-généré, et l'export statique ne sait pas les servir).
const nextConfig: NextConfig = {};

export default nextConfig;
