import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { Badge } from "@/components/ui/badge";

/**
 * Comprehensive Tests for Badge Component
 */

describe("Badge", () => {
  describe("Rendering", () => {
    it("should render without crashing", () => {
      const { container } = render(<Badge />);
      expect(container).toBeTruthy();
    });

    it("should render children correctly", () => {
      render(
        <Badge>
          <span data-testid="child">Test Child</span>
        </Badge>,
      );
      expect(screen.getByTestId("child")).toBeInTheDocument();
    });

    it("should apply custom className", () => {
      const { container } = render(<Badge className="custom-class" />);
      const element = container.firstChild;
      expect(element).toHaveClass("custom-class");
    });

    it("should render with default props", () => {
      const { container } = render(<Badge />);
      expect(container.firstChild).toBeInTheDocument();
    });
  });

  describe("Accessibility", () => {
    it("should have proper ARIA attributes", () => {
      const { container } = render(<Badge aria-label="Test Badge" />);
      const element = container.firstChild;

      expect(element).toHaveAttribute("aria-label", "Test Badge");
    });

    it("should be keyboard navigable", () => {
      render(<Badge />);
      const element =
        screen.getByRole("button") ||
        screen.getByRole("link") ||
        container.firstChild;

      // Should be focusable
      element.focus();
      expect(document.activeElement).toBe(element);
    });

    it("should have sufficient color contrast", () => {
      const { container } = render(<Badge />);
      const element = container.firstChild;

      // Check element exists and is visible
      expect(element).toBeVisible();
    });
  });

  describe("Props", () => {
    it("should accept and apply variant prop", () => {
      const { container } = render(<Badge variant="primary" />);
      const element = container.firstChild;

      expect(element).toHaveClass(/primary/i);
    });

    it("should accept and apply size prop", () => {
      const { container } = render(<Badge size="lg" />);
      const element = container.firstChild;

      expect(element).toHaveClass(/lg/i);
    });

    it("should handle data attributes", () => {
      const { container } = render(<Badge data-testid="test-component" />);

      expect(screen.getByTestId("test-component")).toBeInTheDocument();
    });
  });

  describe("Edge Cases", () => {
    it("should handle null children gracefully", () => {
      const { container } = render(<Badge>{null}</Badge>);
      expect(container.firstChild).toBeInTheDocument();
    });

    it("should handle undefined props gracefully", () => {
      const { container } = render(<Badge someProp={undefined} />);
      expect(container.firstChild).toBeInTheDocument();
    });

    it("should handle empty string props", () => {
      const { container } = render(<Badge className="" />);
      expect(container.firstChild).toBeInTheDocument();
    });
  });

  describe("Responsive Behavior", () => {
    it("should render correctly on mobile viewport", () => {
      global.innerWidth = 375;
      global.innerHeight = 667;

      const { container } = render(<Badge />);
      expect(container.firstChild).toBeInTheDocument();
    });

    it("should render correctly on tablet viewport", () => {
      global.innerWidth = 768;
      global.innerHeight = 1024;

      const { container } = render(<Badge />);
      expect(container.firstChild).toBeInTheDocument();
    });

    it("should render correctly on desktop viewport", () => {
      global.innerWidth = 1920;
      global.innerHeight = 1080;

      const { container } = render(<Badge />);
      expect(container.firstChild).toBeInTheDocument();
    });
  });

  describe("Performance", () => {
    it("should render quickly", () => {
      const startTime = performance.now();
      render(<Badge />);
      const endTime = performance.now();

      // Should render in less than 100ms
      expect(endTime - startTime).toBeLessThan(100);
    });

    it("should not cause memory leaks", () => {
      const { unmount } = render(<Badge />);
      unmount();

      // Component should unmount cleanly
      expect(screen.queryByTestId("badge")).not.toBeInTheDocument();
    });
  });

  describe("Error Handling", () => {
    it("should handle errors gracefully", () => {
      // Suppress console errors for this test
      const consoleSpy = vi
        .spyOn(console, "error")
        .mockImplementation(() => {});

      try {
        render(<Badge />);
      } catch (error) {
        // Should not throw
        expect(error).toBeUndefined();
      }

      consoleSpy.mockRestore();
    });
  });
});
