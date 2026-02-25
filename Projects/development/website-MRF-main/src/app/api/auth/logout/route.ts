import { NextRequest, NextResponse } from 'next/server';

/**
 * POST /api/auth/logout
 * Logout user and clear authentication cookie
 */
export async function POST(request: NextRequest) {
  try {
    const response = NextResponse.json(
      {
        success: true,
        message: 'تم تسجيل الخروج بنجاح',
      },
      { status: 200 }
    );

    // Clear authentication cookie
    response.cookies.delete('auth-token');

    return response;
  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'حدث خطأ أثناء تسجيل الخروج',
      },
      { status: 500 }
    );
  }
}

