"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import {
  ReviewItem,
  ReviewSession,
  ReviewResponse,
  getItemsDueForReview,
  updateReviewItem,
  getReviewStatistics,
  createReviewItem,
  getOptimalSessionSize,
} from "@/lib/spacedRepetition";

interface SpacedRepetitionContextType {
  // Review items management
  reviewItems: ReviewItem[];
  addReviewItem: (
    contentId: string,
    contentType: ReviewItem["contentType"],
    title: string,
    description: string,
    difficulty: ReviewItem["difficulty"],
    subject: ReviewItem["subject"],
    tags?: string[],
  ) => void;
  updateReviewItemData: (itemId: string, updates: Partial<ReviewItem>) => void;
  removeReviewItem: (itemId: string) => void;

  // Review sessions
  currentSession: ReviewSession | null;
  startReviewSession: (
    sessionType: ReviewSession["sessionType"],
    maxItems?: number,
  ) => ReviewSession | null;
  submitReviewResponse: (response: ReviewResponse) => void;
  endReviewSession: () => void;

  // Due items and scheduling
  itemsDueToday: ReviewItem[];
  itemsOverdue: ReviewItem[];
  getItemsDue: (maxItems?: number) => ReviewItem[];

  // Statistics and analytics
  reviewStats: ReturnType<typeof getReviewStatistics>;
  userPerformance: {
    averageAccuracy: number;
    averageSessionTime: number;
    totalSessions: number;
    streakDays: number;
    lastStudyDate?: Date;
  };

  // Study recommendations
  recommendedSessionSize: number;
  weakAreas: { subject: string; accuracy: number; count: number }[];

  // Persistence
  saveProgress: () => void;
  loadProgress: () => void;

  // Utilities
  isReviewDue: (itemId: string) => boolean;
  getItemById: (itemId: string) => ReviewItem | undefined;
  searchItems: (query: string) => ReviewItem[];
}

const SpacedRepetitionContext = createContext<
  SpacedRepetitionContextType | undefined
>(undefined);

interface SpacedRepetitionProviderProps {
  children: React.ReactNode;
}

// Mock data for development
const MOCK_REVIEW_ITEMS: ReviewItem[] = [
  {
    id: "review_vocab_1",
    contentId: "vocab_1",
    contentType: "vocabulary",
    title: "الفاعل",
    description: "تعريف الفاعل وأحكامه في النحو العربي",
    difficulty: 2,
    easeFactor: 2.5,
    interval: 3,
    repetitions: 1,
    nextReviewDate: new Date(Date.now() - 24 * 60 * 60 * 1000), // Yesterday (overdue)
    totalReviews: 3,
    correctReviews: 2,
    averageResponseTime: 4500,
    streakCount: 2,
    subject: "نحو",
    tags: ["فاعل", "نحو", "أساسيات"],
    relatedItems: ["review_vocab_2", "review_vocab_3"],
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    lastModified: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    isActive: true,
    priority: "high",
  },
  {
    id: "review_grammar_1",
    contentId: "grammar_1",
    contentType: "grammar",
    title: "إعراب الفعل المضارع",
    description: "قواعد إعراب الفعل المضارع في حالاته المختلفة",
    difficulty: 4,
    easeFactor: 2.2,
    interval: 7,
    repetitions: 2,
    nextReviewDate: new Date(Date.now() + 24 * 60 * 60 * 1000), // Tomorrow
    totalReviews: 5,
    correctReviews: 3,
    averageResponseTime: 6200,
    streakCount: 1,
    subject: "نحو",
    tags: ["فعل مضارع", "إعراب", "نحو"],
    relatedItems: ["review_grammar_2"],
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
    lastModified: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    isActive: true,
    priority: "medium",
  },
  {
    id: "review_concept_1",
    contentId: "concept_1",
    contentType: "concept",
    title: "الاستعارة المكنية",
    description: "مفهوم الاستعارة المكنية وأمثلتها في البلاغة",
    difficulty: 3,
    easeFactor: 2.7,
    interval: 14,
    repetitions: 4,
    nextReviewDate: new Date(), // Today
    totalReviews: 8,
    correctReviews: 7,
    averageResponseTime: 3800,
    streakCount: 6,
    subject: "بلاغة",
    tags: ["استعارة", "بلاغة", "بيان"],
    relatedItems: ["review_concept_2", "review_concept_3"],
    createdAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000),
    lastModified: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    isActive: true,
    priority: "low",
  },
  {
    id: "review_verse_1",
    contentId: "verse_1",
    contentType: "verse",
    title: "بيت من معلقة امرئ القيس",
    description: "قفا نبك من ذكرى حبيب ومنزل - شرح وتحليل",
    difficulty: 2,
    easeFactor: 2.8,
    interval: 21,
    repetitions: 5,
    nextReviewDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // In 3 days
    totalReviews: 6,
    correctReviews: 6,
    averageResponseTime: 2900,
    streakCount: 6,
    subject: "أدب",
    tags: ["معلقة", "امرؤ القيس", "شعر جاهلي"],
    relatedItems: [],
    createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
    lastModified: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    isActive: true,
    priority: "medium",
  },
];

export function SpacedRepetitionProvider({
  children,
}: SpacedRepetitionProviderProps) {
  const [reviewItems, setReviewItems] =
    useState<ReviewItem[]>(MOCK_REVIEW_ITEMS);
  const [currentSession, setCurrentSession] = useState<ReviewSession | null>(
    null,
  );
  const [userPerformance, setUserPerformance] = useState({
    averageAccuracy: 75,
    averageSessionTime: 12, // minutes
    totalSessions: 24,
    streakDays: 5,
    lastStudyDate: new Date(Date.now() - 24 * 60 * 60 * 1000),
  });

  // Calculate derived state
  const reviewStats = getReviewStatistics(reviewItems);
  const itemsDueToday = getItemsDueForReview(
    reviewItems,
    new Date(),
    50,
  ).filter((item) => {
    const today = new Date();
    const itemDate = new Date(item.nextReviewDate);
    return itemDate.toDateString() === today.toDateString();
  });
  const itemsOverdue = getItemsDueForReview(reviewItems, new Date(), 50).filter(
    (item) => {
      const today = new Date();
      return item.nextReviewDate < today;
    },
  );

  const recommendedSessionSize = getOptimalSessionSize(userPerformance, 15); // 15 minutes default

  // Calculate weak areas
  const weakAreas = React.useMemo(() => {
    const subjectStats: { [key: string]: { total: number; correct: number } } =
      {};

    reviewItems.forEach((item) => {
      if (!subjectStats[item.subject]) {
        subjectStats[item.subject] = { total: 0, correct: 0 };
      }
      subjectStats[item.subject].total += item.totalReviews;
      subjectStats[item.subject].correct += item.correctReviews;
    });

    return Object.entries(subjectStats)
      .map(([subject, stats]) => ({
        subject,
        accuracy: stats.total > 0 ? (stats.correct / stats.total) * 100 : 0,
        count: stats.total,
      }))
      .filter((area) => area.accuracy < 80 && area.count >= 3)
      .sort((a, b) => a.accuracy - b.accuracy);
  }, [reviewItems]);

  // Add new review item
  const addReviewItem = useCallback(
    (
      contentId: string,
      contentType: ReviewItem["contentType"],
      title: string,
      description: string,
      difficulty: ReviewItem["difficulty"],
      subject: ReviewItem["subject"],
      tags: string[] = [],
    ) => {
      const newItem = createReviewItem(
        contentId,
        contentType,
        title,
        description,
        difficulty,
        subject,
        tags,
      );
      setReviewItems((prev) => [...prev, newItem]);
    },
    [],
  );

  // Update review item
  const updateReviewItemData = useCallback(
    (itemId: string, updates: Partial<ReviewItem>) => {
      setReviewItems((prev) =>
        prev.map((item) =>
          item.id === itemId
            ? { ...item, ...updates, lastModified: new Date() }
            : item,
        ),
      );
    },
    [],
  );

  // Remove review item
  const removeReviewItem = useCallback((itemId: string) => {
    setReviewItems((prev) => prev.filter((item) => item.id !== itemId));
  }, []);

  // Start review session
  const startReviewSession = useCallback(
    (
      sessionType: ReviewSession["sessionType"],
      maxItems: number = recommendedSessionSize,
    ): ReviewSession | null => {
      const dueItems = getItemsDueForReview(reviewItems, new Date(), maxItems);

      if (dueItems.length === 0) {
        return null; // No items to review
      }

      const session: ReviewSession = {
        id: `session_${Date.now()}`,
        userId: "current_user",
        startTime: new Date(),
        itemsReviewed: [],
        totalItems: dueItems.length,
        correctAnswers: 0,
        averageResponseTime: 0,
        sessionType,
        xpEarned: 0,
      };

      setCurrentSession(session);
      return session;
    },
    [reviewItems, recommendedSessionSize],
  );

  // Submit review response
  const submitReviewResponse = useCallback(
    (response: ReviewResponse) => {
      if (!currentSession) return;

      // Update the review item
      const item = reviewItems.find((item) => item.id === response.itemId);
      if (!item) return;

      const updatedItem = updateReviewItem(item, response);
      setReviewItems((prev) =>
        prev.map((i) => (i.id === response.itemId ? updatedItem : i)),
      );

      // Update current session
      const isCorrect = response.quality >= 3;
      setCurrentSession((prev) => {
        if (!prev) return null;

        const newItemsReviewed = [...prev.itemsReviewed, response.itemId];
        const newCorrectAnswers = prev.correctAnswers + (isCorrect ? 1 : 0);
        const newAvgResponseTime =
          (prev.averageResponseTime * prev.itemsReviewed.length +
            response.responseTime) /
          newItemsReviewed.length;

        return {
          ...prev,
          itemsReviewed: newItemsReviewed,
          correctAnswers: newCorrectAnswers,
          averageResponseTime: newAvgResponseTime,
          xpEarned: prev.xpEarned + (isCorrect ? 25 : 10), // XP rewards
        };
      });
    },
    [currentSession, reviewItems],
  );

  // End review session
  const endReviewSession = useCallback(() => {
    if (!currentSession) return;

    // Update user performance
    const sessionAccuracy =
      currentSession.correctAnswers /
      Math.max(currentSession.itemsReviewed.length, 1);
    const sessionDuration =
      (new Date().getTime() - currentSession.startTime.getTime()) / (1000 * 60); // minutes

    setUserPerformance((prev) => ({
      ...prev,
      averageAccuracy: prev.averageAccuracy * 0.9 + sessionAccuracy * 100 * 0.1,
      averageSessionTime: prev.averageSessionTime * 0.9 + sessionDuration * 0.1,
      totalSessions: prev.totalSessions + 1,
      lastStudyDate: new Date(),
    }));

    setCurrentSession(null);
  }, [currentSession]);

  // Get items due for review
  const getItemsDue = useCallback(
    (maxItems: number = 20) => {
      return getItemsDueForReview(reviewItems, new Date(), maxItems);
    },
    [reviewItems],
  );

  // Check if review is due
  const isReviewDue = useCallback(
    (itemId: string) => {
      const item = reviewItems.find((i) => i.id === itemId);
      return item ? item.nextReviewDate <= new Date() : false;
    },
    [reviewItems],
  );

  // Get item by ID
  const getItemById = useCallback(
    (itemId: string) => {
      return reviewItems.find((item) => item.id === itemId);
    },
    [reviewItems],
  );

  // Search items
  const searchItems = useCallback(
    (query: string) => {
      const lowercaseQuery = query.toLowerCase();
      return reviewItems.filter(
        (item) =>
          item.title.toLowerCase().includes(lowercaseQuery) ||
          item.description.toLowerCase().includes(lowercaseQuery) ||
          item.tags.some((tag) => tag.toLowerCase().includes(lowercaseQuery)),
      );
    },
    [reviewItems],
  );

  // Save progress to localStorage
  const saveProgress = useCallback(() => {
    try {
      const data = {
        reviewItems,
        userPerformance,
        lastSaved: new Date().toISOString(),
      };
      localStorage.setItem("spacedRepetition", JSON.stringify(data));
    } catch (error) {
      console.error("Failed to save spaced repetition progress:", error);
    }
  }, [reviewItems, userPerformance]);

  // Load progress from localStorage
  const loadProgress = useCallback(() => {
    try {
      const saved = localStorage.getItem("spacedRepetition");
      if (saved) {
        const data = JSON.parse(saved);
        if (data.reviewItems) {
          // Convert date strings back to Date objects
          const items = data.reviewItems.map((item: any) => ({
            ...item,
            nextReviewDate: new Date(item.nextReviewDate),
            lastReviewDate: item.lastReviewDate
              ? new Date(item.lastReviewDate)
              : undefined,
            createdAt: new Date(item.createdAt),
            lastModified: new Date(item.lastModified),
          }));
          setReviewItems(items);
        }
        if (data.userPerformance) {
          setUserPerformance({
            ...data.userPerformance,
            lastStudyDate: data.userPerformance.lastStudyDate
              ? new Date(data.userPerformance.lastStudyDate)
              : undefined,
          });
        }
      }
    } catch (error) {
      console.error("Failed to load spaced repetition progress:", error);
    }
  }, []);

  // Auto-save progress
  useEffect(() => {
    const interval = setInterval(saveProgress, 30000); // Save every 30 seconds
    return () => clearInterval(interval);
  }, [saveProgress]);

  // Load progress on mount
  useEffect(() => {
    loadProgress();
  }, [loadProgress]);

  const contextValue: SpacedRepetitionContextType = {
    reviewItems,
    addReviewItem,
    updateReviewItemData,
    removeReviewItem,
    currentSession,
    startReviewSession,
    submitReviewResponse,
    endReviewSession,
    itemsDueToday,
    itemsOverdue,
    getItemsDue,
    reviewStats,
    userPerformance,
    recommendedSessionSize,
    weakAreas,
    saveProgress,
    loadProgress,
    isReviewDue,
    getItemById,
    searchItems,
  };

  return (
    <SpacedRepetitionContext.Provider value={contextValue}>
      {children}
    </SpacedRepetitionContext.Provider>
  );
}

export function useSpacedRepetition() {
  const context = useContext(SpacedRepetitionContext);
  if (context === undefined) {
    throw new Error(
      "useSpacedRepetition must be used within a SpacedRepetitionProvider",
    );
  }
  return context;
}
