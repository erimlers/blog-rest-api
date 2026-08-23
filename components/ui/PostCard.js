import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Heart, MessageCircle, User } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { toggleLikePost } from '../../store/slices/postSlice';
import { formatRelativeTime } from '../../lib/formatTime';
import { stripMarkdown } from '../../lib/stripMarkdown';

export default function PostCard({ post }) {
  const dispatch = useDispatch();
  const router = useRouter();
  const { user, isAuthenticated } = useSelector(state => state.auth);

  const handleLike = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isAuthenticated || !user) {
      alert("Beğenmek için giriş yapmalısınız.");
      return;
    }
    dispatch(toggleLikePost(post._id));
  };

  const isLiked = user && post.likes?.includes(user._id || user.id);
  const formattedDate = formatRelativeTime(post.createdAt);
  
  const authorInitials = (post.author?.name?.charAt(0) || '') + (post.author?.lastname?.charAt(0) || '');
  const apiUrl = process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || "http://localhost:8080";
  const imageUrl = post.image ? `${apiUrl}${post.image}` : null;
  const cleanExcerpt = stripMarkdown(post.content);

  return (
    <div className="group flex flex-col sm:flex-row bg-background hover:bg-muted/30 border-b border-border transition-colors duration-300 relative py-6">
      <Link href={`/posts/${post._id}`} className="absolute inset-0 z-0" aria-label={post.title}></Link>
      
      {/* Sol İçerik: Yazar, Başlık, Özet, Etkileşimler */}
      <div className="flex flex-col flex-1 min-w-0 pr-0 sm:pr-6 order-2 sm:order-1">
        
        {/* Yazar Bilgisi */}
        <Link href={`/profile/${post.author?.username}`} className="flex items-center gap-2 mb-3 shrink-0 z-10 relative w-fit" onClick={(e) => e.stopPropagation()}>
          {post.author?.profileImage ? (
            <img 
              src={`${apiUrl}${post.author.profileImage}`} 
              alt={post.author?.username} 
              className="w-6 h-6 rounded-full object-cover border border-border shrink-0"
            />
          ) : (
            <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-primary text-[10px] font-bold border border-primary/20 shrink-0">
              {authorInitials.toUpperCase() || <User className="w-3 h-3" />}
            </div>
          )}
          <span className="text-sm font-medium text-foreground hover:text-primary transition-colors truncate max-w-[120px] sm:max-w-[200px]">
            {post.author?.name} {post.author?.lastname}
          </span>
          <span className="text-xs text-muted-foreground/60 px-1">•</span>
          <span className="text-xs text-muted-foreground shrink-0">{formattedDate}</span>
        </Link>

        {/* Başlık ve Özet */}
        <div className="flex-1">
          <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-2 line-clamp-2 group-hover:text-primary transition-colors">
            {post.title}
          </h2>
          <p className="text-muted-foreground line-clamp-2 text-sm sm:text-base leading-relaxed mb-4">
            {cleanExcerpt}
          </p>
        </div>

        {/* Alt Kısım: Etiketler ve Etkileşimler */}
        <div className="flex items-center justify-between mt-auto pt-2">
          {/* Etiketler */}
          <div className="flex gap-2 overflow-hidden shrink min-w-0 mr-4">
            {post.tags && post.tags.length > 0 && (
              post.tags.slice(0, 1).map((tag, i) => (
                <span key={i} className="px-3 py-1 bg-muted/80 text-muted-foreground text-xs font-medium rounded-full truncate max-w-[100px]">
                  {tag}
                </span>
              ))
            )}
          </div>

          {/* Etkileşim Butonları */}
          <div className="flex items-center gap-4 text-muted-foreground shrink-0 z-10 relative">
            <button 
              onClick={handleLike}
              className={`flex items-center gap-1.5 transition-colors ${isLiked ? 'text-red-500' : 'hover:text-red-500'} cursor-pointer`}
            >
              <Heart className={`w-4 h-4 sm:w-5 sm:h-5 ${isLiked ? 'fill-current' : ''}`} />
              <span className="text-xs sm:text-sm font-medium">
                {post.likes?.length || 0}
              </span>
            </button>

            <button onClick={(e) => { e.stopPropagation(); router.push(`/posts/${post._id}#comments`); }} className="flex items-center gap-1.5 hover:text-primary transition-colors cursor-pointer">
              <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="text-xs sm:text-sm font-medium">
                {post.comments?.length || 0}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Sağ İçerik: Görsel (Thumbnail) */}
      {imageUrl && (
        <div className="w-full sm:w-[200px] lg:w-[240px] h-[160px] shrink-0 mb-4 sm:mb-0 order-1 sm:order-2 rounded-xl overflow-hidden bg-muted relative">
          <img 
            src={imageUrl} 
            alt={post.title} 
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
        </div>
      )}
    </div>
  );
}
