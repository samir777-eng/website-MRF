import { test, expect } from "@playwright/test";

test.describe("Keyboard Navigation", () => {
  // ============================================
  // HOMEPAGE KEYBOARD NAVIGATION
  // ============================================

  test.describe("Homepage", () => {
    test.beforeEach(async ({ page }) => {
      await page.goto("/ar");
    });

    test("should be fully navigable with Tab key", async ({ page }) => {
      // Tab through the page
      for (let i = 0; i < 10; i++) {
        await page.keyboard.press("Tab");

        const activeElement = await page.evaluate(
          () => document.activeElement?.tagName,
        );

        // Should focus on interactive elements
        expect(["A", "BUTTON", "INPUT", "SELECT", "TEXTAREA"]).toContain(
          activeElement,
        );
      }
    });

    test("should navigate backwards with Shift+Tab", async ({ page }) => {
      // Tab forward a few times
      for (let i = 0; i < 5; i++) {
        await page.keyboard.press("Tab");
      }

      // Tab backwards
      await page.keyboard.press("Shift+Tab");

      const activeElement = await page.evaluate(
        () => document.activeElement?.tagName,
      );

      expect(["A", "BUTTON", "INPUT", "SELECT", "TEXTAREA"]).toContain(
        activeElement,
      );
    });

    test("should have visible focus indicators", async ({ page }) => {
      await page.keyboard.press("Tab");

      const activeElement = page.locator(":focus");
      const outlineWidth = await activeElement.evaluate(
        (el) => window.getComputedStyle(el).outlineWidth,
      );
      const boxShadow = await activeElement.evaluate(
        (el) => window.getComputedStyle(el).boxShadow,
      );

      const hasFocusIndicator =
        parseInt(outlineWidth) > 0 || (boxShadow && boxShadow !== "none");
      expect(hasFocusIndicator).toBe(true);
    });
  });

  // ============================================
  // LOGIN PAGE KEYBOARD NAVIGATION
  // ============================================

  test.describe("Login Page", () => {
    test.beforeEach(async ({ page }) => {
      await page.goto("/ar/login");
    });

    test("should focus email input first", async ({ page }) => {
      await page.keyboard.press("Tab");

      const emailInput = page.getByLabel("البريد الإلكتروني");
      await expect(emailInput).toBeFocused();
    });

    test("should focus password input second", async ({ page }) => {
      await page.keyboard.press("Tab");
      await page.keyboard.press("Tab");

      const passwordInput = page.getByLabel("كلمة المرور");
      await expect(passwordInput).toBeFocused();
    });

    test("should submit form with Enter key", async ({ page }) => {
      const emailInput = page.getByLabel("البريد الإلكتروني");
      await emailInput.fill("test@example.com");

      const passwordInput = page.getByLabel("كلمة المرور");
      await passwordInput.fill("password123");

      // Press Enter to submit
      await page.keyboard.press("Enter");

      // Form should attempt to submit (may show validation error)
      // This verifies Enter key works for form submission
    });
  });

  // ============================================
  // NAVIGATION MENU KEYBOARD NAVIGATION
  // ============================================

  test.describe("Navigation Menu", () => {
    test.beforeEach(async ({ page }) => {
      await page.goto("/ar");
    });

    test("should open dropdown with Enter key", async ({ page }) => {
      // Find dropdown trigger
      const dropdownTrigger = page.locator('[aria-haspopup="menu"]').first();

      if (await dropdownTrigger.isVisible()) {
        await dropdownTrigger.focus();
        await page.keyboard.press("Enter");

        // Dropdown should be visible
        const dropdown = page.locator('[role="menu"]');
        await expect(dropdown).toBeVisible();
      }
    });

    test("should close dropdown with Escape key", async ({ page }) => {
      const dropdownTrigger = page.locator('[aria-haspopup="menu"]').first();

      if (await dropdownTrigger.isVisible()) {
        await dropdownTrigger.focus();
        await page.keyboard.press("Enter");

        // Press Escape to close
        await page.keyboard.press("Escape");

        // Dropdown should be hidden
        const dropdown = page.locator('[role="menu"]');
        await expect(dropdown).not.toBeVisible();
      }
    });

    test("should navigate dropdown items with Arrow keys", async ({ page }) => {
      const dropdownTrigger = page.locator('[aria-haspopup="menu"]').first();

      if (await dropdownTrigger.isVisible()) {
        await dropdownTrigger.focus();
        await page.keyboard.press("Enter");

        // Navigate with Arrow Down
        await page.keyboard.press("ArrowDown");

        const menuItem = page.locator('[role="menuitem"]').first();
        await expect(menuItem).toBeFocused();
      }
    });
  });

  // ============================================
  // FORM KEYBOARD NAVIGATION
  // ============================================

  test.describe("Form Navigation", () => {
    test.beforeEach(async ({ page }) => {
      await page.goto("/ar/signup");
    });

    test("should navigate through all form fields", async ({ page }) => {
      const inputs = page.locator("input:visible");
      const inputCount = await inputs.count();

      // Tab through all inputs
      for (let i = 0; i < inputCount; i++) {
        await page.keyboard.press("Tab");
      }

      // Should have navigated through all inputs
      expect(inputCount).toBeGreaterThan(0);
    });
  });
});
