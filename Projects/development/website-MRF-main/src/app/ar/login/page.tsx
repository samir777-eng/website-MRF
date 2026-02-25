import type { Metadata } from 'next';
import LoginClient from './login-client';

export const metadata: Metadata = {
  title: 'تسجيل الدخول',
  description: 'تسجيل الدخول إلى حسابك - منصة الأستاذ رضا الفاروق التعليمية',
};

export default function LoginPage() {
  return <LoginClient />;
}
