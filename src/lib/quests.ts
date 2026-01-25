"use client";

// Quest types and interfaces
export interface Quest {
  id: string;
  title: string;
  description: string;
  type: 'daily' | 'weekly' | 'learning_path' | 'group' | 'competition';
  category: 'lessons' | 'quizzes' | 'study_time' | 'social' | 'achievement' | 'special';
  difficulty: 'easy' | 'medium' | 'hard' | 'expert';
  icon: string;
  
  // Progress tracking
  currentProgress: number;
  targetProgress: number;
  progressUnit: string;
  
  // Rewards
  xpReward: number;
  bonusRewards?: string[];
  
  // Time constraints
  timeLimit?: number; // in milliseconds
  expiresAt?: Date;
  
  // Status
  isCompleted: boolean;
  isActive: boolean;
  isLocked: boolean;
  
  // Group quest specific
  isGroupQuest?: boolean;
  groupProgress?: number;
  groupTarget?: number;
  participantCount?: number;
  
  // Learning path specific
  prerequisiteQuests?: string[];
  nextQuests?: string[];
  pathName?: string;
}

// Quest difficulty colors and multipliers
export const QUEST_DIFFICULTY = {
  easy: { 
    color: 'text-green-600 bg-green-100', 
    multiplier: 1, 
    label: 'سهل',
    icon: '🟢'
  },
  medium: { 
    color: 'text-yellow-600 bg-yellow-100', 
    multiplier: 1.5, 
    label: 'متوسط',
    icon: '🟡'
  },
  hard: { 
    color: 'text-orange-600 bg-orange-100', 
    multiplier: 2, 
    label: 'صعب',
    icon: '🟠'
  },
  expert: { 
    color: 'text-red-600 bg-red-100', 
    multiplier: 3, 
    label: 'خبير',
    icon: '🔴'
  }
};

// Quest type configurations
export const QUEST_TYPES = {
  daily: {
    label: 'يومي',
    icon: '📅',
    color: 'text-blue-600 bg-blue-100',
    resetInterval: 24 * 60 * 60 * 1000 // 24 hours
  },
  weekly: {
    label: 'أسبوعي',
    icon: '📊',
    color: 'text-purple-600 bg-purple-100',
    resetInterval: 7 * 24 * 60 * 60 * 1000 // 7 days
  },
  learning_path: {
    label: 'مسار تعليمي',
    icon: '🛤️',
    color: 'text-green-600 bg-green-100',
    resetInterval: null // No reset
  },
  group: {
    label: 'جماعي',
    icon: '👥',
    color: 'text-orange-600 bg-orange-100',
    resetInterval: null // Varies
  },
  competition: {
    label: 'مسابقة',
    icon: '🏆',
    color: 'text-red-600 bg-red-100',
    resetInterval: null // Event-based
  }
};

// Sample quest data
export const SAMPLE_QUESTS: Quest[] = [
  // Daily Quests
  {
    id: 'daily_lesson_1',
    title: 'الدرس اليومي',
    description: 'أكمل درساً واحداً اليوم',
    type: 'daily',
    category: 'lessons',
    difficulty: 'easy',
    icon: '📚',
    currentProgress: 0,
    targetProgress: 1,
    progressUnit: 'درس',
    xpReward: 100,
    bonusRewards: ['شارة المتعلم اليومي'],
    expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
    isCompleted: false,
    isActive: true,
    isLocked: false
  },
  {
    id: 'daily_quiz_1',
    title: 'تحدي الاختبار',
    description: 'اجتز اختباراً بنسبة 80% أو أكثر',
    type: 'daily',
    category: 'quizzes',
    difficulty: 'medium',
    icon: '🧠',
    currentProgress: 0,
    targetProgress: 1,
    progressUnit: 'اختبار',
    xpReward: 150,
    bonusRewards: ['نقاط إضافية'],
    expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
    isCompleted: false,
    isActive: true,
    isLocked: false
  },
  {
    id: 'daily_study_time',
    title: 'ساعة الدراسة',
    description: 'ادرس لمدة 60 دقيقة اليوم',
    type: 'daily',
    category: 'study_time',
    difficulty: 'medium',
    icon: '⏰',
    currentProgress: 25,
    targetProgress: 60,
    progressUnit: 'دقيقة',
    xpReward: 120,
    expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
    isCompleted: false,
    isActive: true,
    isLocked: false
  },

  // Weekly Quests
  {
    id: 'weekly_streak',
    title: 'أسبوع من التفوق',
    description: 'حافظ على سلسلة يومية لمدة 7 أيام',
    type: 'weekly',
    category: 'achievement',
    difficulty: 'hard',
    icon: '🔥',
    currentProgress: 3,
    targetProgress: 7,
    progressUnit: 'يوم',
    xpReward: 500,
    bonusRewards: ['شارة المثابرة', 'تجميد سلسلة مجاني'],
    expiresAt: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000),
    isCompleted: false,
    isActive: true,
    isLocked: false
  },
  {
    id: 'weekly_perfect_scores',
    title: 'الدرجات المثالية',
    description: 'احصل على 100% في 5 اختبارات هذا الأسبوع',
    type: 'weekly',
    category: 'quizzes',
    difficulty: 'expert',
    icon: '💯',
    currentProgress: 2,
    targetProgress: 5,
    progressUnit: 'اختبار مثالي',
    xpReward: 800,
    bonusRewards: ['لقب سيد الاختبارات', '1000 نقطة إضافية'],
    expiresAt: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000),
    isCompleted: false,
    isActive: true,
    isLocked: false
  },

  // Learning Path Quests
  {
    id: 'path_grammar_basics',
    title: 'أساسيات النحو',
    description: 'أكمل جميع دروس النحو الأساسية',
    type: 'learning_path',
    category: 'lessons',
    difficulty: 'medium',
    icon: '📖',
    currentProgress: 6,
    targetProgress: 10,
    progressUnit: 'درس نحو',
    xpReward: 1000,
    bonusRewards: ['شهادة إتقان النحو', 'فتح مستوى متقدم'],
    pathName: 'مسار النحو العربي',
    isCompleted: false,
    isActive: true,
    isLocked: false,
    nextQuests: ['path_grammar_advanced']
  },
  {
    id: 'path_poetry_explorer',
    title: 'مستكشف الشعر',
    description: 'اكتشف جمال الشعر العربي من خلال 8 دروس',
    type: 'learning_path',
    category: 'lessons',
    difficulty: 'hard',
    icon: '🎭',
    currentProgress: 0,
    targetProgress: 8,
    progressUnit: 'درس شعر',
    xpReward: 1200,
    bonusRewards: ['لقب شاعر المستقبل', 'مجموعة شعرية خاصة'],
    pathName: 'مسار الأدب والشعر',
    isCompleted: false,
    isActive: false,
    isLocked: true,
    prerequisiteQuests: ['path_grammar_basics']
  },

  // Group Quests
  {
    id: 'group_class_challenge',
    title: 'تحدي الفصل',
    description: 'يحتاج الفصل لإكمال 100 درس جماعياً',
    type: 'group',
    category: 'lessons',
    difficulty: 'medium',
    icon: '🏫',
    currentProgress: 67,
    targetProgress: 100,
    progressUnit: 'درس',
    xpReward: 300,
    bonusRewards: ['شارة روح الفريق', 'حفلة افتراضية'],
    isGroupQuest: true,
    groupProgress: 67,
    groupTarget: 100,
    participantCount: 25,
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    isCompleted: false,
    isActive: true,
    isLocked: false
  },

  // Competition Quests
  {
    id: 'competition_weekend_marathon',
    title: 'ماراثون نهاية الأسبوع',
    description: 'مسابقة دراسية لمدة 48 ساعة - من يحصل على أكثر نقاط؟',
    type: 'competition',
    category: 'special',
    difficulty: 'expert',
    icon: '🏃‍♂️',
    currentProgress: 1250,
    targetProgress: 2000,
    progressUnit: 'نقطة',
    xpReward: 2000,
    bonusRewards: ['كأس البطولة', 'لقب بطل الماراثون', '5000 نقطة إضافية'],
    expiresAt: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
    isCompleted: false,
    isActive: true,
    isLocked: false
  }
];

// Helper functions
export function getQuestProgress(quest: Quest): number {
  return Math.min(100, (quest.currentProgress / quest.targetProgress) * 100);
}

export function isQuestExpired(quest: Quest): boolean {
  if (!quest.expiresAt) return false;
  return new Date() > quest.expiresAt;
}

export function getTimeRemaining(quest: Quest): string {
  if (!quest.expiresAt) return '';
  
  const now = new Date();
  const timeLeft = quest.expiresAt.getTime() - now.getTime();
  
  if (timeLeft <= 0) return 'منتهي الصلاحية';
  
  const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
  const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
  
  if (days > 0) return `${days} يوم و ${hours} ساعة`;
  if (hours > 0) return `${hours} ساعة و ${minutes} دقيقة`;
  return `${minutes} دقيقة`;
}

export function canCompleteQuest(quest: Quest): boolean {
  return quest.isActive && !quest.isLocked && !quest.isCompleted && !isQuestExpired(quest);
}

export function getQuestsByType(quests: Quest[], type: Quest['type']): Quest[] {
  return quests.filter(quest => quest.type === type);
}

export function getActiveQuests(quests: Quest[]): Quest[] {
  return quests.filter(quest => quest.isActive && !quest.isCompleted && !isQuestExpired(quest));
}

export function getCompletedQuests(quests: Quest[]): Quest[] {
  return quests.filter(quest => quest.isCompleted);
}

export function calculateQuestReward(quest: Quest): number {
  const baseReward = quest.xpReward;
  const difficultyMultiplier = QUEST_DIFFICULTY[quest.difficulty].multiplier;
  return Math.floor(baseReward * difficultyMultiplier);
}
