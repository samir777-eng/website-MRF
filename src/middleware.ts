import { NextRequest, NextResponse } from "next/server";

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

  // Skip API routes, static files, and already localized paths
  if (
    pathname.startsWith('/api') ||
    pathname.startsWith('/_next') ||
    pathname.startsWith('/ar') ||
    pathname.includes('.') // Skip files with extensions
  ) {
    const response = NextResponse.next();

    // Add security headers
    response.headers.set('X-Frame-Options', 'SAMEORIGIN');
    response.headers.set('X-Content-Type-Options', 'nosniff');
    response.headers.set('X-XSS-Protection', '1; mode=block');

    return response;
  }

  // Redirect all other paths to /ar prefix
  const response = NextResponse.redirect(new URL(`/ar${pathname}`, request.url));

  // Add security headers to redirect response
  response.headers.set('X-Frame-Options', 'SAMEORIGIN');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-XSS-Protection', '1; mode=block');

  return response;
}

export const config = {
  // Match all paths except those starting with /api, /_next, /ar, or containing a dot
  matcher: ['/((?!api|_next|ar).*)'],
};
