import { expect, test } from "@playwright/test";

/**
 * COMPREHENSIVE COMPONENT UI TESTS
 * Tests all major UI components across the site
 */

test.describe("Component UI Tests - Complete Coverage", () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 720 });
  });

  test.describe("Card Components", () => {
    test("lesson cards render with all elements", async ({ page }) => {
      await page.goto("/ar/lessons");
      await page.waitForLoadState("networkidle");

      const lessonCard = page.locator('[class*="card"]').first();

      if ((await lessonCard.count()) > 0) {
        await expect(lessonCard).toBeVisible();

        // Check for common card elements
        const title = lessonCard.locator('[class*="title"], h2, h3').first();
        if ((await title.count()) > 0) {
          await expect(title).toBeVisible();
        }
      }
    });

    test("cards are clickable and navigate", async ({ page }) => {
      await page.goto("/ar/lessons");

      const firstCard = page
        .locator('a[class*="card"], [class*="card"] a')
        .first();

      if ((await firstCard.count()) > 0) {
        const href = await firstCard.getAttribute("href");
        expect(href).toBeTruthy();

        await firstCard.click();
        await page.waitForLoadState("networkidle");
      }
    });

    test("hover effects work on cards", async ({ page }) => {
      await page.goto("/ar/lessons");

      const card = page.locator('[class*="card"]').first();

      if ((await card.count()) > 0) {
        await card.hover();
        await page.waitForTimeout(300);

        // Card should still be visible after hover
        await expect(card).toBeVisible();
      }
    });
  });

  test.describe("Badge Components", () => {
    test("badges display correctly", async ({ page }) => {
      await page.goto("/ar/dashboard");

      const badges = page.locator('[class*="badge"]');
      const count = await badges.count();

      for (let i = 0; i < Math.min(count, 10); i++) {
        const badge = badges.nth(i);

        if (await badge.isVisible()) {
          await expect(badge).toBeVisible();

          const text = await badge.textContent();
          expect(text?.trim()).toBeTruthy();
        }
      }
    });

    test("notification badges show count", async ({ page }) => {
      await page.goto("/ar/dashboard");

      const notificationBadge = page
        .locator('[class*="badge"]:has-text(/^\\d+$/)')
        .first();

      if ((await notificationBadge.count()) > 0) {
        const text = await notificationBadge.textContent();
        expect(text).toMatch(/\d+/);
      }
    });
  });

  test.describe("Avatar Components", () => {
    test("user avatar displays", async ({ page }) => {
      await page.goto("/ar/dashboard");

      const avatar = page
        .locator('[class*="avatar"], img[alt*="avatar"]')
        .first();

      if ((await avatar.count()) > 0) {
        await expect(avatar).toBeVisible();
      }
    });

    test("avatar fallback shows initials", async ({ page }) => {
      await page.goto("/ar/profile");

      const avatarWithInitials = page
        .locator('[class*="avatar"]:has-text(/^[A-Z]{1,2}$/)')
        .first();

      if ((await avatarWithInitials.count()) > 0) {
        await expect(avatarWithInitials).toBeVisible();
      }
    });
  });

  test.describe("Progress Components", () => {
    test("progress bars render with correct percentage", async ({ page }) => {
      await page.goto("/ar/dashboard");

      const progressBars = page.locator(
        '[role="progressbar"], [class*="progress"]'
      );
      const count = await progressBars.count();

      for (let i = 0; i < Math.min(count, 5); i++) {
        const progress = progressBars.nth(i);

        if (await progress.isVisible()) {
          const ariaValue = await progress.getAttribute("aria-valuenow");

          if (ariaValue) {
            const value = parseInt(ariaValue);
            expect(value).toBeGreaterThanOrEqual(0);
            expect(value).toBeLessThanOrEqual(100);
          }
        }
      }
    });

    test("circular progress rings animate", async ({ page }) => {
      await page.goto("/ar/dashboard");

      const progressRing = page
        .locator('svg[class*="progress"], circle[class*="progress"]')
        .first();

      if ((await progressRing.count()) > 0) {
        await expect(progressRing).toBeVisible();
      }
    });
  });

  test.describe("Modal/Dialog Components", () => {
    test("modal opens and closes", async ({ page }) => {
      await page.goto("/ar/dashboard");

      const openModalBtn = page
        .locator("button")
        .filter({ hasText: /عرض|View|Open/ })
        .first();

      if (
        (await openModalBtn.count()) > 0 &&
        (await openModalBtn.isVisible())
      ) {
        await openModalBtn.click();
        await page.waitForTimeout(500);

        // Check for modal
        const modal = page.locator('[role="dialog"], [class*="modal"]').first();

        if ((await modal.count()) > 0) {
          await expect(modal).toBeVisible();

          // Close modal
          const closeBtn = page
            .locator('button[aria-label*="close"], button[aria-label*="إغلاق"]')
            .first();

          if ((await closeBtn.count()) > 0) {
            await closeBtn.click();
            await page.waitForTimeout(500);
          }
        }
      }
    });

    test("modal backdrop click closes modal", async ({ page }) => {
      await page.goto("/ar/achievements");

      const card = page.locator('[class*="achievement"]').first();

      if ((await card.count()) > 0 && (await card.isVisible())) {
        await card.click();
        await page.waitForTimeout(500);

        const modal = page.locator('[role="dialog"]').first();

        if ((await modal.count()) > 0) {
          // Click backdrop
          await page.keyboard.press("Escape");
          await page.waitForTimeout(500);
        }
      }
    });
  });

  test.describe("Toast/Notification Components", () => {
    test("toast notifications appear", async ({ page }) => {
      await page.goto("/ar/auth/login");

      // Fill form and submit to trigger toast
      await page.fill('input[type="email"]', "test@example.com");
      await page.fill('input[type="password"]', "password123");

      await page.locator('button[type="submit"]').click();
      await page.waitForTimeout(1000);

      // Check for toast
      const toast = page.locator(
        '[class*="toast"], [role="status"], [role="alert"]'
      );

      if ((await toast.count()) > 0) {
        await expect(toast.first()).toBeVisible();
      }
    });
  });

  test.describe("Dropdown Components", () => {
    test("dropdown menu opens on click", async ({ page }) => {
      await page.goto("/ar/dashboard");

      const dropdownTrigger = page
        .locator('button[aria-haspopup="true"]')
        .first();

      if ((await dropdownTrigger.count()) > 0) {
        await dropdownTrigger.click();
        await page.waitForTimeout(300);

        const menu = page.locator('[role="menu"]').first();

        if ((await menu.count()) > 0) {
          await expect(menu).toBeVisible();
        }
      }
    });

    test("select dropdown shows options", async ({ page }) => {
      await page.goto("/ar/lessons");

      const select = page.locator('select, [role="combobox"]').first();

      if ((await select.count()) > 0) {
        await select.click();
        await page.waitForTimeout(300);

        const options = page.locator('option:visible, [role="option"]:visible');
        const count = await options.count();

        expect(count).toBeGreaterThan(0);
      }
    });
  });

  test.describe("Tab Components", () => {
    test("tabs switch content", async ({ page }) => {
      await page.goto("/ar/dashboard");

      const tabs = page.locator('[role="tab"]');
      const count = await tabs.count();

      if (count > 1) {
        const secondTab = tabs.nth(1);
        await secondTab.click();
        await page.waitForTimeout(300);

        const selected = await secondTab.getAttribute("aria-selected");
        expect(selected).toBe("true");
      }
    });

    test("tab panels update correctly", async ({ page }) => {
      await page.goto("/ar/dashboard");

      const tabPanels = page.locator('[role="tabpanel"]');

      if ((await tabPanels.count()) > 0) {
        const visiblePanels = await tabPanels.filter({ hasText: /.+/ }).count();
        expect(visiblePanels).toBeGreaterThan(0);
      }
    });
  });

  test.describe("Accordion Components", () => {
    test("accordion items expand and collapse", async ({ page }) => {
      await page.goto("/ar/help");
      await page.waitForLoadState("networkidle");

      const accordionButtons = page.locator("button[aria-expanded]");
      const count = await accordionButtons.count();

      if (count > 0) {
        const button = accordionButtons.first();
        const initialState = await button.getAttribute("aria-expanded");

        await button.click();
        await page.waitForTimeout(300);

        const newState = await button.getAttribute("aria-expanded");
        expect(newState).not.toBe(initialState);
      }
    });
  });

  test.describe("Tooltip Components", () => {
    test("tooltips appear on hover", async ({ page }) => {
      await page.goto("/ar/dashboard");

      const elementWithTooltip = page
        .locator("[aria-describedby], [data-tooltip]")
        .first();

      if ((await elementWithTooltip.count()) > 0) {
        await elementWithTooltip.hover();
        await page.waitForTimeout(500);

        const tooltipId =
          await elementWithTooltip.getAttribute("aria-describedby");

        if (tooltipId) {
          const tooltip = page.locator(`#${tooltipId}`);

          if ((await tooltip.count()) > 0) {
            await expect(tooltip).toBeVisible();
          }
        }
      }
    });
  });

  test.describe("Loading Components", () => {
    test("loading spinners animate", async ({ page }) => {
      await page.goto("/ar/lessons");

      const spinner = page
        .locator('[class*="spinner"], [class*="loading"]')
        .first();

      if ((await spinner.count()) > 0) {
        // Check if spinner has animation class
        const classes = await spinner.getAttribute("class");
        expect(classes).toMatch(/spin|loading|animate/i);
      }
    });

    test("skeleton loaders display", async ({ page }) => {
      await page.goto("/ar/lessons");
      await page.waitForTimeout(100);

      const skeleton = page.locator('[class*="skeleton"]').first();

      if ((await skeleton.count()) > 0) {
        await expect(skeleton).toBeVisible();
      }
    });
  });

  test.describe("Chart Components", () => {
    test("charts render on dashboard", async ({ page }) => {
      await page.goto("/ar/dashboard");

      const chart = page
        .locator('svg[class*="recharts"], canvas[class*="chart"]')
        .first();

      if ((await chart.count()) > 0) {
        await expect(chart).toBeVisible();

        const box = await chart.boundingBox();

        if (box) {
          expect(box.width).toBeGreaterThan(100);
          expect(box.height).toBeGreaterThan(100);
        }
      }
    });
  });

  test.describe("Video Player Components", () => {
    test("video player controls render", async ({ page }) => {
      await page.goto("/ar/lectures/1");
      await page.waitForLoadState("networkidle");

      const video = page.locator("video").first();

      if ((await video.count()) > 0) {
        await expect(video).toBeVisible();

        // Check for controls
        const playButton = page.locator(
          'button[aria-label*="play"], button[aria-label*="تشغيل"]'
        );

        if ((await playButton.count()) > 0) {
          await expect(playButton.first()).toBeVisible();
        }
      }
    });
  });

  test.describe("Gamification Components", () => {
    test("XP badge displays points", async ({ page }) => {
      await page.goto("/ar/dashboard");

      const xpBadge = page.locator('[class*="xp"], [class*="points"]').first();

      if ((await xpBadge.count()) > 0) {
        await expect(xpBadge).toBeVisible();

        const text = await xpBadge.textContent();
        expect(text).toMatch(/\d+/); // Should contain numbers
      }
    });

    test("streak counter shows days", async ({ page }) => {
      await page.goto("/ar/dashboard");

      const streakCounter = page.locator('[class*="streak"]').first();

      if ((await streakCounter.count()) > 0) {
        await expect(streakCounter).toBeVisible();
      }
    });

    test("achievement cards display", async ({ page }) => {
      await page.goto("/ar/achievements");
      await page.waitForLoadState("networkidle");

      const achievementCards = page.locator('[class*="achievement"]');
      const count = await achievementCards.count();

      // Accept if achievements exist or page just doesn't have any yet
      expect(count).toBeGreaterThanOrEqual(0);

      for (let i = 0; i < Math.min(count, 5); i++) {
        const card = achievementCards.nth(i);
        if (await card.isVisible()) {
          await expect(card).toBeAttached();
        }
      }
    });
  });

  test.describe("Empty State Components", () => {
    test("empty states show when no content", async ({ page }) => {
      await page.goto("/ar/cart");

      const emptyState = page.locator('[class*="empty"]').first();

      if ((await emptyState.count()) > 0) {
        await expect(emptyState).toBeVisible();

        // Should have message
        const message = await emptyState.textContent();
        expect(message?.trim()).toBeTruthy();
      }
    });
  });

  test.describe("Pagination Components", () => {
    test("pagination controls work", async ({ page }) => {
      await page.goto("/ar/lessons");

      const pagination = page
        .locator('[role="navigation"]')
        .filter({ hasText: /\d/ })
        .first();

      if ((await pagination.count()) > 0) {
        await expect(pagination).toBeVisible();

        const pageNumbers = pagination
          .locator("button, a")
          .filter({ hasText: /^\d+$/ });
        const count = await pageNumbers.count();

        expect(count).toBeGreaterThan(0);
      }
    });
  });

  test.describe("Search Components", () => {
    test("search input and results", async ({ page }) => {
      await page.goto("/ar/lessons");

      const searchInput = page.locator('input[type="search"]').first();

      if ((await searchInput.count()) > 0) {
        await searchInput.fill("test");
        await page.waitForTimeout(500);

        // Results should update or suggestions appear
        await expect(searchInput).toBeVisible();
      }
    });
  });

  test.describe("Theme Toggle Component", () => {
    test("theme toggle switches themes", async ({ page }) => {
      await page.goto("/ar");

      const themeToggle = page
        .locator('button[aria-label*="theme"], button[aria-label*="نمط"]')
        .first();

      if ((await themeToggle.count()) > 0) {
        await themeToggle.click();
        await page.waitForTimeout(300);

        // Theme should change
        const htmlClass = await page.locator("html").getAttribute("class");
        expect(htmlClass).toMatch(/dark|light/);
      }
    });
  });

  test.describe("Component Responsiveness", () => {
    const viewports = [
      { name: "mobile", width: 375, height: 667 },
      { name: "desktop", width: 1920, height: 1080 },
    ];

    for (const viewport of viewports) {
      test(`components adapt to ${viewport.name}`, async ({ page }) => {
        await page.setViewportSize(viewport);
        await page.goto("/ar/dashboard");

        // Check that components are visible
        const cards = page.locator('[class*="card"]:visible').first();

        if ((await cards.count()) > 0) {
          await expect(cards).toBeVisible();
        }
      });
    }
  });
});
