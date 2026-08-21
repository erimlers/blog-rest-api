import Link from 'next/link';
import { Heart, MessageCircle } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { toggleLikePost } from '../../store/slices/postSlice';
import { formatRelativeTime } from '../../lib/formatTime';

export default function PostCard({ post }) {
  const dispatch = useDispatch();
  const { user, isAuthenticated } = useSelector(state => state.auth);

  const handleLike = (e) => {
    e.preventDefault();
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

  return (
    <Link 
      href={`/posts/${post._id}`} 
      className="group flex flex-col bg-background border border-border rounded-2xl overflow-hidden hover:shadow-lg transition-all duration-300"
    >
      {/* Kapak Görseli */}
      {imageUrl ? (
        <div className="w-full h-48 sm:h-56 overflow-hidden bg-muted">
          <img 
            src={imageUrl} 
            alt={post.title} 
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </div>
      ) : (
        <div className="w-full h-48 sm:h-56 bg-muted/50 flex items-center justify-center border-b border-border">
          <span className="text-muted-foreground/50 font-medium">Görsel Yok</span>
        </div>
      )}

      <div className="flex flex-col flex-1 p-5 sm:p-6">
        
        {/* Başlık ve Metin */}
        <div className="flex-1">
          <h2 className="text-xl font-bold text-foreground mb-2 line-clamp-2 group-hover:text-primary transition-colors">
            {post.title}
          </h2>
          <p className="text-muted-foreground line-clamp-3 text-sm leading-relaxed mb-4">
            {post.content}
          </p>
        </div>

        {/* Yazar ve Etkileşim (Alt Kısım) */}
        <div className="flex items-center justify-between pt-4 border-t border-border mt-auto">
          
          {/* Yazar Bilgisi */}
          <div className="flex items-center gap-3">
            {post.author?.profileImage ? (
              <img 
                src={`${apiUrl}${post.author.profileImage}`} 
                alt={post.author.username} 
                className="w-8 h-8 rounded-full object-cover border border-border"
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xs font-bold border border-primary/20">
                {authorInitials.toUpperCase()}
              </div>
            )}
            <div className="flex flex-col">
              <span className="text-sm font-semibold text-foreground leading-none">
                {post.author?.name} {post.author?.lastname}
              </span>
              <span className="text-xs text-muted-foreground mt-1">
                {formattedDate}
              </span>
            </div>
          </div>

          {/* Etkileşim Butonları */}
          <div className="flex items-center gap-4 text-muted-foreground">
            <button 
              onClick={handleLike}
              className={`flex items-center gap-1.5 transition-colors ${isLiked ? 'text-red-500' : 'hover:text-red-500'} cursor-pointer`}
            >
              <Heart className={`w-4 h-4 sm:w-5 sm:h-5 ${isLiked ? 'fill-current' : ''}`} />
              <span className="text-xs sm:text-sm font-medium">
                {post.likes?.length || 0}
              </span>
            </button>

            <div className="flex items-center gap-1.5 hover:text-primary transition-colors">
              <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="text-xs sm:text-sm font-medium">
                0
              </span>
            </div>
          </div>
          
        </div>
      </div>
    </Link>
  );
}
