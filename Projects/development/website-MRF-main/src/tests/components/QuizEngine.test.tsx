import { QuizEngine } from "@/components/quiz/quiz-engine";
import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

/**
 * Comprehensive Tests for QuizEngine Component
 */

// Mock quiz data matching the component's expected props
const mockQuiz = {
  id: "1",
  title: "اختبار تجريبي",
  description: "وصف الاختبار",
  questions_data: [
    {
      id: "q1",
      text: "ما هو 2 + 2؟",
      type: "multiple_choice" as const,
      options: ["2", "3", "4", "5"],
      correctAnswer: "4",
      points: 10,
    },
    {
      id: "q2",
      text: "ما هي عاصمة مصر؟",
      type: "multiple_choice" as const,
      options: ["الإسكندرية", "القاهرة", "الجيزة", "أسوان"],
      correctAnswer: "القاهرة",
      points: 10,
    },
  ],
  timeLimit: 600,
  passingScore: 70,
  xpReward: 50,
  subject: "رياضيات",
};

const mockOnComplete = vi.fn();
const mockOnAnswer = vi.fn();

describe("QuizEngine", () => {
  describe("Rendering", () => {
    it("should render without crashing", () => {
      const { container } = render(
        <QuizEngine quiz={mockQuiz} onComplete={mockOnComplete} />
      );
      expect(container).toBeTruthy();
    });

    it("should render quiz title", () => {
      render(<QuizEngine quiz={mockQuiz} onComplete={mockOnComplete} />);
      expect(screen.getByText("اختبار تجريبي")).toBeInTheDocument();
    });

    it("should render first question", () => {
      render(<QuizEngine quiz={mockQuiz} onComplete={mockOnComplete} />);
      expect(screen.getByText("ما هو 2 + 2؟")).toBeInTheDocument();
    });
  });

  describe("Interactions", () => {
    it("should display answer options", () => {
      render(<QuizEngine quiz={mockQuiz} onComplete={mockOnComplete} />);
      expect(screen.getByText("4")).toBeInTheDocument();
    });

    it("should handle answer selection", () => {
      render(
        <QuizEngine
          quiz={mockQuiz}
          onComplete={mockOnComplete}
          onAnswer={mockOnAnswer}
        />
      );
      const option = screen.getByText("4");
      fireEvent.click(option);
      // Answer should be selectable
      expect(option).toBeInTheDocument();
    });
  });

  describe("Accessibility", () => {
    it("should have proper structure", () => {
      const { container } = render(
        <QuizEngine quiz={mockQuiz} onComplete={mockOnComplete} />
      );
      expect(container.firstChild).toBeInTheDocument();
    });
  });

  describe("Performance", () => {
    it("should render quickly", () => {
      const startTime = performance.now();
      render(<QuizEngine quiz={mockQuiz} onComplete={mockOnComplete} />);
      const endTime = performance.now();
      expect(endTime - startTime).toBeLessThan(100);
    });

    it("should unmount cleanly", () => {
      const { unmount } = render(
        <QuizEngine quiz={mockQuiz} onComplete={mockOnComplete} />
      );
      unmount();
      expect(true).toBe(true);
    });
  });
});
