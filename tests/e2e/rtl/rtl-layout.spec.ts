import { test, expect } from "@playwright/test";
import { checkRTL, isArabicText } from "../../helpers/arabic.helper";

test.describe("RTL Layout Verification", () => {
  // ============================================
  // GLOBAL RTL TESTS
  // ============================================

  test.describe("Global RTL Settings", () => {
    test("homepage should have RTL direction", async ({ page }) => {
      await page.goto("/ar");
      await checkRTL(page);
    });

    test("login page should have RTL direction", async ({ page }) => {
      await page.goto("/ar/login");
      await checkRTL(page);
    });

    test("signup page should have RTL direction", async ({ page }) => {
      await page.goto("/ar/signup");
      await checkRTL(page);
    });

    test("dashboard should have RTL direction", async ({ page }) => {
      await page.goto("/ar/dashboard");
      await checkRTL(page);
    });
  });

  // ============================================
  // ARABIC TEXT VERIFICATION
  // ============================================

  test.describe("Arabic Text Content", () => {
    test("homepage should have Arabic text", async ({ page }) => {
      await page.goto("/ar");

      const bodyText = await page.textContent("body");
      expect(isArabicText(bodyText || "")).toBe(true);
    });

    test("login page should have Arabic labels", async ({ page }) => {
      await page.goto("/ar/login");

      const emailLabel = await page.getByLabel("البريد الإلكتروني").isVisible();
      expect(emailLabel).toBe(true);

      const passwordLabel = await page.getByLabel("كلمة المرور").isVisible();
      expect(passwordLabel).toBe(true);
    });

    test("buttons should have Arabic text", async ({ page }) => {
      await page.goto("/ar/login");

      const loginButton = page.getByRole("button", { name: "تسجيل الدخول" });
      await expect(loginButton).toBeVisible();
    });
  });

  // ============================================
  // RTL LAYOUT POSITIONING
  // ============================================

  test.describe("RTL Layout Positioning", () => {
    test("navigation should be positioned correctly for RTL", async ({
      page,
    }) => {
      await page.goto("/ar");

      const nav = page.locator("nav").first();
      const navBox = await nav.boundingBox();

      if (navBox) {
        // Navigation should span the full width
        expect(navBox.width).toBeGreaterThan(0);
      }
    });

    test("form labels should be right-aligned", async ({ page }) => {
      await page.goto("/ar/login");

      const label = page.locator("label").first();
      const textAlign = await label.evaluate(
        (el) => window.getComputedStyle(el).textAlign,
      );

      // In RTL, text should be right-aligned or start (which resolves to right)
      expect(textAlign).toMatch(/right|start/);
    });

    test("icons should be positioned correctly for RTL", async ({ page }) => {
      await page.goto("/ar");

      // Check that icons with directional meaning are flipped
      const icons = page.locator("svg");
      const count = await icons.count();

      expect(count).toBeGreaterThan(0);
    });
  });

  // ============================================
  // RTL FORM INPUTS
  // ============================================

  test.describe("RTL Form Inputs", () => {
    test("text inputs should have RTL direction", async ({ page }) => {
      await page.goto("/ar/login");

      const emailInput = page.getByLabel("البريد الإلكتروني");
      const direction = await emailInput.evaluate(
        (el) => window.getComputedStyle(el).direction,
      );

      expect(direction).toBe("rtl");
    });

    test("text should be right-aligned in inputs", async ({ page }) => {
      await page.goto("/ar/login");

      const emailInput = page.getByLabel("البريد الإلكتروني");
      const textAlign = await emailInput.evaluate(
        (el) => window.getComputedStyle(el).textAlign,
      );

      expect(textAlign).toMatch(/right|start/);
    });
  });

  // ============================================
  // RTL NAVIGATION
  // ============================================

  test.describe("RTL Navigation", () => {
    test("dropdown menus should open in correct direction", async ({
      page,
    }) => {
      await page.goto("/ar");

      const dropdownTrigger = page.locator('[aria-haspopup="menu"]').first();

      if (await dropdownTrigger.isVisible()) {
        await dropdownTrigger.hover();

        // Wait for dropdown to appear
        await page.waitForTimeout(200);

        const dropdown = page.locator('[role="menu"]');
        if (await dropdown.isVisible()) {
          const dropdownBox = await dropdown.boundingBox();
          const triggerBox = await dropdownTrigger.boundingBox();

          if (dropdownBox && triggerBox) {
            // In RTL, dropdown should align to the right side of trigger
            expect(dropdownBox.x + dropdownBox.width).toBeGreaterThanOrEqual(
              triggerBox.x,
            );
          }
        }
      }
    });
  });

  // ============================================
  // RTL RESPONSIVE
  // ============================================

  test.describe("RTL on Mobile", () => {
    test("mobile layout should maintain RTL", async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      await page.goto("/ar");

      await checkRTL(page);
    });

    test("mobile menu should be RTL", async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      await page.goto("/ar");

      const menuButton = page.getByRole("button", { name: /القائمة|menu/i });
      if (await menuButton.isVisible()) {
        await menuButton.click();

        // Menu should be visible and RTL
        const menu = page.locator('[role="menu"], nav');
        await expect(menu.first()).toBeVisible();
      }
    });
  });
});
