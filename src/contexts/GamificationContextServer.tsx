"use client";

/**
 * Server-Validated Gamification Context
 *
 * This context replaces the localStorage-based GamificationContext with
 * a server-validated version. All XP, streaks, and achievements are
 * validated server-side to prevent manipulation.
 */

import {
  Achievement,
  ACHIEVEMENTS,
  ENERGY_CONFIG,
  getProgressToNextLevel,
  UserStats,
  XP_ACTIONS,
} from "@/lib/gamification";
import {
  awardXP as apiAwardXP,
  consumeEnergy as apiConsumeEnergy,
  getStats as apiGetStats,
  updateStreak as apiUpdateStreak,
} from "@/lib/gamification/api-client";
import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

interface GamificationContextType {
  // User stats
  userStats: UserStats;

  // Loading state
  isLoading: boolean;
  error: string | null;

  // XP and Level
  // Note: contextOrAmount can be either:
  // - number (legacy: amount of XP - ignored in server version, uses server-defined values)
  // - object with lessonId/quizId/score (new: context for the action)
  addXP: (
    action: keyof typeof XP_ACTIONS,
    contextOrAmount?:
      | number
      | {
          lessonId?: string;
          quizId?: string;
          score?: number;
        },
  ) => Promise<void>;
  levelInfo: ReturnType<typeof getProgressToNextLevel>;

  // Energy system
  currentEnergy: number;
  timeToNextEnergy: number;
  canPerformAction: (action: keyof typeof ENERGY_CONFIG.ENERGY_COST) => boolean;
  consumeEnergy: (
    action: keyof typeof ENERGY_CONFIG.ENERGY_COST,
  ) => Promise<boolean>;

  // Achievements
  unlockedAchievements: string[];
  newAchievements: Achievement[];
  dismissNewAchievements: () => void;

  // Streak system
  updateStreak: () => Promise<void>;

  // Statistics updates (all validated server-side)
  incrementLessonsCompleted: (lessonId?: string) => Promise<void>;
  incrementQuizzesTaken: (
    quizId: string,
    score: number,
    perfect: boolean,
  ) => Promise<void>;
  addNote: () => Promise<void>;
  addBookmark: () => Promise<void>;

  // Gems system
  gems: number;
  purchaseItem: (
    itemId: string,
    quantity?: number,
  ) => Promise<{
    success: boolean;
    error?: string;
    newBalance?: number;
  }>;
  refreshGems: () => Promise<void>;

  // Refresh stats from server
  refreshStats: () => Promise<void>;
}

const GamificationContext = createContext<GamificationContextType | undefined>(
  undefined,
);

interface GamificationProviderProps {
  children: ReactNode;
}

const initialStats: UserStats = {
  totalXP: 0,
  level: 1,
  lessonsCompleted: 0,
  quizzesTaken: 0,
  perfectScores: 0,
  currentStreak: 0,
  longestStreak: 0,
  notesWritten: 0,
  bookmarksAdded: 0,
  achievementsUnlocked: 0,
  daysActive: 0,
  totalStudyTime: 0,
  averageQuizScore: 0,
  subjectsStudied: [],
  challengesCompleted: 0,
  helpedPeers: 0,
  sharedAchievements: 0,
};

export function GamificationProviderServer({
  children,
}: GamificationProviderProps) {
  const [userStats, setUserStats] = useState<UserStats>(initialStats);
  const [currentEnergy, setCurrentEnergy] = useState(ENERGY_CONFIG.MAX_ENERGY);
  const [timeToNextEnergy, setTimeToNextEnergy] = useState(0);
  const [unlockedAchievements, setUnlockedAchievements] = useState<string[]>(
    [],
  );
  const [newAchievements, setNewAchievements] = useState<Achievement[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [gems, setGems] = useState(0);

  // Calculate level info
  const levelInfo = getProgressToNextLevel(userStats.totalXP);

  // Fetch stats from server
  const refreshStats = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const result = await apiGetStats();

      if (result.success && result.stats) {
        setUserStats({
          ...initialStats,
          totalXP: result.stats.totalXP,
          level: result.stats.level,
          currentStreak: result.stats.currentStreak,
          longestStreak: result.stats.longestStreak,
          lessonsCompleted: result.stats.lessonsCompleted,
          quizzesTaken: result.stats.quizzesTaken,
          perfectScores: result.stats.perfectScores,
          achievementsUnlocked: result.stats.unlockedAchievements.length,
          daysActive: result.stats.daysActive,
          totalStudyTime: result.stats.totalStudyTime,
        });
        setCurrentEnergy(result.stats.currentEnergy);
        setUnlockedAchievements(result.stats.unlockedAchievements);
      } else {
        setError(result.error || "Failed to load stats");
      }
    } catch (err) {
      setError("Failed to connect to server");
      console.error("Failed to refresh stats:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Load stats on mount
  useEffect(() => {
    refreshStats();
  }, [refreshStats]);

  // Update streak on mount
  useEffect(() => {
    const checkStreak = async () => {
      const result = await apiUpdateStreak();
      if (result.success && result.isNewDay) {
        // Refresh stats to get updated values
        await refreshStats();
      }
    };
    checkStreak();
  }, [refreshStats]);

  // Add XP (server-validated)
  const addXP = useCallback(
    async (
      action: keyof typeof XP_ACTIONS,
      contextOrAmount?:
        | number
        | { lessonId?: string; quizId?: string; score?: number },
    ) => {
      // Handle legacy number argument (ignored in server version)
      const context =
        typeof contextOrAmount === "number" ? undefined : contextOrAmount;
      const result = await apiAwardXP(action, context);

      if (result.success) {
        setUserStats((prev) => ({
          ...prev,
          totalXP: result.totalXP,
          level: result.level,
        }));

        // Handle new achievements
        if (result.newAchievements && result.newAchievements.length > 0) {
          const newlyUnlocked = ACHIEVEMENTS.filter((a) =>
            result.newAchievements!.includes(a.id),
          );
          setNewAchievements((prev) => [...prev, ...newlyUnlocked]);
          setUnlockedAchievements((prev) => [
            ...prev,
            ...result.newAchievements!,
          ]);
        }

        // Log level up (development only)
        if (result.levelUp && process.env.NODE_ENV === "development") {
          console.log(`Level up! ${result.previousLevel} → ${result.level}`);
        }
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
      return currentEnergy >= cost;
    },
    [currentEnergy],
  );

  const consumeEnergy = useCallback(
    async (
      action: keyof typeof ENERGY_CONFIG.ENERGY_COST,
    ): Promise<boolean> => {
      const result = await apiConsumeEnergy(action);

      if (result.success) {
        setCurrentEnergy(result.currentEnergy);
        setTimeToNextEnergy(result.timeToNextEnergy);
        return true;
      } else {
        setCurrentEnergy(result.currentEnergy);
        setTimeToNextEnergy(result.timeToNextEnergy);
        return false;
      }
    },
    [],
  );

  // Update streak
  const updateStreakHandler = useCallback(async () => {
    const result = await apiUpdateStreak();
    if (result.success) {
      setUserStats((prev) => ({
        ...prev,
        currentStreak: result.currentStreak,
        longestStreak: result.longestStreak,
        totalXP: prev.totalXP + result.xpAwarded,
      }));
    }
  }, []);

  // Statistics update functions
  const incrementLessonsCompleted = useCallback(
    async (lessonId?: string) => {
      await addXP("LESSON_COMPLETED", { lessonId });
      setUserStats((prev) => ({
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
      setUserStats((prev) => ({
        ...prev,
        quizzesTaken: prev.quizzesTaken + 1,
        perfectScores: perfect ? prev.perfectScores + 1 : prev.perfectScores,
      }));
    },
    [addXP],
  );

  const addNote = useCallback(async () => {
    await addXP("NOTE_TAKEN");
    setUserStats((prev) => ({
      ...prev,
      notesWritten: prev.notesWritten + 1,
    }));
  }, [addXP]);

  const addBookmark = useCallback(async () => {
    await addXP("BOOKMARK_ADDED");
    setUserStats((prev) => ({
      ...prev,
      bookmarksAdded: prev.bookmarksAdded + 1,
    }));
  }, [addXP]);

  // Dismiss new achievements
  const dismissNewAchievements = useCallback(() => {
    setNewAchievements([]);
  }, []);

  // Gems system
  const refreshGems = useCallback(async () => {
    try {
      const { getGems } = await import("@/lib/gamification/api-client");
      const result = await getGems();
      if (result.success && result.balance !== undefined) {
        setGems(result.balance);
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
          setGems(result.newBalance);
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

  const value: GamificationContextType = {
    userStats,
    isLoading,
    error,
    addXP,
    levelInfo,
    currentEnergy,
    timeToNextEnergy,
    canPerformAction,
    consumeEnergy,
    unlockedAchievements,
    newAchievements,
    dismissNewAchievements,
    updateStreak: updateStreakHandler,
    incrementLessonsCompleted,
    incrementQuizzesTaken,
    addNote,
    addBookmark,
    gems,
    purchaseItem,
    refreshGems,
    refreshStats,
  };

  return (
    <GamificationContext.Provider value={value}>
      {children}
    </GamificationContext.Provider>
  );
}

export function useGamificationServer() {
  const context = useContext(GamificationContext);
  if (context === undefined) {
    throw new Error(
      "useGamificationServer must be used within a GamificationProviderServer",
    );
  }
  return context;
}

// Alias for backward compatibility with existing components
export const useGamification = useGamificationServer;

// Alias for backward compatibility with existing provider usage
export const GamificationProvider = GamificationProviderServer;
