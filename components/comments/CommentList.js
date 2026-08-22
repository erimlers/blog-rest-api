"use client";

import { useState, useRef, useEffect } from "react";
import { formatRelativeTime } from "../../lib/formatTime";
import { User, MoreVertical, Edit2, Trash2, X, Check, Loader2, AlertTriangle } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { updateComment, deleteComment } from "../../store/slices/postSlice";

export default function CommentList({ comments, postId }) {
  const dispatch = useDispatch();
  const { user } = useSelector(state => state.auth);
  
  const [openDropdownId, setOpenDropdownId] = useState(null);
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editContent, setEditContent] = useState("");
  const [isDeleting, setIsDeleting] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);
  
  // Custom Delete Modal State
  const [deleteModalCommentId, setDeleteModalCommentId] = useState(null);

  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpenDropdownId(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleEditClick = (comment) => {
    setEditingCommentId(comment._id);
    setEditContent(comment.content);
    setOpenDropdownId(null);
  };

  const handleCancelEdit = () => {
    setEditingCommentId(null);
    setEditContent("");
  };

  const handleUpdate = async (commentId) => {
    if (!editContent.trim()) return;
    setIsUpdating(true);
    await dispatch(updateComment({ postId, commentId, content: editContent }));
    setIsUpdating(false);
    setEditingCommentId(null);
  };

  const openDeleteModal = (commentId) => {
    setDeleteModalCommentId(commentId);
    setOpenDropdownId(null);
  };

  const confirmDelete = async () => {
    if (!deleteModalCommentId) return;
    setIsDeleting(deleteModalCommentId);
    await dispatch(deleteComment({ postId, commentId: deleteModalCommentId }));
    setIsDeleting(null);
    setDeleteModalCommentId(null);
  };

  if (!comments || comments.length === 0) {
    return (
      <div className="text-center p-12 bg-muted/30 border border-border border-dashed rounded-2xl transition-colors duration-500 ease-in-out">
        <p className="text-muted-foreground font-medium">İlk yorumu siz yapın!</p>
      </div>
    );
  }

  const apiUrl = process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || "http://localhost:8080";

  return (
    <>
      <div className="flex flex-col gap-6" ref={dropdownRef}>
        {comments.map((comment) => {
          const authorInitials = (comment.author?.name?.charAt(0) || "") + (comment.author?.lastname?.charAt(0) || "");
          const formattedDate = formatRelativeTime(comment.createdAt);
          
          // Güvenli Owner Kontrolü
          const currentUserId = user?._id || user?.id;
          const commentAuthorId = comment.author?._id || comment.author?.id || comment.author;
          const isOwner = currentUserId && commentAuthorId && String(currentUserId) === String(commentAuthorId);
          
          const isEditing = editingCommentId === comment._id;
          const isThisDeleting = isDeleting === comment._id;

          return (
            <div key={comment._id} className={`flex gap-4 p-4 sm:p-5 bg-background border border-border rounded-2xl transition-all duration-500 ease-in-out ${isThisDeleting ? 'opacity-50 pointer-events-none' : ''}`}>
              
              {/* Profil Resmi */}
              <div className="flex-shrink-0">
                {comment.author?.profileImage ? (
                  <img 
                    src={`${apiUrl}${comment.author.profileImage}`} 
                    alt={comment.author.username} 
                    className="w-10 h-10 rounded-full object-cover border border-border"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary text-sm font-bold border border-primary/20">
                    {authorInitials.toUpperCase() || <User className="w-5 h-5" />}
                  </div>
                )}
              </div>

              {/* Yorum İçeriği */}
              <div className="flex-col flex-1 min-w-0">
                <div className="flex items-start sm:items-center justify-between mb-1 relative">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:gap-2">
                    <span className="font-semibold text-foreground text-sm sm:text-base truncate leading-tight">
                      {comment.author?.name} {comment.author?.lastname}
                    </span>
                    <span className="text-[11px] sm:text-xs text-muted-foreground mt-0.5 sm:mt-0">
                      @{comment.author?.username}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-2 sm:gap-3">
                    <span className="text-[10px] sm:text-xs font-medium text-muted-foreground whitespace-nowrap">{formattedDate}</span>
                    
                    {/* Seçenekler İkonu (Sadece Sahibi İçin) */}
                    {isOwner && !isEditing && (
                      <div className="relative">
                        <button 
                          onClick={() => setOpenDropdownId(openDropdownId === comment._id ? null : comment._id)}
                          className="p-1 rounded-full hover:bg-muted text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                        >
                          <MoreVertical className="w-4 h-4" />
                        </button>
                        
                        {/* Dropdown Menü (z-50 eklendi) */}
                        {openDropdownId === comment._id && (
                          <div className="absolute right-0 top-full mt-1 w-32 bg-background border border-border rounded-xl shadow-lg overflow-hidden z-50 animate-in slide-in-from-top-2 duration-200">
                            <button 
                              onClick={() => handleEditClick(comment)}
                              className="w-full flex items-center gap-2 px-4 py-2 text-sm text-foreground hover:bg-muted transition-colors text-left cursor-pointer"
                            >
                              <Edit2 className="w-3.5 h-3.5" /> Düzenle
                            </button>
                            <button 
                              onClick={() => openDeleteModal(comment._id)}
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
                        onClick={() => handleUpdate(comment._id)}
                        disabled={isUpdating || !editContent.trim() || editContent === comment.content}
                        className="px-3 py-1.5 text-xs font-medium bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1 cursor-pointer"
                      >
                        {isUpdating ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />}
                        Kaydet
                      </button>
                    </div>
                  </div>
                ) : (
                  <p className="text-foreground/90 text-sm sm:text-base leading-relaxed whitespace-pre-wrap mt-2">
                    {comment.content}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Özel Silme Onay Modalı (Custom Confirm Modal) z-[100] */}
      {deleteModalCommentId && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-background/80 backdrop-blur-sm transition-opacity" 
            onClick={() => setDeleteModalCommentId(null)}
          ></div>
          <div className="relative bg-card border border-border shadow-2xl rounded-2xl w-full max-w-sm p-6 animate-in zoom-in-95 duration-200">
            <div className="flex items-center gap-4 mb-4 text-red-500">
              <div className="p-3 bg-red-500/10 rounded-full">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-foreground">Yorumu Sil</h3>
            </div>
            <p className="text-muted-foreground text-sm mb-6">
              Bu yorumu kalıcı olarak silmek istediğinize emin misiniz? Bu işlem geri alınamaz.
            </p>
            <div className="flex justify-end gap-3">
              <button 
                onClick={() => setDeleteModalCommentId(null)}
                className="px-4 py-2 text-sm font-medium bg-muted text-foreground rounded-xl hover:bg-muted/80 transition-colors cursor-pointer"
              >
                İptal
              </button>
              <button 
                onClick={confirmDelete}
                className="px-4 py-2 text-sm font-medium bg-red-500 text-white rounded-xl hover:bg-red-600 transition-colors cursor-pointer flex items-center gap-2"
              >
                {isDeleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                Evet, Sil
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
