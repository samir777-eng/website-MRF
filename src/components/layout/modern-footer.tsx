"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Facebook,
  Heart,
  Instagram,
  Mail,
  MapPin,
  Phone,
  Star,
  Twitter,
  Youtube,
} from "lucide-react";
import Link from "next/link";

export default function ModernFooter() {
  return (
    <footer
      id="footer"
      className="bg-gradient-to-br from-muted via-muted/80 to-muted dark:from-slate-900 dark:via-blue-900 dark:to-purple-900 text-foreground dark:text-white relative overflow-hidden"
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10 dark:opacity-10">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-primary/20 to-violet-600/20"></div>
        <div className="absolute top-10 left-10 w-32 h-32 bg-primary rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 right-10 w-40 h-40 bg-violet-500 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 py-16 relative z-10">
        {/* Main Footer Content */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <div className="mb-6">
              <h2 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-primary to-violet-600 dark:from-blue-400 dark:to-purple-400 mb-4">
                الأستاذ رضا الفاروق
              </h2>
              <Badge className="bg-gradient-to-r from-primary to-violet-600 text-primary-foreground px-4 py-2 text-sm font-medium shadow-lg rounded-full mb-4">
                ✨ 31+ سنة من التميز في التدريس
              </Badge>
            </div>

            <p className="text-lg text-muted-foreground dark:text-gray-300 leading-relaxed mb-6 max-w-md">
              منصة تعليمية متطورة لتعلم اللغة العربية بطريقة تفاعلية وممتعة.
              نساعد الطلاب على تحقيق أهدافهم الأكاديمية والوصول للتفوق.
            </p>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="text-center p-4 rounded-2xl bg-foreground/5 dark:bg-white/10 backdrop-blur-sm border border-border dark:border-white/20">
                <div className="text-2xl font-bold text-primary dark:text-blue-400 mb-1">
                  10K+
                </div>
                <div className="text-sm text-muted-foreground dark:text-gray-400">طالب متفوق</div>
              </div>
              <div className="text-center p-4 rounded-2xl bg-foreground/5 dark:bg-white/10 backdrop-blur-sm border border-border dark:border-white/20">
                <div className="text-2xl font-bold text-violet-600 dark:text-purple-400 mb-1">
                  98%
                </div>
                <div className="text-sm text-muted-foreground dark:text-gray-400">نسبة النجاح</div>
              </div>
            </div>

            {/* Social Media */}
            <div className="flex gap-4">
              <Button
                size="icon"
                rounded="full"
                className="bg-blue-600 hover:bg-blue-700 text-white"
                aria-label="تابعنا على فيسبوك"
              >
                <Facebook className="w-5 h-5" aria-hidden="true" />
              </Button>
              <Button
                size="icon"
                rounded="full"
                className="bg-sky-500 hover:bg-sky-600 text-white"
                aria-label="تابعنا على تويتر"
              >
                <Twitter className="w-5 h-5" aria-hidden="true" />
              </Button>
              <Button
                size="icon"
                rounded="full"
                className="bg-pink-600 hover:bg-pink-700 text-white"
                aria-label="تابعنا على إنستغرام"
              >
                <Instagram className="w-5 h-5" aria-hidden="true" />
              </Button>
              <Button
                size="icon"
                rounded="full"
                className="bg-red-600 hover:bg-red-700 text-white"
                aria-label="تابعنا على يوتيوب"
              >
                <Youtube className="w-5 h-5" aria-hidden="true" />
              </Button>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xl font-bold mb-6 text-primary dark:text-blue-400">
              روابط سريعة
            </h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/ar"
                  className="text-muted-foreground dark:text-gray-300 hover:text-foreground dark:hover:text-white transition-colors duration-300 flex items-center group"
                >
                  <Star className="w-4 h-4 me-2 group-hover:text-yellow-500 dark:group-hover:text-yellow-400 transition-colors" />
                  الرئيسية
                </Link>
              </li>
              <li>
                <Link
                  href="/ar/lectures"
                  className="text-muted-foreground dark:text-gray-300 hover:text-foreground dark:hover:text-white transition-colors duration-300 flex items-center group"
                >
                  <Star className="w-4 h-4 me-2 group-hover:text-yellow-500 dark:group-hover:text-yellow-400 transition-colors" />
                  المحاضرات
                </Link>
              </li>
              <li>
                <Link
                  href="/ar/challenges"
                  className="text-muted-foreground dark:text-gray-300 hover:text-foreground dark:hover:text-white transition-colors duration-300 flex items-center group"
                >
                  <Star className="w-4 h-4 me-2 group-hover:text-yellow-500 dark:group-hover:text-yellow-400 transition-colors" />
                  التحديات
                </Link>
              </li>
              <li>
                <Link
                  href="/ar/dashboard"
                  className="text-muted-foreground dark:text-gray-300 hover:text-foreground dark:hover:text-white transition-colors duration-300 flex items-center group"
                >
                  <Star className="w-4 h-4 me-2 group-hover:text-yellow-500 dark:group-hover:text-yellow-400 transition-colors" />
                  لوحة التحكم
                </Link>
              </li>
              <li>
                <Link
                  href="/ar/about"
                  className="text-muted-foreground dark:text-gray-300 hover:text-foreground dark:hover:text-white transition-colors duration-300 flex items-center group"
                >
                  <Star className="w-4 h-4 me-2 group-hover:text-yellow-500 dark:group-hover:text-yellow-400 transition-colors" />
                  عن الأستاذ
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-xl font-bold mb-6 text-violet-600 dark:text-purple-400">
              تواصل معنا
            </h3>
            <ul className="space-y-4">
              <li className="flex items-center text-muted-foreground dark:text-gray-300">
                <Mail className="w-5 h-5 me-3 text-primary dark:text-blue-400" />
                <span>info@mrredaelfarouk.com</span>
              </li>
              <li className="flex items-center text-muted-foreground dark:text-gray-300">
                <Phone className="w-5 h-5 me-3 text-green-600 dark:text-green-400" />
                <span>+20 123 456 7890</span>
              </li>
              <li className="flex items-center text-muted-foreground dark:text-gray-300">
                <MapPin className="w-5 h-5 me-3 text-red-600 dark:text-red-400" />
                <span>القاهرة، مصر</span>
              </li>
            </ul>

            {/* Newsletter */}
            <div className="mt-8 p-6 rounded-2xl bg-gradient-to-r from-primary/10 to-violet-600/10 dark:from-blue-600/20 dark:to-purple-600/20 backdrop-blur-sm border border-border dark:border-white/20">
              <h4 className="font-semibold mb-3 text-foreground dark:text-white">
                اشترك في النشرة الإخبارية
              </h4>
              <p className="text-sm text-muted-foreground dark:text-gray-300 mb-4">
                احصل على آخر الأخبار والعروض
              </p>
              <div className="flex gap-2">
                <input
                  type="email"
                  placeholder="بريدك الإلكتروني"
                  className="flex-1 px-3 py-2 rounded-lg bg-background dark:bg-white/10 border border-input dark:border-white/20 text-foreground dark:text-white placeholder-muted-foreground dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-blue-400"
                />
                <Button
                  size="sm"
                  className="bg-gradient-to-r from-primary to-violet-600 hover:from-primary/90 hover:to-violet-700 text-primary-foreground px-4"
                >
                  اشترك
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-border dark:border-white/20 pt-8">
          {/* Support Links */}
          <div className="flex flex-wrap justify-center gap-4 md:gap-6 mb-6">
            <Link
              href="/ar/help"
              className="text-muted-foreground dark:text-gray-400 hover:text-foreground dark:hover:text-white transition-colors text-sm"
            >
              مركز المساعدة
            </Link>
            <Link
              href="/ar/contact"
              className="text-muted-foreground dark:text-gray-400 hover:text-foreground dark:hover:text-white transition-colors text-sm"
            >
              تواصل معنا
            </Link>
            <Link
              href="/ar/privacy"
              className="text-muted-foreground dark:text-gray-400 hover:text-foreground dark:hover:text-white transition-colors text-sm"
            >
              سياسة الخصوصية
            </Link>
            <Link
              href="/ar/terms"
              className="text-muted-foreground dark:text-gray-400 hover:text-foreground dark:hover:text-white transition-colors text-sm"
            >
              الشروط والأحكام
            </Link>
            <Link
              href="/ar/sales-points"
              className="text-muted-foreground dark:text-gray-400 hover:text-foreground dark:hover:text-white transition-colors text-sm"
            >
              نقاط البيع
            </Link>
            <Link
              href="/ar/distributor"
              className="text-muted-foreground dark:text-gray-400 hover:text-foreground dark:hover:text-white transition-colors text-sm"
            >
              الموزعين
            </Link>
          </div>

          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-muted-foreground dark:text-gray-400 text-sm mb-4 md:mb-0">
              © {new Date().getFullYear()} الأستاذ رضا الفاروق. جميع الحقوق
              محفوظة.
            </div>

            <div className="flex items-center text-muted-foreground dark:text-gray-400 text-sm">
              <span>صُنع بـ</span>
              <Heart className="w-4 h-4 mx-2 text-red-500 animate-pulse" />
              <span>في مصر</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
