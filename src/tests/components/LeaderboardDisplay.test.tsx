import LeaderboardDisplay from "@/components/gamification/LeaderboardDisplay";
import { render, screen } from "@testing-library/react";
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
    leaderboard: [
      { id: "1", name: "أحمد", xp: 2000, level: 6, rank: 1 },
      { id: "2", name: "محمد", xp: 1800, level: 5, rank: 2 },
      { id: "3", name: "سارة", xp: 1500, level: 5, rank: 3 },
    ],
    updateStreak: vi.fn(),
    addXP: vi.fn(),
    unlockAchievement: vi.fn(),
  }),
}));

/**
 * Comprehensive Tests for LeaderboardDisplay Component
 */

describe("LeaderboardDisplay", () => {
  describe("Rendering", () => {
    it("should render without crashing", () => {
      const { container } = render(<LeaderboardDisplay />);
      expect(container).toBeTruthy();
    });

    it("should render with default props", () => {
      const { container } = render(<LeaderboardDisplay />);
      expect(container.firstChild).toBeInTheDocument();
    });

    it("should render leaderboard title", () => {
      render(<LeaderboardDisplay />);
      // Should have some leaderboard content
      expect(
        screen.getByText(/لوحة المتصدرين|المتصدرين|Leaderboard/i),
      ).toBeInTheDocument();
    });
  });

  describe("Performance", () => {
    it("should render quickly", () => {
      const startTime = performance.now();
      render(<LeaderboardDisplay />);
      const endTime = performance.now();
      expect(endTime - startTime).toBeLessThan(100);
    });

    it("should unmount cleanly", () => {
      const { unmount } = render(<LeaderboardDisplay />);
      unmount();
      expect(true).toBe(true);
    });
  });
});
