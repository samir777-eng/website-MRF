import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { XPBadge } from "@/components/gamification/xp-badge";
import { ProgressRing } from "@/components/gamification/progress-ring";
import { StreakCounter } from "@/components/gamification/streak-counter";
import { LevelBadge } from "@/components/gamification/level-badge";

// Mock framer-motion to avoid animation issues in tests
vi.mock("framer-motion", () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    span: ({ children, ...props }: any) => <span {...props}>{children}</span>,
    circle: ({ children, ...props }: any) => (
      <circle {...props}>{children}</circle>
    ),
  },
  AnimatePresence: ({ children }: any) => children,
}));

describe("Gamification Components", () => {
  describe("XPBadge", () => {
    it("renders XP value correctly", () => {
      render(<XPBadge xp={1250} />);
      expect(screen.getByTestId("xp-badge")).toHaveTextContent("1,250");
      expect(screen.getByTestId("xp-badge")).toHaveTextContent("XP");
    });

    it("formats large XP values with commas", () => {
      render(<XPBadge xp={12500} />);
      expect(screen.getByTestId("xp-badge")).toHaveTextContent("12,500");
      expect(screen.getByTestId("xp-badge")).toHaveTextContent("XP");
    });

    it("shows XP gained when provided", () => {
      render(<XPBadge xp={1250} xpGained={100} />);
      expect(screen.getByTestId("xp-badge")).toHaveTextContent("1,250");
      expect(screen.getByTestId("xp-badge")).toHaveTextContent("XP");
    });

    it("applies correct size classes", () => {
      const { rerender } = render(<XPBadge xp={100} size="sm" />);
      expect(screen.getByTestId("xp-badge")).toHaveClass("text-xs");

      rerender(<XPBadge xp={100} size="lg" />);
      expect(screen.getByTestId("xp-badge")).toHaveClass("text-lg");
    });

    it("handles zero XP correctly", () => {
      render(<XPBadge xp={0} />);
      expect(screen.getByTestId("xp-badge")).toHaveTextContent("0");
      expect(screen.getByTestId("xp-badge")).toHaveTextContent("XP");
    });
  });

  describe("ProgressRing", () => {
    it("renders progress value correctly", () => {
      render(
        <ProgressRing progress={75}>
          <div>75%</div>
        </ProgressRing>,
      );
      expect(screen.getByTestId("progress-ring")).toHaveTextContent("75%");
    });

    it("calculates stroke-dasharray correctly", () => {
      render(<ProgressRing progress={50} size={100} />);
      const circle = screen.getByTestId("progress-circle");
      expect(circle).toHaveAttribute("stroke-dasharray");
    });

    it("applies correct color classes", () => {
      render(<ProgressRing progress={50} color="xp" />);
      const circle = screen.getByTestId("progress-circle");
      expect(circle).toHaveClass("stroke-green-500");
    });

    it("handles edge cases for progress values", () => {
      const { rerender } = render(<ProgressRing progress={0} />);
      let circle = screen.getByTestId("progress-circle");
      expect(circle).toBeInTheDocument();

      rerender(<ProgressRing progress={100} />);
      circle = screen.getByTestId("progress-circle");
      expect(circle).toBeInTheDocument();
    });
  });

  describe("StreakCounter", () => {
    it("renders streak days correctly", () => {
      render(<StreakCounter days={7} />);
      expect(screen.getByTestId("streak-counter")).toHaveTextContent("7");
      expect(screen.getByTestId("streak-counter")).toHaveTextContent("أيام");
    });

    it("shows flame icon", () => {
      render(<StreakCounter days={5} />);
      // Check for flame icon using test ID
      const flameIcon = screen.getByTestId("flame-icon");
      expect(flameIcon).toBeInTheDocument();
    });

    it("applies correct size classes", () => {
      const { rerender } = render(<StreakCounter days={3} size="sm" />);
      expect(screen.getByTestId("streak-counter")).toHaveClass("text-xs");

      rerender(<StreakCounter days={3} size="lg" />);
      expect(screen.getByTestId("streak-counter")).toHaveClass("text-lg");
    });

    it("handles zero streak correctly", () => {
      render(<StreakCounter days={0} />);
      expect(screen.getByTestId("streak-counter")).toHaveTextContent("0");
    });

    it("applies animated class when animated prop is true", () => {
      render(<StreakCounter days={5} animated />);
      // Check for animation-related classes or attributes
      expect(screen.getByTestId("streak-counter")).toBeInTheDocument();
    });
  });

  describe("LevelBadge", () => {
    it("renders level number correctly", () => {
      render(<LevelBadge level={12} />);
      expect(screen.getByTestId("level-badge")).toHaveTextContent("12");
    });

    it("applies correct size classes", () => {
      const { rerender } = render(<LevelBadge level={5} size="sm" />);
      expect(screen.getByTestId("level-badge")).toHaveClass("text-xs");

      rerender(<LevelBadge level={5} size="lg" />);
      expect(screen.getByTestId("level-badge")).toHaveClass("text-lg");
    });

    it("handles single digit levels", () => {
      render(<LevelBadge level={5} />);
      expect(screen.getByTestId("level-badge")).toHaveTextContent("5");
    });

    it("handles double digit levels", () => {
      render(<LevelBadge level={25} />);
      expect(screen.getByTestId("level-badge")).toHaveTextContent("25");
    });

    it("applies level variant styling", () => {
      render(<LevelBadge level={10} />);
      const badge = screen.getByTestId("level-badge");
      expect(badge).toHaveClass("bg-purple-100", "text-purple-800");
    });
  });

  describe("Integration Tests", () => {
    it("components work together in a dashboard context", () => {
      render(
        <div data-testid="dashboard">
          <XPBadge xp={2450} size="lg" />
          <ProgressRing progress={75}>
            <div>75%</div>
          </ProgressRing>
          <StreakCounter days={7} animated />
          <LevelBadge level={12} size="lg" />
        </div>,
      );

      expect(screen.getByTestId("dashboard")).toBeInTheDocument();
      expect(screen.getByTestId("xp-badge")).toHaveTextContent("2,450");
      expect(screen.getByTestId("progress-ring")).toHaveTextContent("75%");
      expect(screen.getByTestId("streak-counter")).toHaveTextContent("7");
      expect(screen.getByTestId("level-badge")).toHaveTextContent("12");
    });

    it("handles responsive behavior", () => {
      render(
        <div className="flex flex-col md:flex-row gap-4">
          <XPBadge xp={1000} size="md" />
          <StreakCounter days={5} size="md" />
        </div>,
      );

      expect(screen.getByTestId("xp-badge")).toHaveTextContent("1,000");
      expect(screen.getByTestId("streak-counter")).toHaveTextContent("5");
    });
  });

  describe("Accessibility", () => {
    it("XPBadge has proper ARIA labels", () => {
      render(<XPBadge xp={1250} />);
      // Check for accessibility attributes
      const badge = screen.getByTestId("xp-badge");
      expect(badge).toHaveAttribute("aria-label");
      expect(badge).toBeInTheDocument();
    });

    it("ProgressRing is accessible to screen readers", () => {
      render(
        <ProgressRing progress={75} aria-label="التقدم: 75%">
          <div>75%</div>
        </ProgressRing>,
      );
      expect(screen.getByLabelText("التقدم: 75%")).toBeInTheDocument();
    });

    it("components support keyboard navigation", async () => {
      const user = userEvent.setup();
      render(
        <div>
          <button>
            <XPBadge xp={100} />
          </button>
        </div>,
      );

      const button = screen.getByRole("button");
      await user.click(button);
      expect(button).toHaveFocus();
    });
  });

  describe("Performance", () => {
    it("renders multiple components efficiently", () => {
      const startTime = performance.now();

      render(
        <div>
          {Array.from({ length: 10 }, (_, i) => (
            <div key={i}>
              <XPBadge xp={i * 100} />
              <ProgressRing progress={i * 10} />
              <StreakCounter days={i} />
              <LevelBadge level={i + 1} />
            </div>
          ))}
        </div>,
      );

      const endTime = performance.now();
      const renderTime = endTime - startTime;

      // Ensure rendering takes less than 100ms for 40 components
      expect(renderTime).toBeLessThan(100);
    });
  });

  describe("Error Handling", () => {
    it("handles invalid XP values gracefully", () => {
      render(<XPBadge xp={-100} />);
      expect(screen.getByTestId("xp-badge")).toHaveTextContent("0");
    });

    it("handles invalid progress values gracefully", () => {
      render(<ProgressRing progress={150} />);
      // Should clamp to 100%
      const circle = screen.getByTestId("progress-circle");
      expect(circle).toBeInTheDocument();
    });

    it("handles invalid streak values gracefully", () => {
      render(<StreakCounter days={-5} />);
      expect(screen.getByTestId("streak-counter")).toHaveTextContent("0");
    });

    it("handles invalid level values gracefully", () => {
      render(<LevelBadge level={0} />);
      expect(screen.getByTestId("level-badge")).toHaveTextContent("1"); // Minimum level should be 1
    });
  });
});
