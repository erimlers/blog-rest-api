"use client";

import { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchPosts, deletePost } from "../../store/slices/postSlice";
import { Loader2, Eye, Heart, Edit, Trash2, FileText, Search, ExternalLink, PenTool, Star, Crown, Calendar, Hash, Image as ImageIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function PostDashboard() {
  const dispatch = useDispatch();
  const router = useRouter();
  const { posts, isLoading } = useSelector((state) => state.posts);
  const { user } = useSelector((state) => state.auth);

  const [searchTerm, setSearchTerm] = useState("");
  const apiUrl = process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || "http://localhost:8080";

  useEffect(() => {
    if (user?._id) {
      dispatch(fetchPosts({ author: user._id, limit: 100 })); // basitlik için 100 limit
    }
  }, [dispatch, user]);

  const handleDelete = (postId) => {
    if (window.confirm("Bu yazıyı silmek istediğinize emin misiniz?")) {
      dispatch(deletePost(postId));
    }
  };

  // İstatistikleri hesapla
  const stats = useMemo(() => {
    if (!posts) return { totalPosts: 0, totalViews: 0, totalLikes: 0 };
    return posts.reduce((acc, post) => {
      acc.totalPosts += 1;
      acc.totalViews += (post.views || 0);
      acc.totalLikes += (post.likes?.length || 0);
      return acc;
    }, { totalPosts: 0, totalViews: 0, totalLikes: 0 });
  }, [posts]);

  // En Başarılı Yazı (Görüntülenme + Beğeni formülü)
  const topPost = useMemo(() => {
    if (!posts || posts.length === 0) return null;
    return [...posts].sort((a, b) => {
      const scoreA = (a.views || 0) + (a.likes?.length || 0) * 2;
      const scoreB = (b.views || 0) + (b.likes?.length || 0) * 2;
      return scoreB - scoreA;
    })[0];
  }, [posts]);

  // Arama filtresi
  const filteredPosts = useMemo(() => {
    if (!posts) return [];
    if (!searchTerm.trim()) return posts;
    return posts.filter(p => p.title.toLowerCase().includes(searchTerm.toLowerCase()));
  }, [posts, searchTerm]);

  // HTML taglarını temizleyen basit bir fonksiyon (İçerik özeti için)
  const stripHtml = (html) => {
    if (!html) return "";
    let tmp = document.createElement("DIV");
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || "";
  };

  // Okuma süresi hesaplama
  const calculateReadingTime = (content) => {
    const text = stripHtml(content);
    const wordCount = text.trim().split(/\s+/).length;
    const readingTime = Math.ceil(wordCount / 200); // Ortalama 200 kelime/dk
    return readingTime === 0 ? 1 : readingTime;
  };

  if (isLoading && (!posts || posts.length === 0)) {
    return (
      <div className="flex justify-center items-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-10">
      
      {/* Karşılama Alanı (Greeting Banner) */}
      <div className="relative overflow-hidden bg-gradient-to-br from-primary/10 via-primary/5 to-background border border-primary/20 p-8 rounded-3xl shadow-sm">
        <div className="absolute top-0 right-0 p-12 opacity-10 blur-3xl rounded-full bg-primary/50 w-64 h-64 -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
        <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              Merhaba, <span className="text-primary">{user?.name || user?.username}</span>! 👋
            </h1>
            <p className="text-muted-foreground mt-2 text-lg">
              Blogunun genel durumu harika görünüyor. İşte içeriklerinin özeti.
            </p>
          </div>
          <Link 
            href="/posts/create" 
            className="flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground font-semibold rounded-full hover:bg-primary/90 hover:scale-105 hover:shadow-lg hover:shadow-primary/20 transition-all duration-300 shrink-0"
          >
            <PenTool className="w-5 h-5" />
            <span>Yeni Yazı Oluştur</span>
          </Link>
        </div>
      </div>

      {/* İstatistik Kartları */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="group bg-card border border-border hover:border-primary/50 p-6 rounded-3xl shadow-sm hover:shadow-md transition-all duration-300 relative overflow-hidden">
          <div className="absolute right-0 top-0 w-24 h-24 bg-primary/5 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110"></div>
          <div className="relative z-10 flex items-center gap-5">
            <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center text-primary shrink-0 group-hover:scale-110 group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300 shadow-[0_0_15px_rgba(var(--primary),0.2)]">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground font-medium mb-1">Toplam Yazı</p>
              <h3 className="text-3xl font-bold text-foreground">{stats.totalPosts}</h3>
            </div>
          </div>
        </div>

        <div className="group bg-card border border-border hover:border-blue-500/50 p-6 rounded-3xl shadow-sm hover:shadow-md transition-all duration-300 relative overflow-hidden">
          <div className="absolute right-0 top-0 w-24 h-24 bg-blue-500/5 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110"></div>
          <div className="relative z-10 flex items-center gap-5">
            <div className="w-14 h-14 bg-blue-500/10 rounded-2xl flex items-center justify-center text-blue-500 shrink-0 group-hover:scale-110 group-hover:bg-blue-500 group-hover:text-white transition-all duration-300 shadow-[0_0_15px_rgba(59,130,246,0.2)]">
              <Eye className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground font-medium mb-1">Toplam Görüntülenme</p>
              <h3 className="text-3xl font-bold text-foreground">{stats.totalViews}</h3>
            </div>
          </div>
        </div>

        <div className="group bg-card border border-border hover:border-red-500/50 p-6 rounded-3xl shadow-sm hover:shadow-md transition-all duration-300 relative overflow-hidden">
          <div className="absolute right-0 top-0 w-24 h-24 bg-red-500/5 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110"></div>
          <div className="relative z-10 flex items-center gap-5">
            <div className="w-14 h-14 bg-red-500/10 rounded-2xl flex items-center justify-center text-red-500 shrink-0 group-hover:scale-110 group-hover:bg-red-500 group-hover:text-white transition-all duration-300 shadow-[0_0_15px_rgba(239,68,68,0.2)]">
              <Heart className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground font-medium mb-1">Toplam Beğeni</p>
              <h3 className="text-3xl font-bold text-foreground">{stats.totalLikes}</h3>
            </div>
          </div>
        </div>
      </div>

      {/* En Başarılı Yazı (Yıldızlı) */}
      {topPost && (
        <div className="bg-card border-2 border-amber-500/30 rounded-3xl p-1 relative overflow-hidden shadow-lg shadow-amber-500/5">
          <div className="absolute top-0 right-0 bg-amber-500 text-white text-xs font-bold px-4 py-1.5 rounded-bl-xl z-20 flex items-center gap-1.5">
            <Crown className="w-3.5 h-3.5" /> En Başarılı Yazın
          </div>
          <div className="bg-amber-500/5 rounded-[1.25rem] p-6 sm:p-8 flex flex-col md:flex-row gap-8 items-center relative z-10">
            {/* Fotoğraf */}
            <div className="w-full md:w-1/3 aspect-video rounded-2xl overflow-hidden bg-background border border-border/50 shrink-0 relative group">
              {topPost.image ? (
                <img src={`${apiUrl}${topPost.image}`} alt={topPost.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-muted-foreground bg-muted/30">
                  <Star className="w-10 h-10 text-amber-500 mb-2 opacity-50" />
                  <span className="text-sm font-medium">Kapak Görseli Yok</span>
                </div>
              )}
            </div>
            
            {/* İçerik */}
            <div className="flex-1 space-y-4">
              <h3 className="text-2xl font-bold text-foreground line-clamp-2">{topPost.title}</h3>
              <p className="text-muted-foreground line-clamp-2 text-sm leading-relaxed">
                {stripHtml(topPost.content)}
              </p>
              
              <div className="flex flex-wrap items-center gap-6 pt-2">
                <div className="flex gap-3">
                  <span className="flex items-center gap-1.5 bg-background/80 px-3 py-1.5 rounded-xl border border-border/50 shadow-sm text-sm">
                    <Eye className="w-4 h-4 text-blue-500" /> <span className="font-semibold text-foreground">{topPost.views || 0}</span>
                  </span>
                  <span className="flex items-center gap-1.5 bg-background/80 px-3 py-1.5 rounded-xl border border-border/50 shadow-sm text-sm">
                    <Heart className="w-4 h-4 text-red-500" /> <span className="font-semibold text-foreground">{topPost.likes?.length || 0}</span>
                  </span>
                  <span className="flex items-center gap-1.5 bg-background/80 px-3 py-1.5 rounded-xl border border-border/50 shadow-sm text-sm text-muted-foreground">
                    <FileText className="w-4 h-4" /> <span className="font-medium">{calculateReadingTime(topPost.content)} dk okuma</span>
                  </span>
                </div>
                
                <Link 
                  href={`/posts/${topPost._id}`}
                  target="_blank"
                  className="flex items-center gap-2 px-4 py-2 bg-amber-500 text-white text-sm font-semibold rounded-xl hover:bg-amber-600 hover:shadow-lg hover:shadow-amber-500/20 transition-all duration-300 ml-auto"
                >
                  Yazıya Git <ExternalLink className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Arama Barı ve Liste Alanı */}
      <div className="space-y-6">
        
        {/* Header / Search */}
        <div className="flex flex-col sm:flex-row justify-between items-end sm:items-center gap-4">
          <div>
            <h2 className="text-2xl font-bold text-foreground">Tüm İçeriklerin</h2>
            <p className="text-muted-foreground text-sm mt-1">Blogunda paylaştığın tüm yazıları yönet.</p>
          </div>
          
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input 
              type="text" 
              placeholder="Yazılarında ara..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-card border border-border rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all shadow-sm"
            />
          </div>
        </div>

        {/* Zengin Kart Görünümü */}
        {filteredPosts.length === 0 ? (
          <div className="bg-card border border-border border-dashed rounded-3xl p-16 text-center flex flex-col items-center justify-center">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center text-muted-foreground mb-4">
              <Search className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-foreground">Sonuç Bulunamadı</h3>
            <p className="text-muted-foreground mt-2 max-w-md">Aradığınız kriterlere uygun bir yazı bulamadık. Lütfen farklı bir kelime ile tekrar deneyin.</p>
          </div>
        ) : (
          <div className="grid gap-5">
            {filteredPosts.map((post) => (
              <div key={post._id} className="group relative bg-card border border-border hover:border-primary/40 rounded-3xl p-5 sm:p-6 transition-all duration-500 shadow-sm hover:shadow-xl hover:shadow-primary/5 flex flex-col sm:flex-row gap-6 overflow-hidden">
                {/* Modern Hover Arkaplanı */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>

                {/* Thumbnail */}
                <div className="w-full sm:w-56 aspect-[16/10] rounded-2xl overflow-hidden bg-muted shrink-0 relative shadow-inner">
                  {post.image ? (
                    <img src={`${apiUrl}${post.image}`} alt={post.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-muted-foreground/50 bg-gradient-to-br from-muted to-muted/50">
                      <ImageIcon className="w-10 h-10" />
                    </div>
                  )}
                  {/* Etiketler */}
                  <div className="absolute top-3 left-3 flex flex-col gap-2">
                    <div className="bg-emerald-500/90 backdrop-blur-md px-2.5 py-1 rounded-lg text-[10px] font-bold text-white uppercase tracking-wider shadow-sm flex items-center gap-1 w-fit">
                      <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></div>
                      Yayında
                    </div>
                    {post.tags && post.tags.length > 0 && (
                      <div className="bg-background/90 backdrop-blur-md px-2.5 py-1 rounded-lg border border-border/50 text-[10px] font-bold text-foreground flex items-center gap-1 shadow-sm w-fit">
                        <Hash className="w-3 h-3 text-primary" />
                        {post.tags[0].toUpperCase()}
                      </div>
                    )}
                  </div>
                </div>

                {/* İçerik Bilgisi */}
                <div className="flex-1 min-w-0 flex flex-col justify-between relative z-10">
                  <div>
                    <h3 className="text-2xl font-bold text-foreground line-clamp-1 group-hover:text-primary transition-colors">{post.title}</h3>
                    <p className="text-sm text-muted-foreground mt-3 line-clamp-2 leading-relaxed">
                      {stripHtml(post.content)}
                    </p>
                  </div>
                  
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mt-6 pt-4 border-t border-border/50">
                    
                    {/* Metrikler */}
                    <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1.5 font-medium text-foreground bg-muted/50 px-3 py-1.5 rounded-xl border border-border/50">
                        <Calendar className="w-4 h-4 text-muted-foreground" /> 
                        {new Date(post.createdAt).toLocaleDateString('tr-TR', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </span>
                      <span className="flex items-center gap-1.5 bg-blue-500/5 px-3 py-1.5 rounded-xl border border-blue-500/10 text-blue-600 font-medium" title="Görüntülenme">
                        <Eye className="w-4 h-4" /> {post.views || 0}
                      </span>
                      <span className="flex items-center gap-1.5 bg-red-500/5 px-3 py-1.5 rounded-xl border border-red-500/10 text-red-600 font-medium" title="Beğeni">
                        <Heart className="w-4 h-4" /> {post.likes?.length || 0}
                      </span>
                      <span className="flex items-center gap-1.5 bg-muted/50 px-3 py-1.5 rounded-xl border border-border/50 font-medium text-foreground">
                        <FileText className="w-4 h-4 text-muted-foreground" /> {calculateReadingTime(post.content)} dk okuma
                      </span>
                    </div>
                    
                    {/* Aksiyonlar (Butonlar) */}
                    <div className="flex flex-wrap items-center gap-2">
                      <Link 
                        href={`/posts/${post._id}`}
                        target="_blank"
                        className="flex items-center gap-1.5 px-3 py-2 text-sm font-semibold text-muted-foreground hover:text-foreground hover:bg-muted rounded-xl transition-all border border-transparent hover:border-border"
                      >
                        <ExternalLink className="w-4 h-4" />
                        Görüntüle
                      </Link>
                      <button 
                        type="button"
                        onClick={() => router.push(`/posts/edit/${post._id}`)}
                        className="flex items-center gap-1.5 px-3 py-2 text-sm font-semibold text-blue-600 bg-blue-500/10 hover:bg-blue-500 hover:text-white rounded-xl transition-all border border-blue-500/20"
                      >
                        <Edit className="w-4 h-4" />
                        Düzenle
                      </button>
                      <button 
                        type="button"
                        onClick={() => handleDelete(post._id)}
                        className="flex items-center gap-1.5 px-3 py-2 text-sm font-semibold text-red-600 bg-red-500/10 hover:bg-red-500 hover:text-white rounded-xl transition-all border border-red-500/20"
                      >
                        <Trash2 className="w-4 h-4" />
                        Sil
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
