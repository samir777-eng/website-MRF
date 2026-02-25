import { NextRequest, NextResponse } from 'next/server';
import { rateLimit, getResetTime } from '@/lib/security/rate-limiter';
import { StudentDetailedAnalytics, SubjectPerformance, DailyActivity, TimeRange } from '@/types/analytics';

/**
 * GET /api/analytics/students
 * Get detailed analytics for a specific student or list of students
 */
export async function GET(request: NextRequest) {
  try {
    if (!rateLimit(request, 60, 60000)) {
      const retryAfter = Math.ceil(getResetTime(request) / 1000);
      return NextResponse.json(
        { success: false, error: 'طلبات كثيرة جداً', retryAfter },
        { status: 429, headers: { 'Retry-After': retryAfter.toString() } }
      );
    }

    const authToken = request.cookies.get('auth-token')?.value;
    if (!authToken) {
      return NextResponse.json({ success: false, error: 'غير مصرح' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const studentId = searchParams.get('studentId');
    const timeRange = (searchParams.get('range') || 'month') as TimeRange;

    if (studentId) {
      const analytics = generateMockStudentAnalytics(studentId, timeRange);
      return NextResponse.json({ success: true, analytics });
    }

    // Return list of students with summary
    const students = generateMockStudentList();
    return NextResponse.json({ success: true, students, total: students.length });
  } catch (error) {
    console.error('Student analytics error:', error);
    return NextResponse.json({ success: false, error: 'حدث خطأ' }, { status: 500 });
  }
}

function generateMockStudentAnalytics(studentId: string, timeRange: TimeRange): StudentDetailedAnalytics {
  const subjectPerformance: SubjectPerformance[] = [
    { subject: 'Arabic', subjectAr: 'اللغة العربية', accuracy: 88, questionsAnswered: 245, averageTimePerQuestion: 32, improvement: 5.2, weakTopics: ['النحو المتقدم'], strongTopics: ['القراءة', 'الإملاء'] },
    { subject: 'Mathematics', subjectAr: 'الرياضيات', accuracy: 82, questionsAnswered: 198, averageTimePerQuestion: 45, improvement: 8.1, weakTopics: ['التفاضل'], strongTopics: ['الجبر', 'الهندسة'] },
    { subject: 'Science', subjectAr: 'العلوم', accuracy: 91, questionsAnswered: 156, averageTimePerQuestion: 38, improvement: 3.5, weakTopics: [], strongTopics: ['الفيزياء', 'الكيمياء'] },
    { subject: 'English', subjectAr: 'اللغة الإنجليزية', accuracy: 79, questionsAnswered: 134, averageTimePerQuestion: 28, improvement: -2.1, weakTopics: ['Grammar', 'Writing'], strongTopics: ['Reading'] },
  ];

  const dailyActivity: DailyActivity[] = Array.from({ length: 30 }, (_, i) => ({
    date: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000),
    xpEarned: Math.floor(Math.random() * 200) + 50,
    questionsAnswered: Math.floor(Math.random() * 20) + 5,
    timeSpent: Math.floor(Math.random() * 60) + 15,
    lessonsCompleted: Math.floor(Math.random() * 3),
    quizzesCompleted: Math.floor(Math.random() * 2),
  }));

  return {
    studentId,
    studentName: 'أحمد محمد',
    gradeLevel: '2',
    totalXP: 12500,
    level: 8,
    currentStreak: 45,
    longestStreak: 52,
    totalTimeSpent: 4520,
    subjectPerformance,
    dailyActivity,
    achievementsUnlocked: 28,
    totalAchievements: 60,
    loginFrequency: 5.8,
    averageSessionDuration: 35,
    questionsAnswered: 733,
    quizzesCompleted: 89,
    homeworkSubmitted: 42,
  };
}

function generateMockStudentList() {
  return [
    { id: 's1', name: 'أحمد محمد', gradeLevel: '2', level: 8, totalXP: 12500, streak: 45, accuracy: 88, lastActiveAt: new Date(), trend: 'improving' as const },
    { id: 's2', name: 'فاطمة علي', gradeLevel: '2', level: 7, totalXP: 10200, streak: 32, accuracy: 91, lastActiveAt: new Date(), trend: 'stable' as const },
    { id: 's3', name: 'محمود حسن', gradeLevel: '1', level: 7, totalXP: 9800, streak: 28, accuracy: 89, lastActiveAt: new Date(), trend: 'improving' as const },
    { id: 's4', name: 'نور الدين', gradeLevel: '3', level: 6, totalXP: 8500, streak: 21, accuracy: 87, lastActiveAt: new Date(), trend: 'stable' as const },
    { id: 's5', name: 'سارة أحمد', gradeLevel: '2', level: 6, totalXP: 8200, streak: 19, accuracy: 92, lastActiveAt: new Date(), trend: 'improving' as const },
    { id: 's6', name: 'عمر خالد', gradeLevel: '1', level: 5, totalXP: 6800, streak: 12, accuracy: 78, lastActiveAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), trend: 'declining' as const },
    { id: 's7', name: 'ليلى محمود', gradeLevel: '3', level: 5, totalXP: 6500, streak: 0, accuracy: 85, lastActiveAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), trend: 'declining' as const },
    { id: 's8', name: 'يوسف إبراهيم', gradeLevel: '2', level: 4, totalXP: 5200, streak: 8, accuracy: 82, lastActiveAt: new Date(), trend: 'stable' as const },
  ];
}

