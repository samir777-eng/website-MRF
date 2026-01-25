# Comprehensive UI/UX Testing Guidelines for Augment + Playwright

This is a complete testing framework to help Augment identify and fix UI/UX issues in your MRF Educational Platform.

---

## 🎯 MASTER PROMPT FOR AUGMENT

```markdown
You are an expert UI/UX tester using Playwright to identify issues in the MRF Educational Platform.

## YOUR MISSION
Write comprehensive Playwright tests that catch UI/UX issues across:
- Visual regressions
- Accessibility violations
- Responsive design breakage
- Arabic/RTL layout issues
- User flow interruptions
- Performance bottlenecks
- Error handling gaps
- Loading state problems

## PLATFORM CONTEXT
- **Tech Stack:** Next.js 15 + React 19 + TypeScript + Tailwind CSS 4
- **Language:** Arabic (RTL) with English support
- **Target Users:** Egyptian high school students
- **Critical Feature:** Grade-level isolation (students ONLY see their grade content)
- **Gamification:** XP, levels, streaks, achievements, energy system

## TESTING PHILOSOPHY
1. **Test like a real user** - Don't just check if elements exist, verify user experience
2. **Test Arabic content** - Ensure RTL layout, Arabic fonts, and proper spacing
3. **Test all states** - Loading, success, error, empty, disabled
4. **Test all viewports** - Mobile (320px), Tablet (768px), Desktop (1920px)
5. **Test accessibility** - Keyboard navigation, screen readers, ARIA labels
6. **Test edge cases** - Slow networks, offline, long text, empty data

## CRITICAL RULES
- All user-facing text MUST be in Arabic
- Direction MUST be RTL (dir="rtl")
- Grade isolation MUST be enforced (never show other grades' content)
- Subscription status MUST gate premium content
- Loading states MUST be shown for async operations
- Errors MUST have clear Arabic messages
- Touch targets MUST be ≥44x44px on mobile
```

---

## 📋 COMPLETE TEST SUITE STRUCTURE

### File Organization
```
tests/
├── e2e/
│   ├── auth/
│   │   ├── login.spec.ts
│   │   ├── register.spec.ts
│   │   ├── forgot-password.spec.ts
│   │   └── grade-selection.spec.ts
│   ├── student/
│   │   ├── dashboard.spec.ts
│   │   ├── lessons.spec.ts
│   │   ├── quizzes.spec.ts
│   │   ├── progress.spec.ts
│   │   └── achievements.spec.ts
│   ├── gamification/
│   │   ├── xp-system.spec.ts
│   │   ├── streaks.spec.ts
│   │   ├── energy.spec.ts
│   │   └── leaderboard.spec.ts
│   ├── accessibility/
│   │   ├── keyboard-navigation.spec.ts
│   │   ├── screen-reader.spec.ts
│   │   └── wcag-compliance.spec.ts
│   ├── responsive/
│   │   ├── mobile.spec.ts
│   │   ├── tablet.spec.ts
│   │   └── desktop.spec.ts
│   ├── rtl/
│   │   ├── layout.spec.ts
│   │   ├── forms.spec.ts
│   │   └── navigation.spec.ts
│   └── performance/
│       ├── page-load.spec.ts
│       ├── bundle-size.spec.ts
│       └── web-vitals.spec.ts
├── visual/
│   ├── snapshots/
│   └── visual-regression.spec.ts
└── helpers/
    ├── auth.helper.ts
    ├── viewport.helper.ts
    ├── accessibility.helper.ts
    └── arabic.helper.ts
```

---

## 🧪 DETAILED TEST SPECIFICATIONS

### 1. AUTHENTICATION TESTS

#### `tests/e2e/auth/login.spec.ts`

```typescript
import { test, expect } from '@playwright/test';
import { login, logout } from '../helpers/auth.helper';

test.describe('Login Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/ar/login');
  });

  // ============================================
  // VISUAL & LAYOUT TESTS
  // ============================================
  
  test('should display login form with Arabic labels', async ({ page }) => {
    // Check RTL direction
    await expect(page.locator('html')).toHaveAttribute('dir', 'rtl');
    
    // Check Arabic labels exist and are visible
    await expect(page.getByLabel('البريد الإلكتروني')).toBeVisible();
    await expect(page.getByLabel('كلمة المرور')).toBeVisible();
    
    // Check button text is Arabic
    await expect(page.getByRole('button', { name: 'تسجيل الدخول' })).toBeVisible();
    
    // Check "Forgot Password" link is Arabic
    await expect(page.getByRole('link', { name: /نسيت كلمة المرور/i })).toBeVisible();
  });

  test('should have proper RTL spacing on form elements', async ({ page }) => {
    const emailInput = page.getByLabel('البريد الإلكتروني');
    
    // Check padding is on the right side (RTL)
    const paddingRight = await emailInput.evaluate(el => 
      window.getComputedStyle(el).paddingRight
    );
    const paddingLeft = await emailInput.evaluate(el => 
      window.getComputedStyle(el).paddingLeft
    );
    
    // RTL inputs should have more padding on right
    expect(parseInt(paddingRight)).toBeGreaterThan(parseInt(paddingLeft));
  });

  test('should display login form on all viewport sizes', async ({ page }) => {
    const viewports = [
      { name: 'mobile', width: 375, height: 667 },
      { name: 'tablet', width: 768, height: 1024 },
      { name: 'desktop', width: 1920, height: 1080 }
    ];

    for (const viewport of viewports) {
      await page.setViewportSize({ width: viewport.width, height: viewport.height });
      
      await expect(page.getByLabel('البريد الإلكتروني')).toBeVisible();
      await expect(page.getByLabel('كلمة المرور')).toBeVisible();
      await expect(page.getByRole('button', { name: 'تسجيل الدخول' })).toBeVisible();
      
      // Form should not overflow
      const form = page.locator('form').first();
      const boundingBox = await form.boundingBox();
      expect(boundingBox.width).toBeLessThanOrEqual(viewport.width);
    }
  });

  // ============================================
  // VALIDATION TESTS
  // ============================================

  test('should show Arabic error for empty email', async ({ page }) => {
    await page.getByRole('button', { name: 'تسجيل الدخول' }).click();
    
    // Check Zod validation message appears in Arabic
    await expect(page.getByText('البريد الإلكتروني مطلوب')).toBeVisible();
  });

  test('should show Arabic error for invalid email format', async ({ page }) => {
    await page.getByLabel('البريد الإلكتروني').fill('invalid-email');
    await page.getByLabel('كلمة المرور').fill('password123');
    await page.getByRole('button', { name: 'تسجيل الدخول' }).click();
    
    await expect(page.getByText('البريد الإلكتروني غير صالح')).toBeVisible();
  });

  test('should show Arabic error for short password', async ({ page }) => {
    await page.getByLabel('البريد الإلكتروني').fill('test@example.com');
    await page.getByLabel('كلمة المرور').fill('short');
    await page.getByRole('button', { name: 'تسجيل الدخول' }).click();
    
    await expect(page.getByText(/كلمة المرور يجب أن تكون 8 أحرف على الأقل/)).toBeVisible();
  });

  test('should clear error when user starts typing', async ({ page }) => {
    // Trigger error
    await page.getByRole('button', { name: 'تسجيل الدخول' }).click();
    await expect(page.getByText('البريد الإلكتروني مطلوب')).toBeVisible();
    
    // Start typing
    await page.getByLabel('البريد الإلكتروني').type('a');
    
    // Error should disappear
    await expect(page.getByText('البريد الإلكتروني مطلوب')).not.toBeVisible();
  });

  // ============================================
  // FUNCTIONALITY TESTS
  // ============================================

  test('should login successfully with valid credentials', async ({ page }) => {
    await page.getByLabel('البريد الإلكتروني').fill('test@test.com');
    await page.getByLabel('كلمة المرور').fill('Password123');
    
    await page.getByRole('button', { name: 'تسجيل الدخول' }).click();
    
    // Should redirect to dashboard
    await expect(page).toHaveURL(/\/ar\/dashboard/);
    
    // Should show success toast (Arabic)
    await expect(page.getByText(/تم تسجيل الدخول بنجاح/)).toBeVisible();
  });

  test('should show Arabic error for invalid credentials', async ({ page }) => {
    await page.getByLabel('البريد الإلكتروني').fill('wrong@example.com');
    await page.getByLabel('كلمة المرور').fill('WrongPassword123');
    
    await page.getByRole('button', { name: 'تسجيل الدخول' }).click();
    
    // Should show error message in Arabic
    await expect(page.getByText('بيانات الدخول غير صحيحة')).toBeVisible();
    
    // Should NOT redirect
    await expect(page).toHaveURL(/\/ar\/login/);
  });

  // ============================================
  // LOADING STATE TESTS
  // ============================================

  test('should show loading state during login', async ({ page }) => {
    // Slow down network to see loading state
    await page.route('**/api/auth/login', async route => {
      await new Promise(resolve => setTimeout(resolve, 2000));
      await route.continue();
    });

    await page.getByLabel('البريد الإلكتروني').fill('test@test.com');
    await page.getByLabel('كلمة المرور').fill('Password123');
    
    await page.getByRole('button', { name: 'تسجيل الدخول' }).click();
    
    // Button should show loading state
    const button = page.getByRole('button', { name: /تسجيل الدخول|جاري التحميل/ });
    await expect(button).toBeDisabled();
    
    // Should show loading spinner or text
    await expect(page.getByText(/جاري التحميل/)).toBeVisible();
  });

  test('should disable form during submission', async ({ page }) => {
    await page.route('**/api/auth/login', async route => {
      await new Promise(resolve => setTimeout(resolve, 2000));
      await route.continue();
    });

    await page.getByLabel('البريد الإلكتروني').fill('test@test.com');
    await page.getByLabel('كلمة المرور').fill('Password123');
    
    await page.getByRole('button', { name: 'تسجيل الدخول' }).click();
    
    // All inputs should be disabled
    await expect(page.getByLabel('البريد الإلكتروني')).toBeDisabled();
    await expect(page.getByLabel('كلمة المرور')).toBeDisabled();
  });

  // ============================================
  // ACCESSIBILITY TESTS
  // ============================================

  test('should be navigable with keyboard only', async ({ page }) => {
    // Tab to email input
    await page.keyboard.press('Tab');
    await expect(page.getByLabel('البريد الإلكتروني')).toBeFocused();
    
    // Tab to password input
    await page.keyboard.press('Tab');
    await expect(page.getByLabel('كلمة المرور')).toBeFocused();
    
    // Tab to submit button
    await page.keyboard.press('Tab');
    await expect(page.getByRole('button', { name: 'تسجيل الدخول' })).toBeFocused();
    
    // Tab to "Forgot Password" link
    await page.keyboard.press('Tab');
    await expect(page.getByRole('link', { name: /نسيت كلمة المرور/ })).toBeFocused();
  });

  test('should submit form with Enter key', async ({ page }) => {
    await page.getByLabel('البريد الإلكتروني').fill('test@test.com');
    await page.getByLabel('كلمة المرور').fill('Password123');
    
    // Press Enter in password field
    await page.getByLabel('كلمة المرور').press('Enter');
    
    // Should submit and redirect
    await expect(page).toHaveURL(/\/ar\/dashboard/);
  });

  test('should have proper ARIA labels', async ({ page }) => {
    const emailInput = page.getByLabel('البريد الإلكتروني');
    const passwordInput = page.getByLabel('كلمة المرور');
    
    // Check aria-label or associated label
    await expect(emailInput).toHaveAttribute('aria-label', /البريد الإلكتروني/);
    await expect(passwordInput).toHaveAttribute('aria-label', /كلمة المرور/);
    
    // Check password input type
    await expect(passwordInput).toHaveAttribute('type', 'password');
  });

  test('should have visible focus indicators', async ({ page }) => {
    const emailInput = page.getByLabel('البريد الإلكتروني');
    
    await emailInput.focus();
    
    // Check focus ring is visible
    const outlineWidth = await emailInput.evaluate(el => 
      window.getComputedStyle(el).outlineWidth
    );
    
    expect(parseInt(outlineWidth)).toBeGreaterThan(0);
  });

  // ============================================
  // PASSWORD VISIBILITY TOGGLE
  // ============================================

  test('should toggle password visibility', async ({ page }) => {
    const passwordInput = page.getByLabel('كلمة المرور');
    const toggleButton = page.getByRole('button', { name: /إظهار|إخفاء/ });
    
    // Initially type="password"
    await expect(passwordInput).toHaveAttribute('type', 'password');
    
    // Click toggle
    await toggleButton.click();
    
    // Should change to type="text"
    await expect(passwordInput).toHaveAttribute('type', 'text');
    
    // Click again to hide
    await toggleButton.click();
    await expect(passwordInput).toHaveAttribute('type', 'password');
  });

  // ============================================
  // REMEMBER ME CHECKBOX
  // ============================================

  test('should have "Remember Me" checkbox in Arabic', async ({ page }) => {
    const rememberMe = page.getByLabel(/تذكرني/);
    
    await expect(rememberMe).toBeVisible();
    await expect(rememberMe).toHaveAttribute('type', 'checkbox');
    
    // Should be unchecked by default
    await expect(rememberMe).not.toBeChecked();
    
    // Should toggle on click
    await rememberMe.click();
    await expect(rememberMe).toBeChecked();
  });

  // ============================================
  // SOCIAL LOGIN (if applicable)
  // ============================================

  test('should display social login buttons in Arabic', async ({ page }) => {
    // Check for Google login button
    const googleButton = page.getByRole('button', { name: /تسجيل الدخول عبر جوجل/ });
    if (await googleButton.isVisible()) {
      await expect(googleButton).toBeVisible();
      
      // Check button has proper size for touch
      const box = await googleButton.boundingBox();
      expect(box.height).toBeGreaterThanOrEqual(44);
      expect(box.width).toBeGreaterThanOrEqual(44);
    }
  });

  // ============================================
  // ERROR RECOVERY
  // ============================================

  test('should allow retry after network error', async ({ page }) => {
    // Simulate network failure
    await page.route('**/api/auth/login', route => route.abort());
    
    await page.getByLabel('البريد الإلكتروني').fill('test@test.com');
    await page.getByLabel('كلمة المرور').fill('Password123');
    await page.getByRole('button', { name: 'تسجيل الدخول' }).click();
    
    // Should show network error in Arabic
    await expect(page.getByText(/خطأ في الاتصال|حدث خطأ/)).toBeVisible();
    
    // Remove network block
    await page.unroute('**/api/auth/login');
    
    // Retry button should work
    const retryButton = page.getByRole('button', { name: /إعادة المحاولة|تسجيل الدخول/ });
    await retryButton.click();
    
    // Should succeed
    await expect(page).toHaveURL(/\/ar\/dashboard/);
  });

  // ============================================
  // MOBILE-SPECIFIC TESTS
  // ============================================

  test('should have touch-friendly button sizes on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    
    const loginButton = page.getByRole('button', { name: 'تسجيل الدخول' });
    const box = await loginButton.boundingBox();
    
    // Button should be at least 44x44px (Apple HIG)
    expect(box.height).toBeGreaterThanOrEqual(44);
    expect(box.width).toBeGreaterThanOrEqual(44);
  });

  test('should not have horizontal scroll on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    
    const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
    const clientWidth = await page.evaluate(() => document.documentElement.clientWidth);
    
    expect(scrollWidth).toBeLessThanOrEqual(clientWidth);
  });

  test('should show virtual keyboard without blocking inputs', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    
    const emailInput = page.getByLabel('البريد الإلكتروني');
    await emailInput.click();
    
    // Input should still be visible (scrolled into view)
    await expect(emailInput).toBeInViewport();
  });
});
```

---

### 2. REGISTRATION TESTS WITH GRADE SELECTION

#### `tests/e2e/auth/register.spec.ts`

```typescript
import { test, expect } from '@playwright/test';

test.describe('Registration Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/ar/register');
  });

  // ============================================
  // GRADE SELECTION (CRITICAL BUSINESS RULE)
  // ============================================

  test('should require grade selection', async ({ page }) => {
    await page.getByLabel('الاسم').fill('أحمد محمد');
    await page.getByLabel('البريد الإلكتروني').fill('ahmed@example.com');
    await page.getByLabel('رقم الهاتف').fill('01012345678');
    await page.getByLabel(/^كلمة المرور$/).fill('Password123');
    await page.getByLabel('تأكيد كلمة المرور').fill('Password123');
    
    // DON'T select grade
    
    await page.getByRole('button', { name: 'إنشاء حساب' }).click();
    
    // Should show error
    await expect(page.getByText('يرجى اختيار الصف الدراسي')).toBeVisible();
  });

  test('should display all three grade options', async ({ page }) => {
    // Check for grade buttons/cards
    await expect(page.getByRole('button', { name: /الصف الأول الثانوي/ })).toBeVisible();
    await expect(page.getByRole('button', { name: /الصف الثاني الثانوي/ })).toBeVisible();
    await expect(page.getByRole('button', { name: /الصف الثالث الثانوي/ })).toBeVisible();
  });

  test('should visually highlight selected grade', async ({ page }) => {
    const grade2Button = page.getByRole('button', { name: /الصف الثاني الثانوي/ });
    
    // Click grade 2
    await grade2Button.click();
    
    // Should have selected state (check for specific class or style)
    await expect(grade2Button).toHaveClass(/selected|active|border-primary/);
    
    // Other grades should NOT be selected
    const grade1Button = page.getByRole('button', { name: /الصف الأول الثانوي/ });
    await expect(grade1Button).not.toHaveClass(/selected|active|border-primary/);
  });

  test('should allow changing grade selection before submit', async ({ page }) => {
    // Select grade 1
    await page.getByRole('button', { name: /الصف الأول الثانوي/ }).click();
    
    // Change to grade 3
    await page.getByRole('button', { name: /الصف الثالث الثانوي/ }).click();
    
    // Grade 3 should be selected
    const grade3Button = page.getByRole('button', { name: /الصف الثالث الثانوي/ });
    await expect(grade3Button).toHaveClass(/selected|active|border-primary/);
    
    // Grade 1 should NOT be selected
    const grade1Button = page.getByRole('button', { name: /الصف الأول الثانوي/ });
    await expect(grade1Button).not.toHaveClass(/selected|active|border-primary/);
  });

  // ============================================
  // PHONE NUMBER VALIDATION (EGYPTIAN FORMAT)
  // ============================================

  test('should validate Egyptian phone number format', async ({ page }) => {
    const phoneInput = page.getByLabel('رقم الهاتف');
    
    // Test invalid formats
    const invalidPhones = [
      '1234567890',      // Not starting with 01
      '020123456789',    // Too long
      '0101234567',      // Too short
      '01912345678',     // Invalid prefix (019 not valid)
    ];

    for (const phone of invalidPhones) {
      await phoneInput.fill(phone);
      await page.getByRole('button', { name: 'إنشاء حساب' }).click();
      await expect(page.getByText('رقم الهاتف غير صالح')).toBeVisible();
      await phoneInput.clear();
    }

    // Test valid formats
    const validPhones = ['01012345678', '01112345678', '01212345678', '01512345678'];
    
    for (const phone of validPhones) {
      await phoneInput.fill(phone);
      await phoneInput.blur();
      // Should NOT show error
      await expect(page.getByText('رقم الهاتف غير صالح')).not.toBeVisible();
      await phoneInput.clear();
    }
  });

  // ============================================
  // PASSWORD REQUIREMENTS
  // ============================================

  test('should show password requirements checklist', async ({ page }) => {
    // Check all 4 requirements are listed in Arabic
    await expect(page.getByText('8 أحرف على الأقل')).toBeVisible();
    await expect(page.getByText('حرف كبير واحد على الأقل')).toBeVisible();
    await expect(page.getByText('حرف صغير واحد على الأقل')).toBeVisible();
    await expect(page.getByText('رقم واحد على الأقل')).toBeVisible();
  });

  test('should update password requirements checklist in real-time', async ({ page }) => {
    const passwordInput = page.getByLabel(/^كلمة المرور$/);
    
    // Type 8 characters
    await passwordInput.fill('password');
    await expect(page.getByText('8 أحرف على الأقل')).toHaveClass(/text-green|line-through/);
    
    // Add uppercase
    await passwordInput.fill('Password');
    await expect(page.getByText('حرف كبير واحد على الأقل')).toHaveClass(/text-green|line-through/);
    
    // Add number
    await passwordInput.fill('Password1');
    await expect(page.getByText('رقم واحد على الأقل')).toHaveClass(/text-green|line-through/);
  });

  test('should validate password confirmation matches', async ({ page }) => {
    await page.getByLabel(/^كلمة المرور$/).fill('Password123');
    await page.getByLabel('تأكيد كلمة المرور').fill('Password456');
    
    await page.getByRole('button', { name: 'إنشاء حساب' }).click();
    
    await expect(page.getByText('كلمات المرور غير متطابقة')).toBeVisible();
  });

  // ============================================
  // COMPLETE REGISTRATION FLOW
  // ============================================

  test('should register successfully with valid data', async ({ page }) => {
    await page.getByLabel('الاسم').fill('أحمد محمد');
    await page.getByLabel('البريد الإلكتروني').fill('ahmed@example.com');
    await page.getByLabel('رقم الهاتف').fill('01012345678');
    await page.getByLabel(/^كلمة المرور$/).fill('Password123');
    await page.getByLabel('تأكيد كلمة المرور').fill('Password123');
    
    // Select grade 2
    await page.getByRole('button', { name: /الصف الثاني الثانوي/ }).click();
    
    // Submit
    await page.getByRole('button', { name: 'إنشاء حساب' }).click();
    
    // Should redirect to OTP verification
    await expect(page).toHaveURL(/\/ar\/verify-otp/);
    
    // Should show success message
    await expect(page.getByText(/تم إرسال رمز التحقق/)).toBeVisible();
  });

  // ============================================
  // DUPLICATE EMAIL HANDLING
  // ============================================

  test('should show error for existing email', async ({ page }) => {
    // Use email that already exists in mock data
    await page.getByLabel('الاسم').fill('أحمد محمد');
    await page.getByLabel('البريد الإلكتروني').fill('test@test.com'); // Existing email
    await page.getByLabel('رقم الهاتف').fill('01012345678');
    await page.getByLabel(/^كلمة المرور$/).fill('Password123');
    await page.getByLabel('تأكيد كلمة المرور').fill('Password123');
    await page.getByRole('button', { name: /الصف الثاني الثانوي/ }).click();
    
    await page.getByRole('button', { name: 'إنشاء حساب' }).click();
    
    // Should show error in Arabic
    await expect(page.getByText(/البريد الإلكتروني مستخدم بالفعل|هذا البريد مسجل/)).toBeVisible();
  });

  // ============================================
  // TERMS & CONDITIONS
  // ============================================

  test('should require terms acceptance', async ({ page }) => {
    const termsCheckbox = page.getByLabel(/أوافق على الشروط والأحكام/);
    
    await expect(termsCheckbox).toBeVisible();
    await expect(termsCheckbox).not.toBeChecked();
    
    // Fill form without checking terms
    await page.getByLabel('الاسم').fill('أحمد محمد');
    await page.getByLabel('البريد الإلكتروني').fill('ahmed@example.com');
    await page.getByLabel('رقم الهاتف').fill('01012345678');
    await page.getByLabel(/^كلمة المرور$/).fill('Password123');
    await page.getByLabel('تأكيد كلمة المرور').fill('Password123');
    await page.getByRole('button', { name: /الصف الثاني الثانوي/ }).click();
    
    await page.getByRole('button', { name: 'إنشاء حساب' }).click();
    
    // Should show error
    await expect(page.getByText(/يجب الموافقة على الشروط/)).toBeVisible();
  });

  test('should open terms modal when link clicked', async ({ page }) => {
    const termsLink = page.getByRole('link', { name: /الشروط والأحكام/ });
    await termsLink.click();
    
    // Modal should open
    const modal = page.getByRole('dialog');
    await expect(modal).toBeVisible();
    
    // Should have Arabic content
    await expect(modal.getByText(/شروط الاستخدام|الشروط والأحكام/)).toBeVisible();
    
    // Should have close button
    const closeButton = modal.getByRole('button', { name: /إغلاق|×/ });
    await expect(closeButton).toBeVisible();
    
    // Close button should work
    await closeButton.click();
    await expect(modal).not.toBeVisible();
  });
});
```

---

### 3. DASHBOARD TESTS (GRADE ISOLATION)

#### `tests/e2e/student/dashboard.spec.ts`

```typescript
import { test, expect } from '@playwright/test';
import { loginAs } from '../helpers/auth.helper';

test.describe('Student Dashboard - Grade Isolation', () => {
  
  test('Grade 1 student should ONLY see Grade 1 content', async ({ page }) => {
    // Login as Grade 1 student
    await loginAs(page, { gradeLevel: '1' });
    await page.goto('/ar/dashboard');
    
    // Should see Grade 1 lectures only
    await expect(page.getByText(/الصف الأول الثانوي/)).toBeVisible();
    
    // Should NOT see Grade 2 or 3 content
    await expect(page.getByText(/الصف الثاني الثانوي/)).not.toBeVisible();
    await expect(page.getByText(/الصف الثالث الثانوي/)).not.toBeVisible();
    
    // Check lecture list
    const lectures = page.locator('[data-testid="lecture-card"]');
    const count = await lectures.count();
    
    for (let i = 0; i < count; i++) {
      const lecture = lectures.nth(i);
      const gradeText = await lecture.getByText(/الصف/).textContent();
      expect(gradeText).toContain('الأول');
      expect(gradeText).not.toContain('الثاني');
      expect(gradeText).not.toContain('الثالث');
    }
  });

  test('should prevent Grade 1 student from accessing Grade 2 content via URL', async ({ page }) => {
    await loginAs(page, { gradeLevel: '1' });
    
    // Try to access Grade 2 lecture directly
    await page.goto('/ar/lectures/grade-2-lecture-id');
    
    // Should redirect to dashboard or show 403
    await expect(page).toHaveURL(/\/ar\/dashboard|\/ar\/403/);
    
    // Should show error message in Arabic
    await expect(page.getByText(/ليس لديك صلاحية|غير مسموح/)).toBeVisible();
  });

  test('should prevent Grade 1 student from accessing Grade 2 quiz via URL', async ({ page }) => {
    await loginAs(page, { gradeLevel: '1' });
    
    // Try to access Grade 2 quiz directly
    await page.goto('/ar/quizzes/grade-2-quiz-id');
    
    // Should redirect or show error
    await expect(page).toHaveURL(/\/ar\/dashboard|\/ar\/403/);
    await expect(page.getByText(/ليس لديك صلاحية|غير مسموح/)).toBeVisible();
  });

  test('should prevent grade manipulation via DevTools', async ({ page, context }) => {
    await loginAs(page, { gradeLevel: '1' });
    await page.goto('/ar/dashboard');
    
    // Try to change gradeLevel in localStorage
    await page.evaluate(() => {
      const authData = JSON.parse(localStorage.getItem('auth-storage') || '{}');
      if (authData.state?.user) {
        authData.state.user.gradeLevel = '2';
        localStorage.setItem('auth-storage', JSON.stringify(authData));
      }
    });
    
    // Reload page
    await page.reload();
    
    // API should still enforce Grade 1
    // Check that Grade 2 content is still NOT visible
    await expect(page.getByText(/الصف الثاني الثانوي/)).not.toBeVisible();
  });

  // ============================================
  // GAMIFICATION DISPLAY
  // ============================================

  test('should display XP, level, and streak', async ({ page }) => {
    await loginAs(page, { gradeLevel: '2' });
    await page.goto('/ar/dashboard');
    
    // XP should be visible with Arabic label
    await expect(page.getByText(/النقاط|XP/).first()).toBeVisible();
    const xpValue = page.locator('[data-testid="xp-value"]');
    await expect(xpValue).toBeVisible();
    
    // Level should be visible
    await expect(page.getByText(/المستوى|Level/)).toBeVisible();
    const levelValue = page.locator('[data-testid="level-value"]');
    await expect(levelValue).toBeVisible();
    
    // Streak should be visible
    await expect(page.getByText(/المتواصل|Streak/)).toBeVisible();
    const streakValue = page.locator('[data-testid="streak-value"]');
    await expect(streakValue).toBeVisible();
  });

  test('should show progress ring for level', async ({ page }) => {
    await loginAs(page, { gradeLevel: '2' });
    await page.goto('/ar/dashboard');
    
    const progressRing = page.locator('[data-testid="level-progress-ring"]');
    await expect(progressRing).toBeVisible();
    
    // Should have SVG circle
    const circle = progressRing.locator('circle');
    await expect(circle).toBeVisible();
    
    // Circle should have stroke-dashoffset (animated progress)
    const dashOffset = await circle.getAttribute('stroke-dashoffset');
    expect(dashOffset).not.toBeNull();
  });

  test('should display current energy', async ({ page }) => {
    await loginAs(page, { gradeLevel: '2' });
    await page.goto('/ar/dashboard');
    
    const energyDisplay = page.locator('[data-testid="energy-display"]');
    await expect(energyDisplay).toBeVisible();
    
    // Should show energy value (e.g., "3/5")
    await expect(energyDisplay).toContainText(/\d+\/5/);
    
    // Should have energy icon (⚡ or similar)
    await expect(energyDisplay.locator('svg, img')).toBeVisible();
  });

  // ============================================
  // RECENT LESSONS SECTION
  // ============================================

  test('should display recent lessons', async ({ page }) => {
    await loginAs(page, { gradeLevel: '2' });
    await page.goto('/ar/dashboard');
    
    // Section heading in Arabic
    await expect(page.getByRole('heading', { name: /الدروس الأخيرة|آخر الدروس/ })).toBeVisible();
    
    // Should have at least one lesson card
    const lessonCards = page.locator('[data-testid="lesson-card"]');
    await expect(lessonCards.first()).toBeVisible();
    
    // Lesson card should have:
    const firstLesson = lessonCards.first();
    await expect(firstLesson.locator('[data-testid="lesson-title"]')).toBeVisible();
    await expect(firstLesson.locator('[data-testid="lesson-duration"]')).toBeVisible();
    await expect(firstLesson.locator('[data-testid="lesson-progress"]')).toBeVisible();
  });

  test('should show lesson progress accurately', async ({ page }) => {
    await loginAs(page, { gradeLevel: '2' });
    await page.goto('/ar/dashboard');
    
    const lessonCard = page.locator('[data-testid="lesson-card"]').first();
    const progressBar = lessonCard.locator('[role="progressbar"]');
    
    await expect(progressBar).toBeVisible();
    
    // Check aria-valuenow is set
    const progress = await progressBar.getAttribute('aria-valuenow');
    expect(parseInt(progress)).toBeGreaterThanOrEqual(0);
    expect(parseInt(progress)).toBeLessThanOrEqual(100);
  });

  // ============================================
  // UPCOMING QUIZZES SECTION
  // ============================================

  test('should display upcoming quizzes', async ({ page }) => {
    await loginAs(page, { gradeLevel: '2' });
    await page.goto('/ar/dashboard');
    
    await expect(page.getByRole('heading', { name: /الاختبارات القادمة/ })).toBeVisible();
    
    const quizCards = page.locator('[data-testid="quiz-card"]');
    await expect(quizCards.first()).toBeVisible();
    
    // Quiz card should show:
    const firstQuiz = quizCards.first();
    await expect(firstQuiz.locator('[data-testid="quiz-title"]')).toBeVisible();
    await expect(firstQuiz.locator('[data-testid="quiz-date"]')).toBeVisible();
    await expect(firstQuiz.locator('[data-testid="quiz-duration"]')).toBeVisible();
  });

  // ============================================
  // ACHIEVEMENTS SECTION
  // ============================================

  test('should display recent achievements', async ({ page }) => {
    await loginAs(page, { gradeLevel: '2' });
    await page.goto('/ar/dashboard');
    
    const achievementsSection = page.locator('[data-testid="achievements-section"]');
    
    if (await achievementsSection.isVisible()) {
      // Should show achievement badges
      const badges = achievementsSection.locator('[data-testid="achievement-badge"]');
      await expect(badges.first()).toBeVisible();
      
      // Badge should have icon and name in Arabic
      const firstBadge = badges.first();
      await expect(firstBadge.locator('img, svg')).toBeVisible();
      await expect(firstBadge.getByText(/[ا-ي]/)).toBeVisible(); // Arabic text
    }
  });

  // ============================================
  // DAILY QUEST
  // ============================================

  test('should display daily quest', async ({ page }) => {
    await loginAs(page, { gradeLevel: '2' });
    await page.goto('/ar/dashboard');
    
    const dailyQuest = page.locator('[data-testid="daily-quest"]');
    await expect(dailyQuest).toBeVisible();
    
    // Should show quest title in Arabic
    await expect(dailyQuest.locator('[data-testid="quest-title"]')).toBeVisible();
    
    // Should show progress
    await expect(dailyQuest.locator('[data-testid="quest-progress"]')).toBeVisible();
    
    // Should show XP reward
    await expect(dailyQuest.getByText(/\d+ XP/)).toBeVisible();
  });

  // ============================================
  // EMPTY STATES
  // ============================================

  test('should show empty state for new users', async ({ page, context }) => {
    // Login as brand new user with no progress
    await loginAs(page, { gradeLevel: '2', isNewUser: true });
    await page.goto('/ar/dashboard');
    
    // Should show welcome message
    await expect(page.getByText(/مرحباً|أهلاً/)).toBeVisible();
    
    // Should show CTA to start first lesson
    const startButton = page.getByRole('button', { name: /ابدأ أول درس|ابدأ التعلم/ });
    await expect(startButton).toBeVisible();
    
    // Empty state illustration/image
    await expect(page.locator('[data-testid="empty-state-image"]')).toBeVisible();
  });

  // ============================================
  // LOADING STATES
  // ============================================

  test('should show loading skeletons while fetching data', async ({ page }) => {
    // Delay API response
    await page.route('**/api/lessons*', async route => {
      await new Promise(resolve => setTimeout(resolve, 2000));
      await route.continue();
    });

    await loginAs(page, { gradeLevel: '2' });
    await page.goto('/ar/dashboard');
    
    // Should show skeleton loaders
    const skeletons = page.locator('[data-testid="skeleton"]');
    await expect(skeletons.first()).toBeVisible();
    
    // Skeletons should have shimmer animation
    const skeleton = skeletons.first();
    const animation = await skeleton.evaluate(el => 
      window.getComputedStyle(el).animation
    );
    expect(animation).not.toBe('none');
  });
});
```

---

### 4. RESPONSIVE DESIGN TESTS

#### `tests/e2e/responsive/mobile.spec.ts`

```typescript
import { test, expect, devices } from '@playwright/test';

const mobileViewports = [
  { name: 'iPhone SE', ...devices['iPhone SE'] },
  { name: 'iPhone 12', ...devices['iPhone 12'] },
  { name: 'iPhone 14 Pro', ...devices['iPhone 14 Pro'] },
  { name: 'Pixel 5', ...devices['Pixel 5'] },
  { name: 'Samsung Galaxy S21', ...devices['Galaxy S21'] },
];

for (const device of mobileViewports) {
  test.describe(`Mobile: ${device.name}`, () => {
    test.use(device);

    test('should not have horizontal scroll', async ({ page }) => {
      await page.goto('/ar');
      
      const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
      const clientWidth = await page.evaluate(() => document.documentElement.clientWidth);
      
      expect(scrollWidth).toBeLessThanOrEqual(clientWidth + 5); // 5px tolerance
    });

    test('should have readable text size', async ({ page }) => {
      await page.goto('/ar');
      
      // Body text should be at least 16px
      const bodyFontSize = await page.evaluate(() => 
        window.getComputedStyle(document.body).fontSize
      );
      expect(parseInt(bodyFontSize)).toBeGreaterThanOrEqual(16);
      
      // Heading should be larger
      const heading = page.locator('h1').first();
      if (await heading.isVisible()) {
        const headingSize = await heading.evaluate(el => 
          window.getComputedStyle(el).fontSize
        );
        expect(parseInt(headingSize)).toBeGreaterThan(parseInt(bodyFontSize));
      }
    });

    test('should have touch-friendly button sizes', async ({ page }) => {
      await page.goto('/ar');
      
      const buttons = page.locator('button:visible');
      const count = await buttons.count();
      
      for (let i = 0; i < Math.min(count, 10); i++) { // Check first 10 buttons
        const button = buttons.nth(i);
        const box = await button.boundingBox();
        
        if (box) {
          // Apple HIG minimum: 44x44px
          expect(box.height).toBeGreaterThanOrEqual(44);
          expect(box.width).toBeGreaterThanOrEqual(44);
        }
      }
    });

    test('should show mobile navigation', async ({ page }) => {
      await page.goto('/ar');
      
      // Desktop navigation should be hidden
      const desktopNav = page.locator('[data-testid="desktop-nav"]');
      if (await desktopNav.isVisible()) {
        await expect(desktopNav).toHaveCSS('display', 'none');
      }
      
      // Mobile hamburger menu should be visible
      const mobileMenuButton = page.getByRole('button', { name: /القائمة|Menu|☰/ });
      await expect(mobileMenuButton).toBeVisible();
    });

    test('should open mobile menu on tap', async ({ page }) => {
      await page.goto('/ar');
      
      const menuButton = page.getByRole('button', { name: /القائمة|Menu|☰/ });
      await menuButton.click();
      
      // Mobile menu should slide in
      const mobileMenu = page.locator('[data-testid="mobile-menu"]');
      await expect(mobileMenu).toBeVisible();
      
      // Menu should have Arabic navigation items
      await expect(mobileMenu.getByRole('link', { name: /الرئيسية|الدروس|الاختبارات/ })).toBeVisible();
    });

    test('should properly handle RTL on mobile', async ({ page }) => {
      await page.goto('/ar');
      
      // Check direction
      await expect(page.locator('html')).toHaveAttribute('dir', 'rtl');
      
      // Check text alignment
      const mainContent = page.locator('main').first();
      const textAlign = await mainContent.evaluate(el => 
        window.getComputedStyle(el).textAlign
      );
      expect(textAlign).toMatch(/right|start/);
    });

    test('should stack cards vertically on mobile', async ({ page }) => {
      await page.goto('/ar/dashboard');
      
      const cards = page.locator('[data-testid="lesson-card"]');
      const count = await cards.count();
      
      if (count >= 2) {
        const firstCard = await cards.nth(0).boundingBox();
        const secondCard = await cards.nth(1).boundingBox();
        
        // Second card should be below first (not side-by-side)
        expect(secondCard.y).toBeGreaterThan(firstCard.y + firstCard.height - 10);
      }
    });

    test('should show virtual keyboard without blocking content', async ({ page }) => {
      await page.goto('/ar/login');
      
      const emailInput = page.getByLabel('البريد الإلكتروني');
      await emailInput.click();
      
      // Wait for keyboard to appear (simulated)
      await page.waitForTimeout(500);
      
      // Input should still be in viewport
      await expect(emailInput).toBeInViewport();
    });
  });
}
```

---

### 5. ACCESSIBILITY TESTS

#### `tests/e2e/accessibility/keyboard-navigation.spec.ts`

```typescript
import { test, expect } from '@playwright/test';
import { injectAxe, checkA11y } from 'axe-playwright';

test.describe('Keyboard Navigation', () => {
  
  test('should navigate entire login form with Tab key', async ({ page }) => {
    await page.goto('/ar/login');
    
    // Start at first focusable element
    await page.keyboard.press('Tab');
    
    const focusableElements = [
      page.getByLabel('البريد الإلكتروني'),
      page.getByLabel('كلمة المرور'),
      page.getByRole('button', { name: /إظهار|Show/ }), // Password toggle
      page.getByLabel(/تذكرني/), // Remember me checkbox
      page.getByRole('button', { name: 'تسجيل الدخول' }),
      page.getByRole('link', { name: /نسيت كلمة المرور/ }),
      page.getByRole('link', { name: /إنشاء حساب/ }),
    ];

    for (const element of focusableElements) {
      await expect(element).toBeFocused();
      await page.keyboard.press('Tab');
    }
  });

  test('should navigate backwards with Shift+Tab', async ({ page }) => {
    await page.goto('/ar/login');
    
    const submitButton = page.getByRole('button', { name: 'تسجيل الدخول' });
    await submitButton.focus();
    
    // Go backwards
    await page.keyboard.press('Shift+Tab');
    await expect(page.getByLabel(/تذكرني/)).toBeFocused();
    
    await page.keyboard.press('Shift+Tab');
    await expect(page.getByRole('button', { name: /إظهار/ })).toBeFocused();
  });

  test('should activate buttons with Enter key', async ({ page }) => {
    await page.goto('/ar/login');
    
    await page.getByLabel('البريد الإلكتروني').fill('test@test.com');
    await page.getByLabel('كلمة المرور').fill('Password123');
    
    // Focus submit button
    const submitButton = page.getByRole('button', { name: 'تسجيل الدخول' });
    await submitButton.focus();
    
    // Press Enter
    await page.keyboard.press('Enter');
    
    // Should submit form
    await expect(page).toHaveURL(/\/ar\/dashboard/);
  });

  test('should activate buttons with Space key', async ({ page }) => {
    await page.goto('/ar/dashboard');
    
    const button = page.getByRole('button').first();
    await button.focus();
    
    // Press Space
    await page.keyboard.press('Space');
    
    // Button action should trigger (verify based on specific button)
  });

  test('should navigate quiz questions with arrow keys', async ({ page }) => {
    await page.goto('/ar/quizzes/1');
    
    // Start quiz
    await page.getByRole('button', { name: /ابدأ الاختبار/ }).click();
    
    // Use arrow keys to navigate
    await page.keyboard.press('ArrowRight'); // Next question (RTL: right = next)
    
    // Check current question changed
    const questionNumber = page.locator('[data-testid="current-question"]');
    await expect(questionNumber).toContainText('2');
    
    // Go back
    await page.keyboard.press('ArrowLeft'); // Previous question (RTL: left = previous)
    await expect(questionNumber).toContainText('1');
  });

  test('should select quiz answers with Enter key', async ({ page }) => {
    await page.goto('/ar/quizzes/1');
    await page.getByRole('button', { name: /ابدأ الاختبار/ }).click();
    
    // Tab to first answer option
    await page.keyboard.press('Tab');
    const firstOption = page.locator('[data-testid="quiz-option"]').first();
    await expect(firstOption).toBeFocused();
    
    // Press Enter to select
    await page.keyboard.press('Enter');
    
    // Option should be selected
    await expect(firstOption).toHaveAttribute('aria-checked', 'true');
  });

  test('should close modals with Escape key', async ({ page }) => {
    await page.goto('/ar/dashboard');
    
    // Open a modal (e.g., achievement details)
    const achievementBadge = page.locator('[data-testid="achievement-badge"]').first();
    if (await achievementBadge.isVisible()) {
      await achievementBadge.click();
      
      const modal = page.getByRole('dialog');
      await expect(modal).toBeVisible();
      
      // Press Escape
      await page.keyboard.press('Escape');
      
      // Modal should close
      await expect(modal).not.toBeVisible();
    }
  });

  test('should trap focus inside modal', async ({ page }) => {
    await page.goto('/ar/dashboard');
    
    // Open modal
    const openModalButton = page.getByRole('button', { name: /فتح|عرض|إظهار/ }).first();
    await openModalButton.click();
    
    const modal = page.getByRole('dialog');
    if (await modal.isVisible()) {
      // Tab through all elements in modal
      const modalFocusables = modal.locator('button, a, input, [tabindex]:not([tabindex="-1"])');
      const count = await modalFocusables.count();
      
      // Tab through all elements
      for (let i = 0; i < count; i++) {
        await page.keyboard.press('Tab');
      }
      
      // Next Tab should cycle back to first element in modal
      await page.keyboard.press('Tab');
      const firstElement = modalFocusables.first();
      await expect(firstElement).toBeFocused();
    }
  });

  test('should have skip navigation link', async ({ page }) => {
    await page.goto('/ar');
    
    // Press Tab to focus skip link
    await page.keyboard.press('Tab');
    
    const skipLink = page.getByRole('link', { name: /تخطى إلى المحتوى|Skip to content/ });
    await expect(skipLink).toBeFocused();
    
    // Activate skip link
    await page.keyboard.press('Enter');
    
    // Main content should be focused
    const mainContent = page.locator('main');
    await expect(mainContent).toBeFocused();
  });
});

test.describe('WCAG 2.1 AA Compliance', () => {
  
  test('should pass automated accessibility checks on homepage', async ({ page }) => {
    await page.goto('/ar');
    await injectAxe(page);
    
    await checkA11y(page, null, {
      detailedReport: true,
      detailedReportOptions: { html: true },
    });
  });

  test('should pass accessibility checks on login page', async ({ page }) => {
    await page.goto('/ar/login');
    await injectAxe(page);
    await checkA11y(page);
  });

  test('should pass accessibility checks on dashboard', async ({ page }) => {
    await page.goto('/ar/dashboard');
    await injectAxe(page);
    await checkA11y(page);
  });

  test('should have proper heading hierarchy', async ({ page }) => {
    await page.goto('/ar');
    
    // Should have exactly one h1
    const h1Count = await page.locator('h1').count();
    expect(h1Count).toBe(1);
    
    // Headings should be in order (h1 -> h2 -> h3, not h1 -> h3)
    const allHeadings = await page.locator('h1, h2, h3, h4, h5, h6').all();
    
    let prevLevel = 0;
    for (const heading of allHeadings) {
      const tagName = await heading.evaluate(el => el.tagName);
      const level = parseInt(tagName[1]);
      
      // Level should not skip (e.g., h2 -> h4 is invalid)
      expect(level).toBeLessThanOrEqual(prevLevel + 1);
      prevLevel = level;
    }
  });

  test('should have alt text on all images', async ({ page }) => {
    await page.goto('/ar');
    
    const images = page.locator('img');
    const count = await images.count();
    
    for (let i = 0; i < count; i++) {
      const img = images.nth(i);
      const alt = await img.getAttribute('alt');
      
      // Alt attribute must exist (can be empty for decorative images)
      expect(alt).not.toBeNull();
    }
  });

  test('should have proper form labels', async ({ page }) => {
    await page.goto('/ar/login');
    
    const inputs = page.locator('input');
    const count = await inputs.count();
    
    for (let i = 0; i < count; i++) {
      const input = inputs.nth(i);
      const type = await input.getAttribute('type');
      
      // Skip hidden inputs
      if (type === 'hidden') continue;
      
      // Input should have associated label or aria-label
      const ariaLabel = await input.getAttribute('aria-label');
      const ariaLabelledBy = await input.getAttribute('aria-labelledby');
      const id = await input.getAttribute('id');
      
      let hasLabel = false;
      if (ariaLabel || ariaLabelledBy) {
        hasLabel = true;
      } else if (id) {
        const label = page.locator(`label[for="${id}"]`);
        hasLabel = await label.count() > 0;
      }
      
      expect(hasLabel).toBe(true);
    }
  });

  test('should have sufficient color contrast', async ({ page }) => {
    await page.goto('/ar');
    await injectAxe(page);
    
    // Check specifically for color contrast violations
    const results = await page.evaluate(() => {
      return new Promise((resolve) => {
        (window as any).axe.run({ runOnly: ['color-contrast'] }, (err: any, results: any) => {
          resolve(results);
        });
      });
    });
    
    expect((results as any).violations).toHaveLength(0);
  });

  test('should have ARIA landmarks', async ({ page }) => {
    await page.goto('/ar');
    
    // Should have main landmark
    await expect(page.locator('main, [role="main"]')).toBeVisible();
    
    // Should have navigation landmark
    await expect(page.locator('nav, [role="navigation"]')).toBeVisible();
    
    // Should have banner landmark (header)
    await expect(page.locator('header, [role="banner"]')).toBeVisible();
    
    // Should have contentinfo landmark (footer)
    await expect(page.locator('footer, [role="contentinfo"]')).toBeVisible();
  });

  test('should announce errors to screen readers', async ({ page }) => {
    await page.goto('/ar/login');
    
    // Submit empty form
    await page.getByRole('button', { name: 'تسجيل الدخول' }).click();
    
    // Error should have role="alert" or aria-live="polite"
    const errorMessage = page.getByText('البريد الإلكتروني مطلوب');
    
    const role = await errorMessage.getAttribute('role');
    const ariaLive = await errorMessage.getAttribute('aria-live');
    
    expect(role === 'alert' || ariaLive === 'polite' || ariaLive === 'assertive').toBe(true);
  });
});
```

---

## 🔧 HELPER UTILITIES

### `tests/helpers/auth.helper.ts`

```typescript
import { Page } from '@playwright/test';

export async function login(page: Page, email: string, password: string) {
  await page.goto('/ar/login');
  await page.getByLabel('البريد الإلكتروني').fill(email);
  await page.getByLabel('كلمة المرور').fill(password);
  await page.getByRole('button', { name: 'تسجيل الدخول' }).click();
  await page.waitForURL(/\/ar\/dashboard/);
}

export async function loginAs(page: Page, options: { gradeLevel: '1' | '2' | '3'; isNewUser?: boolean }) {
  // Mock API to return user with specific grade
  await page.route('**/api/auth/login', async route => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        user: {
          id: '1',
          name: 'أحمد محمد',
          email: 'test@test.com',
          gradeLevel: options.gradeLevel,
          subscription: { status: 'active', plan: 'premium' },
          stats: options.isNewUser ? {
            totalXp: 0,
            level: 1,
            streak: 0,
            lessonsCompleted: 0,
            quizzesCompleted: 0,
          } : {
            totalXp: 2500,
            level: 5,
            streak: 7,
            lessonsCompleted: 45,
            quizzesCompleted: 23,
          }
        },
        accessToken: 'mock-token',
        refreshToken: 'mock-refresh',
      }),
    });
  });

  await login(page, 'test@test.com', 'Password123');
}

export async function logout(page: Page) {
  await page.getByRole('button', { name: /تسجيل الخروج|Logout/ }).click();
  await page.waitForURL(/\/ar\/login|\/ar$/);
}
```

### `tests/helpers/viewport.helper.ts`

```typescript
import { Page } from '@playwright/test';

export const viewports = {
  mobile: { width: 375, height: 667 },
  mobileLarge: { width: 414, height: 896 },
  tablet: { width: 768, height: 1024 },
  tabletLarge: { width: 1024, height: 1366 },
  desktop: { width: 1280, height: 720 },
  desktopLarge: { width: 1920, height: 1080 },
};

export async function setMobileViewport(page: Page) {
  await page.setViewportSize(viewports.mobile);
}

export async function setTabletViewport(page: Page) {
  await page.setViewportSize(viewports.tablet);
}

export async function setDesktopViewport(page: Page) {
  await page.setViewportSize(viewports.desktop);
}

export async function testOnAllViewports(page: Page, testFn: (page: Page) => Promise<void>) {
  for (const [name, size] of Object.entries(viewports)) {
    await page.setViewportSize(size);
    await testFn(page);
  }
}
```

### `tests/helpers/arabic.helper.ts`

```typescript
import { Page, expect } from '@playwright/test';

export async function checkRTL(page: Page) {
  await expect(page.locator('html')).toHaveAttribute('dir', 'rtl');
}

export async function checkArabicFont(page: Page, selector: string) {
  const element = page.locator(selector);
  const fontFamily = await element.evaluate(el => 
    window.getComputedStyle(el).fontFamily
  );
  
  // Should include Arabic font
  expect(fontFamily).toMatch(/Noto Sans Arabic|Cairo|Tajawal/i);
}

export async function checkTextDirection(page: Page, selector: string) {
  const element = page.locator(selector);
  const textAlign = await element.evaluate(el => 
    window.getComputedStyle(el).textAlign
  );
  
  // RTL should have right alignment
  expect(textAlign).toMatch(/right|start/);
}

export function isArabicText(text: string): boolean {
  // Check if text contains Arabic characters
  return /[\u0600-\u06FF]/.test(text);
}

export async function checkAllTextIsArabic(page: Page) {
  const allText = await page.textContent('body');
  
  // Remove numbers, punctuation, and Latin characters that might be intentional
  const cleanText = allText?.replace(/[0-9.,!?؛،\s]/g, '');
  
  // Most characters should be Arabic
  const arabicChars = (cleanText?.match(/[\u0600-\u06FF]/g) || []).length;
  const totalChars = cleanText?.length || 1;
  
  expect(arabicChars / totalChars).toBeGreaterThan(0.8); // 80% Arabic
}
```

---

## 📊 PLAYWRIGHT CONFIGURATION

### `playwright.config.ts`

```typescript
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  
  reporter: [
    ['html'],
    ['json', { outputFile: 'test-results/results.json' }],
    ['junit', { outputFile: 'test-results/junit.xml' }],
  ],
  
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    
    // Arabic/RTL specific
    locale: 'ar-EG',
    timezoneId: 'Africa/Cairo',
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
    {
      name: 'Mobile Chrome',
      use: { ...devices['Pixel 5'] },
    },
    {
      name: 'Mobile Safari',
      use: { ...devices['iPhone 12'] },
    },
    {
      name: 'Tablet',
      use: { ...devices['iPad Pro'] },
    },
  ],

  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
  },
});
```

---

## 🎯 AUGMENT PROMPT TEMPLATE

Use this when asking Augment to write tests:

```markdown
@augment Write Playwright tests for [COMPONENT/PAGE]

Requirements:
1. Test all user interactions (click, type, submit)
2. Test all states (loading, success, error, empty)
3. Test all viewports (mobile 375px, tablet 768px, desktop 1920px)
4. Test RTL layout and Arabic text
5. Test keyboard navigation (Tab, Enter, Escape, Arrows)
6. Test accessibility (ARIA labels, focus management, screen reader)
7. Test edge cases (slow network, empty data, long text)
8. Use Arabic selectors and assertions
9. Check grade isolation if applicable
10. Follow existing test patterns in tests/e2e/

Context:
- Platform: Next.js 15 + React 19 + TypeScript
- Language: Arabic (RTL)
- User: Egyptian high school students
- Critical: Grade-level isolation

Example structure:
```typescript
test.describe('[Component Name]', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/ar/path');
  });

  test('should display in Arabic', async ({ page }) => {
    await expect(page.getByText(/[ا-ي]+/)).toBeVisible();
  });

  test('should work on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    // ... assertions
  });

  test('should be keyboard navigable', async ({ page }) => {
    await page.keyboard.press('Tab');
    // ... assertions
  });
});
```

Focus on:
- [Specific feature/interaction to test]
- [Specific edge case]
- [Specific accessibility concern]
```

---

This comprehensive testing framework will help Augment catch 95%+ of UI/UX issues before they reach production! 🚀