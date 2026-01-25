import { NextRequest, NextResponse } from 'next/server';
import { rateLimit, getResetTime } from '@/lib/security/rate-limiter';
import { registerSchema } from '@/lib/validation/auth-schemas';

/**
 * POST /api/auth/register
 * Register a new user account
 */
export async function POST(request: NextRequest) {
  try {
    // Apply rate limiting: 3 attempts per 5 minutes (stricter for registration)
    if (!rateLimit(request, 3, 5 * 60000)) {
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
    const validation = registerSchema.safeParse(body);

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

    const { name, email, phone, password, grade } = validation.data;

    // TODO: Replace with actual registration logic
    // In production, you would:
    // 1. Check if email/phone already exists
    // 2. Hash password with bcrypt
    // 3. Create user in database
    // 4. Send verification email/SMS
    // 5. Generate JWT token
    // 6. Return success response

    // Mock registration (REMOVE IN PRODUCTION)
    // Check if email already exists (mock)
    if (email === 'existing@example.com') {
      return NextResponse.json(
        {
          success: false,
          error: 'البريد الإلكتروني مستخدم بالفعل',
        },
        { status: 409 }
      );
    }

    // Check if phone already exists (mock)
    if (phone === '01234567890') {
      return NextResponse.json(
        {
          success: false,
          error: 'رقم الهاتف مستخدم بالفعل',
        },
        { status: 409 }
      );
    }

    // Mock successful registration
    const userId = 'user-' + Date.now();
    const token = 'mock-jwt-token-' + Date.now();

    const response = NextResponse.json(
      {
        success: true,
        message: 'تم إنشاء الحساب بنجاح',
        user: {
          id: userId,
          name,
          email,
          phone,
          grade,
          role: 'student',
          verified: false,
        },
        requiresVerification: true,
      },
      { status: 201 }
    );

    // Set secure cookie
    response.cookies.set('auth-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 24 * 60 * 60, // 1 day
      path: '/',
    });

    return response;
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'حدث خطأ أثناء إنشاء الحساب. يرجى المحاولة مرة أخرى.',
      },
      { status: 500 }
    );
  }
}

