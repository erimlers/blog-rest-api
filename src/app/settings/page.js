"use client";

import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { updateProfile, clearUpdateStatus } from "@store/slices/profileSlice";
import { logoutUser } from "@store/slices/authSlice";
import { useRouter } from "next/navigation";
import { User, Settings, Lock, Upload, Loader2, Save, CheckCircle2, AlertCircle, Palette } from "lucide-react";
import ThemeToggle from "@components/ui/ThemeToggle";

export default function SettingsPage() {
  const { user: currentUser, isAuthenticated, isAuthChecked } = useSelector((state) => state.auth);
  const { isUpdating, updateSuccess, updateMessage, error } = useSelector((state) => state.profile);
  const dispatch = useDispatch();
  const router = useRouter();

  const [activeTab, setActiveTab] = useState("profile");
  
  const [formData, setFormData] = useState({
    name: "",
    lastname: "",
    username: "",
    currentPassword: "",
    newPassword: "",
    removeImage: false,
  });
  const [newPasswordConfirm, setNewPasswordConfirm] = useState("");
  const [emailPassword, setEmailPassword] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [isChangingEmail, setIsChangingEmail] = useState(false);
  const [localError, setLocalError] = useState("");

  const apiUrl = process.env.NEXT_PUBLIC_API_URL?.replace("/api", "") || "http://localhost:8080";

  useEffect(() => {
    if (isAuthChecked && !isAuthenticated) {
      router.push("/auth/login");
    }
  }, [isAuthChecked, isAuthenticated, router]);

  useEffect(() => {
    if (currentUser) {
      setFormData(prev => ({
        ...prev,
        name: currentUser.name || "",
        lastname: currentUser.lastname || "",
        username: currentUser.username || "",
      }));
    }
  }, [currentUser]);

  useEffect(() => {
    if (updateSuccess && !isUpdating) {
        setFormData(prev => ({ ...prev, currentPassword: "", newPassword: "" }));
        setNewPasswordConfirm("");
        setEmailPassword("");
        setNewEmail("");
        setIsChangingEmail(false);
    }
  }, [updateSuccess, isUpdating]);

  useEffect(() => {
    if (updateSuccess || error) {
      const timer = setTimeout(() => {
        dispatch(clearUpdateStatus());
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [updateSuccess, error, dispatch]);

  // Sayfadan ayrılırken state'i temizle
  useEffect(() => {
    return () => {
      dispatch(clearUpdateStatus());
    };
  }, [dispatch]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreviewImage(URL.createObjectURL(file));
      setFormData(prev => ({ ...prev, removeImage: false }));
    }
  };

  const handleRemoveImage = () => {
    setSelectedFile(null);
    setPreviewImage(null);
    setFormData(prev => ({ ...prev, removeImage: true }));
  };

  const handleEmailSubmit = () => {
    setLocalError("");
    if (!newEmail || !emailPassword) {
      setLocalError("Lütfen yeni e-posta adresinizi ve mevcut şifrenizi girin.");
      return;
    }
    if (newEmail === currentUser?.email) {
      setLocalError("Yeni e-posta adresi mevcut e-posta adresinizle aynı olamaz.");
      return;
    }
    const data = new FormData();
    data.append("email", newEmail);
    data.append("currentPassword", emailPassword);
    dispatch(updateProfile(data));
  };

  const handlePasswordSubmit = () => {
    setLocalError("");
    if (!formData.currentPassword || !formData.newPassword) {
      setLocalError("Lütfen mevcut şifrenizi ve yeni şifrenizi girin.");
      return;
    }
    if (formData.newPassword !== newPasswordConfirm) {
      setLocalError("Yeni şifreler birbirleriyle eşleşmiyor.");
      return;
    }
    const data = new FormData();
    data.append("currentPassword", formData.currentPassword);
    data.append("newPassword", formData.newPassword);
    dispatch(updateProfile(data));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLocalError("");

    const data = new FormData();
    if (formData.name !== currentUser?.name) data.append("name", formData.name);
    if (formData.lastname !== currentUser?.lastname) data.append("lastname", formData.lastname);
    if (formData.username !== currentUser?.username) data.append("username", formData.username);
    
    if (selectedFile) {
       data.append("profileImage", selectedFile);
    } else if (formData.removeImage) {
       data.append("removeImage", "true");
    }
    
    dispatch(updateProfile(data));
  };

  if (!isAuthChecked || !currentUser) {
    return (
      <div className="container mx-auto px-4 py-20 flex justify-center items-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  const profileImageSrc = currentUser?.profileImage ? `${apiUrl}${currentUser.profileImage}` : null;

  return (
    <div className="container mx-auto px-4 sm:px-6 max-w-5xl py-8">
      
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">Ayarlar</h1>
        <p className="text-muted-foreground mt-2">Hesabınızı ve profil bilgilerinizi yönetin.</p>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        
        {/* Sol Menü (Tabs) */}
        <div className="w-full md:w-64 flex flex-col gap-2 flex-shrink-0">
          <button 
            onClick={() => setActiveTab("profile")}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${activeTab === 'profile' ? 'bg-primary text-primary-foreground shadow-sm' : 'hover:bg-muted text-muted-foreground hover:text-foreground'}`}
          >
            <User className="w-5 h-5" />
            Profil Ayarları
          </button>
          <button 
            onClick={() => setActiveTab("account")}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${activeTab === 'account' ? 'bg-primary text-primary-foreground shadow-sm' : 'hover:bg-muted text-muted-foreground hover:text-foreground'}`}
          >
            <Lock className="w-5 h-5" />
            Hesap ve Güvenlik
          </button>
          <button 
            onClick={() => setActiveTab("appearance")}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${activeTab === 'appearance' ? 'bg-primary text-primary-foreground shadow-sm' : 'hover:bg-muted text-muted-foreground hover:text-foreground'}`}
          >
            <Palette className="w-5 h-5" />
            Görünüm
          </button>
        </div>

        {/* Sağ İçerik Alanı */}
        <div className="flex-1">
          {updateSuccess && (
            <div className="mb-6 p-4 rounded-xl bg-green-500/10 border border-green-500/20 text-green-600 flex items-start gap-3 animate-in fade-in slide-in-from-top-2">
              <CheckCircle2 className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-medium">Başarılı!</h4>
                <p className="text-sm opacity-90 mt-1">{updateMessage}</p>
              </div>
            </div>
          )}
          
          {error && (
            <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-600 flex items-start gap-3 animate-in fade-in slide-in-from-top-2">
              <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-medium">Bir hata oluştu</h4>
                <p className="text-sm opacity-90 mt-1">{error}</p>
              </div>
            </div>
          )}

          {localError && (
            <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-600 flex items-start gap-3 animate-in fade-in slide-in-from-top-2">
              <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-medium">Hata</h4>
                <p className="text-sm opacity-90 mt-1">{localError}</p>
              </div>
            </div>
          )}

          <div className="bg-background border border-border rounded-2xl shadow-sm p-6 sm:p-8">
            <form onSubmit={handleSubmit} className="space-y-8">
              
              {activeTab === "profile" && (
                <div className="space-y-8 animate-in fade-in duration-300">
                  <h2 className="text-xl font-bold text-foreground border-b border-border pb-4">Genel Profil Bilgileri</h2>
                  
                  {/* Fotoğraf Yükleme */}
                  <div className="flex flex-col sm:flex-row items-center gap-6">
                    <div className="w-24 h-24 rounded-full border-2 border-border overflow-hidden bg-muted flex items-center justify-center relative group shadow-sm flex-shrink-0">
                       {(!formData.removeImage && (previewImage || profileImageSrc)) ? (
                          <img src={previewImage || profileImageSrc} alt="Preview" className="w-full h-full object-cover" />
                       ) : (
                          <User className="w-10 h-10 text-muted-foreground" />
                       )}
                       <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                          <Upload className="w-6 h-6 text-white" />
                       </div>
                       <input type="file" accept="image/*" onChange={handleFileChange} className="absolute inset-0 opacity-0 cursor-pointer" />
                    </div>
                    
                    <div className="flex flex-col gap-2 items-center sm:items-start text-center sm:text-left">
                       <p className="font-medium text-foreground">Profil Fotoğrafı</p>
                       <p className="text-sm text-muted-foreground">PNG veya JPG (Maks. 2MB)</p>
                       {(!formData.removeImage && (previewImage || profileImageSrc)) && (
                         <button 
                           type="button" 
                           onClick={handleRemoveImage}
                           className="text-xs font-medium text-red-500 hover:text-red-600 transition-colors bg-red-500/10 px-3 py-1.5 rounded-lg mt-2"
                         >
                           Fotoğrafı Kaldır
                         </button>
                       )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-foreground">Ad</label>
                      <input type="text" name="name" value={formData.name} onChange={handleInputChange} className="w-full px-4 py-2.5 bg-muted/50 border border-border rounded-xl focus:bg-background focus:outline-none focus:ring-2 focus:ring-primary/50 text-foreground transition-all" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-foreground">Soyad</label>
                      <input type="text" name="lastname" value={formData.lastname} onChange={handleInputChange} className="w-full px-4 py-2.5 bg-muted/50 border border-border rounded-xl focus:bg-background focus:outline-none focus:ring-2 focus:ring-primary/50 text-foreground transition-all" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">Kullanıcı Adı</label>
                    <div className="flex items-center">
                      <span className="px-4 py-2.5 bg-muted border border-r-0 border-border rounded-l-xl text-muted-foreground font-medium">@</span>
                      <input type="text" name="username" value={formData.username} onChange={handleInputChange} className="w-full px-4 py-2.5 bg-muted/50 border border-border rounded-r-xl focus:bg-background focus:outline-none focus:ring-2 focus:ring-primary/50 text-foreground transition-all" />
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "account" && (
                <div className="space-y-8 animate-in fade-in duration-300">
                  <h2 className="text-xl font-bold text-foreground border-b border-border pb-4">Hesap ve Güvenlik</h2>
                  
                  {/* E-posta Bölümü */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-foreground">E-posta Adresi</h3>
                    {!isChangingEmail ? (
                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 bg-muted/50 rounded-xl border border-border gap-4">
                        <span className="text-foreground font-medium break-all">{currentUser?.email}</span>
                        <button 
                          type="button"
                          onClick={() => setIsChangingEmail(true)}
                          className="text-sm font-medium text-primary hover:underline cursor-pointer flex-shrink-0"
                        >
                          E-posta Adresini Değiştir
                        </button>
                      </div>
                    ) : (
                      <div className="p-5 bg-muted/30 rounded-xl border border-border space-y-4">
                        <div className="flex justify-between items-center mb-2">
                          <h4 className="font-medium text-foreground">Yeni E-posta Belirle</h4>
                          <button 
                            type="button" 
                            onClick={() => { 
                              setIsChangingEmail(false); 
                              setNewEmail(""); 
                              setEmailPassword("");
                              setLocalError("");
                            }} 
                            className="text-sm text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                          >
                            İptal Et
                          </button>
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-foreground">Yeni E-posta Adresi</label>
                          <input type="email" value={newEmail} onChange={(e) => setNewEmail(e.target.value)} placeholder="Yeni e-posta adresinizi girin" className="w-full px-4 py-2.5 bg-background border border-border rounded-xl focus:bg-background focus:outline-none focus:ring-2 focus:ring-primary/50 text-foreground transition-all" />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-foreground">Mevcut Şifreniz</label>
                          <input type="password" value={emailPassword} onChange={(e) => setEmailPassword(e.target.value)} placeholder="Güvenliğiniz için mevcut şifrenizi girmelisiniz" className="w-full px-4 py-2.5 bg-background border border-border rounded-xl focus:bg-background focus:outline-none focus:ring-2 focus:ring-primary/50 text-foreground transition-all" />
                        </div>
                        <div className="flex justify-end pt-2">
                          <button 
                            type="button" 
                            onClick={handleEmailSubmit}
                            disabled={isUpdating}
                            className="px-6 py-2.5 text-sm font-medium bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 transition-all flex items-center gap-2 cursor-pointer"
                          >
                            {isUpdating ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                            E-postayı Güncelle
                          </button>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Şifre Bölümü */}
                  <div className="pt-6 border-t border-border space-y-6">
                     <div>
                       <h3 className="text-lg font-semibold text-foreground">Şifre Değiştir</h3>
                       <p className="text-sm text-muted-foreground mt-1">Eğer şifrenizi değiştirmek istemiyorsanız bu alanları boş bırakın.</p>
                     </div>
                     <div className="space-y-4">
                       <div className="space-y-2">
                         <label className="text-sm font-medium text-foreground">Mevcut Şifre</label>
                         <input type="password" name="currentPassword" value={formData.currentPassword} onChange={handleInputChange} className="w-full px-4 py-2.5 bg-muted/50 border border-border rounded-xl focus:bg-background focus:outline-none focus:ring-2 focus:ring-primary/50 text-foreground transition-all" />
                       </div>
                       <div className="space-y-2">
                         <label className="text-sm font-medium text-foreground">Yeni Şifre</label>
                         <input type="password" name="newPassword" value={formData.newPassword} onChange={handleInputChange} className="w-full px-4 py-2.5 bg-muted/50 border border-border rounded-xl focus:bg-background focus:outline-none focus:ring-2 focus:ring-primary/50 text-foreground transition-all" />
                       </div>
                       <div className="space-y-2">
                         <label className="text-sm font-medium text-foreground">Yeni Şifre (Tekrar)</label>
                         <input type="password" value={newPasswordConfirm} onChange={(e) => setNewPasswordConfirm(e.target.value)} className="w-full px-4 py-2.5 bg-muted/50 border border-border rounded-xl focus:bg-background focus:outline-none focus:ring-2 focus:ring-primary/50 text-foreground transition-all" />
                       </div>
                       <div className="flex justify-end pt-4">
                         <button 
                           type="button" 
                           onClick={handlePasswordSubmit}
                           disabled={isUpdating}
                           className="px-6 py-2.5 text-sm font-medium bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 transition-all flex items-center gap-2 cursor-pointer"
                         >
                           {isUpdating ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                           Şifreyi Değiştir
                         </button>
                       </div>
                     </div>
                  </div>
                </div>
              )}

              {activeTab === "appearance" && (
                <div className="space-y-8 animate-in fade-in duration-300">
                  <h2 className="text-xl font-bold text-foreground border-b border-border pb-4">Görünüm Ayarları</h2>
                  <div className="flex items-center justify-between p-6 bg-muted/30 rounded-xl border border-border">
                    <div>
                      <h3 className="text-lg font-semibold text-foreground">Tema Seçimi</h3>
                      <p className="text-sm text-muted-foreground mt-1">Uygulama temasını karanlık veya aydınlık mod olarak değiştirin.</p>
                    </div>
                    <ThemeToggle />
                  </div>
                </div>
              )}

              {/* Ortak Kaydet Butonu (Sadece profil sekmesinde görünür) */}
              {activeTab === "profile" && (
                <div className="pt-8 flex justify-end">
                  <button type="submit" disabled={isUpdating} className="px-6 py-3 text-sm font-medium bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 hover:shadow-md transition-all flex items-center gap-2 cursor-pointer">
                    {isUpdating ? <><Loader2 className="w-4 h-4 animate-spin" /> Kaydediliyor...</> : <><Save className="w-4 h-4" /> Değişiklikleri Kaydet</>}
                  </button>
                </div>
              )}

            </form>
          </div>
        </div>
      </div>

    </div>
  );
}
