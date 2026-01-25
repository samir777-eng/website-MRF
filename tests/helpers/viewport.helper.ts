import { Page } from "@playwright/test";

/**
 * Common viewport sizes for responsive testing
 */
export const viewports = {
  mobile: { width: 375, height: 667 },
  mobileLarge: { width: 414, height: 896 },
  tablet: { width: 768, height: 1024 },
  tabletLarge: { width: 1024, height: 1366 },
  desktop: { width: 1280, height: 720 },
  desktopLarge: { width: 1920, height: 1080 },
};

/**
 * Set viewport to mobile size
 */
export async function setMobileViewport(page: Page) {
  await page.setViewportSize(viewports.mobile);
}

/**
 * Set viewport to tablet size
 */
export async function setTabletViewport(page: Page) {
  await page.setViewportSize(viewports.tablet);
}

/**
 * Set viewport to desktop size
 */
export async function setDesktopViewport(page: Page) {
  await page.setViewportSize(viewports.desktop);
}

/**
 * Set viewport to large desktop size
 */
export async function setLargeDesktopViewport(page: Page) {
  await page.setViewportSize(viewports.desktopLarge);
}

/**
 * Run a test function on all viewport sizes
 */
export async function testOnAllViewports(
  page: Page,
  testFn: (page: Page, viewportName: string) => Promise<void>
) {
  for (const [name, size] of Object.entries(viewports)) {
    await page.setViewportSize(size);
    await testFn(page, name);
  }
}

/**
 * Check if current viewport is mobile
 */
export async function isMobileViewport(page: Page): Promise<boolean> {
  const viewportSize = page.viewportSize();
  return viewportSize ? viewportSize.width < 768 : false;
}

/**
 * Check if current viewport is tablet
 */
export async function isTabletViewport(page: Page): Promise<boolean> {
  const viewportSize = page.viewportSize();
  if (!viewportSize) return false;
  return viewportSize.width >= 768 && viewportSize.width < 1024;
}

/**
 * Check if current viewport is desktop
 */
export async function isDesktopViewport(page: Page): Promise<boolean> {
  const viewportSize = page.viewportSize();
  return viewportSize ? viewportSize.width >= 1024 : false;
}

