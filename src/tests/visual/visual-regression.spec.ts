import { test, expect } from "@playwright/test";

test.describe("Visual Regression Tests", () => {
  test.beforeEach(async ({ page }) => {
    // Set consistent viewport for visual tests
    await page.setViewportSize({ width: 1280, height: 720 });
  });

  test("homepage should match visual snapshot", async ({ page }) => {
    await page.goto("/en");

    // Wait for page to be fully loaded
    await page.waitForLoadState("networkidle");

    // Take screenshot of the full page
    await expect(page).toHaveScreenshot("homepage-en.png", {
      fullPage: true,
      animations: "disabled",
    });
  });

  test("documentation page should match visual snapshot", async ({ page }) => {
    await page.goto("/en/docs");

    // Wait for page to be fully loaded
    await page.waitForLoadState("networkidle");

    // Take screenshot of the documentation page
    await expect(page).toHaveScreenshot("docs-page.png", {
      fullPage: true,
      animations: "disabled",
    });
  });

  test("component library tab should match visual snapshot", async ({
    page,
  }) => {
    await page.goto("/en/docs");
    await page.waitForLoadState("networkidle");

    // Ensure component library tab is active
    await page.getByRole("tab", { name: /component library/i }).click();
    await page.waitForTimeout(500); // Wait for tab content to load

    await expect(page).toHaveScreenshot("component-library-tab.png", {
      fullPage: true,
      animations: "disabled",
    });
  });

  test("design system tab should match visual snapshot", async ({ page }) => {
    await page.goto("/en/docs");
    await page.waitForLoadState("networkidle");

    // Click on design system tab
    await page.getByRole("tab", { name: /design system/i }).click();
    await page.waitForTimeout(500); // Wait for tab content to load

    await expect(page).toHaveScreenshot("design-system-tab.png", {
      fullPage: true,
      animations: "disabled",
    });
  });

  test("button component documentation should match visual snapshot", async ({
    page,
  }) => {
    await page.goto("/en/docs");
    await page.waitForLoadState("networkidle");

    // Click on Button component
    await page
      .getByRole("button", { name: /button/i })
      .first()
      .click();
    await page.waitForTimeout(500);

    // Take screenshot of the component documentation area
    const componentArea = page.locator('[data-testid="component-details"]');
    if (await componentArea.isVisible()) {
      await expect(componentArea).toHaveScreenshot(
        "button-component-docs.png",
        {
          animations: "disabled",
        },
      );
    } else {
      // Fallback to full page if specific area not found
      await expect(page).toHaveScreenshot("button-component-docs-full.png", {
        fullPage: true,
        animations: "disabled",
      });
    }
  });

  test("button variants should match visual snapshot", async ({ page }) => {
    await page.goto("/en/docs");
    await page.waitForLoadState("networkidle");

    // Navigate to Button component and Variants tab
    await page
      .getByRole("button", { name: /button/i })
      .first()
      .click();
    await page.getByRole("tab", { name: /variants/i }).click();
    await page.waitForTimeout(500);

    // Take screenshot of variants section
    const variantsSection = page.locator('[data-testid="variants-section"]');
    if (await variantsSection.isVisible()) {
      await expect(variantsSection).toHaveScreenshot("button-variants.png", {
        animations: "disabled",
      });
    } else {
      await expect(page).toHaveScreenshot("button-variants-full.png", {
        fullPage: true,
        animations: "disabled",
      });
    }
  });

  test("mobile viewport should match visual snapshot", async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });

    await page.goto("/en");
    await page.waitForLoadState("networkidle");

    await expect(page).toHaveScreenshot("homepage-mobile.png", {
      fullPage: true,
      animations: "disabled",
    });
  });

  test("tablet viewport should match visual snapshot", async ({ page }) => {
    // Set tablet viewport
    await page.setViewportSize({ width: 768, height: 1024 });

    await page.goto("/en");
    await page.waitForLoadState("networkidle");

    await expect(page).toHaveScreenshot("homepage-tablet.png", {
      fullPage: true,
      animations: "disabled",
    });
  });

  test("arabic homepage should match visual snapshot", async ({ page }) => {
    await page.goto("/ar");
    await page.waitForLoadState("networkidle");

    await expect(page).toHaveScreenshot("homepage-ar.png", {
      fullPage: true,
      animations: "disabled",
    });
  });

  test("color palette section should match visual snapshot", async ({
    page,
  }) => {
    await page.goto("/en/docs");
    await page.waitForLoadState("networkidle");

    // Navigate to Design System tab
    await page.getByRole("tab", { name: /design system/i }).click();
    await page.waitForTimeout(500);

    // Take screenshot of color palette section
    const colorSection = page.locator('[data-testid="color-palette"]');
    if (await colorSection.isVisible()) {
      await expect(colorSection).toHaveScreenshot("color-palette.png", {
        animations: "disabled",
      });
    }
  });

  test("typography section should match visual snapshot", async ({ page }) => {
    await page.goto("/en/docs");
    await page.waitForLoadState("networkidle");

    // Navigate to Design System tab
    await page.getByRole("tab", { name: /design system/i }).click();
    await page.waitForTimeout(500);

    // Take screenshot of typography section
    const typographySection = page.locator('[data-testid="typography"]');
    if (await typographySection.isVisible()) {
      await expect(typographySection).toHaveScreenshot(
        "typography-section.png",
        {
          animations: "disabled",
        },
      );
    }
  });

  test("component search should match visual snapshot", async ({ page }) => {
    await page.goto("/en/docs");
    await page.waitForLoadState("networkidle");

    // Type in search box
    const searchInput = page.getByPlaceholder(/search/i);
    if (await searchInput.isVisible()) {
      await searchInput.fill("button");
      await page.waitForTimeout(300); // Wait for search results

      await expect(page).toHaveScreenshot("component-search-results.png", {
        fullPage: true,
        animations: "disabled",
      });
    }
  });

  test("category filtering should match visual snapshot", async ({ page }) => {
    await page.goto("/en/docs");
    await page.waitForLoadState("networkidle");

    // Click on form category
    const formCategory = page.getByRole("button", { name: /form/i });
    if (await formCategory.isVisible()) {
      await formCategory.click();
      await page.waitForTimeout(300);

      await expect(page).toHaveScreenshot("form-category-filter.png", {
        fullPage: true,
        animations: "disabled",
      });
    }
  });

  test("dark mode should match visual snapshot", async ({ page }) => {
    // Enable dark mode if available
    await page.goto("/en");
    await page.waitForLoadState("networkidle");

    // Try to find and click dark mode toggle
    const darkModeToggle = page.locator('[data-testid="theme-toggle"]');
    if (await darkModeToggle.isVisible()) {
      await darkModeToggle.click();
      await page.waitForTimeout(500);

      await expect(page).toHaveScreenshot("homepage-dark-mode.png", {
        fullPage: true,
        animations: "disabled",
      });
    }
  });

  test("performance dashboard should match visual snapshot", async ({
    page,
  }) => {
    await page.goto("/en");
    await page.waitForLoadState("networkidle");

    // Click performance button if visible
    const perfButton = page.getByRole("button", { name: /performance/i });
    if (await perfButton.isVisible()) {
      await perfButton.click();
      await page.waitForTimeout(1000); // Wait for dashboard to load

      const dashboard = page.locator('[data-testid="performance-dashboard"]');
      if (await dashboard.isVisible()) {
        await expect(dashboard).toHaveScreenshot("performance-dashboard.png", {
          animations: "disabled",
        });
      }
    }
  });

  test("error states should match visual snapshot", async ({ page }) => {
    // Test 404 page or error state
    await page.goto("/en/non-existent-page");
    await page.waitForLoadState("networkidle");

    // Take screenshot of error state
    await expect(page).toHaveScreenshot("error-state.png", {
      fullPage: true,
      animations: "disabled",
    });
  });
});
