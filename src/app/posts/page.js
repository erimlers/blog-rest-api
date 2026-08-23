"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchPosts } from "../../../store/slices/postSlice";
import PostCard from "../../../components/ui/PostCard";
import FilterBar from "../../../components/ui/FilterBar";
import { Loader2 } from "lucide-react";

export default function PostsPage() {
  const dispatch = useDispatch();
  const { posts, isLoading, isInitialized, error, pagination, filters } = useSelector((state) => state.posts);

  // Filtreler değiştiğinde ilk sayfayı yükle
  useEffect(() => {
    dispatch(fetchPosts({ page: 1, limit: 10, search: filters.search, sortBy: filters.sortBy }));
  }, [dispatch, filters.search, filters.sortBy]);

  const handleLoadMore = () => {
    if (pagination.currentPage < pagination.totalPages) {
      dispatch(fetchPosts({ 
        page: pagination.currentPage + 1, 
        limit: 10, 
        search: filters.search, 
        sortBy: filters.sortBy 
      }));
    }
  };

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Sıralama (Filtreleme) Sekmeleri */}
        <FilterBar />

        {/* Hata Durumu */}
        {error && (
          <div className="p-4 mb-8 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-500 text-center">
            {error}
          </div>
        )}

        {/* Post Listesi (Grid - Blog Tarzı) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-12 gap-y-4">
          {posts.map((post) => (
            <PostCard key={post._id} post={post} />
          ))}

          {/* Yükleniyor Durumu */}
          {(!isInitialized || isLoading) && (
            <div className="col-span-full flex justify-center p-12">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          )}

          {/* Boş Durum */}
          {isInitialized && !isLoading && posts.length === 0 && !error && (
            <div className="col-span-full text-center p-12 text-muted-foreground bg-muted/30 transition-colors duration-500 ease-in-out rounded-2xl border border-border border-dashed">
              Aramanızla eşleşen yazı bulunamadı.
            </div>
          )}
        </div>

        {/* Daha Fazla Yükle Butonu */}
        {pagination.currentPage < pagination.totalPages && (
          <div className="mt-12 text-center">
            <button
              onClick={handleLoadMore}
              disabled={isLoading}
              className="px-8 py-3 bg-muted text-foreground border border-border font-medium rounded-full hover:bg-muted/80 hover:shadow-md transition-all duration-500 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center gap-2"
            >
              {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
              Daha Fazla Yükle
            </button>
          </div>
        )}
        
      </div>
    </div>
  );
}
