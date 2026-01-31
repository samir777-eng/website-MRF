import { Page } from "@playwright/test";

/**
 * Login with email and password
 */
export async function login(page: Page, email: string, password: string) {
  await page.goto("/ar/login");
  await page.getByLabel("البريد الإلكتروني").fill(email);
  await page.getByLabel("كلمة المرور").fill(password);
  await page.getByRole("button", { name: "تسجيل الدخول" }).click();
  await page.waitForURL(/\/ar\/dashboard/);
}

interface LoginAsOptions {
  gradeLevel: "1" | "2" | "3";
  isNewUser?: boolean;
  subscription?: "free" | "premium";
}

/**
 * Login as a user with specific grade level and options
 * Mocks the API response for testing grade isolation
 */
export async function loginAs(page: Page, options: LoginAsOptions) {
  // Mock API to return user with specific grade
  await page.route("**/api/auth/login", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        user: {
          id: "1",
          name: "أحمد محمد",
          email: "test@test.com",
          gradeLevel: options.gradeLevel,
          subscription: {
            status: "active",
            plan: options.subscription || "premium",
          },
          stats: options.isNewUser
            ? {
                totalXp: 0,
                level: 1,
                streak: 0,
                lessonsCompleted: 0,
                quizzesCompleted: 0,
              }
            : {
                totalXp: 2500,
                level: 5,
                streak: 7,
                lessonsCompleted: 45,
                quizzesCompleted: 23,
              },
        },
        accessToken: "mock-token",
        refreshToken: "mock-refresh",
      }),
    });
  });

  await login(page, "test@test.com", "Password123");
}

/**
 * Logout the current user
 */
export async function logout(page: Page) {
  await page.getByRole("button", { name: /تسجيل الخروج|Logout/ }).click();
  await page.waitForURL(/\/ar\/login|\/ar$/);
}

/**
 * Check if user is logged in by verifying dashboard access
 */
export async function isLoggedIn(page: Page): Promise<boolean> {
  try {
    await page.goto("/ar/dashboard");
    await page.waitForURL(/\/ar\/dashboard/, { timeout: 5000 });
    return true;
  } catch {
    return false;
  }
}
