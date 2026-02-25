"use client";

import { ForumReply, ForumThread } from "@/types/forum";
import { motion } from "framer-motion";
import {
  ArrowRight,
  CheckCircle,
  Clock,
  MessageSquare,
  Send,
  ThumbsUp,
  User,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

interface ThreadViewProps {
  threadId: string;
}

export function ThreadView({ threadId }: ThreadViewProps) {
  const [thread, setThread] = useState<ForumThread | null>(null);
  const [replies, setReplies] = useState<ForumReply[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [replyContent, setReplyContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [replyingTo, setReplyingTo] = useState<string | null>(null);

  useEffect(() => {
    fetchThread();
    fetchReplies();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [threadId]);

  async function fetchThread() {
    try {
      const res = await fetch(`/api/forum/threads?id=${threadId}`);
      const data = await res.json();
      if (data.success) setThread(data.threads[0]);
    } catch (error) {
      console.error("Failed to fetch thread:", error);
    } finally {
      setIsLoading(false);
    }
  }

  async function fetchReplies() {
    try {
      const res = await fetch(`/api/forum/replies?threadId=${threadId}`);
      const data = await res.json();
      if (data.success) setReplies(data.replies);
    } catch (error) {
      console.error("Failed to fetch replies:", error);
    }
  }

  async function handleSubmitReply() {
    if (!replyContent.trim()) return;
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/forum/replies", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          threadId,
          content: replyContent,
          parentReplyId: replyingTo,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setReplyContent("");
        setReplyingTo(null);
        fetchReplies();
      }
    } catch (error) {
      console.error("Failed to post reply:", error);
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleLikeReply(replyId: string) {
    try {
      await fetch("/api/forum/replies", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ replyId, action: "like" }),
      });
      fetchReplies();
    } catch (error) {
      console.error("Failed to like reply:", error);
    }
  }

  if (isLoading) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-8 bg-gray-700 rounded w-3/4" />
        <div className="h-32 bg-gray-700 rounded" />
      </div>
    );
  }

  if (!thread) {
    return (
      <div className="text-center py-12 text-gray-400">
        لم يتم العثور على المناقشة
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Back link */}
      <Link
        href="/ar/forum"
        className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
      >
        <ArrowRight size={20} /> العودة للمناقشات
      </Link>

      {/* Thread header */}
      <div className="p-6 bg-gray-800/50 border border-gray-700/50 rounded-2xl">
        <div className="flex items-center gap-2 text-sm text-gray-400 mb-3">
          <User size={16} /> {thread.authorName} • <Clock size={14} />{" "}
          {formatDate(thread.createdAt)}
        </div>
        <h1 className="text-2xl font-bold text-white mb-4">{thread.title}</h1>
        <p className="text-gray-300 whitespace-pre-wrap">{thread.content}</p>
        {thread.tags && thread.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-4">
            {thread.tags.map((tag) => (
              <span
                key={tag}
                className="px-2 py-1 bg-purple-500/20 text-purple-300 rounded-full text-sm"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Reply form */}
      <div className="p-4 bg-gray-800/30 border border-gray-700/30 rounded-xl">
        {replyingTo && (
          <div className="flex items-center justify-between mb-2 px-3 py-2 bg-purple-500/10 rounded-lg">
            <span className="text-purple-300 text-sm">الرد على تعليق...</span>
            <button
              onClick={() => setReplyingTo(null)}
              className="text-gray-400 hover:text-white"
            >
              ✕
            </button>
          </div>
        )}
        <div className="flex gap-3">
          <textarea
            value={replyContent}
            onChange={(e) => setReplyContent(e.target.value)}
            placeholder="اكتب ردك هنا..."
            className="flex-1 p-3 bg-gray-900 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 resize-none"
            rows={3}
          />
          <button
            onClick={handleSubmitReply}
            disabled={isSubmitting || !replyContent.trim()}
            className="self-end px-4 py-3 bg-purple-500 text-white rounded-xl hover:bg-purple-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Send size={20} />
          </button>
        </div>
      </div>

      {/* Replies */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-white flex items-center gap-2">
          <MessageSquare size={20} /> الردود ({replies.length})
        </h2>
        {replies.map((reply, index) => (
          <motion.div
            key={reply.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className={`p-4 rounded-xl ${reply.isAcceptedAnswer ? "bg-green-900/20 border-2 border-green-500/30" : "bg-gray-800/30 border border-gray-700/30"}`}
          >
            <div className="flex items-center gap-2 text-sm text-gray-400 mb-2">
              <User size={14} /> {reply.authorName} • <Clock size={12} />{" "}
              {formatDate(reply.createdAt)}
              {reply.isAcceptedAnswer && (
                <span className="flex items-center gap-1 text-green-400">
                  <CheckCircle size={14} /> إجابة مقبولة
                </span>
              )}
            </div>
            <p className="text-gray-300">{reply.content}</p>
            <div className="flex items-center gap-4 mt-3">
              <button
                onClick={() => handleLikeReply(reply.id)}
                className="flex items-center gap-1 text-gray-400 hover:text-purple-400 transition-colors"
              >
                <ThumbsUp size={16} /> {reply.likeCount}
              </button>
              <button
                onClick={() => setReplyingTo(reply.id)}
                className="text-gray-400 hover:text-purple-400 transition-colors text-sm"
              >
                رد
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function formatDate(date: Date): string {
  return new Date(date).toLocaleDateString("ar-EG", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}
