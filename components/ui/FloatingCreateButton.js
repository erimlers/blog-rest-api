"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSelector } from "react-redux";
import { PenSquare } from "lucide-react";

export default function FloatingCreateButton() {
  const { isAuthenticated, isAuthChecked } = useSelector((state) => state.auth);
  const pathname = usePathname();

  // Eğer sayfa tam olarak yüklenmediyse, kullanıcı giriş yapmamışsa FAB'ı gösterme.
  if (!isAuthChecked || !isAuthenticated) return null;

  // Yeni yazı oluşturma ekranında veya auth ekranlarında FAB'ı gizle
  const hiddenPaths = ["/posts/create", "/auth/login", "/auth/register"];
  if (hiddenPaths.includes(pathname)) return null;

  return (
    <Link
      href="/posts/create"
      className="fixed bottom-6 right-6 sm:bottom-10 sm:right-10 z-50 p-4 sm:p-5 bg-primary text-primary-foreground rounded-full shadow-xl shadow-primary/30 hover:bg-primary/90 hover:scale-110 hover:-translate-y-1 transition-all duration-300 group flex items-center justify-center cursor-pointer"
      title="Yeni Yazı Oluştur"
    >
      <PenSquare className="w-6 h-6 sm:w-7 sm:h-7" />
    </Link>
  );
}
