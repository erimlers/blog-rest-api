"use client";

// Masaüstüne özel, geniş açılır menüleri olan tasarım
export default function DesktopNavbar() {
  return (
    <nav className="w-full h-16 border-b border-border bg-background/80 backdrop-blur-md sticky top-0 z-50">
      <div className="container mx-auto px-6 h-full flex items-center justify-between">
        <div className="text-xl font-bold tracking-tight text-primary">Blog (Desktop)</div>
        <div className="flex gap-4">
          <button className="px-4 py-2 text-sm font-medium hover:text-primary transition-colors">Yazılar</button>
          <button className="px-4 py-2 text-sm font-medium bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors">Giriş Yap</button>
        </div>
      </div>
    </nav>
  );
}
