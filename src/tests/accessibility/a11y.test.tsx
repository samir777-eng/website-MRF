import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { axe, toHaveNoViolations } from "jest-axe";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Extend Jest matchers
expect.extend(toHaveNoViolations);

describe("Accessibility Tests", () => {
  describe("Button Component", () => {
    it("should not have accessibility violations", async () => {
      const { container } = render(<Button>Accessible Button</Button>);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it("should have proper ARIA attributes when disabled", async () => {
      const { container } = render(<Button disabled>Disabled Button</Button>);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it("should support keyboard navigation", async () => {
      const { container } = render(<Button>Keyboard Accessible</Button>);
      const button = container.querySelector("button");
      expect(button).toHaveAttribute("type", "button");

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  describe("Card Component", () => {
    it("should not have accessibility violations", async () => {
      const { container } = render(
        <Card>
          <CardHeader>
            <CardTitle>Accessible Card Title</CardTitle>
            <CardDescription>
              This is an accessible card description
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p>Card content that is accessible to screen readers</p>
          </CardContent>
        </Card>,
      );

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it("should have proper heading hierarchy", async () => {
      const { container } = render(
        <Card>
          <CardHeader>
            <CardTitle>Main Title</CardTitle>
            <CardDescription>Description text</CardDescription>
          </CardHeader>
        </Card>,
      );

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  describe("Form Components", () => {
    it("should make Input accessible", async () => {
      const { container } = render(
        <div>
          <label htmlFor="test-input">Accessible Input Label</label>
          <Input id="test-input" placeholder="Enter text here" />
        </div>,
      );

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it("should handle required inputs properly", async () => {
      const { container } = render(
        <div>
          <label htmlFor="required-input">Required Field *</label>
          <Input id="required-input" required aria-required="true" />
        </div>,
      );

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it("should handle input with error state", async () => {
      const { container } = render(
        <div>
          <label htmlFor="error-input">Input with Error</label>
          <Input
            id="error-input"
            aria-invalid="true"
            aria-describedby="error-message"
          />
          <div id="error-message" role="alert">
            This field is required
          </div>
        </div>,
      );

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  describe("Alert Component", () => {
    it("should be accessible with proper ARIA roles", async () => {
      const { container } = render(
        <Alert role="alert">
          <AlertTitle>Important Alert</AlertTitle>
          <AlertDescription>
            This is an important message for users
          </AlertDescription>
        </Alert>,
      );

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it("should handle different alert variants accessibly", async () => {
      const { container } = render(
        <div>
          <Alert variant="default" role="status">
            <AlertTitle>Info</AlertTitle>
            <AlertDescription>Information message</AlertDescription>
          </Alert>

          <Alert variant="destructive" role="alert">
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>Error message</AlertDescription>
          </Alert>
        </div>,
      );

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  describe("Progress Component", () => {
    it("should be accessible with proper ARIA attributes", async () => {
      const { container } = render(
        <div>
          <label htmlFor="progress-bar">Loading Progress</label>
          <Progress
            id="progress-bar"
            value={50}
            aria-label="Loading progress: 50%"
            role="progressbar"
            aria-valuenow={50}
            aria-valuemin={0}
            aria-valuemax={100}
          />
        </div>,
      );

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  describe("Avatar Component", () => {
    it("should be accessible with proper alt text", async () => {
      const { container } = render(
        <Avatar>
          <AvatarImage src="/avatar.jpg" alt="User profile picture" />
          <AvatarFallback>JD</AvatarFallback>
        </Avatar>,
      );

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it("should handle fallback text accessibly", async () => {
      const { container } = render(
        <Avatar>
          <AvatarFallback aria-label="John Doe profile picture">
            JD
          </AvatarFallback>
        </Avatar>,
      );

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  describe("Tabs Component", () => {
    it("should be accessible with proper ARIA attributes", async () => {
      const { container } = render(
        <Tabs defaultValue="tab1">
          <TabsList aria-label="Main navigation tabs">
            <TabsTrigger value="tab1">First Tab</TabsTrigger>
            <TabsTrigger value="tab2">Second Tab</TabsTrigger>
          </TabsList>
          <TabsContent value="tab1">
            <h2>First Tab Content</h2>
            <p>Content for the first tab</p>
          </TabsContent>
          <TabsContent value="tab2">
            <h2>Second Tab Content</h2>
            <p>Content for the second tab</p>
          </TabsContent>
        </Tabs>,
      );

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  describe("Badge Component", () => {
    it("should be accessible", async () => {
      const { container } = render(
        <div>
          <Badge>Default Badge</Badge>
          <Badge variant="secondary">Secondary Badge</Badge>
          <Badge variant="destructive">Error Badge</Badge>
        </div>,
      );

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it("should handle interactive badges", async () => {
      const { container } = render(
        <button>
          <Badge>Clickable Badge</Badge>
        </button>,
      );

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  describe("Color Contrast", () => {
    it("should have sufficient color contrast for text", async () => {
      const { container } = render(
        <div>
          <Button variant="default">Default Button</Button>
          <Button variant="secondary">Secondary Button</Button>
          <Button variant="destructive">Destructive Button</Button>
          <Button variant="outline">Outline Button</Button>
        </div>,
      );

      const results = await axe(container, {
        rules: {
          "color-contrast": { enabled: true },
        },
      });
      expect(results).toHaveNoViolations();
    });
  });

  describe("Keyboard Navigation", () => {
    it("should support keyboard navigation for interactive elements", async () => {
      const { container } = render(
        <div>
          <Button>First Button</Button>
          <Input placeholder="Text input" />
          <Button>Second Button</Button>
        </div>,
      );

      const results = await axe(container, {
        rules: {
          "focus-order-semantics": { enabled: true },
        },
      });
      expect(results).toHaveNoViolations();
    });
  });

  describe("Screen Reader Support", () => {
    it("should provide proper labels and descriptions", async () => {
      const { container } = render(
        <div>
          <h1>Main Page Title</h1>
          <nav aria-label="Main navigation">
            <Button>Home</Button>
            <Button>About</Button>
            <Button>Contact</Button>
          </nav>
          <main>
            <section aria-labelledby="content-title">
              <h2 id="content-title">Content Section</h2>
              <p>This is the main content area</p>
            </section>
          </main>
        </div>,
      );

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });
});
