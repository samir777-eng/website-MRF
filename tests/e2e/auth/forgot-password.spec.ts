import { test, expect } from "@playwright/test";
import { checkRTL } from "../../helpers/arabic.helper";

test.describe("Forgot Password Flow", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/ar/forgot-password");
  });

  // ============================================
  // VISUAL & LAYOUT TESTS
  // ============================================

  test("should display forgot password form with Arabic content", async ({
    page,
  }) => {
    // Check RTL direction
    await checkRTL(page);

    // Check page title or heading is in Arabic
    await expect(
      page.getByText(/نسيت كلمة المرور|استعادة كلمة المرور/),
    ).toBeVisible();

    // Check email input is visible
    await expect(page.getByLabel("البريد الإلكتروني")).toBeVisible();

    // Check submit button is in Arabic
    await expect(
      page.getByRole("button", { name: /إرسال|استعادة|إعادة تعيين/ }),
    ).toBeVisible();
  });

  test("should have back to login link", async ({ page }) => {
    const backLink = page.getByRole("link", { name: /العودة|تسجيل الدخول/ });
    await expect(backLink).toBeVisible();
  });

  // ============================================
  // ACCESSIBILITY TESTS
  // ============================================

  test("should be keyboard navigable", async ({ page }) => {
    // Tab to email input
    await page.keyboard.press("Tab");
    const emailInput = page.getByLabel("البريد الإلكتروني");

    // Should be able to focus on email input
    await expect(emailInput).toBeFocused();
  });

  test("should have visible focus indicators", async ({ page }) => {
    const emailInput = page.getByLabel("البريد الإلكتروني");

    await emailInput.focus();

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
  // RESPONSIVE TESTS
  // ============================================

  test("should display correctly on mobile", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });

    // Form should be visible and not overflow
    await expect(page.getByLabel("البريد الإلكتروني")).toBeVisible();

    const scrollWidth = await page.evaluate(
      () => document.documentElement.scrollWidth,
    );
    const clientWidth = await page.evaluate(
      () => document.documentElement.clientWidth,
    );

    expect(scrollWidth).toBeLessThanOrEqual(clientWidth + 5);
  });

  test("should have touch-friendly button on mobile", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });

    const submitButton = page.getByRole("button", {
      name: /إرسال|استعادة|إعادة تعيين/,
    });
    const box = await submitButton.boundingBox();

    if (box) {
      expect(box.height).toBeGreaterThanOrEqual(44);
      expect(box.width).toBeGreaterThanOrEqual(44);
    }
  });

  // ============================================
  // FORM INTERACTION TESTS
  // ============================================

  test("should accept email input", async ({ page }) => {
    const emailInput = page.getByLabel("البريد الإلكتروني");
    await emailInput.fill("test@example.com");

    await expect(emailInput).toHaveValue("test@example.com");
  });

  test("should have proper input type for email", async ({ page }) => {
    const emailInput = page.getByLabel("البريد الإلكتروني");
    const type = await emailInput.getAttribute("type");

    expect(type).toBe("email");
  });
});
