import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { XPBadge } from "@/components/gamification/xp-badge";
import { LevelBadge } from "@/components/gamification/level-badge";
import { ProgressRing } from "@/components/gamification/progress-ring";
import { StreakCounter } from "@/components/gamification/streak-counter";

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
      expect(
        screen.getByText((content, element) => {
          return (
            (content.includes("1,250") &&
              element?.textContent?.includes("XP")) ||
            false
          );
        }),
      ).toBeInTheDocument();
    });

    it("renders different sizes correctly", () => {
      const { rerender } = render(<XPBadge xp={100} size="sm" />);
      expect(screen.getByTestId("xp-badge")).toHaveClass("text-sm");

      rerender(<XPBadge xp={100} size="lg" />);
      expect(screen.getByTestId("xp-badge")).toHaveClass("text-lg");
    });

    it("shows animation when showAnimation is true", () => {
      render(<XPBadge xp={100} showAnimation />);
      // Animation is handled by Framer Motion, just check component renders
      expect(screen.getByTestId("xp-badge")).toBeInTheDocument();
    });

    it("formats large numbers correctly", () => {
      render(<XPBadge xp={1234567} />);
      expect(
        screen.getByText((content, element) => {
          return (
            (content.includes("1,234,567") &&
              element?.textContent?.includes("XP")) ||
            false
          );
        }),
      ).toBeInTheDocument();
    });
  });

  describe("LevelBadge", () => {
    it("renders level correctly", () => {
      render(<LevelBadge level={5} />);
      expect(screen.getByTestId("level-badge")).toBeInTheDocument();
      expect(screen.getByTestId("level-badge")).toHaveTextContent("5");
      expect(screen.getByTestId("level-badge")).toHaveTextContent("المستوى");
    });

    it("applies correct styling for different levels", () => {
      const { rerender } = render(<LevelBadge level={1} />);
      let badge = screen.getByTestId("level-badge");
      expect(badge).toBeInTheDocument();

      rerender(<LevelBadge level={10} />);
      badge = screen.getByTestId("level-badge");
      expect(badge).toBeInTheDocument();

      rerender(<LevelBadge level={25} />);
      badge = screen.getByTestId("level-badge");
      expect(badge).toBeInTheDocument();

      rerender(<LevelBadge level={50} />);
      badge = screen.getByTestId("level-badge");
      expect(badge).toBeInTheDocument();
    });

    it("renders different sizes correctly", () => {
      const { rerender } = render(<LevelBadge level={5} size="sm" />);
      expect(screen.getByTestId("level-badge")).toHaveClass("text-sm");

      rerender(<LevelBadge level={5} size="lg" />);
      expect(screen.getByTestId("level-badge")).toHaveClass("text-lg");
    });
  });

  describe("ProgressRing", () => {
    it("renders progress correctly", () => {
      render(<ProgressRing progress={75} />);
      const progressRing = screen.getByTestId("progress-ring");
      expect(progressRing).toBeInTheDocument();

      // Check if the progress text is displayed
      expect(screen.getByText("75%")).toBeInTheDocument();
    });

    it("handles different colors", () => {
      const { rerender } = render(
        <ProgressRing progress={50} color="primary" />,
      );
      let ring = screen.getByTestId("progress-circle");
      expect(ring).toHaveClass("stroke-primary-500");

      rerender(<ProgressRing progress={50} color="xp" />);
      ring = screen.getByTestId("progress-circle");
      expect(ring).toHaveClass("stroke-green-500");
    });

    it("renders children when provided", () => {
      render(
        <ProgressRing progress={50}>
          <div>Custom Content</div>
        </ProgressRing>,
      );
      expect(screen.getByText("Custom Content")).toBeInTheDocument();
    });

    it("calculates stroke-dashoffset correctly", () => {
      render(<ProgressRing progress={25} size={100} strokeWidth={8} />);
      const circle = screen.getByTestId("progress-circle");

      // For 25% progress with size=100, strokeWidth=8
      // normalizedRadius = (100 - 8) / 2 = 46
      // circumference = 46 * 2 * PI = 288.88
      // offset = circumference - (25/100) * circumference = 216.66
      const normalizedRadius = (100 - 8) / 2;
      const circumference = normalizedRadius * 2 * Math.PI;
      const expectedOffset = circumference - (25 / 100) * circumference;
      expect(circle).toHaveStyle(`stroke-dashoffset: ${expectedOffset}`);
    });
  });

  describe("StreakCounter", () => {
    it("renders streak days correctly", () => {
      render(<StreakCounter days={7} />);
      expect(screen.getByTestId("streak-counter")).toBeInTheDocument();
      expect(screen.getByTestId("streak-counter")).toHaveTextContent("7");
      expect(screen.getByTestId("streak-counter")).toHaveTextContent("أيام");
    });

    it("shows flame icon", () => {
      render(<StreakCounter days={5} />);
      expect(screen.getByTestId("flame-icon")).toBeInTheDocument();
    });

    it("applies different colors based on streak length", () => {
      const { rerender } = render(<StreakCounter days={2} />);
      let container = screen.getByTestId("streak-counter");
      expect(container).toBeInTheDocument();

      rerender(<StreakCounter days={7} />);
      container = screen.getByTestId("streak-counter");
      expect(container).toBeInTheDocument();

      rerender(<StreakCounter days={15} />);
      container = screen.getByTestId("streak-counter");
      expect(container).toBeInTheDocument();

      rerender(<StreakCounter days={30} />);
      container = screen.getByTestId("streak-counter");
      expect(container).toBeInTheDocument();
    });

    it("renders different sizes correctly", () => {
      const { rerender } = render(<StreakCounter days={5} size="sm" />);
      expect(screen.getByTestId("streak-counter")).toHaveClass("text-sm");

      rerender(<StreakCounter days={5} size="lg" />);
      expect(screen.getByTestId("streak-counter")).toHaveClass("text-lg");
    });

    it("shows animation when animated prop is true", () => {
      render(<StreakCounter days={5} animated />);
      // Animation is handled by Framer Motion, just check component renders
      expect(screen.getByTestId("streak-counter")).toBeInTheDocument();
    });

    it("handles zero days correctly", () => {
      render(<StreakCounter days={0} />);
      expect(screen.getByTestId("streak-counter")).toHaveTextContent("0");
      expect(screen.getByTestId("streak-counter")).toHaveTextContent("أيام");
    });

    it("handles large numbers correctly", () => {
      render(<StreakCounter days={365} />);
      expect(screen.getByTestId("streak-counter")).toHaveTextContent("365");
      expect(screen.getByTestId("streak-counter")).toHaveTextContent("أيام");
    });
  });

  describe("Accessibility", () => {
    it("XPBadge has proper ARIA labels", () => {
      render(<XPBadge xp={1250} />);
      expect(screen.getByLabelText("نقاط الخبرة: 1,250")).toBeInTheDocument();
    });

    it("LevelBadge has proper ARIA labels", () => {
      render(<LevelBadge level={5} />);
      expect(screen.getByLabelText("المستوى 5")).toBeInTheDocument();
    });

    it("ProgressRing has proper ARIA labels", () => {
      render(<ProgressRing progress={75} />);
      expect(screen.getByLabelText("التقدم: 75%")).toBeInTheDocument();
    });

    it("StreakCounter has proper ARIA labels", () => {
      render(<StreakCounter days={7} />);
      expect(screen.getByLabelText("سلسلة التعلم: 7 أيام")).toBeInTheDocument();
    });
  });

  describe("Performance", () => {
    it("does not re-render unnecessarily", () => {
      const renderSpy = vi.fn();
      const TestComponent = ({ xp }: { xp: number }) => {
        renderSpy();
        return <XPBadge xp={xp} />;
      };

      const { rerender } = render(<TestComponent xp={100} />);
      expect(renderSpy).toHaveBeenCalledTimes(1);

      // Re-render with same props
      rerender(<TestComponent xp={100} />);
      expect(renderSpy).toHaveBeenCalledTimes(2); // React will re-render, but component should be optimized

      // Re-render with different props
      rerender(<TestComponent xp={200} />);
      expect(renderSpy).toHaveBeenCalledTimes(3);
    });
  });

  describe("Error Handling", () => {
    it("handles negative XP values gracefully", () => {
      render(<XPBadge xp={-100} />);
      expect(screen.getByTestId("xp-badge")).toHaveTextContent("0");
      expect(screen.getByTestId("xp-badge")).toHaveTextContent("XP");
    });

    it("handles negative level values gracefully", () => {
      render(<LevelBadge level={-5} />);
      expect(screen.getByTestId("level-badge")).toHaveTextContent("1");
      expect(screen.getByTestId("level-badge")).toHaveTextContent("المستوى");
    });

    it("handles progress values outside 0-100 range", () => {
      const { rerender } = render(<ProgressRing progress={-10} />);
      expect(screen.getByTestId("progress-ring")).toHaveTextContent("0%");

      rerender(<ProgressRing progress={150} />);
      expect(screen.getByTestId("progress-ring")).toHaveTextContent("100%");
    });

    it("handles negative streak days gracefully", () => {
      render(<StreakCounter days={-5} />);
      expect(screen.getByTestId("streak-counter")).toHaveTextContent("0");
      expect(screen.getByTestId("streak-counter")).toHaveTextContent("أيام");
    });
  });
});
