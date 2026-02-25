import { NextRequest, NextResponse } from 'next/server';
import { rateLimit, getResetTime } from '@/lib/security/rate-limiter';
import { forgotPasswordSchema } from '@/lib/validation/auth-schemas';

/**
 * POST /api/auth/forgot-password
 * Send password reset email
 */
export async function POST(request: NextRequest) {
  try {
    // Apply rate limiting: 3 attempts per 15 minutes (prevent abuse)
    if (!rateLimit(request, 3, 15 * 60000)) {
      const retryAfter = Math.ceil(getResetTime(request) / 1000);
      return NextResponse.json(
        {
          success: false,
          error: 'محاولات كثيرة جداً. يرجى المحاولة لاحقاً.',
          retryAfter,
        },
        {
          status: 429,
          headers: {
            'Retry-After': retryAfter.toString(),
          },
        }
      );
    }

    // Parse and validate request body
    const body = await request.json();
    const validation = forgotPasswordSchema.safeParse(body);

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

    const { email } = validation.data;

    // TODO: Replace with actual password reset logic
    // In production, you would:
    // 1. Check if user exists
    // 2. Generate secure reset token
    // 3. Store token in database with expiration
    // 4. Send reset email with token link
    // 5. Return success (don't reveal if email exists for security)

    // Mock password reset (REMOVE IN PRODUCTION)
    // Always return success to prevent email enumeration
    return NextResponse.json(
      {
        success: true,
        message: 'إذا كان البريد الإلكتروني مسجلاً، ستتلقى رسالة لإعادة تعيين كلمة المرور',
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Forgot password error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'حدث خطأ. يرجى المحاولة مرة أخرى.',
      },
      { status: 500 }
    );
  }
}

