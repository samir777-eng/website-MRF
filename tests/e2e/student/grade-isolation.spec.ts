import { test, expect } from "@playwright/test";

/**
 * CRITICAL BUSINESS RULE: Grade Isolation
 *
 * Students must ONLY see content for their registered grade level.
 * A Grade 2 student should NEVER see Grade 1 or Grade 3 content.
 * This is a fundamental requirement of the MRF Educational Platform.
 */
test.describe("Grade Isolation (Critical Business Rule)", () => {
  // ============================================
  // GRADE 1 STUDENT TESTS
  // ============================================

  test.describe("Grade 1 Student", () => {
    test.beforeEach(async ({ page }) => {
      // Mock API to return Grade 1 student
      await page.route("**/api/auth/**", async (route) => {
        await route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify({
            user: {
              id: "1",
              name: "طالب الصف الأول",
              gradeLevel: "1",
            },
          }),
        });
      });

      await page.goto("/ar/dashboard");
    });

    test("should only see Grade 1 content", async ({ page }) => {
      // Should see Grade 1 indicator
      await expect(page.getByText(/الصف الأول/)).toBeVisible();
    });

    test("should NOT see Grade 2 content", async ({ page }) => {
      // Should NOT see Grade 2 specific content
      const grade2Content = page.getByText(/محتوى الصف الثاني/);
      await expect(grade2Content).not.toBeVisible();
    });

    test("should NOT see Grade 3 content", async ({ page }) => {
      // Should NOT see Grade 3 specific content
      const grade3Content = page.getByText(/محتوى الصف الثالث/);
      await expect(grade3Content).not.toBeVisible();
    });
  });

  // ============================================
  // GRADE 2 STUDENT TESTS
  // ============================================

  test.describe("Grade 2 Student", () => {
    test.beforeEach(async ({ page }) => {
      // Mock API to return Grade 2 student
      await page.route("**/api/auth/**", async (route) => {
        await route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify({
            user: {
              id: "2",
              name: "طالب الصف الثاني",
              gradeLevel: "2",
            },
          }),
        });
      });

      await page.goto("/ar/dashboard");
    });

    test("should only see Grade 2 content", async ({ page }) => {
      await expect(page.getByText(/الصف الثاني/)).toBeVisible();
    });

    test("should NOT see Grade 1 content", async ({ page }) => {
      const grade1Content = page.getByText(/محتوى الصف الأول/);
      await expect(grade1Content).not.toBeVisible();
    });

    test("should NOT see Grade 3 content", async ({ page }) => {
      const grade3Content = page.getByText(/محتوى الصف الثالث/);
      await expect(grade3Content).not.toBeVisible();
    });
  });

  // ============================================
  // GRADE 3 STUDENT TESTS
  // ============================================

  test.describe("Grade 3 Student", () => {
    test.beforeEach(async ({ page }) => {
      // Mock API to return Grade 3 student
      await page.route("**/api/auth/**", async (route) => {
        await route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify({
            user: {
              id: "3",
              name: "طالب الصف الثالث",
              gradeLevel: "3",
            },
          }),
        });
      });

      await page.goto("/ar/dashboard");
    });

    test("should only see Grade 3 content", async ({ page }) => {
      await expect(page.getByText(/الصف الثالث/)).toBeVisible();
    });

    test("should NOT see Grade 1 content", async ({ page }) => {
      const grade1Content = page.getByText(/محتوى الصف الأول/);
      await expect(grade1Content).not.toBeVisible();
    });

    test("should NOT see Grade 2 content", async ({ page }) => {
      const grade2Content = page.getByText(/محتوى الصف الثاني/);
      await expect(grade2Content).not.toBeVisible();
    });
  });

  // ============================================
  // LESSONS PAGE GRADE ISOLATION
  // ============================================

  test.describe("Lessons Page Grade Isolation", () => {
    test("Grade 1 student should only see Grade 1 lessons", async ({
      page,
    }) => {
      await page.route("**/api/auth/**", async (route) => {
        await route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify({
            user: { id: "1", gradeLevel: "1" },
          }),
        });
      });

      await page.goto("/ar/lessons");

      // Should see Grade 1 lessons
      await expect(page.getByText(/الصف الأول/)).toBeVisible();
    });

    test("Grade 2 student should only see Grade 2 lessons", async ({
      page,
    }) => {
      await page.route("**/api/auth/**", async (route) => {
        await route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify({
            user: { id: "2", gradeLevel: "2" },
          }),
        });
      });

      await page.goto("/ar/lessons");

      await expect(page.getByText(/الصف الثاني/)).toBeVisible();
    });
  });
});
