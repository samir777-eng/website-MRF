"use client";

import React, { ReactElement } from "react";
import { render, RenderOptions } from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ToastProvider } from "@/components/ui/toast";
import { Toaster } from "@/components/ui/toaster";

// Mock translations
const messages = {
  common: {
    loading: "جاري التحميل...",
    error: "حدث خطأ",
    success: "تم بنجاح",
    cancel: "إلغاء",
    confirm: "تأكيد",
    save: "حفظ",
    delete: "حذف",
    edit: "تعديل",
    close: "إغلاق",
    back: "رجوع",
    next: "التالي",
    previous: "السابق",
    submit: "إرسال",
    search: "بحث",
    filter: "تصفية",
    sort: "ترتيب",
    all: "الكل",
    none: "لا شيء",
  },
  nav: {
    home: "الرئيسية",
    dashboard: "لوحة التحكم",
    courses: "الدورات",
    lessons: "الدروس",
    quizzes: "الاختبارات",
    profile: "الملف الشخصي",
    settings: "الإعدادات",
    logout: "تسجيل الخروج",
  },
  footer: {
    copyright: "© 2024 MRF Education",
    privacy: "سياسة الخصوصية",
    terms: "الشروط والأحكام",
    contact: "اتصل بنا",
    about: "من نحن",
  },
  gamification: {
    xp: "نقاط الخبرة",
    level: "المستوى",
    streak: "السلسلة",
    achievements: "الإنجازات",
    leaderboard: "لوحة المتصدرين",
    quests: "المهام",
    gems: "الجواهر",
  },
};

// All Providers wrapper
function AllProviders({ children }: { children: React.ReactNode }) {
  return (
    <NextIntlClientProvider locale="ar" messages={messages}>
      <TooltipProvider>
        <ToastProvider>
          {children}
          <Toaster />
        </ToastProvider>
      </TooltipProvider>
    </NextIntlClientProvider>
  );
}

// Custom render function with providers
function customRender(
  ui: ReactElement,
  options?: Omit<RenderOptions, "wrapper">,
) {
  return render(ui, { wrapper: AllProviders, ...options });
}

// Re-export everything from testing-library
export * from "@testing-library/react";

// Override render method
export { customRender as render };

// Export providers for custom usage
export { AllProviders };

// Mock data for components that need props
export const mockLesson = {
  id: "1",
  title: "درس تجريبي",
  description: "وصف الدرس التجريبي",
  duration: 30,
  difficulty: "متوسط" as const,
  xpReward: 100,
  thumbnail: "/images/lesson.jpg",
  videoUrl: "/videos/lesson.mp4",
  progress: 50,
  isCompleted: false,
  isLocked: false,
};

export const mockQuiz = {
  id: "1",
  title: "اختبار تجريبي",
  description: "وصف الاختبار التجريبي",
  duration: 15,
  questions_data: [
    {
      id: "1",
      type: "multiple_choice" as const,
      question: "ما هو الجواب الصحيح؟",
      options: ["أ", "ب", "ج", "د"],
      correctAnswer: 0,
    },
  ],
  xpReward: 50,
  passingScore: 70,
};

export const mockUser = {
  id: "1",
  name: "طالب تجريبي",
  email: "student@test.com",
  avatar: "/images/avatar.jpg",
  xp: 1500,
  level: 5,
  streak: 7,
  gems: 250,
};

export const mockAchievement = {
  id: "1",
  name: "المتعلم النشط",
  description: "أكمل 10 دروس",
  icon: "🏆",
  xpReward: 100,
  gemReward: 10,
  isUnlocked: true,
  unlockedAt: new Date().toISOString(),
  progress: 100,
  category: "learning" as const,
};

export const mockQuest = {
  id: "1",
  title: "مهمة يومية",
  description: "أكمل درسين اليوم",
  type: "daily" as const,
  xpReward: 50,
  gemReward: 5,
  progress: 1,
  target: 2,
  expiresAt: new Date(Date.now() + 86400000).toISOString(),
  isCompleted: false,
};
