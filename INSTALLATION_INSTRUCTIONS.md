# 📦 INSTALLATION INSTRUCTIONS

## Required Dependencies

The following fixes require installing additional dependencies:

### 1. Zod (Validation Library)

**Required for:** Server-side validation in API routes

```bash
npm install zod
```

**Usage:** Already implemented in:
- `src/lib/validation/auth-schemas.ts`
- `src/app/api/auth/login/route.ts`
- `src/app/api/auth/register/route.ts`
- `src/app/api/auth/forgot-password/route.ts`

---

## Optional Dependencies (Recommended)

### 2. Husky (Pre-commit Hooks)

**Purpose:** Run linting and tests before commits

```bash
npm install --save-dev husky lint-staged
npx husky install
```

**Setup:**
```bash
# Create pre-commit hook
npx husky add .husky/pre-commit "npm run lint && npm run type-check"
```

**Configure lint-staged in package.json:**
```json
{
  "lint-staged": {
    "*.{ts,tsx,js,jsx}": [
      "eslint --fix",
      "prettier --write"
    ]
  }
}
```

---

### 3. Sentry (Error Tracking)

**Purpose:** Production error monitoring

```bash
npm install @sentry/nextjs
npx @sentry/wizard@latest -i nextjs
```

**Environment Variables:**
```bash
# .env.local
NEXT_PUBLIC_SENTRY_DSN=your-sentry-dsn
SENTRY_AUTH_TOKEN=your-auth-token
```

---

### 4. Sharp (Image Optimization)

**Purpose:** Convert images to WebP format

```bash
npm install sharp
```

**Usage:**
```bash
node scripts/convert-images-to-webp.js
```

---

## Verification

After installing dependencies, verify everything works:

```bash
# Type check
npm run type-check

# Lint
npm run lint

# Build
npm run build

# Run tests
npm test
```

---

## Next Steps

1. **Install Zod** (Required)
   ```bash
   npm install zod
   ```

2. **Test API Routes**
   ```bash
   npm run dev
   # Test: POST http://localhost:3000/api/auth/login
   ```

3. **Install Optional Dependencies** (Recommended)
   - Husky for pre-commit hooks
   - Sentry for error tracking
   - Sharp for image optimization

4. **Review Implementation**
   - Check `src/app/api/auth/` for API routes
   - Check `src/lib/validation/` for validation schemas
   - Check `src/components/legal/` for cookie consent

---

## Troubleshooting

### Zod Installation Issues

If you encounter issues:
```bash
npm install zod --legacy-peer-deps
```

### Type Errors

If you see TypeScript errors after installation:
```bash
npm run type-check
```

### Build Errors

If build fails:
```bash
rm -rf .next
npm run build
```

---

## Summary of Changes

### ✅ Files Created
1. `src/lib/validation/auth-schemas.ts` - Validation schemas
2. `src/app/api/auth/login/route.ts` - Login API with rate limiting
3. `src/app/api/auth/register/route.ts` - Registration API with rate limiting
4. `src/app/api/auth/forgot-password/route.ts` - Password reset API
5. `src/app/api/auth/logout/route.ts` - Logout API
6. `src/components/legal/cookie-consent.tsx` - Cookie consent banner

### ✅ Files Modified
1. `src/components/accessibility/skip-links.tsx` - Arabic labels
2. `src/components/ui/theme-toggle.tsx` - Arabic aria-labels
3. `src/components/ui/breadcrumb.tsx` - Arabic aria-label
4. `src/components/search/search-modal.tsx` - Fixed `any` type
5. `src/components/docs/component-catalog.tsx` - Fixed `any` types
6. `src/components/dashboard/widget-grid.tsx` - Fixed `any` types
7. `src/app/ar/layout.tsx` - Added cookie consent
8. `next.config.ts` - Added security headers
9. `src/middleware.ts` - Added HTTPS enforcement

### ✅ Infrastructure Created
1. `src/lib/security/rate-limiter.ts` - Rate limiting utility
2. `scripts/convert-images-to-webp.js` - Image optimization script

---

**Installation Complete!** 🎉

Run `npm install zod` to enable all new features.

