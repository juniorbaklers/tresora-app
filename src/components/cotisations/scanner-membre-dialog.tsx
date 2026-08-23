"use client";

import { useEffect, useRef, useState } from "react";
import jsQR from "jsqr";
import { CameraOff, ScanLine } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { decoderMembreQR } from "@/lib/qr";

/**
 * Scanne le QR imprimé ou affiché sur la carte d'un membre pour l'identifier
 * instantanément, plutôt que de le chercher dans une liste de dizaines de
 * noms pendant une collecte.
 */
export function ScannerMembreDialog({
  open,
  onOpenChange,
  onMembreScanne,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onMembreScanne: (membreId: string) => void;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const frameRef = useRef<number>(0);
  const [erreur, setErreur] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;
    let annule = false;

    async function demarrer() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });
        if (annule) {
          stream.getTracks().forEach((t) => t.stop());
          return;
        }
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play();
        }
        boucleAnalyse();
      } catch {
        if (!annule) setErreur("Impossible d'accéder à la caméra. Vérifiez les autorisations de votre navigateur.");
      }
    }

    function boucleAnalyse() {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      if (!video || !canvas || video.readyState !== video.HAVE_ENOUGH_DATA) {
        frameRef.current = requestAnimationFrame(boucleAnalyse);
        return;
      }
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const image = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const resultat = jsQR(image.data, image.width, image.height);
      if (resultat) {
        const donnees = decoderMembreQR(resultat.data);
        if (donnees) {
          onMembreScanne(donnees.membreId);
          return;
        }
      }
      frameRef.current = requestAnimationFrame(boucleAnalyse);
    }

    demarrer();

    return () => {
      annule = true;
      cancelAnimationFrame(frameRef.current);
      streamRef.current?.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ScanLine className="h-4 w-4" />
            Scanner la carte d&apos;un membre
          </DialogTitle>
          <DialogDescription>Visez le QR affiché sur la fiche du membre — le versement s&apos;ouvre automatiquement.</DialogDescription>
        </DialogHeader>

        {erreur ? (
          <div className="flex flex-col items-center gap-3 rounded-lg bg-secondary/60 py-10 text-center">
            <CameraOff className="h-6 w-6 text-muted-foreground" />
            <p className="max-w-xs text-sm text-muted-foreground">{erreur}</p>
          </div>
        ) : (
          <div className="relative overflow-hidden rounded-lg bg-black">
            <video ref={videoRef} className="aspect-square w-full object-cover" muted playsInline />
            <div className="pointer-events-none absolute inset-8 rounded-lg border-2 border-gold/70" aria-hidden />
          </div>
        )}
        <canvas ref={canvasRef} className="hidden" />
      </DialogContent>
    </Dialog>
  );
}
