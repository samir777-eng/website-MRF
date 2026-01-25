"use client";

/**
 * AchievementsContext - Low-frequency updates
 *
 * This context handles achievements which change infrequently.
 * Separated from stats to prevent re-renders when XP changes.
 */

import { Achievement, ACHIEVEMENTS } from "@/lib/gamification";
import { getStats as apiGetStats } from "@/lib/gamification/api-client";
import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

interface AchievementsState {
  unlockedAchievements: string[];
  newAchievements: Achievement[];
  isLoading: boolean;
}

interface AchievementsActions {
  dismissNewAchievements: () => void;
  addNewAchievements: (achievementIds: string[]) => void;
  refreshAchievements: () => Promise<void>;
}

interface AchievementsDerived {
  achievementCount: number;
  totalAchievements: number;
  completionPercentage: number;
}

type AchievementsContextType = AchievementsState & AchievementsActions & AchievementsDerived;

const AchievementsContext = createContext<AchievementsContextType | undefined>(undefined);

const initialState: AchievementsState = {
  unlockedAchievements: [],
  newAchievements: [],
  isLoading: true,
};

interface AchievementsProviderProps {
  children: ReactNode;
}

export function AchievementsProvider({ children }: AchievementsProviderProps) {
  const [state, setState] = useState<AchievementsState>(initialState);

  // Derived values - memoized
  const achievementCount = state.unlockedAchievements.length;
  const totalAchievements = ACHIEVEMENTS.length;
  const completionPercentage = useMemo(
    () => Math.round((achievementCount / totalAchievements) * 100),
    [achievementCount, totalAchievements]
  );

  // Fetch achievements from server
  const refreshAchievements = useCallback(async () => {
    try {
      setState(prev => ({ ...prev, isLoading: true }));

      const result = await apiGetStats();

      if (result.success && result.stats) {
        setState(prev => ({
          ...prev,
          unlockedAchievements: result.stats!.unlockedAchievements,
          isLoading: false,
        }));
      } else {
        setState(prev => ({ ...prev, isLoading: false }));
      }
    } catch (err) {
      console.error("Failed to refresh achievements:", err);
      setState(prev => ({ ...prev, isLoading: false }));
    }
  }, []);

  // Load achievements on mount
  useEffect(() => {
    refreshAchievements();
  }, [refreshAchievements]);

  // Dismiss new achievements notification
  const dismissNewAchievements = useCallback(() => {
    setState(prev => ({ ...prev, newAchievements: [] }));
  }, []);

  // Add new achievements (called from stats context when XP rewards unlock achievements)
  const addNewAchievements = useCallback((achievementIds: string[]) => {
    if (achievementIds.length === 0) return;

    const newlyUnlocked = ACHIEVEMENTS.filter(a => achievementIds.includes(a.id));

    setState(prev => ({
      ...prev,
      newAchievements: [...prev.newAchievements, ...newlyUnlocked],
      unlockedAchievements: [...prev.unlockedAchievements, ...achievementIds],
    }));
  }, []);

  // Memoize the context value
  const value = useMemo<AchievementsContextType>(
    () => ({
      ...state,
      achievementCount,
      totalAchievements,
      completionPercentage,
      dismissNewAchievements,
      addNewAchievements,
      refreshAchievements,
    }),
    [
      state,
      achievementCount,
      totalAchievements,
      completionPercentage,
      dismissNewAchievements,
      addNewAchievements,
      refreshAchievements,
    ]
  );

  return (
    <AchievementsContext.Provider value={value}>
      {children}
    </AchievementsContext.Provider>
  );
}

// Main hook
export function useAchievements() {
  const context = useContext(AchievementsContext);
  if (context === undefined) {
    throw new Error("useAchievements must be used within an AchievementsProvider");
  }
  return context;
}

// === Selector hooks ===

/**
 * Get only the unlocked achievements list
 */
export function useUnlockedAchievements() {
  const { unlockedAchievements } = useAchievements();
  return unlockedAchievements;
}

/**
 * Get only new (unread) achievements
 */
export function useNewAchievements() {
  const { newAchievements, dismissNewAchievements } = useAchievements();
  return { newAchievements, dismissNewAchievements };
}

/**
 * Check if a specific achievement is unlocked
 */
export function useIsAchievementUnlocked(achievementId: string) {
  const { unlockedAchievements } = useAchievements();
  return unlockedAchievements.includes(achievementId);
}

/**
 * Get achievement progress stats
 */
export function useAchievementProgress() {
  const { achievementCount, totalAchievements, completionPercentage } = useAchievements();
  return { achievementCount, totalAchievements, completionPercentage };
}
