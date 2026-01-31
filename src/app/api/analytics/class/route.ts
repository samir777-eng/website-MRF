import { NextRequest, NextResponse } from "next/server";
import { rateLimit, getResetTime } from "@/lib/security/rate-limiter";
import {
  ClassOverview,
  ClassEngagementMetrics,
  TimeRange,
  StudentSummary,
} from "@/types/analytics";

/**
 * GET /api/analytics/class
 * Get class-level analytics and engagement metrics
 */
export async function GET(request: NextRequest) {
  try {
    if (!rateLimit(request, 60, 60000)) {
      const retryAfter = Math.ceil(getResetTime(request) / 1000);
      return NextResponse.json(
        { success: false, error: "طلبات كثيرة جداً", retryAfter },
        { status: 429, headers: { "Retry-After": retryAfter.toString() } },
      );
    }

    const authToken = request.cookies.get("auth-token")?.value;
    if (!authToken) {
      return NextResponse.json(
        { success: false, error: "غير مصرح" },
        { status: 401 },
      );
    }

    const { searchParams } = new URL(request.url);
    const classId = searchParams.get("classId") || "class-1";
    const timeRange = (searchParams.get("range") || "week") as TimeRange;
    const view = searchParams.get("view") || "overview";

    if (view === "engagement") {
      const metrics = generateMockEngagementMetrics(classId, timeRange);
      return NextResponse.json({ success: true, metrics });
    }

    const overview = generateMockClassOverview(classId);
    return NextResponse.json({ success: true, overview });
  } catch (error) {
    console.error("Class analytics error:", error);
    return NextResponse.json(
      { success: false, error: "حدث خطأ" },
      { status: 500 },
    );
  }
}

function generateMockClassOverview(classId: string): ClassOverview {
  const topPerformers: StudentSummary[] = [
    {
      id: "s1",
      name: "أحمد محمد",
      level: 8,
      totalXP: 12500,
      streak: 45,
      accuracy: 94,
      lastActiveAt: new Date(),
      trend: "improving",
    },
    {
      id: "s2",
      name: "فاطمة علي",
      level: 7,
      totalXP: 10200,
      streak: 32,
      accuracy: 91,
      lastActiveAt: new Date(),
      trend: "stable",
    },
    {
      id: "s3",
      name: "محمود حسن",
      level: 7,
      totalXP: 9800,
      streak: 28,
      accuracy: 89,
      lastActiveAt: new Date(),
      trend: "improving",
    },
  ];

  const needsAttention: StudentSummary[] = [
    {
      id: "s6",
      name: "عمر خالد",
      level: 5,
      totalXP: 6800,
      streak: 0,
      accuracy: 68,
      lastActiveAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      trend: "declining",
    },
    {
      id: "s7",
      name: "ليلى محمود",
      level: 4,
      totalXP: 5200,
      streak: 0,
      accuracy: 72,
      lastActiveAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      trend: "declining",
    },
  ];

  return {
    classId,
    className: "الصف الثاني الثانوي - أ",
    gradeLevel: "2",
    totalStudents: 35,
    activeStudents: 31,
    averageXP: 7850,
    averageLevel: 5.8,
    averageAccuracy: 82,
    averageStreak: 14,
    topPerformers,
    needsAttention,
  };
}

function generateMockEngagementMetrics(
  classId: string,
  timeRange: TimeRange,
): ClassEngagementMetrics {
  const daysInRange = timeRange === "week" ? 7 : timeRange === "month" ? 30 : 7;

  return {
    classId,
    timeRange,
    dailyActiveUsers: Array.from(
      { length: daysInRange },
      () => Math.floor(Math.random() * 10) + 25,
    ),
    weeklyActiveUsers: 31,
    monthlyActiveUsers: 34,
    averageSessionDuration: 28,
    lessonsViewed: 456,
    quizzesCompleted: 234,
    homeworkSubmitted: 142,
    forumPosts: 67,
    averageQuizScore: 78,
    averageHomeworkScore: 82,
    completionRate: 85,
    totalXPEarned: 45600,
    achievementsUnlocked: 89,
    streaksActive: 24,
  };
}
