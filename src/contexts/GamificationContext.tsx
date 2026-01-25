"use client";

/**
 * GamificationContext - Optimized Server-Validated Version
 *
 * This file re-exports the optimized gamification context for backward
 * compatibility. Components importing from this file will automatically
 * use the performance-optimized, server-validated implementation.
 *
 * OPTIMIZATIONS:
 * - Split into 3 contexts by update frequency (Stats, Streak, Achievements)
 * - Memoized context values to prevent cascading re-renders
 * - Selector hooks for fine-grained subscriptions
 *
 * MIGRATION GUIDE:
 * For better performance, use specific hooks instead of useGamification():
 *
 *   XP only:      import { useGamificationXP } from '@/contexts/gamification'
 *   Gems only:    import { useGamificationGems } from '@/contexts/gamification'
 *   Level only:   import { useGamificationLevel } from '@/contexts/gamification'
 *   Streak only:  import { useCurrentStreak } from '@/contexts/gamification'
 *   Achievements: import { useAchievements } from '@/contexts/gamification'
 *
 * The old monolithic context is in GamificationContextServer.tsx.
 * The localStorage-based implementation is in GamificationContextLocal.tsx.
 */

// Re-export the optimized combined provider as default
export {
  OptimizedGamificationProvider as GamificationProvider,
  useGamificationCombined as useGamification,
} from "./gamification";

// Also export individual providers and hooks for fine-grained usage
export {
  // Stats context (high-frequency updates)
  GamificationStatsProvider,
  useGamificationStats,
  useGamificationXP,
  useGamificationGems,
  useGamificationLevel,
  useGamificationEnergy,
  useGamificationProgress,
  useGamificationLoadingState,
  // Streak context (daily updates)
  StreakProvider,
  useStreak,
  useCurrentStreak,
  useLongestStreak,
  useStreakComparison,
  // Achievements context (low-frequency updates)
  AchievementsProvider,
  useAchievements,
  useUnlockedAchievements,
  useNewAchievements,
  useIsAchievementUnlocked,
  useAchievementProgress,
} from "./gamification";
