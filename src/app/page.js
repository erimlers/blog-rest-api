"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, Sparkles, PenTool, BookOpen } from "lucide-react";
import PostCard from "@components/ui/PostCard";
import api from "@lib/api";
import { useSelector } from "react-redux";

export default function Home() {
  const [recentPosts, setRecentPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { isAuthenticated } = useSelector((state) => state.auth);

  useEffect(() => {
    const fetchRecent = async () => {
      try {
        // En yeni 3 yazıyı getir (Backend API sıralaması destekliyorsa limit=3 veya sayfa 1)
        const res = await api.get("/posts?page=1&limit=3");
        // API response formatına göre posts array'ini al
        if (res.data && res.data.data && res.data.data.posts) {
          setRecentPosts(res.data.data.posts);
        } else if (res.data && res.data.posts) {
          setRecentPosts(res.data.posts);
        } else if (Array.isArray(res.data)) {
          setRecentPosts(res.data.slice(0, 3));
        }
      } catch (error) {
        console.error("Son yazılar alınamadı:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRecent();
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-background selection:bg-primary/20">
      
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-24 pb-32 flex flex-col items-center justify-center text-center px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-muted/50 to-background border-b border-border">
        {/* Dekoratif Arka Plan Işıkları (Glassmorphism / Glow Effects) */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[120px] -z-10 mix-blend-multiply opacity-70 animate-pulse-slow pointer-events-none"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[100px] -z-10 mix-blend-multiply opacity-50 pointer-events-none"></div>

        <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-1000 ease-out">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary border border-primary/20 text-sm font-medium mb-4">
            <Sparkles className="w-4 h-4" />
            <span>Yeni Nesil Blog Platformu</span>
          </div>
          
          <h1 className="text-5xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-foreground leading-[1.1]">
            Kelimelerin Gücünü <br className="hidden sm:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary/60">Keşfet</span>
          </h1>
          
          <p className="max-w-2xl mx-auto text-xl text-muted-foreground leading-relaxed">
            İlgi çekici hikayeler oku, yeni fikirler edin veya kendi dünyanı kitlelerle paylaş. 
            Okuyucular ve yazarlar için tasarlanmış modern altyapımızla tanış.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link 
              href="/posts" 
              className="w-full sm:w-auto px-8 py-4 text-base font-semibold bg-primary text-primary-foreground rounded-full hover:bg-primary/90 hover:scale-105 hover:shadow-xl hover:shadow-primary/20 transition-all duration-300 flex items-center justify-center gap-2"
            >
              <BookOpen className="w-5 h-5" />
              Hemen Okumaya Başla
            </Link>
            {!isAuthenticated && (
              <Link 
                href="/auth/register" 
                className="w-full sm:w-auto px-8 py-4 text-base font-semibold bg-muted text-foreground border border-border rounded-full hover:bg-muted/80 hover:border-foreground/20 hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2"
              >
                <PenTool className="w-5 h-5" />
                Aramıza Katıl
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* İçerik Vitrini (Son Yazılar) */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="flex flex-col sm:flex-row items-center justify-between mb-12 gap-4">
          <div>
            <h2 className="text-3xl font-bold text-foreground">Editörün Seçimleri</h2>
            <p className="text-muted-foreground mt-2">Platformumuzdaki en yeni ve güncel yazılara göz atın.</p>
          </div>
          <Link 
            href="/posts" 
            className="group flex items-center gap-2 px-5 py-2.5 rounded-full bg-muted/50 border border-border text-sm font-medium hover:bg-muted hover:text-primary transition-all duration-300"
          >
            Tümünü Gör
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {isLoading ? (
            // Skeleton Loading State
            [...Array(3)].map((_, i) => (
              <div key={i} className="flex flex-col gap-4 animate-pulse">
                <div className="w-full h-48 bg-muted rounded-2xl"></div>
                <div className="w-3/4 h-6 bg-muted rounded-lg"></div>
                <div className="w-full h-4 bg-muted rounded-lg"></div>
                <div className="w-1/2 h-4 bg-muted rounded-lg"></div>
              </div>
            ))
          ) : recentPosts.length > 0 ? (
            recentPosts.slice(0, 3).map((post) => (
              <PostCard key={post._id} post={post} />
            ))
          ) : (
            <div className="col-span-full py-12 text-center text-muted-foreground bg-muted/30 rounded-2xl border border-border border-dashed">
              Henüz bir yazı bulunmuyor.
            </div>
          )}
        </div>
      </section>

    </div>
  );
}
