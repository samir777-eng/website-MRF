"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, Flame, Gift, Play, Target, Zap } from "lucide-react";
import Link from "next/link";
import { memo } from "react";
import { QUICK_LINKS, TEXT } from "../dashboard-data";

interface DashboardSidebarProps {
  currentStreak: number;
}

// Icon mapping for dynamic rendering
const iconMap: Record<string, React.ReactNode> = {
  Play: <Play className="w-4 h-4 ms-2" />,
  Target: <Target className="w-4 h-4 ms-2" />,
  BookOpen: <BookOpen className="w-4 h-4 ms-2" />,
};

function DashboardSidebarComponent({ currentStreak }: DashboardSidebarProps) {
  return (
    <div className="space-y-6">
      {/* Streak Reward Card */}
      <Card className="border-0 shadow-xl bg-gradient-to-br from-orange-400 to-red-500 text-white overflow-hidden relative">
        <div className="absolute top-0 start-0 w-24 h-24 bg-white/10 rounded-full -translate-y-12 -translate-x-12" />
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Flame className="w-5 h-5" />
            {TEXT.streakRewardTitle}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center">
            <div className="text-4xl font-bold mb-2 motion-safe:animate-bounce">
              🔥
            </div>
            <div className="text-3xl font-bold mb-1">{currentStreak}</div>
            <div className="text-orange-100 mb-4">أيام متتالية!</div>
            <Link href="/ar/store">
              <Button
                variant="secondary"
                className="bg-white text-orange-600 hover:bg-gray-100 shadow-lg h-11 min-h-[44px]"
                aria-label="احصل على 100 نقطة مكافأة"
              >
                <Gift className="w-4 h-4 ms-2" aria-hidden="true" />
                احصل على 100 نقطة
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card className="border-0 shadow-xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-yellow-600" />
            {TEXT.quickActionsTitle}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Link href="/ar/lectures">
            <Button
              variant="outline"
              className="w-full justify-start hover:bg-blue-50 hover:border-blue-200 transition-colors h-11 min-h-[44px]"
              data-testid="start-lesson"
              aria-label="ابدأ درساً جديداً"
            >
              <Play className="w-4 h-4 ms-2" />
              ابدأ درساً جديداً
            </Button>
          </Link>
          <Link href="/ar/challenges">
            <Button
              variant="outline"
              className="w-full justify-start hover:bg-green-50 hover:border-green-200 transition-colors h-11 min-h-[44px]"
              data-testid="take-challenge"
              aria-label="ابدأ تحدياً جديداً"
            >
              <Target className="w-4 h-4 ms-2" />
              ابدأ تحدياً جديداً
            </Button>
          </Link>
          <Link href="/ar/review">
            <Button
              variant="outline"
              className="w-full justify-start hover:bg-purple-50 hover:border-purple-200 transition-colors h-11 min-h-[44px]"
              data-testid="review-vocabulary"
              aria-label="راجع المفردات"
            >
              <BookOpen className="w-4 h-4 ms-2" />
              راجع المفردات
            </Button>
          </Link>
        </CardContent>
      </Card>

      {/* Quick Links */}
      <Card className="border-0 shadow-xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-blue-600" />
            {TEXT.quickLinksTitle}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {QUICK_LINKS.map((link) => (
            <Link
              key={link.id}
              href={link.href}
              className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              data-testid={link.testId}
            >
              <span className="text-xl">{link.icon}</span>
              <span>{link.label}</span>
            </Link>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}

export const DashboardSidebar = memo(DashboardSidebarComponent);
