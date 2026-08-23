"use client";

import { Menu, X, User, LogOut, PenSquare, Settings, Loader2, PenTool } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { logoutUser } from "@store/slices/authSlice";
import Link from "next/link";
import { useState, useEffect } from "react";
import NavbarSearch from "./NavbarSearch";

export default function MobileNavbar() {
  const { isAuthenticated, user, isAuthChecked } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

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

  const handleLogout = async () => {
    setIsLoggingOut(true);
    // Yükleniyor animasyonunun gözükmesi için yapay bir gecikme (800ms)
    await new Promise((resolve) => setTimeout(resolve, 800));
    await dispatch(logoutUser());
    setIsMenuOpen(false);
    setIsLoggingOut(false);
  };

  return (
    <>
      <nav className="w-full h-16 border-b border-border bg-background sticky top-0 z-50 transition-colors duration-500 ease-in-out">
        <div className="container mx-auto px-4 h-full flex items-center justify-between">
          
          {/* Sol Alan: Logo */}
          <div className="flex shrink-0 items-center justify-start">
            <Link href="/" onClick={() => setIsMenuOpen(false)} className="text-xl font-bold tracking-tight text-primary cursor-pointer hover:opacity-80 transition-opacity duration-300">
              <span className="text-foreground">&lt;</span>Blog<span className="text-foreground">/&gt;</span>
            </Link>
          </div>

          {/* Sağ Alan: Menü */}
          <div className="flex items-center gap-2">
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
              {/* Arama Çubuğu (Giriş Yapmış Kullanıcı) */}
              {isAuthenticated && (
                <div className="mb-4">
                  <NavbarSearch />
                </div>
              )}
              
              <Link href="/about" onClick={() => setIsMenuOpen(false)} className="text-lg font-medium text-muted-foreground hover:text-primary transition-colors cursor-pointer py-2">Hakkımızda</Link>
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
                    {user?.profileImage ? (
                      <img src={`${process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || "http://localhost:8080"}${user.profileImage}`} alt={user.username} className="w-12 h-12 rounded-full object-cover border border-border shrink-0" />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm border border-primary/20 shrink-0">
                        {((user?.name?.charAt(0) || '') + (user?.lastname?.charAt(0) || '')).toUpperCase() || <User className="w-5 h-5" />}
                      </div>
                    )}
                    <div className="flex flex-col min-w-0">
                      <p className="text-sm font-semibold text-foreground truncate">
                        {user?.name} {user?.lastname}
                      </p>
                      <p className="text-xs text-muted-foreground truncate">@{user?.username}</p>
                    </div>
                  </div>
                  
                  <div className="flex flex-col gap-2">
                    <Link 
                      href="/posts/create" 
                      onClick={() => setIsMenuOpen(false)}
                      className="flex items-center justify-center gap-3 w-full px-4 py-3.5 mb-2 text-sm font-bold bg-primary text-primary-foreground rounded-xl shadow-lg shadow-primary/20 hover:bg-primary/90 transition-colors"
                    >
                      <PenTool className="w-5 h-5" />
                      <span>Yeni Yazı Oluştur</span>
                    </Link>
                    <Link 
                      href={`/profile/${user.username}`} 
                      onClick={() => setIsMenuOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-foreground hover:bg-muted hover:text-primary transition-colors cursor-pointer rounded-xl"
                    >
                      <User className="w-4 h-4" />
                      Profilim
                    </Link>
                    <Link 
                      href="/settings" 
                      onClick={() => setIsMenuOpen(false)}
                      className="flex items-center justify-center gap-2 w-full px-4 py-3 text-sm font-medium text-foreground bg-muted hover:bg-muted/80 rounded-xl transition-colors"
                    >
                      <Settings className="w-4 h-4" />
                      Ayarlar
                    </Link>
                    <button 
                      onClick={handleLogout}
                      disabled={isLoggingOut}
                      className="flex items-center justify-between w-full px-4 py-3 text-sm font-medium text-red-500 bg-red-500/10 hover:bg-red-500/20 rounded-xl transition-colors disabled:opacity-50"
                    >
                      <span className="font-medium">{isLoggingOut ? "Çıkış Yapılıyor..." : "Çıkış Yap"}</span>
                      {isLoggingOut ? <Loader2 className="w-4 h-4 animate-spin" /> : <LogOut className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col gap-3">
                  <Link 
                    href="?auth=login"
                    scroll={false} 
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center justify-center w-full px-4 py-3 text-sm font-medium bg-primary text-primary-foreground rounded-xl shadow-lg shadow-primary/20 hover:bg-primary/90 transition-colors"
                  >
                    Giriş Yap
                  </Link>
                  <Link 
                    href="?auth=register"
                    scroll={false} 
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
