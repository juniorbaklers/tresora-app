const PREFIXE = "tresora://membre/";

/** Contenu encodé dans le QR d'un membre : identifie l'espace et le membre sans ambiguïté. */
export function encoderMembreQR(espaceId: string, membreId: string): string {
  return `${PREFIXE}${espaceId}/${membreId}`;
}

export function decoderMembreQR(texte: string): { espaceId: string; membreId: string } | null {
  if (!texte.startsWith(PREFIXE)) return null;
  const [espaceId, membreId] = texte.slice(PREFIXE.length).split("/");
  if (!espaceId || !membreId) return null;
  return { espaceId, membreId };
}
