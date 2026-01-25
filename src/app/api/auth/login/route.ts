import { NextRequest, NextResponse } from 'next/server';
import { rateLimit, getResetTime } from '@/lib/security/rate-limiter';
import { loginSchema } from '@/lib/validation/auth-schemas';

/**
 * POST /api/auth/login
 * Authenticate user with email and password
 */
export async function POST(request: NextRequest) {
  try {
    // Apply rate limiting: 5 attempts per minute
    if (!rateLimit(request, 5, 60000)) {
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
    const validation = loginSchema.safeParse(body);

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

    const { email, password, rememberMe } = validation.data;

    // TODO: Replace with actual authentication logic
    // This is a placeholder for demonstration
    // In production, you would:
    // 1. Query database for user by email
    // 2. Verify password hash
    // 3. Generate JWT token
    // 4. Set secure HTTP-only cookie
    // 5. Return user data

    // Mock authentication (REMOVE IN PRODUCTION)
    if (email === 'test@example.com' && password === 'password123') {
      // Generate mock token (replace with actual JWT)
      const token = 'mock-jwt-token-' + Date.now();

      // Set HTTP-only cookie
      const response = NextResponse.json(
        {
          success: true,
          message: 'تم تسجيل الدخول بنجاح',
          user: {
            id: '1',
            name: 'مستخدم تجريبي',
            email,
            role: 'student',
          },
        },
        { status: 200 }
      );

      // Set secure cookie
      response.cookies.set('auth-token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: rememberMe ? 30 * 24 * 60 * 60 : 24 * 60 * 60, // 30 days or 1 day
        path: '/',
      });

      return response;
    }

    // Invalid credentials
    return NextResponse.json(
      {
        success: false,
        error: 'البريد الإلكتروني أو كلمة المرور غير صحيحة',
      },
      { status: 401 }
    );
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'حدث خطأ أثناء تسجيل الدخول. يرجى المحاولة مرة أخرى.',
      },
      { status: 500 }
    );
  }
}

