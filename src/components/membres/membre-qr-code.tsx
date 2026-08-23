"use client";

import { useEffect, useRef, useState } from "react";
import QRCode from "qrcode";
import { encoderMembreQR } from "@/lib/qr";

/**
 * Le QR encode l'identité du membre : présenté à l'écran (ou imprimé), il
 * permet de le retrouver instantanément via « Scanner un membre » lors d'un
 * versement de cotisation, sans le chercher dans une liste.
 */
export function MembreQRCode({ espaceId, membreId, nomComplet }: { espaceId: string; membreId: string; nomComplet: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [erreur, setErreur] = useState(false);

  useEffect(() => {
    if (!canvasRef.current) return;
    QRCode.toCanvas(canvasRef.current, encoderMembreQR(espaceId, membreId), {
      width: 176,
      margin: 1,
      color: { dark: "#16203A", light: "#00000000" },
    }).catch(() => setErreur(true));
  }, [espaceId, membreId]);

  return (
    <div className="flex flex-col items-center gap-3 py-2 text-center sm:flex-row sm:items-center sm:text-left">
      <div className="flex h-[192px] w-[192px] shrink-0 items-center justify-center rounded-xl border border-border bg-secondary/40 p-4">
        {erreur ? (
          <p className="text-xs text-muted-foreground">QR indisponible</p>
        ) : (
          <canvas ref={canvasRef} width={176} height={176} />
        )}
      </div>
      <div>
        <p className="text-sm font-medium">{nomComplet}</p>
        <p className="mt-1 max-w-xs text-xs text-muted-foreground">
          À présenter lors d&apos;une collecte : le trésorier scanne ce code pour ouvrir directement le versement de ce membre.
        </p>
      </div>
    </div>
  );
}
