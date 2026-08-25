"use client";

import { useEffect, Suspense } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setFilters, fetchPosts } from "../../../store/slices/postSlice";
import { searchUsersThunk } from "../../../store/slices/profileSlice";
import PostCard from "../../../components/ui/PostCard";
import FilterBar from "../../../components/ui/FilterBar";
import PostCardSkeleton from "../../../components/skeletons/PostCardSkeleton";
import { Loader2, User } from "lucide-react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

function PostsContent() {
  const dispatch = useDispatch();
  const searchParams = useSearchParams();
  
  const { posts, isLoading, isInitialized, error, pagination, filters } = useSelector((state) => state.posts);

  // URL'de parametre var ama Redux'ta yoksa eşitle (dışarıdan link ile gelindiğinde)
  useEffect(() => {
    const urlQuery = searchParams.get("q");
    if (urlQuery && urlQuery !== filters.search) {
      dispatch(setFilters({ search: urlQuery }));
    }
  }, [searchParams, dispatch]);

  // Filtreler değiştiğinde sayfayı yükle
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

          {/* Yükleniyor Durumu (İlk yükleme veya arama yaparken list boşsa) */}
          {(!isInitialized || isLoading) && posts.length === 0 && (
            <>
              <PostCardSkeleton />
              <PostCardSkeleton />
              <PostCardSkeleton />
              <PostCardSkeleton />
            </>
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

export default function PostsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>}>
      <PostsContent />
    </Suspense>
  );
}
