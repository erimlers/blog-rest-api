"use client";

import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import api from "../../../lib/api";
import ENDPOINTS from "../../../lib/endpoints";
import PostCard from "../../../components/ui/PostCard";
import PostCardSkeleton from "../../../components/skeletons/PostCardSkeleton";
import { Bookmark, Loader2 } from "lucide-react";
import Link from "next/link";

export default function SavedPostsPage() {
  const { isAuthenticated, user, isAuthChecked } = useSelector((state) => state.auth);
  const router = useRouter();

  const [savedPosts, setSavedPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Authentication kontrolü
  useEffect(() => {
    if (isAuthChecked && !isAuthenticated) {
      router.push("/auth/login?redirect=/saved");
    }
  }, [isAuthChecked, isAuthenticated, router]);

  // Kaydedilen yazıları çekme
  useEffect(() => {
    if (isAuthenticated && user) {
      const fetchSavedPosts = async () => {
        setIsLoading(true);
        setError(null);
        try {
          const response = await api.get(ENDPOINTS.USERS.GET_SAVED);
          setSavedPosts(response.data || []);
        } catch (err) {
          console.error("Kaydedilen yazılar getirilemedi:", err);
          setError("Kaydedilen yazılar yüklenirken bir sorun oluştu.");
        } finally {
          setIsLoading(false);
        }
      };

      fetchSavedPosts();
    }
  }, [isAuthenticated, user]);

  // Henüz auth kontrolü bitmediyse
  if (!isAuthChecked || (isAuthChecked && !isAuthenticated)) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 border-b border-border pb-6 flex items-center gap-3">
          <div className="w-12 h-12 bg-primary/10 flex items-center justify-center rounded-xl text-primary">
            <Bookmark className="w-6 h-6 fill-current" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-foreground">Kaydedilen Yazılar</h1>
            <p className="text-muted-foreground mt-1">Daha sonra okumak için ayırdığın yazılar burada toplanır.</p>
          </div>
        </div>

        {error && (
          <div className="p-4 mb-8 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-500 text-center">
            {error}
          </div>
        )}

        <div className="flex flex-col gap-4">
          {isLoading ? (
            <>
              <PostCardSkeleton />
              <PostCardSkeleton />
              <PostCardSkeleton />
            </>
          ) : savedPosts.length > 0 ? (
            // Kaydedilenler sayfası genellikle alt alta (1 sütun) listelenir, daha iyi odak sağlar
            savedPosts.map((post) => (
              <PostCard key={post._id} post={post} />
            ))
          ) : (
            <div className="text-center p-16 text-muted-foreground bg-muted/30 rounded-3xl border border-border border-dashed flex flex-col items-center">
              <Bookmark className="w-12 h-12 mb-4 text-muted-foreground/30" />
              <h2 className="text-xl font-bold text-foreground mb-2">Henüz yazı kaydetmedin</h2>
              <p className="max-w-md mx-auto mb-6">İlgi çekici bulduğun yazılardaki yer imi ikonuna tıklayarak onları buraya kaydedebilirsin.</p>
              <Link href="/posts" className="px-6 py-3 bg-primary text-primary-foreground font-medium rounded-full hover:bg-primary/90 transition-colors">
                Yazıları Keşfet
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
