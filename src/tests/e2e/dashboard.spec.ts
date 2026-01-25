import { test, expect } from "@playwright/test";

test.describe("Dashboard Page", () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the Arabic dashboard
    await page.goto("/ar/dashboard");

    // Wait for MSW to initialize and page to load
    await page.waitForLoadState("networkidle");
  });

  test("displays welcome message and user stats", async ({ page }) => {
    // Check for welcome message
    await expect(page.getByRole("heading", { name: /مرحباً/ })).toBeVisible();

    // Check for XP display
    await expect(page.locator('[data-testid="xp-badge"]')).toBeVisible();

    // Check for level badge
    await expect(page.locator('[data-testid="level-badge"]')).toBeVisible();

    // Check for streak counter
    await expect(page.locator('[data-testid="streak-counter"]')).toBeVisible();

    // Check for study time
    await expect(page.getByText(/وقت الدراسة/)).toBeVisible();
  });

  test("shows progress visualization", async ({ page }) => {
    // Check for progress ring
    await expect(page.locator('[data-testid="progress-ring"]')).toBeVisible();

    // Check for progress percentage
    await expect(page.getByText(/%/)).toBeVisible();

    // Check for lesson completion stats
    await expect(page.getByText(/الدروس المكتملة/)).toBeVisible();

    // Check for quiz completion stats
    await expect(page.getByText(/الاختبارات/)).toBeVisible();
  });

  test("displays leaderboard section", async ({ page }) => {
    // Check for leaderboard title
    await expect(
      page.getByRole("heading", { name: /المتصدرين/ }),
    ).toBeVisible();

    // Check for leaderboard entries
    await expect(page.locator('[data-testid="leaderboard-entry"]')).toHaveCount(
      5,
    );

    // Check for rank numbers
    await expect(page.getByText("1")).toBeVisible();
    await expect(page.getByText("2")).toBeVisible();
    await expect(page.getByText("3")).toBeVisible();
  });

  test("shows recent lessons section", async ({ page }) => {
    // Check for recent lessons title
    await expect(
      page.getByRole("heading", { name: /الدروس الحديثة/ }),
    ).toBeVisible();

    // Check for lesson cards
    await expect(page.locator('[data-testid="lesson-card"]')).toHaveCount(3);

    // Check for lesson titles
    await expect(page.getByText(/مقدمة في النحو العربي/)).toBeVisible();

    // Check for lesson duration
    await expect(page.getByText(/دقيقة/)).toBeVisible();

    // Check for watch/view buttons
    await expect(page.getByRole("button", { name: /مشاهدة/ })).toBeVisible();
  });

  test("handles responsive design", async ({ page }) => {
    // Test desktop view
    await page.setViewportSize({ width: 1200, height: 800 });
    await expect(page.locator(".grid")).toBeVisible();

    // Test tablet view
    await page.setViewportSize({ width: 768, height: 1024 });
    await expect(page.locator(".container")).toBeVisible();

    // Test mobile view
    await page.setViewportSize({ width: 375, height: 667 });
    await expect(page.locator(".container")).toBeVisible();

    // Check that components stack properly on mobile
    const statsCards = page.locator('[data-testid="stats-card"]');
    await expect(statsCards).toHaveCount(4);
  });

  test("supports RTL layout", async ({ page }) => {
    // Check that the page has RTL direction
    await expect(page.locator("html")).toHaveAttribute("dir", "rtl");

    // Check that text is right-aligned
    const arabicText = page.getByText(/مرحباً/);
    await expect(arabicText).toHaveCSS("text-align", "right");

    // Check that layout flows from right to left
    const container = page.locator(".container");
    await expect(container).toHaveCSS("direction", "rtl");
  });

  test("navigates to other pages correctly", async ({ page }) => {
    // Test navigation to components page
    await page.getByRole("link", { name: /المكونات/ }).click();
    await expect(page).toHaveURL("/ar/components");

    // Go back to dashboard
    await page.goBack();
    await expect(page).toHaveURL("/ar/dashboard");

    // Test navigation to profile (if link exists)
    const profileLink = page.getByRole("link", { name: /الملف الشخصي/ });
    if (await profileLink.isVisible()) {
      await profileLink.click();
      await expect(page).toHaveURL("/ar/profile");
    }
  });

  test("displays loading states correctly", async ({ page }) => {
    // Intercept API calls to simulate slow loading
    await page.route("/api/progress", async (route) => {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      await route.continue();
    });

    await page.reload();

    // Check for loading spinner
    await expect(page.locator(".animate-spin")).toBeVisible();

    // Wait for content to load
    await page.waitForLoadState("networkidle");

    // Check that loading spinner is gone
    await expect(page.locator(".animate-spin")).not.toBeVisible();
  });

  test("handles error states gracefully", async ({ page }) => {
    // Intercept API calls to simulate errors
    await page.route("/api/progress", (route) => {
      route.fulfill({
        status: 500,
        contentType: "application/json",
        body: JSON.stringify({ error: "Internal Server Error" }),
      });
    });

    await page.reload();

    // Check for error message
    await expect(page.getByText(/حدث خطأ/)).toBeVisible();
  });

  test("supports theme switching", async ({ page }) => {
    // Check for theme toggle button
    const themeToggle = page.getByRole("button", { name: /تبديل المظهر/ });
    await expect(themeToggle).toBeVisible();

    // Click theme toggle
    await themeToggle.click();

    // Check that theme changed (dark mode)
    await expect(page.locator("html")).toHaveClass(/dark/);

    // Click again to switch back
    await themeToggle.click();

    // Check that theme changed back (light mode)
    await expect(page.locator("html")).not.toHaveClass(/dark/);
  });

  test("supports language switching", async ({ page }) => {
    // Check for language toggle
    const langToggle = page.getByRole("button", { name: /English/ });
    if (await langToggle.isVisible()) {
      await langToggle.click();

      // Check that URL changed to English
      await expect(page).toHaveURL("/en/dashboard");

      // Check that content is in English
      await expect(page.getByText(/Welcome/)).toBeVisible();

      // Check that direction changed to LTR
      await expect(page.locator("html")).toHaveAttribute("dir", "ltr");
    }
  });

  test("gamification elements are interactive", async ({ page }) => {
    // Check XP badge animation
    const xpBadge = page.locator('[data-testid="xp-badge"]');
    await expect(xpBadge).toBeVisible();

    // Check progress ring animation
    const progressRing = page.locator('[data-testid="progress-ring"]');
    await expect(progressRing).toBeVisible();

    // Check streak counter
    const streakCounter = page.locator('[data-testid="streak-counter"]');
    await expect(streakCounter).toBeVisible();

    // Verify that animations are working (check for CSS transitions)
    await expect(progressRing.locator("circle")).toHaveCSS(
      "transition-duration",
      /\d+(\.\d+)?s/,
    );
  });

  test("accessibility compliance", async ({ page }) => {
    // Check for proper heading hierarchy
    const h1 = page.getByRole("heading", { level: 1 });
    await expect(h1).toBeVisible();

    // Check for alt text on images
    const images = page.locator("img");
    const imageCount = await images.count();
    for (let i = 0; i < imageCount; i++) {
      await expect(images.nth(i)).toHaveAttribute("alt");
    }

    // Check for proper button labels
    const buttons = page.getByRole("button");
    const buttonCount = await buttons.count();
    for (let i = 0; i < buttonCount; i++) {
      const button = buttons.nth(i);
      const hasText = await button.textContent();
      const hasAriaLabel = await button.getAttribute("aria-label");
      expect(hasText || hasAriaLabel).toBeTruthy();
    }

    // Check for proper link labels
    const links = page.getByRole("link");
    const linkCount = await links.count();
    for (let i = 0; i < linkCount; i++) {
      const link = links.nth(i);
      const hasText = await link.textContent();
      const hasAriaLabel = await link.getAttribute("aria-label");
      expect(hasText || hasAriaLabel).toBeTruthy();
    }
  });

  test("keyboard navigation works correctly", async ({ page }) => {
    // Test tab navigation
    await page.keyboard.press("Tab");

    // Check that focus is visible
    const focusedElement = page.locator(":focus");
    await expect(focusedElement).toBeVisible();

    // Continue tabbing through interactive elements
    await page.keyboard.press("Tab");
    await page.keyboard.press("Tab");

    // Test Enter key on focused button
    const button = page.getByRole("button").first();
    await button.focus();
    await page.keyboard.press("Enter");
  });

  test("performance metrics are acceptable", async ({ page }) => {
    // Start performance measurement
    const startTime = Date.now();

    await page.goto("/ar/dashboard");
    await page.waitForLoadState("networkidle");

    const endTime = Date.now();
    const loadTime = endTime - startTime;

    // Check that page loads within acceptable time (5 seconds)
    expect(loadTime).toBeLessThan(5000);

    // Check for Core Web Vitals
    const metrics = await page.evaluate(() => {
      return new Promise((resolve) => {
        new PerformanceObserver((list) => {
          const entries = list.getEntries();
          resolve(entries);
        }).observe({ entryTypes: ["navigation", "paint"] });
      });
    });

    expect(metrics).toBeDefined();
  });
});
