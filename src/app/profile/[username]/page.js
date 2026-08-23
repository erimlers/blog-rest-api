"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { fetchPublicProfile, clearProfileState, updateProfile } from "@store/slices/profileSlice";
import { fetchPosts } from "@store/slices/postSlice";
import PostCard from "@components/ui/PostCard";
import { User, PenSquare, Calendar, Loader2, Settings } from "lucide-react";
import Link from "next/link";

const formatJoinDate = (dateStr, fallbackId) => {
  let d = null;
  if (dateStr) {
    d = new Date(dateStr);
  } else if (fallbackId && fallbackId.length === 24) {
    d = new Date(parseInt(fallbackId.substring(0, 8), 16) * 1000);
  }
  
  if (d && !isNaN(d.getTime())) {
    const months = ["Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran", "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık"];
    return `${d.getUTCDate()} ${months[d.getUTCMonth()]} ${d.getUTCFullYear()}`;
  }
  return "";
};

export default function ProfilePage() {
  const { username } = useParams();
  const dispatch = useDispatch();
  const router = useRouter();

  // Redux state
  const { currentViewedProfile, isLoading, error } = useSelector((state) => state.profile);
  const { posts, isLoading: postsLoading } = useSelector((state) => state.posts);
  const { user: currentUser } = useSelector((state) => state.auth); // Kendi hesabımız mı diye bakmak için

  useEffect(() => {
    if (username) {
      dispatch(fetchPublicProfile(username));
    }
    return () => dispatch(clearProfileState());
  }, [dispatch, username]);

  useEffect(() => {
    if (currentViewedProfile && currentViewedProfile._id) {
      // Profilin postlarını çek
      dispatch(fetchPosts({ author: currentViewedProfile._id, limit: 50 })); 
    }
  }, [dispatch, currentViewedProfile]);

  const isOwnProfile = currentUser && currentViewedProfile && currentUser.username === currentViewedProfile.username;
  const apiUrl = process.env.NEXT_PUBLIC_API_URL?.replace("/api", "") || "http://localhost:8080";

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-20 flex justify-center items-center">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error || !currentViewedProfile) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold text-foreground mb-4">Profil Bulunamadı</h2>
        <p className="text-muted-foreground mb-8">Aradığınız kullanıcı mevcut değil veya silinmiş olabilir.</p>
        <Link href="/" className="px-6 py-2 bg-primary text-primary-foreground rounded-xl font-medium hover:bg-primary/90 transition-colors">
          Anasayfaya Dön
        </Link>
      </div>
    );
  }

  const profileImageSrc = currentViewedProfile?.profileImage ? `${apiUrl}${currentViewedProfile.profileImage}` : null;
  const initial = currentViewedProfile?.name?.charAt(0) || currentViewedProfile?.username?.charAt(0) || "U";
  
  const joinDate = formatJoinDate(currentViewedProfile?.createdAt, currentViewedProfile?._id);

  return (
    <div className="container mx-auto px-4 sm:px-6 max-w-6xl py-8">
      
      {/* Profile Header */}
      <div className="bg-background rounded-2xl border border-border overflow-hidden shadow-sm mb-8">
        {/* Sade Arka Plan Banner */}
        <div className="h-32 sm:h-48 bg-muted/50 w-full"></div>
        
        <div className="px-6 sm:px-10 pb-8 -mt-16 sm:-mt-20 relative">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            
            <div className="flex flex-col sm:flex-row items-center sm:items-end gap-4 sm:gap-6">
              {/* Avatar */}
              <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-full border-4 border-background bg-muted flex items-center justify-center overflow-hidden shadow-md">
                {profileImageSrc ? (
                  <img src={profileImageSrc} alt={currentViewedProfile.username} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-4xl text-primary font-bold">{initial.toUpperCase()}</span>
                )}
              </div>
              
              {/* Kullanıcı Adı ve İsim */}
              <div className="text-center sm:text-left mb-2">
                <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
                  {currentViewedProfile?.name} {currentViewedProfile?.lastname}
                </h1>
                <p className="text-lg text-muted-foreground">@{currentViewedProfile?.username}</p>
                {joinDate && (
                  <div className="flex items-center justify-center sm:justify-start gap-2 text-sm text-muted-foreground mt-2">
                     <Calendar className="w-4 h-4" />
                     <span suppressHydrationWarning>{joinDate} tarihinde katıldı</span>
                  </div>
                )}
              </div>
            </div>

            {/* Düzenle Butonu (Kendi Profiliyse) */}
            {isOwnProfile && (
              <Link 
                href="/settings"
                className="mt-4 sm:mt-0 flex items-center justify-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground rounded-xl font-medium hover:bg-primary/90 transition-colors shadow-sm self-center sm:self-auto w-full sm:w-auto"
              >
                <Settings className="w-4 h-4" />
                <span>Ayarlara Git</span>
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Kullanıcının Yazıları */}
      <div>
        <h2 className="text-xl font-bold text-foreground mb-6 flex items-center gap-2">
          <span>Yazıları</span>
          <span className="px-2.5 py-0.5 rounded-full bg-primary/10 text-primary text-sm">{posts.length}</span>
        </h2>
        
        {postsLoading ? (
           <div className="py-10 flex justify-center"><Loader2 className="w-6 h-6 animate-spin text-muted-foreground" /></div>
        ) : posts.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
            {posts.map(post => (
              <PostCard key={post._id} post={post} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-muted/30 rounded-2xl border border-border border-dashed">
            <p className="text-muted-foreground">Bu kullanıcı henüz hiçbir yazı paylaşmadı.</p>
          </div>
        )}
      </div>

      </div>

  );
}
