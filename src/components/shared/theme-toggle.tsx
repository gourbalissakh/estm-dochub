"use client";

import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

export function ThemeToggle() {
  const [dark, setDark] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("theme");
    const isDark = saved === "dark" || (!saved && window.matchMedia("(prefers-color-scheme: dark)").matches);
    setDark(isDark);
    document.documentElement.classList.toggle("dark", isDark);
    setMounted(true);
  }, []);

  function toggle() {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle("dark", next);
    localStorage.setItem("theme", next ? "dark" : "light");
  }

  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      onClick={toggle}
      aria-label="Changer le theme"
      className="relative overflow-hidden"
    >
      <span
        className="absolute inset-0 grid place-items-center transition-all duration-500"
        style={{
          opacity: mounted && dark ? 0 : 1,
          transform: mounted && dark ? "rotate(-90deg) scale(0.5)" : "rotate(0) scale(1)",
        }}
      >
        <Moon size={17} />
      </span>
      <span
        className="absolute inset-0 grid place-items-center transition-all duration-500"
        style={{
          opacity: mounted && dark ? 1 : 0,
          transform: mounted && dark ? "rotate(0) scale(1)" : "rotate(90deg) scale(0.5)",
        }}
      >
        <Sun size={17} />
      </span>
    </Button>
  );
}
