"use client";

import { useSelector, useDispatch } from "react-redux";
import { logoutUser } from "@store/slices/authSlice";
import { fetchNotifications, markAsRead, markAllAsRead, deleteNotification, deleteAllNotifications } from "@store/slices/notificationSlice";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { User, LogOut, ChevronDown, Bell, CheckCheck, FileText, Settings, Loader2, PenTool, LayoutDashboard, Check, X } from "lucide-react";
import { useState, useRef, useEffect, Suspense } from "react";
import NavbarSearch from "./NavbarSearch";  

export default function DesktopNavbar() {
  const { isAuthenticated, user, isAuthChecked } = useSelector((state) => state.auth);
  const { items: notifications, unreadCount } = useSelector((state) => state.notifications);
  const dispatch = useDispatch();
  const pathname = usePathname();
  
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  
  const dropdownRef = useRef(null);
  const notifRef = useRef(null);

  // Dropdown dışına tıklandığında menüyü kapatmak için
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setIsNotifOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchNotifications());
    }
  }, [isAuthenticated, pathname, isNotifOpen, dispatch]);

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
          
          <div className="hidden md:block w-72">
            <NavbarSearch />
          </div>
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

              {/* Bildirim İkonu ve Menüsü */}
              <div className="relative" ref={notifRef}>
                <button
                  onClick={() => setIsNotifOpen(!isNotifOpen)}
                  className="relative p-2 rounded-full hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                >
                  <Bell className="w-5 h-5" />
                  {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 flex h-2.5 w-2.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500"></span>
                    </span>
                  )}
                </button>

                {isNotifOpen && (
                  <div className="absolute right-0 mt-3 w-80 max-w-[calc(100vw-2rem)] bg-background border border-border rounded-xl shadow-lg z-50 transform origin-top-right transition-all duration-200 overflow-hidden flex flex-col max-h-[400px]">
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
                                  setIsNotifOpen(false);
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
                      href="/dashboard" 
                      onClick={() => setIsDropdownOpen(false)}
                      className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-foreground hover:bg-muted hover:text-primary transition-colors cursor-pointer"
                    >
                      <LayoutDashboard className="w-4 h-4" />
                      <span>Yönetim Paneli</span>
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
