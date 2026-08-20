import type { Metadata } from "next";
import { Plus_Jakarta_Sans, IBM_Plex_Mono, Fraunces } from "next/font/google";
import { TooltipProvider } from "@/components/ui/tooltip";
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
        <TooltipProvider>{children}</TooltipProvider>
      </body>
    </html>
  );
}
