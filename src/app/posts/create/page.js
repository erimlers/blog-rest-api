"use client";

import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { createPost } from "../../../../store/slices/postSlice";
import { Loader2, ImagePlus, X } from "lucide-react";

export default function CreatePostPage() {
  const { register, handleSubmit, formState: { errors }, watch, setValue } = useForm();
  const dispatch = useDispatch();
  const router = useRouter();
  
  const { isAuthenticated, isAuthChecked } = useSelector((state) => state.auth);
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  
  // Tag sistemi için local stateler
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState("");

  // Watch the image field to generate a preview
  const imageFile = watch("image");

  useEffect(() => {
    // Generate image preview when file changes
    if (imageFile && imageFile.length > 0) {
      const file = imageFile[0];
      const objectUrl = URL.createObjectURL(file);
      setImagePreview(objectUrl);
      
      return () => URL.revokeObjectURL(objectUrl); // memory leak önlemi
    } else {
      setImagePreview(null);
    }
  }, [imageFile]);

  // Auth Koruması
  useEffect(() => {
    if (isAuthChecked && !isAuthenticated) {
      router.push("/auth/login");
    }
  }, [isAuthChecked, isAuthenticated, router]);

  const removeImage = () => {
    setValue("image", null);
    setImagePreview(null);
  };

  // Tag ekleme fonksiyonu
  const handleTagKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ' || e.key === ',') {
      e.preventDefault();
      const newTag = tagInput.trim().replace(/,/g, '');
      if (newTag && !tags.includes(newTag)) {
        setTags([...tags, newTag]);
      }
      setTagInput("");
    }
  };

  // Tag silme fonksiyonu
  const removeTag = (tagToRemove) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    setErrorMsg(null);

    try {
      const formData = new FormData();
      formData.append("title", data.title);
      formData.append("content", data.content);
      
      // Tags state'inden alarak ekliyoruz
      if (tags.length > 0) {
        tags.forEach(tag => {
          formData.append("tags[]", tag);
          formData.append("tags", tag);
        });
      }

      if (data.image && data.image[0]) {
        formData.append("image", data.image[0]);
      }

      const actionResult = await dispatch(createPost(formData));
      
      if (createPost.fulfilled.match(actionResult)) {
        router.push("/"); // Başarılıysa anasayfaya yönlendir
      } else {
        setErrorMsg(actionResult.payload || "Bir hata oluştu.");
      }
    } catch (err) {
      setErrorMsg("Beklenmedik bir hata oluştu.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isAuthChecked || !isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Yeni Yazı Oluştur</h1>
          <p className="text-muted-foreground mt-2">Fikirlerini dünya ile paylaş.</p>
        </div>

        {errorMsg && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 text-red-500 rounded-xl">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 bg-card p-6 sm:p-8 rounded-2xl border border-border shadow-sm">
          
          {/* Başlık Alanı */}
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-foreground mb-2">
              Başlık
            </label>
            <input
              id="title"
              type="text"
              placeholder="Yazınız için dikkat çekici bir başlık..."
              className={`w-full px-4 py-3 bg-muted border ${errors.title ? 'border-red-500' : 'border-border'} rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all`}
              {...register("title", { 
                required: "Başlık zorunludur.",
                minLength: { value: 3, message: "En az 3 karakter olmalıdır." },
                maxLength: { value: 100, message: "En fazla 100 karakter olmalıdır." }
              })}
            />
            {errors.title && <p className="mt-1 text-sm text-red-500">{errors.title.message}</p>}
          </div>

          {/* Kapak Görseli Yükleme Alanı */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Kapak Görseli
            </label>
            
            {!imagePreview ? (
              <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-border rounded-xl hover:bg-muted/50 hover:border-primary/50 transition-all cursor-pointer bg-background">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <ImagePlus className="w-10 h-10 text-muted-foreground mb-3" />
                  <p className="mb-2 text-sm text-muted-foreground">
                    <span className="font-semibold text-primary">Görsel seçmek için tıklayın</span> veya sürükleyip bırakın
                  </p>
                  <p className="text-xs text-muted-foreground">PNG, JPG, JPEG (Max. 5MB)</p>
                </div>
                <input 
                  type="file" 
                  className="hidden" 
                  accept="image/png, image/jpeg, image/jpg"
                  {...register("image")} 
                />
              </label>
            ) : (
              <div className="relative w-full h-56 sm:h-72 rounded-xl overflow-hidden border border-border group">
                <img src={imagePreview} alt="Kapak Önizleme" className="w-full h-full object-cover" />
                <button 
                  type="button"
                  onClick={removeImage}
                  className="absolute top-4 right-4 p-2 bg-red-500/80 hover:bg-red-500 text-white rounded-full backdrop-blur-md transition-all shadow-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            )}
          </div>

          {/* İçerik Alanı (Textarea) */}
          <div>
            <label htmlFor="content" className="block text-sm font-medium text-foreground mb-2">
              İçerik
            </label>
            <textarea
              id="content"
              rows={12}
              placeholder="Yazınızı buraya yazmaya başlayın..."
              className={`w-full px-4 py-3 bg-muted border ${errors.content ? 'border-red-500' : 'border-border'} rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all resize-y`}
              {...register("content", { 
                required: "İçerik zorunludur.",
                minLength: { value: 10, message: "İçerik çok kısa, lütfen biraz daha detaylandırın." }
              })}
            />
            {errors.content && <p className="mt-1 text-sm text-red-500">{errors.content.message}</p>}
          </div>

          {/* Etiketler (Tags) */}
          <div>
            <label htmlFor="tags" className="block text-sm font-medium text-foreground mb-2">
              Etiketler <span className="text-muted-foreground text-xs font-normal">(İsteğe bağlı, yazdıktan sonra Boşluk veya Enter tuşuna basın)</span>
            </label>
            
            {/* Eklenen etiketlerin göründüğü alan */}
            <div className="flex flex-wrap gap-2 mb-3">
              {tags.map((tag, index) => (
                <div key={index} className="flex items-center gap-1 bg-primary/10 text-primary px-3 py-1.5 rounded-lg text-sm font-medium">
                  {tag}
                  <button 
                    type="button" 
                    onClick={() => removeTag(tag)}
                    className="hover:bg-primary/20 p-0.5 rounded-full transition-colors cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>

            <input
              id="tags"
              type="text"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={handleTagKeyDown}
              placeholder="teknoloji, yazılım, react..."
              className="w-full px-4 py-3 bg-muted border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
            />
          </div>

          {/* Gönder Butonu */}
          <div className="pt-4 border-t border-border flex justify-end">
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-8 py-3 bg-primary text-primary-foreground font-medium rounded-xl hover:bg-primary/90 hover:shadow-lg hover:shadow-primary/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Yayınlanıyor...
                </>
              ) : (
                "Yazıyı Paylaş"
              )}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
