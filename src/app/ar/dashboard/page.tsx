import type { Metadata } from "next";
import ArabicDashboardClient from "./dashboard-client";

export const metadata: Metadata = {
  title: "لوحة التحكم",
  description: "لوحة التحكم الخاصة بك - منصة الأستاذ رضا الفاروق التعليمية",
};

export default function ArabicDashboardPage() {
  return <ArabicDashboardClient />;
}
