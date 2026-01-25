"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ScaleIn } from "@/lib/animations/lightweight-motion";
import { Trophy, CheckCircle, Clock, Zap } from "@/components/ui/icons";
import { Flame, Calendar, Target } from "lucide-react";

interface DailyStreakProps {
  currentStreak?: number;
  longestStreak?: number;
  todayCompleted?: boolean;
  className?: string;
}

export function DailyStreak({
  currentStreak = 7,
  longestStreak = 15,
  todayCompleted = true,
  className,
}: DailyStreakProps) {
  const [showCelebration, setShowCelebration] = useState(false);

  // Mock data for the last 7 days
  const last7Days = [
    { date: "الأحد", completed: true, day: "أ" },
    { date: "الاثنين", completed: true, day: "ث" },
    { date: "الثلاثاء", completed: true, day: "ث" },
    { date: "الأربعاء", completed: true, day: "أ" },
    { date: "الخميس", completed: true, day: "خ" },
    { date: "الجمعة", completed: true, day: "ج" },
    { date: "السبت", completed: todayCompleted, day: "س", isToday: true },
  ];

  const getStreakMessage = (streak: number) => {
    if (streak >= 30) return "أسطورة التعلم! 🏆";
    if (streak >= 21) return "خبير متفاني! 🌟";
    if (streak >= 14) return "متعلم ملتزم! 🔥";
    if (streak >= 7) return "أسبوع رائع! 💪";
    if (streak >= 3) return "بداية قوية! 🚀";
    return "ابدأ رحلتك! 📚";
  };

  const getNextMilestone = (streak: number) => {
    if (streak < 3) return 3;
    if (streak < 7) return 7;
    if (streak < 14) return 14;
    if (streak < 21) return 21;
    if (streak < 30) return 30;
    return Math.ceil(streak / 10) * 10;
  };

  const nextMilestone = getNextMilestone(currentStreak);
  const progressToNext =
    ((currentStreak % nextMilestone) / nextMilestone) * 100;

  useEffect(() => {
    if (currentStreak > 0 && currentStreak % 7 === 0) {
      setShowCelebration(true);
      setTimeout(() => setShowCelebration(false), 3000);
    }
  }, [currentStreak]);

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div
              className={`transition-transform duration-200 ${showCelebration ? "animate-pulse" : ""}`}
            >
              <Flame className="h-6 w-6 text-orange-500" />
            </div>
            <div>
              <CardTitle className="text-lg">سلسلة التعلم اليومية</CardTitle>
              <CardDescription>
                {getStreakMessage(currentStreak)}
              </CardDescription>
            </div>
          </div>
          <Badge variant="secondary" className="text-lg px-3 py-1">
            {currentStreak} يوم
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Current Streak Display */}
        <div className="text-center">
          <div
            className={`relative w-24 h-24 mx-auto mb-4 transition-transform duration-200 ${
              showCelebration ? "animate-bounce" : ""
            }`}
          >
            <div className="w-24 h-24 bg-gradient-to-br from-orange-400 to-red-500 rounded-full flex items-center justify-center">
              <Flame className="h-12 w-12 text-white" />
            </div>
            <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-bold">
                {currentStreak}
              </span>
            </div>
          </div>

          <div className="text-2xl font-bold text-primary-900 dark:text-primary-100">
            {currentStreak} يوم متتالي
          </div>
          <div className="text-sm text-muted-foreground">
            أطول سلسلة: {longestStreak} يوم
          </div>
        </div>

        {/* Progress to Next Milestone */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span>التقدم للهدف التالي</span>
            <span className="font-semibold">{nextMilestone} يوم</span>
          </div>
          <Progress value={progressToNext} className="h-2" />
          <div className="text-sm text-muted-foreground text-center">
            {nextMilestone - currentStreak} يوم متبقي
          </div>
        </div>

        {/* Weekly Calendar */}
        <div className="space-y-3">
          <h4 className="font-semibold text-sm">الأسبوع الحالي</h4>
          <div className="grid grid-cols-7 gap-2">
            {last7Days.map((day, index) => (
              <div key={index} className="text-center">
                <div className="text-sm text-muted-foreground mb-1">
                  {day.day}
                </div>
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-transform hover:scale-110 active:scale-95 ${
                    day.completed
                      ? "bg-green-500 text-white"
                      : day.isToday
                        ? "bg-primary-100 dark:bg-primary-900 text-primary-600 border-2 border-primary-300"
                        : "bg-gray-200 dark:bg-gray-700 text-gray-500"
                  }`}
                >
                  {day.completed ? (
                    <CheckCircle className="w-4 h-4" />
                  ) : day.isToday ? (
                    <Clock className="w-4 h-4" />
                  ) : (
                    index + 1
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Today's Status */}
        <div
          className={`p-3 rounded-lg border ${
            todayCompleted
              ? "bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800"
              : "bg-yellow-50 dark:bg-yellow-950 border-yellow-200 dark:border-yellow-800"
          }`}
        >
          <div className="flex items-center gap-2">
            {todayCompleted ? (
              <>
                <CheckCircle className="h-5 w-5 text-green-600" />
                <span className="font-medium text-green-700 dark:text-green-300">
                  أكملت هدف اليوم! 🎉
                </span>
              </>
            ) : (
              <>
                <Target className="h-5 w-5 text-yellow-600" />
                <span className="font-medium text-yellow-700 dark:text-yellow-300">
                  أكمل درساً واحداً للحفاظ على السلسلة
                </span>
              </>
            )}
          </div>
        </div>

        {/* Streak Rewards */}
        <div className="space-y-2">
          <h4 className="font-semibold text-sm flex items-center gap-2">
            <Trophy className="h-4 w-4 text-yellow-500" />
            مكافآت السلسلة
          </h4>
          <div className="grid grid-cols-3 gap-2 text-sm">
            <div
              className={`p-2 rounded text-center ${
                currentStreak >= 7
                  ? "bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300"
                  : "bg-gray-100 dark:bg-gray-800 text-gray-500"
              }`}
            >
              <div className="font-semibold">7 أيام</div>
              <div>+50 XP</div>
            </div>
            <div
              className={`p-2 rounded text-center ${
                currentStreak >= 14
                  ? "bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300"
                  : "bg-gray-100 dark:bg-gray-800 text-gray-500"
              }`}
            >
              <div className="font-semibold">14 يوم</div>
              <div>+100 XP</div>
            </div>
            <div
              className={`p-2 rounded text-center ${
                currentStreak >= 30
                  ? "bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300"
                  : "bg-gray-100 dark:bg-gray-800 text-gray-500"
              }`}
            >
              <div className="font-semibold">30 يوم</div>
              <div>شارة ذهبية</div>
            </div>
          </div>
        </div>

        {/* Action Button */}
        {!todayCompleted && (
          <Button className="w-full">
            <Zap className="w-4 h-4 mr-2 rtl:mr-0 rtl:ml-2" />
            ابدأ درساً الآن
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
