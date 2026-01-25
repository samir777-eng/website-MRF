"use client";

import { FORUM_CATEGORIES, ForumCategory } from "@/types/forum";
import { motion } from "framer-motion";
import { ArrowRight, Folder, Send, Tag } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function CreateThreadForm() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState<ForumCategory>("general");
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      setError("يرجى ملء جميع الحقول المطلوبة");
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      const res = await fetch("/api/forum/threads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, content, category, tags }),
      });
      const data = await res.json();
      if (data.success) {
        router.push(`/ar/forum/${data.thread.id}`);
      } else {
        setError(data.error || "حدث خطأ أثناء إنشاء المناقشة");
      }
    } catch (error) {
      console.error("Failed to create thread:", error);
      setError("فشل الاتصال بالخادم");
    } finally {
      setIsSubmitting(false);
    }
  }

  function addTag() {
    const tag = tagInput.trim();
    if (tag && !tags.includes(tag) && tags.length < 5) {
      setTags([...tags, tag]);
      setTagInput("");
    }
  }

  function removeTag(tag: string) {
    setTags(tags.filter((t) => t !== tag));
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <Link
        href="/ar/forum"
        className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowRight size={20} /> العودة للمناقشات
      </Link>

      <div className="p-6 bg-card border border-border rounded-2xl">
        <h1 className="text-2xl font-bold text-foreground mb-6">مناقشة جديدة</h1>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Title */}
          <div>
            <label className="block text-foreground font-medium mb-2">
              العنوان *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="اكتب عنوان مناقشتك..."
              maxLength={150}
              className="w-full p-3 bg-background border border-input rounded-xl text-foreground placeholder-muted-foreground focus:border-primary focus:ring-1 focus:ring-primary"
            />
            <p className="text-muted-foreground text-sm mt-1">{title.length}/150</p>
          </div>

          {/* Category */}
          <div>
            <label className="block text-foreground font-medium mb-2 flex items-center gap-2">
              <Folder size={18} /> الفئة
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(
                Object.entries(FORUM_CATEGORIES) as [
                  ForumCategory,
                  { nameAr: string; icon: string },
                ][]
              ).map(([catId, catInfo]) => (
                <button
                  key={catId}
                  type="button"
                  onClick={() => setCategory(catId)}
                  className={`p-3 rounded-xl text-sm font-medium transition-all ${
                    category === catId
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground hover:bg-muted/80"
                  }`}
                >
                  {catInfo.icon} {catInfo.nameAr}
                </button>
              ))}
            </div>
          </div>

          {/* Content */}
          <div>
            <label className="block text-foreground font-medium mb-2">
              المحتوى *
            </label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="اكتب تفاصيل مناقشتك أو سؤالك..."
              rows={6}
              maxLength={5000}
              className="w-full p-3 bg-background border border-input rounded-xl text-foreground placeholder-muted-foreground focus:border-primary focus:ring-1 focus:ring-primary resize-none"
            />
            <p className="text-muted-foreground text-sm mt-1">{content.length}/5000</p>
          </div>

          {/* Tags */}
          <div>
            <label className="block text-foreground font-medium mb-2 flex items-center gap-2">
              <Tag size={18} /> الوسوم (اختياري)
            </label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) =>
                  e.key === "Enter" && (e.preventDefault(), addTag())
                }
                placeholder="أضف وسماً..."
                maxLength={20}
                className="flex-1 p-3 bg-background border border-input rounded-xl text-foreground placeholder-muted-foreground focus:border-primary"
              />
              <button
                type="button"
                onClick={addTag}
                className="px-4 bg-muted text-foreground rounded-xl hover:bg-muted/80"
              >
                إضافة
              </button>
            </div>
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <span
                    key={tag}
                    className="flex items-center gap-1 px-3 py-1 bg-primary/20 text-primary rounded-full text-sm"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => removeTag(tag)}
                      className="hover:text-foreground"
                    >
                      ✕
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {error && <p className="text-destructive text-sm">{error}</p>}

          {/* Submit */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={isSubmitting}
            className="w-full flex items-center justify-center gap-2 py-4 bg-gradient-to-r from-primary to-violet-600 text-primary-foreground font-bold rounded-xl hover:shadow-lg hover:shadow-primary/25 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            {isSubmitting ? (
              <div className="w-6 h-6 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
            ) : (
              <>
                <Send size={20} /> نشر المناقشة
              </>
            )}
          </motion.button>
        </form>
      </div>
    </div>
  );
}
