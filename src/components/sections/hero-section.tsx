"use client";

import { Button } from "@/components/ui/button";
import { useFocusTrap } from "@/hooks/use-focus-trap";
import {
  ArrowLeft,
  Award,
  CheckCircle,
  Play,
  Shield,
  Star,
  Target,
  TrendingUp,
  Users,
  Video,
  Zap,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

// Format number to Arabic numerals consistently (avoids hydration mismatch)
function formatArabicNumber(num: number): string {
  const arabicNumerals = ["٠", "١", "٢", "٣", "٤", "٥", "٦", "٧", "٨", "٩"];
  const formatted = num.toLocaleString("en-US"); // Use consistent English formatting first
  return formatted.replace(/[0-9]/g, (d) => arabicNumerals[parseInt(d)]);
}

export function HeroSection() {
  const [studentCount, setStudentCount] = useState(14500);
  const [showVideo, setShowVideo] = useState(false);

  // Focus trap for video modal
  const videoModalRef = useFocusTrap(showVideo, {
    returnFocus: true,
    onEscape: () => setShowVideo(false),
  });

  useEffect(() => {
    // Animated student count ticker
    const targetCount = 15247;
    const duration = 2000; // 2 seconds
    const steps = 60;
    const increment = (targetCount - 14500) / steps;
    let currentStep = 0;

    const timer = setInterval(() => {
      currentStep++;
      if (currentStep <= steps) {
        setStudentCount(Math.floor(14500 + increment * currentStep));
      } else {
        setStudentCount(targetCount);
        clearInterval(timer);
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, []);

  const content = {
    badge: `🔥 انضم لـ${formatArabicNumber(studentCount)} طالب متفوق`,
    title: "احصل على 98% في الثانوية العامة",
    subtitle:
      "مع الأستاذ رضا الفاروق - 31 عاماً من التميز في تدريس اللغة العربية",
    socialProof: "⭐⭐⭐⭐⭐ 4.9/5 من 3,241 تقييم",
    ctaPrimary: "ابدأ تجربتك المجانية لـ7 أيام",
    ctaSecondary: "شاهد عرض تقديمي",
    stats: [
      {
        number: formatArabicNumber(studentCount),
        label: "طالب متفوق",
        icon: Users,
        animated: true,
      },
      { number: "31", label: "عام خبرة", icon: Award },
      { number: "98%", label: "معدل النجاح", icon: TrendingUp },
      { number: "500+", label: "درس تفاعلي", icon: Video },
    ],
    trustBadges: [
      {
        icon: Shield,
        text: "منصة معتمدة",
        subtext: "من وزارة التربية والتعليم",
      },
      { icon: Star, text: "تقييم 4.9/5", subtext: "من 15,000+ طالب" },
      { icon: Award, text: "98% نجاح", subtext: "معدل نجاح الطلاب" },
    ],
    // Top 4 Most Important Features (Phase 1 Task 1.4)
    features: [
      "دروس تفاعلية بالذكاء الاصطناعي",
      "متابعة شخصية لكل طالب",
      "اختبارات ذكية متدرجة",
      "نتائج مضمونة 98%",
    ],
  };

  return (
    <section
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      dir="rtl"
      suppressHydrationWarning
    >
      {/* Enhanced Animated Gradient Background - optimized for mobile */}
      {/* Enhanced Animated Gradient Background */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-primary/5 dark:to-primary/10" />
        <div className="absolute top-0 right-0 p-32 md:p-40 bg-primary/20 rounded-full blur-[100px] opacity-20 -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 p-32 md:p-40 bg-violet-500/20 rounded-full blur-[100px] opacity-20 translate-y-1/2 -translate-x-1/2" />
      </div>

      <div className="relative z-10 container mx-auto px-6 py-24">
        <div className="max-w-5xl mx-auto">
          {/* Hero Content ... */}
          <div className="text-center mb-12">
            {/* Social Proof Badge */}
            <div className="inline-flex items-center gap-2 px-6 py-3 mb-6 glass rounded-full animate-fade-in-up">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success-500 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-success-500"></span>
              </span>
              <span className="text-sm md:text-base font-semibold text-foreground font-display">
                {content.badge}
              </span>
            </div>

            {/* Powerful Headline - Phase 1 Task 1.4 */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-black mb-6 text-foreground leading-[1.1] tracking-tight">
              <span className="block mb-2">احصل على</span>
              <span className="block text-premium-gradient pb-2">98%</span>
              <span className="block">في الثانوية العامة</span>
            </h1>

            {/* Sub-headline with Experience */}
            <p className="text-lg md:text-xl lg:text-2xl text-muted-foreground mb-4 max-w-3xl mx-auto leading-relaxed font-semibold">
              {content.subtitle}
            </p>

            {/* Social Proof Rating */}
            <p className="text-base md:text-lg text-primary font-medium mb-10">
              {content.socialProof}
            </p>

            {/* Large CTA Buttons - 80px height on mobile (Phase 1 Task 1.4) */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-stretch sm:items-center mb-16 max-w-2xl mx-auto">
              <Link href="/ar/signup" className="flex-1 sm:flex-initial">
                <Button
                  size="xl"
                  className="w-full sm:w-auto bg-premium-gradient hover:opacity-90 text-white px-8 sm:px-12 h-20 text-base sm:text-lg font-bold rounded-2xl shadow-2xl shadow-primary/30 btn-glow hover-lift transition-all duration-300"
                >
                  <Zap
                    className="w-5 h-5 sm:w-6 sm:h-6 ms-2"
                    aria-hidden="true"
                  />
                  {content.ctaPrimary}
                  <ArrowLeft
                    className="w-5 h-5 sm:w-6 sm:h-6 me-2"
                    aria-hidden="true"
                  />
                </Button>
              </Link>
              <Button
                size="xl"
                variant="outline"
                onClick={() => setShowVideo(true)}
                className="w-full sm:w-auto px-8 sm:px-10 h-16 sm:h-20 text-base sm:text-lg font-semibold rounded-2xl border-2 hover:bg-accent/50 glass hover-lift group transition-all duration-300"
              >
                <div className="w-8 h-8 bg-gradient-premium rounded-full flex items-center justify-center ms-3 group-hover:scale-110 transition-transform">
                  <Play
                    className="w-4 h-4 text-white ms-0.5"
                    aria-hidden="true"
                  />
                </div>
                {content.ctaSecondary}
              </Button>
            </div>

            {/* Video Preview Modal with Focus Trap */}
            {showVideo && (
              <div
                className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
                onClick={() => setShowVideo(false)}
                role="dialog"
                aria-modal="true"
                aria-labelledby="video-modal-title"
              >
                <div
                  ref={videoModalRef}
                  className="relative w-full max-w-4xl mx-4"
                  onClick={(e) => e.stopPropagation()}
                >
                  <button
                    onClick={() => setShowVideo(false)}
                    className="absolute -top-12 left-0 text-white hover:text-gray-300 text-lg font-bold focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black rounded px-2 py-1"
                    aria-label="إغلاق نافذة الفيديو"
                  >
                    ✕ إغلاق
                  </button>
                  <div className="relative pt-[56.25%] bg-black rounded-2xl overflow-hidden shadow-2xl">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center text-white">
                        <Video
                          className="w-20 h-20 mx-auto mb-4 opacity-50"
                          aria-hidden="true"
                        />
                        <p id="video-modal-title" className="text-xl">
                          سيتم إضافة الفيديو التعريفي قريباً
                        </p>
                        <p className="text-sm text-gray-400 mt-2">
                          جاري العمل على إنتاج محتوى عالي الجودة
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Enhanced Stats Section with Icons */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-20">
            {content.stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div key={index} className="text-center group">
                  <div className="glass p-6 rounded-3xl hover-lift card-interactive">
                    <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                      <Icon className="w-6 h-6 text-primary" />
                    </div>
                    <div
                      className={`text-3xl md:text-4xl font-bold text-foreground font-display mb-2 ${stat.animated ? "animate-pulse" : ""}`}
                    >
                      {stat.number}
                    </div>
                    <div className="text-sm md:text-base text-muted-foreground font-medium">
                      {stat.label}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Simplified Features Grid - Top 4 (Phase 1 Task 1.4) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-5xl mx-auto mb-16">
            {content.features.map((feature, index) => {
              const icons = [Target, Users, Award, TrendingUp];
              const colors = [
                "from-primary-500 to-primary-600",
                "from-success-500 to-success-600",
                "from-xp-500 to-xp-600",
                "from-brand-coral-500 to-brand-coral-600",
              ];
              const Icon = icons[index];
              return (
                <div key={index} className="group">
                  <div className="flex flex-col items-center text-center p-6 rounded-2xl glass border border-border/50 hover:shadow-xl hover:shadow-primary/10 transition-all duration-300 group-hover:scale-[1.05] h-full">
                    <div
                      className={`w-14 h-14 bg-gradient-to-br ${colors[index]} rounded-2xl flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300`}
                    >
                      <Icon className="w-7 h-7 text-white" />
                    </div>
                    <span className="text-foreground font-semibold text-base leading-snug">
                      {feature}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Modern Social Proof */}
          <div className="text-center">
            <div className="inline-flex items-center gap-4 px-8 py-4 bg-gradient-to-r from-muted/30 to-muted/50 border border-border/40 rounded-full backdrop-blur-sm">
              <div className="flex -space-x-2">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div
                    key={i}
                    className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full border-2 border-background flex items-center justify-center shadow-lg"
                  >
                    <Users className="w-5 h-5 text-white" />
                  </div>
                ))}
              </div>
              <span className="text-sm font-medium text-muted-foreground">
                انضم إلى آلاف الطلاب المتفوقين
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
