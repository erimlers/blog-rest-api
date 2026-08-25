"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import api from "../../../lib/api";
import ENDPOINTS from "../../../lib/endpoints";
import Link from "next/link";
import { Loader2, User, FileText, Search } from "lucide-react";
import PostCard from "../../../components/ui/PostCard";
import PostCardSkeleton from "../../../components/skeletons/PostCardSkeleton";

function SearchResultsContent() {
  const searchParams = useSearchParams();
  const q = searchParams.get("q") || "";
  
  const [users, setUsers] = useState([]);
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!q) {
      setIsLoading(false);
      return;
    }

    const fetchResults = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        const [usersRes, postsRes] = await Promise.all([
          api.get(ENDPOINTS.USERS.SEARCH, { params: { q } }),
          api.get(ENDPOINTS.POSTS.LIST, { params: { search: q, limit: 20 } })
        ]);
        
        setUsers(usersRes.data || []);
        setPosts(postsRes.data?.posts || []);
      } catch (err) {
        console.error("Arama sonuçları getirilirken hata oluştu:", err);
        setError("Sonuçlar yüklenirken bir sorun oluştu.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchResults();
  }, [q]);

  if (!q) {
    return (
      <div className="min-h-screen flex items-center justify-center text-muted-foreground">
        Lütfen aramak istediğiniz kelimeyi girin.
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-10 border-b border-border pb-6">
          <h1 className="text-3xl font-bold text-foreground">
            <span className="text-primary">"{q}"</span> için arama sonuçları
          </h1>
          <p className="text-muted-foreground mt-2">
            {!isLoading && `${users.length} kullanıcı, ${posts.length} yazı bulundu.`}
          </p>
        </div>

        {error && (
          <div className="p-4 mb-8 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-500 text-center">
            {error}
          </div>
        )}

        {isLoading ? (
          <>
            <div className="mb-12">
              <h2 className="text-xl font-bold mb-6">Kullanıcılar</h2>
              <div className="flex gap-4 overflow-x-auto pb-4">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="flex flex-col items-center gap-2 min-w-[120px] animate-pulse">
                    <div className="w-20 h-20 rounded-full bg-muted"></div>
                    <div className="w-16 h-4 bg-muted rounded mt-2"></div>
                  </div>
                ))}
              </div>
            </div>
            
            <div>
              <h2 className="text-xl font-bold mb-6">Yazılar</h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-12 gap-y-4">
                <PostCardSkeleton />
                <PostCardSkeleton />
                <PostCardSkeleton />
                <PostCardSkeleton />
              </div>
            </div>
          </>
        ) : (
          <>
            {/* Kullanıcılar Bölümü */}
            {users.length > 0 && (
              <div className="mb-12">
                <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                  <User className="w-5 h-5 text-primary" />
                  Kullanıcılar
                </h2>
                <div className="flex gap-6 overflow-x-auto pb-6 custom-scrollbar snap-x">
                  {users.map((user) => (
                    <Link 
                      href={`/profile/${user.username}`} 
                      key={user._id} 
                      className="snap-start flex flex-col items-center gap-3 min-w-[140px] p-4 rounded-2xl border border-border/50 bg-card hover:bg-muted/50 hover:shadow-md transition-all duration-300 group"
                    >
                      {user.profileImage ? (
                        <img 
                          src={`${process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || "http://localhost:8080"}${user.profileImage}`} 
                          alt={user.username} 
                          className="w-20 h-20 rounded-full object-cover border-2 border-border group-hover:border-primary transition-colors" 
                        />
                      ) : (
                        <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-2xl border-2 border-primary/20 group-hover:border-primary transition-colors">
                          {((user.name?.charAt(0) || '') + (user.lastname?.charAt(0) || '')).toUpperCase() || <User className="w-10 h-10" />}
                        </div>
                      )}
                      <div className="text-center w-full">
                        <p className="text-sm font-semibold text-foreground truncate">{user.name} {user.lastname}</p>
                        <p className="text-xs text-muted-foreground truncate mt-1">@{user.username}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Yazılar Bölümü */}
            <div className="mb-12">
              <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                <FileText className="w-5 h-5 text-primary" />
                Yazılar
              </h2>
              
              {posts.length > 0 ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-12 gap-y-4">
                  {posts.map((post) => (
                    <PostCard key={post._id} post={post} />
                  ))}
                </div>
              ) : (
                <div className="text-center p-12 text-muted-foreground bg-muted/30 rounded-2xl border border-border border-dashed">
                  Yazı bulunamadı.
                </div>
              )}
            </div>
            
            {users.length === 0 && posts.length === 0 && (
              <div className="text-center p-16 text-muted-foreground bg-muted/10 rounded-3xl border border-border">
                <Search className="w-12 h-12 mx-auto mb-4 opacity-20" />
                <p className="text-lg">Maalesef hiçbir sonuç bulamadık.</p>
                <p className="text-sm mt-2">Lütfen farklı kelimelerle tekrar deneyin.</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>}>
      <SearchResultsContent />
    </Suspense>
  );
}
