"use client";

import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { loginUser, clearError } from "@store/slices/authSlice";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useEffect } from "react";
import { Loader2 } from "lucide-react";

export default function LoginPage() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const dispatch = useDispatch();
  const router = useRouter();
  
  const { isLoading, error, isAuthenticated, isAuthChecked } = useSelector((state) => state.auth);

  useEffect(() => {
    // Sadece oturum kontrolü tamamen bittiyse ve kullanıcı zaten giriş yapmışsa yönlendir
    if (isAuthChecked && isAuthenticated) {
      router.push("/");
    }
    return () => {
      dispatch(clearError());
    };
  }, [isAuthChecked, isAuthenticated, router, dispatch]);

  const onSubmit = async (data) => {
    dispatch(clearError());
    const resultAction = await dispatch(loginUser(data));
    if (loginUser.fulfilled.match(resultAction)) {
      router.push("/");
    }
  };

  // Oturum kontrolü henüz bitmediyse veya giriş yapmışsa formu ekrana basma (flash of content'i engeller)
  if (!isAuthChecked || isAuthenticated) {
    return (
      <div className="min-h-[calc(100vh-10rem)] flex items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-10rem)] flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-muted border border-border rounded-2xl p-10 shadow-lg shadow-primary/5 transition-colors duration-300 ease-in-out">
        
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-foreground tracking-tight">Giriş Yap</h1>
          <p className="text-sm text-muted-foreground mt-2">Hesabınıza erişmek için bilgilerinizi girin.</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500 text-sm text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
          
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-foreground">E-posta</label>
            <input 
              type="email"
              {...register("email", { required: "E-posta adresi zorunludur" })}
              className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all duration-300 placeholder:text-muted-foreground"
              placeholder="ornek@mail.com"
              disabled={isLoading}
            />
            {errors.email && <span className="text-xs text-red-500">{errors.email.message}</span>}
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-foreground">Şifre</label>
            <input 
              type="password"
              {...register("password", { required: "Şifre zorunludur" })}
              className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all duration-300 placeholder:text-muted-foreground"
              placeholder="••••••••"
              disabled={isLoading}
            />
            {errors.password && <span className="text-xs text-red-500">{errors.password.message}</span>}
          </div>

          <button 
            type="submit" 
            disabled={isLoading}
            className="mt-2 w-full flex items-center justify-center gap-2 px-4 py-3.5 bg-primary text-primary-foreground text-base font-medium rounded-xl hover:bg-primary/90 hover:shadow-lg hover:shadow-primary/20 disabled:opacity-70 disabled:cursor-not-allowed transition-all duration-300"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Giriş yapılıyor...</span>
              </>
            ) : (
              <span>Giriş Yap</span>
            )}
          </button>
        </form>

        <div className="mt-8 text-center text-sm text-muted-foreground">
          Hesabınız yok mu?{" "}
          <Link href="/auth/register" className="text-primary hover:underline font-medium transition-colors">
            Kayıt Ol
          </Link>
        </div>

      </div>
    </div>
  );
}
