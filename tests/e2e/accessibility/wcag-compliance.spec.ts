import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test.describe("WCAG 2.1 AA Compliance", () => {
  // ============================================
  // HOMEPAGE ACCESSIBILITY
  // ============================================

  test.describe("Homepage", () => {
    test("should have no critical accessibility violations", async ({
      page,
    }) => {
      await page.goto("/ar");

      const accessibilityScanResults = await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa"])
        .analyze();

      // Filter for critical and serious violations only
      const criticalViolations = accessibilityScanResults.violations.filter(
        (v) => v.impact === "critical" || v.impact === "serious"
      );

      expect(criticalViolations).toHaveLength(0);
    });

    test("should have proper heading hierarchy", async ({ page }) => {
      await page.goto("/ar");

      // Should have exactly one h1
      const h1Count = await page.locator("h1").count();
      expect(h1Count).toBe(1);
    });

    test("should have alt text on all images", async ({ page }) => {
      await page.goto("/ar");

      const images = page.locator("img");
      const count = await images.count();

      for (let i = 0; i < count; i++) {
        const alt = await images.nth(i).getAttribute("alt");
        expect(alt).not.toBeNull();
      }
    });
  });

  // ============================================
  // LOGIN PAGE ACCESSIBILITY
  // ============================================

  test.describe("Login Page", () => {
    test("should have no critical accessibility violations", async ({
      page,
    }) => {
      await page.goto("/ar/login");

      const accessibilityScanResults = await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa"])
        .analyze();

      const criticalViolations = accessibilityScanResults.violations.filter(
        (v) => v.impact === "critical" || v.impact === "serious"
      );

      expect(criticalViolations).toHaveLength(0);
    });

    test("should have labels for all form inputs", async ({ page }) => {
      await page.goto("/ar/login");

      const inputs = page.locator("input:visible");
      const count = await inputs.count();

      for (let i = 0; i < count; i++) {
        const input = inputs.nth(i);
        const type = await input.getAttribute("type");

        if (type === "hidden" || type === "submit") continue;

        const ariaLabel = await input.getAttribute("aria-label");
        const ariaLabelledBy = await input.getAttribute("aria-labelledby");
        const id = await input.getAttribute("id");

        let hasLabel = false;
        if (ariaLabel || ariaLabelledBy) {
          hasLabel = true;
        } else if (id) {
          const label = page.locator(`label[for="${id}"]`);
          hasLabel = (await label.count()) > 0;
        }

        expect(hasLabel).toBe(true);
      }
    });
  });

  // ============================================
  // SIGNUP PAGE ACCESSIBILITY
  // ============================================

  test.describe("Signup Page", () => {
    test("should have no critical accessibility violations", async ({
      page,
    }) => {
      await page.goto("/ar/signup");

      const accessibilityScanResults = await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa"])
        .analyze();

      const criticalViolations = accessibilityScanResults.violations.filter(
        (v) => v.impact === "critical" || v.impact === "serious"
      );

      expect(criticalViolations).toHaveLength(0);
    });
  });

  // ============================================
  // DASHBOARD ACCESSIBILITY
  // ============================================

  test.describe("Dashboard", () => {
    test("should have no critical accessibility violations", async ({
      page,
    }) => {
      await page.goto("/ar/dashboard");

      const accessibilityScanResults = await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa"])
        .analyze();

      const criticalViolations = accessibilityScanResults.violations.filter(
        (v) => v.impact === "critical" || v.impact === "serious"
      );

      expect(criticalViolations).toHaveLength(0);
    });

    test("should have proper ARIA landmarks", async ({ page }) => {
      await page.goto("/ar/dashboard");

      // Should have main landmark
      await expect(page.locator('main, [role="main"]')).toBeVisible();

      // Should have navigation landmark
      await expect(page.locator('nav, [role="navigation"]')).toBeVisible();
    });
  });

  // ============================================
  // COLOR CONTRAST
  // ============================================

  test.describe("Color Contrast", () => {
    test("should have sufficient color contrast on homepage", async ({
      page,
    }) => {
      await page.goto("/ar");

      const accessibilityScanResults = await new AxeBuilder({ page })
        .withTags(["wcag2aa"])
        .include("body")
        .analyze();

      const contrastViolations = accessibilityScanResults.violations.filter(
        (v) => v.id === "color-contrast"
      );

      expect(contrastViolations).toHaveLength(0);
    });
  });
});

