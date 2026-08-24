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
      <div className="max-w-5xl mx-auto animate-in fade-in duration-300">
        <PostDashboard />
      </div>
    </div>
  );
}
