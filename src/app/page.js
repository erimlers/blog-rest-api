"use client";

import Link from "next/link";
import { ArrowRight, Sparkles, PenTool, BookOpen, UserPlus, FileText, Loader2 } from "lucide-react";
import { useSelector } from "react-redux";
import PostsPage from "./posts/page";

export default function Home() {
  const { isAuthenticated, isAuthChecked } = useSelector((state) => state.auth);

  // Auth durumu kontrol edilirken kısa bir yükleme ekranı
  if (!isAuthChecked) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  // Kullanıcı giriş yapmışsa doğrudan postları (Yazılar sayfasını) göster
  if (isAuthenticated) {
    return <PostsPage />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-background selection:bg-primary/20">

      {/* Hero Section */}
      <section className="relative overflow-hidden flex-1 flex items-center px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-background via-background to-muted/30">
        {/* Arkadaki noktalı/çizgili grid deseni (Modern görünüm) */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>

        <div className="container mx-auto max-w-7xl relative z-10 py-20 lg:py-32 flex flex-col lg:flex-row items-center justify-between gap-12">

          {/* Sol Taraf: Metin ve Butonlar */}
          <div className="w-full lg:w-1/2 space-y-8 animate-in fade-in slide-in-from-left-8 duration-1000 ease-out text-left">
           

            <h1 className="text-5xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-foreground leading-[1.1]">
              Kelimelerin <br className="hidden sm:block" /> Gücünü <br className="hidden sm:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary/60">Keşfet</span>
            </h1>

            <p className="text-xl text-muted-foreground leading-relaxed font-light max-w-lg">
              İlgi çekici hikayeler oku, yeni fikirler edin veya kendi dünyanı kitlelerle paylaş.
              Okuyucular ve yazarlar için tasarlandı.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-start gap-4 pt-4">
              <Link
                href="/posts"
                className="w-full sm:w-auto px-8 py-4 text-base font-semibold bg-primary text-primary-foreground rounded-full hover:bg-primary/90 hover:scale-105 hover:shadow-xl hover:shadow-primary/20 transition-all duration-300 flex items-center justify-center gap-2"
              >
                <BookOpen className="w-5 h-5" />
                Keşfetmeye Başla
              </Link>
              {!isAuthenticated && (
                <Link
                  href="?auth=register"
                  scroll={false}
                  className="w-full sm:w-auto px-8 py-4 text-base font-semibold bg-muted text-foreground border border-border rounded-full hover:bg-muted/80 hover:border-foreground/20 hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2"
                >
                  <PenTool className="w-5 h-5" />
                  Aramıza Katıl
                </Link>
              )}
            </div>
          </div>

          {/* Sağ Taraf: Modern Görsel / İllüstrasyon Kutusu */}
          <div className="w-full lg:w-1/2 relative hidden lg:block animate-in fade-in slide-in-from-right-8 duration-1000 ease-out">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-primary/20 rounded-full blur-[100px] -z-10 opacity-60 animate-pulse-slow"></div>

            {/* Sahte Editör Arayüzü (Mockup) */}
            <div className="relative bg-background/50 backdrop-blur-xl border border-border rounded-2xl p-6 shadow-2xl transform rotate-3 hover:rotate-0 transition-transform duration-500">
              <div className="flex items-center gap-2 mb-6">
                <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
                <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
              </div>
              <div className="space-y-4">
                <div className="h-6 bg-muted rounded-md w-3/4"></div>
                <div className="h-4 bg-muted rounded-md w-1/2"></div>
                <div className="h-32 bg-muted/30 rounded-xl mt-6 border border-dashed border-border flex flex-col items-center justify-center text-muted-foreground gap-3 group hover:bg-muted/50 hover:border-primary/50 transition-all duration-300">
                  <div className="p-3 bg-background rounded-full shadow-sm group-hover:scale-110 group-hover:shadow-md transition-all duration-300">
                    <Sparkles className="w-5 h-5 text-primary" />
                  </div>
                  <span className="text-sm font-medium group-hover:text-foreground transition-colors duration-300">Fikirlerini Özgürce Paylaş</span>
                </div>
                <div className="flex gap-3 mt-6 items-center">
                  <div className="w-10 h-10 rounded-full bg-primary/20 flex-shrink-0"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-2.5 bg-muted rounded-md w-1/4"></div>
                    <div className="h-2 bg-muted rounded-md w-1/2"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

    </div>
  );
}
