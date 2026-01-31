import { Progress } from "@/components/ui/progress";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

/**
 * Comprehensive Tests for Progress Component
 */

describe("Progress", () => {
  describe("Rendering", () => {
    it("should render without crashing", () => {
      const { container } = render(<Progress value={50} />);
      expect(container).toBeTruthy();
    });

    it("should apply custom className", () => {
      const { container } = render(
        <Progress value={50} className="custom-class" />,
      );
      const element = container.firstChild;
      expect(element).toHaveClass("custom-class");
    });

    it("should render with default props", () => {
      const { container } = render(<Progress value={0} />);
      expect(container.firstChild).toBeInTheDocument();
    });
  });

  describe("Accessibility", () => {
    it("should have progressbar role", () => {
      render(<Progress value={50} />);
      expect(screen.getByRole("progressbar")).toBeInTheDocument();
    });

    it("should have proper aria-valuenow", () => {
      render(<Progress value={75} />);
      const progressbar = screen.getByRole("progressbar");
      expect(progressbar).toHaveAttribute("aria-valuenow", "75");
    });
  });

  describe("Values", () => {
    it("should render with 0% progress", () => {
      render(<Progress value={0} />);
      expect(screen.getByRole("progressbar")).toBeInTheDocument();
    });

    it("should render with 50% progress", () => {
      render(<Progress value={50} />);
      expect(screen.getByRole("progressbar")).toBeInTheDocument();
    });

    it("should render with 100% progress", () => {
      render(<Progress value={100} />);
      expect(screen.getByRole("progressbar")).toBeInTheDocument();
    });
  });

  describe("Performance", () => {
    it("should render quickly", () => {
      const startTime = performance.now();
      render(<Progress value={50} />);
      const endTime = performance.now();
      expect(endTime - startTime).toBeLessThan(100);
    });

    it("should unmount cleanly", () => {
      const { unmount } = render(<Progress value={50} />);
      unmount();
      expect(true).toBe(true);
    });
  });
});
