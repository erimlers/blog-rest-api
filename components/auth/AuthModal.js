"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { loginUser, registerUser, clearError } from "@store/slices/authSlice";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { Loader2, X, CheckCircle2, AlertCircle, MailCheck, ArrowLeft } from "lucide-react";
import api from "@lib/api";
import ENDPOINTS from "@lib/endpoints";

export default function AuthModal() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const authType = searchParams.get("auth"); // 'login', 'register', 'forgot-password'

  const closeModal = () => {
    // URL'deki auth parametresini temizle ve aynı sayfada kal
    const params = new URLSearchParams(searchParams);
    params.delete("auth");
    const newQuery = params.toString();
    const newPath = newQuery ? `${pathname}?${newQuery}` : pathname;
    router.push(newPath, { scroll: false });
  };

  if (!authType) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Arkaplan Karartma Animasyonu */}
      <div 
        className="absolute inset-0 bg-background/80 animate-in fade-in duration-1000 ease-in-out" 
        onClick={closeModal}
      ></div>
      
      {/* Sadece Yumuşak Fade-in (Geçiş) Animasyonu */}
      <div className="relative z-10 w-full max-w-md bg-muted border border-border rounded-3xl shadow-2xl overflow-hidden animate-in fade-in duration-1000 ease-in-out">
        <button 
          onClick={closeModal}
          className="absolute top-4 right-4 p-2 text-muted-foreground hover:text-foreground hover:bg-background rounded-full transition-colors z-20"
        >
          <X className="w-5 h-5" />
        </button>

        {authType === "login" && <LoginForm onSwitch={(type) => router.push(`${pathname}?auth=${type}`, { scroll: false })} onSuccess={closeModal} />}
        {authType === "register" && <RegisterForm onSwitch={(type) => router.push(`${pathname}?auth=${type}`, { scroll: false })} />}
        {authType === "forgot-password" && <ForgotPasswordForm onSwitch={(type) => router.push(`${pathname}?auth=${type}`, { scroll: false })} />}
      </div>
    </div>
  );
}

// ----------------------------------------------------
// LOGIN FORM
// ----------------------------------------------------
function LoginForm({ onSwitch, onSuccess }) {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const dispatch = useDispatch();
  const { isLoading, error } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(clearError());
  }, [dispatch]);

  const onSubmit = async (data) => {
    dispatch(clearError());
    const resultAction = await dispatch(loginUser(data));
    if (loginUser.fulfilled.match(resultAction)) {
      onSuccess();
    }
  };

  return (
    <div className="p-8 sm:p-10">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-foreground tracking-tight">Giriş Yap</h2>
        <p className="text-sm text-muted-foreground mt-2">Hesabınıza erişmek için bilgilerinizi girin.</p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500 text-sm text-center">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
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
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-foreground">Şifre</label>
            <button type="button" onClick={() => onSwitch("forgot-password")} className="text-sm font-medium text-primary hover:underline transition-colors">
              Şifremi Unuttum?
            </button>
          </div>
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
            <><Loader2 className="w-5 h-5 animate-spin" /><span>Giriş yapılıyor...</span></>
          ) : (
            <span>Giriş Yap</span>
          )}
        </button>
      </form>

      <div className="mt-8 text-center text-sm text-muted-foreground">
        Hesabınız yok mu?{" "}
        <button type="button" onClick={() => onSwitch("register")} className="text-primary hover:underline font-medium transition-colors">
          Kayıt Ol
        </button>
      </div>
    </div>
  );
}

// ----------------------------------------------------
// REGISTER FORM
// ----------------------------------------------------
function RegisterForm({ onSwitch }) {
  const { register, handleSubmit, watch, formState: { errors } } = useForm();
  const dispatch = useDispatch();
  const [isSuccess, setIsSuccess] = useState(false);
  const { isLoading, error } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(clearError());
  }, [dispatch]);

  const onSubmit = async (data) => {
    dispatch(clearError());
    const { passwordConfirm, ...submitData } = data;
    if (!submitData.lastname) delete submitData.lastname;
    
    const resultAction = await dispatch(registerUser(submitData));
    if (registerUser.fulfilled.match(resultAction)) {
      setIsSuccess(true);
      setTimeout(() => {
        onSwitch("login");
      }, 3000);
    }
  };

  if (isSuccess) {
    return (
      <div className="p-10 text-center animate-in fade-in zoom-in duration-500">
        <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-6" />
        <h2 className="text-2xl font-bold text-foreground mb-3">Kayıt Başarılı!</h2>
        <p className="text-muted-foreground mb-6">
          Lütfen e-posta adresinize gönderilen bağlantıya tıklayarak hesabınızı doğrulayın.
        </p>
        <p className="text-sm text-primary font-medium flex items-center justify-center gap-2">
          <Loader2 className="w-4 h-4 animate-spin" /> Giriş kutusuna yönlendiriliyorsunuz...
        </p>
      </div>
    );
  }

  return (
    <div className="p-8 sm:p-10 max-h-[85vh] overflow-y-auto custom-scrollbar">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-foreground tracking-tight">Hesap Oluştur</h2>
        <p className="text-sm text-muted-foreground mt-2">Aramıza katılmak için formu doldurun.</p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500 text-sm text-center">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-foreground">Kullanıcı Adı</label>
          <input 
            type="text"
            {...register("username", { 
              required: "Kullanıcı adı zorunludur",
              minLength: { value: 3, message: "En az 3 karakter" },
              pattern: { value: /^[a-zA-Z0-9_]+$/, message: "Sadece harf, rakam ve alt çizgi" }
            })}
            className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all duration-300 placeholder:text-muted-foreground"
            placeholder="kullanici_adi"
            disabled={isLoading}
          />
          {errors.username && <span className="text-xs text-red-500">{errors.username.message}</span>}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-foreground">Ad</label>
            <input 
              type="text"
              {...register("name", { required: "Ad zorunludur" })}
              className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all duration-300 placeholder:text-muted-foreground"
              placeholder="Ahmet"
              disabled={isLoading}
            />
            {errors.name && <span className="text-xs text-red-500">{errors.name.message}</span>}
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-foreground">Soyad <span className="text-muted-foreground text-xs font-normal">(İsteğe bağlı)</span></label>
            <input 
              type="text"
              {...register("lastname")}
              className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all duration-300 placeholder:text-muted-foreground"
              placeholder="Yılmaz"
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
              pattern: { value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i, message: "Geçerli bir e-posta giriniz" }
            })}
            className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all duration-300 placeholder:text-muted-foreground"
            placeholder="ornek@mail.com"
            disabled={isLoading}
          />
          {errors.email && <span className="text-xs text-red-500">{errors.email.message}</span>}
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-foreground">Şifre</label>
          <input 
            type="password"
            {...register("password", { 
              required: "Şifre zorunludur",
              minLength: { value: 6, message: "En az 6 karakter" }
            })}
            className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all duration-300 placeholder:text-muted-foreground"
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
              validate: (val) => watch('password') === val || "Şifreler uyuşmuyor"
            })}
            className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all duration-300 placeholder:text-muted-foreground"
            placeholder="••••••••"
            disabled={isLoading}
          />
          {errors.passwordConfirm && <span className="text-xs text-red-500">{errors.passwordConfirm.message}</span>}
        </div>

        <button 
          type="submit" 
          disabled={isLoading}
          className="mt-2 w-full flex items-center justify-center gap-2 px-4 py-3.5 bg-primary text-primary-foreground text-base font-medium rounded-xl hover:bg-primary/90 hover:shadow-lg hover:shadow-primary/20 disabled:opacity-70 disabled:cursor-not-allowed transition-all duration-300"
        >
          {isLoading ? (
            <><Loader2 className="w-5 h-5 animate-spin" /><span>Oluşturuluyor...</span></>
          ) : (
            <span>Kayıt Ol</span>
          )}
        </button>
      </form>

      <div className="mt-8 text-center text-sm text-muted-foreground">
        Zaten hesabınız var mı?{" "}
        <button type="button" onClick={() => onSwitch("login")} className="text-primary hover:underline font-medium transition-colors">
          Giriş Yap
        </button>
      </div>
    </div>
  );
}

// ----------------------------------------------------
// FORGOT PASSWORD FORM
// ----------------------------------------------------
function ForgotPasswordForm({ onSwitch }) {
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
    <div className="p-8 sm:p-10">
      
      <div className={`${successMsg ? "hidden" : ""} text-center mb-8`}>
        <h2 className="text-3xl font-bold text-foreground tracking-tight">Şifremi Unuttum</h2>
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
          <p className="text-muted-foreground mb-6">{successMsg}</p>
          <button 
            type="button"
            onClick={() => onSwitch("login")}
            className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 bg-primary text-primary-foreground font-medium rounded-xl hover:bg-primary/90 transition-colors"
          >
            Giriş Ekranına Dön
          </button>
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
              <><Loader2 className="w-5 h-5 animate-spin" /><span>Gönderiliyor...</span></>
            ) : (
              <span>Sıfırlama Linki Gönder</span>
            )}
          </button>
          
          <button 
            type="button"
            onClick={() => onSwitch("login")}
            className="flex items-center justify-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors mt-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Giriş sayfasına dön
          </button>
        </form>
      )}
    </div>
  );
}
