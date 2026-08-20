"use client";

import ThemeToggle from "@components/ui/ThemeToggle";
import { Menu } from "lucide-react";

export default function MobileNavbar() {
  return (
    <nav className="w-full h-16 border-b border-border bg-background/70 backdrop-blur-lg sticky top-0 z-50 transition-all duration-300 ease-in-out">
      <div className="container mx-auto px-4 h-full flex items-center justify-between">
        
        {/* Sol Alan: Logo */}
        <div className="text-xl font-bold tracking-tight text-primary cursor-pointer hover:opacity-80 transition-opacity duration-300">
          <span className="text-foreground">&lt;</span>Blog<span className="text-foreground">/&gt;</span>
        </div>

        {/* Sağ Alan: Tema ve Menü */}
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <button className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-md transition-all duration-300 ease-in-out focus:outline-none">
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </div>
    </nav>
  );
}
