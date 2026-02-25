"use client";

import { HomepageSkeleton } from "@/components/loading/skeletons/HomepageSkeleton";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import type { Variants } from "framer-motion";
import {
  AnimatePresence,
  motion,
  useInView,
  useReducedMotion,
} from "framer-motion";
import {
  ArrowLeft,
  ArrowUp,
  Award,
  BarChart3,
  BookOpen,
  Brain,
  CheckCircle,
  ChevronDown,
  Crown,
  GraduationCap,
  Play,
  Rocket,
  Shield,
  Sparkles,
  Star,
  TrendingUp,
  Trophy,
  Users,
  Video,
  X,
  Zap,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

// Animation variants with reduced motion support
const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as const },
  },
};

const fadeInUpReduced: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.3 },
  },
};

const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.2 },
  },
};

// Animated counter component (self-contained to avoid hook issues)
function AnimatedCounter({
  target,
  duration = 2000,
  suffix = "",
}: {
  target: number;
  duration?: number;
  suffix?: string;
}) {
  const [count, setCount] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  useEffect(() => {
    if (isInView && !hasAnimated) {
      setHasAnimated(true);
      const steps = 60;
      const increment = target / steps;
      let current = 0;
      const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
          setCount(target);
          clearInterval(timer);
        } else {
          setCount(Math.floor(current));
        }
      }, duration / steps);
      return () => clearInterval(timer);
    }
  }, [isInView, target, duration, hasAnimated]);

  return (
    <div
      ref={ref}
      className="text-4xl md:text-5xl font-black text-foreground mb-2"
    >
      {count.toLocaleString()}
      {suffix}
    </div>
  );
}

// Floating orb component with reduced motion support
function FloatingOrb({
  className,
  delay = 0,
  reducedMotion = false,
}: {
  className?: string;
  delay?: number;
  reducedMotion?: boolean;
}) {
  if (reducedMotion) {
    return (
      <div
        className={`absolute rounded-full blur-3xl opacity-30 ${className}`}
      />
    );
  }

  return (
    <motion.div
      className={`absolute rounded-full blur-3xl opacity-30 ${className}`}
      animate={{
        y: [0, -30, 0],
        x: [0, 15, 0],
        scale: [1, 1.1, 1],
      }}
      transition={{
        duration: 8,
        delay,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    />
  );
}

// Live activity indicator component
function LiveActivityIndicator() {
  const [activity, setActivity] = useState({ count: 0, name: "" });

  const activities = useMemo(
    () => [
      { name: "أحمد من القاهرة", action: "انضم للمنصة" },
      { name: "فاطمة من الإسكندرية", action: "أكملت درساً" },
      { name: "محمد من الجيزة", action: "حقق شارة جديدة" },
      { name: "نور من المنصورة", action: "انضم للمنصة" },
      { name: "سارة من طنطا", action: "أكملت اختباراً" },
    ],
    [],
  );

  useEffect(() => {
    const interval = setInterval(() => {
      const randomActivity =
        activities[Math.floor(Math.random() * activities.length)];
      setActivity({
        count: Math.floor(Math.random() * 50) + 10,
        name: randomActivity.name,
      });
    }, 5000);

    return () => clearInterval(interval);
  }, [activities]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed bottom-24 left-6 z-40 hidden md:block"
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={activity.name}
          initial={{ opacity: 0, x: -20, scale: 0.9 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          exit={{ opacity: 0, x: 20, scale: 0.9 }}
          className="flex items-center gap-3 px-4 py-3 bg-card/95 backdrop-blur-md border border-border/50 rounded-2xl shadow-lg"
        >
          <div className="relative">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center text-white font-bold">
              {activity.name?.charAt(0) || "م"}
            </div>
            <span className="absolute -top-1 -right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500" />
            </span>
          </div>
          <div className="text-sm">
            <p className="font-semibold text-foreground">
              {activity.name || "طالب جديد"}
            </p>
            <p className="text-muted-foreground text-xs">انضم للمنصة الآن</p>
          </div>
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
}

// Sticky CTA Bar component
function StickyCTABar({ show }: { show: boolean }) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -100, opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-primary via-violet-600 to-primary py-3 px-4 shadow-lg"
        >
          <div className="container mx-auto flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 text-white">
              <Sparkles className="w-5 h-5 hidden sm:block" />
              <span className="font-bold text-sm sm:text-base">
                ابدأ رحلتك التعليمية مجاناً - انضم لـ 15,000+ طالب!
              </span>
            </div>
            <Link href="/ar/signup">
              <Button
                size="sm"
                className="bg-white text-primary hover:bg-white/90 font-bold px-6 shadow-md hover:shadow-lg transition-all"
              >
                سجّل الآن
                <ArrowLeft className="w-4 h-4 me-1 rtl:rotate-180" />
              </Button>
            </Link>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// Scroll to top button
function ScrollToTopButton({ show }: { show: boolean }) {
  const scrollToTop = useCallback(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  return (
    <AnimatePresence>
      {show && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={scrollToTop}
          className="fixed bottom-6 start-6 z-40 w-12 h-12 rounded-full bg-primary text-white shadow-lg hover:shadow-xl transition-shadow flex items-center justify-center"
          aria-label="العودة للأعلى"
        >
          <ArrowUp className="w-5 h-5" />
        </motion.button>
      )}
    </AnimatePresence>
  );
}

// Urgency banner component
function UrgencyBanner() {
  const [timeLeft, setTimeLeft] = useState({
    hours: 23,
    minutes: 59,
    seconds: 59,
  });
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0)
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        if (prev.hours > 0)
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return { hours: 23, minutes: 59, seconds: 59 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  if (dismissed) return null;

  return (
    <div className="bg-gradient-to-r from-primary via-violet-600 to-primary text-white py-2.5 px-4 relative">
      <div className="container mx-auto flex items-center justify-center gap-3 text-sm">
        <Sparkles className="w-4 h-4" />
        <span className="font-bold">
          سجّل الآن واحصل على جميع الدروس مجاناً — انضم لأكثر من 15,000 طالب!
        </span>
        <Link
          href="/ar/signup"
          className="inline-flex items-center gap-1 px-3 py-1 bg-white/20 hover:bg-white/30 rounded-full text-xs font-bold transition-colors"
        >
          ابدأ مجاناً
          <ArrowLeft className="w-3 h-3 rtl:-scale-x-100" />
        </Link>
        <button
          onClick={() => setDismissed(true)}
          className="absolute start-4 hover:bg-white/20 p-1 rounded transition-colors"
          aria-label="إغلاق"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

// Mobile floating CTA button
function MobileFloatingCTA({ show }: { show: boolean }) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="fixed bottom-0 left-0 right-0 z-50 p-4 bg-gradient-to-t from-background via-background to-transparent md:hidden"
        >
          <Link href="/ar/signup" className="block">
            <Button
              size="lg"
              className="w-full h-14 text-lg font-bold rounded-xl bg-gradient-to-r from-primary to-violet-600 text-white shadow-lg"
            >
              <Rocket className="w-5 h-5 ms-2" />
              ابدأ مجاناً الآن
              <ArrowLeft className="w-5 h-5 me-2" />
            </Button>
          </Link>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default function ArabicHomeClient() {
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);
  const [showStickyCTA, setShowStickyCTA] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const prefersReducedMotion = useReducedMotion();
  const heroRef = useRef<HTMLElement>(null);

  // Scroll tracking for sticky CTA and scroll-to-top
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const heroHeight = heroRef.current?.offsetHeight || 800;
      setShowStickyCTA(scrollY > heroHeight);
      setShowScrollTop(scrollY > 500);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) {
      router.replace("/ar/dashboard");
    } else {
      setIsChecking(false);
    }
  }, [router]);

  // Use reduced motion variants if user prefers
  const animationVariants = prefersReducedMotion ? fadeInUpReduced : fadeInUp;

  if (isChecking) {
    return <HomepageSkeleton />;
  }

  return (
    <div className="min-h-screen overflow-x-hidden bg-background" dir="rtl">
      {/* Urgency Banner */}
      <UrgencyBanner />

      {/* Sticky CTA Bar */}
      <StickyCTABar show={showStickyCTA} />

      {/* Live Activity Indicator */}
      <LiveActivityIndicator />

      {/* Scroll to Top Button */}
      <ScrollToTopButton show={showScrollTop} />

      {/* Mobile Floating CTA */}
      <MobileFloatingCTA show={showStickyCTA} />
      {/* ============================================
          HERO SECTION - Immersive & Dramatic
          ============================================ */}
      <section
        ref={heroRef}
        className="relative min-h-screen flex items-center justify-center overflow-hidden"
      >
        {/* Animated Background */}
        <div className="absolute inset-0 -z-10">
          {/* Base gradient */}
          <div className="absolute inset-0 bg-gradient-to-b from-background via-background to-primary/5" />

          {/* Animated mesh gradient */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/20 via-transparent to-transparent" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-violet-500/15 via-transparent to-transparent" />

          {/* Floating orbs with reduced motion support */}
          <FloatingOrb
            className="w-[500px] h-[500px] bg-primary/40 top-[-10%] right-[-10%]"
            delay={0}
            reducedMotion={!!prefersReducedMotion}
          />
          <FloatingOrb
            className="w-[400px] h-[400px] bg-violet-500/30 bottom-[-5%] left-[-5%]"
            delay={2}
            reducedMotion={!!prefersReducedMotion}
          />
          <FloatingOrb
            className="w-[300px] h-[300px] bg-cyan-500/25 top-[30%] left-[10%]"
            delay={4}
            reducedMotion={!!prefersReducedMotion}
          />

          {/* Grid pattern overlay */}
          <div
            className="absolute inset-0 opacity-[0.02]"
            style={{
              backgroundImage: `linear-gradient(hsl(var(--foreground)) 1px, transparent 1px),
                               linear-gradient(90deg, hsl(var(--foreground)) 1px, transparent 1px)`,
              backgroundSize: "60px 60px",
            }}
          />
        </div>

        <div className="relative z-10 container mx-auto px-6 py-20 md:py-32">
          <div className="max-w-6xl mx-auto">
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="flex justify-center mb-8"
            >
              <div className="inline-flex items-center gap-3 px-5 py-2.5 bg-gradient-to-r from-primary/10 to-violet-500/10 border border-primary/20 rounded-full backdrop-blur-sm">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-500 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500" />
                </span>
                <span className="text-sm font-semibold bg-gradient-to-r from-primary to-violet-500 bg-clip-text text-transparent">
                  +15,000 طالب منضم هذا الشهر
                </span>
                <Sparkles className="w-4 h-4 text-primary" />
              </div>
            </motion.div>

            {/* Main Headline */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-center mb-8"
            >
              <h1 className="text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-black leading-[1.1] tracking-tight mb-6">
                <span className="block text-foreground">تفوّق في</span>
                <span className="block relative">
                  <span className="gradient-text font-black text-primary">
                    الثانوية العامة
                  </span>
                  {/* Underline decoration */}
                  <svg
                    className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-[80%] h-3"
                    viewBox="0 0 200 12"
                    fill="none"
                  >
                    <motion.path
                      d="M2 10C50 2 150 2 198 10"
                      stroke="url(#gradient)"
                      strokeWidth="4"
                      strokeLinecap="round"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 1, delay: 0.8 }}
                    />
                    <defs>
                      <linearGradient
                        id="gradient"
                        x1="0%"
                        y1="0%"
                        x2="100%"
                        y2="0%"
                      >
                        <stop offset="0%" stopColor="hsl(var(--primary))" />
                        <stop offset="100%" stopColor="#8b5cf6" />
                      </linearGradient>
                    </defs>
                  </svg>
                </span>
              </h1>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="text-xl md:text-2xl lg:text-3xl text-muted-foreground max-w-3xl mx-auto font-medium"
              >
                مع{" "}
                <span className="text-foreground font-bold">
                  الأستاذ رضا الفاروق
                </span>
                <br className="hidden md:block" />
                <span className="text-lg md:text-xl">
                  31 عاماً من التميز في تدريس اللغة العربية
                </span>
              </motion.p>
            </motion.div>

            {/* Stats Row */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="flex flex-wrap justify-center gap-6 md:gap-10 mb-12"
            >
              {[
                { icon: Users, value: "15,247+", label: "طالب متفوق" },
                { icon: TrendingUp, value: "98%", label: "معدل النجاح" },
                { icon: Video, value: "500+", label: "درس تفاعلي" },
              ].map((stat, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 px-4 py-2 rounded-xl bg-card/50 backdrop-blur-sm border border-border/50"
                >
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <stat.icon className="w-5 h-5 text-primary" />
                  </div>
                  <div className="text-start">
                    <div className="text-lg font-bold text-foreground">
                      {stat.value}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {stat.label}
                    </div>
                  </div>
                </div>
              ))}
            </motion.div>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16"
            >
              <Link href="/ar/signup">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                  className="relative"
                >
                  {/* Animated ring */}
                  <motion.div
                    className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-primary via-violet-500 to-primary opacity-75 blur-sm"
                    animate={{
                      backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                    }}
                    transition={{ duration: 3, repeat: Infinity }}
                    style={{ backgroundSize: "200% 200%" }}
                  />
                  <Button
                    size="lg"
                    className="relative group h-16 px-10 text-lg font-bold rounded-2xl bg-gradient-to-r from-primary to-violet-600 hover:from-primary/90 hover:to-violet-600/90 text-white shadow-2xl shadow-primary/25 transition-all duration-300"
                  >
                    <Rocket className="w-5 h-5 ms-2 group-hover:rotate-12 transition-transform" />
                    ابدأ رحلتك مجاناً
                    <ArrowLeft className="w-5 h-5 me-2 group-hover:-translate-x-1 transition-transform rtl:group-hover:translate-x-1" />
                  </Button>
                </motion.div>
              </Link>

              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button
                  variant="outline"
                  size="lg"
                  className="h-16 px-8 text-lg font-semibold rounded-2xl border-2 hover:bg-accent/50 backdrop-blur-sm group transition-all duration-300"
                >
                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-primary to-violet-600 flex items-center justify-center ms-3 group-hover:scale-110 transition-transform">
                    <Play className="w-4 h-4 text-white ms-0.5" />
                  </div>
                  شاهد العرض التقديمي
                </Button>
              </motion.div>
            </motion.div>

            {/* Social Proof */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              className="flex flex-col items-center gap-4"
            >
              <div className="flex items-center gap-2">
                {[...Array(5)].map((_, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.9 + i * 0.1 }}
                  >
                    <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  </motion.div>
                ))}
                <span className="text-lg font-bold text-foreground ms-2">
                  4.9/5
                </span>
              </div>
              <p className="text-sm text-muted-foreground">
                من 3,241+ تقييم من طلابنا المتفوقين
              </p>

              {/* Avatar stack with hover effects */}
              <div className="flex items-center gap-3 mt-2">
                <div className="flex -space-x-3 rtl:space-x-reverse">
                  {[
                    "from-blue-500 to-cyan-500",
                    "from-purple-500 to-pink-500",
                    "from-green-500 to-emerald-500",
                    "from-orange-500 to-red-500",
                    "from-indigo-500 to-violet-500",
                  ].map((gradient, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 1 + i * 0.1 }}
                      whileHover={{ scale: 1.2, zIndex: 10 }}
                      className={`w-10 h-10 rounded-full bg-gradient-to-br ${gradient} border-2 border-background flex items-center justify-center text-white text-sm font-bold shadow-lg cursor-pointer`}
                    >
                      {["أ", "ف", "ن", "م", "س"][i]}
                    </motion.div>
                  ))}
                </div>
                <span className="text-sm text-muted-foreground">
                  انضم إلى +15,000 طالب
                </span>
              </div>

              {/* Trust badges */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.2 }}
                className="flex flex-wrap justify-center gap-4 mt-6 px-4"
              >
                {[
                  { icon: Shield, text: "آمن 100%" },
                  { icon: Award, text: "معتمد رسمياً" },
                  { icon: Users, text: "مجتمع نشط" },
                ].map((badge, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-2 px-4 py-2 rounded-full bg-card/50 backdrop-blur-sm border border-border/50 text-sm"
                  >
                    <badge.icon className="w-4 h-4 text-primary" />
                    <span className="text-muted-foreground font-medium">
                      {badge.text}
                    </span>
                  </div>
                ))}
              </motion.div>
            </motion.div>

            {/* Scroll indicator */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2 }}
              className="absolute bottom-8 left-1/2 -translate-x-1/2"
            >
              <motion.div
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="flex flex-col items-center gap-2 text-muted-foreground"
              >
                <span className="text-sm">اكتشف المزيد</span>
                <ChevronDown className="w-5 h-5" />
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ============================================
          STATS SECTION - Animated Counters
          ============================================ */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent" />

        <div className="container mx-auto px-6 relative">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8"
          >
            {[
              {
                target: 15247,
                suffix: "+",
                label: "طالب متفوق",
                icon: Users,
                color: "from-blue-500 to-cyan-500",
              },
              {
                target: 98,
                suffix: "%",
                label: "معدل النجاح",
                icon: TrendingUp,
                color: "from-green-500 to-emerald-500",
              },
              {
                target: 500,
                suffix: "+",
                label: "درس تفاعلي",
                icon: Video,
                color: "from-purple-500 to-pink-500",
              },
              {
                target: 31,
                suffix: "",
                label: "عام خبرة",
                icon: Award,
                color: "from-orange-500 to-red-500",
              },
            ].map((stat, i) => (
              <motion.div
                key={i}
                variants={animationVariants}
                className="relative group"
                whileHover={{ y: -4 }}
              >
                <div className="relative p-6 md:p-8 rounded-3xl bg-card border border-border/50 hover:border-primary/30 transition-all duration-300 hover:shadow-xl hover:shadow-primary/5 overflow-hidden">
                  {/* Shine effect on hover */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                  </div>

                  <motion.div
                    className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${stat.color} flex items-center justify-center mb-4 shadow-lg`}
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <stat.icon className="w-7 h-7 text-white" />
                  </motion.div>
                  <AnimatedCounter target={stat.target} suffix={stat.suffix} />
                  <div className="text-muted-foreground font-medium">
                    {stat.label}
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ============================================
          HOW IT WORKS - Modern Step Process
          ============================================ */}
      <section className="py-24 relative">
        <div className="container mx-auto px-6">
          <motion.div
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="inline-block px-4 py-2 rounded-full bg-primary/10 text-primary font-semibold text-sm mb-4">
              كيف تبدأ؟
            </span>
            <h2 className="text-4xl md:text-5xl font-black text-foreground mb-4">
              ثلاث خطوات نحو <span className="text-primary">التفوق</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              رحلة بسيطة وممتعة نحو تحقيق أهدافك الدراسية
            </p>
          </motion.div>

          <div className="max-w-5xl mx-auto relative">
            {/* Connection line */}
            <div className="hidden md:block absolute top-24 left-[15%] right-[15%] h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-green-500 rounded-full" />

            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="grid grid-cols-1 md:grid-cols-3 gap-8"
            >
              {[
                {
                  step: 1,
                  title: "سجّل مجاناً",
                  description: "أنشئ حسابك في ثوانٍ واختر صفك الدراسي",
                  icon: GraduationCap,
                  color: "from-blue-500 to-cyan-500",
                },
                {
                  step: 2,
                  title: "تعلّم بذكاء",
                  description: "شاهد الدروس التفاعلية وحل الاختبارات الذكية",
                  icon: Brain,
                  color: "from-purple-500 to-pink-500",
                },
                {
                  step: 3,
                  title: "حقق النجاح",
                  description: "تابع تقدمك واحصل على شهادات الإنجاز",
                  icon: Trophy,
                  color: "from-green-500 to-emerald-500",
                },
              ].map((item, i) => (
                <motion.div
                  key={i}
                  variants={fadeInUp}
                  className="relative group"
                >
                  <div className="text-center">
                    {/* Step number */}
                    <div className="relative inline-block mb-6">
                      <div
                        className={`w-24 h-24 rounded-3xl bg-gradient-to-br ${item.color} flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform duration-300`}
                      >
                        <item.icon className="w-12 h-12 text-white" />
                      </div>
                      <div className="absolute -top-2 -end-2 w-8 h-8 rounded-full bg-card border-2 border-primary flex items-center justify-center text-primary font-bold shadow-lg">
                        {item.step}
                      </div>
                    </div>

                    <h3 className="text-2xl font-bold text-foreground mb-3">
                      {item.title}
                    </h3>
                    <p className="text-muted-foreground text-lg">
                      {item.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* ============================================
          GRADE SELECTION - Bento Style Cards
          ============================================ */}
      <section className="py-24 bg-muted/30 relative overflow-hidden">
        <FloatingOrb
          className="w-[400px] h-[400px] bg-primary/20 top-[-10%] left-[-5%]"
          delay={1}
          reducedMotion={!!prefersReducedMotion}
        />

        <div className="container mx-auto px-6 relative">
          <motion.div
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="inline-block px-4 py-2 rounded-full bg-primary/10 text-primary font-semibold text-sm mb-4">
              اختر صفك
            </span>
            <h2 className="text-4xl md:text-5xl font-black text-foreground mb-4">
              منهج مخصص <span className="text-primary">لكل صف</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              محتوى تعليمي شامل ومتكامل مصمم خصيصاً لكل مرحلة
            </p>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto"
          >
            {[
              {
                grade: "الأول الثانوي",
                gradeId: "1",
                students: "5,200+",
                lessons: "120",
                progress: 85,
                color: "from-blue-500 to-cyan-500",
                icon: "١",
              },
              {
                grade: "الثاني الثانوي",
                gradeId: "2",
                students: "4,800+",
                lessons: "150",
                progress: 92,
                color: "from-purple-500 to-pink-500",
                icon: "٢",
                featured: true,
              },
              {
                grade: "الثالث الثانوي",
                gradeId: "3",
                students: "5,000+",
                lessons: "180",
                progress: 96,
                color: "from-green-500 to-emerald-500",
                icon: "٣",
              },
            ].map((item, i) => (
              <motion.div
                key={i}
                variants={fadeInUp}
                className={`relative group ${item.featured ? "md:-mt-4 md:mb-4" : ""}`}
              >
                {item.featured && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-primary to-violet-600 rounded-full text-white text-sm font-bold shadow-lg z-10">
                    <Crown className="w-4 h-4 inline ms-1" />
                    الأكثر طلباً
                  </div>
                )}

                <Card
                  className={`h-full border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 overflow-hidden ${item.featured ? "ring-2 ring-primary" : ""}`}
                >
                  {/* Gradient header */}
                  <div
                    className={`h-24 bg-gradient-to-br ${item.color} relative`}
                  >
                    <div className="absolute inset-0 bg-black/10" />
                    <div className="absolute bottom-0 inset-x-0 h-12 bg-gradient-to-t from-card to-transparent" />
                    <div className="absolute top-4 end-4 w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-white text-2xl font-black">
                      {item.icon}
                    </div>
                  </div>

                  <CardContent className="p-6 pt-4">
                    <h3 className="text-2xl font-bold text-foreground mb-4">
                      {item.grade}
                    </h3>

                    <div className="space-y-4 mb-6">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground flex items-center gap-2">
                          <Users className="w-4 h-4" />
                          {item.students} طالب
                        </span>
                        <span className="text-muted-foreground flex items-center gap-2">
                          <Video className="w-4 h-4" />
                          {item.lessons} درس
                        </span>
                      </div>

                      <div>
                        <div className="flex justify-between text-sm mb-2">
                          <span className="text-muted-foreground">
                            معدل النجاح
                          </span>
                          <span className="font-bold text-green-600 dark:text-green-400">
                            {item.progress}%
                          </span>
                        </div>
                        <Progress value={item.progress} className="h-2" />
                      </div>
                    </div>

                    <Link href={`/ar/signup?grade=${item.gradeId}`}>
                      <Button
                        className={`w-full h-12 text-lg font-bold rounded-xl bg-gradient-to-r ${item.color} hover:opacity-90 text-white shadow-lg group-hover:shadow-xl transition-all`}
                      >
                        ابدأ الآن
                        <ArrowLeft className="w-5 h-5 me-2 group-hover:-translate-x-1 rtl:group-hover:translate-x-1 transition-transform" />
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ============================================
          FEATURES - Bento Grid Layout
          ============================================ */}
      <section className="py-24 relative">
        <div className="container mx-auto px-6">
          <motion.div
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="inline-block px-4 py-2 rounded-full bg-primary/10 text-primary font-semibold text-sm mb-4">
              المميزات
            </span>
            <h2 className="text-4xl md:text-5xl font-black text-foreground mb-4">
              لماذا تختار <span className="text-primary">منصتنا؟</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              تجربة تعليمية متكاملة مع أحدث التقنيات
            </p>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto"
          >
            {[
              {
                icon: Video,
                title: "دروس فيديو 4K",
                description: "محتوى عالي الجودة مع إمكانية التحميل",
                color: "from-blue-500 to-cyan-500",
              },
              {
                icon: Brain,
                title: "اختبارات ذكية",
                description: "تحليل فوري للأداء مع توصيات شخصية",
                color: "from-purple-500 to-pink-500",
              },
              {
                icon: BarChart3,
                title: "تتبع التقدم",
                description: "لوحة تحكم شاملة مع إحصائيات مفصلة",
                color: "from-green-500 to-emerald-500",
              },
              {
                icon: Trophy,
                title: "نظام المكافآت",
                description: "نقاط وشارات وتحديات يومية محفزة",
                color: "from-orange-500 to-red-500",
              },
            ].map((feature, i) => (
              <motion.div
                key={i}
                variants={animationVariants}
                className="group"
                whileHover={{ y: -8, transition: { duration: 0.2 } }}
              >
                <div className="relative h-full p-6 rounded-3xl bg-card border border-border/50 hover:border-primary/30 transition-all duration-300 hover:shadow-xl hover:shadow-primary/5 overflow-hidden">
                  {/* Gradient border on hover */}
                  <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-primary/20 to-violet-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10 blur-xl" />

                  <motion.div
                    className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4 shadow-lg`}
                    whileHover={{ scale: 1.1, rotate: -5 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <feature.icon className="w-7 h-7 text-white" />
                  </motion.div>
                  <h3 className="text-xl font-bold text-foreground mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground">{feature.description}</p>

                  {/* Learn more link */}
                  <div className="mt-4 flex items-center text-primary font-medium text-sm opacity-0 group-hover:opacity-100 transition-opacity">
                    <span>اكتشف المزيد</span>
                    <ArrowLeft className="w-4 h-4 me-1 rtl:rotate-180" />
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ============================================
          TESTIMONIALS - Modern Cards
          ============================================ */}
      <section className="py-24 bg-muted/30 relative overflow-hidden">
        <FloatingOrb
          className="w-[300px] h-[300px] bg-violet-500/20 bottom-[10%] right-[-5%]"
          delay={3}
          reducedMotion={!!prefersReducedMotion}
        />

        <div className="container mx-auto px-6 relative">
          <motion.div
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="inline-block px-4 py-2 rounded-full bg-primary/10 text-primary font-semibold text-sm mb-4">
              قصص نجاح
            </span>
            <h2 className="text-4xl md:text-5xl font-black text-foreground mb-4">
              ماذا يقول <span className="text-primary">طلابنا؟</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              آلاف الطلاب حققوا أحلامهم مع منصتنا
            </p>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto"
          >
            {[
              {
                name: "أحمد محمد علي",
                grade: "الثالث الثانوي",
                improvement: "+35%",
                score: "95%",
                testimonial:
                  "بفضل الأستاذ رضا الفاروق ومنصته الرائعة، تحسنت درجاتي في اللغة العربية من 60% إلى 95%.",
                color: "from-blue-500 to-purple-500",
              },
              {
                name: "فاطمة أحمد حسن",
                grade: "الثاني الثانوي",
                improvement: "+42%",
                score: "92%",
                testimonial:
                  "المنصة ساعدتني كثيراً في فهم البلاغة والأدب. الدروس التفاعلية جعلت التعلم ممتعاً.",
                color: "from-pink-500 to-rose-500",
              },
              {
                name: "نور الهدى محمود",
                grade: "الثالث الثانوي",
                improvement: "+38%",
                score: "97%",
                testimonial:
                  "الشرح المبسط والأمثلة الواضحة ساعدوني في التفوق. أنصح كل طالب بهذه المنصة.",
                color: "from-green-500 to-teal-500",
              },
            ].map((testimonial, i) => (
              <motion.div
                key={i}
                variants={animationVariants}
                className="group"
                whileHover={{ y: -4, transition: { duration: 0.2 } }}
              >
                <Card className="h-full border-0 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden">
                  <CardContent className="p-6 relative">
                    {/* Quote mark decoration */}
                    <div className="absolute top-4 start-4 text-6xl text-primary/10 font-serif leading-none">
                      &ldquo;
                    </div>

                    {/* Header */}
                    <div className="flex items-start gap-4 mb-4 relative z-10">
                      <motion.div
                        className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${testimonial.color} flex items-center justify-center text-white text-xl font-bold shadow-lg`}
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        transition={{ type: "spring", stiffness: 300 }}
                      >
                        {testimonial.name.charAt(0)}
                      </motion.div>
                      <div>
                        <h4 className="font-bold text-foreground">
                          {testimonial.name}
                        </h4>
                        <p className="text-sm text-muted-foreground">
                          {testimonial.grade}
                        </p>
                      </div>
                    </div>

                    {/* Stats with animation */}
                    <div className="flex gap-2 mb-4">
                      <motion.span
                        className="px-3 py-1 rounded-full bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 text-sm font-bold"
                        whileHover={{ scale: 1.05 }}
                      >
                        {testimonial.improvement} تحسن
                      </motion.span>
                      <motion.span
                        className="px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-sm font-bold"
                        whileHover={{ scale: 1.05 }}
                      >
                        {testimonial.score} النتيجة
                      </motion.span>
                    </div>

                    {/* Quote */}
                    <blockquote className="text-muted-foreground italic leading-relaxed relative z-10">
                      &ldquo;{testimonial.testimonial}&rdquo;
                    </blockquote>

                    {/* Stars with stagger animation */}
                    <div className="flex items-center gap-1 mt-4">
                      {[...Array(5)].map((_, starIndex) => (
                        <motion.div
                          key={starIndex}
                          initial={{ opacity: 0, scale: 0 }}
                          whileInView={{ opacity: 1, scale: 1 }}
                          viewport={{ once: true }}
                          transition={{ delay: 0.1 * starIndex }}
                        >
                          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        </motion.div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ============================================
          COMPARISON SECTION
          ============================================ */}
      <section className="py-24 relative">
        <div className="container mx-auto px-6">
          <motion.div
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="inline-block px-4 py-2 rounded-full bg-primary/10 text-primary font-semibold text-sm mb-4">
              المقارنة
            </span>
            <h2 className="text-4xl md:text-5xl font-black text-foreground mb-4">
              الفرق <span className="text-primary">واضح</span>
            </h2>
          </motion.div>

          <motion.div
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="max-w-4xl mx-auto"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-0 rounded-3xl overflow-hidden shadow-2xl">
              {/* Traditional */}
              <div className="p-8 bg-gradient-to-br from-red-50 to-orange-50 dark:from-red-950/30 dark:to-orange-950/30">
                <div className="text-center mb-8">
                  <div className="w-16 h-16 rounded-2xl bg-red-500 flex items-center justify-center mx-auto mb-4 shadow-lg">
                    <BookOpen className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-foreground">
                    الدروس الخصوصية
                  </h3>
                  <p className="text-red-600 dark:text-red-400 font-bold text-xl mt-2">
                    ٣,٠٠٠ - ٥,٠٠٠ جنيه/شهر
                  </p>
                </div>
                <div className="space-y-4">
                  {[
                    "تكلفة ٢٠٠-٥٠٠ جنيه للحصة",
                    "مواعيد ثابتة غير مرنة",
                    "لا يوجد تتبع للتقدم",
                    "صعوبة في المراجعة",
                    "جودة متفاوتة",
                  ].map((item, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-red-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-red-500 text-sm">✗</span>
                      </div>
                      <span className="text-muted-foreground">{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Platform */}
              <div className="p-8 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30 relative">
                <div className="absolute top-4 start-4 px-3 py-1 bg-green-500 rounded-full text-white text-sm font-bold">
                  الأفضل
                </div>
                <div className="text-center mb-8">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center mx-auto mb-4 shadow-lg">
                    <Rocket className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-foreground">
                    منصة الأستاذ رضا
                  </h3>
                  <p className="text-green-600 dark:text-green-400 font-bold text-xl mt-2">
                    مجاناً ١٠٠٪
                  </p>
                </div>
                <div className="space-y-4">
                  {[
                    "وفر أكثر من ٣٠,٠٠٠ جنيه سنوياً",
                    "تعلم ٢٤/٧ من أي مكان",
                    "تحليلات وتقارير تفصيلية",
                    "إعادة الدروس بلا حدود",
                    "محتوى موحد عالي الجودة",
                  ].map((item, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <CheckCircle className="w-4 h-4 text-white" />
                      </div>
                      <span className="text-foreground font-medium">
                        {item}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ============================================
          FAQ SECTION
          ============================================ */}
      <section className="py-24 bg-muted/30 relative">
        <div className="container mx-auto px-6">
          <motion.div
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="inline-block px-4 py-2 rounded-full bg-primary/10 text-primary font-semibold text-sm mb-4">
              الأسئلة الشائعة
            </span>
            <h2 className="text-4xl md:text-5xl font-black text-foreground mb-4">
              هل لديك <span className="text-primary">سؤال؟</span>
            </h2>
          </motion.div>

          <motion.div
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="max-w-3xl mx-auto"
          >
            <Accordion type="single" collapsible className="space-y-4">
              {[
                {
                  question: "هل المنصة مجانية حقاً؟",
                  answer:
                    "نعم، جميع المحتوى التعليمي مجاني بالكامل. هدفنا هو إتاحة التعليم الجيد لجميع الطلاب المصريين.",
                  icon: Zap,
                },
                {
                  question: "هل يمكنني الوصول للدروس دون اتصال بالإنترنت؟",
                  answer:
                    "نعم، يمكنك تحميل الدروس ومشاهدتها دون اتصال. التطبيق يدعم التعلم الغير متصل بالكامل.",
                  icon: Video,
                },
                {
                  question: "كيف يمكنني تتبع تقدم ابني/ابنتي؟",
                  answer:
                    "يوفر التطبيق تقارير مفصلة للأهل تتضمن الوقت المستغرق، الدروس المكتملة، ونتائج الاختبارات.",
                  icon: BarChart3,
                },
                {
                  question: "ماذا لو واجهت مشكلة تقنية؟",
                  answer:
                    "فريق الدعم الفني متاح 24/7 عبر الواتساب والبريد الإلكتروني لحل أي مشكلة فوراً.",
                  icon: Shield,
                },
              ].map((faq, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <AccordionItem
                    value={`faq-${index}`}
                    className="bg-card rounded-2xl border-0 shadow-sm px-6 data-[state=open]:shadow-lg data-[state=open]:ring-1 data-[state=open]:ring-primary/20 transition-all duration-300 overflow-hidden"
                  >
                    <AccordionTrigger className="text-right font-bold text-foreground hover:no-underline py-6 text-lg group">
                      <div className="flex items-center gap-3 w-full">
                        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center group-data-[state=open]:bg-primary group-data-[state=open]:text-white transition-colors">
                          <faq.icon className="w-5 h-5" />
                        </div>
                        <span className="flex-1 text-start">
                          {faq.question}
                        </span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground pb-6 leading-relaxed text-base pr-14">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                </motion.div>
              ))}
            </Accordion>
          </motion.div>
        </div>
      </section>

      {/* ============================================
          FINAL CTA - Dramatic
          ============================================ */}
      <section className="py-32 relative overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-violet-600 to-primary">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0djItSDI0di0yaDEyem0wLTRWMjhIMjR2MmgxMnptLTItMjJoMnYxMmgtMlY4em0tOCAwaDJ2MTJoLTJWOHoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-30" />
        </div>

        <FloatingOrb
          className="w-[500px] h-[500px] bg-white/10 top-[-20%] right-[-10%]"
          delay={0}
          reducedMotion={!!prefersReducedMotion}
        />
        <FloatingOrb
          className="w-[400px] h-[400px] bg-white/10 bottom-[-10%] left-[-10%]"
          delay={2}
          reducedMotion={!!prefersReducedMotion}
        />

        <div className="container mx-auto px-6 relative">
          <motion.div
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              transition={{ type: "spring", stiffness: 200, damping: 15 }}
              className="w-20 h-20 rounded-3xl bg-white/20 backdrop-blur-sm flex items-center justify-center mx-auto mb-8"
            >
              <Rocket className="w-10 h-10 text-white" />
            </motion.div>

            <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-white mb-6">
              ابدأ رحلة التفوق <span className="text-yellow-300">اليوم</span>
            </h2>
            <p className="text-xl md:text-2xl text-white/80 max-w-2xl mx-auto mb-10">
              انضم إلى آلاف الطلاب الذين حققوا أحلامهم مع منصتنا
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/ar/signup">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                  className="relative"
                >
                  {/* Pulsing glow effect */}
                  <motion.div
                    className="absolute -inset-1 rounded-2xl bg-white/50 blur-md"
                    animate={{ opacity: [0.5, 0.8, 0.5] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                  <Button
                    size="lg"
                    className="relative group h-16 px-12 text-xl font-bold rounded-2xl bg-white text-primary hover:bg-white/90 shadow-2xl transition-all duration-300"
                  >
                    <Zap className="w-6 h-6 ms-2 group-hover:rotate-12 transition-transform" />
                    سجّل مجاناً الآن
                    <ArrowLeft className="w-6 h-6 me-2 group-hover:-translate-x-1 rtl:group-hover:translate-x-1 transition-transform" />
                  </Button>
                </motion.div>
              </Link>
              <Link href="/ar/courses">
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button
                    variant="outline"
                    size="lg"
                    className="h-16 px-10 text-xl font-semibold rounded-2xl border-2 border-white/30 text-white hover:bg-white/10 backdrop-blur-sm transition-all duration-300"
                  >
                    <Play className="w-6 h-6 ms-2" />
                    تصفح الدروس
                  </Button>
                </motion.div>
              </Link>
            </div>

            {/* Trust badges */}
            <div className="flex flex-wrap justify-center gap-6 mt-12">
              {[
                { icon: Shield, text: "منصة معتمدة" },
                { icon: Star, text: "تقييم 4.9/5" },
                { icon: Award, text: "98% معدل نجاح" },
              ].map((badge, i) => (
                <div key={i} className="flex items-center gap-2 text-white/80">
                  <badge.icon className="w-5 h-5" />
                  <span className="font-medium">{badge.text}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
