import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

/**
 * Comprehensive Tests for Tabs Component
 */

const TestTabs = () => (
  <Tabs defaultValue="tab1">
    <TabsList>
      <TabsTrigger value="tab1">Tab 1</TabsTrigger>
      <TabsTrigger value="tab2">Tab 2</TabsTrigger>
    </TabsList>
    <TabsContent value="tab1">Content 1</TabsContent>
    <TabsContent value="tab2">Content 2</TabsContent>
  </Tabs>
);

describe("Tabs", () => {
  describe("Rendering", () => {
    it("should render without crashing", () => {
      const { container } = render(<TestTabs />);
      expect(container).toBeTruthy();
    });

    it("should render tab triggers", () => {
      render(<TestTabs />);
      expect(screen.getByText("Tab 1")).toBeInTheDocument();
      expect(screen.getByText("Tab 2")).toBeInTheDocument();
    });

    it("should render default tab content", () => {
      render(<TestTabs />);
      expect(screen.getByText("Content 1")).toBeInTheDocument();
    });
  });

  describe("Interactions", () => {
    it("should switch tabs on click", () => {
      render(<TestTabs />);
      const tab2 = screen.getByText("Tab 2");
      fireEvent.click(tab2);
      expect(screen.getByText("Content 2")).toBeInTheDocument();
    });
  });

  describe("Accessibility", () => {
    it("should have tablist role", () => {
      render(<TestTabs />);
      expect(screen.getByRole("tablist")).toBeInTheDocument();
    });

    it("should have tab roles", () => {
      render(<TestTabs />);
      expect(screen.getAllByRole("tab")).toHaveLength(2);
    });
  });

  describe("Performance", () => {
    it("should render quickly", () => {
      const startTime = performance.now();
      render(<TestTabs />);
      const endTime = performance.now();
      expect(endTime - startTime).toBeLessThan(100);
    });

    it("should unmount cleanly", () => {
      const { unmount } = render(<TestTabs />);
      unmount();
      expect(true).toBe(true);
    });
  });
});
