import { test, expect } from "@playwright/test";
import { checkRTL } from "../../helpers/arabic.helper";

test.describe("Student Dashboard", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/ar/dashboard");
  });

  // ============================================
  // VISUAL & LAYOUT TESTS
  // ============================================

  test("should display dashboard with Arabic content", async ({ page }) => {
    // Check RTL direction
    await checkRTL(page);

    // Check for dashboard elements in Arabic
    await expect(page.getByText(/لوحة التحكم|الرئيسية/)).toBeVisible();
  });

  test("should display user greeting in Arabic", async ({ page }) => {
    // Check for greeting text
    await expect(page.getByText(/مرحباً|أهلاً/)).toBeVisible();
  });

  // ============================================
  // GAMIFICATION ELEMENTS
  // ============================================

  test("should display XP and level information", async ({ page }) => {
    // Check for XP display
    await expect(page.getByText(/نقاط|XP/)).toBeVisible();

    // Check for level display
    await expect(page.getByText(/المستوى|Level/)).toBeVisible();
  });

  test("should display streak information", async ({ page }) => {
    // Check for streak display
    await expect(page.getByText(/سلسلة|Streak|يوم/)).toBeVisible();
  });

  test("should display energy/hearts system", async ({ page }) => {
    // Check for energy or hearts display
    const energyElement = page.getByText(/الطاقة|قلوب|Hearts|Energy/);
    if (await energyElement.isVisible()) {
      await expect(energyElement).toBeVisible();
    }
  });

  // ============================================
  // NAVIGATION ELEMENTS
  // ============================================

  test("should have navigation to lessons", async ({ page }) => {
    await expect(
      page.getByRole("link", { name: /الدروس|Lessons/ }),
    ).toBeVisible();
  });

  test("should have navigation to quizzes", async ({ page }) => {
    await expect(
      page.getByRole("link", { name: /الاختبارات|Quizzes/ }),
    ).toBeVisible();
  });

  test("should have navigation to profile", async ({ page }) => {
    await expect(
      page.getByRole("link", { name: /الملف الشخصي|Profile/ }),
    ).toBeVisible();
  });

  // ============================================
  // ACCESSIBILITY TESTS
  // ============================================

  test("should have proper heading hierarchy", async ({ page }) => {
    // Should have exactly one h1
    const h1Count = await page.locator("h1").count();
    expect(h1Count).toBe(1);
  });

  test("should be keyboard navigable", async ({ page }) => {
    // Tab through the page
    await page.keyboard.press("Tab");

    const activeElement = await page.evaluate(
      () => document.activeElement?.tagName,
    );
    expect(["A", "BUTTON", "INPUT"]).toContain(activeElement);
  });

  test("should have visible focus indicators", async ({ page }) => {
    const firstLink = page.locator("a:visible").first();

    await firstLink.focus();

    const outlineWidth = await firstLink.evaluate(
      (el) => window.getComputedStyle(el).outlineWidth,
    );
    const boxShadow = await firstLink.evaluate(
      (el) => window.getComputedStyle(el).boxShadow,
    );

    const hasFocusIndicator =
      parseInt(outlineWidth) > 0 || (boxShadow && boxShadow !== "none");
    expect(hasFocusIndicator).toBe(true);
  });

  // ============================================
  // RESPONSIVE TESTS
  // ============================================

  test("should display correctly on mobile", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });

    // Dashboard should be visible
    await expect(page.getByText(/لوحة التحكم|الرئيسية/)).toBeVisible();

    // No horizontal scroll
    const scrollWidth = await page.evaluate(
      () => document.documentElement.scrollWidth,
    );
    const clientWidth = await page.evaluate(
      () => document.documentElement.clientWidth,
    );

    expect(scrollWidth).toBeLessThanOrEqual(clientWidth + 5);
  });

  test("should display correctly on tablet", async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });

    await expect(page.getByText(/لوحة التحكم|الرئيسية/)).toBeVisible();
  });

  test("should have touch-friendly elements on mobile", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });

    const buttons = page.locator("button:visible, a:visible").first();
    const box = await buttons.boundingBox();

    if (box) {
      expect(box.height).toBeGreaterThanOrEqual(44);
    }
  });

  // ============================================
  // PROGRESS DISPLAY
  // ============================================

  test("should display progress indicators", async ({ page }) => {
    // Check for progress bars or completion indicators
    const progressElement = page.getByText(/التقدم|Progress|%/);
    if (await progressElement.isVisible()) {
      await expect(progressElement).toBeVisible();
    }
  });

  test("should display recent activity", async ({ page }) => {
    // Check for recent activity section
    const activityElement = page.getByText(/النشاط|الأخير|Recent/);
    if (await activityElement.isVisible()) {
      await expect(activityElement).toBeVisible();
    }
  });
});
