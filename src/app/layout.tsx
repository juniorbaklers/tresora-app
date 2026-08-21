import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans, IBM_Plex_Mono, Fraunces } from "next/font/google";
import { TooltipProvider } from "@/components/ui/tooltip";
import { HydrateStore } from "@/components/hydrate-store";
import { RegisterServiceWorker } from "@/components/register-service-worker";
import { OfflineBanner } from "@/components/app-shell/offline-banner";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
});

const plexMono = IBM_Plex_Mono({
  variable: "--font-plex-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

// Fraunces : serif variable. L'axe WONK donne aux titres leur caractère un peu
// dévié, loin des serifs neutres qu'on voit partout.
const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  axes: ["SOFT", "WONK", "opsz"],
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  title: "Trésora — Gestion financière multi-espace",
  description:
    "La plateforme premium qui organise la trésorerie, les cotisations et les contributions de chaque espace : église, groupe ou association.",
  manifest: "/manifest.json",
  icons: {
    icon: [
      { url: "/icon.svg", type: "image/svg+xml" },
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
    ],
    apple: "/apple-touch-icon.png",
  },
};

export const viewport: Viewport = {
  themeColor: "#16203A",
};

const THEME_SCRIPT = `
try {
  var t = localStorage.getItem("tresora-theme");
  if (t === "dark" || (!t && window.matchMedia("(prefers-color-scheme: dark)").matches)) {
    document.documentElement.classList.add("dark");
  }
} catch (e) {}
`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="fr"
      suppressHydrationWarning
      className={`${jakarta.variable} ${plexMono.variable} ${fraunces.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <script dangerouslySetInnerHTML={{ __html: THEME_SCRIPT }} />
        <HydrateStore />
        <RegisterServiceWorker />
        <OfflineBanner />
        <TooltipProvider>{children}</TooltipProvider>
      </body>
    </html>
  );
}
