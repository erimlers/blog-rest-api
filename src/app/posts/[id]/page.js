"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { fetchPostById, fetchComments, toggleLikePost } from "../../../../store/slices/postSlice";
import { formatRelativeTime } from "../../../../lib/formatTime";
import { Loader2, Heart, MessageCircle, ArrowLeft, Calendar, User } from "lucide-react";
import Link from "next/link";
import CommentSection from "../../../../components/comments/CommentSection";

export default function PostDetailPage() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const router = useRouter();

  const { currentPost, isCurrentPostLoading, error } = useSelector((state) => state.posts);
  const { user, isAuthenticated } = useSelector((state) => state.auth);

  useEffect(() => {
    if (id) {
      dispatch(fetchPostById(id));
      dispatch(fetchComments(id));
    }
  }, [id, dispatch]);

  if (isCurrentPostLoading) {
    return (
      <div className="min-h-[calc(100vh-10rem)] flex flex-col items-center justify-center gap-4">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
        <p className="text-muted-foreground font-medium">Yazı yükleniyor...</p>
      </div>
    );
  }

  if (error || !currentPost) {
    return (
      <div className="min-h-[calc(100vh-10rem)] flex flex-col items-center justify-center gap-4">
        <div className="p-6 bg-red-500/10 border border-red-500/20 rounded-2xl text-center max-w-md">
          <p className="text-red-500 font-medium mb-4">{error || "Yazı bulunamadı."}</p>
          <button
            onClick={() => router.push("/")}
            className="px-6 py-2 bg-background border border-border rounded-xl text-foreground hover:bg-muted transition-colors"
          >
            Anasayfaya Dön
          </button>
        </div>
      </div>
    );
  }

  const isLiked = user && currentPost.likes?.includes(user._id || user.id);
  const formattedDate = formatRelativeTime(currentPost.createdAt);
  const apiUrl = process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || "http://localhost:8080";
  const imageUrl = currentPost.image ? `${apiUrl}${currentPost.image}` : null;
  const authorInitials = (currentPost.author?.name?.charAt(0) || "") + (currentPost.author?.lastname?.charAt(0) || "");

  const handleLike = () => {
    if (!isAuthenticated || !user) {
      alert("Beğenmek için giriş yapmalısınız.");
      return;
    }
    dispatch(toggleLikePost(currentPost._id));
  };

  return (
    <article className="max-w-7xl mx-auto px-4 sm:px-6 py-8 animate-in fade-in duration-500">
      
      {/* Geri Dön Butonu */}
      <button 
        onClick={() => router.back()} 
        className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8 transition-colors group cursor-pointer"
      >
        <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
        <span className="font-medium">Geri</span>
      </button>

      {/* Yazı Başlığı ve Yazar Bilgileri */}
      <header className="mb-10">
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-foreground leading-tight mb-6 transition-colors duration-500 ease-in-out">
          {currentPost.title}
        </h1>
        
        <div className="flex flex-wrap items-center gap-6 text-muted-foreground border-y border-border py-4 transition-colors duration-500 ease-in-out">
          
          {/* Yazar */}
          <div className="flex items-center gap-3">
            {currentPost.author?.profileImage ? (
              <img 
                src={`${apiUrl}${currentPost.author.profileImage}`} 
                alt={currentPost.author.username} 
                className="w-10 h-10 rounded-full object-cover border border-border"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary text-sm font-bold border border-primary/20">
                {authorInitials.toUpperCase() || <User className="w-5 h-5" />}
              </div>
            )}
            <div className="flex flex-col">
              <span className="text-base font-semibold text-foreground leading-none">
                {currentPost.author?.name} {currentPost.author?.lastname}
              </span>
              <span className="text-sm mt-1 text-muted-foreground">
                @{currentPost.author?.username}
              </span>
            </div>
          </div>

          <div className="w-px h-8 bg-border hidden sm:block transition-colors duration-500 ease-in-out"></div>

          {/* Tarih */}
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            <span className="text-sm font-medium">{formattedDate}</span>
          </div>

          <div className="flex-1"></div>

          {/* Aksiyonlar (Beğen / Yorum Sayısı) */}
          <div className="flex items-center gap-4">
            <button 
              onClick={handleLike}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-full border transition-all duration-300 ${isLiked ? 'bg-red-500/10 border-red-500/20 text-red-500' : 'bg-transparent border-transparent text-muted-foreground hover:bg-muted hover:text-foreground'} cursor-pointer`}
            >
              <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
              <span className="font-medium">{currentPost.likes?.length || 0}</span>
            </button>
            <a href="#comments" className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-transparent text-muted-foreground hover:bg-muted hover:text-foreground transition-all duration-300 cursor-pointer">
              <MessageCircle className="w-5 h-5" />
            </a>
          </div>

        </div>
      </header>

      {/* Kapak Görseli */}
      {imageUrl && (
        <div className="w-full h-[300px] sm:h-[400px] lg:h-[500px] rounded-3xl overflow-hidden mb-12 border border-border shadow-md transition-colors duration-500 ease-in-out">
          <img 
            src={imageUrl} 
            alt={currentPost.title} 
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
          />
        </div>
      )}

      {/* Yazı İçeriği */}
      <div className="prose prose-lg dark:prose-invert prose-zinc max-w-none mb-16 text-foreground/90 leading-loose transition-colors duration-500 ease-in-out whitespace-pre-wrap">
        {currentPost.content}
      </div>

      {/* Etiketler */}
      {currentPost.tags && currentPost.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-16">
          {currentPost.tags.map((tag, index) => (
            <span key={index} className="px-4 py-2 bg-muted text-foreground text-sm font-medium rounded-xl border border-border transition-colors duration-500 ease-in-out">
              #{tag}
            </span>
          ))}
        </div>
      )}

      <hr className="border-border my-8 transition-colors duration-500 ease-in-out" />

      {/* Yorumlar Bölümü */}
      <div id="comments" className="scroll-mt-24">
        <CommentSection postId={currentPost._id} />
      </div>

    </article>
  );
}
