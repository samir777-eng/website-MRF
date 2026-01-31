"use client";

/**
 * GamificationStatsContext - High-frequency updates
 *
 * This context handles XP, gems, level, and energy - values that change
 * frequently during user actions.
 *
 * Separated from settings and streak to prevent unnecessary re-renders
 * in components that only need stable data.
 */

import {
  ENERGY_CONFIG,
  getProgressToNextLevel,
  XP_ACTIONS,
} from "@/lib/gamification";
import {
  awardXP as apiAwardXP,
  consumeEnergy as apiConsumeEnergy,
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

// Stats state interface
interface GamificationStatsState {
  totalXP: number;
  level: number;
  gems: number;
  currentEnergy: number;
  timeToNextEnergy: number;
  lessonsCompleted: number;
  quizzesTaken: number;
  perfectScores: number;
  notesWritten: number;
  bookmarksAdded: number;
  isLoading: boolean;
  error: string | null;
}

// Actions interface
interface GamificationStatsActions {
  addXP: (
    action: keyof typeof XP_ACTIONS,
    contextOrAmount?:
      | number
      | { lessonId?: string; quizId?: string; score?: number },
  ) => Promise<void>;
  canPerformAction: (action: keyof typeof ENERGY_CONFIG.ENERGY_COST) => boolean;
  consumeEnergy: (
    action: keyof typeof ENERGY_CONFIG.ENERGY_COST,
  ) => Promise<boolean>;
  incrementLessonsCompleted: (lessonId?: string) => Promise<void>;
  incrementQuizzesTaken: (
    quizId: string,
    score: number,
    perfect: boolean,
  ) => Promise<void>;
  addNote: () => Promise<void>;
  addBookmark: () => Promise<void>;
  purchaseItem: (
    itemId: string,
    quantity?: number,
  ) => Promise<{
    success: boolean;
    error?: string;
    newBalance?: number;
  }>;
  refreshGems: () => Promise<void>;
  refreshStats: () => Promise<void>;
}

// Derived values interface
interface GamificationStatsDerived {
  levelInfo: ReturnType<typeof getProgressToNextLevel>;
}

// Combined context type
type GamificationStatsContextType = GamificationStatsState &
  GamificationStatsActions &
  GamificationStatsDerived;

const GamificationStatsContext = createContext<
  GamificationStatsContextType | undefined
>(undefined);

const initialState: GamificationStatsState = {
  totalXP: 0,
  level: 1,
  gems: 0,
  currentEnergy: ENERGY_CONFIG.MAX_ENERGY,
  timeToNextEnergy: 0,
  lessonsCompleted: 0,
  quizzesTaken: 0,
  perfectScores: 0,
  notesWritten: 0,
  bookmarksAdded: 0,
  isLoading: true,
  error: null,
};

interface GamificationStatsProviderProps {
  children: ReactNode;
}

export function GamificationStatsProvider({
  children,
}: GamificationStatsProviderProps) {
  const [state, setState] = useState<GamificationStatsState>(initialState);

  // Calculate level info - memoized since it only depends on totalXP
  const levelInfo = useMemo(
    () => getProgressToNextLevel(state.totalXP),
    [state.totalXP],
  );

  // Fetch stats from server
  const refreshStats = useCallback(async () => {
    try {
      setState((prev) => ({ ...prev, isLoading: true, error: null }));

      const result = await apiGetStats();

      if (result.success && result.stats) {
        setState((prev) => ({
          ...prev,
          totalXP: result.stats!.totalXP,
          level: result.stats!.level,
          currentEnergy: result.stats!.currentEnergy,
          lessonsCompleted: result.stats!.lessonsCompleted,
          quizzesTaken: result.stats!.quizzesTaken,
          perfectScores: result.stats!.perfectScores,
          isLoading: false,
        }));
      } else {
        setState((prev) => ({
          ...prev,
          error: result.error || "Failed to load stats",
          isLoading: false,
        }));
      }
    } catch (err) {
      setState((prev) => ({
        ...prev,
        error: "Failed to connect to server",
        isLoading: false,
      }));
      console.error("Failed to refresh stats:", err);
    }
  }, []);

  // Load stats on mount
  useEffect(() => {
    refreshStats();
  }, [refreshStats]);

  // Add XP (server-validated)
  const addXP = useCallback(
    async (
      action: keyof typeof XP_ACTIONS,
      contextOrAmount?:
        | number
        | { lessonId?: string; quizId?: string; score?: number },
    ) => {
      const context =
        typeof contextOrAmount === "number" ? undefined : contextOrAmount;
      const result = await apiAwardXP(action, context);

      if (result.success) {
        setState((prev) => ({
          ...prev,
          totalXP: result.totalXP,
          level: result.level,
        }));
      } else if (result.error) {
        console.error("Failed to award XP:", result.error);
      }
    },
    [],
  );

  // Energy system
  const canPerformAction = useCallback(
    (action: keyof typeof ENERGY_CONFIG.ENERGY_COST): boolean => {
      const cost = ENERGY_CONFIG.ENERGY_COST[action];
      return state.currentEnergy >= cost;
    },
    [state.currentEnergy],
  );

  const consumeEnergy = useCallback(
    async (
      action: keyof typeof ENERGY_CONFIG.ENERGY_COST,
    ): Promise<boolean> => {
      const result = await apiConsumeEnergy(action);

      setState((prev) => ({
        ...prev,
        currentEnergy: result.currentEnergy,
        timeToNextEnergy: result.timeToNextEnergy,
      }));

      return result.success;
    },
    [],
  );

  // Statistics update functions
  const incrementLessonsCompleted = useCallback(
    async (lessonId?: string) => {
      await addXP("LESSON_COMPLETED", { lessonId });
      setState((prev) => ({
        ...prev,
        lessonsCompleted: prev.lessonsCompleted + 1,
      }));
    },
    [addXP],
  );

  const incrementQuizzesTaken = useCallback(
    async (quizId: string, score: number, perfect: boolean) => {
      const action = perfect ? "QUIZ_PERFECT_SCORE" : "QUIZ_COMPLETED";
      await addXP(action, { quizId, score });
      setState((prev) => ({
        ...prev,
        quizzesTaken: prev.quizzesTaken + 1,
        perfectScores: perfect ? prev.perfectScores + 1 : prev.perfectScores,
      }));
    },
    [addXP],
  );

  const addNote = useCallback(async () => {
    await addXP("NOTE_TAKEN");
    setState((prev) => ({
      ...prev,
      notesWritten: prev.notesWritten + 1,
    }));
  }, [addXP]);

  const addBookmark = useCallback(async () => {
    await addXP("BOOKMARK_ADDED");
    setState((prev) => ({
      ...prev,
      bookmarksAdded: prev.bookmarksAdded + 1,
    }));
  }, [addXP]);

  // Gems system
  const refreshGems = useCallback(async () => {
    try {
      const { getGems } = await import("@/lib/gamification/api-client");
      const result = await getGems();
      if (result.success && result.balance !== undefined) {
        setState((prev) => ({ ...prev, gems: result.balance! }));
      }
    } catch (err) {
      console.error("Failed to refresh gems:", err);
    }
  }, []);

  const purchaseItem = useCallback(
    async (itemId: string, quantity: number = 1) => {
      try {
        const { purchaseItem: apiPurchase } =
          await import("@/lib/gamification/api-client");
        const result = await apiPurchase(itemId, quantity);
        if (result.success && result.newBalance !== undefined) {
          setState((prev) => ({ ...prev, gems: result.newBalance! }));
        }
        return {
          success: result.success,
          error: result.error,
          newBalance: result.newBalance,
        };
      } catch (err) {
        console.error("Failed to purchase item:", err);
        return {
          success: false,
          error: "خطأ في الاتصال بالخادم",
        };
      }
    },
    [],
  );

  // Load gems on mount
  useEffect(() => {
    refreshGems();
  }, [refreshGems]);

  // Memoize the context value to prevent unnecessary re-renders
  const value = useMemo<GamificationStatsContextType>(
    () => ({
      // State
      ...state,
      // Derived
      levelInfo,
      // Actions
      addXP,
      canPerformAction,
      consumeEnergy,
      incrementLessonsCompleted,
      incrementQuizzesTaken,
      addNote,
      addBookmark,
      purchaseItem,
      refreshGems,
      refreshStats,
    }),
    [
      state,
      levelInfo,
      addXP,
      canPerformAction,
      consumeEnergy,
      incrementLessonsCompleted,
      incrementQuizzesTaken,
      addNote,
      addBookmark,
      purchaseItem,
      refreshGems,
      refreshStats,
    ],
  );

  return (
    <GamificationStatsContext.Provider value={value}>
      {children}
    </GamificationStatsContext.Provider>
  );
}

// Main hook
export function useGamificationStats() {
  const context = useContext(GamificationStatsContext);
  if (context === undefined) {
    throw new Error(
      "useGamificationStats must be used within a GamificationStatsProvider",
    );
  }
  return context;
}

// === Selector hooks for fine-grained subscriptions ===

/**
 * Get only the XP value - use this when you only need XP display
 */
export function useGamificationXP() {
  const { totalXP } = useGamificationStats();
  return totalXP;
}

/**
 * Get only the gems value - use this for gem displays
 */
export function useGamificationGems() {
  const { gems } = useGamificationStats();
  return gems;
}

/**
 * Get only the level info - use this for level displays
 */
export function useGamificationLevel() {
  const { level, levelInfo } = useGamificationStats();
  return { level, levelInfo };
}

/**
 * Get only the energy info - use this for energy displays
 */
export function useGamificationEnergy() {
  const { currentEnergy, timeToNextEnergy, canPerformAction, consumeEnergy } =
    useGamificationStats();
  return { currentEnergy, timeToNextEnergy, canPerformAction, consumeEnergy };
}

/**
 * Get only lesson/quiz stats - use this for progress displays
 */
export function useGamificationProgress() {
  const {
    lessonsCompleted,
    quizzesTaken,
    perfectScores,
    notesWritten,
    bookmarksAdded,
  } = useGamificationStats();
  return {
    lessonsCompleted,
    quizzesTaken,
    perfectScores,
    notesWritten,
    bookmarksAdded,
  };
}

/**
 * Get only the loading/error state - use this for loading indicators
 */
export function useGamificationLoadingState() {
  const { isLoading, error } = useGamificationStats();
  return { isLoading, error };
}
