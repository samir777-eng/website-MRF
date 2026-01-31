/**
 * Server-Side Gamification Types and Validation
 *
 * These types define the server-side data structures for gamification.
 * All XP, levels, streaks, and achievements MUST be validated server-side.
 */

import { z } from "zod";

// Valid XP actions that can be awarded
export const XP_ACTION_NAMES = [
  "LESSON_COMPLETED",
  "QUIZ_COMPLETED",
  "QUIZ_PERFECT_SCORE",
  "DAILY_LOGIN",
  "STREAK_MAINTAINED",
  "NOTE_TAKEN",
  "BOOKMARK_ADDED",
  "LESSON_REVIEWED",
  "QUIZ_RETAKEN",
  "ACHIEVEMENT_UNLOCKED",
  "CHALLENGE_COMPLETED",
  "FIRST_LESSON",
  "FIRST_QUIZ",
  "WEEK_STREAK",
  "MONTH_STREAK",
  "PERFECT_WEEK",
  "HELP_PEER",
  "SHARE_ACHIEVEMENT",
] as const;

export type XPActionName = (typeof XP_ACTION_NAMES)[number];

// Server-side XP values (authoritative source)
export const SERVER_XP_VALUES: Record<XPActionName, number> = {
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
};

// Zod schema for award-xp request
export const awardXPSchema = z.object({
  action: z.enum(XP_ACTION_NAMES),
  // Optional context for verification
  context: z
    .object({
      lessonId: z.string().optional(),
      quizId: z.string().optional(),
      score: z.number().min(0).max(100).optional(),
      timestamp: z.number().optional(),
    })
    .optional(),
  // Client-provided nonce for request deduplication
  nonce: z.string().uuid().optional(),
});

export type AwardXPRequest = z.infer<typeof awardXPSchema>;

// Server gamification state stored in database
export interface ServerGamificationState {
  userId: string;

  // Core stats
  totalXP: number;
  level: number;

  // Activity tracking
  lessonsCompleted: number;
  quizzesTaken: number;
  perfectScores: number;
  notesWritten: number;
  bookmarksAdded: number;

  // Streak data
  currentStreak: number;
  longestStreak: number;
  lastActiveDate: string; // ISO date string YYYY-MM-DD

  // Energy system
  currentEnergy: number;
  lastEnergyUpdate: number; // timestamp

  // Study time
  totalStudyTime: number; // minutes
  daysActive: number;

  // Social
  helpedPeers: number;
  sharedAchievements: number;
  challengesCompleted: number;

  // Achievements
  unlockedAchievements: string[];

  // Metadata
  createdAt: string;
  updatedAt: string;

  // Anti-cheat
  lastActionTime: number;
  actionHistory: ActionHistoryEntry[];
}

export interface ActionHistoryEntry {
  action: XPActionName;
  xpAwarded: number;
  timestamp: number;
  context?: Record<string, unknown>;
}

// API Response types
export interface AwardXPResponse {
  success: boolean;
  xpAwarded: number;
  totalXP: number;
  level: number;
  levelUp: boolean;
  previousLevel?: number;
  newAchievements?: string[];
  error?: string;
  // Signed verification token (optional, for client verification)
  signature?: string;
}

export interface GetStatsResponse {
  success: boolean;
  stats: {
    totalXP: number;
    level: number;
    currentStreak: number;
    longestStreak: number;
    currentEnergy: number;
    lessonsCompleted: number;
    quizzesTaken: number;
    perfectScores: number;
    unlockedAchievements: string[];
    daysActive: number;
    totalStudyTime: number;
  };
  levelInfo: {
    currentLevel: number;
    nextLevel: number;
    progress: number;
    remainingXP: number;
  };
  error?: string;
}

export interface UpdateStreakResponse {
  success: boolean;
  currentStreak: number;
  longestStreak: number;
  xpAwarded: number;
  isNewDay: boolean;
  streakMaintained: boolean;
  error?: string;
}

// Energy action types
export const ENERGY_ACTIONS = ["LESSON", "QUIZ", "CHALLENGE"] as const;
export type EnergyAction = (typeof ENERGY_ACTIONS)[number];

export const consumeEnergySchema = z.object({
  action: z.enum(ENERGY_ACTIONS),
});

export interface ConsumeEnergyResponse {
  success: boolean;
  energyConsumed: number;
  currentEnergy: number;
  timeToNextEnergy: number;
  error?: string;
}
