import { NextRequest, NextResponse } from "next/server";

// In-memory user store (replace with database in production)
const userStore = new Map<
  string,
  {
    id: string;
    name: string;
    email: string;
    phone?: string;
    grade: string;
    role: "student" | "teacher" | "admin";
    verified: boolean;
    subscriptionStatus: "active" | "inactive" | "trial";
    subscriptionPlan?: string;
    createdAt: string;
  }
>();

// Initialize with demo user
userStore.set("user-1", {
  id: "user-1",
  name: "أحمد محمد",
  email: "test@example.com",
  phone: "01012345678",
  grade: "3",
  role: "student",
  verified: true,
  subscriptionStatus: "active",
  subscriptionPlan: "semester",
  createdAt: new Date("2025-01-01").toISOString(),
});

/**
 * GET /api/auth/me
 * Get current authenticated user from httpOnly cookie
 */
export async function GET(request: NextRequest) {
  try {
    // Get auth token from httpOnly cookie
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

    // Validate token and extract user ID
    const userId = validateTokenAndGetUserId(authToken);

    if (!userId) {
      // Clear invalid cookie
      const response = NextResponse.json(
        {
          success: false,
          error: "جلسة غير صالحة. يرجى تسجيل الدخول مرة أخرى.",
          code: "INVALID_TOKEN",
        },
        { status: 401 }
      );
      response.cookies.delete("auth-token");
      return response;
    }

    // Get user from store
    const user = userStore.get(userId);

    if (!user) {
      // User not found, clear cookie
      const response = NextResponse.json(
        {
          success: false,
          error: "المستخدم غير موجود.",
          code: "USER_NOT_FOUND",
        },
        { status: 401 }
      );
      response.cookies.delete("auth-token");
      return response;
    }

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        gradeLevel: user.grade,
        role: user.role,
        verified: user.verified,
        subscriptionStatus: user.subscriptionStatus,
        subscriptionPlan: user.subscriptionPlan,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    console.error("Get user error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "حدث خطأ. يرجى المحاولة مرة أخرى.",
      },
      { status: 500 }
    );
  }
}

/**
 * Validate token and extract user ID
 * TODO: Implement proper JWT validation
 */
function validateTokenAndGetUserId(token: string): string | null {
  // For mock tokens, extract the user ID
  if (token.startsWith("mock-jwt-token-")) {
    // In the mock implementation, we'll return user-1 for all valid tokens
    return "user-1";
  }

  // TODO: In production, properly decode and validate the JWT
  // const decoded = jwt.verify(token, process.env.JWT_SECRET);
  // return decoded.sub;

  return null;
}
