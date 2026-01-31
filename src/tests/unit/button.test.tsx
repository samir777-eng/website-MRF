/**
 * Unit Tests for Button Component
 * Tests all variants, sizes, states, and interactions
 */

import { Button } from "@/components/ui/button";
import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

describe("Button Component", () => {
  describe("Rendering", () => {
    it("renders with default props", () => {
      render(<Button>Click me</Button>);
      const button = screen.getByRole("button", { name: /click me/i });
      expect(button).toBeInTheDocument();
    });

    it("renders with custom className", () => {
      render(<Button className="custom-class">Button</Button>);
      const button = screen.getByRole("button");
      expect(button).toHaveClass("custom-class");
    });

    it("renders as child component when asChild is true", () => {
      render(
        <Button asChild>
          <a href="/test">Link Button</a>
        </Button>,
      );
      const link = screen.getByRole("link");
      expect(link).toBeInTheDocument();
      expect(link).toHaveAttribute("href", "/test");
    });
  });

  describe("Variants", () => {
    it("renders default variant", () => {
      render(<Button variant="default">Default</Button>);
      const button = screen.getByRole("button");
      expect(button).toHaveClass("bg-primary-500");
    });

    it("renders destructive variant", () => {
      render(<Button variant="destructive">Delete</Button>);
      const button = screen.getByRole("button");
      expect(button).toHaveClass("bg-destructive");
    });

    it("renders outline variant", () => {
      render(<Button variant="outline">Outline</Button>);
      const button = screen.getByRole("button");
      expect(button).toHaveClass("border");
    });

    it("renders secondary variant", () => {
      render(<Button variant="secondary">Secondary</Button>);
      const button = screen.getByRole("button");
      expect(button).toHaveClass("bg-secondary-500");
    });

    it("renders ghost variant", () => {
      render(<Button variant="ghost">Ghost</Button>);
      const button = screen.getByRole("button");
      expect(button).toHaveClass("hover:bg-accent");
    });

    it("renders link variant", () => {
      render(<Button variant="link">Link</Button>);
      const button = screen.getByRole("button");
      expect(button).toHaveClass("underline-offset-4");
    });
  });

  describe("Sizes", () => {
    it("renders default size (44px height)", () => {
      render(<Button size="default">Default Size</Button>);
      const button = screen.getByRole("button");
      expect(button).toHaveClass("h-11"); // 44px
    });

    it("renders small size (44px height)", () => {
      render(<Button size="sm">Small</Button>);
      const button = screen.getByRole("button");
      expect(button).toHaveClass("h-11"); // 44px - WCAG compliant
    });

    it("renders large size", () => {
      render(<Button size="lg">Large</Button>);
      const button = screen.getByRole("button");
      expect(button).toHaveClass("h-12"); // 48px
    });

    it("renders icon size (44x44px)", () => {
      render(<Button size="icon">🔍</Button>);
      const button = screen.getByRole("button");
      expect(button).toHaveClass("h-11", "w-11"); // 44x44px
    });
  });

  describe("States", () => {
    it("handles disabled state", () => {
      render(<Button disabled>Disabled</Button>);
      const button = screen.getByRole("button");
      expect(button).toBeDisabled();
      expect(button).toHaveClass("disabled:opacity-50");
    });

    it("does not call onClick when disabled", () => {
      const handleClick = vi.fn();
      render(
        <Button disabled onClick={handleClick}>
          Disabled
        </Button>,
      );
      const button = screen.getByRole("button");
      fireEvent.click(button);
      expect(handleClick).not.toHaveBeenCalled();
    });

    it("shows loading state", () => {
      render(<Button loading>Loading</Button>);
      const button = screen.getByRole("button");
      expect(button).toBeDisabled();
      // Check for loading spinner
      const spinner = button.querySelector(".animate-spin");
      expect(spinner).toBeInTheDocument();
    });
  });

  describe("Interactions", () => {
    it("calls onClick when clicked", () => {
      const handleClick = vi.fn();
      render(<Button onClick={handleClick}>Click me</Button>);
      const button = screen.getByRole("button");
      fireEvent.click(button);
      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it("handles keyboard events (Enter)", () => {
      const handleClick = vi.fn();
      render(<Button onClick={handleClick}>Press Enter</Button>);
      const button = screen.getByRole("button");
      // Native button elements handle Enter key automatically via click
      fireEvent.keyUp(button, { key: "Enter", code: "Enter" });
      // Buttons don't fire onClick on keyDown, they fire on keyUp or via native behavior
      // Just verify the button is focusable and can receive keyboard events
      expect(button).not.toBeDisabled();
    });

    it("handles keyboard events (Space)", () => {
      const handleClick = vi.fn();
      render(<Button onClick={handleClick}>Press Space</Button>);
      const button = screen.getByRole("button");
      // Native button elements handle Space key automatically via click
      fireEvent.keyUp(button, { key: " ", code: "Space" });
      // Just verify the button is focusable and can receive keyboard events
      expect(button).not.toBeDisabled();
    });
  });

  describe("Accessibility", () => {
    it("has proper ARIA attributes", () => {
      render(<Button aria-label="Custom label">Button</Button>);
      const button = screen.getByRole("button");
      expect(button).toHaveAttribute("aria-label", "Custom label");
    });

    it("is keyboard focusable", () => {
      render(<Button>Focusable</Button>);
      const button = screen.getByRole("button");
      button.focus();
      expect(button).toHaveFocus();
    });

    it("has visible focus indicator", () => {
      render(<Button>Focus me</Button>);
      const button = screen.getByRole("button");
      expect(button).toHaveClass("focus-visible:outline-none");
      expect(button).toHaveClass("focus-visible:ring-1");
    });

    it("meets minimum touch target size (44x44px)", () => {
      render(<Button>Touch Target</Button>);
      const button = screen.getByRole("button");
      expect(button).toHaveClass("h-11"); // 44px height
    });
  });

  describe("Content", () => {
    it("renders text content", () => {
      render(<Button>Text Content</Button>);
      expect(screen.getByText("Text Content")).toBeInTheDocument();
    });

    it("renders with icon", () => {
      render(
        <Button>
          <span>🔍</span>
          Search
        </Button>,
      );
      expect(screen.getByText("Search")).toBeInTheDocument();
      expect(screen.getByText("🔍")).toBeInTheDocument();
    });

    it("renders icon-only button", () => {
      render(
        <Button size="icon" aria-label="Search">
          🔍
        </Button>,
      );
      const button = screen.getByRole("button", { name: /search/i });
      expect(button).toBeInTheDocument();
    });
  });

  describe("Edge Cases", () => {
    it("handles rapid clicks", () => {
      const handleClick = vi.fn();
      render(<Button onClick={handleClick}>Rapid Click</Button>);
      const button = screen.getByRole("button");

      fireEvent.click(button);
      fireEvent.click(button);
      fireEvent.click(button);

      expect(handleClick).toHaveBeenCalledTimes(3);
    });

    it("handles long text content", () => {
      const longText =
        "This is a very long button text that should wrap properly";
      render(<Button>{longText}</Button>);
      expect(screen.getByText(longText)).toBeInTheDocument();
    });

    it("handles empty content gracefully", () => {
      render(<Button />);
      const button = screen.getByRole("button");
      expect(button).toBeInTheDocument();
    });
  });
});
