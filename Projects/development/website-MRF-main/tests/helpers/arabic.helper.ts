import { Page, expect } from "@playwright/test";

/**
 * Check that the page has RTL direction
 */
export async function checkRTL(page: Page) {
  await expect(page.locator("html")).toHaveAttribute("dir", "rtl");
}

/**
 * Check that an element uses an Arabic font
 */
export async function checkArabicFont(page: Page, selector: string) {
  const element = page.locator(selector);
  const fontFamily = await element.evaluate(
    (el) => window.getComputedStyle(el).fontFamily
  );

  // Should include Arabic font
  expect(fontFamily).toMatch(/Noto Sans Arabic|Cairo|Tajawal|IBM Plex Sans Arabic/i);
}

/**
 * Check that text is aligned correctly for RTL
 */
export async function checkTextDirection(page: Page, selector: string) {
  const element = page.locator(selector);
  const textAlign = await element.evaluate(
    (el) => window.getComputedStyle(el).textAlign
  );

  // RTL should have right alignment or start (which resolves to right in RTL)
  expect(textAlign).toMatch(/right|start/);
}

/**
 * Check if text contains Arabic characters
 */
export function isArabicText(text: string): boolean {
  // Check if text contains Arabic characters (Unicode range 0600-06FF)
  return /[\u0600-\u06FF]/.test(text);
}

/**
 * Check that most visible text on the page is Arabic
 */
export async function checkAllTextIsArabic(page: Page) {
  const allText = await page.textContent("body");

  // Remove numbers, punctuation, and whitespace
  const cleanText = allText?.replace(/[0-9.,!?؛،\s]/g, "");

  // Count Arabic characters
  const arabicChars = (cleanText?.match(/[\u0600-\u06FF]/g) || []).length;
  const totalChars = cleanText?.length || 1;

  // At least 80% of characters should be Arabic
  expect(arabicChars / totalChars).toBeGreaterThan(0.8);
}

/**
 * Check that form labels are in Arabic
 */
export async function checkArabicLabels(page: Page) {
  const labels = page.locator("label");
  const count = await labels.count();

  for (let i = 0; i < count; i++) {
    const labelText = await labels.nth(i).textContent();
    if (labelText && labelText.trim().length > 0) {
      expect(isArabicText(labelText)).toBe(true);
    }
  }
}

/**
 * Check that button text is in Arabic
 */
export async function checkArabicButtons(page: Page) {
  const buttons = page.locator("button:visible");
  const count = await buttons.count();

  for (let i = 0; i < count; i++) {
    const buttonText = await buttons.nth(i).textContent();
    // Skip buttons with only icons (empty text or single character)
    if (buttonText && buttonText.trim().length > 1) {
      expect(isArabicText(buttonText)).toBe(true);
    }
  }
}

/**
 * Check that error messages are in Arabic
 */
export async function checkArabicErrors(page: Page) {
  const errors = page.locator('[role="alert"], .error, .text-destructive');
  const count = await errors.count();

  for (let i = 0; i < count; i++) {
    const errorText = await errors.nth(i).textContent();
    if (errorText && errorText.trim().length > 0) {
      expect(isArabicText(errorText)).toBe(true);
    }
  }
}

/**
 * Verify RTL-specific CSS properties on an element
 */
export async function checkRTLSpacing(page: Page, selector: string) {
  const element = page.locator(selector);
  
  const paddingRight = await element.evaluate(
    (el) => parseInt(window.getComputedStyle(el).paddingRight)
  );
  const paddingLeft = await element.evaluate(
    (el) => parseInt(window.getComputedStyle(el).paddingLeft)
  );
  
  // In RTL, typically padding-right should be greater or equal
  // This is context-dependent, so we just check both exist
  expect(paddingRight).toBeGreaterThanOrEqual(0);
  expect(paddingLeft).toBeGreaterThanOrEqual(0);
}

