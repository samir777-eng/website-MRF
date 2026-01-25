import { NextRequest, NextResponse } from 'next/server';
import { rateLimit, getResetTime } from '@/lib/security/rate-limiter';
import { DashboardSummary, StudentSummary, EducatorAlert, TimeRange } from '@/types/analytics';

/**
 * GET /api/analytics/dashboard
 * Get educator dashboard summary
 */
export async function GET(request: NextRequest) {
  try {
    // Rate limiting: 60 requests per minute
    if (!rateLimit(request, 60, 60000)) {
      const retryAfter = Math.ceil(getResetTime(request) / 1000);
      return NextResponse.json(
        { success: false, error: 'طلبات كثيرة جداً', retryAfter },
        { status: 429, headers: { 'Retry-After': retryAfter.toString() } }
      );
    }

    // Check educator authorization
    const authToken = request.cookies.get('auth-token')?.value;
    if (!authToken) {
      return NextResponse.json(
        { success: false, error: 'غير مصرح. يرجى تسجيل الدخول.' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const timeRange = (searchParams.get('range') || 'week') as TimeRange;
    const classId = searchParams.get('classId');

    // Generate mock data for demo
    const summary = generateMockDashboardSummary(timeRange, classId);

    return NextResponse.json({ success: true, summary, timeRange });
  } catch (error) {
    console.error('Dashboard error:', error);
    return NextResponse.json({ success: false, error: 'حدث خطأ' }, { status: 500 });
  }
}

function generateMockDashboardSummary(timeRange: TimeRange, classId?: string | null): DashboardSummary {
  const topAchievers: StudentSummary[] = [
    { id: 's1', name: 'أحمد محمد', level: 8, totalXP: 12500, streak: 45, accuracy: 94, lastActiveAt: new Date(), trend: 'improving' },
    { id: 's2', name: 'فاطمة علي', level: 7, totalXP: 10200, streak: 32, accuracy: 91, lastActiveAt: new Date(), trend: 'stable' },
    { id: 's3', name: 'محمود حسن', level: 7, totalXP: 9800, streak: 28, accuracy: 89, lastActiveAt: new Date(), trend: 'improving' },
    { id: 's4', name: 'نور الدين', level: 6, totalXP: 8500, streak: 21, accuracy: 87, lastActiveAt: new Date(), trend: 'stable' },
    { id: 's5', name: 'سارة أحمد', level: 6, totalXP: 8200, streak: 19, accuracy: 92, lastActiveAt: new Date(), trend: 'improving' },
  ];

  const recentAlerts: EducatorAlert[] = [
    { id: 'a1', type: 'declining_performance', studentId: 's10', studentName: 'عمر خالد', message: 'Performance dropped 15% this week', messageAr: 'انخفض الأداء بنسبة 15% هذا الأسبوع', severity: 'warning', createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000), isRead: false },
    { id: 'a2', type: 'low_activity', studentId: 's11', studentName: 'ليلى محمود', message: 'No activity for 5 days', messageAr: 'لا نشاط منذ 5 أيام', severity: 'warning', createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000), isRead: false },
    { id: 'a3', type: 'streak_lost', studentId: 's12', studentName: 'يوسف إبراهيم', message: '14-day streak lost', messageAr: 'فقد سلسلة 14 يوم', severity: 'info', createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000), isRead: true },
    { id: 'a4', type: 'achievement_unlocked', studentId: 's1', studentName: 'أحمد محمد', message: 'Unlocked "Monthly Master" achievement', messageAr: 'فتح إنجاز "سيد الشهر"', severity: 'info', createdAt: new Date(Date.now() - 48 * 60 * 60 * 1000), isRead: true },
  ];

  return {
    totalStudents: 156,
    activeToday: 89,
    activeThisWeek: 142,
    averageEngagement: 78,
    topAchievers,
    recentAlerts,
    weeklyTrend: {
      xpGrowth: 12.5,
      activityGrowth: 8.3,
      performanceChange: 3.2,
    },
  };
}

