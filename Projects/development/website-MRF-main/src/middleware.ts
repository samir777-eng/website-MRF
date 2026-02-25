import { NextRequest, NextResponse } from "next/server";

/**
 * Protected routes that require authentication
 * Users without valid auth token will be redirected to login
 */
const PROTECTED_ROUTES = [
  '/ar/dashboard',
  '/ar/checkout',
  '/ar/profile',
  '/ar/settings',
  '/ar/orders',
  '/ar/notifications',
  '/ar/achievements',
  '/ar/quests',
  '/ar/challenges',
  '/ar/leaderboard',
  '/ar/homework',
  '/ar/quizzes',
  '/ar/exercises',
  '/ar/review',
  '/ar/subscription',
  '/ar/cart',
  '/ar/adaptive',
];

/**
 * Protected route patterns (regex) for dynamic routes
 */
const PROTECTED_ROUTE_PATTERNS = [
  /^\/ar\/lectures\/[^/]+\/pre-quiz/,
  /^\/ar\/lectures\/[^/]+\/post-quiz/,
  /^\/ar\/lectures\/[^/]+\/homework/,
  /^\/ar\/courses\/[^/]+\/lessons/,
  /^\/ar\/courses\/[^/]+\/quiz/,
];

/**
 * Public routes that don't require authentication
 * (explicitly listed for clarity)
 */
const PUBLIC_ROUTES = [
  '/ar',
  '/ar/auth',
  '/ar/auth/login',
  '/ar/auth/signup',
  '/ar/auth/forgot-password',
  '/ar/auth/reset-password',
  '/ar/auth/verify-email',
  '/ar/login',
  '/ar/signup',
  '/ar/forgot-password',
  '/ar/lectures',
  '/ar/store',
  '/ar/shop',
  '/ar/books',
  '/ar/bundles',
  '/ar/about',
  '/ar/contact',
  '/ar/help',
  '/ar/terms',
  '/ar/privacy',
  '/ar/distributor',
  '/ar/sales-points',
  '/ar/corners',
];

/**
 * Check if the route requires authentication
 */
function isProtectedRoute(pathname: string): boolean {
  // Check exact matches
  if (PROTECTED_ROUTES.some(route => pathname === route || pathname.startsWith(route + '/'))) {
    return true;
  }

  // Check pattern matches
  if (PROTECTED_ROUTE_PATTERNS.some(pattern => pattern.test(pathname))) {
    return true;
  }

  return false;
}

/**
 * Check if the route is explicitly public
 */
function isPublicRoute(pathname: string): boolean {
  // Exact match or starts with public route
  return PUBLIC_ROUTES.some(route =>
    pathname === route ||
    (route !== '/ar' && pathname.startsWith(route + '/'))
  );
}

/**
 * Validate the auth token (basic validation)
 * More thorough validation is done server-side in /api/auth/me
 */
function isValidAuthToken(token: string | undefined): boolean {
  if (!token) return false;

  // Basic check - token exists and has minimum length
  // Real validation happens on the server
  return token.length > 10;
}

/**
 * Add security headers to response
 */
function addSecurityHeaders(response: NextResponse): NextResponse {
  response.headers.set('X-Frame-Options', 'SAMEORIGIN');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  return response;
}

export default function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Force HTTPS in production
  if (
    process.env.NODE_ENV === 'production' &&
    request.headers.get('x-forwarded-proto') !== 'https'
  ) {
    return NextResponse.redirect(
      `https://${request.headers.get('host')}${request.nextUrl.pathname}${request.nextUrl.search}`,
      301
    );
  }

  // Skip API routes, static files
  if (
    pathname.startsWith('/api') ||
    pathname.startsWith('/_next') ||
    pathname.includes('.') // Skip files with extensions
  ) {
    return addSecurityHeaders(NextResponse.next());
  }

  // Handle routes starting with /ar
  if (pathname.startsWith('/ar')) {
    const authToken = request.cookies.get('auth-token')?.value;
    const isAuthenticated = isValidAuthToken(authToken);

    // Check if this is a protected route
    if (isProtectedRoute(pathname)) {
      if (!isAuthenticated) {
        // Redirect to login with the original path for redirect after login
        const loginUrl = new URL('/ar/auth/login', request.url);
        loginUrl.searchParams.set('redirect', pathname);
        loginUrl.searchParams.set('message', 'يرجى تسجيل الدخول للوصول إلى هذه الصفحة');

        const response = NextResponse.redirect(loginUrl);
        return addSecurityHeaders(response);
      }
    }

    // If authenticated user tries to access login/signup, redirect to dashboard
    if (isAuthenticated && (
      pathname === '/ar/auth/login' ||
      pathname === '/ar/auth/signup' ||
      pathname === '/ar/login' ||
      pathname === '/ar/signup'
    )) {
      const response = NextResponse.redirect(new URL('/ar/dashboard', request.url));
      return addSecurityHeaders(response);
    }

    return addSecurityHeaders(NextResponse.next());
  }

  // Redirect all other paths to /ar prefix
  const response = NextResponse.redirect(new URL(`/ar${pathname}`, request.url));
  return addSecurityHeaders(response);
}

export const config = {
  // Match all paths
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
