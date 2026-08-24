"use client";

import { Menu, X, User, LogOut, Settings, Loader2, PenTool, Search, Home, LayoutDashboard } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { logoutUser } from "@store/slices/authSlice";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import NavbarSearch from "./NavbarSearch";

export default function MobileNavbar() {
  const { isAuthenticated, user, isAuthChecked } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  
  // State Yönetimi
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  
  const profileDropdownRef = useRef(null);

  // Sol menü açıkken arkaplanı kaydırmayı engelle
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

  // Profil menüsü dışına tıklandığında kapatma
  useEffect(() => {
    function handleClickOutside(event) {
      if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    await new Promise((resolve) => setTimeout(resolve, 800));
    await dispatch(logoutUser());
    setIsProfileOpen(false);
    setIsMenuOpen(false);
    setIsLoggingOut(false);
  };

  const closeAllMenus = () => {
    setIsMenuOpen(false);
    setIsProfileOpen(false);
    setIsSearchOpen(false);
  };

  return (
    <>
      <nav className="w-full h-16 border-b border-border bg-background relative z-40 transition-colors duration-500 ease-in-out">
        <div className="container mx-auto px-4 h-full flex items-center justify-between">
          
          {/* Sol Alan: Menü İkonu & Logo */}
          <div className="flex items-center gap-3">
            <button 
              onClick={() => {
                setIsMenuOpen(!isMenuOpen);
                setIsProfileOpen(false);
                setIsSearchOpen(false);
              }}
              className="p-1 -ml-1 text-muted-foreground hover:text-foreground focus:outline-none"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
            <Link href="/" onClick={closeAllMenus} className="text-2xl font-bold tracking-tight text-primary cursor-pointer hover:opacity-80 transition-opacity">
              <span className="text-foreground">&lt;</span>Blog<span className="text-foreground">/&gt;</span>
            </Link>
          </div>

          {/* Sağ Alan: Arama İkonu & Profil */}
          <div className="flex items-center gap-3">
            {!isAuthChecked ? (
              <div className="w-8 h-8 rounded-full bg-muted animate-pulse"></div>
            ) : isAuthenticated ? (
              <>
                {/* Arama İkonu */}
                <button 
                  onClick={() => {
                    setIsSearchOpen(!isSearchOpen);
                    setIsProfileOpen(false);
                    setIsMenuOpen(false);
                  }}
                  className={`p-2 rounded-full focus:outline-none transition-colors ${isSearchOpen ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:text-foreground'}`}
                >
                  <Search className="w-5 h-5" />
                </button>
                
                {/* Profil Resmi & Dropdown */}
                <div className="relative" ref={profileDropdownRef}>
                  <button 
                    onClick={() => {
                      setIsProfileOpen(!isProfileOpen);
                      setIsSearchOpen(false);
                      setIsMenuOpen(false);
                    }}
                    className="focus:outline-none rounded-full overflow-hidden border border-transparent hover:border-border transition-colors"
                  >
                    {user?.profileImage ? (
                      <img src={`${process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || "http://localhost:8080"}${user.profileImage}`} alt={user.username} className="w-8 h-8 rounded-full object-cover shrink-0" />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs shrink-0">
                        {((user?.name?.charAt(0) || '') + (user?.lastname?.charAt(0) || '')).toUpperCase() || <User className="w-4 h-4" />}
                      </div>
                    )}
                  </button>

                  {/* Profil Açılır Menüsü */}
                  {isProfileOpen && (
                    <div className="absolute right-0 mt-3 w-48 bg-background border border-border rounded-xl shadow-lg py-2 z-50 transform origin-top-right transition-all duration-200 ease-out animate-in fade-in zoom-in-95">
                      <Link 
                        href={`/profile/${user.username}`} 
                        onClick={closeAllMenus}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-foreground hover:bg-muted hover:text-primary transition-colors cursor-pointer"
                      >
                        <User className="w-4 h-4" />
                        <span>Profilim</span>
                      </Link>
                      <Link 
                        href="/dashboard" 
                        onClick={closeAllMenus}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-foreground hover:bg-muted hover:text-primary transition-colors cursor-pointer"
                      >
                        <LayoutDashboard className="w-4 h-4" />
                        <span>Yönetim Paneli</span>
                      </Link>
                      <Link 
                        href="/settings" 
                        onClick={closeAllMenus}
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
              </>
            ) : (
              <div className="flex items-center gap-2">
                <Link href="?auth=login" scroll={false} onClick={closeAllMenus} className="px-3 py-1.5 text-sm font-medium bg-primary text-primary-foreground rounded-full hover:bg-primary/90 transition-all">
                  Giriş Yap
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Tepeden İnen Arama Çubuğu (Giriş Yapmışken) */}
        {isSearchOpen && isAuthenticated && (
          <div className="absolute top-16 left-0 w-full bg-background border-b border-border shadow-md px-4 py-3 animate-in slide-in-from-top-4 duration-300 z-40">
            <NavbarSearch />
          </div>
        )}
      </nav>

      {/* Arkaplan Karartma */}
      <div 
        className={`fixed inset-0 top-16 z-[45] bg-black/40 transition-opacity duration-500 ease-in-out ${isMenuOpen ? "opacity-100" : "opacity-0 pointer-events-none"}`}
        onClick={closeAllMenus}
      ></div>
      
      {/* Sol Panel (Sidebar) */}
      <div 
        className={`fixed inset-y-0 top-16 left-0 z-[50] w-[65vw] max-w-[280px] bg-background border-r border-border shadow-2xl flex flex-col transform transition-transform duration-500 ease-in-out ${isMenuOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className="flex flex-col gap-2 p-4 text-left mt-2">
          <Link 
            href="/" 
            onClick={closeAllMenus} 
            className="flex items-center gap-4 px-4 py-3 text-base font-medium text-foreground hover:bg-muted hover:text-primary transition-colors rounded-xl"
          >
            <Home className="w-5 h-5 text-primary" />
            <span>Anasayfa</span>
          </Link>
          
          <Link 
            href="/posts/create" 
            onClick={closeAllMenus}
            className="flex items-center gap-4 px-4 py-3 text-base font-medium text-foreground hover:bg-muted hover:text-primary transition-colors rounded-xl"
          >
            <PenTool className="w-5 h-5 text-primary" />
            <span>Yazı Oluştur</span>
          </Link>
        </div>
      </div>
    </>
  );
}
