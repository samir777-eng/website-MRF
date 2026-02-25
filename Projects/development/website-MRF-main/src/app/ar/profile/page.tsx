import type { Metadata } from 'next';
import ProfileClient from './profile-client';

export const metadata: Metadata = {
  title: 'الملف الشخصي',
  description: 'عرض وتعديل الملف الشخصي - منصة الأستاذ رضا الفاروق التعليمية',
};

export default function ProfilePage() {
  return <ProfileClient />;
}
