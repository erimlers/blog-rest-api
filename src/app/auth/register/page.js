"use client";

import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { registerUser, clearError } from "@store/slices/authSlice";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Loader2, CheckCircle2 } from "lucide-react";

export default function RegisterPage() {
  const { register, handleSubmit, watch, formState: { errors } } = useForm();
  const dispatch = useDispatch();
  const router = useRouter();
  const [isSuccess, setIsSuccess] = useState(false);
  
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
    
    // passwordConfirm'i backend'e yollamaya gerek yok
    const { passwordConfirm, ...submitData } = data;
    
    // Backend'deki Joi validasyonu boş string ("") gelince hata veriyor. 
    // Bu yüzden eğer soyad girilmemişse, objeden tamamen çıkarıyoruz.
    if (!submitData.lastname) {
      delete submitData.lastname;
    }
    
    const resultAction = await dispatch(registerUser(submitData));
    if (registerUser.fulfilled.match(resultAction)) {
      setIsSuccess(true);
      // Kısa bir süre başarı mesajını gösterip Login sayfasına atalım
      setTimeout(() => {
        router.push("/auth/login");
      }, 3000);
    }
  };

  const currentPassword = watch("password");

  // Oturum kontrolü henüz bitmediyse veya giriş yapmışsa formu ekrana basma
  if (!isAuthChecked || isAuthenticated) {
    return (
      <div className="min-h-[calc(100vh-10rem)] flex items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
      </div>
    );
  }

  // Kayıt başarılıysa gösterilecek ekran
  if (isSuccess) {
    return (
      <div className="min-h-[calc(100vh-10rem)] flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-muted border border-border rounded-2xl p-10 shadow-lg shadow-primary/5 text-center animate-in fade-in zoom-in duration-500">
          <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-6" />
          <h2 className="text-2xl font-bold text-foreground mb-3">Kayıt Başarılı!</h2>
          <p className="text-muted-foreground mb-6">
            Lütfen e-posta adresinize gönderilen bağlantıya tıklayarak hesabınızı doğrulayın.
          </p>
          <p className="text-sm text-primary font-medium flex items-center justify-center gap-2">
            <Loader2 className="w-4 h-4 animate-spin" /> Giriş sayfasına yönlendiriliyorsunuz...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-10rem)] flex items-center justify-center p-4 py-12">
      <div className="w-full max-w-lg bg-muted border border-border rounded-2xl p-8 sm:p-10 shadow-lg shadow-primary/5">
        
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-foreground tracking-tight">Hesap Oluştur</h1>
          <p className="text-sm text-muted-foreground mt-2">Aramıza katılmak için formu doldurun.</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500 text-sm text-center animate-in fade-in slide-in-from-top-2">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
          
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-foreground">Kullanıcı Adı</label>
            <input 
              type="text"
              {...register("username", { 
                required: "Kullanıcı adı zorunludur",
                minLength: { value: 3, message: "Kullanıcı adı en az 3 karakter olmalıdır" },
                pattern: { value: /^[a-zA-Z0-9_]+$/, message: "Kullanıcı adı sadece harf, rakam ve alt çizgi içerebilir" }
              })}
              className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all duration-300 placeholder:text-muted-foreground"
              placeholder="kullanici_adi"
              disabled={isLoading}
            />
            {errors.username && <span className="text-xs text-red-500">{errors.username.message}</span>}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-foreground">Ad</label>
              <input 
                type="text"
                {...register("name", { required: "Ad zorunludur" })}
                className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all duration-300 placeholder:text-muted-foreground"
                placeholder="Örn. Ahmet"
                disabled={isLoading}
              />
              {errors.name && <span className="text-xs text-red-500">{errors.name.message}</span>}
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-foreground">Soyad <span className="text-muted-foreground text-xs font-normal">(İsteğe bağlı)</span></label>
              <input 
                type="text"
                {...register("lastname")}
                className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all duration-300 placeholder:text-muted-foreground"
                placeholder="Örn. Yılmaz"
                disabled={isLoading}
              />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-foreground">E-posta</label>
            <input 
              type="email"
              {...register("email", { 
                required: "E-posta adresi zorunludur",
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: "Geçerli bir e-posta adresi giriniz"
                }
              })}
              className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all duration-300 placeholder:text-muted-foreground"
              placeholder="ornek@mail.com"
              disabled={isLoading}
            />
            {errors.email && <span className="text-xs text-red-500">{errors.email.message}</span>}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-foreground">Şifre</label>
              <input 
                type="password"
                {...register("password", { 
                  required: "Şifre zorunludur",
                  minLength: { value: 6, message: "Şifre en az 6 karakter olmalıdır" }
                })}
                className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all duration-300 placeholder:text-muted-foreground"
                placeholder="••••••••"
                disabled={isLoading}
              />
              {errors.password && <span className="text-xs text-red-500">{errors.password.message}</span>}
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-foreground">Şifre Tekrar</label>
              <input 
                type="password"
                {...register("passwordConfirm", { 
                  required: "Şifre tekrarı zorunludur",
                  validate: (val) => {
                    if (watch('password') != val) {
                      return "Şifreler uyuşmuyor";
                    }
                  }
                })}
                className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all duration-300 placeholder:text-muted-foreground"
                placeholder="••••••••"
                disabled={isLoading}
              />
              {errors.passwordConfirm && <span className="text-xs text-red-500">{errors.passwordConfirm.message}</span>}
            </div>
          </div>

          <button 
            type="submit" 
            disabled={isLoading}
            className="mt-4 w-full flex items-center justify-center gap-2 px-4 py-3.5 bg-primary text-primary-foreground text-base font-medium rounded-xl hover:bg-primary/90 hover:shadow-lg hover:shadow-primary/20 disabled:opacity-70 disabled:cursor-not-allowed transition-all duration-300"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Hesap Oluşturuluyor...</span>
              </>
            ) : (
              <span>Kayıt Ol</span>
            )}
          </button>
        </form>

        <div className="mt-8 text-center text-sm text-muted-foreground">
          Zaten hesabınız var mı?{" "}
          <Link href="/auth/login" className="text-primary hover:underline font-medium transition-colors">
            Giriş Yap
          </Link>
        </div>

      </div>
    </div>
  );
}
