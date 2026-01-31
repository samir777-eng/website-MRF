import { test, expect } from "@playwright/test";

/**
 * COMPREHENSIVE RESPONSIVE UI TESTS
 * Tests all pages across all device sizes
 */

test.describe("Responsive UI Tests - All Viewports", () => {
  const viewports = [
    { name: "mobile-small", width: 320, height: 568, description: "iPhone SE" },
    { name: "mobile", width: 375, height: 667, description: "iPhone 8" },
    {
      name: "mobile-large",
      width: 428,
      height: 926,
      description: "iPhone 14 Pro Max",
    },
    { name: "tablet", width: 768, height: 1024, description: "iPad" },
    {
      name: "tablet-large",
      width: 1024,
      height: 1366,
      description: "iPad Pro",
    },
    { name: "desktop", width: 1280, height: 720, description: "Laptop" },
    {
      name: "desktop-large",
      width: 1920,
      height: 1080,
      description: "Full HD",
    },
    {
      name: "desktop-xl",
      width: 2560,
      height: 1440,
      description: "2K Monitor",
    },
  ];

  for (const viewport of viewports) {
    test.describe(`${viewport.name} (${viewport.width}x${viewport.height})`, () => {
      test.beforeEach(async ({ page }) => {
        await page.setViewportSize({
          width: viewport.width,
          height: viewport.height,
        });
      });

      test("homepage renders without horizontal scroll", async ({ page }) => {
        await page.goto("/ar");
        await page.waitForLoadState("networkidle");

        const bodyWidth = await page.evaluate(() => document.body.scrollWidth);
        expect(bodyWidth).toBeLessThanOrEqual(viewport.width + 5); // 5px tolerance
      });

      test("navigation accessible", async ({ page }) => {
        await page.goto("/ar");

        if (viewport.width < 768) {
          // Mobile: check for hamburger menu
          const menuButton = page
            .locator('button[aria-label*="menu"], button[aria-label*="قائمة"]')
            .first();
          await expect(menuButton).toBeVisible();
        } else {
          // Desktop: check for full navigation
          const nav = page.locator("header nav").first();
          await expect(nav).toBeVisible();
        }
      });

      test("text remains readable", async ({ page }) => {
        await page.goto("/ar");

        const body = page.locator("body");
        const fontSize = await body.evaluate(
          (el) => window.getComputedStyle(el).fontSize,
        );

        const sizeValue = parseInt(fontSize);
        expect(sizeValue).toBeGreaterThanOrEqual(14); // Minimum readable size
      });

      test("images scale appropriately", async ({ page }) => {
        await page.goto("/ar");

        const images = page.locator("img:visible");
        const count = await images.count();

        for (let i = 0; i < Math.min(count, 5); i++) {
          const img = images.nth(i);
          const box = await img.boundingBox();

          if (box) {
            // Image should not overflow viewport
            expect(box.width).toBeLessThanOrEqual(viewport.width);
          }
        }
      });

      test("buttons have adequate touch targets", async ({ page }) => {
        await page.goto("/ar");

        const buttons = page.locator(
          'button:visible, a[role="button"]:visible',
        );
        const count = await buttons.count();

        for (let i = 0; i < Math.min(count, 10); i++) {
          const button = buttons.nth(i);
          const box = await button.boundingBox();

          if (box && viewport.width < 768) {
            // On mobile, minimum touch target
            expect(box.height).toBeGreaterThanOrEqual(40);
          }
        }
      });

      test("forms usable", async ({ page }) => {
        await page.goto("/ar/auth/login");

        const emailInput = page.locator('input[type="email"]');
        await expect(emailInput).toBeVisible();

        const box = await emailInput.boundingBox();

        if (box) {
          // Input should fit in viewport
          expect(box.width).toBeLessThanOrEqual(viewport.width - 40);
        }
      });

      test("cards display correctly", async ({ page }) => {
        await page.goto("/ar/lessons");
        await page.waitForLoadState("networkidle");

        const cards = page.locator('[class*="card"]:visible');
        const count = await cards.count();

        if (count > 0) {
          const card = cards.first();
          const box = await card.boundingBox();

          if (box) {
            // Card should fit in viewport
            expect(box.width).toBeLessThanOrEqual(viewport.width);
          }
        }
      });

      test("modals fit viewport", async ({ page }) => {
        await page.goto("/ar/achievements");

        const card = page.locator('[class*="achievement"]').first();

        if ((await card.count()) > 0 && (await card.isVisible())) {
          await card.click();
          await page.waitForTimeout(500);

          const modal = page.locator('[role="dialog"]').first();

          if ((await modal.count()) > 0) {
            const box = await modal.boundingBox();

            if (box) {
              expect(box.width).toBeLessThanOrEqual(viewport.width);
              expect(box.height).toBeLessThanOrEqual(viewport.height);
            }
          }
        }
      });

      test("footer content visible", async ({ page }) => {
        await page.goto("/ar");

        await page.evaluate(() =>
          window.scrollTo(0, document.body.scrollHeight),
        );
        await page.waitForTimeout(500);

        const footer = page.locator("footer").first();
        await expect(footer).toBeVisible();
      });

      test("dashboard layout adapts", async ({ page }) => {
        await page.goto("/ar/dashboard");
        await page.waitForLoadState("networkidle");

        const main = page.locator("main").first();
        await expect(main).toBeVisible();

        const mainWidth = await main.evaluate((el) => el.clientWidth);
        expect(mainWidth).toBeLessThanOrEqual(viewport.width);
      });
    });
  }

  test.describe("Orientation Changes", () => {
    test("landscape mode on mobile", async ({ page }) => {
      await page.setViewportSize({ width: 667, height: 375 }); // Landscape
      await page.goto("/ar");

      const body = page.locator("body");
      await expect(body).toBeVisible();

      const scrollWidth = await page.evaluate(() => document.body.scrollWidth);
      expect(scrollWidth).toBeLessThanOrEqual(670);
    });

    test("portrait mode on tablet", async ({ page }) => {
      await page.setViewportSize({ width: 768, height: 1024 }); // Portrait
      await page.goto("/ar/lessons");

      const content = page.locator("main").first();
      await expect(content).toBeVisible();
    });
  });

  test.describe("Dynamic Resizing", () => {
    test("adapts when viewport changes", async ({ page }) => {
      await page.setViewportSize({ width: 1920, height: 1080 });
      await page.goto("/ar");

      // Resize to mobile
      await page.setViewportSize({ width: 375, height: 667 });
      await page.waitForTimeout(500);

      // Mobile menu should appear
      const mobileMenu = page.locator('button[aria-label*="menu"]').first();

      if ((await mobileMenu.count()) > 0) {
        await expect(mobileMenu).toBeVisible();
      }
    });
  });
});
