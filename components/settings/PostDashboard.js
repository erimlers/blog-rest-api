"use client";

import { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchPosts, deletePost } from "../../store/slices/postSlice";
import { Loader2, Eye, Heart, Edit, Trash2, FileText, Search, ExternalLink, PenTool, Star, Crown, Calendar, Hash, Image as ImageIcon, MoreVertical } from "lucide-react";
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
      dispatch(fetchPosts({ author: user._id, limit: 100 }));
    }
  }, [dispatch, user]);

  const handleDelete = (postId) => {
    if (window.confirm("Bu yazıyı silmek istediğinize emin misiniz?")) {
      dispatch(deletePost(postId));
    }
  };

  const stats = useMemo(() => {
    if (!posts) return { totalPosts: 0, totalViews: 0, totalLikes: 0 };
    return posts.reduce((acc, post) => {
      acc.totalPosts += 1;
      acc.totalViews += (post.views || 0);
      acc.totalLikes += (post.likes?.length || 0);
      return acc;
    }, { totalPosts: 0, totalViews: 0, totalLikes: 0 });
  }, [posts]);

  const topPost = useMemo(() => {
    if (!posts || posts.length === 0) return null;
    return [...posts].sort((a, b) => {
      const scoreA = (a.views || 0) + (a.likes?.length || 0) * 2;
      const scoreB = (b.views || 0) + (b.likes?.length || 0) * 2;
      return scoreB - scoreA;
    })[0];
  }, [posts]);

  const filteredPosts = useMemo(() => {
    if (!posts) return [];
    if (!searchTerm.trim()) return posts;
    return posts.filter(p => p.title.toLowerCase().includes(searchTerm.toLowerCase()));
  }, [posts, searchTerm]);

  const stripHtml = (html) => {
    if (!html) return "";
    let tmp = document.createElement("DIV");
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || "";
  };

  if (isLoading && (!posts || posts.length === 0)) {
    return (
      <div className="flex justify-center items-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-12">
      
      {/* Karşılama Alanı - Kutusuz, sade */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 pb-6 border-b border-border/40">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            Merhaba, {user?.name || user?.username}
          </h1>
          <p className="text-muted-foreground mt-2 text-base">
            Blogunun genel durumu harika görünüyor. İşte içeriklerinin özeti.
          </p>
        </div>
        <Link 
          href="/posts/create" 
          className="flex items-center gap-2 px-5 py-2.5 bg-foreground text-background font-medium rounded-lg hover:bg-foreground/90 transition-colors shrink-0 text-sm"
        >
          <PenTool className="w-4 h-4" />
          <span>Yeni Yazı Oluştur</span>
        </Link>
      </div>

      {/* İstatistikler - Minimal */}
      <div className="grid grid-cols-3 gap-8">
        <div className="flex flex-col">
          <p className="text-sm font-medium text-muted-foreground mb-1 flex items-center gap-1.5"><FileText className="w-4 h-4" /> Yazılar</p>
          <h3 className="text-4xl font-semibold text-foreground tracking-tight">{stats.totalPosts}</h3>
        </div>
        <div className="flex flex-col">
          <p className="text-sm font-medium text-muted-foreground mb-1 flex items-center gap-1.5"><Eye className="w-4 h-4" /> Görüntülenme</p>
          <h3 className="text-4xl font-semibold text-foreground tracking-tight">{stats.totalViews}</h3>
        </div>
        <div className="flex flex-col">
          <p className="text-sm font-medium text-muted-foreground mb-1 flex items-center gap-1.5"><Heart className="w-4 h-4" /> Beğeni</p>
          <h3 className="text-4xl font-semibold text-foreground tracking-tight">{stats.totalLikes}</h3>
        </div>
      </div>

      {/* En Başarılı Yazı - Hafif Arkaplan */}
      {topPost && (
        <div className="bg-muted/30 rounded-xl p-6 flex flex-col md:flex-row gap-6 items-center">
          <div className="w-full md:w-32 aspect-video md:aspect-square rounded-lg overflow-hidden bg-muted shrink-0 relative">
            {topPost.image ? (
              <img src={`${apiUrl}${topPost.image}`} alt={topPost.title} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-muted-foreground/50">
                <Star className="w-8 h-8 opacity-50" />
              </div>
            )}
          </div>
          
          <div className="flex-1 min-w-0 flex flex-col justify-center">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-600 bg-amber-500/10 px-2 py-0.5 rounded-full flex items-center gap-1">
                <Crown className="w-3 h-3" /> En Başarılı Yazın
              </span>
            </div>
            <h3 className="text-xl font-bold text-foreground line-clamp-1">{topPost.title}</h3>
            <p className="text-muted-foreground line-clamp-1 text-sm mt-1">
              {stripHtml(topPost.content)}
            </p>
            
            <div className="flex items-center gap-4 mt-3 text-sm text-muted-foreground">
              <span className="flex items-center gap-1.5"><Eye className="w-4 h-4" /> {topPost.views || 0}</span>
              <span className="flex items-center gap-1.5"><Heart className="w-4 h-4" /> {topPost.likes?.length || 0}</span>
            </div>
          </div>
          
          <Link 
            href={`/posts/${topPost._id}`}
            className="flex items-center justify-center p-3 text-muted-foreground hover:text-foreground bg-background rounded-full shadow-sm hover:shadow transition-all shrink-0"
          >
            <ExternalLink className="w-5 h-5" />
          </Link>
        </div>
      )}

      {/* Arama Barı ve Liste Alanı */}
      <div className="space-y-4">
        
        <div className="flex flex-col sm:flex-row justify-between items-end sm:items-center gap-4 border-b border-border/40 pb-4">
          <h2 className="text-lg font-semibold text-foreground">Tüm Yazılar</h2>
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input 
              type="text" 
              placeholder="Yazılarda ara..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-muted/30 border-none rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-border transition-all"
            />
          </div>
        </div>

        {/* Liste Görünümü (List View) */}
        {filteredPosts.length === 0 ? (
          <div className="py-12 text-center flex flex-col items-center justify-center">
            <Search className="w-8 h-8 text-muted-foreground/30 mb-3" />
            <p className="text-muted-foreground text-sm">Sonuç bulunamadı.</p>
          </div>
        ) : (
          <div className="flex flex-col divide-y divide-border/40">
            {filteredPosts.map((post) => (
              <div key={post._id} className="group flex flex-col sm:flex-row gap-5 py-5 transition-colors hover:bg-muted/10 -mx-4 px-4 rounded-xl">
                
                {/* Thumbnail - Küçük ve Solda */}
                <div className="w-24 h-24 rounded-lg overflow-hidden bg-muted shrink-0 relative">
                  {post.image ? (
                    <img src={`${apiUrl}${post.image}`} alt={post.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-muted-foreground/30">
                      <ImageIcon className="w-6 h-6" />
                    </div>
                  )}
                </div>

                {/* İçerik */}
                <div className="flex-1 min-w-0 flex flex-col justify-center">
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="text-[10px] font-medium text-emerald-600 bg-emerald-500/10 dark:text-emerald-400 dark:bg-emerald-500/10 px-2 py-0.5 rounded-full">
                      Yayında
                    </span>
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      {new Date(post.createdAt).toLocaleDateString('tr-TR', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </span>
                  </div>
                  
                  <h3 className="text-base font-semibold text-foreground line-clamp-1 group-hover:text-primary transition-colors">{post.title}</h3>
                  
                  <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1"><Eye className="w-3.5 h-3.5" /> {post.views || 0}</span>
                    <span className="flex items-center gap-1"><Heart className="w-3.5 h-3.5" /> {post.likes?.length || 0}</span>
                  </div>
                </div>

                {/* Aksiyonlar (Hover'da beliren minimal ikonlar) */}
                <div className="flex items-center sm:opacity-0 group-hover:opacity-100 transition-opacity gap-1 mt-4 sm:mt-0 justify-end sm:justify-start">
                  <button 
                    onClick={() => router.push(`/posts/${post._id}`)}
                    className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-md transition-colors"
                    title="Görüntüle"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => router.push(`/posts/edit/${post._id}`)}
                    className="p-2 text-muted-foreground hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-md transition-colors"
                    title="Düzenle"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => handleDelete(post._id)}
                    className="p-2 text-muted-foreground hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md transition-colors"
                    title="Sil"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
