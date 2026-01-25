"use client";

/**
 * StreakContext - Daily update frequency
 *
 * This context handles streak data which only changes once per day.
 * Separated from stats to prevent re-renders when XP/gems change.
 */

import {
  updateStreak as apiUpdateStreak,
  getStats as apiGetStats,
} from "@/lib/gamification/api-client";
import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

interface StreakState {
  currentStreak: number;
  longestStreak: number;
  daysActive: number;
  isLoading: boolean;
}

interface StreakActions {
  updateStreak: () => Promise<void>;
  refreshStreak: () => Promise<void>;
}

type StreakContextType = StreakState & StreakActions;

const StreakContext = createContext<StreakContextType | undefined>(undefined);

const initialState: StreakState = {
  currentStreak: 0,
  longestStreak: 0,
  daysActive: 0,
  isLoading: true,
};

interface StreakProviderProps {
  children: ReactNode;
}

export function StreakProvider({ children }: StreakProviderProps) {
  const [state, setState] = useState<StreakState>(initialState);

  // Fetch streak data from server
  const refreshStreak = useCallback(async () => {
    try {
      setState(prev => ({ ...prev, isLoading: true }));

      const result = await apiGetStats();

      if (result.success && result.stats) {
        setState({
          currentStreak: result.stats.currentStreak,
          longestStreak: result.stats.longestStreak,
          daysActive: result.stats.daysActive,
          isLoading: false,
        });
      } else {
        setState(prev => ({ ...prev, isLoading: false }));
      }
    } catch (err) {
      console.error("Failed to refresh streak:", err);
      setState(prev => ({ ...prev, isLoading: false }));
    }
  }, []);

  // Update streak
  const updateStreak = useCallback(async () => {
    const result = await apiUpdateStreak();
    if (result.success) {
      setState(prev => ({
        ...prev,
        currentStreak: result.currentStreak,
        longestStreak: result.longestStreak,
      }));
    }
  }, []);

  // Load streak on mount and check/update streak
  useEffect(() => {
    const initStreak = async () => {
      await refreshStreak();
      const result = await apiUpdateStreak();
      if (result.success && result.isNewDay) {
        // Update state with new streak values
        setState(prev => ({
          ...prev,
          currentStreak: result.currentStreak,
          longestStreak: result.longestStreak,
        }));
      }
    };
    initStreak();
  }, [refreshStreak]);

  // Memoize the context value
  const value = useMemo<StreakContextType>(
    () => ({
      ...state,
      updateStreak,
      refreshStreak,
    }),
    [state, updateStreak, refreshStreak]
  );

  return (
    <StreakContext.Provider value={value}>
      {children}
    </StreakContext.Provider>
  );
}

// Main hook
export function useStreak() {
  const context = useContext(StreakContext);
  if (context === undefined) {
    throw new Error("useStreak must be used within a StreakProvider");
  }
  return context;
}

// === Selector hooks ===

/**
 * Get only the current streak value
 */
export function useCurrentStreak() {
  const { currentStreak } = useStreak();
  return currentStreak;
}

/**
 * Get only the longest streak value
 */
export function useLongestStreak() {
  const { longestStreak } = useStreak();
  return longestStreak;
}

/**
 * Get streak comparison data
 */
export function useStreakComparison() {
  const { currentStreak, longestStreak } = useStreak();
  return { currentStreak, longestStreak, isAtBest: currentStreak >= longestStreak };
}
