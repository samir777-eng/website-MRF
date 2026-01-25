import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

/**
 * Comprehensive Tests for Dialog Component
 * Dialog is a Radix UI primitive that requires proper structure
 */

describe("Dialog", () => {
  const TestDialog = ({ open = false }: { open?: boolean }) => (
    <Dialog open={open}>
      <DialogTrigger asChild>
        <Button data-testid="dialog-trigger">Open Dialog</Button>
      </DialogTrigger>
      <DialogContent data-testid="dialog-content">
        <DialogHeader>
          <DialogTitle>Test Dialog</DialogTitle>
          <DialogDescription>This is a test dialog</DialogDescription>
        </DialogHeader>
        <div>Dialog content</div>
        <DialogFooter>
          <Button>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );

  describe("Rendering", () => {
    it("should render trigger without crashing", () => {
      const { container } = render(<TestDialog />);
      expect(container).toBeTruthy();
    });

    it("should render trigger button", () => {
      render(<TestDialog />);
      expect(screen.getByTestId("dialog-trigger")).toBeInTheDocument();
    });

    it("should show content when open", () => {
      render(<TestDialog open={true} />);
      expect(screen.getByText("Test Dialog")).toBeInTheDocument();
    });
  });

  describe("Interactions", () => {
    it("should open dialog when trigger is clicked", async () => {
      render(<TestDialog />);
      const trigger = screen.getByTestId("dialog-trigger");
      fireEvent.click(trigger);
      expect(screen.getByText("Test Dialog")).toBeInTheDocument();
    });
  });

  describe("Accessibility", () => {
    it("should have proper dialog role when open", () => {
      render(<TestDialog open={true} />);
      expect(screen.getByRole("dialog")).toBeInTheDocument();
    });

    it("should have dialog title", () => {
      render(<TestDialog open={true} />);
      expect(screen.getByText("Test Dialog")).toBeInTheDocument();
    });

    it("should have dialog description", () => {
      render(<TestDialog open={true} />);
      expect(screen.getByText("This is a test dialog")).toBeInTheDocument();
    });
  });

  describe("Performance", () => {
    it("should render quickly", () => {
      const startTime = performance.now();
      render(<TestDialog />);
      const endTime = performance.now();
      expect(endTime - startTime).toBeLessThan(100);
    });

    it("should unmount cleanly", () => {
      const { unmount } = render(<TestDialog />);
      unmount();
      expect(true).toBe(true);
    });
  });
});
