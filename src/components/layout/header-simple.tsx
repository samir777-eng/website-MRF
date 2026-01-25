"use client";

import Link from "next/link";
// import { useLocale } from 'next-intl';
import { GraduationCap } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Header() {
  const locale = "ar"; // Hardcoded for now

  return (
    <header
      id="navigation"
      className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
    >
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link
            href={`/${locale}`}
            className="flex items-center space-x-2 rtl:space-x-reverse"
          >
            <GraduationCap className="h-8 w-8 text-primary-600" />
            <span className="text-xl font-bold text-primary-900 dark:text-primary-100">
              الأستاذ رضا الفاروق
            </span>
          </Link>

          {/* Simple Navigation */}
          <nav
            aria-label="Main navigation"
            className="hidden md:flex items-center space-x-6 rtl:space-x-reverse"
          >
            <Link
              href={`/${locale}`}
              className="text-sm font-medium transition-colors hover:text-primary-600"
            >
              الرئيسية
            </Link>
            <Link
              href={`/${locale}/lessons`}
              className="text-sm font-medium transition-colors hover:text-primary-600"
            >
              الدروس
            </Link>
            <Link
              href={`/${locale}/about`}
              className="text-sm font-medium transition-colors hover:text-primary-600"
            >
              عن الأستاذ
            </Link>
          </nav>

          {/* Auth Buttons */}
          <div className="flex items-center space-x-2 rtl:space-x-reverse">
            <Link href={`/${locale}/login`}>
              <Button variant="ghost" size="sm">
                تسجيل الدخول
              </Button>
            </Link>
            <Link href={`/${locale}/register`}>
              <Button size="sm">إنشاء حساب</Button>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
