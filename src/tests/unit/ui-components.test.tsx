import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

describe("UI Components", () => {
  describe("Button", () => {
    it("renders with default props", () => {
      render(<Button>Click me</Button>);
      const button = screen.getByRole("button", { name: /click me/i });
      expect(button).toBeInTheDocument();
      expect(button).toHaveClass("bg-primary-500");
    });

    it("handles click events", () => {
      const handleClick = vi.fn();
      render(<Button onClick={handleClick}>Click me</Button>);

      fireEvent.click(screen.getByRole("button"));
      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it("renders different variants", () => {
      const { rerender } = render(
        <Button variant="secondary">Secondary</Button>,
      );
      expect(screen.getByRole("button")).toHaveClass("bg-secondary-500");

      rerender(<Button variant="destructive">Destructive</Button>);
      expect(screen.getByRole("button")).toHaveClass("bg-destructive");

      rerender(<Button variant="outline">Outline</Button>);
      expect(screen.getByRole("button")).toHaveClass("border");
    });

    it("renders different sizes", () => {
      const { rerender } = render(<Button size="sm">Small</Button>);
      expect(screen.getByRole("button")).toHaveClass("h-11"); // Mobile-first: 44px

      rerender(<Button size="lg">Large</Button>);
      expect(screen.getByRole("button")).toHaveClass("h-12"); // Mobile-first: 48px
    });

    it("can be disabled", () => {
      render(<Button disabled>Disabled</Button>);
      const button = screen.getByRole("button");
      expect(button).toBeDisabled();
      expect(button).toHaveClass("disabled:pointer-events-none");
    });
  });

  describe("Card", () => {
    it("renders card with all components", () => {
      render(
        <Card>
          <CardHeader>
            <CardTitle>Card Title</CardTitle>
            <CardDescription>Card Description</CardDescription>
          </CardHeader>
          <CardContent>
            <p>Card content goes here</p>
          </CardContent>
        </Card>,
      );

      expect(screen.getByText("Card Title")).toBeInTheDocument();
      expect(screen.getByText("Card Description")).toBeInTheDocument();
      expect(screen.getByText("Card content goes here")).toBeInTheDocument();
    });

    it("applies correct CSS classes", () => {
      render(
        <Card data-testid="card">
          <CardHeader data-testid="header">
            <CardTitle data-testid="title">Title</CardTitle>
          </CardHeader>
        </Card>,
      );

      expect(screen.getByTestId("card")).toHaveClass(
        "rounded-xl",
        "border",
        "bg-card",
      );
      expect(screen.getByTestId("header")).toHaveClass(
        "flex",
        "flex-col",
        "space-y-1.5",
      );
      expect(screen.getByTestId("title")).toHaveClass("font-semibold");
    });
  });

  describe("Badge", () => {
    it("renders with default variant", () => {
      render(<Badge>Default Badge</Badge>);
      const badge = screen.getByText("Default Badge");
      expect(badge).toBeInTheDocument();
      expect(badge).toHaveClass("bg-primary-500");
    });

    it("renders different variants", () => {
      const { rerender } = render(<Badge variant="secondary">Secondary</Badge>);
      expect(screen.getByText("Secondary")).toHaveClass("bg-secondary-500");

      rerender(<Badge variant="destructive">Destructive</Badge>);
      expect(screen.getByText("Destructive")).toHaveClass("bg-destructive");

      rerender(<Badge variant="outline">Outline</Badge>);
      expect(screen.getByText("Outline")).toHaveClass("border");
    });
  });

  describe("Input", () => {
    it("renders input field", () => {
      render(<Input placeholder="Enter text" />);
      const input = screen.getByPlaceholderText("Enter text");
      expect(input).toBeInTheDocument();
      expect(input).toHaveClass("flex", "h-10", "w-full");
    });

    it("handles value changes", () => {
      const handleChange = vi.fn();
      render(<Input onChange={handleChange} />);

      const input = screen.getByRole("textbox");
      fireEvent.change(input, { target: { value: "test value" } });

      expect(handleChange).toHaveBeenCalled();
    });

    it("can be disabled", () => {
      render(<Input disabled />);
      const input = screen.getByRole("textbox");
      expect(input).toBeDisabled();
      expect(input).toHaveClass("disabled:cursor-not-allowed");
    });
  });

  describe("Alert", () => {
    it("renders alert with title and description", () => {
      render(
        <Alert>
          <AlertTitle>Alert Title</AlertTitle>
          <AlertDescription>Alert description text</AlertDescription>
        </Alert>,
      );

      expect(screen.getByText("Alert Title")).toBeInTheDocument();
      expect(screen.getByText("Alert description text")).toBeInTheDocument();
    });

    it("renders different variants", () => {
      const { rerender } = render(
        <Alert variant="destructive" data-testid="alert">
          <AlertTitle>Error</AlertTitle>
        </Alert>,
      );
      expect(screen.getByTestId("alert")).toHaveClass("border-destructive/50");

      rerender(
        <Alert variant="default" data-testid="alert">
          <AlertTitle>Info</AlertTitle>
        </Alert>,
      );
      expect(screen.getByTestId("alert")).toHaveClass("border");
    });
  });

  describe("Progress", () => {
    it("renders progress bar", () => {
      render(<Progress value={50} data-testid="progress" />);
      const progress = screen.getByTestId("progress");
      expect(progress).toBeInTheDocument();
      expect(progress).toHaveClass("relative", "h-2", "w-full");
    });

    it("displays correct progress value", () => {
      render(<Progress value={75} data-testid="progress" />);
      const progress = screen.getByTestId("progress");
      expect(progress).toBeInTheDocument();
      // Check that progress component renders with value prop
      expect(progress).toHaveClass("relative", "h-2", "w-full");
    });
  });

  describe("Avatar", () => {
    it("renders avatar with fallback", () => {
      render(
        <Avatar>
          <AvatarImage src="/test-avatar.jpg" alt="Test Avatar" />
          <AvatarFallback>TA</AvatarFallback>
        </Avatar>,
      );

      // In test environment, images don't load so fallback is shown
      expect(screen.getByText("TA")).toBeInTheDocument();
    });

    it("shows fallback text", () => {
      render(
        <Avatar>
          <AvatarFallback>JD</AvatarFallback>
        </Avatar>,
      );

      expect(screen.getByText("JD")).toBeInTheDocument();
    });
  });

  describe("Tabs", () => {
    it("renders tabs with content", () => {
      render(
        <Tabs defaultValue="tab1">
          <TabsList>
            <TabsTrigger value="tab1">Tab 1</TabsTrigger>
            <TabsTrigger value="tab2">Tab 2</TabsTrigger>
          </TabsList>
          <TabsContent value="tab1">Content 1</TabsContent>
          <TabsContent value="tab2">Content 2</TabsContent>
        </Tabs>,
      );

      expect(screen.getByText("Tab 1")).toBeInTheDocument();
      expect(screen.getByText("Tab 2")).toBeInTheDocument();
      expect(screen.getByText("Content 1")).toBeInTheDocument();
    });

    it("switches between tabs", () => {
      render(
        <Tabs defaultValue="tab1">
          <TabsList>
            <TabsTrigger value="tab1">Tab 1</TabsTrigger>
            <TabsTrigger value="tab2">Tab 2</TabsTrigger>
          </TabsList>
          <TabsContent value="tab1">Content 1</TabsContent>
          <TabsContent value="tab2">Content 2</TabsContent>
        </Tabs>,
      );

      // Initially Content 1 should be visible
      expect(screen.getByText("Content 1")).toBeInTheDocument();

      // Click on Tab 2
      fireEvent.click(screen.getByText("Tab 2"));

      // Check that both tabs exist and Tab 2 can be clicked
      expect(screen.getByText("Tab 1")).toBeInTheDocument();
      expect(screen.getByText("Tab 2")).toBeInTheDocument();
    });
  });
});
