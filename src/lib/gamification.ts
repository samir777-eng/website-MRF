// XP Actions and their point values
export const XP_ACTIONS = {
  LESSON_COMPLETED: 100,
  QUIZ_COMPLETED: 150,
  QUIZ_PERFECT_SCORE: 200,
  DAILY_LOGIN: 25,
  STREAK_MAINTAINED: 50,
  NOTE_TAKEN: 10,
  BOOKMARK_ADDED: 5,
  LESSON_REVIEWED: 30,
  QUIZ_RETAKEN: 75,
  ACHIEVEMENT_UNLOCKED: 300,
  CHALLENGE_COMPLETED: 250,
  FIRST_LESSON: 200,
  FIRST_QUIZ: 200,
  WEEK_STREAK: 500,
  MONTH_STREAK: 2000,
  PERFECT_WEEK: 1000,
  HELP_PEER: 100,
  SHARE_ACHIEVEMENT: 50,
} as const;

// Level system configuration
export const LEVEL_CONFIG = {
  BASE_XP: 1000,
  MULTIPLIER: 1.5,
  MAX_LEVEL: 100,
};

// Energy system
export const ENERGY_CONFIG = {
  MAX_ENERGY: 5,
  ENERGY_REGEN_TIME: 30 * 60 * 1000, // 30 minutes in milliseconds
  ENERGY_COST: {
    LESSON: 1,
    QUIZ: 1,
    CHALLENGE: 2,
  },
};

// Calculate XP required for a specific level
export function getXPForLevel(level: number): number {
  if (level <= 1) return 0;

  let totalXP = 0;
  for (let i = 2; i <= level; i++) {
    totalXP += Math.floor(
      LEVEL_CONFIG.BASE_XP * Math.pow(LEVEL_CONFIG.MULTIPLIER, i - 2),
    );
  }
  return totalXP;
}

// Calculate level from total XP
export function getLevelFromXP(totalXP: number): number {
  let level = 1;

  while (level < LEVEL_CONFIG.MAX_LEVEL) {
    const nextLevelXP = getXPForLevel(level + 1);
    if (totalXP < nextLevelXP) break;
    level++;
  }

  return level;
}

// Calculate progress to next level
export function getProgressToNextLevel(totalXP: number): {
  currentLevel: number;
  nextLevel: number;
  currentLevelXP: number;
  nextLevelXP: number;
  progress: number;
  remainingXP: number;
} {
  const currentLevel = getLevelFromXP(totalXP);
  const nextLevel = Math.min(currentLevel + 1, LEVEL_CONFIG.MAX_LEVEL);
  const currentLevelXP = getXPForLevel(currentLevel);
  const nextLevelXP = getXPForLevel(nextLevel);

  const progressXP = totalXP - currentLevelXP;
  const levelXPRange = nextLevelXP - currentLevelXP;
  const progress = levelXPRange > 0 ? (progressXP / levelXPRange) * 100 : 100;
  const remainingXP = Math.max(0, nextLevelXP - totalXP);

  return {
    currentLevel,
    nextLevel,
    currentLevelXP,
    nextLevelXP,
    progress: Math.min(100, Math.max(0, progress)),
    remainingXP,
  };
}

// Level titles and descriptions
export const LEVEL_TITLES = {
  1: {
    title: "مبتدئ",
    description: "بداية رحلة التعلم",
    color: "text-gray-600",
    bgColor: "bg-gray-100",
  },
  5: {
    title: "طالب نشط",
    description: "تقدم ملحوظ في التعلم",
    color: "text-blue-600",
    bgColor: "bg-blue-100",
  },
  10: {
    title: "متعلم مجتهد",
    description: "التزام واضح بالتعلم",
    color: "text-green-600",
    bgColor: "bg-green-100",
  },
  15: {
    title: "باحث متميز",
    description: "فهم عميق للمواد",
    color: "text-purple-600",
    bgColor: "bg-purple-100",
  },
  20: {
    title: "عالم صغير",
    description: "معرفة واسعة ومتنوعة",
    color: "text-orange-600",
    bgColor: "bg-orange-100",
  },
  25: {
    title: "خبير النحو",
    description: "إتقان قواعد النحو",
    color: "text-red-600",
    bgColor: "bg-red-100",
  },
  30: {
    title: "أستاذ الأدب",
    description: "فهم عميق للأدب العربي",
    color: "text-indigo-600",
    bgColor: "bg-indigo-100",
  },
  40: {
    title: "عبقري اللغة",
    description: "تفوق استثنائي",
    color: "text-yellow-600",
    bgColor: "bg-yellow-100",
  },
  50: {
    title: "أسطورة التعلم",
    description: "مستوى أسطوري",
    color: "text-pink-600",
    bgColor: "bg-pink-100",
  },
  75: {
    title: "سيد الكلمات",
    description: "سيطرة كاملة على اللغة",
    color: "text-teal-600",
    bgColor: "bg-teal-100",
  },
  100: {
    title: "إمام اللغة",
    description: "أعلى مستوى ممكن",
    color: "text-gradient",
    bgColor: "bg-gradient-to-r from-gold to-yellow-400",
  },
};

// Get level title for current level
export function getLevelTitle(level: number): {
  title: string;
  description: string;
  color: string;
  bgColor: string;
} {
  const levelKeys = Object.keys(LEVEL_TITLES)
    .map(Number)
    .sort((a, b) => b - a);

  for (const levelKey of levelKeys) {
    if (level >= levelKey) {
      return LEVEL_TITLES[levelKey as keyof typeof LEVEL_TITLES];
    }
  }

  return LEVEL_TITLES[1];
}

// Energy system functions
export function calculateCurrentEnergy(
  lastEnergyUpdate: number,
  currentEnergy: number,
): number {
  if (currentEnergy >= ENERGY_CONFIG.MAX_ENERGY)
    return ENERGY_CONFIG.MAX_ENERGY;

  const now = Date.now();
  const timePassed = now - lastEnergyUpdate;
  const energyToAdd = Math.floor(timePassed / ENERGY_CONFIG.ENERGY_REGEN_TIME);

  return Math.min(ENERGY_CONFIG.MAX_ENERGY, currentEnergy + energyToAdd);
}

export function getTimeToNextEnergy(
  lastEnergyUpdate: number,
  currentEnergy: number,
): number {
  if (currentEnergy >= ENERGY_CONFIG.MAX_ENERGY) return 0;

  const now = Date.now();
  const timePassed = now - lastEnergyUpdate;
  const timeToNext =
    ENERGY_CONFIG.ENERGY_REGEN_TIME -
    (timePassed % ENERGY_CONFIG.ENERGY_REGEN_TIME);

  return timeToNext;
}

export function canPerformAction(
  action: keyof typeof ENERGY_CONFIG.ENERGY_COST,
  currentEnergy: number,
): boolean {
  const cost = ENERGY_CONFIG.ENERGY_COST[action];
  return currentEnergy >= cost;
}

// Achievement system
export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: "learning" | "streak" | "social" | "mastery" | "special";
  xpReward: number;
  condition: (stats: UserStats) => boolean;
  rarity: "common" | "rare" | "epic" | "legendary";
}

export interface UserStats {
  totalXP: number;
  level: number;
  lessonsCompleted: number;
  quizzesTaken: number;
  perfectScores: number;
  currentStreak: number;
  longestStreak: number;
  notesWritten: number;
  bookmarksAdded: number;
  achievementsUnlocked: number;
  daysActive: number;
  totalStudyTime: number; // in minutes
  averageQuizScore: number;
  subjectsStudied: string[];
  challengesCompleted: number;
  helpedPeers: number;
  sharedAchievements: number;
}

// Predefined achievements - 50+ achievements across 5 categories
export const ACHIEVEMENTS: Achievement[] = [
  // ============ LEARNING ACHIEVEMENTS (15) ============
  {
    id: "first_lesson",
    title: "أول خطوة",
    description: "أكمل درسك الأول",
    icon: "🎯",
    category: "learning",
    xpReward: 200,
    condition: (stats) => stats.lessonsCompleted >= 1,
    rarity: "common",
  },
  {
    id: "lessons_5",
    title: "المتعلم الناشئ",
    description: "أكمل 5 دروس",
    icon: "📖",
    category: "learning",
    xpReward: 300,
    condition: (stats) => stats.lessonsCompleted >= 5,
    rarity: "common",
  },
  {
    id: "lessons_10",
    title: "المثابر",
    description: "أكمل 10 دروس",
    icon: "📚",
    category: "learning",
    xpReward: 500,
    condition: (stats) => stats.lessonsCompleted >= 10,
    rarity: "rare",
  },
  {
    id: "lessons_25",
    title: "طالب العلم",
    description: "أكمل 25 درساً",
    icon: "🎓",
    category: "learning",
    xpReward: 800,
    condition: (stats) => stats.lessonsCompleted >= 25,
    rarity: "rare",
  },
  {
    id: "lessons_50",
    title: "المتفوق",
    description: "أكمل 50 درساً",
    icon: "🏅",
    category: "learning",
    xpReward: 1200,
    condition: (stats) => stats.lessonsCompleted >= 50,
    rarity: "epic",
  },
  {
    id: "lessons_100",
    title: "العالم",
    description: "أكمل 100 درس",
    icon: "👨‍🎓",
    category: "learning",
    xpReward: 2000,
    condition: (stats) => stats.lessonsCompleted >= 100,
    rarity: "legendary",
  },
  {
    id: "first_quiz",
    title: "أول اختبار",
    description: "أكمل اختبارك الأول",
    icon: "📝",
    category: "learning",
    xpReward: 200,
    condition: (stats) => stats.quizzesTaken >= 1,
    rarity: "common",
  },
  {
    id: "quizzes_10",
    title: "المختبِر",
    description: "أكمل 10 اختبارات",
    icon: "✍️",
    category: "learning",
    xpReward: 400,
    condition: (stats) => stats.quizzesTaken >= 10,
    rarity: "common",
  },
  {
    id: "quizzes_50",
    title: "المراجع الدائم",
    description: "أكمل 50 اختباراً",
    icon: "📋",
    category: "learning",
    xpReward: 800,
    condition: (stats) => stats.quizzesTaken >= 50,
    rarity: "rare",
  },
  {
    id: "note_taker",
    title: "كاتب الملاحظات",
    description: "اكتب 50 ملاحظة",
    icon: "📔",
    category: "learning",
    xpReward: 400,
    condition: (stats) => stats.notesWritten >= 50,
    rarity: "rare",
  },
  {
    id: "notes_100",
    title: "المدوّن المحترف",
    description: "اكتب 100 ملاحظة",
    icon: "📓",
    category: "learning",
    xpReward: 800,
    condition: (stats) => stats.notesWritten >= 100,
    rarity: "epic",
  },
  {
    id: "bookworm",
    title: "عاشق الكتب",
    description: "أضف 25 علامة مرجعية",
    icon: "🔖",
    category: "learning",
    xpReward: 300,
    condition: (stats) => stats.bookmarksAdded >= 25,
    rarity: "common",
  },
  {
    id: "study_marathon",
    title: "ماراثون الدراسة",
    description: "ادرس لمدة 1000 دقيقة",
    icon: "⏰",
    category: "learning",
    xpReward: 800,
    condition: (stats) => stats.totalStudyTime >= 1000,
    rarity: "epic",
  },
  {
    id: "study_legend",
    title: "أسطورة المذاكرة",
    description: "ادرس لمدة 5000 دقيقة",
    icon: "⌛",
    category: "learning",
    xpReward: 2000,
    condition: (stats) => stats.totalStudyTime >= 5000,
    rarity: "legendary",
  },
  {
    id: "early_bird",
    title: "الطائر المبكر",
    description: "ادرس قبل الساعة 7 صباحاً",
    icon: "🌅",
    category: "learning",
    xpReward: 200,
    condition: (stats) => stats.daysActive >= 1, // Placeholder - needs time tracking
    rarity: "common",
  },

  // ============ STREAK ACHIEVEMENTS (10) ============
  {
    id: "streak_3",
    title: "البداية الموفقة",
    description: "حافظ على نشاطك لمدة 3 أيام",
    icon: "🔥",
    category: "streak",
    xpReward: 150,
    condition: (stats) => stats.currentStreak >= 3,
    rarity: "common",
  },
  {
    id: "week_streak",
    title: "أسبوع متواصل",
    description: "حافظ على نشاطك لمدة 7 أيام",
    icon: "🔥",
    category: "streak",
    xpReward: 500,
    condition: (stats) => stats.currentStreak >= 7,
    rarity: "rare",
  },
  {
    id: "streak_14",
    title: "أسبوعان من الإصرار",
    description: "حافظ على نشاطك لمدة 14 يوماً",
    icon: "🔥",
    category: "streak",
    xpReward: 800,
    condition: (stats) => stats.currentStreak >= 14,
    rarity: "rare",
  },
  {
    id: "month_streak",
    title: "شهر من التفوق",
    description: "حافظ على نشاطك لمدة 30 يوماً",
    icon: "🏆",
    category: "streak",
    xpReward: 2000,
    condition: (stats) => stats.currentStreak >= 30,
    rarity: "epic",
  },
  {
    id: "streak_60",
    title: "شهران من العزيمة",
    description: "حافظ على نشاطك لمدة 60 يوماً",
    icon: "💪",
    category: "streak",
    xpReward: 3000,
    condition: (stats) => stats.currentStreak >= 60,
    rarity: "epic",
  },
  {
    id: "streak_90",
    title: "ربع سنة من التميز",
    description: "حافظ على نشاطك لمدة 90 يوماً",
    icon: "🌟",
    category: "streak",
    xpReward: 4000,
    condition: (stats) => stats.currentStreak >= 90,
    rarity: "legendary",
  },
  {
    id: "streak_180",
    title: "نصف سنة من الإبداع",
    description: "حافظ على نشاطك لمدة 180 يوماً",
    icon: "👑",
    category: "streak",
    xpReward: 6000,
    condition: (stats) => stats.currentStreak >= 180,
    rarity: "legendary",
  },
  {
    id: "streak_365",
    title: "سنة كاملة!",
    description: "حافظ على نشاطك لمدة 365 يوماً",
    icon: "🎖️",
    category: "streak",
    xpReward: 10000,
    condition: (stats) => stats.currentStreak >= 365,
    rarity: "legendary",
  },
  {
    id: "streak_comeback",
    title: "العودة القوية",
    description: "أعد بناء سلسلة 7 أيام بعد فقدانها",
    icon: "🔄",
    category: "streak",
    xpReward: 300,
    condition: (stats) =>
      stats.longestStreak > stats.currentStreak && stats.currentStreak >= 7,
    rarity: "rare",
  },
  {
    id: "streak_record",
    title: "رقم قياسي شخصي",
    description: "حطم رقمك القياسي في السلسلة",
    icon: "📈",
    category: "streak",
    xpReward: 500,
    condition: (stats) =>
      stats.currentStreak === stats.longestStreak && stats.currentStreak >= 10,
    rarity: "rare",
  },

  // ============ MASTERY ACHIEVEMENTS (15) ============
  {
    id: "perfect_score",
    title: "الدرجة الكاملة",
    description: "احصل على 100% في اختبار",
    icon: "💯",
    category: "mastery",
    xpReward: 300,
    condition: (stats) => stats.perfectScores >= 1,
    rarity: "rare",
  },
  {
    id: "perfect_5",
    title: "المتقن",
    description: "احصل على 5 درجات كاملة",
    icon: "🎯",
    category: "mastery",
    xpReward: 600,
    condition: (stats) => stats.perfectScores >= 5,
    rarity: "rare",
  },
  {
    id: "perfect_10",
    title: "الدقيق",
    description: "احصل على 10 درجات كاملة",
    icon: "🎪",
    category: "mastery",
    xpReward: 1000,
    condition: (stats) => stats.perfectScores >= 10,
    rarity: "epic",
  },
  {
    id: "perfect_25",
    title: "سيد الإتقان",
    description: "احصل على 25 درجة كاملة",
    icon: "🏹",
    category: "mastery",
    xpReward: 2000,
    condition: (stats) => stats.perfectScores >= 25,
    rarity: "legendary",
  },
  {
    id: "quiz_master",
    title: "سيد الاختبارات",
    description: "أكمل 100 اختبار",
    icon: "🧠",
    category: "mastery",
    xpReward: 1000,
    condition: (stats) => stats.quizzesTaken >= 100,
    rarity: "epic",
  },
  {
    id: "level_5",
    title: "المستوى الخامس",
    description: "وصل إلى المستوى 5",
    icon: "⭐",
    category: "mastery",
    xpReward: 200,
    condition: (stats) => stats.level >= 5,
    rarity: "common",
  },
  {
    id: "level_10",
    title: "المستوى العاشر",
    description: "وصل إلى المستوى 10",
    icon: "⭐",
    category: "mastery",
    xpReward: 500,
    condition: (stats) => stats.level >= 10,
    rarity: "rare",
  },
  {
    id: "level_25",
    title: "الخبير",
    description: "وصل إلى المستوى 25",
    icon: "🌟",
    category: "mastery",
    xpReward: 1500,
    condition: (stats) => stats.level >= 25,
    rarity: "epic",
  },
  {
    id: "level_50",
    title: "الأسطورة",
    description: "وصل إلى المستوى 50",
    icon: "💫",
    category: "mastery",
    xpReward: 5000,
    condition: (stats) => stats.level >= 50,
    rarity: "legendary",
  },
  {
    id: "level_100",
    title: "الخالد",
    description: "وصل إلى المستوى 100",
    icon: "👑",
    category: "mastery",
    xpReward: 10000,
    condition: (stats) => stats.level >= 100,
    rarity: "legendary",
  },
  {
    id: "xp_1000",
    title: "جامع النقاط",
    description: "اجمع 1000 نقطة خبرة",
    icon: "💰",
    category: "mastery",
    xpReward: 100,
    condition: (stats) => stats.totalXP >= 1000,
    rarity: "common",
  },
  {
    id: "xp_5000",
    title: "المكتنز",
    description: "اجمع 5000 نقطة خبرة",
    icon: "💎",
    category: "mastery",
    xpReward: 300,
    condition: (stats) => stats.totalXP >= 5000,
    rarity: "rare",
  },
  {
    id: "xp_25000",
    title: "الثري بالمعرفة",
    description: "اجمع 25000 نقطة خبرة",
    icon: "🏦",
    category: "mastery",
    xpReward: 1000,
    condition: (stats) => stats.totalXP >= 25000,
    rarity: "epic",
  },
  {
    id: "xp_100000",
    title: "مليونير المعرفة",
    description: "اجمع 100000 نقطة خبرة",
    icon: "🤑",
    category: "mastery",
    xpReward: 5000,
    condition: (stats) => stats.totalXP >= 100000,
    rarity: "legendary",
  },
  {
    id: "high_average",
    title: "المتميز",
    description: "حافظ على معدل 90% في الاختبارات",
    icon: "📊",
    category: "mastery",
    xpReward: 800,
    condition: (stats) =>
      stats.averageQuizScore >= 90 && stats.quizzesTaken >= 10,
    rarity: "epic",
  },

  // ============ SOCIAL ACHIEVEMENTS (5) ============
  {
    id: "first_help",
    title: "اليد الممتدة",
    description: "ساعد زميلاً للمرة الأولى",
    icon: "🤝",
    category: "social",
    xpReward: 100,
    condition: (stats) => stats.helpedPeers >= 1,
    rarity: "common",
  },
  {
    id: "social_helper",
    title: "المساعد الاجتماعي",
    description: "ساعد 10 زملاء",
    icon: "🤝",
    category: "social",
    xpReward: 600,
    condition: (stats) => stats.helpedPeers >= 10,
    rarity: "rare",
  },
  {
    id: "mentor",
    title: "المرشد",
    description: "ساعد 25 زميلاً",
    icon: "🧑‍🏫",
    category: "social",
    xpReward: 1000,
    condition: (stats) => stats.helpedPeers >= 25,
    rarity: "epic",
  },
  {
    id: "sharer",
    title: "المشارك",
    description: "شارك 5 إنجازات",
    icon: "📤",
    category: "social",
    xpReward: 200,
    condition: (stats) => stats.sharedAchievements >= 5,
    rarity: "common",
  },
  {
    id: "influencer",
    title: "المؤثر",
    description: "شارك 20 إنجازاً",
    icon: "📢",
    category: "social",
    xpReward: 500,
    condition: (stats) => stats.sharedAchievements >= 20,
    rarity: "rare",
  },

  // ============ SPECIAL ACHIEVEMENTS (5) ============
  {
    id: "weekend_warrior",
    title: "محارب عطلة نهاية الأسبوع",
    description: "ادرس في عطلة نهاية الأسبوع",
    icon: "⚔️",
    category: "special",
    xpReward: 150,
    condition: (stats) => stats.daysActive >= 1, // Placeholder
    rarity: "common",
  },
  {
    id: "night_owl",
    title: "بومة الليل",
    description: "ادرس بعد منتصف الليل",
    icon: "🦉",
    category: "special",
    xpReward: 150,
    condition: (stats) => stats.daysActive >= 1, // Placeholder
    rarity: "common",
  },
  {
    id: "multi_subject",
    title: "متعدد المواهب",
    description: "ادرس 3 مواد مختلفة",
    icon: "🎨",
    category: "special",
    xpReward: 300,
    condition: (stats) => stats.subjectsStudied.length >= 3,
    rarity: "rare",
  },
  {
    id: "challenge_champion",
    title: "بطل التحديات",
    description: "أكمل 10 تحديات",
    icon: "🏆",
    category: "special",
    xpReward: 600,
    condition: (stats) => stats.challengesCompleted >= 10,
    rarity: "epic",
  },
  {
    id: "achievement_hunter",
    title: "صياد الإنجازات",
    description: "احصل على 25 إنجازاً",
    icon: "🎖️",
    category: "special",
    xpReward: 1000,
    condition: (stats) => stats.achievementsUnlocked >= 25,
    rarity: "epic",
  },
];

// Check which achievements are newly unlocked
export function checkNewAchievements(
  stats: UserStats,
  unlockedAchievements: string[],
): Achievement[] {
  return ACHIEVEMENTS.filter(
    (achievement) =>
      !unlockedAchievements.includes(achievement.id) &&
      achievement.condition(stats),
  );
}

// Get achievement rarity color
export function getAchievementRarityColor(
  rarity: Achievement["rarity"],
): string {
  switch (rarity) {
    case "common":
      return "text-gray-600 bg-gray-100";
    case "rare":
      return "text-blue-600 bg-blue-100";
    case "epic":
      return "text-purple-600 bg-purple-100";
    case "legendary":
      return "text-yellow-600 bg-gradient-to-r from-yellow-100 to-orange-100";
    default:
      return "text-gray-600 bg-gray-100";
  }
}
