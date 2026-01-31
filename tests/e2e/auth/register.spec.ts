import { test, expect } from "@playwright/test";
import { checkRTL } from "../../helpers/arabic.helper";

test.describe("Registration Flow", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/ar/signup");
  });

  // ============================================
  // VISUAL & LAYOUT TESTS
  // ============================================

  test("should display registration form with Arabic labels", async ({
    page,
  }) => {
    // Check RTL direction
    await checkRTL(page);

    // Check key form elements are visible with Arabic labels
    await expect(page.getByLabel(/الاسم/)).toBeVisible();
    await expect(page.getByLabel("البريد الإلكتروني")).toBeVisible();
    await expect(page.getByLabel(/كلمة المرور/)).toBeVisible();

    // Check submit button is in Arabic
    await expect(
      page.getByRole("button", { name: /إنشاء حساب|تسجيل/ }),
    ).toBeVisible();
  });

  // ============================================
  // GRADE SELECTION (CRITICAL BUSINESS RULE)
  // ============================================

  test("should display all three grade options", async ({ page }) => {
    // Check for grade buttons/options
    await expect(page.getByText(/الصف الأول الثانوي/)).toBeVisible();
    await expect(page.getByText(/الصف الثاني الثانوي/)).toBeVisible();
    await expect(page.getByText(/الصف الثالث الثانوي/)).toBeVisible();
  });

  test("should allow selecting a grade", async ({ page }) => {
    // Find and click on grade 2
    const grade2Option = page.getByText(/الصف الثاني الثانوي/).first();
    await grade2Option.click();

    // Should have visual indication of selection
    const parent = grade2Option.locator("..").first();
    const classes = await parent.getAttribute("class");

    // Check for any selection indicator class
    expect(
      classes?.includes("selected") ||
        classes?.includes("active") ||
        classes?.includes("border-primary") ||
        classes?.includes("bg-primary"),
    ).toBeTruthy();
  });

  // ============================================
  // PHONE NUMBER VALIDATION (EGYPTIAN FORMAT)
  // ============================================

  test("should have phone number input", async ({ page }) => {
    const phoneInput = page.getByLabel(/رقم الهاتف|الهاتف/);
    await expect(phoneInput).toBeVisible();
  });

  // ============================================
  // TERMS & CONDITIONS
  // ============================================

  test("should have terms acceptance checkbox", async ({ page }) => {
    const termsCheckbox = page.getByLabel(/أوافق|الشروط والأحكام/);

    if (await termsCheckbox.isVisible()) {
      await expect(termsCheckbox).not.toBeChecked();

      // Should toggle on click
      await termsCheckbox.click();
      await expect(termsCheckbox).toBeChecked();
    }
  });

  // ============================================
  // ACCESSIBILITY TESTS
  // ============================================

  test("should be keyboard navigable", async ({ page }) => {
    // Tab through form elements
    await page.keyboard.press("Tab");

    // First focusable element should be focused
    const activeElement = await page.evaluate(
      () => document.activeElement?.tagName,
    );
    expect(["INPUT", "BUTTON", "A", "SELECT"]).toContain(activeElement);
  });

  test("should have visible focus indicators on inputs", async ({ page }) => {
    const inputs = page.locator("input:visible").first();

    await inputs.focus();

    const outlineWidth = await inputs.evaluate(
      (el) => window.getComputedStyle(el).outlineWidth,
    );
    const boxShadow = await inputs.evaluate(
      (el) => window.getComputedStyle(el).boxShadow,
    );

    const hasFocusIndicator =
      parseInt(outlineWidth) > 0 || (boxShadow && boxShadow !== "none");
    expect(hasFocusIndicator).toBe(true);
  });

  // ============================================
  // RESPONSIVE TESTS
  // ============================================

  test("should not have horizontal scroll on mobile", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });

    const scrollWidth = await page.evaluate(
      () => document.documentElement.scrollWidth,
    );
    const clientWidth = await page.evaluate(
      () => document.documentElement.clientWidth,
    );

    expect(scrollWidth).toBeLessThanOrEqual(clientWidth + 5);
  });

  test("should have touch-friendly form elements on mobile", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 375, height: 667 });

    const submitButton = page.getByRole("button", { name: /إنشاء حساب|تسجيل/ });
    const box = await submitButton.boundingBox();

    if (box) {
      expect(box.height).toBeGreaterThanOrEqual(44);
      expect(box.width).toBeGreaterThanOrEqual(44);
    }
  });
});
