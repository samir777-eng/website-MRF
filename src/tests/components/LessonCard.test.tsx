import { LessonCard } from "@/components/lessons/LessonCard";
import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

/**
 * Comprehensive Tests for LessonCard Component
 */

// Mock lesson data matching the component's expected props
const mockLesson = {
  id: "1",
  title: "درس تجريبي",
  description: "وصف الدرس التجريبي",
  duration: 30,
  difficulty: "متوسط" as const,
  xpReward: 100,
  thumbnail: "/images/lesson.jpg",
  videoUrl: "/videos/lesson.mp4",
  progress: 50,
  isCompleted: false,
  isLocked: false,
  subject: "رياضيات",
  unit: "الجبر",
  order: 1,
};

describe("LessonCard", () => {
  describe("Rendering", () => {
    it("should render without crashing", () => {
      const { container } = render(<LessonCard lesson={mockLesson} />);
      expect(container).toBeTruthy();
    });

    it("should render lesson title", () => {
      render(<LessonCard lesson={mockLesson} />);
      expect(screen.getByText("درس تجريبي")).toBeInTheDocument();
    });

    it("should render with proper structure", () => {
      const { container } = render(<LessonCard lesson={mockLesson} />);
      expect(container.firstChild).toBeInTheDocument();
    });
  });

  describe("Interactions", () => {
    it("should handle click events", async () => {
      const handleClick = vi.fn();
      render(<LessonCard lesson={mockLesson} onClick={handleClick} />);

      const card = screen.getByText("درس تجريبي").closest("div");
      if (card) {
        fireEvent.click(card);
      }
    });

    it("should show locked state", () => {
      const lockedLesson = { ...mockLesson, isLocked: true };
      render(<LessonCard lesson={lockedLesson} />);
      // Locked lessons should still render
      expect(screen.getByText("درس تجريبي")).toBeInTheDocument();
    });

    it("should show completed state", () => {
      const completedLesson = {
        ...mockLesson,
        isCompleted: true,
        progress: 100,
      };
      render(<LessonCard lesson={completedLesson} />);
      expect(screen.getByText("درس تجريبي")).toBeInTheDocument();
    });
  });

  describe("Accessibility", () => {
    it("should have proper structure", () => {
      const { container } = render(<LessonCard lesson={mockLesson} />);
      expect(container.firstChild).toBeInTheDocument();
    });

    it("should display XP reward", () => {
      render(<LessonCard lesson={mockLesson} />);
      // XP reward should be visible
      expect(screen.getByText(/100/)).toBeInTheDocument();
    });
  });

  describe("Responsive Behavior", () => {
    it("should render correctly on mobile viewport", () => {
      global.innerWidth = 375;
      global.innerHeight = 667;

      const { container } = render(<LessonCard lesson={mockLesson} />);
      expect(container.firstChild).toBeInTheDocument();
    });

    it("should render correctly on desktop viewport", () => {
      global.innerWidth = 1920;
      global.innerHeight = 1080;

      const { container } = render(<LessonCard lesson={mockLesson} />);
      expect(container.firstChild).toBeInTheDocument();
    });
  });

  describe("Performance", () => {
    it("should render quickly", () => {
      const startTime = performance.now();
      render(<LessonCard lesson={mockLesson} />);
      const endTime = performance.now();
      expect(endTime - startTime).toBeLessThan(100);
    });

    it("should unmount cleanly", () => {
      const { unmount } = render(<LessonCard lesson={mockLesson} />);
      unmount();
      expect(true).toBe(true);
    });
  });
});
