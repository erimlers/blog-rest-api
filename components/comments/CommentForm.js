"use client";

import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createComment } from "../../store/slices/postSlice";
import { useRouter } from "next/navigation";
import { Loader2, Send } from "lucide-react";

export default function CommentForm({ postId }) {
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  
  const dispatch = useDispatch();
  const router = useRouter();
  const { isAuthenticated } = useSelector((state) => state.auth);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!isAuthenticated) {
      const confirmLogin = window.confirm("Yorum yapmak için giriş yapmalısınız. Giriş sayfasına yönlendirilsin mi?");
      if (confirmLogin) {
        router.push("/auth/login");
      }
      return;
    }

    if (!content.trim()) return;

    setIsSubmitting(true);
    setError(null);

    const resultAction = await dispatch(createComment({ postId, content }));
    
    if (createComment.fulfilled.match(resultAction)) {
      setContent(""); // Başarılıysa formu temizle
    } else {
      setError(resultAction.payload || "Yorum gönderilemedi.");
    }
    
    setIsSubmitting(false);
  };

  return (
    <div className="bg-muted/30 border border-border p-4 sm:p-6 rounded-2xl transition-colors duration-500 ease-in-out">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder={isAuthenticated ? "Düşüncelerinizi paylaşın..." : "Yorum yapmak için giriş yapmalısınız..."}
          rows="3"
          className="w-full p-4 bg-background border border-border rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all duration-300 resize-none placeholder:text-muted-foreground"
          onClick={() => {
            if (!isAuthenticated) {
              const confirmLogin = window.confirm("Yorum yapmak için giriş yapmalısınız. Giriş sayfasına yönlendirilsin mi?");
              if (confirmLogin) {
                router.push("/auth/login");
              }
            }
          }}
        />
        
        {error && <p className="text-red-500 text-sm font-medium">{error}</p>}
        
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isSubmitting || !content.trim()}
            className="flex items-center gap-2 px-6 py-2.5 bg-primary text-primary-foreground font-medium rounded-xl hover:bg-primary/90 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer shadow-md shadow-primary/10"
          >
            {isSubmitting ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
            <span>Gönder</span>
          </button>
        </div>
      </form>
    </div>
  );
}
