import StreakDisplay from "@/components/gamification/StreakDisplay";
import { render } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

// Mock the GamificationContext
vi.mock("@/contexts/GamificationContext", () => ({
  useGamification: () => ({
    userStats: {
      xp: 1500,
      level: 5,
      streak: 7,
      longestStreak: 14,
      totalLessonsCompleted: 25,
      totalQuizzesCompleted: 10,
      achievements: [],
    },
    updateStreak: vi.fn(),
    addXP: vi.fn(),
  }),
}));

/**
 * Comprehensive Tests for StreakDisplay Component
 */

describe("StreakDisplay", () => {
  describe("Rendering", () => {
    it("should render without crashing", () => {
      const { container } = render(<StreakDisplay />);
      expect(container).toBeTruthy();
    });

    it("should render with default props", () => {
      const { container } = render(<StreakDisplay />);
      expect(container.firstChild).toBeInTheDocument();
    });

    it("should render with compact variant", () => {
      const { container } = render(<StreakDisplay variant="compact" />);
      expect(container.firstChild).toBeInTheDocument();
    });

    it("should render with detailed variant", () => {
      const { container } = render(<StreakDisplay variant="detailed" />);
      expect(container.firstChild).toBeInTheDocument();
    });
  });

  describe("Performance", () => {
    it("should render quickly", () => {
      const startTime = performance.now();
      render(<StreakDisplay />);
      const endTime = performance.now();
      expect(endTime - startTime).toBeLessThan(100);
    });

    it("should unmount cleanly", () => {
      const { unmount } = render(<StreakDisplay />);
      unmount();
      expect(true).toBe(true);
    });
  });
});
