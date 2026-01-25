"use client";

/**
 * Simplified Dashboard - Phase 1 Task 1.5
 * Progressive disclosure approach with NextActionCard
 */

import NextActionCard, { type NextAction } from "./NextActionCard";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Star,
  Flame,
  Target,
  Video,
  Trophy,
  Medal,
  ShoppingBag,
  CheckCircle,
  ChevronDown,
  Brain,
  ClipboardList,
  HelpCircle,
  Timer as TimerIcon,
} from "lucide-react";
import Link from "next/link";

// ============================================================================
// MOCK DATA (Replace with real data from API/Context)
// ============================================================================

const mockNextAction: NextAction = {
  type: "continue-lesson",
  id: "lesson-15",
  title: "أسلوب الاستثناء",
  subject: "النحو",
  progress: 65,
  duration: "25 دقيقة متبقية",
  estimatedTime: "15 دقيقة",
  completionReward: {
    xp: 100,
    badge: "نحوي متميز",
  },
};

const mockStats = {
  level: 12,
  currentStreak: 7,
  todayProgress: 65, // percentage
  dailyGoal: 30, // minutes
  timeSpentToday: 19.5, // minutes
};

const mockDailyQuests = [
  { id: 1, title: "أكمل درسًا واحدًا", xp: 50, completed: true },
  { id: 2, title: "أجب على 10 أسئلة", xp: 30, completed: true },
  { id: 3, title: "حافظ على سلسلتك", xp: 25, completed: false },
  { id: 4, title: "احصل على 80% في اختبار", xp: 75, completed: false },
  { id: 5, title: "راجع أخطاءك", xp: 40, completed: false },
];

// ============================================================================
// SIMPLIFIED DASHBOARD COMPONENT
// ============================================================================

export function SimplifiedDashboard() {
  const completedQuests = mockDailyQuests.filter((q) => q.completed).length;
  const visibleQuests = mockDailyQuests.slice(0, 3);
  const hiddenQuestsCount = mockDailyQuests.length - 3;

  return (
    <div dir="rtl" className="max-w-5xl mx-auto space-y-6 p-4 md:p-6">
      {/* 1. NEXT ACTION CARD - Most Prominent */}
      <section>
        <h2 className="text-lg font-bold text-foreground mb-3 flex items-center gap-2">
          <Target className="w-5 h-5 text-primary" />
          التالي بالنسبة لك
        </h2>
        <NextActionCard action={mockNextAction} prominent size="large" />
      </section>

      {/* 2. CORE STATS - Only 3 */}
      <section>
        <div className="grid grid-cols-3 gap-3 md:gap-4">
          {/* Level */}
          <StatCard
            icon={<Star className="w-6 h-6 text-amber-500 fill-amber-500" />}
            value={mockStats.level}
            label="المستوى"
            gradient="from-amber-500 to-orange-500"
          />

          {/* Streak */}
          <StatCard
            icon={<Flame className="w-6 h-6 text-orange-500 fill-orange-500" />}
            value={mockStats.currentStreak}
            label="السلسلة"
            gradient="from-orange-500 to-red-500"
            suffix="يوم"
          />

          {/* Today Progress */}
          <StatCard
            icon={<Target className="w-6 h-6 text-success-500" />}
            value={mockStats.todayProgress}
            label="هدف اليوم"
            gradient="from-success-500 to-emerald-600"
            suffix="%"
            subtext={`${mockStats.timeSpentToday}/${mockStats.dailyGoal} دقيقة`}
          />
        </div>
      </section>

      {/* 3. DAILY QUESTS - Max 3 Visible, Expandable */}
      <section>
        <Card className="glass border-border/50">
          <CardContent className="p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
                <Target className="w-5 h-5 text-amber-500" />
                مهام اليوم
              </h2>
              <Badge
                variant="outline"
                className="border-amber-500/30 text-amber-600 dark:text-amber-400 bg-amber-500/10"
              >
                {completedQuests}/{mockDailyQuests.length} مكتمل
              </Badge>
            </div>

            <div className="space-y-2">
              {/* Visible Quests (first 3) */}
              {visibleQuests.map((quest) => (
                <QuestItem key={quest.id} quest={quest} />
              ))}

              {/* Expandable Section for More Quests */}
              {hiddenQuestsCount > 0 && (
                <Accordion type="single" collapsible>
                  <AccordionItem value="more-quests" className="border-0">
                    <AccordionTrigger className="py-2 hover:no-underline">
                      <span className="text-sm text-primary font-medium">
                        عرض {hiddenQuestsCount} مهام إضافية
                      </span>
                    </AccordionTrigger>
                    <AccordionContent className="space-y-2 pt-2">
                      {mockDailyQuests.slice(3).map((quest) => (
                        <QuestItem key={quest.id} quest={quest} />
                      ))}
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              )}
            </div>
          </CardContent>
        </Card>
      </section>

      {/* 4. QUICK ACCESS - 4 Primary Items */}
      <section>
        <h2 className="text-lg font-bold text-foreground mb-3">
          الوصول السريع
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <QuickAccessItem
            href="/ar/lectures"
            icon={<Video className="w-6 h-6" />}
            label="المحاضرات"
            gradient="from-primary to-primary-600"
          />
          <QuickAccessItem
            href="/ar/achievements"
            icon={<Trophy className="w-6 h-6" />}
            label="الإنجازات"
            gradient="from-amber-500 to-orange-500"
          />
          <QuickAccessItem
            href="/ar/leaderboard"
            icon={<Medal className="w-6 h-6" />}
            label="المتصدرون"
            gradient="from-success-500 to-emerald-600"
          />
          <QuickAccessItem
            href="/ar/store"
            icon={<ShoppingBag className="w-6 h-6" />}
            label="المتجر"
            gradient="from-brand-coral-500 to-brand-coral-600"
          />
        </div>
      </section>

      {/* 5. EXPLORE MORE - Collapsed by Default (Progressive Disclosure) */}
      <section>
        <Accordion type="single" collapsible>
          <AccordionItem value="explore" className="border rounded-xl px-5">
            <AccordionTrigger className="py-4 hover:no-underline">
              <div className="flex items-center gap-2">
                <span className="text-lg font-bold text-foreground">
                  استكشف المزيد
                </span>
                <Badge variant="secondary" className="text-xs">
                  6 خيارات
                </Badge>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 pb-4">
                <SecondaryAccessItem
                  href="/ar/challenges"
                  icon={<Brain className="w-5 h-5" />}
                  label="التحديات"
                />
                <SecondaryAccessItem
                  href="/ar/homework"
                  icon={<ClipboardList className="w-5 h-5" />}
                  label="الواجبات"
                />
                <SecondaryAccessItem
                  href="/ar/corners/questions"
                  icon={<HelpCircle className="w-5 h-5" />}
                  label="أسئلة وأجوبة"
                />
                <SecondaryAccessItem
                  href="/ar/corners/mistakes"
                  icon={<Target className="w-5 h-5" />}
                  label="مراجعة الأخطاء"
                />
                <SecondaryAccessItem
                  href="/ar/corners/tasks"
                  icon={<TimerIcon className="w-5 h-5" />}
                  label="إدارة المهام"
                />
                <SecondaryAccessItem
                  href="/ar/profile"
                  icon={<Star className="w-5 h-5" />}
                  label="الملف الشخصي"
                />
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </section>
    </div>
  );
}

// ============================================================================
// HELPER COMPONENTS
// ============================================================================

function StatCard({
  icon,
  value,
  label,
  gradient,
  suffix,
  subtext,
}: {
  icon: React.ReactNode;
  value: number;
  label: string;
  gradient: string;
  suffix?: string;
  subtext?: string;
}) {
  return (
    <Card
      className={`border-0 text-white shadow-lg hover:scale-[1.02] transition-transform duration-300 bg-gradient-to-br ${gradient}`}
    >
      <CardContent className="p-4 text-center">
        <div className="flex justify-center mb-2">{icon}</div>
        <p className="text-2xl md:text-3xl font-bold mb-1">
          {value}
          {suffix && <span className="text-lg">{suffix}</span>}
        </p>
        <p className="text-xs text-white/80 font-medium">{label}</p>
        {subtext && (
          <p className="text-xs text-white/60 font-medium mt-1">{subtext}</p>
        )}
      </CardContent>
    </Card>
  );
}

function QuestItem({
  quest,
}: {
  quest: { id: number; title: string; xp: number; completed: boolean };
}) {
  return (
    <div
      className={`flex items-center justify-between p-3 rounded-lg transition-all duration-200 ${
        quest.completed
          ? "bg-success-500/10 border border-success-500/20"
          : "bg-muted/50 hover:bg-muted"
      }`}
    >
      <div className="flex items-center gap-3">
        <div
          className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center ${
            quest.completed
              ? "bg-success-500 border-success-500"
              : "border-muted-foreground/30"
          }`}
        >
          {quest.completed && <CheckCircle className="w-4 h-4 text-white" />}
        </div>
        <span
          className={`text-sm font-medium ${
            quest.completed
              ? "text-muted-foreground line-through"
              : "text-foreground"
          }`}
        >
          {quest.title}
        </span>
      </div>
      <Badge
        variant="secondary"
        className="text-xs font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400"
      >
        +{quest.xp} XP
      </Badge>
    </div>
  );
}

function QuickAccessItem({
  href,
  icon,
  label,
  gradient,
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
  gradient: string;
}) {
  return (
    <Link href={href}>
      <Card className="glass border-border/50 hover:shadow-xl hover:shadow-primary/10 transition-all duration-300 hover:-translate-y-0.5 cursor-pointer group h-full">
        <CardContent className="p-4 flex flex-col items-center justify-center text-center gap-3 h-full">
          <div
            className={`w-12 h-12 rounded-2xl flex items-center justify-center text-white bg-gradient-to-br ${gradient} group-hover:scale-110 transition-transform shadow-lg`}
          >
            {icon}
          </div>
          <span className="text-sm font-semibold text-foreground">{label}</span>
        </CardContent>
      </Card>
    </Link>
  );
}

function SecondaryAccessItem({
  href,
  icon,
  label,
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <Link href={href}>
      <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/30 hover:bg-muted/60 transition-colors cursor-pointer group">
        <div className="text-muted-foreground group-hover:text-primary transition-colors">
          {icon}
        </div>
        <span className="text-sm font-medium text-foreground">{label}</span>
      </div>
    </Link>
  );
}

export default SimplifiedDashboard;
