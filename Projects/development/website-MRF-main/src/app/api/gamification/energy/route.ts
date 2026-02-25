import { NextRequest, NextResponse } from 'next/server';
import { rateLimit, getResetTime } from '@/lib/security/rate-limiter';
import { consumeEnergySchema } from '@/lib/gamification/server-types';
import { consumeEnergy } from '@/lib/gamification/server-utils';

/**
 * POST /api/gamification/energy
 * 
 * Consume energy for an action.
 * Server-side validated to prevent energy manipulation.
 */
export async function POST(request: NextRequest) {
  try {
    // Rate limiting: 30 energy actions per minute
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
    const validation = consumeEnergySchema.safeParse(body);

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

    const { action } = validation.data;

    // Consume energy using server-side logic
    const result = consumeEnergy(userId, action);

    if (!result.success) {
      return NextResponse.json(
        { 
          success: false, 
          error: result.error,
          currentEnergy: result.currentEnergy,
          timeToNextEnergy: result.timeToNextEnergy,
        },
        { status: 403 }
      );
    }

    return NextResponse.json({
      success: true,
      energyConsumed: result.energyConsumed,
      currentEnergy: result.currentEnergy,
      timeToNextEnergy: result.timeToNextEnergy,
    });

  } catch (error) {
    console.error('Consume energy error:', error);
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

