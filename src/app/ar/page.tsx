import type { Metadata } from 'next';
import ArabicHomeClient from './home-client';

export const metadata: Metadata = {
  title: 'الصفحة الرئيسية',
  description: 'منصة الأستاذ رضا الفاروق التعليمية - تعلم اللغة العربية للثانوية العامة',
};

export default function ArabicHomePage() {
  return <ArabicHomeClient />;
}
