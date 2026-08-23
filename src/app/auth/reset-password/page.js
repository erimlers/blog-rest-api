"use client";

import { useState, Suspense } from "react";
import { useForm } from "react-hook-form";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Loader2, ArrowLeft, CheckCircle2, AlertCircle } from "lucide-react";
import api from "@lib/api";
import ENDPOINTS from "@lib/endpoints";

function ResetPasswordContent() {
  const { register, handleSubmit, watch, formState: { errors } } = useForm();
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  
  const [isLoading, setIsLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  
  const newPassword = watch("newPassword");

  if (!token) {
    return (
      <div className="min-h-[calc(100vh-10rem)] flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-muted border border-border rounded-2xl p-10 shadow-lg shadow-primary/5 text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-foreground mb-2">Geçersiz İstek</h2>
          <p className="text-muted-foreground mb-6">Şifre sıfırlama bağlantısı eksik veya geçersiz.</p>
          <Link 
            href="/auth/forgot-password"
            className="px-4 py-2 bg-primary text-primary-foreground rounded-xl font-medium"
          >
            Yeniden Bağlantı İste
          </Link>
        </div>
      </div>
    );
  }

  const onSubmit = async (data) => {
    setIsLoading(true);
    setSuccessMsg("");
    setErrorMsg("");
    
    try {
      const response = await api.post(ENDPOINTS.AUTH.RESET_PASSWORD, {
        token,
        newPassword: data.newPassword
      });
      setSuccessMsg(response.message || "Şifreniz başarıyla güncellendi.");
      
      // 3 saniye sonra login sayfasına yönlendir
      setTimeout(() => {
        router.push("/auth/login?message=" + encodeURIComponent("Şifreniz güncellendi. Yeni şifrenizle giriş yapabilirsiniz."));
      }, 3000);
      
    } catch (err) {
      setErrorMsg(err.message || "Bir hata oluştu.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-10rem)] flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-muted border border-border rounded-2xl p-10 shadow-lg shadow-primary/5 transition-colors duration-300 ease-in-out">
        
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-foreground tracking-tight">Yeni Şifre</h1>
          <p className="text-sm text-muted-foreground mt-2">
            Lütfen hesabınız için yeni bir şifre belirleyin.
          </p>
        </div>

        {errorMsg && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500 text-sm flex items-start gap-3">
            <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <p>{errorMsg}</p>
          </div>
        )}

        {successMsg ? (
          <div className="text-center animate-in fade-in zoom-in duration-300">
            <div className="w-16 h-16 bg-green-500/10 text-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-foreground mb-2">Başarılı!</h3>
            <p className="text-muted-foreground mb-6">
              {successMsg} Yönlendiriliyorsunuz...
            </p>
            <Loader2 className="w-6 h-6 animate-spin text-primary mx-auto" />
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
            
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-foreground">Yeni Şifre</label>
              <input 
                type="password"
                {...register("newPassword", { 
                    required: "Yeni şifre zorunludur",
                    minLength: {
                        value: 6,
                        message: "Şifre en az 6 karakter olmalıdır"
                    }
                })}
                className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all duration-300 placeholder:text-muted-foreground"
                placeholder="••••••••"
                disabled={isLoading}
              />
              {errors.newPassword && <span className="text-xs text-red-500">{errors.newPassword.message}</span>}
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-foreground">Yeni Şifre (Tekrar)</label>
              <input 
                type="password"
                {...register("confirmPassword", { 
                    required: "Şifre tekrarı zorunludur",
                    validate: value => value === newPassword || "Şifreler eşleşmiyor"
                })}
                className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all duration-300 placeholder:text-muted-foreground"
                placeholder="••••••••"
                disabled={isLoading}
              />
              {errors.confirmPassword && <span className="text-xs text-red-500">{errors.confirmPassword.message}</span>}
            </div>

            <button 
              type="submit" 
              disabled={isLoading}
              className="mt-2 w-full flex items-center justify-center gap-2 px-4 py-3.5 bg-primary text-primary-foreground text-base font-medium rounded-xl hover:bg-primary/90 hover:shadow-lg hover:shadow-primary/20 disabled:opacity-70 disabled:cursor-not-allowed transition-all duration-300"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Kaydediliyor...</span>
                </>
              ) : (
                <span>Şifreyi Güncelle</span>
              )}
            </button>
            
            <Link 
              href="/auth/login"
              className="flex items-center justify-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors mt-2"
            >
              <ArrowLeft className="w-4 h-4" />
              İptal et ve giriş sayfasına dön
            </Link>
          </form>
        )}

      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={
      <div className="min-h-[calc(100vh-10rem)] flex items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
      </div>
    }>
      <ResetPasswordContent />
    </Suspense>
  );
}
