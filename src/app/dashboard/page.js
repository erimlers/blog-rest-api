"use client";

import { useSelector } from "react-redux";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import PostDashboard from "../../../components/settings/PostDashboard";

export default function DashboardPage() {
  const { isAuthenticated, isAuthChecked } = useSelector((state) => state.auth);
  const router = useRouter();

  // Auth Koruması
  useEffect(() => {
    if (isAuthChecked && !isAuthenticated) {
      router.push("/auth/login");
    }
  }, [isAuthChecked, isAuthenticated, router]);

  if (!isAuthChecked || !isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-300">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Yönetim Paneli</h1>
          <p className="text-muted-foreground mt-2">Yazılarını ve istatistiklerini buradan yönetebilirsin.</p>
        </div>
        
        <div className="bg-card p-6 sm:p-8 rounded-2xl border border-border shadow-sm">
          <PostDashboard />
        </div>
      </div>
    </div>
  );
}
