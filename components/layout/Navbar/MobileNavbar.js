"use client";

import ThemeToggle from "@components/ui/ThemeToggle";
import { Menu, X, User, LogOut, PenSquare } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { logoutUser } from "@store/slices/authSlice";
import Link from "next/link";
import { useState, useEffect } from "react";

export default function MobileNavbar() {
  const { isAuthenticated, user, isAuthChecked } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Menü açıkken arkaplanı kaydırmayı engelle
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMenuOpen]);

  const handleLogout = () => {
    dispatch(logoutUser());
    setIsMenuOpen(false);
  };

  return (
    <>
      <nav className="w-full h-16 border-b border-border bg-background sticky top-0 z-50 transition-all duration-300 ease-in-out">
        <div className="container mx-auto px-4 h-full flex items-center justify-between">
          
          {/* Sol Alan: Logo */}
          <Link href="/" onClick={() => setIsMenuOpen(false)} className="text-xl font-bold tracking-tight text-primary cursor-pointer hover:opacity-80 transition-opacity duration-300">
            <span className="text-foreground">&lt;</span>Blog<span className="text-foreground">/&gt;</span>
          </Link>

          {/* Sağ Alan: Tema ve Menü */}
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-md transition-all duration-300 ease-in-out focus:outline-none"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobil Menü Overlay */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-40 bg-background pt-16 animate-in slide-in-from-top-full duration-300">
          <div className="container mx-auto px-4 py-8 flex flex-col h-full overflow-y-auto">
            
            {/* Navigasyon Linkleri */}
            <div className="flex flex-col gap-6 text-center mb-8">
              <Link href="/" onClick={() => setIsMenuOpen(false)} className="text-lg font-medium text-muted-foreground hover:text-primary transition-colors">Anasayfa</Link>
              <Link href="/posts" onClick={() => setIsMenuOpen(false)} className="text-lg font-medium text-muted-foreground hover:text-primary transition-colors">Yazılar</Link>
              <Link href="/about" onClick={() => setIsMenuOpen(false)} className="text-lg font-medium text-muted-foreground hover:text-primary transition-colors">Hakkımızda</Link>
            </div>

            <div className="w-full h-px bg-border mb-8"></div>

            {/* Auth Bölümü */}
            <div className="pt-6">
              {!isAuthChecked ? (
                <div className="w-full flex flex-col gap-3">
                  <div className="w-full h-11 bg-muted rounded-xl animate-pulse"></div>
                  <div className="w-full h-11 bg-muted rounded-xl animate-pulse"></div>
                </div>
              ) : isAuthenticated ? (
                <div className="flex flex-col gap-4">
                  <div className="flex items-center gap-3 px-4 py-3 bg-muted/50 rounded-xl">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <User className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">Hesabım</p>
                      <p className="text-xs text-muted-foreground">Aktif Oturum</p>
                    </div>
                  </div>
                  
                  <div className="flex flex-col gap-2">
                    <Link 
                      href="/posts/create" 
                      onClick={() => setIsMenuOpen(false)}
                      className="flex items-center justify-center gap-2 w-full px-4 py-3 text-sm font-medium text-foreground bg-primary/10 hover:bg-primary/20 text-primary rounded-xl transition-colors"
                    >
                      <PenSquare className="w-4 h-4" />
                      Yazı Oluştur
                    </Link>
                    <Link 
                      href="/profile" 
                      onClick={() => setIsMenuOpen(false)}
                      className="flex items-center justify-center gap-2 w-full px-4 py-3 text-sm font-medium text-foreground bg-muted hover:bg-muted/80 rounded-xl transition-colors"
                    >
                      <User className="w-4 h-4" />
                      Profilim
                    </Link>
                    <button 
                      onClick={() => {
                        handleLogout();
                        setIsMenuOpen(false);
                      }}
                      className="flex items-center justify-center gap-2 w-full px-4 py-3 text-sm font-medium text-red-500 bg-red-500/10 hover:bg-red-500/20 rounded-xl transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      Çıkış Yap
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col gap-3">
                  <Link 
                    href="/auth/login" 
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center justify-center w-full px-4 py-3 text-sm font-medium bg-primary text-primary-foreground rounded-xl shadow-lg shadow-primary/20 hover:bg-primary/90 transition-colors"
                  >
                    Giriş Yap
                  </Link>
                  <Link 
                    href="/auth/register" 
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center justify-center w-full px-4 py-3 text-sm font-medium text-foreground bg-muted hover:bg-muted/80 rounded-xl transition-colors"
                  >
                    Kayıt Ol
                  </Link>
                </div>
              )}
            </div>

          </div>
        </div>
      )}
    </>
  );
}
