"use client";

export default function Footer() {
  return (
    <footer className="w-full border-t border-border bg-background/70 backdrop-blur-lg mt-auto">
      <div className="container mx-auto px-4 py-6 flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Sol Taraf: Copyright */}
        <p className="text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} Blog. Tüm hakları saklıdır.
        </p>

        {/* Sağ Taraf: Linkler */}
        <div className="flex items-center gap-6 text-sm text-muted-foreground">
          <button className="hover:text-primary transition-colors">Hakkımızda</button>
          <button className="hover:text-primary transition-colors">İletişim</button>
          <button className="hover:text-primary transition-colors">Gizlilik Politikası</button>
        </div>
        
      </div>
    </footer>
  );
}
