"use client";

import { DashboardErrorBoundary } from "@/components/error-boundary/section-error-boundary";
import { PullToRefresh } from "@/components/mobile/pull-to-refresh";
import { DashboardSkeleton } from "@/components/loading/DashboardSkeleton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useGamification } from "@/contexts/GamificationContext";
import {
  ArrowLeft,
  Brain,
  CheckCircle,
  ClipboardList,
  Flame,
  GraduationCap,
  HelpCircle,
  Medal,
  Play,
  ShoppingBag,
  Sparkles,
  Star,
  Target,
  Timer,
  Trophy,
  Video,
  Zap,
} from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";

// Animated counter hook
function useCountUp(end: number, duration: number = 1500, start: number = 0) {
  const [count, setCount] = useState(start);
  const startTimeRef = useRef<number | null>(null);

  useEffect(() => {
    startTimeRef.current = null;
    const animate = (timestamp: number) => {
      if (!startTimeRef.current) startTimeRef.current = timestamp;
      const progress = Math.min(
        (timestamp - startTimeRef.current) / duration,
        1,
      );
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(start + (end - start) * eased));
      if (progress < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, [end, duration, start]);

  return count;
}

// Quick Access Items - ALL important pages
const quickAccessItems = [
  {
    href: "/ar/lectures",
    icon: Video,
    label: "المحاضرات",
    color: "from-purple-500 to-violet-600",
  },
  {
    href: "/ar/courses",
    icon: GraduationCap,
    label: "الدورات",
    color: "from-blue-500 to-cyan-500",
  },
  {
    href: "/ar/challenges",
    icon: Brain,
    label: "التحديات",
    color: "from-amber-500 to-orange-500",
  },
  {
    href: "/ar/homework",
    icon: ClipboardList,
    label: "الواجبات",
    color: "from-rose-500 to-pink-500",
  },
  {
    href: "/ar/achievements",
    icon: Trophy,
    label: "الإنجازات",
    color: "from-yellow-500 to-amber-500",
  },
  {
    href: "/ar/leaderboard",
    icon: Medal,
    label: "المتصدرون",
    color: "from-emerald-500 to-teal-500",
  },
  {
    href: "/ar/store",
    icon: ShoppingBag,
    label: "المتجر",
    color: "from-indigo-500 to-purple-500",
  },
  {
    href: "/ar/corners/questions",
    icon: HelpCircle,
    label: "أسئلة وأجوبة",
    color: "from-sky-500 to-blue-500",
  },
  {
    href: "/ar/corners/mistakes",
    icon: Target,
    label: "مراجعة الأخطاء",
    color: "from-red-500 to-rose-500",
  },
  {
    href: "/ar/corners/tasks",
    icon: Timer,
    label: "إدارة المهام",
    color: "from-violet-500 to-purple-500",
  },
];

// Mock data
const currentLesson = {
  id: "lesson-15",
  title: "أسلوب الاستثناء",
  subject: "النحو",
  progress: 65,
  duration: "25 دقيقة",
};

const dailyQuests = [
  { id: 1, title: "أكمل درسًا واحدًا", xp: 50, completed: true },
  { id: 2, title: "أجب على 10 أسئلة", xp: 30, completed: true },
  { id: 3, title: "حافظ على سلسلتك", xp: 25, completed: true },
  { id: 4, title: "احصل على 80% في اختبار", xp: 75, completed: false },
];

function DashboardContent() {
  const [mounted, setMounted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const { userStats, refreshStats } = useGamification();

  useEffect(() => {
    setMounted(true);
    setIsMobile(window.innerWidth < 768);
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleRefresh = useCallback(async () => {
    await refreshStats?.();
  }, [refreshStats]);

  // Stats
  const currentLevel = userStats?.level || 1;
  const totalXP = userStats?.totalXP || 0;
  const currentStreak = userStats?.currentStreak || 0;
  const xpToNextLevel = 1000 - (totalXP % 1000);
  const levelProgress = ((totalXP % 1000) / 1000) * 100;

  // Quests
  const completedQuests = dailyQuests.filter((q) => q.completed).length;

  // Animated counters
  const animatedXP = useCountUp(mounted ? totalXP : 0, 1200);
  const animatedStreak = useCountUp(mounted ? currentStreak : 0, 800);
  const animatedLevel = useCountUp(mounted ? currentLevel : 0, 600);

  // Loading state
  if (!mounted) {
    return <DashboardSkeleton />;
  }

  const content = (
    <div
     
      className="min-h-screen bg-background pb-24 relative overflow-hidden"
    >
      {/* Background Decorative Elements */}
      <div className="absolute top-0 start-0 w-full h-96 bg-gradient-primary opacity-5 rounded-b-[3rem] -z-10" />
      <div className="absolute top-20 end-0 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl -z-10 animate-pulse-gentle" />
      <div className="absolute top-40 start-10 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl -z-10 animate-float" />

      <div className="container mx-auto px-4 py-8 max-w-5xl space-y-8 animate-fade-in">
        {/* Header - Welcome */}
        <header className="text-center py-4">
          <p className="text-muted-foreground mb-1 text-lg">مرحباً بعودتك 👋</p>
          <h1 className="text-3xl font-bold bg-gradient-primary text-transparent bg-clip-text inline-block">
            أحمد محمد
          </h1>
        </header>

        {/* Stats Row */}
        <div className="grid grid-cols-3 gap-4">
          <Card className="border-0 bg-gradient-primary text-white shadow-glow hover:scale-[1.02] transition-transform duration-300">
            <CardContent className="p-5 text-center">
              <Star className="w-8 h-8 mx-auto mb-3 text-yellow-300 fill-yellow-300 animate-pulse-glow" />
              <p className="text-3xl font-bold mb-1">{animatedLevel}</p>
              <p className="text-xs text-white/80 font-medium">المستوى</p>
            </CardContent>
          </Card>
          <Card className="border-0 bg-gradient-success text-white shadow-colored hover:scale-[1.02] transition-transform duration-300">
            <CardContent className="p-5 text-center">
              <Zap className="w-8 h-8 mx-auto mb-3 text-yellow-300 fill-yellow-300 animate-pulse-glow" />
              <p className="text-3xl font-bold mb-1">
                {animatedXP.toLocaleString()}
              </p>
              <p className="text-xs text-white/80 font-medium">XP</p>
            </CardContent>
          </Card>
          <Card className="border-0 bg-gradient-accent text-white shadow-colored hover:scale-[1.02] transition-transform duration-300">
            <CardContent className="p-5 text-center">
              <Flame className="w-8 h-8 mx-auto mb-3 text-yellow-300 fill-yellow-300 animate-pulse-glow" />
              <p className="text-3xl font-bold mb-1">{animatedStreak}</p>
              <p className="text-xs text-white/80 font-medium">يوم متتالي</p>
            </CardContent>
          </Card>
        </div>

        {/* Level Progress */}
        <Card className="glass border-white/10 shadow-glass animate-slide-up [animation-delay:100ms]">
          <CardContent className="p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-foreground">
                التقدم للمستوى {currentLevel + 1}
              </span>
              <span className="text-xs text-muted-foreground font-medium bg-muted px-2 py-1 rounded-full">
                {xpToNextLevel} XP متبقية
              </span>
            </div>
            <Progress value={levelProgress} className="h-3" />
          </CardContent>
        </Card>

        {/* Continue Learning */}
        <Card className="border-0 bg-gradient-card shadow-glass animate-slide-up [animation-delay:200ms] overflow-hidden relative">
          <div className="absolute top-0 start-0 w-full h-1 bg-gradient-primary" />
          <CardContent className="p-6">
            <div className="flex items-start justify-between gap-6">
              <div className="flex-1">
                <Badge className="bg-primary/20 text-primary border-primary/30 mb-3 hover:bg-primary/30 transition-colors">
                  {currentLesson.subject}
                </Badge>
                <h3 className="text-xl font-bold text-foreground mb-2">
                  {currentLesson.title}
                </h3>
                <p className="text-sm text-muted-foreground mb-4 flex items-center gap-1">
                  <Timer className="w-4 h-4" />
                  {currentLesson.duration} متبقية
                </p>
                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-medium">
                    <span className="text-muted-foreground">التقدم العام</span>
                    <span className="text-primary">
                      {currentLesson.progress}%
                    </span>
                  </div>
                  <Progress value={currentLesson.progress} className="h-2.5" />
                </div>
              </div>
              <Link href={`/ar/lectures/${currentLesson.id}`}>
                <Button
                  size="lg"
                  className="bg-gradient-primary shadow-glow hover:shadow-glow-sm hover:scale-105 transition-all duration-300 text-white h-12 px-6 rounded-xl"
                >
                  <Play className="w-5 h-5 ms-2 fill-current" />
                  متابعة
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Daily Quests */}
        <Card className="glass border-white/10 shadow-glass animate-slide-up [animation-delay:300ms]">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
                <Target className="w-6 h-6 text-amber-500" />
                مهام اليوم
              </h2>
              <Badge
                variant="outline"
                className="border-amber-500/30 text-amber-600 bg-amber-500/10"
              >
                {completedQuests}/{dailyQuests.length} مكتمل
              </Badge>
            </div>
            <div className="space-y-3">
              {dailyQuests.map((quest) => (
                <div
                  key={quest.id}
                  className={`flex items-center justify-between p-4 rounded-xl transition-all duration-300 ${
                    quest.completed
                      ? "bg-emerald-500/10 border border-emerald-500/20"
                      : "bg-surface hover:bg-muted/60 border border-transparent"
                  }`}
                >
                  <div className="flex items-center gap-4">
                    {quest.completed ? (
                      <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center">
                        <CheckCircle className="w-5 h-5 text-emerald-600" />
                      </div>
                    ) : (
                      <div className="w-8 h-8 rounded-full border-2 border-muted-foreground/30 flex items-center justify-center">
                        <div className="w-4 h-4 rounded-full bg-muted-foreground/10" />
                      </div>
                    )}
                    <span
                      className={`font-medium ${
                        quest.completed
                          ? "text-muted-foreground line-through decoration-emerald-500/50"
                          : "text-foreground"
                      }`}
                    >
                      {quest.title}
                    </span>
                  </div>
                  <Badge
                    variant={quest.completed ? "default" : "secondary"}
                    className={`${quest.completed ? "bg-emerald-500 hover:bg-emerald-600" : "bg-amber-100 text-amber-700 hover:bg-amber-200"}`}
                  >
                    +{quest.xp} XP
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Access - ALL Features */}
        <div className="space-y-4 animate-slide-up [animation-delay:400ms]">
          <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-amber-500" />
            الوصول السريع
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {quickAccessItems.map((item) => (
              <Link key={item.href} href={item.href}>
                <Card className="glass border-white/5 hover:bg-white/10 hover:border-primary/20 transition-all duration-300 cursor-pointer group h-full hover:shadow-glow-sm hover:-translate-y-1">
                  <CardContent className="p-4 text-center">
                    <div
                      className={`w-12 h-12 mx-auto rounded-2xl bg-gradient-to-br ${item.color} flex items-center justify-center shadow-lg mb-3 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300`}
                    >
                      <item.icon className="w-6 h-6 text-white" />
                    </div>
                    <span className="text-xs font-medium text-foreground/80 group-hover:text-primary transition-colors line-clamp-1">
                      {item.label}
                    </span>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>

        {/* Leaderboard Preview */}
        <Card className="glass border-white/10 shadow-glass animate-slide-up [animation-delay:500ms]">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
                <Medal className="w-6 h-6 text-amber-500" />
                ترتيبك
              </h2>
              <Link href="/ar/leaderboard">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-muted-foreground hover:text-primary gap-1 hover:bg-primary/10 transition-colors"
                >
                  عرض الكل
                  <ArrowLeft className="w-4 h-4 rtl:-scale-x-100" />
                </Button>
              </Link>
            </div>
            <div className="flex items-center gap-5 p-5 rounded-2xl bg-gradient-to-r from-amber-500/10 to-orange-500/5 border border-amber-500/10 relative overflow-hidden group hover:border-amber-500/30 transition-colors duration-300">
              <div className="absolute top-0 end-0 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" />
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-white font-bold text-2xl shadow-glow-sm group-hover:scale-110 transition-transform duration-300">
                #12
              </div>
              <div className="flex-1 z-10">
                <p className="font-bold text-lg text-foreground mb-1">
                  أنت في المركز الـ 12
                </p>
                <p className="text-sm text-muted-foreground flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  تقدم 3 مراكز هذا الأسبوع! 🎉
                </p>
              </div>
              <div className="text-center z-10 bg-background/50 backdrop-blur-sm px-4 py-2 rounded-xl border border-white/5">
                <p className="text-2xl font-bold text-amber-500 font-mono">
                  {animatedXP.toLocaleString()}
                </p>
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">
                  XP
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  if (isMobile) {
    return (
      <PullToRefresh
        onRefresh={handleRefresh}
        refreshingText="جاري التحديث..."
        pullText="اسحب للتحديث"
      >
        {content}
      </PullToRefresh>
    );
  }

  return content;
}

export default function ArabicDashboardClient() {
  return (
    <DashboardErrorBoundary>
      <DashboardContent />
    </DashboardErrorBoundary>
  );
}
