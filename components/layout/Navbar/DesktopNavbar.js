"use client";

import ThemeToggle from "@components/ui/ThemeToggle";

export default function DesktopNavbar() {
  return (
    <nav className="w-full h-16 border-b border-border bg-background/70 backdrop-blur-lg sticky top-0 z-50 transition-all duration-300 ease-in-out">
      <div className="container mx-auto px-6 h-full flex items-center justify-between">
        
        {/* Sol Alan: Logo */}
        <div className="flex-1 flex items-center justify-start">
          <div className="text-2xl font-bold tracking-tight text-primary cursor-pointer hover:opacity-80 transition-opacity duration-300">
            <span className="text-foreground">&lt;</span>Blog<span className="text-foreground">/&gt;</span>
          </div>
        </div>

        {/* Orta Alan: Navigasyon Linkleri */}
        <div className="flex-1 flex items-center justify-center gap-8">
          <button className="text-sm font-medium text-muted-foreground hover:text-primary transition-all duration-300 ease-in-out cursor-pointer">Anasayfa</button>
          <button className="text-sm font-medium text-muted-foreground hover:text-primary transition-all duration-300 ease-in-out cursor-pointer">Yazılar</button>
          <button className="text-sm font-medium text-muted-foreground hover:text-primary transition-all duration-300 ease-in-out cursor-pointer">Hakkımızda</button>
        </div>

        {/* Sağ Alan: Araçlar & Auth */}
        <div className="flex-1 flex items-center justify-end gap-4">
          <ThemeToggle />
          <div className="w-px h-6 bg-border mx-2"></div>
          <button className="px-4 py-2 text-sm font-medium text-foreground hover:text-primary transition-all duration-300 ease-in-out cursor-pointer">
            Kayıt Ol
          </button>
          <button className="px-5 py-2 text-sm font-medium bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 hover:shadow-lg hover:shadow-primary/20 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300 ease-in-out cursor-pointer">
            Giriş Yap
          </button>
        </div>
      </div>
    </nav>
  );
}
