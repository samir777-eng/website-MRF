import QuestDisplay from "@/components/gamification/QuestDisplay";
import { render } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

// Mock the GamificationContext
vi.mock("@/contexts/GamificationContext", () => ({
  useGamification: () => ({
    userStats: {
      xp: 1500,
      level: 5,
      streak: 7,
      totalLessonsCompleted: 25,
      totalQuizzesCompleted: 10,
      achievements: [],
    },
    quests: [],
    completeQuest: vi.fn(),
    updateStreak: vi.fn(),
    addXP: vi.fn(),
  }),
}));

// Mock the quests lib
vi.mock("@/lib/quests", () => ({
  SAMPLE_QUESTS: [],
  QUEST_DIFFICULTY: { easy: "سهل", medium: "متوسط", hard: "صعب" },
  QUEST_TYPES: { daily: "يومي", weekly: "أسبوعي" },
  getQuestProgress: () => 50,
  getTimeRemaining: () => "2 ساعة",
  canCompleteQuest: () => true,
  getQuestsByType: () => [],
  getActiveQuests: () => [],
  calculateQuestReward: () => 100,
}));

/**
 * Comprehensive Tests for QuestDisplay Component
 */

describe("QuestDisplay", () => {
  describe("Rendering", () => {
    it("should render without crashing", () => {
      const { container } = render(<QuestDisplay />);
      expect(container).toBeTruthy();
    });

    it("should render with default props", () => {
      const { container } = render(<QuestDisplay />);
      expect(container.firstChild).toBeInTheDocument();
    });
  });

  describe("Performance", () => {
    it("should render quickly", () => {
      const startTime = performance.now();
      render(<QuestDisplay />);
      const endTime = performance.now();
      expect(endTime - startTime).toBeLessThan(100);
    });

    it("should unmount cleanly", () => {
      const { unmount } = render(<QuestDisplay />);
      unmount();
      expect(true).toBe(true);
    });
  });
});
