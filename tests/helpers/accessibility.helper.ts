import { Page, expect } from "@playwright/test";

/**
 * Minimum touch target size (Apple HIG)
 */
export const MIN_TOUCH_TARGET = 44;

/**
 * Check that all buttons have minimum touch target size
 */
export async function checkTouchTargets(page: Page) {
  const buttons = page.locator("button:visible, a:visible");
  const count = await buttons.count();

  for (let i = 0; i < Math.min(count, 20); i++) {
    const element = buttons.nth(i);
    const box = await element.boundingBox();

    if (box) {
      expect(box.height).toBeGreaterThanOrEqual(MIN_TOUCH_TARGET);
      expect(box.width).toBeGreaterThanOrEqual(MIN_TOUCH_TARGET);
    }
  }
}

/**
 * Check that the page has proper heading hierarchy
 */
export async function checkHeadingHierarchy(page: Page) {
  // Should have exactly one h1
  const h1Count = await page.locator("h1").count();
  expect(h1Count).toBe(1);

  // Collect all headings
  const allHeadings = await page.locator("h1, h2, h3, h4, h5, h6").all();

  let prevLevel = 0;
  for (const heading of allHeadings) {
    const tagName = await heading.evaluate((el) => el.tagName);
    const level = parseInt(tagName[1]);

    // Level should not skip (e.g., h2 -> h4 is invalid)
    expect(level).toBeLessThanOrEqual(prevLevel + 1);
    prevLevel = level;
  }
}

/**
 * Check that all images have alt text
 */
export async function checkImageAltText(page: Page) {
  const images = page.locator("img");
  const count = await images.count();

  for (let i = 0; i < count; i++) {
    const img = images.nth(i);
    const alt = await img.getAttribute("alt");

    // Alt attribute must exist (can be empty for decorative images)
    expect(alt).not.toBeNull();
  }
}

/**
 * Check that all form inputs have associated labels
 */
export async function checkFormLabels(page: Page) {
  const inputs = page.locator("input:visible");
  const count = await inputs.count();

  for (let i = 0; i < count; i++) {
    const input = inputs.nth(i);
    const type = await input.getAttribute("type");

    // Skip hidden and submit inputs
    if (type === "hidden" || type === "submit") continue;

    // Input should have associated label, aria-label, or aria-labelledby
    const ariaLabel = await input.getAttribute("aria-label");
    const ariaLabelledBy = await input.getAttribute("aria-labelledby");
    const id = await input.getAttribute("id");

    let hasLabel = false;
    if (ariaLabel || ariaLabelledBy) {
      hasLabel = true;
    } else if (id) {
      const label = page.locator(`label[for="${id}"]`);
      hasLabel = (await label.count()) > 0;
    }

    expect(hasLabel).toBe(true);
  }
}

/**
 * Check that page has proper ARIA landmarks
 */
export async function checkARIALandmarks(page: Page) {
  // Should have main landmark
  await expect(page.locator('main, [role="main"]')).toBeVisible();

  // Should have navigation landmark
  await expect(page.locator('nav, [role="navigation"]')).toBeVisible();

  // Should have banner landmark (header)
  await expect(page.locator('header, [role="banner"]')).toBeVisible();
}

/**
 * Check that error messages are announced to screen readers
 */
export async function checkErrorAnnouncement(page: Page, errorSelector: string) {
  const errorMessage = page.locator(errorSelector);

  const role = await errorMessage.getAttribute("role");
  const ariaLive = await errorMessage.getAttribute("aria-live");

  expect(
    role === "alert" || ariaLive === "polite" || ariaLive === "assertive"
  ).toBe(true);
}

/**
 * Check that focus is visible on interactive elements
 */
export async function checkFocusVisible(page: Page, selector: string) {
  const element = page.locator(selector);
  await element.focus();

  // Check that focus ring is visible
  const outlineWidth = await element.evaluate(
    (el) => window.getComputedStyle(el).outlineWidth
  );
  const boxShadow = await element.evaluate(
    (el) => window.getComputedStyle(el).boxShadow
  );

  // Either outline or box-shadow should indicate focus
  const hasFocusIndicator =
    parseInt(outlineWidth) > 0 || (boxShadow && boxShadow !== "none");
  expect(hasFocusIndicator).toBe(true);
}

/**
 * Check skip navigation link exists and works
 */
export async function checkSkipNavigation(page: Page) {
  // Press Tab to focus skip link
  await page.keyboard.press("Tab");

  const skipLink = page.getByRole("link", {
    name: /تخطى إلى المحتوى|Skip to content/,
  });
  await expect(skipLink).toBeFocused();

  // Activate skip link
  await page.keyboard.press("Enter");

  // Main content should be focused
  const mainContent = page.locator("main");
  await expect(mainContent).toBeFocused();
}

/**
 * Check no horizontal scroll on mobile
 */
export async function checkNoHorizontalScroll(page: Page) {
  const scrollWidth = await page.evaluate(
    () => document.documentElement.scrollWidth
  );
  const clientWidth = await page.evaluate(
    () => document.documentElement.clientWidth
  );

  expect(scrollWidth).toBeLessThanOrEqual(clientWidth + 5); // 5px tolerance
}

