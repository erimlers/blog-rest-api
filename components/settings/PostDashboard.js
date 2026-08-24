"use client";

import { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchPosts, deletePost } from "../../store/slices/postSlice";
import { Loader2, Eye, Heart, Edit, Trash2, FileText, Search, ExternalLink } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function PostDashboard() {
  const dispatch = useDispatch();
  const router = useRouter();
  const { posts, isLoading } = useSelector((state) => state.posts);
  const { user } = useSelector((state) => state.auth);

  const [searchTerm, setSearchTerm] = useState("");

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

  // Güvenli tarih formatlama
  const formatDate = (dateString) => {
    if (!dateString) return "Tarih Yok";
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "Geçersiz Tarih";
    return new Intl.DateTimeFormat('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' }).format(date);
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

  // Arama filtresi
  const filteredPosts = useMemo(() => {
    if (!posts) return [];
    if (!searchTerm.trim()) return posts;
    return posts.filter(p => p.title.toLowerCase().includes(searchTerm.toLowerCase()));
  }, [posts, searchTerm]);

  if (isLoading && (!posts || posts.length === 0)) {
    return (
      <div className="flex justify-center items-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      
      {/* İstatistik Kartları */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-primary/5 border border-primary/20 p-5 rounded-2xl flex items-center gap-4">
          <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary shrink-0">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground font-medium">Toplam Yazı</p>
            <h3 className="text-2xl font-bold text-foreground">{stats.totalPosts}</h3>
          </div>
        </div>

        <div className="bg-blue-500/5 border border-blue-500/20 p-5 rounded-2xl flex items-center gap-4">
          <div className="w-12 h-12 bg-blue-500/10 rounded-full flex items-center justify-center text-blue-500 shrink-0">
            <Eye className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground font-medium">Toplam Görüntülenme</p>
            <h3 className="text-2xl font-bold text-foreground">{stats.totalViews}</h3>
          </div>
        </div>

        <div className="bg-red-500/5 border border-red-500/20 p-5 rounded-2xl flex items-center gap-4">
          <div className="w-12 h-12 bg-red-500/10 rounded-full flex items-center justify-center text-red-500 shrink-0">
            <Heart className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground font-medium">Toplam Beğeni</p>
            <h3 className="text-2xl font-bold text-foreground">{stats.totalLikes}</h3>
          </div>
        </div>
      </div>

      {/* Arama Barı ve Liste Alanı */}
      <div className="bg-background border border-border rounded-2xl overflow-hidden">
        
        {/* Header / Search */}
        <div className="p-4 sm:p-6 border-b border-border flex flex-col sm:flex-row justify-between items-center gap-4 bg-muted/20">
          <h2 className="text-lg font-semibold text-foreground">Tüm Yazılarım</h2>
          
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input 
              type="text" 
              placeholder="Yazılarda ara..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-background border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
            />
          </div>
        </div>

        {/* Tablo Görünümü */}
        {filteredPosts.length === 0 ? (
          <div className="p-12 text-center">
            <p className="text-muted-foreground">Kriterlere uygun yazı bulunamadı.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-muted-foreground">
              <thead className="text-xs uppercase bg-muted/40 text-foreground border-b border-border">
                <tr>
                  <th scope="col" className="px-6 py-4 font-semibold">Başlık</th>
                  <th scope="col" className="px-6 py-4 font-semibold text-center">İstatistikler</th>
                  <th scope="col" className="px-6 py-4 font-semibold text-center">Tarih</th>
                  <th scope="col" className="px-6 py-4 font-semibold text-right">İşlemler</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredPosts.map((post) => (
                  <tr key={post._id} className="hover:bg-muted/20 transition-colors">
                    
                    {/* Başlık */}
                    <td className="px-6 py-4 font-medium text-foreground max-w-xs sm:max-w-md truncate">
                      {post.title}
                    </td>

                    {/* İstatistikler */}
                    <td className="px-6 py-4">
                      <div className="flex justify-center items-center gap-4">
                        <span className="flex items-center gap-1.5" title="Görüntülenme">
                          <Eye className="w-4 h-4 text-blue-500" /> 
                          <span className="font-medium">{post.views || 0}</span>
                        </span>
                        <span className="flex items-center gap-1.5" title="Beğeni">
                          <Heart className="w-4 h-4 text-red-500" /> 
                          <span className="font-medium">{post.likes?.length || 0}</span>
                        </span>
                      </div>
                    </td>

                    {/* Tarih */}
                    <td className="px-6 py-4 text-center">
                      <span suppressHydrationWarning>
                        {formatDate(post.createdAt)}
                      </span>
                    </td>

                    {/* Aksiyonlar */}
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link 
                          href={`/posts/${post._id}`}
                          target="_blank"
                          className="p-2 text-foreground hover:bg-muted rounded-lg transition-colors cursor-pointer"
                          title="Görüntüle"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </Link>
                        <button 
                          type="button"
                          onClick={() => router.push(`/posts/edit/${post._id}`)}
                          className="p-2 text-blue-500 hover:bg-blue-500/10 rounded-lg transition-colors cursor-pointer"
                          title="Düzenle"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button 
                          type="button"
                          onClick={() => handleDelete(post._id)}
                          className="p-2 text-red-500 hover:bg-red-500/10 rounded-lg transition-colors cursor-pointer"
                          title="Sil"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
