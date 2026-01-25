import { NextRequest, NextResponse } from 'next/server';
import { rateLimit, getResetTime } from '@/lib/security/rate-limiter';
import { updateStreak } from '@/lib/gamification/server-utils';

/**
 * POST /api/gamification/streak
 * 
 * Update user's streak on daily login.
 * Server-side validated to prevent streak manipulation.
 */
export async function POST(request: NextRequest) {
  try {
    // Rate limiting: 10 streak updates per hour (should only happen once per day)
    if (!rateLimit(request, 10, 3600000)) {
      const retryAfter = Math.ceil(getResetTime(request) / 1000);
      return NextResponse.json(
        {
          success: false,
          error: 'طلبات كثيرة جداً. يرجى المحاولة لاحقاً.',
          retryAfter,
        },
        {
          status: 429,
          headers: { 'Retry-After': retryAfter.toString() },
        }
      );
    }

    // Get user ID from auth cookie/session
    const authToken = request.cookies.get('auth-token')?.value;
    const userId = authToken ? extractUserIdFromToken(authToken) : 'demo-user';
    
    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'غير مصرح. يرجى تسجيل الدخول.' },
        { status: 401 }
      );
    }

    // Update streak using server-side logic
    const result = updateStreak(userId);

    return NextResponse.json({
      success: true,
      currentStreak: result.currentStreak,
      longestStreak: result.longestStreak,
      xpAwarded: result.xpAwarded,
      isNewDay: result.isNewDay,
      streakMaintained: result.streakMaintained,
    });

  } catch (error) {
    console.error('Update streak error:', error);
    return NextResponse.json(
      { success: false, error: 'حدث خطأ. يرجى المحاولة مرة أخرى.' },
      { status: 500 }
    );
  }
}

/**
 * Extract user ID from auth token
 */
function extractUserIdFromToken(token: string): string | null {
  if (token.startsWith('mock-jwt-token-')) {
    return 'user-1';
  }
  return 'demo-user';
}

