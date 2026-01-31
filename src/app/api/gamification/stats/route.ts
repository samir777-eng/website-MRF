import { NextRequest, NextResponse } from "next/server";
import { rateLimit, getResetTime } from "@/lib/security/rate-limiter";
import { getUserStats } from "@/lib/gamification/server-utils";

/**
 * GET /api/gamification/stats
 *
 * Get current user's gamification stats from server.
 * This returns authoritative data that cannot be manipulated.
 */
export async function GET(request: NextRequest) {
  try {
    // Rate limiting: 60 requests per minute
    if (!rateLimit(request, 60, 60000)) {
      const retryAfter = Math.ceil(getResetTime(request) / 1000);
      return NextResponse.json(
        {
          success: false,
          error: "طلبات كثيرة جداً. يرجى المحاولة لاحقاً.",
          retryAfter,
        },
        {
          status: 429,
          headers: { "Retry-After": retryAfter.toString() },
        },
      );
    }

    // Get user ID from auth cookie/session
    const authToken = request.cookies.get("auth-token")?.value;
    const userId = authToken ? extractUserIdFromToken(authToken) : "demo-user";

    if (!userId) {
      return NextResponse.json(
        { success: false, error: "غير مصرح. يرجى تسجيل الدخول." },
        { status: 401 },
      );
    }

    // Get stats from server
    const data = getUserStats(userId);

    return NextResponse.json({
      success: true,
      ...data,
    });
  } catch (error) {
    console.error("Get stats error:", error);
    return NextResponse.json(
      { success: false, error: "حدث خطأ. يرجى المحاولة مرة أخرى." },
      { status: 500 },
    );
  }
}

/**
 * Extract user ID from auth token
 */
function extractUserIdFromToken(token: string): string | null {
  if (token.startsWith("mock-jwt-token-")) {
    return "user-1";
  }
  return "demo-user";
}
