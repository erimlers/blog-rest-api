"use client";

import { useSelector, useDispatch } from "react-redux";
import { logoutUser } from "@store/slices/authSlice";
import Link from "next/link";
import { User, LogOut, ChevronDown, PenSquare, Settings, Loader2, PenTool } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import NavbarSearch from "./NavbarSearch";

export default function DesktopNavbar() {
  const { isAuthenticated, user, isAuthChecked } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
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

  const handleLogout = async () => {
    setIsLoggingOut(true);
    // Yükleniyor animasyonunun gözükmesi için yapay bir gecikme (800ms)
    await new Promise((resolve) => setTimeout(resolve, 800));
    await dispatch(logoutUser());
    setIsDropdownOpen(false);
    setIsLoggingOut(false);
  };

  return (
    <nav className="w-full h-16 border-b border-border bg-background sticky top-0 z-50 transition-colors duration-500 ease-in-out">
      <div className="container mx-auto px-6 h-full flex items-center justify-between">
        
        {/* Sol Alan: Logo ve Arama (Giriş yapılmışsa) */}
        <div className="flex items-center justify-start gap-8">
          <Link href="/" className="text-3xl font-bold tracking-tight text-primary cursor-pointer hover:opacity-80 transition-opacity duration-300 flex-shrink-0">
            <span className="text-foreground">&lt;</span>Blog<span className="text-foreground">/&gt;</span>
          </Link>
          
          {isAuthenticated && (
            <div className="hidden md:block w-72">
              <NavbarSearch />
            </div>
          )}
        </div>

        {/* Sağ Alan: Araçlar & Auth */}
        <div className="flex items-center justify-end gap-3 sm:gap-4">
          
          {/* Kullanıcı Girişi / Profil */}
          {!isAuthChecked ? (
            <div className="flex gap-2">
              <div className="w-20 h-9 bg-muted rounded-lg animate-pulse"></div>
              <div className="w-20 h-9 bg-muted rounded-lg animate-pulse"></div>
            </div>
          ) : isAuthenticated ? (
            <div className="flex items-center gap-4">
              <Link 
                href="/posts/create" 
                className="hidden md:flex items-center gap-2 px-4 py-2 text-sm font-semibold bg-primary text-primary-foreground rounded-full hover:bg-primary/90 hover:scale-105 hover:shadow-lg hover:shadow-primary/20 transition-all duration-300 cursor-pointer"
              >
                <PenTool className="w-4 h-4" />
                <span>Yazı Oluştur</span>
              </Link>

              <div className="relative" ref={dropdownRef}>
                <button 
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center gap-2 p-1 pl-1 pr-3 text-sm font-medium text-foreground transition-all duration-300 ease-in-out rounded-full hover:bg-muted focus:outline-none border border-transparent hover:border-border"
                >
                  {user?.profileImage ? (
                    <img src={`${process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || "http://localhost:8080"}${user.profileImage}`} alt={user.username} className="w-8 h-8 rounded-full object-cover border border-border shrink-0" />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs border border-primary/20 shrink-0">
                      {((user?.name?.charAt(0) || '') + (user?.lastname?.charAt(0) || '')).toUpperCase() || <User className="w-4 h-4" />}
                    </div>
                  )}
                  <span className="truncate max-w-[100px]">@{user?.username}</span>
                  <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform duration-300 ${isDropdownOpen ? "rotate-180" : ""}`} />
                </button>

                {/* Dropdown Menu */}
                {isDropdownOpen && (
                  <div className="absolute right-0 mt-3 w-48 bg-background border border-border rounded-xl shadow-lg py-2 z-50 transform origin-top-right transition-all duration-200 ease-out">
                    <Link 
                      href={`/profile/${user.username}`} 
                      onClick={() => setIsDropdownOpen(false)}
                      className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-foreground hover:bg-muted hover:text-primary transition-colors cursor-pointer"
                    >
                      <User className="w-4 h-4" />
                      <span>Profilim</span>
                    </Link>
                    <Link 
                      href="/settings" 
                      onClick={() => setIsDropdownOpen(false)}
                      className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-foreground hover:bg-muted hover:text-primary transition-colors cursor-pointer"
                    >
                      <Settings className="w-4 h-4" />
                      <span>Ayarlar</span>
                    </Link>
                    <div className="w-full h-px bg-border my-1"></div>
                    <button 
                      onClick={handleLogout}
                      disabled={isLoggingOut}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-red-500 hover:bg-red-500/10 transition-colors cursor-pointer disabled:opacity-50"
                    >
                      {isLoggingOut ? <Loader2 className="w-4 h-4 animate-spin" /> : <LogOut className="w-4 h-4" />}
                      <span>{isLoggingOut ? "Çıkış Yapılıyor..." : "Çıkış Yap"}</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2 sm:gap-4">
              <Link href="/about" className="px-2 sm:px-4 py-2 text-sm font-medium text-muted-foreground hover:text-primary transition-all duration-300 ease-in-out cursor-pointer">
                Hakkımızda
              </Link>
              <Link href="?auth=register" scroll={false} className="px-3 sm:px-4 py-2 text-sm font-medium text-foreground hover:text-primary transition-all duration-300 ease-in-out cursor-pointer">
                Kayıt Ol
              </Link>
              <Link href="?auth=login" scroll={false} className="px-4 py-2 text-sm font-medium bg-primary text-primary-foreground rounded-full hover:bg-primary/90 hover:scale-105 hover:shadow-lg hover:shadow-primary/20 transition-all duration-300 ease-in-out cursor-pointer">
                Giriş Yap
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
