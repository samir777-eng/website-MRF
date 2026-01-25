import type { Metadata } from 'next';
import CheckoutClient from './checkout-client';

export const metadata: Metadata = {
  title: 'إتمام الطلب',
  description: 'إتمام عملية الشراء والدفع - منصة الأستاذ رضا الفاروق التعليمية',
};

export default function CheckoutPage() {
  return <CheckoutClient />;
}
