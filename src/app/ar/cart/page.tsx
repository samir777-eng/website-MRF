import type { Metadata } from 'next';
import CartClient from './cart-client';

export const metadata: Metadata = {
  title: 'سلة التسوق',
  description: 'عرض وإدارة سلة التسوق الخاصة بك - منصة الأستاذ رضا الفاروق التعليمية',
};

export default function CartPage() {
  return <CartClient />;
}

