import { NextRequest, NextResponse } from "next/server";

/**
 * POST /api/auth/refresh
 * Refresh the authentication token
 */
export async function POST(request: NextRequest) {
  try {
    // Get current auth token from httpOnly cookie
    const authToken = request.cookies.get("auth-token")?.value;

    if (!authToken) {
      return NextResponse.json(
        {
          success: false,
          error: "غير مصرح. يرجى تسجيل الدخول.",
          code: "NO_TOKEN",
        },
        { status: 401 }
      );
    }

    // Validate the existing token
    if (!authToken.startsWith("mock-jwt-token-")) {
      return NextResponse.json(
        {
          success: false,
          error: "جلسة غير صالحة. يرجى تسجيل الدخول مرة أخرى.",
          code: "INVALID_TOKEN",
        },
        { status: 401 }
      );
    }

    // TODO: In production, you would:
    // 1. Verify the existing token is valid (not just expired)
    // 2. Check if the user still exists and is active
    // 3. Generate a new JWT token with fresh expiry
    // 4. Optionally invalidate the old token

    // Generate new token with fresh timestamp
    const newToken = "mock-jwt-token-" + Date.now();

    // Calculate expiry time (24 hours from now)
    const expiryTime = Date.now() + 24 * 60 * 60 * 1000;

    // Create response with new token
    const response = NextResponse.json({
      success: true,
      message: "تم تمديد الجلسة بنجاح",
      expiresAt: expiryTime,
    });

    // Set new HTTP-only cookie
    response.cookies.set("auth-token", newToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 24 * 60 * 60, // 24 hours
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Token refresh error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "حدث خطأ أثناء تمديد الجلسة. يرجى المحاولة مرة أخرى.",
      },
      { status: 500 }
    );
  }
}

/**
 * GET /api/auth/refresh
 * Get current session status and expiry time
 */
export async function GET(request: NextRequest) {
  try {
    const authToken = request.cookies.get("auth-token")?.value;

    if (!authToken) {
      return NextResponse.json({
        success: false,
        authenticated: false,
        error: "غير مصرح",
      });
    }

    // Validate token format
    if (!authToken.startsWith("mock-jwt-token-")) {
      return NextResponse.json({
        success: false,
        authenticated: false,
        error: "جلسة غير صالحة",
      });
    }

    // Extract timestamp from mock token
    const tokenTimestamp = parseInt(authToken.replace("mock-jwt-token-", ""));

    // TODO: In production, decode JWT to get actual expiry
    // For mock: assume 24 hour expiry from token creation
    const expiryTime = tokenTimestamp + 24 * 60 * 60 * 1000;
    const isExpired = Date.now() > expiryTime;
    const timeRemaining = Math.max(0, expiryTime - Date.now());

    return NextResponse.json({
      success: true,
      authenticated: !isExpired,
      expiresAt: expiryTime,
      timeRemaining,
      isExpired,
    });
  } catch (error) {
    console.error("Session status check error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "حدث خطأ أثناء التحقق من الجلسة.",
      },
      { status: 500 }
    );
  }
}
