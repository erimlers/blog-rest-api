"use client";

import ThemeToggle from "@components/ui/ThemeToggle";
import { Menu, X, User, LogOut } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { logoutUser } from "@store/slices/authSlice";
import Link from "next/link";
import { useState, useEffect } from "react";

export default function MobileNavbar() {
  const { isAuthenticated, user } = useSelector((state) => state.auth);
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
      <nav className="w-full h-16 border-b border-border bg-background/70 backdrop-blur-lg sticky top-0 z-50 transition-all duration-300 ease-in-out">
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
        <div className="fixed inset-0 z-40 bg-background/95 backdrop-blur-sm pt-16 animate-in slide-in-from-top-full duration-300">
          <div className="container mx-auto px-4 py-8 flex flex-col h-full overflow-y-auto">
            
            {/* Navigasyon Linkleri */}
            <div className="flex flex-col gap-6 text-center mb-8">
              <Link href="/" onClick={() => setIsMenuOpen(false)} className="text-lg font-medium text-muted-foreground hover:text-primary transition-colors">Anasayfa</Link>
              <Link href="/posts" onClick={() => setIsMenuOpen(false)} className="text-lg font-medium text-muted-foreground hover:text-primary transition-colors">Yazılar</Link>
              <Link href="/about" onClick={() => setIsMenuOpen(false)} className="text-lg font-medium text-muted-foreground hover:text-primary transition-colors">Hakkımızda</Link>
            </div>

            <div className="w-full h-px bg-border mb-8"></div>

            {/* Auth Alanı */}
            <div className="flex flex-col gap-4">
              {isAuthenticated ? (
                <>
                  <div className="flex items-center justify-center gap-3 text-lg font-medium text-foreground mb-4">
                    <User className="w-5 h-5 text-primary" />
                    <span>Hesabım</span>
                  </div>
                  <Link 
                    href="/profile" 
                    onClick={() => setIsMenuOpen(false)}
                    className="w-full py-3 px-4 flex items-center justify-center gap-2 bg-muted text-foreground rounded-xl font-medium"
                  >
                    <User className="w-5 h-5" />
                    <span>Profilim</span>
                  </Link>
                  <button 
                    onClick={handleLogout}
                    className="w-full py-3 px-4 flex items-center justify-center gap-2 bg-red-500/10 text-red-500 rounded-xl font-medium"
                  >
                    <LogOut className="w-5 h-5" />
                    <span>Çıkış Yap</span>
                  </button>
                </>
              ) : (
                <>
                  <Link 
                    href="/auth/login" 
                    onClick={() => setIsMenuOpen(false)}
                    className="w-full py-3 flex items-center justify-center bg-primary text-primary-foreground rounded-xl font-medium"
                  >
                    Giriş Yap
                  </Link>
                  <Link 
                    href="/auth/register" 
                    onClick={() => setIsMenuOpen(false)}
                    className="w-full py-3 flex items-center justify-center border border-border text-foreground rounded-xl font-medium"
                  >
                    Kayıt Ol
                  </Link>
                </>
              )}
            </div>

          </div>
        </div>
      )}
    </>
  );
}
