// Gamification System: XP, Levels, Achievements, Daily Questions
// Boost engagement through game mechanics

export type QuestionType = "multiple-choice" | "true-false" | "fill-blank";

export type QuestionDifficulty = "easy" | "medium" | "hard";

export interface DailyQuestion {
  id: string;
  date: Date; // The day this question is for
  question: string;
  type: QuestionType;
  difficulty: QuestionDifficulty;
  gradeLevel: "1" | "2" | "3" | "all";
  category: string; // e.g., 'grammar', 'vocabulary', etc.

  // Question content
  options?: string[]; // For multiple-choice
  correctAnswer: string | number; // Answer text or index
  explanation: string; // Why this is the correct answer

  // XP rewards
  xpReward: number; // Base XP (easy: 10, medium: 20, hard: 30)
  bonusXp?: number; // Bonus for streak

  // Metadata
  totalAttempts: number;
  correctAttempts: number;
  averageTime: number; // seconds
}

export interface DailyQuestionAttempt {
  id: string;
  userId: string;
  questionId: string;
  date: Date;

  // Attempt details
  userAnswer: string | number;
  isCorrect: boolean;
  timeSpent: number; // seconds

  // Rewards
  xpEarned: number;
  bonusXp: number;

  timestamp: Date;
}

export interface UserXP {
  userId: string;

  // XP and Level
  totalXp: number;
  currentLevel: number;
  xpToNextLevel: number;

  // Breakdown
  xpFromQuizzes: number;
  xpFromExercises: number;
  xpFromHomework: number;
  xpFromDailyQuestions: number;
  xpFromTips: number;
  xpFromAchievements: number;

  // Streaks
  dailyQuestionStreak: number; // consecutive days
  longestStreak: number;
  lastDailyQuestionDate?: Date;

  // Statistics
  totalQuestionsAnswered: number;
  correctAnswers: number;
  accuracy: number; // percentage

  // Timestamps
  lastXpGainedAt: Date;
  updatedAt: Date;
}

export interface Level {
  level: number;
  name: string;
  nameAr: string;
  minXp: number;
  maxXp: number;
  icon: string;
  color: string;
  rewards?: string[];
}

export interface Achievement {
  id: string;
  name: string;
  nameAr: string;
  description: string;
  descriptionAr: string;
  icon: string;
  category:
    | "streak"
    | "xp"
    | "quiz"
    | "homework"
    | "social"
    | "special"
    | "accuracy";

  // Requirements
  requirement: {
    type: "streak" | "xp" | "questions" | "accuracy" | "custom";
    value: number;
  };

  // Rewards
  xpReward: number;
  badgeUrl?: string;

  // Rarity
  rarity: "common" | "rare" | "epic" | "legendary";

  // Metadata
  unlockedBy: number; // number of users who unlocked
  createdAt: Date;
}

export interface UserAchievement {
  id: string;
  userId: string;
  achievementId: string;
  unlockedAt: Date;
  progress?: number; // for progressive achievements
}

export interface Leaderboard {
  period: "daily" | "weekly" | "monthly" | "all-time";
  gradeLevel: "1" | "2" | "3" | "all";

  entries: LeaderboardEntry[];

  updatedAt: Date;
}

export interface LeaderboardEntry {
  rank: number;
  userId: string;
  userName: string;
  userAvatar?: string;

  // Stats
  totalXp: number;
  level: number;
  streak: number;
  accuracy: number;

  // Change from previous period
  rankChange?: number; // +5, -3, etc.
}

// XP calculation constants
export const XP_REWARDS = {
  // Daily questions
  DAILY_QUESTION_EASY: 10,
  DAILY_QUESTION_MEDIUM: 20,
  DAILY_QUESTION_HARD: 30,
  DAILY_QUESTION_STREAK_BONUS: 5, // per day of streak

  // Quizzes
  QUIZ_COMPLETION: 50,
  QUIZ_PERFECT_SCORE: 100,

  // Exercises
  EXERCISE_COMPLETION: 75,
  EXERCISE_PERFECT_SCORE: 150,

  // Homework
  HOMEWORK_SUBMISSION: 100,
  HOMEWORK_EXCELLENT_GRADE: 200,

  // Tips
  TIP_WATCHED: 5,
  TIP_COMPLETED: 10,

  // Social
  HELP_CLASSMATE: 15,
  SHARE_CONTENT: 10,

  // Achievements
  ACHIEVEMENT_UNLOCK: 50,
};

// ============================================
// VIRTUAL CURRENCY (GEMS) SYSTEM
// ============================================

export type GemTransactionType =
  | "earned" // From achievements, quests, etc.
  | "purchased" // Real money purchase
  | "spent" // Used in shop
  | "refunded" // Refund from cancelled purchase
  | "bonus" // Special bonus (events, promotions)
  | "gift"; // Received from another user

export interface GemTransaction {
  id: string;
  userId: string;
  type: GemTransactionType;
  amount: number; // Positive for earned/purchased, negative for spent
  balance: number; // Balance after transaction
  description: string;
  descriptionAr: string;
  relatedItemId?: string; // Shop item, achievement, etc.
  createdAt: Date;
}

export interface UserGems {
  userId: string;
  balance: number;
  totalEarned: number;
  totalSpent: number;
  lastTransactionAt?: Date;
  updatedAt: Date;
}

export type ShopItemCategory =
  | "power-ups" // Streak freeze, XP boost, etc.
  | "cosmetics" // Avatars, themes, badges
  | "content" // Premium lessons, extra quizzes
  | "bundles"; // Combo packs

export interface ShopItem {
  id: string;
  name: string;
  nameAr: string;
  description: string;
  descriptionAr: string;
  category: ShopItemCategory;
  icon: string;
  price: number; // In gems
  originalPrice?: number; // For discounts
  discount?: number; // Percentage off
  isLimited?: boolean; // Limited time offer
  expiresAt?: Date;
  stock?: number; // Limited quantity
  maxPerUser?: number; // Purchase limit per user
  isActive: boolean;
  sortOrder: number;
  createdAt: Date;
}

export interface UserPurchase {
  id: string;
  userId: string;
  itemId: string;
  quantity: number;
  totalPrice: number;
  purchasedAt: Date;
  expiresAt?: Date; // For time-limited items
  isUsed?: boolean; // For consumables
  usedAt?: Date;
}

// Gem earning rates
export const GEM_REWARDS = {
  // Daily activities
  DAILY_LOGIN: 5,
  DAILY_QUESTION_CORRECT: 2,
  DAILY_STREAK_BONUS: 1, // Per day of streak

  // Achievements
  ACHIEVEMENT_COMMON: 10,
  ACHIEVEMENT_RARE: 25,
  ACHIEVEMENT_EPIC: 50,
  ACHIEVEMENT_LEGENDARY: 100,

  // Quests
  QUEST_DAILY: 15,
  QUEST_WEEKLY: 50,
  QUEST_MONTHLY: 200,

  // Milestones
  LEVEL_UP: 20,
  STREAK_7: 25,
  STREAK_30: 100,
  STREAK_100: 500,

  // Social
  INVITE_FRIEND: 50,
  FRIEND_JOINS: 25,
};

// Shop items catalog
export const SHOP_ITEMS: ShopItem[] = [
  // Power-ups
  {
    id: "streak-freeze",
    name: "Streak Freeze",
    nameAr: "تجميد السلسلة",
    description: "Protect your streak for one day if you miss practice",
    descriptionAr: "احمِ سلسلتك ليوم واحد إذا فاتتك الممارسة",
    category: "power-ups",
    icon: "❄️",
    price: 50,
    maxPerUser: 5,
    isActive: true,
    sortOrder: 1,
    createdAt: new Date(),
  },
  {
    id: "double-xp-1h",
    name: "Double XP (1 Hour)",
    nameAr: "ضعف الخبرة (ساعة)",
    description: "Earn double XP for 1 hour",
    descriptionAr: "اكسب ضعف نقاط الخبرة لمدة ساعة",
    category: "power-ups",
    icon: "⚡",
    price: 75,
    isActive: true,
    sortOrder: 2,
    createdAt: new Date(),
  },
  {
    id: "double-xp-24h",
    name: "Double XP (24 Hours)",
    nameAr: "ضعف الخبرة (24 ساعة)",
    description: "Earn double XP for 24 hours",
    descriptionAr: "اكسب ضعف نقاط الخبرة لمدة 24 ساعة",
    category: "power-ups",
    icon: "⚡",
    price: 200,
    originalPrice: 300,
    discount: 33,
    isActive: true,
    sortOrder: 3,
    createdAt: new Date(),
  },
  {
    id: "energy-refill",
    name: "Energy Refill",
    nameAr: "إعادة تعبئة الطاقة",
    description: "Instantly refill your energy to maximum",
    descriptionAr: "أعد تعبئة طاقتك فوراً إلى الحد الأقصى",
    category: "power-ups",
    icon: "🔋",
    price: 30,
    isActive: true,
    sortOrder: 4,
    createdAt: new Date(),
  },
  {
    id: "hint-pack-5",
    name: "Hint Pack (5)",
    nameAr: "حزمة التلميحات (5)",
    description: "Get 5 hints to use in quizzes",
    descriptionAr: "احصل على 5 تلميحات لاستخدامها في الاختبارات",
    category: "power-ups",
    icon: "💡",
    price: 40,
    isActive: true,
    sortOrder: 5,
    createdAt: new Date(),
  },
  {
    id: "mistake-eraser",
    name: "Mistake Eraser",
    nameAr: "ممحاة الأخطاء",
    description: "Remove one wrong answer from a quiz",
    descriptionAr: "احذف إجابة خاطئة واحدة من الاختبار",
    category: "power-ups",
    icon: "🧹",
    price: 25,
    isActive: true,
    sortOrder: 6,
    createdAt: new Date(),
  },

  // Cosmetics
  {
    id: "avatar-scientist",
    name: "Scientist Avatar",
    nameAr: "صورة العالِم",
    description: "A cool scientist avatar for your profile",
    descriptionAr: "صورة عالِم رائعة لملفك الشخصي",
    category: "cosmetics",
    icon: "🔬",
    price: 100,
    isActive: true,
    sortOrder: 10,
    createdAt: new Date(),
  },
  {
    id: "avatar-astronaut",
    name: "Astronaut Avatar",
    nameAr: "صورة رائد الفضاء",
    description: "An astronaut avatar for your profile",
    descriptionAr: "صورة رائد فضاء لملفك الشخصي",
    category: "cosmetics",
    icon: "🚀",
    price: 150,
    isActive: true,
    sortOrder: 11,
    createdAt: new Date(),
  },
  {
    id: "avatar-pharaoh",
    name: "Pharaoh Avatar",
    nameAr: "صورة الفرعون",
    description: "A majestic pharaoh avatar",
    descriptionAr: "صورة فرعون مهيبة",
    category: "cosmetics",
    icon: "👑",
    price: 200,
    isActive: true,
    sortOrder: 12,
    createdAt: new Date(),
  },
  {
    id: "theme-dark-gold",
    name: "Dark Gold Theme",
    nameAr: "سمة الذهب الداكن",
    description: "Elegant dark theme with gold accents",
    descriptionAr: "سمة داكنة أنيقة بلمسات ذهبية",
    category: "cosmetics",
    icon: "🌙",
    price: 300,
    isActive: true,
    sortOrder: 13,
    createdAt: new Date(),
  },
  {
    id: "badge-vip",
    name: "VIP Badge",
    nameAr: "شارة VIP",
    description: "Show off your VIP status",
    descriptionAr: "أظهر حالتك كـ VIP",
    category: "cosmetics",
    icon: "⭐",
    price: 500,
    isActive: true,
    sortOrder: 14,
    createdAt: new Date(),
  },
  {
    id: "avatar-crown",
    name: "King's Crown",
    nameAr: "تاج الملك",
    description: "A golden crown for your avatar",
    descriptionAr: "تاج ذهبي يظهر على صورتك الشخصية",
    category: "cosmetics",
    icon: "👑",
    price: 250,
    isActive: true,
    sortOrder: 15,
    createdAt: new Date(),
  },
  {
    id: "rainbow-theme",
    name: "Rainbow Theme",
    nameAr: "ثيم قوس قزح",
    description: "A colorful rainbow theme for the interface",
    descriptionAr: "ثيم ملون خاص للواجهة",
    category: "cosmetics",
    icon: "🌈",
    price: 150,
    isActive: true,
    sortOrder: 16,
    createdAt: new Date(),
  },

  // Content
  {
    id: "extra-quiz-pack",
    name: "Extra Quiz Pack",
    nameAr: "حزمة اختبارات إضافية",
    description: "10 additional practice quizzes",
    descriptionAr: "10 اختبارات تدريبية إضافية",
    category: "content",
    icon: "📝",
    price: 150,
    isActive: true,
    sortOrder: 20,
    createdAt: new Date(),
  },
  {
    id: "advanced-tips",
    name: "Advanced Tips Collection",
    nameAr: "مجموعة النصائح المتقدمة",
    description: "Unlock 20 advanced study tips",
    descriptionAr: "افتح 20 نصيحة دراسية متقدمة",
    category: "content",
    icon: "📚",
    price: 100,
    isActive: true,
    sortOrder: 21,
    createdAt: new Date(),
  },

  // Bundles
  {
    id: "starter-bundle",
    name: "Starter Bundle",
    nameAr: "حزمة البداية",
    description: "3 Streak Freezes + 5 Hints + Energy Refill",
    descriptionAr: "3 تجميد سلسلة + 5 تلميحات + إعادة تعبئة طاقة",
    category: "bundles",
    icon: "🎁",
    price: 150,
    originalPrice: 220,
    discount: 32,
    isActive: true,
    sortOrder: 30,
    createdAt: new Date(),
  },
  {
    id: "pro-bundle",
    name: "Pro Bundle",
    nameAr: "حزمة المحترف",
    description: "5 Streak Freezes + Double XP 24h + 10 Hints + VIP Badge",
    descriptionAr: "5 تجميد سلسلة + ضعف الخبرة 24 ساعة + 10 تلميحات + شارة VIP",
    category: "bundles",
    icon: "💎",
    price: 600,
    originalPrice: 900,
    discount: 33,
    isActive: true,
    sortOrder: 31,
    createdAt: new Date(),
  },
];

// Helper: Get gem reward for achievement rarity
export function getGemRewardForRarity(
  rarity: "common" | "rare" | "epic" | "legendary"
): number {
  const rewards = {
    common: GEM_REWARDS.ACHIEVEMENT_COMMON,
    rare: GEM_REWARDS.ACHIEVEMENT_RARE,
    epic: GEM_REWARDS.ACHIEVEMENT_EPIC,
    legendary: GEM_REWARDS.ACHIEVEMENT_LEGENDARY,
  };
  return rewards[rarity];
}

// Helper: Get shop item by ID
export function getShopItem(itemId: string): ShopItem | undefined {
  return SHOP_ITEMS.find((item) => item.id === itemId);
}

// Helper: Get shop items by category
export function getShopItemsByCategory(category: ShopItemCategory): ShopItem[] {
  return SHOP_ITEMS.filter(
    (item) => item.category === category && item.isActive
  ).sort((a, b) => a.sortOrder - b.sortOrder);
}

// Level system (1-100)
export const LEVELS: Level[] = [
  {
    level: 1,
    name: "Beginner",
    nameAr: "مبتدئ",
    minXp: 0,
    maxXp: 100,
    icon: "🌱",
    color: "green",
  },
  {
    level: 2,
    name: "Learner",
    nameAr: "متعلم",
    minXp: 100,
    maxXp: 250,
    icon: "📚",
    color: "blue",
  },
  {
    level: 3,
    name: "Student",
    nameAr: "طالب",
    minXp: 250,
    maxXp: 500,
    icon: "🎓",
    color: "indigo",
  },
  {
    level: 4,
    name: "Scholar",
    nameAr: "دارس",
    minXp: 500,
    maxXp: 1000,
    icon: "📖",
    color: "purple",
  },
  {
    level: 5,
    name: "Expert",
    nameAr: "خبير",
    minXp: 1000,
    maxXp: 2000,
    icon: "⭐",
    color: "yellow",
  },
  {
    level: 6,
    name: "Master",
    nameAr: "متقن",
    minXp: 2000,
    maxXp: 5000,
    icon: "🏆",
    color: "orange",
  },
  {
    level: 7,
    name: "Champion",
    nameAr: "بطل",
    minXp: 5000,
    maxXp: 10000,
    icon: "👑",
    color: "red",
  },
  {
    level: 8,
    name: "Legend",
    nameAr: "أسطورة",
    minXp: 10000,
    maxXp: 999999,
    icon: "💎",
    color: "pink",
  },
];

// Helper function to calculate level from XP
export function calculateLevel(xp: number): Level {
  for (let i = LEVELS.length - 1; i >= 0; i--) {
    if (xp >= LEVELS[i].minXp) {
      return LEVELS[i];
    }
  }
  return LEVELS[0];
}

// Helper function to calculate XP to next level
export function calculateXpToNextLevel(xp: number): number {
  const currentLevel = calculateLevel(xp);
  const nextLevel = LEVELS.find((l) => l.level === currentLevel.level + 1);
  if (!nextLevel) return 0;
  return nextLevel.minXp - xp;
}

// Helper function to calculate streak bonus
export function calculateStreakBonus(streak: number): number {
  return Math.min(streak * XP_REWARDS.DAILY_QUESTION_STREAK_BONUS, 100); // Max 100 bonus
}

// ============================================
// ACHIEVEMENTS DATA (50+ Achievements)
// ============================================

// Achievement definitions with full details
export const ACHIEVEMENTS_DATA: (Achievement & {
  isUnlocked: boolean;
  progress: number;
  color: string;
})[] = [
  // ============================================
  // STREAK ACHIEVEMENTS (10 total)
  // ============================================
  {
    id: "streak-3",
    name: "Getting Started",
    nameAr: "البداية",
    description: "Complete daily questions for 3 days in a row",
    descriptionAr: "أجب على السؤال اليومي لمدة 3 أيام متتالية",
    icon: "🔥",
    color: "orange",
    rarity: "common",
    category: "streak",
    requirement: { type: "streak", value: 3 },
    xpReward: 50,
    unlockedBy: 0,
    createdAt: new Date(),
    isUnlocked: false,
    progress: 0,
  },
  {
    id: "streak-7",
    name: "Week Warrior",
    nameAr: "محارب الأسبوع",
    description: "Complete daily questions for 7 days in a row",
    descriptionAr: "أجب على السؤال اليومي لمدة 7 أيام متتالية",
    icon: "🔥",
    color: "orange",
    rarity: "rare",
    category: "streak",
    requirement: { type: "streak", value: 7 },
    xpReward: 100,
    unlockedBy: 0,
    createdAt: new Date(),
    isUnlocked: false,
    progress: 0,
  },
  {
    id: "streak-14",
    name: "Fortnight Fighter",
    nameAr: "محارب الأسبوعين",
    description: "Complete daily questions for 14 days in a row",
    descriptionAr: "أجب على السؤال اليومي لمدة 14 يوماً متتالياً",
    icon: "🔥",
    color: "orange",
    rarity: "rare",
    category: "streak",
    requirement: { type: "streak", value: 14 },
    xpReward: 200,
    unlockedBy: 0,
    createdAt: new Date(),
    isUnlocked: false,
    progress: 0,
  },
  {
    id: "streak-30",
    name: "Monthly Master",
    nameAr: "سيد الشهر",
    description: "Complete daily questions for 30 days in a row",
    descriptionAr: "أجب على السؤال اليومي لمدة 30 يوماً متتالياً",
    icon: "🔥",
    color: "red",
    rarity: "epic",
    category: "streak",
    requirement: { type: "streak", value: 30 },
    xpReward: 500,
    unlockedBy: 0,
    createdAt: new Date(),
    isUnlocked: false,
    progress: 0,
  },
  {
    id: "streak-60",
    name: "Two Month Champion",
    nameAr: "بطل الشهرين",
    description: "Complete daily questions for 60 days in a row",
    descriptionAr: "أجب على السؤال اليومي لمدة 60 يوماً متتالياً",
    icon: "🔥",
    color: "red",
    rarity: "epic",
    category: "streak",
    requirement: { type: "streak", value: 60 },
    xpReward: 1000,
    unlockedBy: 0,
    createdAt: new Date(),
    isUnlocked: false,
    progress: 0,
  },
  {
    id: "streak-100",
    name: "Legendary Streak",
    nameAr: "السلسلة الأسطورية",
    description: "Complete daily questions for 100 days in a row",
    descriptionAr: "أجب على السؤال اليومي لمدة 100 يوم متتالي",
    icon: "💎",
    color: "purple",
    rarity: "legendary",
    category: "streak",
    requirement: { type: "streak", value: 100 },
    xpReward: 2000,
    unlockedBy: 0,
    createdAt: new Date(),
    isUnlocked: false,
    progress: 0,
  },
  {
    id: "streak-180",
    name: "Half Year Hero",
    nameAr: "بطل نصف السنة",
    description: "Complete daily questions for 180 days in a row",
    descriptionAr: "أجب على السؤال اليومي لمدة 180 يوماً متتالياً",
    icon: "💎",
    color: "purple",
    rarity: "legendary",
    category: "streak",
    requirement: { type: "streak", value: 180 },
    xpReward: 3000,
    unlockedBy: 0,
    createdAt: new Date(),
    isUnlocked: false,
    progress: 0,
  },
  {
    id: "streak-365",
    name: "Year of Excellence",
    nameAr: "عام من التميز",
    description: "Complete daily questions for 365 days in a row",
    descriptionAr: "أجب على السؤال اليومي لمدة 365 يوماً متتالياً",
    icon: "👑",
    color: "gold",
    rarity: "legendary",
    category: "streak",
    requirement: { type: "streak", value: 365 },
    xpReward: 10000,
    unlockedBy: 0,
    createdAt: new Date(),
    isUnlocked: false,
    progress: 0,
  },
  {
    id: "streak-weekend",
    name: "Weekend Warrior",
    nameAr: "محارب عطلة نهاية الأسبوع",
    description: "Study on 4 consecutive weekends",
    descriptionAr: "ادرس في 4 عطلات نهاية أسبوع متتالية",
    icon: "🗓️",
    color: "blue",
    rarity: "rare",
    category: "streak",
    requirement: { type: "custom", value: 4 },
    xpReward: 150,
    unlockedBy: 0,
    createdAt: new Date(),
    isUnlocked: false,
    progress: 0,
  },
  {
    id: "streak-early-bird",
    name: "Early Bird",
    nameAr: "الطائر المبكر",
    description: "Complete 5 lessons before 8 AM",
    descriptionAr: "أكمل 5 دروس قبل الساعة 8 صباحاً",
    icon: "🌅",
    color: "yellow",
    rarity: "rare",
    category: "streak",
    requirement: { type: "custom", value: 5 },
    xpReward: 100,
    unlockedBy: 0,
    createdAt: new Date(),
    isUnlocked: false,
    progress: 0,
  },

  // ============================================
  // XP ACHIEVEMENTS (8 total)
  // ============================================
  {
    id: "xp-500",
    name: "First Steps",
    nameAr: "الخطوات الأولى",
    description: "Earn 500 total XP",
    descriptionAr: "اكسب 500 نقطة خبرة",
    icon: "⭐",
    color: "yellow",
    rarity: "common",
    category: "xp",
    requirement: { type: "xp", value: 500 },
    xpReward: 50,
    unlockedBy: 0,
    createdAt: new Date(),
    isUnlocked: false,
    progress: 0,
  },
  {
    id: "xp-1000",
    name: "Rising Star",
    nameAr: "النجم الصاعد",
    description: "Earn 1,000 total XP",
    descriptionAr: "اكسب 1,000 نقطة خبرة",
    icon: "⭐",
    color: "yellow",
    rarity: "common",
    category: "xp",
    requirement: { type: "xp", value: 1000 },
    xpReward: 100,
    unlockedBy: 0,
    createdAt: new Date(),
    isUnlocked: false,
    progress: 0,
  },
  {
    id: "xp-2500",
    name: "XP Hunter",
    nameAr: "صائد الخبرة",
    description: "Earn 2,500 total XP",
    descriptionAr: "اكسب 2,500 نقطة خبرة",
    icon: "🌟",
    color: "yellow",
    rarity: "rare",
    category: "xp",
    requirement: { type: "xp", value: 2500 },
    xpReward: 250,
    unlockedBy: 0,
    createdAt: new Date(),
    isUnlocked: false,
    progress: 0,
  },
  {
    id: "xp-5000",
    name: "XP Champion",
    nameAr: "بطل الخبرة",
    description: "Earn 5,000 total XP",
    descriptionAr: "اكسب 5,000 نقطة خبرة",
    icon: "🏆",
    color: "gold",
    rarity: "rare",
    category: "xp",
    requirement: { type: "xp", value: 5000 },
    xpReward: 500,
    unlockedBy: 0,
    createdAt: new Date(),
    isUnlocked: false,
    progress: 0,
  },
  {
    id: "xp-10000",
    name: "XP Legend",
    nameAr: "أسطورة الخبرة",
    description: "Earn 10,000 total XP",
    descriptionAr: "اكسب 10,000 نقطة خبرة",
    icon: "💎",
    color: "purple",
    rarity: "epic",
    category: "xp",
    requirement: { type: "xp", value: 10000 },
    xpReward: 1000,
    unlockedBy: 0,
    createdAt: new Date(),
    isUnlocked: false,
    progress: 0,
  },
  {
    id: "xp-25000",
    name: "XP Master",
    nameAr: "سيد الخبرة",
    description: "Earn 25,000 total XP",
    descriptionAr: "اكسب 25,000 نقطة خبرة",
    icon: "💎",
    color: "purple",
    rarity: "epic",
    category: "xp",
    requirement: { type: "xp", value: 25000 },
    xpReward: 2500,
    unlockedBy: 0,
    createdAt: new Date(),
    isUnlocked: false,
    progress: 0,
  },
  {
    id: "xp-50000",
    name: "XP Titan",
    nameAr: "عملاق الخبرة",
    description: "Earn 50,000 total XP",
    descriptionAr: "اكسب 50,000 نقطة خبرة",
    icon: "👑",
    color: "gold",
    rarity: "legendary",
    category: "xp",
    requirement: { type: "xp", value: 50000 },
    xpReward: 5000,
    unlockedBy: 0,
    createdAt: new Date(),
    isUnlocked: false,
    progress: 0,
  },
  {
    id: "xp-100000",
    name: "XP Immortal",
    nameAr: "خالد الخبرة",
    description: "Earn 100,000 total XP",
    descriptionAr: "اكسب 100,000 نقطة خبرة",
    icon: "👑",
    color: "gold",
    rarity: "legendary",
    category: "xp",
    requirement: { type: "xp", value: 100000 },
    xpReward: 10000,
    unlockedBy: 0,
    createdAt: new Date(),
    isUnlocked: false,
    progress: 0,
  },

  // ============================================
  // QUIZ ACHIEVEMENTS (10 total)
  // ============================================
  {
    id: "quiz-perfect-1",
    name: "Perfect Score",
    nameAr: "الدرجة الكاملة",
    description: "Get 100% on a quiz",
    descriptionAr: "احصل على 100% في اختبار",
    icon: "💯",
    color: "green",
    rarity: "common",
    category: "quiz",
    requirement: { type: "questions", value: 1 },
    xpReward: 50,
    unlockedBy: 0,
    createdAt: new Date(),
    isUnlocked: false,
    progress: 0,
  },
  {
    id: "quiz-perfect-5",
    name: "Quiz Ace",
    nameAr: "بارع الاختبارات",
    description: "Get 100% on 5 quizzes",
    descriptionAr: "احصل على 100% في 5 اختبارات",
    icon: "🎯",
    color: "blue",
    rarity: "rare",
    category: "quiz",
    requirement: { type: "questions", value: 5 },
    xpReward: 200,
    unlockedBy: 0,
    createdAt: new Date(),
    isUnlocked: false,
    progress: 0,
  },
  {
    id: "quiz-perfect-10",
    name: "Quiz Master",
    nameAr: "سيد الاختبارات",
    description: "Get 100% on 10 quizzes",
    descriptionAr: "احصل على 100% في 10 اختبارات",
    icon: "🎯",
    color: "blue",
    rarity: "epic",
    category: "quiz",
    requirement: { type: "questions", value: 10 },
    xpReward: 500,
    unlockedBy: 0,
    createdAt: new Date(),
    isUnlocked: false,
    progress: 0,
  },
  {
    id: "quiz-perfect-25",
    name: "Quiz Legend",
    nameAr: "أسطورة الاختبارات",
    description: "Get 100% on 25 quizzes",
    descriptionAr: "احصل على 100% في 25 اختبار",
    icon: "💎",
    color: "purple",
    rarity: "legendary",
    category: "quiz",
    requirement: { type: "questions", value: 25 },
    xpReward: 1500,
    unlockedBy: 0,
    createdAt: new Date(),
    isUnlocked: false,
    progress: 0,
  },
  {
    id: "quiz-completed-10",
    name: "Quiz Taker",
    nameAr: "مُمتحِن",
    description: "Complete 10 quizzes",
    descriptionAr: "أكمل 10 اختبارات",
    icon: "📝",
    color: "blue",
    rarity: "common",
    category: "quiz",
    requirement: { type: "questions", value: 10 },
    xpReward: 100,
    unlockedBy: 0,
    createdAt: new Date(),
    isUnlocked: false,
    progress: 0,
  },
  {
    id: "quiz-completed-50",
    name: "Quiz Enthusiast",
    nameAr: "عاشق الاختبارات",
    description: "Complete 50 quizzes",
    descriptionAr: "أكمل 50 اختبار",
    icon: "📚",
    color: "blue",
    rarity: "rare",
    category: "quiz",
    requirement: { type: "questions", value: 50 },
    xpReward: 400,
    unlockedBy: 0,
    createdAt: new Date(),
    isUnlocked: false,
    progress: 0,
  },
  {
    id: "quiz-completed-100",
    name: "Quiz Addict",
    nameAr: "مدمن الاختبارات",
    description: "Complete 100 quizzes",
    descriptionAr: "أكمل 100 اختبار",
    icon: "🏆",
    color: "gold",
    rarity: "epic",
    category: "quiz",
    requirement: { type: "questions", value: 100 },
    xpReward: 1000,
    unlockedBy: 0,
    createdAt: new Date(),
    isUnlocked: false,
    progress: 0,
  },
  {
    id: "quiz-speed-demon",
    name: "Speed Demon",
    nameAr: "شيطان السرعة",
    description: "Complete a quiz in under 2 minutes with 90%+ score",
    descriptionAr: "أكمل اختبار في أقل من دقيقتين بنتيجة 90%+",
    icon: "⚡",
    color: "yellow",
    rarity: "rare",
    category: "quiz",
    requirement: { type: "custom", value: 1 },
    xpReward: 200,
    unlockedBy: 0,
    createdAt: new Date(),
    isUnlocked: false,
    progress: 0,
  },
  {
    id: "quiz-comeback",
    name: "Comeback King",
    nameAr: "ملك العودة",
    description: "Get 100% after failing a quiz",
    descriptionAr: "احصل على 100% بعد الفشل في اختبار",
    icon: "👑",
    color: "gold",
    rarity: "rare",
    category: "quiz",
    requirement: { type: "custom", value: 1 },
    xpReward: 150,
    unlockedBy: 0,
    createdAt: new Date(),
    isUnlocked: false,
    progress: 0,
  },
  {
    id: "quiz-all-subjects",
    name: "Well Rounded",
    nameAr: "شامل المعرفة",
    description: "Complete quizzes in all subjects",
    descriptionAr: "أكمل اختبارات في جميع المواد",
    icon: "🌐",
    color: "blue",
    rarity: "epic",
    category: "quiz",
    requirement: { type: "custom", value: 1 },
    xpReward: 500,
    unlockedBy: 0,
    createdAt: new Date(),
    isUnlocked: false,
    progress: 0,
  },

  // ============================================
  // HOMEWORK ACHIEVEMENTS (8 total)
  // ============================================
  {
    id: "homework-ontime-5",
    name: "Punctual Student",
    nameAr: "الطالب المنضبط",
    description: "Submit 5 homework assignments on time",
    descriptionAr: "سلم 5 واجبات في الموعد",
    icon: "⏰",
    color: "blue",
    rarity: "common",
    category: "homework",
    requirement: { type: "custom", value: 5 },
    xpReward: 100,
    unlockedBy: 0,
    createdAt: new Date(),
    isUnlocked: false,
    progress: 0,
  },
  {
    id: "homework-ontime-25",
    name: "Time Master",
    nameAr: "سيد الوقت",
    description: "Submit 25 homework assignments on time",
    descriptionAr: "سلم 25 واجب في الموعد",
    icon: "⏰",
    color: "blue",
    rarity: "rare",
    category: "homework",
    requirement: { type: "custom", value: 25 },
    xpReward: 400,
    unlockedBy: 0,
    createdAt: new Date(),
    isUnlocked: false,
    progress: 0,
  },
  {
    id: "homework-perfect-3",
    name: "Homework Hero",
    nameAr: "بطل الواجبات",
    description: "Get perfect score on 3 homework assignments",
    descriptionAr: "احصل على الدرجة الكاملة في 3 واجبات",
    icon: "📝",
    color: "green",
    rarity: "common",
    category: "homework",
    requirement: { type: "custom", value: 3 },
    xpReward: 150,
    unlockedBy: 0,
    createdAt: new Date(),
    isUnlocked: false,
    progress: 0,
  },
  {
    id: "homework-perfect-10",
    name: "Homework Champion",
    nameAr: "بطل المنزلية",
    description: "Get perfect score on 10 homework assignments",
    descriptionAr: "احصل على الدرجة الكاملة في 10 واجبات",
    icon: "🏆",
    color: "gold",
    rarity: "epic",
    category: "homework",
    requirement: { type: "custom", value: 10 },
    xpReward: 600,
    unlockedBy: 0,
    createdAt: new Date(),
    isUnlocked: false,
    progress: 0,
  },
  {
    id: "homework-streak-7",
    name: "Homework Streak",
    nameAr: "سلسلة الواجبات",
    description: "Submit homework on time for 7 consecutive days",
    descriptionAr: "سلم الواجبات في الموعد لمدة 7 أيام متتالية",
    icon: "🔥",
    color: "orange",
    rarity: "rare",
    category: "homework",
    requirement: { type: "custom", value: 7 },
    xpReward: 250,
    unlockedBy: 0,
    createdAt: new Date(),
    isUnlocked: false,
    progress: 0,
  },
  {
    id: "homework-early-1",
    name: "Early Submitter",
    nameAr: "المُسلِّم المبكر",
    description: "Submit homework a day early",
    descriptionAr: "سلم الواجب قبل الموعد بيوم",
    icon: "🚀",
    color: "green",
    rarity: "common",
    category: "homework",
    requirement: { type: "custom", value: 1 },
    xpReward: 75,
    unlockedBy: 0,
    createdAt: new Date(),
    isUnlocked: false,
    progress: 0,
  },
  {
    id: "homework-improvement",
    name: "Improvement Star",
    nameAr: "نجم التحسن",
    description: "Improve homework score by 20% or more",
    descriptionAr: "حسّن درجة الواجب بنسبة 20% أو أكثر",
    icon: "📈",
    color: "green",
    rarity: "rare",
    category: "homework",
    requirement: { type: "custom", value: 1 },
    xpReward: 200,
    unlockedBy: 0,
    createdAt: new Date(),
    isUnlocked: false,
    progress: 0,
  },
  {
    id: "homework-complete-all",
    name: "Completionist",
    nameAr: "المُكمِل",
    description: "Complete all homework for a semester",
    descriptionAr: "أكمل جميع الواجبات لفصل دراسي",
    icon: "👑",
    color: "gold",
    rarity: "legendary",
    category: "homework",
    requirement: { type: "custom", value: 1 },
    xpReward: 2000,
    unlockedBy: 0,
    createdAt: new Date(),
    isUnlocked: false,
    progress: 0,
  },

  // ============================================
  // ACCURACY ACHIEVEMENTS (6 total)
  // ============================================
  {
    id: "accuracy-70",
    name: "Getting Accurate",
    nameAr: "نحو الدقة",
    description: "Maintain 70% accuracy across 20+ activities",
    descriptionAr: "حافظ على دقة 70% في 20+ نشاط",
    icon: "🎯",
    color: "green",
    rarity: "common",
    category: "accuracy",
    requirement: { type: "accuracy", value: 70 },
    xpReward: 100,
    unlockedBy: 0,
    createdAt: new Date(),
    isUnlocked: false,
    progress: 0,
  },
  {
    id: "accuracy-80",
    name: "Accuracy Seeker",
    nameAr: "باحث الدقة",
    description: "Maintain 80% accuracy across 50+ activities",
    descriptionAr: "حافظ على دقة 80% في 50+ نشاط",
    icon: "🎯",
    color: "green",
    rarity: "rare",
    category: "accuracy",
    requirement: { type: "accuracy", value: 80 },
    xpReward: 200,
    unlockedBy: 0,
    createdAt: new Date(),
    isUnlocked: false,
    progress: 0,
  },
  {
    id: "accuracy-90",
    name: "Precision Expert",
    nameAr: "خبير الدقة",
    description: "Maintain 90% accuracy across all activities",
    descriptionAr: "حافظ على دقة 90% في جميع الأنشطة",
    icon: "🎯",
    color: "green",
    rarity: "epic",
    category: "accuracy",
    requirement: { type: "accuracy", value: 90 },
    xpReward: 500,
    unlockedBy: 0,
    createdAt: new Date(),
    isUnlocked: false,
    progress: 0,
  },
  {
    id: "accuracy-95",
    name: "Near Perfect",
    nameAr: "قريب من الكمال",
    description: "Maintain 95% accuracy across 100+ activities",
    descriptionAr: "حافظ على دقة 95% في 100+ نشاط",
    icon: "💎",
    color: "purple",
    rarity: "legendary",
    category: "accuracy",
    requirement: { type: "accuracy", value: 95 },
    xpReward: 1500,
    unlockedBy: 0,
    createdAt: new Date(),
    isUnlocked: false,
    progress: 0,
  },
  {
    id: "accuracy-100-streak",
    name: "Flawless",
    nameAr: "بلا أخطاء",
    description: "Get 100% on 5 activities in a row",
    descriptionAr: "احصل على 100% في 5 أنشطة متتالية",
    icon: "👑",
    color: "gold",
    rarity: "epic",
    category: "accuracy",
    requirement: { type: "custom", value: 5 },
    xpReward: 750,
    unlockedBy: 0,
    createdAt: new Date(),
    isUnlocked: false,
    progress: 0,
  },
  {
    id: "accuracy-no-mistakes",
    name: "Zero Errors",
    nameAr: "صفر أخطاء",
    description: "Complete an entire lesson with no mistakes",
    descriptionAr: "أكمل درس كامل بدون أخطاء",
    icon: "✨",
    color: "gold",
    rarity: "rare",
    category: "accuracy",
    requirement: { type: "custom", value: 1 },
    xpReward: 300,
    unlockedBy: 0,
    createdAt: new Date(),
    isUnlocked: false,
    progress: 0,
  },

  // ============================================
  // SOCIAL ACHIEVEMENTS (8 total)
  // ============================================
  {
    id: "social-share-1",
    name: "Sharer",
    nameAr: "المُشارِك",
    description: "Share an achievement on social media",
    descriptionAr: "شارك إنجاز على وسائل التواصل",
    icon: "📢",
    color: "blue",
    rarity: "common",
    category: "social",
    requirement: { type: "custom", value: 1 },
    xpReward: 50,
    unlockedBy: 0,
    createdAt: new Date(),
    isUnlocked: false,
    progress: 0,
  },
  {
    id: "social-invite-3",
    name: "Recruiter",
    nameAr: "المُجنِّد",
    description: "Invite 3 friends to join the platform",
    descriptionAr: "ادعُ 3 أصدقاء للانضمام للمنصة",
    icon: "👥",
    color: "blue",
    rarity: "rare",
    category: "social",
    requirement: { type: "custom", value: 3 },
    xpReward: 200,
    unlockedBy: 0,
    createdAt: new Date(),
    isUnlocked: false,
    progress: 0,
  },
  {
    id: "social-invite-10",
    name: "Ambassador",
    nameAr: "السفير",
    description: "Invite 10 friends to join the platform",
    descriptionAr: "ادعُ 10 أصدقاء للانضمام للمنصة",
    icon: "🌟",
    color: "gold",
    rarity: "epic",
    category: "social",
    requirement: { type: "custom", value: 10 },
    xpReward: 750,
    unlockedBy: 0,
    createdAt: new Date(),
    isUnlocked: false,
    progress: 0,
  },
  {
    id: "social-leaderboard-top10",
    name: "Top 10",
    nameAr: "العشرة الأوائل",
    description: "Reach the top 10 on the weekly leaderboard",
    descriptionAr: "وصل إلى المراكز العشر الأولى في لوحة المتصدرين الأسبوعية",
    icon: "🏅",
    color: "gold",
    rarity: "rare",
    category: "social",
    requirement: { type: "custom", value: 1 },
    xpReward: 300,
    unlockedBy: 0,
    createdAt: new Date(),
    isUnlocked: false,
    progress: 0,
  },
  {
    id: "social-leaderboard-top3",
    name: "Podium Finish",
    nameAr: "على المنصة",
    description: "Reach the top 3 on the weekly leaderboard",
    descriptionAr: "وصل إلى المراكز الثلاث الأولى في لوحة المتصدرين الأسبوعية",
    icon: "🏆",
    color: "gold",
    rarity: "epic",
    category: "social",
    requirement: { type: "custom", value: 1 },
    xpReward: 500,
    unlockedBy: 0,
    createdAt: new Date(),
    isUnlocked: false,
    progress: 0,
  },
  {
    id: "social-leaderboard-1",
    name: "Number One",
    nameAr: "رقم واحد",
    description: "Reach #1 on the weekly leaderboard",
    descriptionAr: "وصل إلى المركز الأول في لوحة المتصدرين الأسبوعية",
    icon: "👑",
    color: "gold",
    rarity: "legendary",
    category: "social",
    requirement: { type: "custom", value: 1 },
    xpReward: 1000,
    unlockedBy: 0,
    createdAt: new Date(),
    isUnlocked: false,
    progress: 0,
  },
  {
    id: "social-help-classmate",
    name: "Helpful Friend",
    nameAr: "الصديق المُساعِد",
    description: "Help a classmate with a question",
    descriptionAr: "ساعد زميل في سؤال",
    icon: "🤝",
    color: "green",
    rarity: "common",
    category: "social",
    requirement: { type: "custom", value: 1 },
    xpReward: 75,
    unlockedBy: 0,
    createdAt: new Date(),
    isUnlocked: false,
    progress: 0,
  },
  {
    id: "social-study-group",
    name: "Team Player",
    nameAr: "لاعب الفريق",
    description: "Join a study group",
    descriptionAr: "انضم إلى مجموعة دراسية",
    icon: "👨‍👩‍👧‍👦",
    color: "blue",
    rarity: "common",
    category: "social",
    requirement: { type: "custom", value: 1 },
    xpReward: 100,
    unlockedBy: 0,
    createdAt: new Date(),
    isUnlocked: false,
    progress: 0,
  },

  // ============================================
  // SPECIAL/SEASONAL ACHIEVEMENTS (10 total)
  // ============================================
  {
    id: "special-first-lesson",
    name: "First Lesson",
    nameAr: "الدرس الأول",
    description: "Complete your very first lesson",
    descriptionAr: "أكمل درسك الأول",
    icon: "🎉",
    color: "green",
    rarity: "common",
    category: "special",
    requirement: { type: "custom", value: 1 },
    xpReward: 50,
    unlockedBy: 0,
    createdAt: new Date(),
    isUnlocked: false,
    progress: 0,
  },
  {
    id: "special-profile-complete",
    name: "Profile Complete",
    nameAr: "الملف الشخصي مكتمل",
    description: "Complete your profile with all details",
    descriptionAr: "أكمل ملفك الشخصي بجميع التفاصيل",
    icon: "📋",
    color: "blue",
    rarity: "common",
    category: "special",
    requirement: { type: "custom", value: 1 },
    xpReward: 50,
    unlockedBy: 0,
    createdAt: new Date(),
    isUnlocked: false,
    progress: 0,
  },
  {
    id: "special-night-owl",
    name: "Night Owl",
    nameAr: "بومة الليل",
    description: "Complete a lesson after 10 PM",
    descriptionAr: "أكمل درس بعد الساعة 10 مساءً",
    icon: "🦉",
    color: "purple",
    rarity: "common",
    category: "special",
    requirement: { type: "custom", value: 1 },
    xpReward: 50,
    unlockedBy: 0,
    createdAt: new Date(),
    isUnlocked: false,
    progress: 0,
  },
  {
    id: "special-ramadan",
    name: "Ramadan Scholar",
    nameAr: "عالِم رمضان",
    description: "Complete 30 lessons during Ramadan",
    descriptionAr: "أكمل 30 درس خلال شهر رمضان",
    icon: "🌙",
    color: "gold",
    rarity: "epic",
    category: "special",
    requirement: { type: "custom", value: 30 },
    xpReward: 1000,
    unlockedBy: 0,
    createdAt: new Date(),
    isUnlocked: false,
    progress: 0,
  },
  {
    id: "special-eid",
    name: "Eid Celebration",
    nameAr: "احتفال العيد",
    description: "Study on Eid day",
    descriptionAr: "ادرس في يوم العيد",
    icon: "🎊",
    color: "gold",
    rarity: "rare",
    category: "special",
    requirement: { type: "custom", value: 1 },
    xpReward: 200,
    unlockedBy: 0,
    createdAt: new Date(),
    isUnlocked: false,
    progress: 0,
  },
  {
    id: "special-new-year",
    name: "New Year Resolution",
    nameAr: "قرار العام الجديد",
    description: "Complete a lesson on New Year's Day",
    descriptionAr: "أكمل درس في يوم رأس السنة",
    icon: "🎆",
    color: "gold",
    rarity: "rare",
    category: "special",
    requirement: { type: "custom", value: 1 },
    xpReward: 150,
    unlockedBy: 0,
    createdAt: new Date(),
    isUnlocked: false,
    progress: 0,
  },
  {
    id: "special-explorer",
    name: "Explorer",
    nameAr: "المستكشِف",
    description: "Try every feature on the platform",
    descriptionAr: "جرّب كل ميزة في المنصة",
    icon: "🧭",
    color: "blue",
    rarity: "rare",
    category: "special",
    requirement: { type: "custom", value: 1 },
    xpReward: 250,
    unlockedBy: 0,
    createdAt: new Date(),
    isUnlocked: false,
    progress: 0,
  },
  {
    id: "special-dedication",
    name: "Dedicated Learner",
    nameAr: "المتعلم المُتفاني",
    description: "Spend 100 hours on the platform",
    descriptionAr: "اقضِ 100 ساعة على المنصة",
    icon: "⏳",
    color: "purple",
    rarity: "legendary",
    category: "special",
    requirement: { type: "custom", value: 100 },
    xpReward: 2000,
    unlockedBy: 0,
    createdAt: new Date(),
    isUnlocked: false,
    progress: 0,
  },
  {
    id: "special-beta-tester",
    name: "Beta Tester",
    nameAr: "مُختبِر البيتا",
    description: "Join during the beta testing phase",
    descriptionAr: "انضم خلال مرحلة اختبار البيتا",
    icon: "🔬",
    color: "purple",
    rarity: "legendary",
    category: "special",
    requirement: { type: "custom", value: 1 },
    xpReward: 500,
    unlockedBy: 0,
    createdAt: new Date(),
    isUnlocked: false,
    progress: 0,
  },
  {
    id: "special-achievement-hunter",
    name: "Achievement Hunter",
    nameAr: "صائد الإنجازات",
    description: "Unlock 25 achievements",
    descriptionAr: "افتح 25 إنجاز",
    icon: "🏅",
    color: "gold",
    rarity: "epic",
    category: "special",
    requirement: { type: "custom", value: 25 },
    xpReward: 1000,
    unlockedBy: 0,
    createdAt: new Date(),
    isUnlocked: false,
    progress: 0,
  },
];

// Helper: Get rarity color
export function getRarityColor(
  rarity: "common" | "rare" | "epic" | "legendary"
): string {
  const colors = {
    common: "gray",
    rare: "blue",
    epic: "purple",
    legendary: "yellow",
  };
  return colors[rarity];
}

// Helper: Get rarity display name
export function getRarityName(
  rarity: "common" | "rare" | "epic" | "legendary"
): { en: string; ar: string } {
  const names = {
    common: { en: "Common", ar: "عادي" },
    rare: { en: "Rare", ar: "نادر" },
    epic: { en: "Epic", ar: "ملحمي" },
    legendary: { en: "Legendary", ar: "أسطوري" },
  };
  return names[rarity];
}
