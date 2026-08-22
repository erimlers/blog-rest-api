"use client";

import { useState } from "react";
import { Trash2, Loader2, AlertTriangle } from "lucide-react";
import { useDispatch } from "react-redux";
import { deleteComment } from "../../store/slices/postSlice";
import CommentItem from "./CommentItem";

export default function CommentList({ comments, postId }) {
  const dispatch = useDispatch();
  
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteModalCommentId, setDeleteModalCommentId] = useState(null);

  const openDeleteModal = (commentId) => {
    setDeleteModalCommentId(commentId);
  };

  const confirmDelete = async () => {
    if (!deleteModalCommentId) return;
    setIsDeleting(true);
    await dispatch(deleteComment({ postId, commentId: deleteModalCommentId }));
    setIsDeleting(false);
    setDeleteModalCommentId(null);
  };

  if (!comments || comments.length === 0) {
    return (
      <div className="text-center p-12 bg-muted/30 border border-border border-dashed rounded-2xl transition-colors duration-500 ease-in-out">
        <p className="text-muted-foreground font-medium">İlk yorumu siz yapın!</p>
      </div>
    );
  }

  return (
    <>
      <div className="flex flex-col gap-6">
        {comments.map((comment) => (
          <CommentItem 
            key={comment._id} 
            comment={comment} 
            postId={postId} 
            level={0} 
            openDeleteModal={openDeleteModal} 
          />
        ))}
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
              Bu yorumu kalıcı olarak silmek istediğinize emin misiniz? Altındaki yanıtlar silinmeyecektir.
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
