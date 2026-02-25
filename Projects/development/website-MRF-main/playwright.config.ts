import { defineConfig, devices } from "@playwright/test";

/**
 * MRF Educational Platform - Playwright Configuration
 * Comprehensive UI/UX testing for Arabic RTL educational platform
 * @see https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
  testDir: "./tests",
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 1, // Retry once locally, twice on CI
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : undefined,
  /* Reporter to use - multiple formats for comprehensive reporting */
  reporter: [
    ["html"],
    ["json", { outputFile: "test-results/results.json" }],
    ["junit", { outputFile: "test-results/junit.xml" }],
  ],
  /* Global timeout for each test */
  timeout: 60 * 1000, // 60 seconds per test (increased for TestSprite compatibility)
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL to use in actions like `await page.goto('/')`. */
    baseURL: process.env.BASE_URL || "http://localhost:3000",

    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: "on-first-retry",

    /* Take screenshot on failure */
    screenshot: "only-on-failure",

    /* Record video on failure */
    video: "retain-on-failure",

    /* Navigation timeout - increased for Turbopack compilation delays */
    navigationTimeout: 60 * 1000, // 60 seconds for page navigation

    /* Action timeout */
    actionTimeout: 10 * 1000, // 10 seconds for actions

    /* Arabic/RTL specific settings */
    locale: "ar-EG",
    timezoneId: "Africa/Cairo",
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },

    {
      name: "firefox",
      use: { ...devices["Desktop Firefox"] },
    },

    {
      name: "webkit",
      use: { ...devices["Desktop Safari"] },
    },

    /* Test against mobile viewports. */
    {
      name: "Mobile Chrome",
      use: { ...devices["Pixel 5"] },
    },
    {
      name: "Mobile Safari",
      use: { ...devices["iPhone 12"] },
    },

    /* Test against tablet viewports */
    {
      name: "Tablet",
      use: { ...devices["iPad Pro"] },
    },
  ],

  /* Run your local dev server before starting the tests */
  webServer: {
    command: "npm run dev",
    url: process.env.BASE_URL || "http://localhost:3000",
    reuseExistingServer: !process.env.CI,
    timeout: 120 * 1000,
  },

  /* Visual regression test settings */
  expect: {
    // Animation handling
    toHaveScreenshot: {
      threshold: 0.2,
      animations: "disabled",
    },
  },
});
