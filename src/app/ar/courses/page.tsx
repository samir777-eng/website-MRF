import type { Metadata } from 'next';
import ArabicCoursesClient from './courses-client';

export const metadata: Metadata = {
  title: 'الدورات التعليمية',
  description: 'تصفح جميع الدورات التعليمية المتاحة - منصة الأستاذ رضا الفاروق التعليمية',
};

export default function ArabicCoursesPage() {
  return <ArabicCoursesClient />;
}
