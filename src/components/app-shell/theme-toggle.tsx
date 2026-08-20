"use client";

import { useState } from "react";
import { Moon, Sun } from "lucide-react";
import { cn } from "@/lib/utils";

export function ThemeToggle({ tone = "dark" }: { tone?: "dark" | "light" }) {
  const [isDark, setIsDark] = useState(() => typeof document !== "undefined" && document.documentElement.classList.contains("dark"));

  function toggle() {
    const next = !isDark;
    setIsDark(next);
    document.documentElement.classList.toggle("dark", next);
    try {
      localStorage.setItem("tresora-theme", next ? "dark" : "light");
    } catch {}
  }

  return (
    <button
      onClick={toggle}
      aria-label={isDark ? "Passer en thème clair" : "Passer en thème sombre"}
      className={cn(
        "flex h-9 w-9 shrink-0 items-center justify-center rounded-full transition-colors",
        tone === "dark" ? "text-[#9B937F] hover:bg-white/[0.06] hover:text-[#F6F1E7]" : "bg-secondary text-foreground hover:opacity-80"
      )}
    >
      {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
    </button>
  );
}
