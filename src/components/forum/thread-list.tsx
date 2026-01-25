"use client";

import { FORUM_CATEGORIES, ForumCategory, ForumThread } from "@/types/forum";
import { motion } from "framer-motion";
import {
  CheckCircle,
  ChevronDown,
  Clock,
  Eye,
  Filter,
  MessageSquare,
  Pin,
  Search,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

interface ThreadListProps {
  initialCategory?: ForumCategory;
  gradeLevel?: "1" | "2" | "3";
}

export function ThreadList({ initialCategory, gradeLevel }: ThreadListProps) {
  const [threads, setThreads] = useState<ForumThread[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [category, setCategory] = useState<ForumCategory | "all">(
    initialCategory || "all"
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    fetchThreads();
  }, [category, gradeLevel, searchQuery]);

  async function fetchThreads() {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      if (category !== "all") params.set("category", category);
      if (gradeLevel) params.set("gradeLevel", gradeLevel);
      if (searchQuery) params.set("search", searchQuery);

      const res = await fetch(`/api/forum/threads?${params}`);
      const data = await res.json();
      if (data.success) {
        setThreads(data.threads);
      }
    } catch (error) {
      console.error("Failed to fetch threads:", error);
    } finally {
      setIsLoading(false);
    }
  }

  const statusIcons = {
    open: <MessageSquare className="text-blue-500 dark:text-blue-400" size={16} />,
    answered: <CheckCircle className="text-green-500 dark:text-green-400" size={16} />,
    closed: <Lock className="text-muted-foreground" size={16} />,
    pinned: <Pin className="text-yellow-500 dark:text-yellow-400" size={16} />,
  };

  return (
    <div className="space-y-4">
      {/* Search and filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
            size={20}
          />
          <input
            type="text"
            placeholder="ابحث في المناقشات..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pe-10 ps-4 py-3 bg-background border border-input rounded-xl text-foreground placeholder-muted-foreground focus:border-primary focus:ring-1 focus:ring-primary transition-all"
          />
        </div>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-2 px-4 py-3 bg-muted border border-border rounded-xl text-foreground hover:bg-muted/80 transition-colors"
        >
          <Filter size={20} />
          <span>فلترة</span>
          <ChevronDown
            size={16}
            className={`transition-transform ${showFilters ? "rotate-180" : ""}`}
          />
        </button>
      </div>

      {/* Category filters */}
      {showFilters && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="flex flex-wrap gap-2"
        >
          <button
            onClick={() => setCategory("all")}
            className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${category === "all" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-muted/80"}`}
          >
            الكل
          </button>
          {(
            Object.entries(FORUM_CATEGORIES) as [
              ForumCategory,
              { nameAr: string; icon: string },
            ][]
          ).map(([catId, catInfo]) => (
            <button
              key={catId}
              onClick={() => setCategory(catId)}
              className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${category === catId ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-muted/80"}`}
            >
              {catInfo.icon} {catInfo.nameAr}
            </button>
          ))}
        </motion.div>
      )}

      {/* Threads list */}
      <div className="space-y-3">
        {isLoading ? (
          Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="p-4 bg-muted/50 rounded-xl animate-pulse"
            >
              <div className="h-5 bg-muted rounded w-3/4 mb-2" />
              <div className="h-4 bg-muted rounded w-1/2" />
            </div>
          ))
        ) : threads.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <MessageSquare className="mx-auto mb-3 opacity-50" size={48} />
            <p>لا توجد مناقشات بعد</p>
            <Link
              href="/ar/forum/new"
              className="inline-block mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
            >
              ابدأ مناقشة جديدة
            </Link>
          </div>
        ) : (
          threads.map((thread, index) => (
            <motion.div
              key={thread.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Link
                href={`/ar/forum/${thread.id}`}
                className="block p-4 bg-card border border-border rounded-xl hover:bg-muted/50 hover:border-primary/30 transition-all group"
              >
                <div className="flex items-start gap-3">
                  <div className="mt-1">{statusIcons[thread.status]}</div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-foreground group-hover:text-primary transition-colors truncate">
                      {thread.title}
                    </h3>
                    <p className="text-muted-foreground text-sm mt-1 line-clamp-2">
                      {thread.content.slice(0, 100)}...
                    </p>
                    <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Eye size={12} />
                        {thread.viewCount}
                      </span>
                      <span className="flex items-center gap-1">
                        <MessageSquare size={12} />
                        {thread.replyCount}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock size={12} />
                        {formatTimeAgo(thread.createdAt)}
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}

function Lock({ className, size }: { className?: string; size: number }) {
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  );
}

function formatTimeAgo(date: Date): string {
  const seconds = Math.floor((Date.now() - new Date(date).getTime()) / 1000);
  if (seconds < 60) return "الآن";
  if (seconds < 3600) return `منذ ${Math.floor(seconds / 60)} دقيقة`;
  if (seconds < 86400) return `منذ ${Math.floor(seconds / 3600)} ساعة`;
  return `منذ ${Math.floor(seconds / 86400)} يوم`;
}
