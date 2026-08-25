"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { fetchPublicProfile, clearProfileState, toggleFollow } from "@store/slices/profileSlice";
import { fetchPosts } from "@store/slices/postSlice";
import PostCard from "@components/ui/PostCard";
import ProfileSkeleton from "@components/skeletons/ProfileSkeleton";
import PostCardSkeleton from "@components/skeletons/PostCardSkeleton";
import { User, PenSquare, Calendar, Loader2, Settings, UserPlus, UserMinus, Hash } from "lucide-react";
import Link from "next/link";

const formatJoinDate = (dateStr, fallbackId) => {
  if (!dateStr) return null;
  
  let d = new Date(dateStr);
  
  if (isNaN(d.getTime()) && fallbackId) {
    d = new Date(parseInt(fallbackId.substring(0, 8), 16) * 1000);
  }
  
  if (isNaN(d.getTime())) return null;

  return new Intl.DateTimeFormat('tr-TR', { month: 'long', year: 'numeric' }).format(d);
};

export default function ProfilePage() {
  const { username } = useParams();
  const dispatch = useDispatch();
  const router = useRouter();

  // Redux state
  const { currentViewedProfile, isLoading, error } = useSelector((state) => state.profile);
  const { posts, isLoading: postsLoading } = useSelector((state) => state.posts);
  const { user: currentUser } = useSelector((state) => state.auth);

  useEffect(() => {
    if (username) {
      dispatch(fetchPublicProfile(username));
    }
    return () => dispatch(clearProfileState());
  }, [dispatch, username]);

  useEffect(() => {
    if (currentViewedProfile && currentViewedProfile._id) {
      dispatch(fetchPosts({ author: currentViewedProfile._id, limit: 50 })); 
    }
  }, [dispatch, currentViewedProfile]);

  const isOwnProfile = currentUser && currentViewedProfile && currentUser.username === currentViewedProfile.username;
  const apiUrl = process.env.NEXT_PUBLIC_API_URL?.replace("/api", "") || "http://localhost:8080";

  if (isLoading || (!currentViewedProfile && !error)) {
    return <ProfileSkeleton />;
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold text-foreground mb-3 tracking-tight">Profil Bulunamadı</h2>
        <p className="text-muted-foreground mb-8 text-sm">Aradığınız kullanıcı mevcut değil veya silinmiş olabilir.</p>
        <Link href="/" className="px-6 py-2 bg-foreground text-background rounded-lg font-medium hover:bg-foreground/90 transition-colors text-sm">
          Anasayfaya Dön
        </Link>
      </div>
    );
  }

  const profileImageSrc = currentViewedProfile?.profileImage ? `${apiUrl}${currentViewedProfile.profileImage}` : null;
  const initial = currentViewedProfile?.name?.charAt(0) || currentViewedProfile?.username?.charAt(0) || "U";
  
  const joinDate = formatJoinDate(currentViewedProfile?.createdAt, currentViewedProfile?._id);

  return (
    <div className="container mx-auto px-4 sm:px-6 max-w-7xl py-8 md:py-12">
      
      {/* Profil Üst Bölümü (Bütünleşik Kart) */}
      <div className="bg-card rounded-[2rem] border border-border/50 shadow-sm overflow-hidden mb-12 relative">
        
        {/* Banner */}
        <div className="w-full h-32 sm:h-48 bg-muted/40"></div>
        
        <div className="px-6 sm:px-10 pb-8 relative">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
            
            <div className="flex flex-col sm:flex-row items-center sm:items-end gap-6">
              {/* Avatar */}
              <div className="-mt-16 sm:-mt-20 shrink-0 w-32 h-32 sm:w-40 sm:h-40 rounded-full border-[6px] border-card bg-muted flex items-center justify-center overflow-hidden shadow-sm z-10 relative">
                {profileImageSrc ? (
                  <img src={profileImageSrc} alt={currentViewedProfile.username} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-4xl text-muted-foreground font-medium">{initial.toUpperCase()}</span>
                )}
              </div>
              
              {/* Kullanıcı Adı ve İsim */}
              <div className="text-center sm:text-left mb-1">
                <h1 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight">
                  {currentViewedProfile?.name} {currentViewedProfile?.lastname}
                </h1>
                <p className="text-base text-muted-foreground mt-0.5">@{currentViewedProfile?.username}</p>
                
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-x-5 gap-y-2 mt-4 text-sm">
                  {joinDate && (
                    <span className="flex items-center gap-1.5 text-muted-foreground" suppressHydrationWarning>
                       <Calendar className="w-4 h-4" />
                       {joinDate} katıldı
                    </span>
                  )}
                  <div className="flex items-center gap-4 text-sm">
                    <span className="text-foreground"><strong className="font-semibold">{currentViewedProfile?.followers?.length || 0}</strong> <span className="text-muted-foreground">Takipçi</span></span>
                    <span className="text-foreground"><strong className="font-semibold">{currentViewedProfile?.following?.length || 0}</strong> <span className="text-muted-foreground">Takip</span></span>
                  </div>
                </div>
              </div>
            </div>

            {/* Aksiyon Butonları - Kutusuz, Zarif */}
            <div className="flex flex-col gap-2 w-full sm:w-auto mb-2">
              {isOwnProfile && (
                <Link 
                  href="/settings"
                  className="mt-4 sm:mt-0 flex items-center justify-center gap-2 px-5 py-2.5 bg-foreground text-background rounded-lg font-medium hover:bg-foreground/90 transition-all shadow-sm self-center sm:self-auto w-full sm:w-auto text-sm"
                >
                  <Settings className="w-4 h-4" />
                  <span>Profili Düzenle</span>
                </Link>
              )}

              {!isOwnProfile && currentUser && (
                <button
                  onClick={async () => {
                    await dispatch(toggleFollow(currentViewedProfile.username));
                    dispatch(fetchPublicProfile(currentViewedProfile.username));
                  }}
                  className={`mt-4 sm:mt-0 flex items-center justify-center gap-2 px-6 py-2.5 rounded-lg font-medium transition-all shadow-sm self-center sm:self-auto w-full sm:w-auto cursor-pointer text-sm ${
                    currentViewedProfile?.followers?.some(f => f._id === currentUser._id)
                      ? "bg-muted/50 text-foreground border border-border/60 hover:bg-red-500/10 hover:text-red-600 hover:border-red-500/20"
                      : "bg-foreground text-background hover:bg-foreground/90"
                  }`}
                >
                  {currentViewedProfile?.followers?.some(f => f._id === currentUser._id) ? (
                    <>
                      <UserMinus className="w-4 h-4" />
                      <span>Takipten Çık</span>
                    </>
                  ) : (
                    <>
                      <UserPlus className="w-4 h-4" />
                      <span>Takip Et</span>
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Yazılar Bölümü */}
      <div className="border-t border-border/40 pt-8">
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-foreground tracking-tight flex items-center gap-2">
            Yazılar
            <span className="px-2 py-0.5 rounded-full bg-muted/50 text-muted-foreground text-xs font-medium border border-border/40">
              {posts.length}
            </span>
          </h2>
        </div>
        
        {postsLoading ? (
           <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-8 gap-y-6">
             <PostCardSkeleton />
             <PostCardSkeleton />
             <PostCardSkeleton />
             <PostCardSkeleton />
           </div>
        ) : posts.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-8 gap-y-6">
            {posts.map(post => (
              <PostCard key={post._id} post={post} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 flex flex-col items-center">
            <Hash className="w-10 h-10 text-muted-foreground/30 mb-3" />
            <p className="text-muted-foreground text-sm">Bu kullanıcı henüz hiçbir yazı paylaşmadı.</p>
          </div>
        )}
      </div>

    </div>
  );
}
