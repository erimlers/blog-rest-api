"use client";

import ThemeToggle from "@components/ui/ThemeToggle";
import { useSelector, useDispatch } from "react-redux";
import { logoutUser } from "@store/slices/authSlice";
import Link from "next/link";
import { User, LogOut, ChevronDown, PenSquare } from "lucide-react";
import { useState, useRef, useEffect } from "react";

export default function DesktopNavbar() {
  const { isAuthenticated, user, isAuthChecked } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Dropdown dışına tıklandığında menüyü kapatmak için
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    dispatch(logoutUser());
    setIsDropdownOpen(false);
  };

  return (
    <nav className="w-full h-16 border-b border-border bg-background sticky top-0 z-50 transition-all duration-300 ease-in-out">
      <div className="container mx-auto px-6 h-full flex items-center justify-between">
        
        {/* Sol Alan: Logo */}
        <div className="flex-1 flex items-center justify-start">
          <Link href="/" className="text-2xl font-bold tracking-tight text-primary cursor-pointer hover:opacity-80 transition-opacity duration-300">
            <span className="text-foreground">&lt;</span>Blog<span className="text-foreground">/&gt;</span>
          </Link>
        </div>

        {/* Orta Alan: Navigasyon Linkleri */}
        <div className="flex-1 flex items-center justify-center gap-8">
          <Link href="/" className="text-sm font-medium text-muted-foreground hover:text-primary transition-all duration-300 ease-in-out cursor-pointer">Anasayfa</Link>
          <Link href="/posts" className="text-sm font-medium text-muted-foreground hover:text-primary transition-all duration-300 ease-in-out cursor-pointer">Yazılar</Link>
          <Link href="/about" className="text-sm font-medium text-muted-foreground hover:text-primary transition-all duration-300 ease-in-out cursor-pointer">Hakkımızda</Link>
        </div>

        {/* Sağ Alan: Araçlar & Auth */}
        <div className="flex-1 flex items-center justify-end gap-4">
          <ThemeToggle />
          <div className="w-px h-6 bg-border mx-2"></div>
          
          {/* Kullanıcı Girişi / Profil */}
          {!isAuthChecked ? (
            <div className="flex gap-2">
              <div className="w-20 h-9 bg-muted rounded-lg animate-pulse"></div>
              <div className="w-20 h-9 bg-muted rounded-lg animate-pulse"></div>
            </div>
          ) : isAuthenticated ? (
            <div className="relative" ref={dropdownRef}>
              <button 
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-foreground transition-all duration-300 ease-in-out rounded-lg hover:bg-muted focus:outline-none"
              >
                <User className="w-4 h-4 text-primary" />
                <span>Hesabım</span>
                <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${isDropdownOpen ? "rotate-180" : ""}`} />
              </button>

              {/* Dropdown Menu */}
              {isDropdownOpen && (
                <div className="absolute right-0 mt-3 w-48 bg-background border border-border rounded-xl shadow-lg py-2 z-50 transform origin-top-right transition-all duration-200 ease-out">
                  <Link 
                    href="/posts/create" 
                    onClick={() => setIsDropdownOpen(false)}
                    className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-foreground hover:bg-muted hover:text-primary transition-colors cursor-pointer"
                  >
                    <PenSquare className="w-4 h-4" />
                    <span>Yazı Oluştur</span>
                  </Link>
                  <Link 
                    href="/profile" 
                    onClick={() => setIsDropdownOpen(false)}
                    className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-foreground hover:bg-muted hover:text-primary transition-colors cursor-pointer"
                  >
                    <User className="w-4 h-4" />
                    <span>Profilim</span>
                  </Link>
                  <div className="w-full h-px bg-border my-1"></div>
                  <button 
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-red-500 hover:bg-red-500/10 transition-colors cursor-pointer"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Çıkış Yap</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link href="/auth/register" className="px-4 py-2 text-sm font-medium text-foreground hover:text-primary transition-all duration-300 ease-in-out cursor-pointer">
                Kayıt Ol
              </Link>
              <Link href="/auth/login" className="px-4 py-2 text-sm font-medium bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 hover:shadow-lg hover:shadow-primary/20 transition-all duration-300 ease-in-out cursor-pointer">
                Giriş Yap
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
