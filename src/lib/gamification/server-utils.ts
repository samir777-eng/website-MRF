/**
 * Server-Side Gamification Utilities
 *
 * These functions handle server-side gamification logic.
 * All calculations here are authoritative and cannot be manipulated by clients.
 */

import { ACHIEVEMENTS, ENERGY_CONFIG, LEVEL_CONFIG } from "@/lib/gamification";
import {
  ActionHistoryEntry,
  EnergyAction,
  SERVER_XP_VALUES,
  ServerGamificationState,
  XPActionName,
} from "./server-types";

// In-memory storage (replace with database in production)
const userGamificationStore = new Map<string, ServerGamificationState>();

// Action cooldowns to prevent spam (in milliseconds)
const ACTION_COOLDOWNS: Partial<Record<XPActionName, number>> = {
  NOTE_TAKEN: 5000, // 5 seconds
  BOOKMARK_ADDED: 3000, // 3 seconds
  LESSON_COMPLETED: 60000, // 1 minute
  QUIZ_COMPLETED: 30000, // 30 seconds
};

// Maximum actions per hour for anti-cheat
const MAX_ACTIONS_PER_HOUR: Partial<Record<XPActionName, number>> = {
  LESSON_COMPLETED: 20,
  QUIZ_COMPLETED: 30,
  NOTE_TAKEN: 50,
  BOOKMARK_ADDED: 100,
};

/**
 * Get or create user gamification state
 */
export function getOrCreateUserState(userId: string): ServerGamificationState {
  let state = userGamificationStore.get(userId);

  if (!state) {
    state = createInitialState(userId);
    userGamificationStore.set(userId, state);
  }

  return state;
}

/**
 * Create initial gamification state for a new user
 */
function createInitialState(userId: string): ServerGamificationState {
  const now = new Date().toISOString();
  return {
    userId,
    totalXP: 0,
    level: 1,
    lessonsCompleted: 0,
    quizzesTaken: 0,
    perfectScores: 0,
    notesWritten: 0,
    bookmarksAdded: 0,
    currentStreak: 0,
    longestStreak: 0,
    lastActiveDate: "",
    currentEnergy: ENERGY_CONFIG.MAX_ENERGY,
    lastEnergyUpdate: Date.now(),
    totalStudyTime: 0,
    daysActive: 0,
    helpedPeers: 0,
    sharedAchievements: 0,
    challengesCompleted: 0,
    unlockedAchievements: [],
    createdAt: now,
    updatedAt: now,
    lastActionTime: 0,
    actionHistory: [],
  };
}

/**
 * Validate if an action can be performed (anti-cheat)
 */
export function validateAction(
  state: ServerGamificationState,
  action: XPActionName,
): { valid: boolean; reason?: string } {
  const now = Date.now();

  // Check cooldown
  const cooldown = ACTION_COOLDOWNS[action];
  if (cooldown) {
    const timeSinceLastAction = now - state.lastActionTime;
    if (timeSinceLastAction < cooldown) {
      return {
        valid: false,
        reason: `يرجى الانتظار ${Math.ceil((cooldown - timeSinceLastAction) / 1000)} ثانية`,
      };
    }
  }

  // Check hourly limit
  const maxPerHour = MAX_ACTIONS_PER_HOUR[action];
  if (maxPerHour) {
    const oneHourAgo = now - 3600000;
    const recentActions = state.actionHistory.filter(
      (h) => h.action === action && h.timestamp > oneHourAgo,
    );
    if (recentActions.length >= maxPerHour) {
      return {
        valid: false,
        reason: "تم الوصول للحد الأقصى من الإجراءات لهذه الساعة",
      };
    }
  }

  return { valid: true };
}

/**
 * Calculate level from XP (server-authoritative)
 */
export function calculateLevel(totalXP: number): number {
  let level = 1;
  let xpForNextLevel = LEVEL_CONFIG.BASE_XP;
  let accumulatedXP = 0;

  while (level < LEVEL_CONFIG.MAX_LEVEL) {
    accumulatedXP += xpForNextLevel;
    if (totalXP < accumulatedXP) break;
    level++;
    xpForNextLevel = Math.floor(xpForNextLevel * LEVEL_CONFIG.MULTIPLIER);
  }

  return level;
}

/**
 * Award XP to a user (server-side)
 */
export function awardXP(
  userId: string,
  action: XPActionName,
  context?: Record<string, unknown>,
): {
  success: boolean;
  xpAwarded: number;
  totalXP: number;
  level: number;
  levelUp: boolean;
  previousLevel: number;
  newAchievements: string[];
  error?: string;
} {
  const state = getOrCreateUserState(userId);

  // Validate action
  const validation = validateAction(state, action);
  if (!validation.valid) {
    return {
      success: false,
      xpAwarded: 0,
      totalXP: state.totalXP,
      level: state.level,
      levelUp: false,
      previousLevel: state.level,
      newAchievements: [],
      error: validation.reason,
    };
  }

  // Get XP amount from server-authoritative values
  const xpAmount = SERVER_XP_VALUES[action];
  const previousLevel = state.level;
  const previousXP = state.totalXP;

  // Update XP
  state.totalXP += xpAmount;
  state.level = calculateLevel(state.totalXP);
  state.lastActionTime = Date.now();
  state.updatedAt = new Date().toISOString();

  // Add to action history
  const historyEntry: ActionHistoryEntry = {
    action,
    xpAwarded: xpAmount,
    timestamp: Date.now(),
    context,
  };
  state.actionHistory.push(historyEntry);

  // Keep only last 100 actions in history
  if (state.actionHistory.length > 100) {
    state.actionHistory = state.actionHistory.slice(-100);
  }

  // Update specific stats based on action
  updateStatsForAction(state, action);

  // Check for new achievements
  const newAchievements = checkAndUnlockAchievements(state);

  // Save state
  userGamificationStore.set(userId, state);

  return {
    success: true,
    xpAwarded: xpAmount,
    totalXP: state.totalXP,
    level: state.level,
    levelUp: state.level > previousLevel,
    previousLevel,
    newAchievements,
  };
}

/**
 * Update user stats based on action type
 */
function updateStatsForAction(
  state: ServerGamificationState,
  action: XPActionName,
): void {
  switch (action) {
    case "LESSON_COMPLETED":
    case "FIRST_LESSON":
      state.lessonsCompleted++;
      break;
    case "QUIZ_COMPLETED":
    case "FIRST_QUIZ":
    case "QUIZ_RETAKEN":
      state.quizzesTaken++;
      break;
    case "QUIZ_PERFECT_SCORE":
      state.quizzesTaken++;
      state.perfectScores++;
      break;
    case "NOTE_TAKEN":
      state.notesWritten++;
      break;
    case "BOOKMARK_ADDED":
      state.bookmarksAdded++;
      break;
    case "CHALLENGE_COMPLETED":
      state.challengesCompleted++;
      break;
    case "HELP_PEER":
      state.helpedPeers++;
      break;
    case "SHARE_ACHIEVEMENT":
      state.sharedAchievements++;
      break;
  }
}

/**
 * Check and unlock new achievements
 */
function checkAndUnlockAchievements(state: ServerGamificationState): string[] {
  const newAchievements: string[] = [];

  for (const achievement of ACHIEVEMENTS) {
    if (state.unlockedAchievements.includes(achievement.id)) {
      continue;
    }

    // Build a UserStats-compatible object for the condition check
    const userStats = {
      totalXP: state.totalXP,
      level: state.level,
      lessonsCompleted: state.lessonsCompleted,
      quizzesTaken: state.quizzesTaken,
      perfectScores: state.perfectScores,
      currentStreak: state.currentStreak,
      longestStreak: state.longestStreak,
      notesWritten: state.notesWritten,
      bookmarksAdded: state.bookmarksAdded,
      achievementsUnlocked: state.unlockedAchievements.length,
      daysActive: state.daysActive,
      totalStudyTime: state.totalStudyTime,
      averageQuizScore: 0,
      subjectsStudied: [] as string[],
      challengesCompleted: state.challengesCompleted,
      helpedPeers: state.helpedPeers,
      sharedAchievements: state.sharedAchievements,
    };

    if (achievement.condition(userStats)) {
      state.unlockedAchievements.push(achievement.id);
      newAchievements.push(achievement.id);
      // Award achievement XP
      state.totalXP += achievement.xpReward;
    }
  }

  // Recalculate level if achievements were unlocked
  if (newAchievements.length > 0) {
    state.level = calculateLevel(state.totalXP);
  }

  return newAchievements;
}

/**
 * Update streak for a user
 */
export function updateStreak(userId: string): {
  success: boolean;
  currentStreak: number;
  longestStreak: number;
  xpAwarded: number;
  isNewDay: boolean;
  streakMaintained: boolean;
} {
  const state = getOrCreateUserState(userId);
  const today = new Date().toISOString().split("T")[0];
  const yesterday = new Date(Date.now() - 86400000).toISOString().split("T")[0];

  let xpAwarded = 0;
  let isNewDay = false;
  let streakMaintained = false;

  if (state.lastActiveDate === today) {
    // Already logged in today
    return {
      success: true,
      currentStreak: state.currentStreak,
      longestStreak: state.longestStreak,
      xpAwarded: 0,
      isNewDay: false,
      streakMaintained: false,
    };
  }

  isNewDay = true;
  state.daysActive++;

  if (state.lastActiveDate === yesterday) {
    // Streak continues
    state.currentStreak++;
    streakMaintained = true;
    xpAwarded = SERVER_XP_VALUES.STREAK_MAINTAINED;

    // Check for milestone streaks
    if (state.currentStreak === 7) {
      xpAwarded += SERVER_XP_VALUES.WEEK_STREAK;
    } else if (state.currentStreak === 30) {
      xpAwarded += SERVER_XP_VALUES.MONTH_STREAK;
    }
  } else if (state.lastActiveDate === "") {
    // First day
    state.currentStreak = 1;
    xpAwarded = SERVER_XP_VALUES.DAILY_LOGIN;
  } else {
    // Streak broken
    state.currentStreak = 1;
    xpAwarded = SERVER_XP_VALUES.DAILY_LOGIN;
  }

  // Update longest streak
  if (state.currentStreak > state.longestStreak) {
    state.longestStreak = state.currentStreak;
  }

  // Add XP
  state.totalXP += xpAwarded;
  state.level = calculateLevel(state.totalXP);
  state.lastActiveDate = today;
  state.updatedAt = new Date().toISOString();

  // Check achievements
  checkAndUnlockAchievements(state);

  userGamificationStore.set(userId, state);

  return {
    success: true,
    currentStreak: state.currentStreak,
    longestStreak: state.longestStreak,
    xpAwarded,
    isNewDay,
    streakMaintained,
  };
}

/**
 * Consume energy for an action
 */
export function consumeEnergy(
  userId: string,
  action: EnergyAction,
): {
  success: boolean;
  energyConsumed: number;
  currentEnergy: number;
  timeToNextEnergy: number;
  error?: string;
} {
  const state = getOrCreateUserState(userId);

  // Regenerate energy based on time passed
  const now = Date.now();
  const timePassed = now - state.lastEnergyUpdate;
  const energyToAdd = Math.floor(timePassed / ENERGY_CONFIG.ENERGY_REGEN_TIME);
  state.currentEnergy = Math.min(
    ENERGY_CONFIG.MAX_ENERGY,
    state.currentEnergy + energyToAdd,
  );

  if (energyToAdd > 0) {
    state.lastEnergyUpdate = now;
  }

  // Get energy cost
  const cost = ENERGY_CONFIG.ENERGY_COST[action];

  if (state.currentEnergy < cost) {
    const timeToNext =
      ENERGY_CONFIG.ENERGY_REGEN_TIME -
      ((now - state.lastEnergyUpdate) % ENERGY_CONFIG.ENERGY_REGEN_TIME);
    return {
      success: false,
      energyConsumed: 0,
      currentEnergy: state.currentEnergy,
      timeToNextEnergy: timeToNext,
      error: "طاقة غير كافية",
    };
  }

  // Consume energy
  state.currentEnergy -= cost;
  state.lastEnergyUpdate = now;
  state.updatedAt = new Date().toISOString();

  userGamificationStore.set(userId, state);

  const timeToNextEnergy =
    state.currentEnergy < ENERGY_CONFIG.MAX_ENERGY
      ? ENERGY_CONFIG.ENERGY_REGEN_TIME
      : 0;

  return {
    success: true,
    energyConsumed: cost,
    currentEnergy: state.currentEnergy,
    timeToNextEnergy,
  };
}

/**
 * Get user stats
 */
export function getUserStats(userId: string) {
  const state = getOrCreateUserState(userId);

  // Calculate progress to next level
  const currentLevelXP = getLevelXP(state.level);
  const nextLevelXP = getLevelXP(state.level + 1);
  const progress =
    ((state.totalXP - currentLevelXP) / (nextLevelXP - currentLevelXP)) * 100;
  const remainingXP = nextLevelXP - state.totalXP;

  return {
    stats: {
      totalXP: state.totalXP,
      level: state.level,
      currentStreak: state.currentStreak,
      longestStreak: state.longestStreak,
      currentEnergy: state.currentEnergy,
      lessonsCompleted: state.lessonsCompleted,
      quizzesTaken: state.quizzesTaken,
      perfectScores: state.perfectScores,
      unlockedAchievements: state.unlockedAchievements,
      daysActive: state.daysActive,
      totalStudyTime: state.totalStudyTime,
    },
    levelInfo: {
      currentLevel: state.level,
      nextLevel: Math.min(state.level + 1, LEVEL_CONFIG.MAX_LEVEL),
      progress: Math.min(100, Math.max(0, progress)),
      remainingXP: Math.max(0, remainingXP),
    },
  };
}

/**
 * Get total XP required for a level
 */
function getLevelXP(level: number): number {
  if (level <= 1) return 0;
  let totalXP = 0;
  let xpForLevel = LEVEL_CONFIG.BASE_XP;
  for (let i = 2; i <= level; i++) {
    totalXP += xpForLevel;
    xpForLevel = Math.floor(xpForLevel * LEVEL_CONFIG.MULTIPLIER);
  }
  return totalXP;
}
