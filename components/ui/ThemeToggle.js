"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Moon, Sun, ChevronDown } from "lucide-react";

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Hydration hatasını önlemek için client-side'da mount olmasını bekle
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    // Mount olana kadar iskelet dön
    return <div className="w-32 h-10 rounded-xl bg-muted animate-pulse" />;
  }

  return (
    <div className="relative inline-block">
      <select
        value={theme === "system" ? "light" : theme} // Eğer sistem seçiliyse varsayılan olarak açık gibi göster
        onChange={(e) => setTheme(e.target.value)}
        className="appearance-none bg-background border border-border text-foreground text-sm font-medium rounded-xl px-4 py-2.5 pr-10 hover:bg-muted focus:outline-none focus:ring-2 focus:ring-primary/50 transition-colors cursor-pointer shadow-sm w-36"
      >
        <option value="light">Açık Tema</option>
        <option value="dark">Koyu Tema</option>
      </select>
      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-muted-foreground">
        <ChevronDown className="w-4 h-4" />
      </div>
    </div>
  );
}
