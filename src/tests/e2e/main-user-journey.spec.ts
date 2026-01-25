import { test, expect } from "@playwright/test";

test.describe("Main User Journey - Arabic Learning Platform", () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the homepage
    await page.goto("/en");
  });

  test("should load homepage successfully", async ({ page }) => {
    // Check that the page loads
    await expect(page).toHaveTitle(/MRF Educational Platform/);

    // Check for main navigation elements
    await expect(page.locator("nav")).toBeVisible();

    // Check for main content
    await expect(page.locator("main")).toBeVisible();
  });

  test("should navigate to documentation page", async ({ page }) => {
    // Navigate to docs
    await page.goto("/en/docs");

    // Check that docs page loads
    await expect(page.locator("h1")).toContainText("Documentation Hub");

    // Check for component library tab
    await expect(
      page.getByRole("tab", { name: /component library/i }),
    ).toBeVisible();

    // Check for design system tab
    await expect(
      page.getByRole("tab", { name: /design system/i }),
    ).toBeVisible();
  });

  test("should interact with component documentation", async ({ page }) => {
    await page.goto("/en/docs");

    // Click on a component in the sidebar
    await page
      .getByRole("button", { name: /button/i })
      .first()
      .click();

    // Check that component details are shown
    await expect(page.locator("h3")).toContainText("Button");

    // Check for tabs (Preview, Code, Usage, Variants)
    await expect(page.getByRole("tab", { name: /preview/i })).toBeVisible();
    await expect(page.getByRole("tab", { name: /code/i })).toBeVisible();
    await expect(page.getByRole("tab", { name: /variants/i })).toBeVisible();

    // Click on Code tab
    await page.getByRole("tab", { name: /code/i }).click();

    // Check that code snippet is shown
    await expect(page.locator("code")).toBeVisible();

    // Click on Variants tab
    await page.getByRole("tab", { name: /variants/i }).click();

    // Check that variants are shown
    await expect(page.getByText("Primary")).toBeVisible();
    await expect(page.getByText("Secondary")).toBeVisible();
  });

  test("should switch between design system tabs", async ({ page }) => {
    await page.goto("/en/docs");

    // Click on Design System tab
    await page.getByRole("tab", { name: /design system/i }).click();

    // Check that design system content is shown
    await expect(page.locator("h1")).toContainText("Design System");

    // Check for color palette section
    await expect(page.getByText("Color Palette")).toBeVisible();

    // Check for typography section
    await expect(page.getByText("Typography")).toBeVisible();

    // Check for spacing section
    await expect(page.getByText("Spacing Scale")).toBeVisible();
  });

  test("should handle responsive design", async ({ page }) => {
    // Test mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto("/en");

    // Check that page is responsive
    await expect(page.locator("main")).toBeVisible();

    // Test tablet viewport
    await page.setViewportSize({ width: 768, height: 1024 });
    await expect(page.locator("main")).toBeVisible();

    // Test desktop viewport
    await page.setViewportSize({ width: 1920, height: 1080 });
    await expect(page.locator("main")).toBeVisible();
  });

  test("should handle language switching", async ({ page }) => {
    // Start on English page
    await page.goto("/en");
    await expect(page).toHaveURL(/\/en/);

    // Navigate to Arabic page
    await page.goto("/ar");
    await expect(page).toHaveURL(/\/ar/);

    // Check that page loads in Arabic
    await expect(page.locator("main")).toBeVisible();
  });

  test("should handle performance monitoring", async ({ page }) => {
    await page.goto("/en");

    // Check for performance monitoring button
    const perfButton = page.getByRole("button", { name: /performance/i });
    if (await perfButton.isVisible()) {
      await perfButton.click();

      // Check that performance dashboard opens
      await expect(
        page.locator('[data-testid="performance-dashboard"]'),
      ).toBeVisible();
    }
  });

  test("should handle error states gracefully", async ({ page }) => {
    // Test 404 page
    await page.goto("/en/non-existent-page");

    // Should either show 404 page or redirect to home
    const url = page.url();
    expect(url).toMatch(/\/(en|ar)(\/|$)/);
  });

  test("should load and interact with component examples", async ({ page }) => {
    await page.goto("/en/docs");

    // Test different components
    const components = ["Button", "Card", "Badge", "Input", "Alert"];

    for (const component of components) {
      // Click on component
      const componentButton = page
        .getByRole("button", { name: new RegExp(component, "i") })
        .first();
      if (await componentButton.isVisible()) {
        await componentButton.click();

        // Check that component details are shown
        await expect(page.locator("h3")).toContainText(component);

        // Check for preview tab content
        await expect(page.getByRole("tab", { name: /preview/i })).toBeVisible();
      }
    }
  });

  test("should handle search functionality in docs", async ({ page }) => {
    await page.goto("/en/docs");

    // Find search input
    const searchInput = page.getByPlaceholder(/search/i);
    if (await searchInput.isVisible()) {
      // Type in search
      await searchInput.fill("button");

      // Check that results are filtered
      await expect(page.getByText("Button")).toBeVisible();
    }
  });

  test("should handle category filtering in docs", async ({ page }) => {
    await page.goto("/en/docs");

    // Test category filters
    const categories = ["all", "form", "layout", "display", "feedback"];

    for (const category of categories) {
      const categoryButton = page.getByRole("button", {
        name: new RegExp(category, "i"),
      });
      if (await categoryButton.isVisible()) {
        await categoryButton.click();

        // Check that components are filtered
        await expect(
          page.locator('[data-testid="component-list"]'),
        ).toBeVisible();
      }
    }
  });
});
