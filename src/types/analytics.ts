// Analytics Dashboard for Educators
// Real-time metrics to track student progress and engagement

export type TimeRange =
  | "today"
  | "week"
  | "month"
  | "semester"
  | "year"
  | "all";

export interface ClassOverview {
  classId: string;
  className: string;
  gradeLevel: "1" | "2" | "3";
  totalStudents: number;
  activeStudents: number; // Active in last 7 days
  averageXP: number;
  averageLevel: number;
  averageAccuracy: number;
  averageStreak: number;
  topPerformers: StudentSummary[];
  needsAttention: StudentSummary[]; // Students falling behind
}

export interface StudentSummary {
  id: string;
  name: string;
  avatar?: string;
  level: number;
  totalXP: number;
  streak: number;
  accuracy: number;
  lastActiveAt: Date;
  trend: "improving" | "stable" | "declining";
}

export interface StudentDetailedAnalytics {
  studentId: string;
  studentName: string;
  gradeLevel: "1" | "2" | "3";

  // Overall stats
  totalXP: number;
  level: number;
  currentStreak: number;
  longestStreak: number;
  totalTimeSpent: number; // minutes

  // Performance by subject
  subjectPerformance: SubjectPerformance[];

  // Activity timeline
  dailyActivity: DailyActivity[];

  // Achievements
  achievementsUnlocked: number;
  totalAchievements: number;

  // Engagement metrics
  loginFrequency: number; // days per week average
  averageSessionDuration: number; // minutes
  questionsAnswered: number;
  quizzesCompleted: number;
  homeworkSubmitted: number;
}

export interface SubjectPerformance {
  subject: string;
  subjectAr: string;
  accuracy: number;
  questionsAnswered: number;
  averageTimePerQuestion: number; // seconds
  improvement: number; // percentage change from last period
  weakTopics: string[];
  strongTopics: string[];
}

export interface DailyActivity {
  date: Date;
  xpEarned: number;
  questionsAnswered: number;
  timeSpent: number; // minutes
  lessonsCompleted: number;
  quizzesCompleted: number;
}

export interface ClassEngagementMetrics {
  classId: string;
  timeRange: TimeRange;

  // Engagement
  dailyActiveUsers: number[];
  weeklyActiveUsers: number;
  monthlyActiveUsers: number;
  averageSessionDuration: number;

  // Content consumption
  lessonsViewed: number;
  quizzesCompleted: number;
  homeworkSubmitted: number;
  forumPosts: number;

  // Performance
  averageQuizScore: number;
  averageHomeworkScore: number;
  completionRate: number;

  // Gamification
  totalXPEarned: number;
  achievementsUnlocked: number;
  streaksActive: number;
}

export interface ContentAnalytics {
  contentId: string;
  contentType: "lesson" | "quiz" | "homework" | "tip";
  title: string;

  // Engagement
  viewCount: number;
  completionCount: number;
  completionRate: number;
  averageTimeSpent: number;

  // Performance (for quizzes/homework)
  averageScore?: number;
  passRate?: number;

  // Difficulty analysis
  difficultyRating: "easy" | "medium" | "hard";
  studentFeedback?: number; // 1-5 rating
}

export interface AlertConfig {
  id: string;
  type:
    | "streak_lost"
    | "low_activity"
    | "declining_performance"
    | "achievement_unlocked";
  threshold: number;
  isEnabled: boolean;
}

export interface EducatorAlert {
  id: string;
  type: AlertConfig["type"];
  studentId: string;
  studentName: string;
  message: string;
  messageAr: string;
  severity: "info" | "warning" | "critical";
  createdAt: Date;
  isRead: boolean;
}

// Dashboard summary for quick overview
export interface DashboardSummary {
  totalStudents: number;
  activeToday: number;
  activeThisWeek: number;
  averageEngagement: number; // percentage
  topAchievers: StudentSummary[];
  recentAlerts: EducatorAlert[];
  weeklyTrend: {
    xpGrowth: number;
    activityGrowth: number;
    performanceChange: number;
  };
}

// Helper functions
export function getTimeRangeLabel(range: TimeRange): {
  en: string;
  ar: string;
} {
  const labels: Record<TimeRange, { en: string; ar: string }> = {
    today: { en: "Today", ar: "اليوم" },
    week: { en: "This Week", ar: "هذا الأسبوع" },
    month: { en: "This Month", ar: "هذا الشهر" },
    semester: { en: "This Semester", ar: "هذا الفصل" },
    year: { en: "This Year", ar: "هذا العام" },
    all: { en: "All Time", ar: "كل الوقت" },
  };
  return labels[range];
}

export function getTrendIcon(
  trend: "improving" | "stable" | "declining",
): string {
  const icons = { improving: "📈", stable: "➡️", declining: "📉" };
  return icons[trend];
}

export function getSeverityColor(
  severity: "info" | "warning" | "critical",
): string {
  const colors = { info: "blue", warning: "yellow", critical: "red" };
  return colors[severity];
}
