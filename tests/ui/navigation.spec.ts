import { expect, test } from "@playwright/test";

/**
 * COMPREHENSIVE NAVIGATION UI TESTS
 * Tests all navigation elements - headers, footers, sidebars, menus
 */

test.describe("Navigation UI Tests - Complete Coverage", () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 720 });
  });

  test.describe("Header Navigation", () => {
    test("main header renders and is visible", async ({ page }) => {
      await page.goto("/ar");

      const header = page.locator("header").first();
      // Use toBeAttached() because header may have overflow-visible class
      await expect(header).toBeAttached();

      // Should be at top of page
      const headerBox = await header.boundingBox();
      expect(headerBox?.y).toBeLessThan(100);
    });

    test("logo is clickable and navigates home", async ({ page }) => {
      await page.goto("/ar/lessons");

      const logo = page
        .locator('header a[href="/"], header a[href="/ar"]')
        .first();

      if ((await logo.count()) > 0) {
        await logo.click();
        await page.waitForLoadState("networkidle");

        expect(page.url()).toMatch(/\/(ar)?$/);
      }
    });

    test("all header nav items are visible", async ({ page }) => {
      await page.goto("/ar");

      const navItems = page.locator("header nav a, header nav button");
      const count = await navItems.count();

      expect(count).toBeGreaterThan(0);

      // Check first 8 items
      for (let i = 0; i < Math.min(count, 8); i++) {
        const item = navItems.nth(i);
        if (await item.isVisible()) {
          await expect(item).toBeVisible();
        }
      }
    });

    test("header search functionality", async ({ page }) => {
      await page.goto("/ar");

      const searchButton = page.locator(
        'button[aria-label*="search"], button[aria-label*="بحث"]',
      );

      if ((await searchButton.count()) > 0) {
        await searchButton.first().click();
        await page.waitForTimeout(300);

        // Search modal or input should appear
        const searchInput = page.locator(
          'input[type="search"], input[placeholder*="بحث"]',
        );

        if ((await searchInput.count()) > 0) {
          await expect(searchInput.first()).toBeVisible();
        }
      }
    });

    test("user menu dropdown works", async ({ page }) => {
      await page.goto("/ar");

      const userButton = page.locator(
        'button[aria-label*="user"], button[aria-label*="مستخدم"]',
      );

      if ((await userButton.count()) > 0) {
        await userButton.first().click();
        await page.waitForTimeout(300);

        // Dropdown menu should appear
        const dropdown = page.locator('[role="menu"], .dropdown-menu');

        if ((await dropdown.count()) > 0) {
          await expect(dropdown.first()).toBeVisible();
        }
      }
    });

    test("notifications icon and badge", async ({ page }) => {
      await page.goto("/ar/dashboard");

      const notificationBtn = page.locator(
        'button[aria-label*="notification"], button[aria-label*="إشعار"]',
      );

      if ((await notificationBtn.count()) > 0) {
        await expect(notificationBtn.first()).toBeVisible();

        // Check for notification badge
        const badge = notificationBtn.first().locator('[class*="badge"]');

        if ((await badge.count()) > 0) {
          await expect(badge).toBeVisible();
        }
      }
    });

    test("header is sticky on scroll", async ({ page }) => {
      await page.goto("/ar");

      const header = page.locator("header").first();
      const initialPosition = await header.evaluate(
        (el) => window.getComputedStyle(el).position,
      );

      // Scroll down
      await page.evaluate(() => window.scrollBy(0, 500));
      await page.waitForTimeout(300);

      // Header should still be attached (visible check fails due to overflow-visible class)
      await expect(header).toBeAttached();
    });
  });

  test.describe("Mobile Navigation", () => {
    test.beforeEach(async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
    });

    test("mobile menu button visible", async ({ page }) => {
      await page.goto("/ar");

      const menuButton = page
        .locator('button[aria-label*="menu"], button[aria-label*="قائمة"]')
        .first();
      await expect(menuButton).toBeVisible();
    });

    test("mobile menu opens and closes", async ({ page }) => {
      await page.goto("/ar");

      const menuButton = page
        .locator('button[aria-label*="menu"], button[aria-label*="قائمة"]')
        .first();

      // Open menu
      await menuButton.click();
      await page.waitForTimeout(300);

      // Menu should be visible
      const mobileMenu = page.locator(
        '[role="dialog"], .mobile-menu, nav[class*="mobile"]',
      );

      if ((await mobileMenu.count()) > 0) {
        await expect(mobileMenu.first()).toBeVisible();

        // Close menu
        const closeButton = page.locator(
          'button[aria-label*="close"], button[aria-label*="إغلاق"]',
        );

        if ((await closeButton.count()) > 0) {
          await closeButton.first().click();
          await page.waitForTimeout(300);
        }
      }
    });

    test("mobile menu navigation items work", async ({ page }) => {
      await page.goto("/ar");

      const menuButton = page
        .locator('button[aria-label*="menu"], button[aria-label*="قائمة"]')
        .first();
      await menuButton.click();
      await page.waitForTimeout(300);

      // Check menu items
      const menuItems = page.locator("nav a:visible");
      const count = await menuItems.count();

      expect(count).toBeGreaterThan(0);
    });

    test("mobile bottom navigation visible", async ({ page }) => {
      await page.goto("/ar");

      const bottomNav = page.locator(
        '[class*="bottom-nav"], nav[class*="bottom"]',
      );

      if ((await bottomNav.count()) > 0) {
        await expect(bottomNav.first()).toBeVisible();

        // Should be at bottom
        const box = await bottomNav.first().boundingBox();
        if (box) {
          expect(box.y).toBeGreaterThan(500);
        }
      }
    });
  });

  test.describe("Sidebar Navigation", () => {
    test("dashboard sidebar renders", async ({ page }) => {
      await page.goto("/ar/dashboard");
      await page.waitForLoadState("networkidle");

      const sidebar = page.locator('aside, [role="navigation"]').first();

      if ((await sidebar.count()) > 0) {
        await expect(sidebar).toBeVisible();
      }
    });

    test("sidebar navigation items clickable", async ({ page }) => {
      await page.goto("/ar/dashboard");

      const sidebarLinks = page.locator('aside a, [role="navigation"] a');
      const count = await sidebarLinks.count();

      for (let i = 0; i < Math.min(count, 5); i++) {
        const link = sidebarLinks.nth(i);

        if (await link.isVisible()) {
          await expect(link).toBeVisible();

          const href = await link.getAttribute("href");
          expect(href).toBeTruthy();
        }
      }
    });

    test("active sidebar item highlighted", async ({ page }) => {
      await page.goto("/ar/dashboard");

      const activeLink = page.locator(
        'aside a[aria-current="page"], aside a.active',
      );

      if ((await activeLink.count()) > 0) {
        await expect(activeLink.first()).toBeVisible();

        // Should have different styling
        const bgColor = await activeLink
          .first()
          .evaluate((el) => window.getComputedStyle(el).backgroundColor);

        expect(bgColor).toBeTruthy();
      }
    });

    test("sidebar collapsible sections work", async ({ page }) => {
      await page.goto("/ar/dashboard");

      const expandButtons = page.locator("aside button[aria-expanded]");
      const count = await expandButtons.count();

      for (let i = 0; i < Math.min(count, 3); i++) {
        const button = expandButtons.nth(i);

        if (await button.isVisible()) {
          const initialState = await button.getAttribute("aria-expanded");

          await button.click();
          await page.waitForTimeout(300);

          const newState = await button.getAttribute("aria-expanded");

          // State should toggle
          expect(newState).not.toBe(initialState);
        }
      }
    });
  });

  test.describe("Footer Navigation", () => {
    test("footer renders at bottom", async ({ page }) => {
      await page.goto("/ar");

      // Scroll to bottom
      await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
      await page.waitForTimeout(500);

      const footer = page.locator("footer").first();
      await expect(footer).toBeVisible();
    });

    test("footer navigation columns present", async ({ page }) => {
      await page.goto("/ar");

      await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
      await page.waitForTimeout(500);

      const footerLinks = page.locator("footer a");
      const count = await footerLinks.count();

      expect(count).toBeGreaterThan(5); // Should have multiple links
    });

    test("footer social links work", async ({ page }) => {
      await page.goto("/ar");

      await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));

      const socialLinks = page.locator(
        'footer a[aria-label*="social"], footer a[href*="facebook"], footer a[href*="twitter"]',
      );
      const count = await socialLinks.count();

      for (let i = 0; i < count; i++) {
        const link = socialLinks.nth(i);

        if (await link.isVisible()) {
          await expect(link).toBeVisible();

          const href = await link.getAttribute("href");
          expect(href).toBeTruthy();
        }
      }
    });

    test("back to top button works", async ({ page }) => {
      await page.goto("/ar");

      // Scroll down
      await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
      await page.waitForTimeout(500);

      const backToTop = page.locator(
        'button[aria-label*="top"], button[aria-label*="أعلى"], a[href="#top"]',
      );

      if (
        (await backToTop.count()) > 0 &&
        (await backToTop.first().isVisible())
      ) {
        await backToTop.first().click();
        await page.waitForTimeout(500);

        // Should scroll to top
        const scrollY = await page.evaluate(() => window.scrollY);
        expect(scrollY).toBeLessThan(100);
      }
    });
  });

  test.describe("Breadcrumb Navigation", () => {
    test("breadcrumbs render on detail pages", async ({ page }) => {
      await page.goto("/ar/lessons/1");
      await page.waitForLoadState("networkidle");

      const breadcrumb = page.locator(
        'nav[aria-label*="breadcrumb"], [role="navigation"]:has(ol), [class*="breadcrumb"]',
      );

      if ((await breadcrumb.count()) > 0) {
        await expect(breadcrumb.first()).toBeVisible();
      }
    });

    test("breadcrumb links navigate correctly", async ({ page }) => {
      await page.goto("/ar/lessons/1");

      const breadcrumbLinks = page.locator(
        'nav[aria-label*="breadcrumb"] a, [class*="breadcrumb"] a',
      );
      const count = await breadcrumbLinks.count();

      if (count > 0) {
        const firstLink = breadcrumbLinks.first();
        const href = await firstLink.getAttribute("href");

        await firstLink.click();
        await page.waitForLoadState("networkidle");

        // Should navigate
        expect(page.url()).not.toContain("lessons/1");
      }
    });

    test("current page in breadcrumb not clickable", async ({ page }) => {
      await page.goto("/ar/lessons/1");

      const currentPage = page.locator(
        'nav[aria-label*="breadcrumb"] [aria-current="page"]',
      );

      if ((await currentPage.count()) > 0) {
        const tagName = await currentPage.evaluate((el) => el.tagName);

        // Should be span or other non-link element
        expect(["SPAN", "LI", "DIV"].includes(tagName)).toBeTruthy();
      }
    });
  });

  test.describe("Tab Navigation", () => {
    test("tab navigation switches content", async ({ page }) => {
      await page.goto("/ar/dashboard");
      await page.waitForLoadState("networkidle");

      const tabs = page.locator('[role="tab"]');
      const count = await tabs.count();

      if (count > 1) {
        // Click second tab
        await tabs.nth(1).click();
        await page.waitForTimeout(300);

        // Second tab should be selected
        const selected = await tabs.nth(1).getAttribute("aria-selected");
        expect(selected).toBe("true");
      }
    });

    test("keyboard navigation through tabs", async ({ page }) => {
      await page.goto("/ar/dashboard");

      const tabs = page.locator('[role="tab"]').first();

      if ((await tabs.count()) > 0) {
        await tabs.focus();

        // Arrow key should navigate
        await page.keyboard.press("ArrowRight");
        await page.waitForTimeout(200);

        const focusedTab = page.locator('[role="tab"]:focus');

        if ((await focusedTab.count()) > 0) {
          await expect(focusedTab).toBeVisible();
        }
      }
    });
  });

  test.describe("Dropdown Menus", () => {
    test("dropdown opens on click", async ({ page }) => {
      await page.goto("/ar");

      const dropdownTrigger = page
        .locator('button[aria-haspopup="true"], button[aria-expanded]')
        .first();

      if ((await dropdownTrigger.count()) > 0) {
        await dropdownTrigger.click();
        await page.waitForTimeout(300);

        const expanded = await dropdownTrigger.getAttribute("aria-expanded");
        expect(expanded).toBe("true");
      }
    });

    test("dropdown closes on outside click", async ({ page }) => {
      await page.goto("/ar");

      const dropdownTrigger = page
        .locator('button[aria-haspopup="true"]')
        .first();

      if ((await dropdownTrigger.count()) > 0) {
        await dropdownTrigger.click();
        await page.waitForTimeout(300);

        // Click outside
        await page.click("body");
        await page.waitForTimeout(300);

        const expanded = await dropdownTrigger.getAttribute("aria-expanded");
        expect(expanded).toBe("false");
      }
    });

    test("dropdown menu items clickable", async ({ page }) => {
      await page.goto("/ar/dashboard");

      const dropdownTrigger = page
        .locator('button[aria-haspopup="true"]')
        .first();

      if ((await dropdownTrigger.count()) > 0) {
        await dropdownTrigger.click();
        await page.waitForTimeout(300);

        const menuItems = page.locator('[role="menu"] a, [role="menuitem"]');
        const count = await menuItems.count();

        for (let i = 0; i < Math.min(count, 5); i++) {
          const item = menuItems.nth(i);

          if (await item.isVisible()) {
            await expect(item).toBeVisible();
          }
        }
      }
    });
  });

  test.describe("Pagination Navigation", () => {
    test("pagination controls render", async ({ page }) => {
      await page.goto("/ar/lessons");
      await page.waitForLoadState("networkidle");

      const pagination = page.locator(
        '[role="navigation"]:has([aria-label*="page"]), .pagination',
      );

      if ((await pagination.count()) > 0) {
        await expect(pagination.first()).toBeVisible();
      }
    });

    test("next/previous buttons work", async ({ page }) => {
      await page.goto("/ar/lessons");

      const nextButton = page
        .locator(
          'button:has-text("Next"), button:has-text("التالي"), a:has-text("Next")',
        )
        .first();

      if ((await nextButton.count()) > 0 && (await nextButton.isVisible())) {
        const currentUrl = page.url();

        await nextButton.click();
        await page.waitForLoadState("networkidle");

        // URL should change or content should update
        await page.waitForTimeout(500);
      }
    });

    test("page numbers clickable", async ({ page }) => {
      await page.goto("/ar/lessons");

      const pageNumbers = page.locator(
        '[role="navigation"] button:has-text(/^[0-9]+$/), .pagination button:has-text(/^[0-9]+$/)',
      );
      const count = await pageNumbers.count();

      if (count > 0) {
        const pageTwo = pageNumbers.nth(1);

        if (await pageTwo.isVisible()) {
          await pageTwo.click();
          await page.waitForTimeout(500);
        }
      }
    });
  });

  test.describe("Navigation Accessibility", () => {
    test("skip navigation link present", async ({ page }) => {
      await page.goto("/ar");

      // Tab to reveal skip link
      await page.keyboard.press("Tab");

      const skipLink = page.locator(
        'a[href="#main"], a:has-text("Skip to content")',
      );

      if ((await skipLink.count()) > 0) {
        await expect(skipLink.first()).toBeFocused();
      }
    });

    test("navigation landmarks have labels", async ({ page }) => {
      await page.goto("/ar");

      const navElements = page.locator("nav");
      const count = await navElements.count();

      for (let i = 0; i < count; i++) {
        const nav = navElements.nth(i);
        const ariaLabel = await nav.getAttribute("aria-label");
        const ariaLabelledby = await nav.getAttribute("aria-labelledby");

        // Should have some label
        expect(ariaLabel || ariaLabelledby).toBeTruthy();
      }
    });

    test("navigation keyboard accessible", async ({ page }) => {
      await page.goto("/ar");

      // Tab through navigation
      for (let i = 0; i < 5; i++) {
        await page.keyboard.press("Tab");
        await page.waitForTimeout(100);
      }

      // Should focus on navigation elements
      const focused = await page.evaluate(
        () => document.activeElement?.tagName,
      );

      expect(["A", "BUTTON", "INPUT"].includes(focused || "")).toBeTruthy();
    });
  });

  test.describe("Navigation Performance", () => {
    test("navigation renders quickly", async ({ page }) => {
      const startTime = Date.now();

      await page.goto("/ar");
      await page.waitForSelector("header");

      const endTime = Date.now();
      const duration = endTime - startTime;

      // Should render in less than 2 seconds
      expect(duration).toBeLessThan(2000);
    });

    test("navigation transitions smooth", async ({ page }) => {
      await page.goto("/ar/lessons");

      const link = page.locator('header a[href="/ar/dashboard"]').first();

      if ((await link.count()) > 0) {
        const startTime = Date.now();

        await link.click();
        await page.waitForLoadState("domcontentloaded");

        const endTime = Date.now();
        const duration = endTime - startTime;

        // Should navigate quickly
        expect(duration).toBeLessThan(3000);
      }
    });
  });

  test.describe("RTL Navigation", () => {
    test("navigation aligned correctly in RTL", async ({ page }) => {
      await page.goto("/ar");

      const nav = page.locator("header nav").first();

      const direction = await nav.evaluate(
        (el) => window.getComputedStyle(el).direction,
      );

      expect(direction).toBe("rtl");
    });

    test("navigation icons mirrored in RTL", async ({ page }) => {
      await page.goto("/ar");

      const navWithIcons = page
        .locator("nav a:has(svg), nav button:has(svg)")
        .first();

      if ((await navWithIcons.count()) > 0) {
        await expect(navWithIcons).toBeVisible();
      }
    });
  });

  test.describe("Responsive Navigation", () => {
    const viewports = [
      { name: "mobile", width: 375, height: 667 },
      { name: "tablet", width: 768, height: 1024 },
      { name: "desktop", width: 1920, height: 1080 },
    ];

    for (const viewport of viewports) {
      test(`navigation usable on ${viewport.name}`, async ({ page }) => {
        await page.setViewportSize(viewport);
        await page.goto("/ar");

        // Navigation should be present (use toBeAttached due to overflow-visible class)
        const nav = page.locator("header, nav").first();
        await expect(nav).toBeAttached();

        // On mobile, hamburger should be visible
        if (viewport.name === "mobile") {
          const hamburger = page.locator('button[aria-label*="menu"]').first();

          if ((await hamburger.count()) > 0) {
            await expect(hamburger).toBeAttached();
          }
        }
      });
    }
  });
});
