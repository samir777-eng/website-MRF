import { getResetTime, rateLimit } from "@/lib/security/rate-limiter";
import { FORUM_CATEGORIES, ForumCategory, ForumThread } from "@/types/forum";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
// Server-side sanitization using simple regex (DOMPurify requires DOM)
function sanitizeHtml(html: string, allowedTags: string[] = []): string {
  if (allowedTags.length === 0) {
    // Strip all HTML tags
    return html.replace(/<[^>]*>/g, "").trim();
  }
  // For allowed tags, we do basic sanitization
  const tagPattern = allowedTags.join("|");
  const regex = new RegExp(`<(?!\/?(?:${tagPattern})\\b)[^>]*>`, "gi");
  return html.replace(regex, "").trim();
}

// In-memory store for demo (replace with database in production)
const threads: Map<string, ForumThread> = new Map();

// Initialize with sample threads
initializeSampleThreads();

const createThreadSchema = z.object({
  title: z.string().min(5).max(200),
  content: z.string().min(20).max(5000),
  category: z.enum([
    "general",
    "arabic",
    "math",
    "science",
    "english",
    "social",
    "exam-prep",
    "study-tips",
    "homework-help",
  ]),
  gradeLevel: z.enum(["1", "2", "3", "all"]),
  tags: z.array(z.string().max(30)).max(5).optional(),
});

/**
 * GET /api/forum/threads
 * List threads with filtering and pagination
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category") as ForumCategory | null;
    const gradeLevel = searchParams.get("grade") as
      | "1"
      | "2"
      | "3"
      | "all"
      | null;
    const status = searchParams.get("status");
    const search = searchParams.get("search");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = Math.min(parseInt(searchParams.get("limit") || "20"), 50);

    let filteredThreads = Array.from(threads.values()).filter(
      (t) => t.isApproved
    );

    // Apply filters
    if (category && Object.keys(FORUM_CATEGORIES).includes(category)) {
      filteredThreads = filteredThreads.filter((t) => t.category === category);
    }
    if (gradeLevel) {
      filteredThreads = filteredThreads.filter(
        (t) => t.gradeLevel === gradeLevel || t.gradeLevel === "all"
      );
    }
    if (status) {
      filteredThreads = filteredThreads.filter((t) => t.status === status);
    }
    if (search) {
      const searchLower = search.toLowerCase();
      filteredThreads = filteredThreads.filter(
        (t) =>
          t.title.toLowerCase().includes(searchLower) ||
          t.content.toLowerCase().includes(searchLower) ||
          t.tags.some((tag) => tag.toLowerCase().includes(searchLower))
      );
    }

    // Sort: pinned first, then by lastReplyAt or createdAt
    filteredThreads.sort((a, b) => {
      if (a.isPinned && !b.isPinned) return -1;
      if (!a.isPinned && b.isPinned) return 1;
      const aDate = a.lastReplyAt || a.createdAt;
      const bDate = b.lastReplyAt || b.createdAt;
      return new Date(bDate).getTime() - new Date(aDate).getTime();
    });

    // Paginate
    const total = filteredThreads.length;
    const startIndex = (page - 1) * limit;
    const paginatedThreads = filteredThreads.slice(
      startIndex,
      startIndex + limit
    );

    return NextResponse.json({
      success: true,
      threads: paginatedThreads,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    });
  } catch (error) {
    console.error("Get threads error:", error);
    return NextResponse.json(
      { success: false, error: "حدث خطأ" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/forum/threads
 * Create a new thread
 */
export async function POST(request: NextRequest) {
  try {
    if (!rateLimit(request, 5, 60000)) {
      const retryAfter = Math.ceil(getResetTime(request) / 1000);
      return NextResponse.json(
        { success: false, error: "طلبات كثيرة جداً", retryAfter },
        { status: 429, headers: { "Retry-After": retryAfter.toString() } }
      );
    }

    const authToken = request.cookies.get("auth-token")?.value;
    const userId = authToken ? "user-1" : "demo-user";

    const body = await request.json();
    const validation = createThreadSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        {
          success: false,
          error: "بيانات غير صالحة",
          errors: validation.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const { title, content, category, gradeLevel, tags } = validation.data;

    // Sanitize content
    const sanitizedContent = sanitizeHtml(content, ["b", "i", "u", "br", "p"]);

    const thread: ForumThread = {
      id: `thread-${Date.now()}`,
      title: sanitizeHtml(title),
      content: sanitizedContent,
      category,
      status: "open",
      authorId: userId,
      authorName: "طالب", // Would come from user profile
      authorLevel: 3,
      gradeLevel,
      viewCount: 0,
      replyCount: 0,
      likeCount: 0,
      tags: tags || [],
      isApproved: true, // Auto-approve for demo
      isPinned: false,
      isLocked: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    threads.set(thread.id, thread);

    return NextResponse.json({ success: true, thread }, { status: 201 });
  } catch (error) {
    console.error("Create thread error:", error);
    return NextResponse.json(
      { success: false, error: "حدث خطأ" },
      { status: 500 }
    );
  }
}

function initializeSampleThreads() {
  const samples: Partial<ForumThread>[] = [
    {
      id: "t1",
      title: "كيف أحل معادلات الدرجة الثانية؟",
      content: "أحتاج مساعدة في فهم طريقة حل المعادلات التربيعية...",
      category: "math",
      gradeLevel: "2",
      tags: ["رياضيات", "معادلات"],
      viewCount: 45,
      replyCount: 8,
      likeCount: 12,
      status: "answered",
    },
    {
      id: "t2",
      title: "نصائح للتحضير لامتحان اللغة العربية",
      content: "شاركوني أفضل طرق المذاكرة للغة العربية...",
      category: "arabic",
      gradeLevel: "all",
      tags: ["عربي", "امتحانات"],
      viewCount: 120,
      replyCount: 15,
      likeCount: 28,
      status: "open",
      isPinned: true,
    },
    {
      id: "t3",
      title: "شرح قوانين نيوتن للحركة",
      content: "من يستطيع شرح قوانين نيوتن الثلاثة بطريقة بسيطة؟",
      category: "science",
      gradeLevel: "1",
      tags: ["فيزياء", "نيوتن"],
      viewCount: 67,
      replyCount: 5,
      likeCount: 9,
      status: "answered",
    },
  ];

  samples.forEach((s) => {
    const thread: ForumThread = {
      ...(s as ForumThread),
      authorId: "user-sample",
      authorName: "طالب متميز",
      authorLevel: 5,
      isApproved: true,
      isPinned: s.isPinned || false,
      isLocked: false,
      createdAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000),
      updatedAt: new Date(),
    };
    threads.set(thread.id, thread);
  });
}
