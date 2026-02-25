import type { Metadata } from 'next';
import SignupClient from './signup-client';

export const metadata: Metadata = {
  title: 'إنشاء حساب جديد',
  description: 'إنشاء حساب جديد على المنصة - منصة الأستاذ رضا الفاروق التعليمية',
};

export default function SignupPage() {
  return <SignupClient />;
}
