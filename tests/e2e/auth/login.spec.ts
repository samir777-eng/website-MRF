import { test, expect } from "@playwright/test";
import { checkRTL } from "../../helpers/arabic.helper";

test.describe("Login Flow", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/ar/login");
  });

  // ============================================
  // VISUAL & LAYOUT TESTS
  // ============================================

  test("should display login form with Arabic labels", async ({ page }) => {
    // Check RTL direction
    await checkRTL(page);

    // Check Arabic labels exist and are visible
    await expect(page.getByLabel("البريد الإلكتروني")).toBeVisible();
    await expect(page.getByLabel("كلمة المرور")).toBeVisible();

    // Check button text is Arabic
    await expect(
      page.getByRole("button", { name: "تسجيل الدخول" }),
    ).toBeVisible();

    // Check "Forgot Password" link is Arabic
    await expect(
      page.getByRole("link", { name: /نسيت كلمة المرور/i }),
    ).toBeVisible();
  });

  test("should display login form on all viewport sizes", async ({ page }) => {
    const viewports = [
      { name: "mobile", width: 375, height: 667 },
      { name: "tablet", width: 768, height: 1024 },
      { name: "desktop", width: 1920, height: 1080 },
    ];

    for (const viewport of viewports) {
      await page.setViewportSize({
        width: viewport.width,
        height: viewport.height,
      });

      await expect(page.getByLabel("البريد الإلكتروني")).toBeVisible();
      await expect(page.getByLabel("كلمة المرور")).toBeVisible();
      await expect(
        page.getByRole("button", { name: "تسجيل الدخول" }),
      ).toBeVisible();

      // Form should not overflow
      const form = page.locator("form").first();
      const boundingBox = await form.boundingBox();
      if (boundingBox) {
        expect(boundingBox.width).toBeLessThanOrEqual(viewport.width);
      }
    }
  });

  // ============================================
  // ACCESSIBILITY TESTS
  // ============================================

  test("should be navigable with keyboard only", async ({ page }) => {
    // Tab to email input
    await page.keyboard.press("Tab");
    await expect(page.getByLabel("البريد الإلكتروني")).toBeFocused();

    // Tab to password input
    await page.keyboard.press("Tab");
    await expect(page.getByLabel("كلمة المرور")).toBeFocused();
  });

  test("should have visible focus indicators", async ({ page }) => {
    const emailInput = page.getByLabel("البريد الإلكتروني");

    await emailInput.focus();

    // Check focus ring is visible (outline or box-shadow)
    const outlineWidth = await emailInput.evaluate(
      (el) => window.getComputedStyle(el).outlineWidth,
    );
    const boxShadow = await emailInput.evaluate(
      (el) => window.getComputedStyle(el).boxShadow,
    );

    const hasFocusIndicator =
      parseInt(outlineWidth) > 0 || (boxShadow && boxShadow !== "none");
    expect(hasFocusIndicator).toBe(true);
  });

  // ============================================
  // MOBILE-SPECIFIC TESTS
  // ============================================

  test("should have touch-friendly button sizes on mobile", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 375, height: 667 });

    const loginButton = page.getByRole("button", { name: "تسجيل الدخول" });
    const box = await loginButton.boundingBox();

    if (box) {
      // Button should be at least 44x44px (Apple HIG)
      expect(box.height).toBeGreaterThanOrEqual(44);
      expect(box.width).toBeGreaterThanOrEqual(44);
    }
  });

  test("should not have horizontal scroll on mobile", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });

    const scrollWidth = await page.evaluate(
      () => document.documentElement.scrollWidth,
    );
    const clientWidth = await page.evaluate(
      () => document.documentElement.clientWidth,
    );

    expect(scrollWidth).toBeLessThanOrEqual(clientWidth);
  });

  test("should show input in viewport when focused on mobile", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 375, height: 667 });

    const emailInput = page.getByLabel("البريد الإلكتروني");
    await emailInput.click();

    // Input should still be visible (scrolled into view)
    await expect(emailInput).toBeInViewport();
  });

  // ============================================
  // REMEMBER ME CHECKBOX
  // ============================================

  test('should have "Remember Me" checkbox in Arabic', async ({ page }) => {
    const rememberMe = page.getByLabel(/تذكرني/);

    await expect(rememberMe).toBeVisible();

    // Should toggle on click
    await rememberMe.click();
    await expect(rememberMe).toBeChecked();
  });
});
