"use client";

/**
 * Gamification Context - Optimized Split Architecture
 *
 * This module provides optimized gamification contexts split by update frequency:
 *
 * 1. GamificationStatsContext - High frequency (XP, gems, level, energy)
 * 2. StreakContext - Daily frequency (streak data)
 * 3. AchievementsContext - Low frequency (achievements)
 *
 * Benefits:
 * - Components only re-render when their specific data changes
 * - Selector hooks for fine-grained subscriptions
 * - Memoized context values to prevent cascading re-renders
 *
 * Migration Guide:
 * - Replace `useGamification()` with specific hooks:
 *   - XP display: `useGamificationXP()` or `useGamificationStats()`
 *   - Gems display: `useGamificationGems()`
 *   - Level display: `useGamificationLevel()`
 *   - Streak display: `useStreak()` or `useCurrentStreak()`
 *   - Achievements: `useAchievements()` or `useUnlockedAchievements()`
 */

import React, { ReactNode, useMemo } from "react";
import {
  GamificationStatsProvider,
  useGamificationStats,
} from "./GamificationStatsContext";
import { StreakProvider, useStreak } from "./StreakContext";
import { AchievementsProvider, useAchievements } from "./AchievementsContext";

// Re-export all hooks from individual contexts
export * from "./GamificationStatsContext";
export * from "./StreakContext";
export * from "./AchievementsContext";

/**
 * Combined GamificationProvider that wraps all three contexts
 * Use this as a drop-in replacement for the old GamificationProvider
 */
interface OptimizedGamificationProviderProps {
  children: ReactNode;
}

export function OptimizedGamificationProvider({
  children,
}: OptimizedGamificationProviderProps) {
  return (
    <GamificationStatsProvider>
      <StreakProvider>
        <AchievementsProvider>{children}</AchievementsProvider>
      </StreakProvider>
    </GamificationStatsProvider>
  );
}

/**
 * Compatibility hook that combines all contexts
 * Use this for gradual migration from the old useGamification hook
 *
 * WARNING: This hook subscribes to ALL gamification contexts, causing
 * re-renders whenever any gamification data changes. Prefer using
 * specific selector hooks for better performance.
 */
export function useGamificationCombined() {
  const stats = useGamificationStats();
  const streak = useStreak();
  const achievements = useAchievements();

  // Combine into a single object matching the old API
  return useMemo(
    () => ({
      // User stats (from old userStats object)
      userStats: {
        totalXP: stats.totalXP,
        level: stats.level,
        lessonsCompleted: stats.lessonsCompleted,
        quizzesTaken: stats.quizzesTaken,
        perfectScores: stats.perfectScores,
        currentStreak: streak.currentStreak,
        longestStreak: streak.longestStreak,
        notesWritten: stats.notesWritten,
        bookmarksAdded: stats.bookmarksAdded,
        achievementsUnlocked: achievements.achievementCount,
        daysActive: streak.daysActive,
        totalStudyTime: 0, // TODO: Add to stats context if needed
        averageQuizScore: 0, // TODO: Add to stats context if needed
        subjectsStudied: [], // TODO: Add to stats context if needed
        challengesCompleted: 0,
        helpedPeers: 0,
        sharedAchievements: 0,
      },

      // Loading state
      isLoading: stats.isLoading || streak.isLoading || achievements.isLoading,
      error: stats.error,

      // XP and Level
      addXP: stats.addXP,
      levelInfo: stats.levelInfo,

      // Energy system
      currentEnergy: stats.currentEnergy,
      timeToNextEnergy: stats.timeToNextEnergy,
      canPerformAction: stats.canPerformAction,
      consumeEnergy: stats.consumeEnergy,

      // Achievements
      unlockedAchievements: achievements.unlockedAchievements,
      newAchievements: achievements.newAchievements,
      dismissNewAchievements: achievements.dismissNewAchievements,

      // Streak system
      updateStreak: streak.updateStreak,

      // Statistics updates
      incrementLessonsCompleted: stats.incrementLessonsCompleted,
      incrementQuizzesTaken: stats.incrementQuizzesTaken,
      addNote: stats.addNote,
      addBookmark: stats.addBookmark,

      // Gems system
      gems: stats.gems,
      purchaseItem: stats.purchaseItem,
      refreshGems: stats.refreshGems,

      // Refresh
      refreshStats: stats.refreshStats,
    }),
    [stats, streak, achievements],
  );
}
