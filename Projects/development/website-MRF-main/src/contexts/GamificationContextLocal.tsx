"use client";

import {
  Achievement,
  calculateCurrentEnergy,
  canPerformAction,
  checkNewAchievements,
  ENERGY_CONFIG,
  getLevelFromXP,
  getProgressToNextLevel,
  getTimeToNextEnergy,
  UserStats,
  XP_ACTIONS,
} from "@/lib/gamification";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

interface GamificationContextType {
  // User stats
  userStats: UserStats;

  // XP and Level
  addXP: (action: keyof typeof XP_ACTIONS, amount?: number) => void;
  levelInfo: ReturnType<typeof getProgressToNextLevel>;

  // Energy system
  currentEnergy: number;
  timeToNextEnergy: number;
  canPerformAction: (action: keyof typeof ENERGY_CONFIG.ENERGY_COST) => boolean;
  consumeEnergy: (action: keyof typeof ENERGY_CONFIG.ENERGY_COST) => boolean;

  // Achievements
  unlockedAchievements: string[];
  newAchievements: Achievement[];
  dismissNewAchievements: () => void;

  // Streak system
  updateStreak: () => void;

  // Statistics updates
  incrementLessonsCompleted: () => void;
  incrementQuizzesTaken: (score: number, perfect: boolean) => void;
  addNote: () => void;
  addBookmark: () => void;
  addStudyTime: (minutes: number) => void;

  // Persistence
  saveProgress: () => void;
  loadProgress: () => void;
}

const GamificationContext = createContext<GamificationContextType | undefined>(
  undefined
);

interface GamificationProviderProps {
  children: ReactNode;
}

export function GamificationProvider({ children }: GamificationProviderProps) {
  const [userStats, setUserStats] = useState<UserStats>({
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
  });

  const [currentEnergy, setCurrentEnergy] = useState(ENERGY_CONFIG.MAX_ENERGY);
  const [lastEnergyUpdate, setLastEnergyUpdate] = useState(Date.now());
  const [unlockedAchievements, setUnlockedAchievements] = useState<string[]>(
    []
  );
  const [newAchievements, setNewAchievements] = useState<Achievement[]>([]);
  const [lastActiveDate, setLastActiveDate] = useState<string>("");

  // Calculate level info
  const levelInfo = getProgressToNextLevel(userStats.totalXP);

  // Calculate time to next energy
  const timeToNextEnergy = getTimeToNextEnergy(lastEnergyUpdate, currentEnergy);

  // Update energy periodically
  useEffect(() => {
    const interval = setInterval(() => {
      const newEnergy = calculateCurrentEnergy(lastEnergyUpdate, currentEnergy);
      if (newEnergy !== currentEnergy) {
        setCurrentEnergy(newEnergy);
        setLastEnergyUpdate(Date.now());
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [currentEnergy, lastEnergyUpdate]);

  // Add XP and check for level ups and achievements
  const addXP = (action: keyof typeof XP_ACTIONS, customAmount?: number) => {
    const xpAmount = customAmount || XP_ACTIONS[action];

    setUserStats((prev) => {
      const newTotalXP = prev.totalXP + xpAmount;
      const newLevel = getLevelFromXP(newTotalXP);
      const updatedStats = {
        ...prev,
        totalXP: newTotalXP,
        level: newLevel,
      };

      // Check for new achievements
      const newlyUnlocked = checkNewAchievements(
        updatedStats,
        unlockedAchievements
      );
      if (newlyUnlocked.length > 0) {
        setNewAchievements((prev) => [...prev, ...newlyUnlocked]);
        setUnlockedAchievements((prev) => [
          ...prev,
          ...newlyUnlocked.map((a) => a.id),
        ]);

        // Add XP for achievements (but don't trigger infinite loop)
        const achievementXP = newlyUnlocked.reduce(
          (sum, achievement) => sum + achievement.xpReward,
          0
        );
        updatedStats.totalXP += achievementXP;
        updatedStats.level = getLevelFromXP(updatedStats.totalXP);
        updatedStats.achievementsUnlocked =
          unlockedAchievements.length + newlyUnlocked.length;
      }

      return updatedStats;
    });

    // Show XP gain animation (you can implement this)
    // Note: Removed console.log to prevent XP data leaking in production
    if (process.env.NODE_ENV === "development") {
      console.log(`+${xpAmount} XP from ${action}`);
    }
  };

  // Energy system functions
  const canPerformActionCheck = (
    action: keyof typeof ENERGY_CONFIG.ENERGY_COST
  ): boolean => {
    return canPerformAction(action, currentEnergy);
  };

  const consumeEnergy = (
    action: keyof typeof ENERGY_CONFIG.ENERGY_COST
  ): boolean => {
    const cost = ENERGY_CONFIG.ENERGY_COST[action];
    if (currentEnergy >= cost) {
      setCurrentEnergy((prev) => prev - cost);
      setLastEnergyUpdate(Date.now());
      return true;
    }
    return false;
  };

  // Streak system
  const updateStreak = () => {
    const today = new Date().toDateString();
    const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toDateString();

    if (lastActiveDate === yesterday) {
      // Continue streak
      setUserStats((prev) => ({
        ...prev,
        currentStreak: prev.currentStreak + 1,
        longestStreak: Math.max(prev.longestStreak, prev.currentStreak + 1),
        daysActive: prev.daysActive + 1,
      }));
      addXP("STREAK_MAINTAINED");
    } else if (lastActiveDate !== today) {
      // New day, reset or start streak
      const newStreak =
        lastActiveDate === yesterday ? userStats.currentStreak + 1 : 1;
      setUserStats((prev) => ({
        ...prev,
        currentStreak: newStreak,
        longestStreak: Math.max(prev.longestStreak, newStreak),
        daysActive: prev.daysActive + 1,
      }));

      if (newStreak === 1) {
        addXP("DAILY_LOGIN");
      } else {
        addXP("STREAK_MAINTAINED");
      }
    }

    setLastActiveDate(today);
  };

  // Statistics update functions
  const incrementLessonsCompleted = () => {
    setUserStats((prev) => ({
      ...prev,
      lessonsCompleted: prev.lessonsCompleted + 1,
    }));
    addXP("LESSON_COMPLETED");
  };

  const incrementQuizzesTaken = (score: number, perfect: boolean) => {
    setUserStats((prev) => {
      const newQuizCount = prev.quizzesTaken + 1;
      const newTotalScore = prev.averageQuizScore * prev.quizzesTaken + score;
      const newAverageScore = newTotalScore / newQuizCount;

      return {
        ...prev,
        quizzesTaken: newQuizCount,
        perfectScores: perfect ? prev.perfectScores + 1 : prev.perfectScores,
        averageQuizScore: newAverageScore,
      };
    });

    if (perfect) {
      addXP("QUIZ_PERFECT_SCORE");
    } else {
      addXP("QUIZ_COMPLETED");
    }
  };

  const addNote = () => {
    setUserStats((prev) => ({
      ...prev,
      notesWritten: prev.notesWritten + 1,
    }));
    addXP("NOTE_TAKEN");
  };

  const addBookmark = () => {
    setUserStats((prev) => ({
      ...prev,
      bookmarksAdded: prev.bookmarksAdded + 1,
    }));
    addXP("BOOKMARK_ADDED");
  };

  const addStudyTime = (minutes: number) => {
    setUserStats((prev) => ({
      ...prev,
      totalStudyTime: prev.totalStudyTime + minutes,
    }));
  };

  // Achievement management
  const dismissNewAchievements = () => {
    setNewAchievements([]);
  };

  // Persistence functions
  const saveProgress = () => {
    const data = {
      userStats,
      currentEnergy,
      lastEnergyUpdate,
      unlockedAchievements,
      lastActiveDate,
    };
    localStorage.setItem("mrf-gamification", JSON.stringify(data));
  };

  const loadProgress = () => {
    try {
      const saved = localStorage.getItem("mrf-gamification");
      if (saved) {
        const data = JSON.parse(saved);
        setUserStats(data.userStats || userStats);
        setCurrentEnergy(data.currentEnergy || ENERGY_CONFIG.MAX_ENERGY);
        setLastEnergyUpdate(data.lastEnergyUpdate || Date.now());
        setUnlockedAchievements(data.unlockedAchievements || []);
        setLastActiveDate(data.lastActiveDate || "");
      }
    } catch (error) {
      console.error("Failed to load gamification progress:", error);
    }
  };

  // Load progress on mount
  useEffect(() => {
    loadProgress();
  }, []);

  // Save progress periodically
  useEffect(() => {
    const interval = setInterval(saveProgress, 30000); // Save every 30 seconds
    return () => clearInterval(interval);
  }, [
    userStats,
    currentEnergy,
    lastEnergyUpdate,
    unlockedAchievements,
    lastActiveDate,
  ]);

  // Update streak on first load
  useEffect(() => {
    if (lastActiveDate) {
      updateStreak();
    }
  }, []);

  const value: GamificationContextType = {
    userStats,
    addXP,
    levelInfo,
    currentEnergy,
    timeToNextEnergy,
    canPerformAction: canPerformActionCheck,
    consumeEnergy,
    unlockedAchievements,
    newAchievements,
    dismissNewAchievements,
    updateStreak,
    incrementLessonsCompleted,
    incrementQuizzesTaken,
    addNote,
    addBookmark,
    addStudyTime,
    saveProgress,
    loadProgress,
  };

  return (
    <GamificationContext.Provider value={value}>
      {children}
    </GamificationContext.Provider>
  );
}

export function useGamification() {
  const context = useContext(GamificationContext);
  if (context === undefined) {
    throw new Error(
      "useGamification must be used within a GamificationProvider"
    );
  }
  return context;
}
