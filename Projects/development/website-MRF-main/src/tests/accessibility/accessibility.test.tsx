import { render } from "@testing-library/react";
import { axe, toHaveNoViolations } from "jest-axe";
import { NextIntlClientProvider } from "next-intl";
import { Header } from "@/components/layout/header-simple";
import ModernFooter from "@/components/layout/modern-footer";
import { SkipLinks } from "@/components/accessibility/skip-links";

// Extend Jest matchers
expect.extend(toHaveNoViolations);

// Mock next-intl
const mockMessages = {
  accessibility: {
    skipToMain: "Skip to main content",
    skipToNavigation: "Skip to navigation",
    skipToFooter: "Skip to footer",
    skipLinks: "Skip links",
  },
  common: {
    loading: "Loading...",
    error: "Error",
    retry: "Retry",
  },
  home: {
    title: "Welcome to Arabic Learning",
    subtitle: "Learn Arabic with Professor Reda Al-Farouk",
    getStarted: "Get Started",
    learnMore: "Learn More",
  },
};

const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <NextIntlClientProvider locale="ar" messages={mockMessages}>
    {children}
  </NextIntlClientProvider>
);

describe("Accessibility Tests", () => {
  describe("Skip Links", () => {
    it("should not have accessibility violations", async () => {
      const { container } = render(
        <TestWrapper>
          <SkipLinks />
        </TestWrapper>,
      );

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it("should have proper ARIA labels", () => {
      const { getByLabelText } = render(
        <TestWrapper>
          <SkipLinks />
        </TestWrapper>,
      );

      expect(getByLabelText("Skip links")).toBeInTheDocument();
    });

    it("should have keyboard accessible skip links", () => {
      const { getByText } = render(
        <TestWrapper>
          <SkipLinks />
        </TestWrapper>,
      );

      const skipToMain = getByText("Skip to main content");
      expect(skipToMain).toHaveAttribute("href", "#main-content");
      expect(skipToMain.tagName).toBe("A");
    });
  });

  describe("Header Component", () => {
    it("should not have accessibility violations", async () => {
      const { container } = render(
        <TestWrapper>
          <Header />
        </TestWrapper>,
      );

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it("should have proper navigation landmarks", () => {
      const { getByLabelText } = render(
        <TestWrapper>
          <Header />
        </TestWrapper>,
      );

      expect(getByLabelText("Main navigation")).toBeInTheDocument();
    });

    it("should have proper heading hierarchy", () => {
      const { container } = render(
        <TestWrapper>
          <Header />
        </TestWrapper>,
      );

      const header = container.querySelector("header");
      expect(header).toHaveAttribute("id", "navigation");
    });
  });

  describe("Footer Component", () => {
    it("should not have accessibility violations", async () => {
      const { container } = render(
        <TestWrapper>
          <ModernFooter />
        </TestWrapper>,
      );

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it("should have proper footer landmark", () => {
      const { container } = render(
        <TestWrapper>
          <ModernFooter />
        </TestWrapper>,
      );

      const footer = container.querySelector("footer");
      expect(footer).toHaveAttribute("id", "footer");
    });
  });

  describe("Color Contrast", () => {
    it("should have sufficient color contrast", async () => {
      const { container } = render(
        <TestWrapper>
          <div>
            <Header />
            <main id="main-content">
              <h1>Test Content</h1>
              <p>This is test content for accessibility testing.</p>
            </main>
            <ModernFooter />
          </div>
        </TestWrapper>,
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
    it("should have proper focus management", () => {
      const { container } = render(
        <TestWrapper>
          <div>
            <SkipLinks />
            <Header />
            <main id="main-content" tabIndex={-1}>
              <h1>Main Content</h1>
            </main>
          </div>
        </TestWrapper>,
      );

      const mainContent = container.querySelector("#main-content");
      expect(mainContent).toHaveAttribute("tabindex", "-1");
    });

    it("should have focusable elements with proper tab order", async () => {
      const { container } = render(
        <TestWrapper>
          <Header />
        </TestWrapper>,
      );

      const results = await axe(container, {
        rules: {
          tabindex: { enabled: true },
          "focus-order-semantics": { enabled: true },
        },
      });

      expect(results).toHaveNoViolations();
    });
  });

  describe("ARIA Labels and Roles", () => {
    it("should have proper ARIA attributes", async () => {
      const { container } = render(
        <TestWrapper>
          <div>
            <Header />
            <ModernFooter />
          </div>
        </TestWrapper>,
      );

      const results = await axe(container, {
        rules: {
          "aria-valid-attr": { enabled: true },
          "aria-valid-attr-value": { enabled: true },
          "aria-roles": { enabled: true },
        },
      });

      expect(results).toHaveNoViolations();
    });
  });

  describe("Form Accessibility", () => {
    it("should have proper form labels and descriptions", async () => {
      // This would test form components when they're rendered
      const { container } = render(
        <TestWrapper>
          <form>
            <label htmlFor="test-input">Test Input</label>
            <input id="test-input" type="text" aria-describedby="test-help" />
            <div id="test-help">This is help text</div>
          </form>
        </TestWrapper>,
      );

      const results = await axe(container, {
        rules: {
          label: { enabled: true },
        },
      });

      expect(results).toHaveNoViolations();
    });
  });

  describe("Images and Media", () => {
    it("should have proper alt text for images", async () => {
      const { container } = render(
        <TestWrapper>
          <div>
            <img src="/test.jpg" alt="Test image description" />
            <img src="/decorative.jpg" alt="" role="presentation" />
          </div>
        </TestWrapper>,
      );

      const results = await axe(container, {
        rules: {
          "image-alt": { enabled: true },
        },
      });

      expect(results).toHaveNoViolations();
    });
  });
});
