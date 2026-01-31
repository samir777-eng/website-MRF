import { getResetTime, rateLimit } from "@/lib/security/rate-limiter";
import { ForumReply } from "@/types/forum";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

// Server-side sanitization using simple regex (DOMPurify requires DOM)
function sanitizeHtml(html: string, allowedTags: string[] = []): string {
  if (allowedTags.length === 0) {
    return html.replace(/<[^>]*>/g, "").trim();
  }
  const tagPattern = allowedTags.join("|");
  const regex = new RegExp(`<(?!\/?(?:${tagPattern})\\b)[^>]*>`, "gi");
  return html.replace(regex, "").trim();
}

// In-memory store for demo
const replies: Map<string, ForumReply> = new Map();

const createReplySchema = z.object({
  threadId: z.string(),
  content: z.string().min(10).max(3000),
  parentReplyId: z.string().optional(),
});

/**
 * GET /api/forum/replies?threadId=xxx
 * Get replies for a thread
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const threadId = searchParams.get("threadId");

    if (!threadId) {
      return NextResponse.json(
        { success: false, error: "معرف الموضوع مطلوب" },
        { status: 400 },
      );
    }

    const threadReplies = Array.from(replies.values())
      .filter((r) => r.threadId === threadId && r.isApproved)
      .sort((a, b) => {
        // Accepted answers first, then by likes, then by date
        if (a.isAcceptedAnswer && !b.isAcceptedAnswer) return -1;
        if (!a.isAcceptedAnswer && b.isAcceptedAnswer) return 1;
        if (a.likeCount !== b.likeCount) return b.likeCount - a.likeCount;
        return (
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        );
      });

    // Organize into tree structure for nested replies
    const rootReplies = threadReplies.filter((r) => !r.parentReplyId);
    const nestedReplies = threadReplies.filter((r) => r.parentReplyId);

    const repliesWithChildren = rootReplies.map((reply) => ({
      ...reply,
      children: nestedReplies.filter((nr) => nr.parentReplyId === reply.id),
    }));

    return NextResponse.json({
      success: true,
      replies: repliesWithChildren,
      total: threadReplies.length,
    });
  } catch (error) {
    console.error("Get replies error:", error);
    return NextResponse.json(
      { success: false, error: "حدث خطأ" },
      { status: 500 },
    );
  }
}

/**
 * POST /api/forum/replies
 * Create a new reply
 */
export async function POST(request: NextRequest) {
  try {
    if (!rateLimit(request, 10, 60000)) {
      const retryAfter = Math.ceil(getResetTime(request) / 1000);
      return NextResponse.json(
        { success: false, error: "طلبات كثيرة جداً", retryAfter },
        { status: 429, headers: { "Retry-After": retryAfter.toString() } },
      );
    }

    const authToken = request.cookies.get("auth-token")?.value;
    const userId = authToken ? "user-1" : "demo-user";

    const body = await request.json();
    const validation = createReplySchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        {
          success: false,
          error: "بيانات غير صالحة",
          errors: validation.error.flatten().fieldErrors,
        },
        { status: 400 },
      );
    }

    const { threadId, content, parentReplyId } = validation.data;

    // Sanitize content
    const sanitizedContent = sanitizeHtml(content, [
      "b",
      "i",
      "u",
      "br",
      "p",
      "code",
    ]);

    const reply: ForumReply = {
      id: `reply-${Date.now()}`,
      threadId,
      content: sanitizedContent,
      authorId: userId,
      authorName: "طالب",
      authorLevel: 3,
      likeCount: 0,
      isAcceptedAnswer: false,
      parentReplyId,
      isApproved: true,
      isEdited: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    replies.set(reply.id, reply);

    return NextResponse.json({ success: true, reply }, { status: 201 });
  } catch (error) {
    console.error("Create reply error:", error);
    return NextResponse.json(
      { success: false, error: "حدث خطأ" },
      { status: 500 },
    );
  }
}

/**
 * PATCH /api/forum/replies
 * Accept an answer or like a reply
 */
export async function PATCH(request: NextRequest) {
  try {
    const authToken = request.cookies.get("auth-token")?.value;
    const userId = authToken ? "user-1" : "demo-user";

    const body = await request.json();
    const { replyId, action } = body;

    const reply = replies.get(replyId);
    if (!reply) {
      return NextResponse.json(
        { success: false, error: "الرد غير موجود" },
        { status: 404 },
      );
    }

    if (action === "accept") {
      reply.isAcceptedAnswer = true;
      reply.updatedAt = new Date();
    } else if (action === "like") {
      reply.likeCount += 1;
    }

    replies.set(replyId, reply);

    return NextResponse.json({ success: true, reply });
  } catch (error) {
    console.error("Update reply error:", error);
    return NextResponse.json(
      { success: false, error: "حدث خطأ" },
      { status: 500 },
    );
  }
}
