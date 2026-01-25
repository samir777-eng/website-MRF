import { expect, test } from "@playwright/test";

test.describe("User Journey - Arabic Learning Platform", () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the Arabic homepage
    await page.goto("/ar");
  });

  test("Complete user onboarding flow", async ({ page }) => {
    // Check if homepage loads correctly
    await expect(page).toHaveTitle(/منصة الأستاذ رضا الفاروق/);

    // Check Arabic RTL layout
    await expect(page.locator("html")).toHaveAttribute("dir", "rtl");
    await expect(page.locator("html")).toHaveAttribute("lang", "ar");

    // Check main navigation elements
    await expect(page.getByRole("link", { name: "الرئيسية" })).toBeVisible();
    await expect(page.getByRole("link", { name: "المحاضرات" })).toBeVisible();
    await expect(page.getByRole("link", { name: "الاختبارات" })).toBeVisible();

    // Check hero section
    await expect(page.getByRole("heading", { level: 1 })).toContainText(
      "مرحباً بكم"
    );

    // Check grade selection cards
    const gradeCards = page.locator('[data-testid="grade-card"]');
    await expect(gradeCards).toHaveCount(3);

    // Click on first grade card
    await gradeCards.first().click();

    // Should navigate to lessons page
    await expect(page).toHaveURL(/\/ar\/lessons/);
  });

  test("Navigate through lessons", async ({ page }) => {
    // Go to lessons page
    await page.goto("/ar/lessons");

    // Check page title and content
    await expect(
      page.getByRole("heading", { name: "المحاضرات" })
    ).toBeVisible();

    // Check search functionality
    const searchInput = page.getByPlaceholder("ابحث في المحاضرات...");
    await expect(searchInput).toBeVisible();
    await searchInput.fill("النحو");

    // Check lesson cards
    const lessonCards = page.locator('[data-testid="lesson-card"]');
    await expect(lessonCards.first()).toBeVisible();

    // Click on first lesson
    await lessonCards.first().click();

    // Should navigate to lesson detail page
    await expect(page).toHaveURL(/\/ar\/lessons\/\d+/);

    // Check lesson detail elements
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    await expect(page.locator('[data-testid="video-player"]')).toBeVisible();
    await expect(page.locator('[data-testid="lesson-progress"]')).toBeVisible();
  });

  test("Take a challenge", async ({ page }) => {
    // Go to challenges page
    await page.goto("/ar/challenges");

    // Check page elements
    await expect(page.getByRole("heading", { name: "التحديات" })).toBeVisible();

    // Check stats cards
    const statsCards = page.locator('[data-testid="stats-card"]');
    await expect(statsCards).toHaveCount(2);

    // Click on first challenge
    const challengeCards = page.locator('[data-testid="challenge-card"]');
    await expect(challengeCards.first()).toBeVisible();
    await challengeCards.first().click();

    // Should navigate to challenge detail page
    await expect(page).toHaveURL(/\/ar\/challenges\/\d+/);

    // Start challenge
    await page.getByRole("button", { name: "ابدأ التحدي" }).click();

    // Answer first question (multiple choice)
    const firstOption = page.locator('[data-testid="quiz-option"]').first();
    await firstOption.click();

    // Submit answer
    await page.getByRole("button", { name: "تأكيد الإجابة" }).click();

    // Check explanation appears
    await expect(page.locator('[data-testid="explanation"]')).toBeVisible();

    // Continue to next question
    await page.getByRole("button", { name: "التالي" }).click();

    // Check progress updates
    const progressBar = page.locator('[data-testid="quiz-progress"]');
    await expect(progressBar).toBeVisible();
  });

  test("Dashboard functionality", async ({ page }) => {
    // Go to dashboard
    await page.goto("/ar/dashboard");

    // Check welcome message
    await expect(page.getByText("مرحباً، أحمد محمد!")).toBeVisible();

    // Check stats overview cards
    const statsCards = page.locator('[data-testid="stats-card"]');
    await expect(statsCards).toHaveCount(4);

    // Check gamification elements
    await expect(page.locator('[data-testid="xp-badge"]')).toBeVisible();
    await expect(page.locator('[data-testid="level-badge"]')).toBeVisible();

    // Check progress rings
    const progressRings = page.locator('[data-testid="progress-ring"]');
    await expect(progressRings).toHaveCount(2);

    // Check recent activity
    await expect(
      page.getByRole("heading", { name: "النشاط الأخير" })
    ).toBeVisible();

    // Check daily streak component
    await expect(page.locator('[data-testid="daily-streak"]')).toBeVisible();

    // Check quests panel
    await expect(page.locator('[data-testid="quests-panel"]')).toBeVisible();
  });

  test("Language switching", async ({ page }) => {
    // Start on Arabic page
    await expect(page.locator("html")).toHaveAttribute("lang", "ar");

    // Find and click language switcher
    const langSwitcher = page.locator('[data-testid="language-switcher"]');
    await langSwitcher.click();

    // Select English
    await page.getByRole("option", { name: "English" }).click();

    // Should navigate to English version
    await expect(page).toHaveURL(/\/en/);
    await expect(page.locator("html")).toHaveAttribute("lang", "en");
    await expect(page.locator("html")).toHaveAttribute("dir", "ltr");

    // Check English content
    await expect(page.getByRole("link", { name: "Home" })).toBeVisible();
    await expect(page.getByRole("link", { name: "Lessons" })).toBeVisible();
  });

  test("Mobile responsiveness", async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });

    // Check mobile navigation
    const mobileMenuButton = page.locator('[data-testid="mobile-menu-button"]');
    await expect(mobileMenuButton).toBeVisible();

    // Open mobile menu
    await mobileMenuButton.click();

    // Check mobile menu items
    await expect(page.getByRole("link", { name: "الرئيسية" })).toBeVisible();
    await expect(page.getByRole("link", { name: "المحاضرات" })).toBeVisible();

    // Check responsive layout on lessons page
    await page.goto("/ar/lessons");

    // Lessons should stack vertically on mobile
    const lessonCards = page.locator('[data-testid="lesson-card"]');
    const firstCard = lessonCards.first();
    const secondCard = lessonCards.nth(1);

    const firstCardBox = await firstCard.boundingBox();
    const secondCardBox = await secondCard.boundingBox();

    // Second card should be below first card (higher y position)
    expect(secondCardBox?.y).toBeGreaterThan(firstCardBox?.y || 0);
  });

  test("Accessibility features", async ({ page }) => {
    // Check for proper heading hierarchy
    const h1 = page.locator("h1");
    await expect(h1).toHaveCount(1);

    // Check for alt text on images
    const images = page.locator("img");
    const imageCount = await images.count();

    for (let i = 0; i < imageCount; i++) {
      const img = images.nth(i);
      await expect(img).toHaveAttribute("alt");
    }

    // Check for proper form labels
    const inputs = page.locator("input");
    const inputCount = await inputs.count();

    for (let i = 0; i < inputCount; i++) {
      const input = inputs.nth(i);
      const id = await input.getAttribute("id");
      if (id) {
        const label = page.locator(`label[for="${id}"]`);
        await expect(label).toBeVisible();
      }
    }

    // Check for proper button text
    const buttons = page.locator("button");
    const buttonCount = await buttons.count();

    for (let i = 0; i < buttonCount; i++) {
      const button = buttons.nth(i);
      const text = await button.textContent();
      const ariaLabel = await button.getAttribute("aria-label");

      // Button should have either text content or aria-label
      expect(text || ariaLabel).toBeTruthy();
    }

    // Check color contrast (basic check)
    await page.addStyleTag({
      content: `
        * {
          background-color: white !important;
          color: black !important;
        }
      `,
    });

    // Page should still be readable with high contrast
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  });

  test("Performance metrics", async ({ page }) => {
    // Start performance monitoring
    await page.goto("/ar", { waitUntil: "networkidle" });

    // Measure page load performance
    const performanceMetrics = await page.evaluate(() => {
      const navigation = performance.getEntriesByType(
        "navigation"
      )[0] as PerformanceNavigationTiming;
      return {
        domContentLoaded:
          navigation.domContentLoadedEventEnd -
          navigation.domContentLoadedEventStart,
        loadComplete: navigation.loadEventEnd - navigation.loadEventStart,
        firstPaint:
          performance.getEntriesByName("first-paint")[0]?.startTime || 0,
        firstContentfulPaint:
          performance.getEntriesByName("first-contentful-paint")[0]
            ?.startTime || 0,
      };
    });

    // Assert performance thresholds
    expect(performanceMetrics.domContentLoaded).toBeLessThan(2000); // 2 seconds
    expect(performanceMetrics.firstContentfulPaint).toBeLessThan(1500); // 1.5 seconds

    // Check for console errors
    const consoleErrors: string[] = [];
    page.on("console", (msg) => {
      if (msg.type() === "error") {
        consoleErrors.push(msg.text());
      }
    });

    await page.reload();

    // Should have no console errors
    expect(consoleErrors).toHaveLength(0);
  });

  test("PWA functionality", async ({ page, context }) => {
    // Check for service worker registration
    await page.goto("/ar");

    const serviceWorkerRegistered = await page.evaluate(async () => {
      if ("serviceWorker" in navigator) {
        const registration = await navigator.serviceWorker.getRegistration();
        return !!registration;
      }
      return false;
    });

    expect(serviceWorkerRegistered).toBe(true);

    // Check for manifest
    const manifestLink = page.locator('link[rel="manifest"]');
    await expect(manifestLink).toHaveAttribute("href", "/manifest.json");

    // Test offline functionality
    await context.setOffline(true);

    // Page should still load from cache
    await page.reload();
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();

    // Restore online state
    await context.setOffline(false);
  });
});
