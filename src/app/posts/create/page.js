"use client";

import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { createPost } from "../../../../store/slices/postSlice";
import { Loader2, ImagePlus, X, PenTool, Hash } from "lucide-react";
import dynamic from "next/dynamic";
import { useTheme } from "next-themes";
import '@uiw/react-md-editor/markdown-editor.css';
import '@uiw/react-markdown-preview/markdown.css';

const MDEditor = dynamic(
  () => import("@uiw/react-md-editor"),
  { ssr: false, loading: () => <div className="w-full h-[400px] bg-muted/30 animate-pulse rounded-lg border border-border/40" /> }
);

export default function CreatePostPage() {
  const { register, handleSubmit, formState: { errors }, watch, setValue } = useForm();
  const dispatch = useDispatch();
  const router = useRouter();
  
  const { isAuthenticated, isAuthChecked } = useSelector((state) => state.auth);
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const { theme } = useTheme();
  
  // Tag sistemi için local stateler
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState("");

  // Watch the fields
  const imageFile = watch("image");
  const contentValue = watch("content");

  useEffect(() => {
    if (imageFile && imageFile.length > 0) {
      const file = imageFile[0];
      const objectUrl = URL.createObjectURL(file);
      setImagePreview(objectUrl);
      
      return () => URL.revokeObjectURL(objectUrl);
    } else {
      setImagePreview(null);
    }
  }, [imageFile]);

  useEffect(() => {
    if (isAuthChecked && !isAuthenticated) {
      router.push("/auth/login");
    }
  }, [isAuthChecked, isAuthenticated, router]);

  const removeImage = () => {
    setValue("image", null);
    setImagePreview(null);
  };

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
      
      if (tags.length > 0) {
        tags.forEach(tag => {
          formData.append("tags", tag);
        });
      }

      if (data.image && data.image[0]) {
        formData.append("image", data.image[0]);
      }

      const actionResult = await dispatch(createPost(formData));
      
      if (createPost.fulfilled.match(actionResult)) {
        router.push("/");
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
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-8 md:py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        
        {/* Header (Kutusuz) */}
        <div className="mb-10 pb-6 border-b border-border/40 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground tracking-tight flex items-center gap-2">
              <PenTool className="w-7 h-7 text-foreground" />
              Yeni Yazı
            </h1>
            <p className="text-muted-foreground mt-2 text-base">Fikirlerini dünya ile paylaş.</p>
          </div>
        </div>

        {errorMsg && (
          <div className="mb-8 py-3 px-4 rounded-lg bg-red-500/10 text-red-600 flex items-start gap-3 animate-in fade-in slide-in-from-top-2">
             <div>
               <p className="text-sm font-medium mt-0.5">{errorMsg}</p>
             </div>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-12">
          
          {/* Üst Kısım: Başlık ve Görsel Yan Yana (Masaüstünde) */}
          <div className="flex flex-col-reverse md:flex-row gap-8">
             
             {/* Başlık ve Etiketler */}
             <div className="flex-1 space-y-8">
                <div className="space-y-2">
                  <label htmlFor="title" className="block text-sm font-medium text-foreground">
                    Başlık
                  </label>
                  <input
                    id="title"
                    type="text"
                    placeholder="Dikkat çekici bir başlık girin..."
                    className={`w-full px-4 py-3 bg-muted/30 border ${errors.title ? 'border-red-500/50 focus:ring-red-500/50' : 'border-border/60 focus:ring-primary/50 focus:border-primary/50'} rounded-lg focus:outline-none focus:ring-1 transition-all shadow-sm text-foreground`}
                    {...register("title", { 
                      required: "Başlık zorunludur.",
                      minLength: { value: 3, message: "En az 3 karakter olmalıdır." },
                      maxLength: { value: 100, message: "En fazla 100 karakter olmalıdır." }
                    })}
                  />
                  {errors.title && <p className="mt-1 text-xs text-red-500">{errors.title.message}</p>}
                </div>

                <div className="space-y-2">
                  <label htmlFor="tags" className="block text-sm font-medium text-foreground">
                    Etiketler <span className="text-muted-foreground font-normal">(İsteğe bağlı)</span>
                  </label>
                  
                  <div className="flex flex-wrap gap-2 mb-2">
                    {tags.map((tag, index) => (
                      <div key={index} className="flex items-center gap-1 bg-muted text-foreground border border-border/60 px-3 py-1 rounded-md text-xs font-medium shadow-sm">
                        <Hash className="w-3 h-3 text-muted-foreground" />
                        {tag}
                        <button 
                          type="button" 
                          onClick={() => removeTag(tag)}
                          className="hover:text-red-500 ml-1 transition-colors cursor-pointer"
                        >
                          <X className="w-3 h-3" />
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
                    placeholder="Etiket yazıp Boşluk veya Enter'a basın..."
                    className="w-full px-4 py-2.5 bg-muted/30 border border-border/60 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary/50 focus:border-primary/50 transition-all text-sm shadow-sm text-foreground"
                  />
                </div>
             </div>

             {/* Kapak Görseli (Sağda, daha derli toplu) */}
             <div className="w-full md:w-64 flex-shrink-0 space-y-2">
                <label className="block text-sm font-medium text-foreground">
                  Kapak Görseli
                </label>
                
                {!imagePreview ? (
                  <label className="flex flex-col items-center justify-center w-full aspect-[4/3] border border-dashed border-border/80 rounded-lg hover:bg-muted/30 hover:border-foreground/40 transition-all cursor-pointer bg-muted/10 shadow-sm">
                    <div className="flex flex-col items-center justify-center p-4 text-center">
                      <ImagePlus className="w-8 h-8 text-muted-foreground/50 mb-2" />
                      <p className="text-sm font-medium text-muted-foreground">
                        Görsel Ekle
                      </p>
                      <p className="text-[10px] text-muted-foreground/70 mt-1">PNG, JPG (Maks 5MB)</p>
                    </div>
                    <input 
                      type="file" 
                      className="hidden" 
                      accept="image/png, image/jpeg, image/jpg"
                      {...register("image")} 
                    />
                  </label>
                ) : (
                  <div className="relative w-full aspect-[4/3] rounded-lg overflow-hidden border border-border/60 group shadow-sm">
                    <img src={imagePreview} alt="Kapak Önizleme" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                       <button 
                         type="button"
                         onClick={removeImage}
                         className="p-2 bg-red-500 hover:bg-red-600 text-white rounded-full transition-colors"
                         title="Kaldır"
                       >
                         <X className="w-4 h-4" />
                       </button>
                    </div>
                  </div>
                )}
             </div>
          </div>

          {/* İçerik Alanı (Markdown Editor) */}
          <div data-color-mode={theme === "dark" ? "dark" : "light"} className="space-y-2">
            <label className="block text-sm font-medium text-foreground">
              İçerik
            </label>
            <div className={`rounded-lg overflow-hidden border shadow-sm ${errors.content ? 'border-red-500/50' : 'border-border/60'}`}>
              <MDEditor
                value={contentValue}
                onChange={(val) => setValue("content", val || "", { shouldValidate: true })}
                height={500}
                preview="edit"
                textareaProps={{
                  placeholder: "Yazınızı markdown formatında buraya yazmaya başlayın..."
                }}
              />
            </div>
            {/* React Hook Form validation */}
            <input 
              type="hidden" 
              {...register("content", { 
                required: "İçerik zorunludur.",
                minLength: { value: 10, message: "İçerik çok kısa, lütfen biraz detaylandırın." }
              })} 
            />
            {errors.content && <p className="mt-1 text-xs text-red-500">{errors.content.message}</p>}
          </div>

          {/* Gönder Butonu */}
          <div className="pt-6 border-t border-border/40 flex justify-end">
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-8 py-2.5 bg-foreground text-background font-medium rounded-lg hover:bg-foreground/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 text-sm shadow-sm cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
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
