"use client";

import { useSelector } from "react-redux";
import CommentForm from "./CommentForm";
import CommentList from "./CommentList";
import { MessageSquare } from "lucide-react";

export default function CommentSection({ postId }) {
  const { comments } = useSelector((state) => state.posts);

  return (
    <section className="w-full animate-in fade-in duration-500 delay-200">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-2.5 bg-primary/10 rounded-xl">
          <MessageSquare className="w-6 h-6 text-primary" />
        </div>
        <h2 className="text-2xl font-bold text-foreground">
          Yorumlar <span className="text-muted-foreground text-lg font-medium">({comments?.length || 0})</span>
        </h2>
      </div>

      {/* Yorum Yapma Formu */}
      <div className="mb-12">
        <CommentForm postId={postId} />
      </div>

      {/* Yorum Listesi (Giriş yapılmış veya yapılmamış herkese açık) */}
      <CommentList comments={comments} postId={postId} />
    </section>
  );
}
