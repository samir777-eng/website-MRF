import { NextRequest, NextResponse } from 'next/server';
import { rateLimit, getResetTime } from '@/lib/security/rate-limiter';
import { awardXPSchema } from '@/lib/gamification/server-types';
import { awardXP } from '@/lib/gamification/server-utils';

/**
 * POST /api/gamification/award-xp
 * 
 * Server-side validated XP awarding endpoint.
 * This is the ONLY way XP should be awarded - never trust client-side calculations.
 */
export async function POST(request: NextRequest) {
  try {
    // Rate limiting: 30 XP awards per minute (generous for normal use)
    if (!rateLimit(request, 30, 60000)) {
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
    // TODO: Replace with actual auth extraction
    const authToken = request.cookies.get('auth-token')?.value;
    const userId = authToken ? extractUserIdFromToken(authToken) : 'demo-user';
    
    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'غير مصرح. يرجى تسجيل الدخول.' },
        { status: 401 }
      );
    }

    // Parse and validate request body
    const body = await request.json();
    const validation = awardXPSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        {
          success: false,
          error: 'بيانات غير صالحة',
          errors: validation.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const { action, context, nonce } = validation.data;

    // TODO: Implement nonce checking for request deduplication
    // This prevents replaying the same request multiple times

    // Award XP using server-side logic
    const result = awardXP(userId, action, context);

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 429 } // Too many requests / cooldown
      );
    }

    return NextResponse.json({
      success: true,
      xpAwarded: result.xpAwarded,
      totalXP: result.totalXP,
      level: result.level,
      levelUp: result.levelUp,
      previousLevel: result.levelUp ? result.previousLevel : undefined,
      newAchievements: result.newAchievements.length > 0 
        ? result.newAchievements 
        : undefined,
    });

  } catch (error) {
    console.error('Award XP error:', error);
    return NextResponse.json(
      { success: false, error: 'حدث خطأ. يرجى المحاولة مرة أخرى.' },
      { status: 500 }
    );
  }
}

/**
 * Extract user ID from auth token
 * TODO: Implement proper JWT validation
 */
function extractUserIdFromToken(token: string): string | null {
  // For demo purposes, return a mock user ID
  // In production, properly decode and validate the JWT
  if (token.startsWith('mock-jwt-token-')) {
    return 'user-1';
  }
  return 'demo-user';
}

