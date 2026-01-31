import { test, expect } from "@playwright/test";
import { viewports } from "../../helpers/viewport.helper";

test.describe("Tablet Responsive Design", () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize(viewports.tablet);
  });

  // ============================================
  // HOMEPAGE TABLET TESTS
  // ============================================

  test.describe("Homepage", () => {
    test.beforeEach(async ({ page }) => {
      await page.goto("/ar");
    });

    test("should not have horizontal scroll", async ({ page }) => {
      const scrollWidth = await page.evaluate(
        () => document.documentElement.scrollWidth,
      );
      const clientWidth = await page.evaluate(
        () => document.documentElement.clientWidth,
      );

      expect(scrollWidth).toBeLessThanOrEqual(clientWidth + 5);
    });

    test("should display navigation appropriately", async ({ page }) => {
      // On tablet, navigation might be visible or in hamburger menu
      const nav = page.locator("nav");
      await expect(nav).toBeVisible();
    });

    test("should have readable font sizes", async ({ page }) => {
      const body = page.locator("body");
      const fontSize = await body.evaluate(
        (el) => window.getComputedStyle(el).fontSize,
      );

      expect(parseInt(fontSize)).toBeGreaterThanOrEqual(14);
    });
  });

  // ============================================
  // LOGIN PAGE TABLET TESTS
  // ============================================

  test.describe("Login Page", () => {
    test.beforeEach(async ({ page }) => {
      await page.goto("/ar/login");
    });

    test("should display form correctly", async ({ page }) => {
      await expect(page.getByLabel("البريد الإلكتروني")).toBeVisible();
      await expect(page.getByLabel("كلمة المرور")).toBeVisible();
    });

    test("should have appropriately sized form", async ({ page }) => {
      const form = page.locator("form").first();
      const box = await form.boundingBox();

      if (box) {
        // Form should not be full width on tablet
        expect(box.width).toBeLessThan(viewports.tablet.width);
        // But should be at least 50% of viewport
        expect(box.width).toBeGreaterThan(viewports.tablet.width * 0.5);
      }
    });
  });

  // ============================================
  // DASHBOARD TABLET TESTS
  // ============================================

  test.describe("Dashboard", () => {
    test.beforeEach(async ({ page }) => {
      await page.goto("/ar/dashboard");
    });

    test("should display correctly", async ({ page }) => {
      await expect(page.getByText(/لوحة التحكم|الرئيسية/)).toBeVisible();
    });

    test("should not have horizontal scroll", async ({ page }) => {
      const scrollWidth = await page.evaluate(
        () => document.documentElement.scrollWidth,
      );
      const clientWidth = await page.evaluate(
        () => document.documentElement.clientWidth,
      );

      expect(scrollWidth).toBeLessThanOrEqual(clientWidth + 5);
    });

    test("should have touch-friendly elements", async ({ page }) => {
      const buttons = page.locator("button:visible").first();
      const box = await buttons.boundingBox();

      if (box) {
        expect(box.height).toBeGreaterThanOrEqual(44);
      }
    });
  });

  // ============================================
  // SIGNUP PAGE TABLET TESTS
  // ============================================

  test.describe("Signup Page", () => {
    test.beforeEach(async ({ page }) => {
      await page.goto("/ar/signup");
    });

    test("should display grade options", async ({ page }) => {
      await expect(page.getByText(/الصف الأول الثانوي/)).toBeVisible();
      await expect(page.getByText(/الصف الثاني الثانوي/)).toBeVisible();
      await expect(page.getByText(/الصف الثالث الثانوي/)).toBeVisible();
    });

    test("should have touch-friendly grade options", async ({ page }) => {
      const gradeOption = page.getByText(/الصف الأول الثانوي/).first();
      const box = await gradeOption.boundingBox();

      if (box) {
        expect(box.height).toBeGreaterThanOrEqual(44);
      }
    });
  });

  // ============================================
  // LANDSCAPE ORIENTATION TESTS
  // ============================================

  test.describe("Landscape Orientation", () => {
    test.beforeEach(async ({ page }) => {
      // Tablet in landscape
      await page.setViewportSize({ width: 1024, height: 768 });
    });

    test("should display homepage correctly in landscape", async ({ page }) => {
      await page.goto("/ar");

      const scrollWidth = await page.evaluate(
        () => document.documentElement.scrollWidth,
      );
      const clientWidth = await page.evaluate(
        () => document.documentElement.clientWidth,
      );

      expect(scrollWidth).toBeLessThanOrEqual(clientWidth + 5);
    });

    test("should display dashboard correctly in landscape", async ({
      page,
    }) => {
      await page.goto("/ar/dashboard");

      await expect(page.getByText(/لوحة التحكم|الرئيسية/)).toBeVisible();
    });
  });
});
