import type { Metadata } from "next";
import StoreClient from "./store-client";

export const metadata: Metadata = {
  title: "المتجر",
  description:
    "تصفح باقات الاشتراك والكتب والمكافآت - منصة الأستاذ رضا الفاروق التعليمية",
};

export default function StorePage() {
  return <StoreClient />;
}
