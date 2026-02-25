import { test, expect } from "@playwright/test";
import { viewports } from "../../helpers/viewport.helper";

test.describe("Mobile Responsive Design", () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize(viewports.mobile);
  });

  // ============================================
  // HOMEPAGE MOBILE TESTS
  // ============================================

  test.describe("Homepage", () => {
    test.beforeEach(async ({ page }) => {
      await page.goto("/ar");
    });

    test("should not have horizontal scroll", async ({ page }) => {
      const scrollWidth = await page.evaluate(
        () => document.documentElement.scrollWidth
      );
      const clientWidth = await page.evaluate(
        () => document.documentElement.clientWidth
      );

      expect(scrollWidth).toBeLessThanOrEqual(clientWidth + 5);
    });

    test("should have mobile navigation menu", async ({ page }) => {
      // Look for hamburger menu button
      const menuButton = page.getByRole("button", { name: /القائمة|menu/i });
      await expect(menuButton).toBeVisible();
    });

    test("should have touch-friendly buttons", async ({ page }) => {
      const buttons = page.locator("button:visible");
      const count = await buttons.count();

      for (let i = 0; i < Math.min(count, 5); i++) {
        const box = await buttons.nth(i).boundingBox();
        if (box) {
          expect(box.height).toBeGreaterThanOrEqual(44);
        }
      }
    });

    test("should have readable font sizes", async ({ page }) => {
      const body = page.locator("body");
      const fontSize = await body.evaluate(
        (el) => window.getComputedStyle(el).fontSize
      );

      // Font size should be at least 14px
      expect(parseInt(fontSize)).toBeGreaterThanOrEqual(14);
    });
  });

  // ============================================
  // LOGIN PAGE MOBILE TESTS
  // ============================================

  test.describe("Login Page", () => {
    test.beforeEach(async ({ page }) => {
      await page.goto("/ar/login");
    });

    test("should display form correctly", async ({ page }) => {
      await expect(page.getByLabel("البريد الإلكتروني")).toBeVisible();
      await expect(page.getByLabel("كلمة المرور")).toBeVisible();
    });

    test("should have full-width inputs", async ({ page }) => {
      const emailInput = page.getByLabel("البريد الإلكتروني");
      const box = await emailInput.boundingBox();

      if (box) {
        // Input should be at least 80% of viewport width
        expect(box.width).toBeGreaterThan(viewports.mobile.width * 0.8);
      }
    });

    test("should have touch-friendly submit button", async ({ page }) => {
      const submitButton = page.getByRole("button", { name: "تسجيل الدخول" });
      const box = await submitButton.boundingBox();

      if (box) {
        expect(box.height).toBeGreaterThanOrEqual(44);
        expect(box.width).toBeGreaterThanOrEqual(44);
      }
    });
  });

  // ============================================
  // SIGNUP PAGE MOBILE TESTS
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
  // DASHBOARD MOBILE TESTS
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
        () => document.documentElement.scrollWidth
      );
      const clientWidth = await page.evaluate(
        () => document.documentElement.clientWidth
      );

      expect(scrollWidth).toBeLessThanOrEqual(clientWidth + 5);
    });
  });

  // ============================================
  // TOUCH INTERACTION TESTS
  // ============================================

  test.describe("Touch Interactions", () => {
    test("should have adequate spacing between interactive elements", async ({
      page,
    }) => {
      await page.goto("/ar");

      const links = page.locator("a:visible");
      const count = await links.count();

      for (let i = 0; i < Math.min(count - 1, 5); i++) {
        const box1 = await links.nth(i).boundingBox();
        const box2 = await links.nth(i + 1).boundingBox();

        if (box1 && box2) {
          // Elements should have at least 8px spacing
          const verticalGap = box2.y - (box1.y + box1.height);
          const horizontalGap = box2.x - (box1.x + box1.width);

          // At least one dimension should have adequate spacing
          expect(verticalGap >= 8 || horizontalGap >= 8).toBe(true);
        }
      }
    });
  });
});

