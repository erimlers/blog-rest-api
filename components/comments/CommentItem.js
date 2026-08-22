"use client";

import { useState, useRef, useEffect } from "react";
import { formatRelativeTime } from "../../lib/formatTime";
import { User, MoreVertical, Edit2, Trash2, X, Check, Loader2, MessageSquareReply, ChevronDown, ChevronUp } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { updateComment, createComment } from "../../store/slices/postSlice";

// İç içe gelen (ağaç) yanıtları tek boyutlu (flat) bir diziye çevirir
// Ayrıca her yanıta kime yanıt verildiği bilgisini (replyToUser) ekler
const flattenReplies = (replies, parentAuthor = null) => {
  let flatList = [];
  if (!replies || !Array.isArray(replies)) return flatList;

  replies.forEach(reply => {
    // Mevcut yanıtı listeye ekle
    flatList.push({ ...reply, replyToUser: parentAuthor });
    
    // Eğer bu yanıtın da kendi yanıtları varsa onları da ekle (DFS)
    if (reply.replies && reply.replies.length > 0) {
      flatList = flatList.concat(flattenReplies(reply.replies, reply.author));
    }
  });
  
  return flatList;
};

export default function CommentItem({ comment, postId, isReply = false, replyToUser = null, openDeleteModal }) {
  const dispatch = useDispatch();
  const { user, isAuthenticated } = useSelector(state => state.auth);
  
  const [openDropdownId, setOpenDropdownId] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);
  
  const [isReplying, setIsReplying] = useState(false);
  const [replyContent, setReplyContent] = useState("");
  const [isSubmittingReply, setIsSubmittingReply] = useState(false);
  
  const [showReplies, setShowReplies] = useState(false);

  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpenDropdownId(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleEditClick = () => {
    setIsEditing(true);
    setEditContent(comment.content);
    setOpenDropdownId(false);
    setIsReplying(false);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditContent("");
  };

  const handleUpdate = async () => {
    if (!editContent.trim()) return;
    setIsUpdating(true);
    await dispatch(updateComment({ postId, commentId: comment._id, content: editContent }));
    setIsUpdating(false);
    setIsEditing(false);
  };

  const handleReplyClick = () => {
    if (!isAuthenticated) {
      alert("Yanıt vermek için giriş yapmalısınız.");
      return;
    }
    setIsReplying(true);
    setIsEditing(false);
    setOpenDropdownId(false);
    
    // Yanıt formu açıldığında otomatik olarak alt yorumları da göster
    if (!showReplies) setShowReplies(true);
  };

  const handleCancelReply = () => {
    setIsReplying(false);
    setReplyContent("");
  };

  const handleSubmitReply = async () => {
    if (!replyContent.trim()) return;
    setIsSubmittingReply(true);
    await dispatch(createComment({ postId, content: replyContent, parentComment: comment._id }));
    setIsSubmittingReply(false);
    setIsReplying(false);
    setReplyContent("");
    
    // Yanıt gönderildiğinde alt yorumları göster
    if (!showReplies) setShowReplies(true);
  };

  const authorInitials = (comment.author?.name?.charAt(0) || "") + (comment.author?.lastname?.charAt(0) || "");
  const formattedDate = formatRelativeTime(comment.createdAt);
  
  const currentUserId = user?._id || user?.id;
  const commentAuthorId = comment.author?._id || comment.author?.id || comment.author;
  const isOwner = currentUserId && commentAuthorId && String(currentUserId) === String(commentAuthorId);

  const apiUrl = process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || "http://localhost:8080";
  
  // Stil Tanımlamaları (Ana Yorum vs Alt Yorum)
  const avatarSize = isReply ? "w-8 h-8" : "w-10 h-10";
  const avatarIconSize = isReply ? "w-4 h-4" : "w-5 h-5";
  const cardPadding = isReply ? "p-3 sm:p-4" : "p-4 sm:p-5";
  const textBase = isReply ? "text-sm" : "text-sm sm:text-base";
  const nameBase = isReply ? "text-sm" : "text-sm sm:text-base";
  const usernameBase = isReply ? "text-[10px] sm:text-[11px]" : "text-[11px] sm:text-xs";
  const bgClass = isReply ? "bg-transparent" : "bg-background";
  const borderClass = isReply ? "border-none" : "border border-border";
  
  // Düzleştirilmiş ve Tarihe Göre Sıralanmış Yanıtlar (Sadece Ana Yorumda Hesaplanır)
  const flatRepliesList = (!isReply && comment.replies) 
    ? flattenReplies(comment.replies, comment.author).sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
    : [];

  return (
    <div className={`flex flex-col ${isReply ? 'mt-2' : 'gap-3 sm:gap-4'} w-full`}>
      <div className={`flex gap-3 sm:gap-4 ${cardPadding} ${bgClass} ${borderClass} rounded-2xl transition-all duration-300 ease-in-out relative group`}>
        
        {/* Sadece Alt Yorumlarda Gözüken Düz Sol Çizgi (İsteğe Bağlı) */}
        {/* {isReply && <div className="absolute left-[-16px] top-0 bottom-0 w-[2px] bg-border/40"></div>} */}

        {/* Profil Resmi */}
        <div className="flex-shrink-0">
          {comment.isDeleted ? (
            <div className={`${avatarSize} rounded-full bg-muted flex items-center justify-center text-muted-foreground border border-border`}>
              <User className={avatarIconSize} />
            </div>
          ) : comment.author?.profileImage ? (
            <img 
              src={`${apiUrl}${comment.author.profileImage}`} 
              alt={comment.author.username} 
              className={`${avatarSize} rounded-full object-cover border border-border shadow-sm`}
            />
          ) : (
            <div className={`${avatarSize} rounded-full bg-primary/10 flex items-center justify-center text-primary text-sm font-bold border border-primary/20 shadow-sm`}>
              {authorInitials.toUpperCase() || <User className={avatarIconSize} />}
            </div>
          )}
        </div>

        {/* Yorum İçeriği */}
        <div className="flex-col flex-1 min-w-0">
          <div className="flex items-start sm:items-center justify-between mb-1 relative">
            
            {comment.isDeleted ? (
              <span className={`font-semibold text-muted-foreground italic ${nameBase}`}>
                Bilinmeyen Kullanıcı
              </span>
            ) : (
              <div className="flex flex-col sm:flex-row sm:items-center sm:gap-2">
                <span className={`font-semibold text-foreground truncate leading-tight ${nameBase}`}>
                  {comment.author?.name} {comment.author?.lastname}
                </span>
                <span className={`text-muted-foreground mt-0.5 sm:mt-0 ${usernameBase}`}>
                  @{comment.author?.username}
                </span>
              </div>
            )}
            
            <div className="flex items-center gap-2 sm:gap-3" ref={dropdownRef}>
              <span className="text-[10px] sm:text-xs font-medium text-muted-foreground whitespace-nowrap">{formattedDate}</span>
              
              {/* Seçenekler İkonu (Sadece Sahibi İçin ve silinmemişse) */}
              {isOwner && !isEditing && !comment.isDeleted && (
                <div className="relative">
                  <button 
                    onClick={() => setOpenDropdownId(!openDropdownId)}
                    className="p-1 rounded-full hover:bg-muted text-muted-foreground hover:text-foreground transition-colors cursor-pointer opacity-100 sm:opacity-0 sm:group-hover:opacity-100"
                  >
                    <MoreVertical className="w-4 h-4" />
                  </button>
                  
                  {openDropdownId && (
                    <div className="absolute right-0 top-full mt-1 w-32 bg-background border border-border rounded-xl shadow-lg overflow-hidden z-50 animate-in slide-in-from-top-2 duration-200">
                      <button 
                        onClick={handleEditClick}
                        className="w-full flex items-center gap-2 px-4 py-2 text-sm text-foreground hover:bg-muted transition-colors text-left cursor-pointer"
                      >
                        <Edit2 className="w-3.5 h-3.5" /> Düzenle
                      </button>
                      <button 
                        onClick={() => {
                          setOpenDropdownId(false);
                          openDeleteModal(comment._id);
                        }}
                        className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-500 hover:bg-red-500/10 transition-colors text-left cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" /> Sil
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Yanıt Verilen Kişi Etiketi (Flat Reply) */}
          {isReply && replyToUser && !comment.isDeleted && (
             <div className="mb-1">
               <span className="text-[11px] sm:text-xs font-medium text-primary bg-primary/10 px-2 py-0.5 rounded-full inline-block">
                 @{replyToUser.username}
               </span>
             </div>
          )}

          {/* İçerik veya Düzenleme Formu */}
          {isEditing ? (
            <div className="mt-2 animate-in fade-in duration-300">
              <textarea
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-muted border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 resize-y min-h-[80px]"
                autoFocus
              />
              <div className="flex justify-end gap-2 mt-2">
                <button 
                  onClick={handleCancelEdit}
                  disabled={isUpdating}
                  className="px-3 py-1.5 text-xs font-medium bg-background border border-border rounded-lg text-foreground hover:bg-muted transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" /> İptal
                </button>
                <button 
                  onClick={handleUpdate}
                  disabled={isUpdating || !editContent.trim() || editContent === comment.content}
                  className="px-3 py-1.5 text-xs font-medium bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1 cursor-pointer"
                >
                  {isUpdating ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />}
                  Kaydet
                </button>
              </div>
            </div>
          ) : (
            <>
              <p className={`leading-relaxed whitespace-pre-wrap ${isReply && replyToUser ? 'mt-1' : 'mt-2'} ${textBase} ${comment.isDeleted ? 'text-muted-foreground italic' : 'text-foreground/90'}`}>
                {comment.content}
              </p>
              
              {/* Yanıtla Butonu */}
              {!comment.isDeleted && !isReplying && (
                <div className="mt-2 sm:mt-3">
                  <button 
                    onClick={handleReplyClick}
                    className="text-xs font-semibold text-muted-foreground hover:text-primary transition-colors flex items-center gap-1.5 cursor-pointer w-fit"
                  >
                    Yanıtla
                  </button>
                </div>
              )}
            </>
          )}

          {/* Yanıt Formu */}
          {isReplying && (
            <div className="mt-3 sm:mt-4 animate-in fade-in slide-in-from-top-2 duration-300">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs text-muted-foreground">Yanıtlanıyor: </span>
                <span className="text-xs font-semibold text-primary">@{comment.author?.username}</span>
              </div>
              <textarea
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
                placeholder="Yanıtınızı buraya yazın..."
                className="w-full px-3 py-2 text-sm bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 resize-y min-h-[80px]"
                autoFocus
              />
              <div className="flex justify-end gap-2 mt-2">
                <button 
                  onClick={handleCancelReply}
                  disabled={isSubmittingReply}
                  className="px-3 py-1.5 text-xs font-medium bg-background border border-border rounded-lg text-foreground hover:bg-muted transition-colors cursor-pointer"
                >
                  İptal
                </button>
                <button 
                  onClick={handleSubmitReply}
                  disabled={isSubmittingReply || !replyContent.trim()}
                  className="px-3 py-1.5 text-xs font-medium bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1 cursor-pointer"
                >
                  {isSubmittingReply ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <MessageSquareReply className="w-3.5 h-3.5" />}
                  Gönder
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Yanıtları Gör (Toggle) Butonu ve Düz Yanıt Listesi (Sadece Ana Yorumda) */}
      {!isReply && flatRepliesList.length > 0 && (
        <div className="flex flex-col ml-12 sm:ml-16 mt-2">
          
          {/* Toggle Butonu */}
          <button 
            onClick={() => setShowReplies(!showReplies)}
            className="flex items-center gap-2 text-xs font-semibold text-primary hover:text-primary/80 transition-colors cursor-pointer w-fit py-1"
          >
            <div className="w-6 h-[2px] bg-primary/40 rounded-full"></div>
            {showReplies ? (
              <>
                <ChevronUp className="w-3.5 h-3.5" /> Yanıtları Gizle
              </>
            ) : (
              <>
                <ChevronDown className="w-3.5 h-3.5" /> {flatRepliesList.length} Yanıtı Gör
              </>
            )}
          </button>
          
          {/* Yanıtların Listelenmesi (Flat) */}
          {showReplies && (
            <div className="flex flex-col mt-3 animate-in fade-in slide-in-from-top-2 duration-300">
              {flatRepliesList.map((reply) => (
                <CommentItem 
                  key={reply._id} 
                  comment={reply} 
                  postId={postId} 
                  isReply={true} 
                  replyToUser={reply.replyToUser}
                  openDeleteModal={openDeleteModal} 
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
