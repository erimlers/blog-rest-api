"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Hydration hatasını önlemek için client-side'da mount olmasını bekle
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    // Mount olana kadar butonun yerini tutacak bir iskelet dön (Flicker engelleme)
    return <div className="w-9 h-9 rounded-md bg-muted animate-pulse" />;
  }

  return (
    <button
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="p-2 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground transition-all duration-300 ease-in-out focus:outline-none cursor-pointer"
      aria-label="Temayı değiştir"
    >
      {theme === "dark" ? (
        <Sun className="w-5 h-5 transition-transform duration-300 ease-in-out rotate-0 scale-100" />
      ) : (
        <Moon className="w-5 h-5 transition-transform duration-300 ease-in-out rotate-0 scale-100" />
      )}
    </button>
  );
}
