// Dashboard constants and mock data
// This file contains all static data for the dashboard page

export interface Achievement {
  id: number;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
}

export interface DailyQuest {
  id: number;
  title: string;
  progress: number;
  reward: string;
  completed: boolean;
}

export interface QuickAction {
  id: string;
  label: string;
  icon: string;
  href?: string;
  testId: string;
  hoverColor: string;
}

export interface QuickLink {
  id: string;
  label: string;
  icon: string;
  href: string;
  testId: string;
}

// Static achievements data
export const ACHIEVEMENTS: Achievement[] = [
  {
    id: 1,
    title: "الخطوات الأولى",
    description: "أكمل درسك الأول",
    icon: "🎯",
    unlocked: true,
  },
  {
    id: 2,
    title: "محارب الأسبوع",
    description: "حافظ على سلسلة 7 أيام",
    icon: "🔥",
    unlocked: true,
  },
  {
    id: 3,
    title: "أستاذ النحو",
    description: "احصل على 90%+ في 5 اختبارات نحو",
    icon: "📚",
    unlocked: true,
  },
  {
    id: 4,
    title: "قارئ سريع",
    description: "أكمل 10 تمارين قراءة",
    icon: "⚡",
    unlocked: false,
  },
];

// Daily quests data
export const DAILY_QUESTS: DailyQuest[] = [
  {
    id: 1,
    title: "أكمل درساً واحداً",
    progress: 100,
    reward: "50 نقطة",
    completed: true,
  },
  {
    id: 2,
    title: "تدرب على 10 كلمات مفردات",
    progress: 70,
    reward: "30 نقطة",
    completed: false,
  },
  {
    id: 3,
    title: "خذ اختباراً تدريبياً",
    progress: 0,
    reward: "40 نقطة",
    completed: false,
  },
];

// Quick actions for sidebar
export const QUICK_ACTIONS: QuickAction[] = [
  {
    id: "start-lesson",
    label: "ابدأ درساً جديداً",
    icon: "Play",
    testId: "start-lesson",
    hoverColor: "hover:bg-blue-50 hover:border-blue-200",
  },
  {
    id: "take-quiz",
    label: "خذ اختباراً تدريبياً",
    icon: "Target",
    testId: "take-quiz",
    hoverColor: "hover:bg-green-50 hover:border-green-200",
  },
  {
    id: "review-vocab",
    label: "راجع المفردات",
    icon: "BookOpen",
    testId: "review-vocabulary",
    hoverColor: "hover:bg-purple-50 hover:border-purple-200",
  },
];

// Quick links for sidebar
export const QUICK_LINKS: QuickLink[] = [
  {
    id: "courses",
    label: "الدورات",
    icon: "📚",
    href: "/ar/courses",
    testId: "courses-link",
  },
  {
    id: "challenges",
    label: "التحديات",
    icon: "🧠",
    href: "/ar/challenges",
    testId: "challenges-link",
  },
  {
    id: "profile",
    label: "الملف الشخصي",
    icon: "👤",
    href: "/ar/profile",
    testId: "profile-link",
  },
  {
    id: "leaderboard",
    label: "لوحة المتصدرين",
    icon: "🏆",
    href: "/ar/leaderboard",
    testId: "leaderboard-link",
  },
];

// Current lesson data (would come from API in production)
export const CURRENT_LESSON = {
  title: "النحو العربي - الدرس 8",
  subtitle: "أنماط تصريف الأفعال",
  progress: 75,
  xpReward: 75,
};

// Performance stats (would come from API in production)
export const PERFORMANCE_STATS = {
  lessonsCompleted: 24,
  weeklyTime: "2.5س",
  averageScore: 89,
};

// Text constants
export const TEXT = {
  greeting: "أهلاً بعودتك، أحمد!",
  greetingSubtitle: "مستعد لتطوير مهاراتك في اللغة العربية؟",
  statsTitle: "إحصائياتك السريعة",
  dailyQuestsTitle: "المهام اليومية",
  dailyQuestsDescription: "أكمل هذه التحديات لتحصل على نقاط إضافية!",
  continueLearningTitle: "تابع التعلم",
  continueLearningDescription: "تابع من حيث توقفت واكسب النقاط!",
  achievementsTitle: "الإنجازات الأخيرة",
  achievementsDescription: "معالم التعلم والمكافآت الخاصة بك",
  streakRewardTitle: "مكافأة السلسلة!",
  quickActionsTitle: "إجراءات سريعة",
  quickLinksTitle: "روابط سريعة",
};
