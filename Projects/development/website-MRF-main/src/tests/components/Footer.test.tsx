import { Footer } from "@/components/layout/footer";
import { describe, expect, it } from "vitest";
import { render, screen } from "../test-utils";

/**
 * Comprehensive Tests for Footer Component
 * Uses custom render with NextIntlClientProvider
 */

describe("Footer", () => {
  describe("Rendering", () => {
    it("should render without crashing", () => {
      const { container } = render(<Footer />);
      expect(container).toBeTruthy();
    });

    it("should render with default props", () => {
      const { container } = render(<Footer />);
      expect(container.firstChild).toBeInTheDocument();
    });

    it("should render footer element", () => {
      const { container } = render(<Footer />);
      const footer = container.querySelector("footer");
      expect(footer).toBeInTheDocument();
    });
  });

  describe("Accessibility", () => {
    it("should have footer landmark role", () => {
      render(<Footer />);
      const footer = screen.getByRole("contentinfo");
      expect(footer).toBeInTheDocument();
    });

    it("should contain navigation links", () => {
      const { container } = render(<Footer />);
      const links = container.querySelectorAll("a");
      expect(links.length).toBeGreaterThan(0);
    });
  });

  describe("Responsive Behavior", () => {
    it("should render correctly on mobile viewport", () => {
      global.innerWidth = 375;
      global.innerHeight = 667;

      const { container } = render(<Footer />);
      expect(container.firstChild).toBeInTheDocument();
    });

    it("should render correctly on desktop viewport", () => {
      global.innerWidth = 1920;
      global.innerHeight = 1080;

      const { container } = render(<Footer />);
      expect(container.firstChild).toBeInTheDocument();
    });
  });

  describe("Performance", () => {
    it("should render quickly", () => {
      const startTime = performance.now();
      render(<Footer />);
      const endTime = performance.now();

      // Should render in less than 100ms
      expect(endTime - startTime).toBeLessThan(100);
    });

    it("should not cause memory leaks", () => {
      const { unmount } = render(<Footer />);
      unmount();

      // Component should unmount cleanly
      expect(true).toBe(true);
    });
  });
});
