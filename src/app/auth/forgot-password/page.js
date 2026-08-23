"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import Link from "next/link";
import { Loader2, ArrowLeft, MailCheck, AlertCircle } from "lucide-react";
import api from "@lib/api";
import ENDPOINTS from "@lib/endpoints";

export default function ForgotPasswordPage() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [isLoading, setIsLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  
  const onSubmit = async (data) => {
    setIsLoading(true);
    setSuccessMsg("");
    setErrorMsg("");
    
    try {
      const response = await api.post(ENDPOINTS.AUTH.FORGOT_PASSWORD, data);
      setSuccessMsg(response.message || "Şifre sıfırlama bağlantısı e-posta adresinize gönderildi.");
    } catch (err) {
      setErrorMsg(err.message || "Bir hata oluştu.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-10rem)] flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-muted border border-border rounded-2xl p-10 shadow-lg shadow-primary/5 transition-colors duration-300 ease-in-out">
        
        <div className={`${successMsg ? "hidden" : ""} text-center mb-8`}>
          <h1 className="text-3xl font-bold text-foreground tracking-tight">Şifremi Unuttum</h1>
          <p className="text-sm text-muted-foreground mt-2">
            Hesabınıza bağlı e-posta adresini veya kullanıcı adını girin.
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
              <MailCheck className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-foreground mb-2">E-posta Gönderildi!</h3>
            <p className="text-muted-foreground mb-6">
              {successMsg}
            </p>
            <Link 
              href="/auth/login"
              className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 bg-primary text-primary-foreground font-medium rounded-xl hover:bg-primary/90 transition-colors"
            >
              Giriş Ekranına Dön
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
            
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-foreground">E-posta veya Kullanıcı Adı</label>
              <input 
                type="text"
                {...register("emailOrUsername", { required: "Bu alan zorunludur" })}
                className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all duration-300 placeholder:text-muted-foreground"
                placeholder="ornek@mail.com"
                disabled={isLoading}
              />
              {errors.emailOrUsername && <span className="text-xs text-red-500">{errors.emailOrUsername.message}</span>}
            </div>

            <button 
              type="submit" 
              disabled={isLoading}
              className="mt-2 w-full flex items-center justify-center gap-2 px-4 py-3.5 bg-primary text-primary-foreground text-base font-medium rounded-xl hover:bg-primary/90 hover:shadow-lg hover:shadow-primary/20 disabled:opacity-70 disabled:cursor-not-allowed transition-all duration-300"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Gönderiliyor...</span>
                </>
              ) : (
                <span>Sıfırlama Linki Gönder</span>
              )}
            </button>
            
            <Link 
              href="/auth/login"
              className="flex items-center justify-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors mt-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Giriş sayfasına dön
            </Link>
          </form>
        )}

      </div>
    </div>
  );
}
