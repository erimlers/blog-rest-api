"use client";

import { Menu, X, User, LogOut, Settings, Loader2, PenTool, Search, Home, LayoutDashboard, Bell, CheckCheck, FileText, Check } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { logoutUser } from "@store/slices/authSlice";
import { fetchNotifications, markAsRead, markAllAsRead, deleteNotification, deleteAllNotifications } from "@store/slices/notificationSlice";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import NavbarSearch from "./NavbarSearch";

export default function MobileNavbar() {
  const { isAuthenticated, user, isAuthChecked } = useSelector((state) => state.auth);
  const { items: notifications, unreadCount } = useSelector((state) => state.notifications);
  const dispatch = useDispatch();
  const pathname = usePathname();
  
  // State Yönetimi
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  
  const profileDropdownRef = useRef(null);
  const notifRef = useRef(null);

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

  // Profil menüsü ve bildirim dışına tıklandığında kapatma
  useEffect(() => {
    function handleClickOutside(event) {
      if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setIsNotifOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchNotifications());
    }
  }, [isAuthenticated, pathname, isNotifOpen, dispatch]);

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
    setIsNotifOpen(false);
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
            {/* Her Zaman Görünen Arama İkonu */}
            <button 
              onClick={() => {
                setIsSearchOpen(!isSearchOpen);
                setIsProfileOpen(false);
                setIsMenuOpen(false);
                setIsNotifOpen(false);
              }}
              className={`p-2 rounded-full focus:outline-none transition-colors ${isSearchOpen ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:text-foreground'}`}
            >
              <Search className="w-5 h-5" />
            </button>

            {!isAuthChecked ? (
              <div className="w-8 h-8 rounded-full bg-muted animate-pulse"></div>
            ) : isAuthenticated ? (
              <>
                {/* Bildirim İkonu ve Dropdown */}
                <div className="relative" ref={notifRef}>
                  <button
                    onClick={() => {
                      setIsNotifOpen(!isNotifOpen);
                      setIsProfileOpen(false);
                      setIsSearchOpen(false);
                      setIsMenuOpen(false);
                    }}
                    className="relative p-2 rounded-full focus:outline-none text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <Bell className="w-5 h-5" />
                    {unreadCount > 0 && (
                      <span className="absolute top-1 right-1 flex h-2.5 w-2.5">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500"></span>
                      </span>
                    )}
                  </button>

                  {/* Mobil Bildirim Menüsü */}
                  {isNotifOpen && (
                    <div className="absolute right-0 mt-3 w-80 max-w-[calc(100vw-2rem)] bg-background border border-border rounded-xl shadow-2xl z-50 transform origin-top-right transition-all duration-200 overflow-hidden flex flex-col max-h-[60vh] sm:max-h-[400px]">
                      <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-muted/30">
                        <h3 className="font-semibold text-foreground text-sm">Bildirimler</h3>
                        {unreadCount > 0 && (
                          <button 
                            onClick={() => dispatch(markAllAsRead())}
                            className="text-xs text-primary hover:underline flex items-center gap-1"
                          >
                            <CheckCheck className="w-3 h-3" /> Hepsini Oku
                          </button>
                        )}
                      </div>
                      
                      <div className="overflow-y-auto flex-1">
                        {notifications.length === 0 ? (
                          <div className="px-4 py-8 text-center text-sm text-muted-foreground flex flex-col items-center">
                            <Bell className="w-8 h-8 mb-2 opacity-20" />
                            Henüz bildirimin yok.
                          </div>
                        ) : (
                          <div className="flex flex-col">
                            {notifications.map((notif) => (
                              <div key={notif._id} className="group relative flex border-b border-border/50 last:border-0">
                                <Link
                                  href={`/posts/${notif.post?._id || ''}`}
                                  onClick={() => {
                                    if (!notif.isRead) dispatch(markAsRead(notif._id));
                                    closeAllMenus();
                                  }}
                                  className={`flex-1 flex gap-3 px-4 py-3 transition-colors ${!notif.isRead ? 'bg-primary/5 hover:bg-primary/10' : 'hover:bg-muted/50'}`}
                                >
                                  <div className="relative shrink-0 mt-1">
                                    {notif.sender?.profileImage ? (
                                      <img 
                                        src={`${process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || "http://localhost:8080"}${notif.sender.profileImage}`} 
                                        alt="" 
                                        className="w-10 h-10 rounded-full object-cover" 
                                      />
                                    ) : (
                                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm shrink-0">
                                        {(notif.sender?.username?.charAt(0) || <User className="w-5 h-5" />)}
                                      </div>
                                    )}
                                    {!notif.isRead && <div className="absolute -top-1 -right-1 w-3 h-3 bg-primary rounded-full border-2 border-background"></div>}
                                  </div>
                                  <div className="flex-1 min-w-0 flex flex-col">
                                    <p className="text-sm text-foreground leading-tight">
                                      <span className="font-bold">@{notif.sender?.username}</span> yeni bir yazı paylaştı: 
                                    </p>
                                    <p className="text-sm text-muted-foreground truncate mt-0.5 flex items-center gap-1">
                                      <FileText className="w-3 h-3" /> {notif.post?.title || "Yazı silinmiş olabilir"}
                                    </p>
                                  </div>
                                </Link>

                                {/* Hover Actions */}
                                <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity bg-background/80 backdrop-blur-sm p-1 rounded-lg border border-border shadow-sm">
                                  {!notif.isRead && (
                                    <button 
                                      onClick={(e) => { e.stopPropagation(); dispatch(markAsRead(notif._id)); }}
                                      className="p-1.5 text-green-500 hover:bg-green-500/10 rounded-md transition-colors"
                                      title="Okundu İşaretle"
                                    >
                                      <Check className="w-4 h-4" />
                                    </button>
                                  )}
                                  <button 
                                    onClick={(e) => { e.stopPropagation(); dispatch(deleteNotification(notif._id)); }}
                                    className="p-1.5 text-red-500 hover:bg-red-500/10 rounded-md transition-colors"
                                    title="Bildirimi Sil"
                                  >
                                    <X className="w-4 h-4" />
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Bottom Actions */}
                      {notifications.length > 0 && (
                        <div className="border-t border-border bg-muted/10 p-2">
                          <button 
                            onClick={() => dispatch(deleteAllNotifications())}
                            className="w-full text-xs font-medium text-red-500 hover:bg-red-500/10 py-2 rounded-md transition-colors"
                          >
                            Hepsini Sil
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>

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

        {/* Tepeden İnen Arama Çubuğu */}
        {isSearchOpen && (
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
          
          {isAuthenticated && (
            <Link 
              href="/dashboard" 
              onClick={closeAllMenus}
              className="flex items-center gap-4 px-4 py-3 text-base font-medium text-foreground hover:bg-muted hover:text-primary transition-colors rounded-xl"
            >
              <LayoutDashboard className="w-5 h-5 text-primary" />
              <span>Yönetim Paneli</span>
            </Link>
          )}

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
