"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useGamification } from "@/contexts/GamificationContext";
import {
  Calendar,
  CheckCircle,
  Clock,
  Flame,
  Snowflake,
  Star,
  Target,
  Trophy,
  Zap,
} from "lucide-react";
import { useEffect, useState } from "react";

interface StreakDisplayProps {
  variant?: "compact" | "detailed" | "dashboard";
  showGoals?: boolean;
}

export default function StreakDisplay({
  variant = "compact",
  showGoals = true,
}: StreakDisplayProps) {
  const { userStats, updateStreak: _updateStreak } = useGamification();
  const [streakFreezes, setStreakFreezes] = useState(3); // Mock data - in real app, get from backend
  const [dailyGoals, setDailyGoals] = useState({
    lessonsCompleted: 0,
    quizzesTaken: 0,
    studyTime: 0, // in minutes
    notesWritten: 0,
  });

  const [dailyTargets] = useState({
    lessonsCompleted: 2,
    quizzesTaken: 1,
    studyTime: 60, // 1 hour
    notesWritten: 3,
  });

  // Calculate daily progress
  const dailyProgress = {
    lessons: Math.min(
      100,
      (dailyGoals.lessonsCompleted / dailyTargets.lessonsCompleted) * 100,
    ),
    quizzes: Math.min(
      100,
      (dailyGoals.quizzesTaken / dailyTargets.quizzesTaken) * 100,
    ),
    studyTime: Math.min(
      100,
      (dailyGoals.studyTime / dailyTargets.studyTime) * 100,
    ),
    notes: Math.min(
      100,
      (dailyGoals.notesWritten / dailyTargets.notesWritten) * 100,
    ),
  };

  const overallDailyProgress =
    (dailyProgress.lessons +
      dailyProgress.quizzes +
      dailyProgress.studyTime +
      dailyProgress.notes) /
    4;
  const isGoalCompleted = overallDailyProgress >= 100;

  // Get streak color based on length
  const _getStreakColor = (streak: number) => {
    if (streak >= 30) return "text-purple-600 bg-purple-100";
    if (streak >= 14) return "text-orange-600 bg-orange-100";
    if (streak >= 7) return "text-red-600 bg-red-100";
    if (streak >= 3) return "text-yellow-600 bg-yellow-100";
    return "text-blue-600 bg-blue-100";
  };

  // Get streak title
  const getStreakTitle = (streak: number) => {
    if (streak >= 100) return "أسطورة النار 🔥";
    if (streak >= 50) return "سيد اللهب 🌟";
    if (streak >= 30) return "محارب النار ⚔️";
    if (streak >= 14) return "حارس الشعلة 🛡️";
    if (streak >= 7) return "مشعل النار 🔥";
    if (streak >= 3) return "شرارة البداية ✨";
    return "مبتدئ النار 🕯️";
  };

  // Use streak freeze
  const useStreakFreeze = () => {
    if (streakFreezes > 0) {
      setStreakFreezes((prev) => prev - 1);
      // In real app, save to backend
      alert("تم استخدام تجميد السلسلة! سلسلتك محمية لمدة يوم واحد.");
    }
  };

  // Update daily goals (mock - in real app, this would come from actual user activity)
  useEffect(() => {
    // This would be updated based on actual user activity
    setDailyGoals({
      lessonsCompleted: Math.floor(Math.random() * 3),
      quizzesTaken: Math.floor(Math.random() * 2),
      studyTime: Math.floor(Math.random() * 90),
      notesWritten: Math.floor(Math.random() * 5),
    });
  }, []);

  // Compact variant for navigation or sidebar
  if (variant === "compact") {
    return (
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <Flame className="w-5 h-5 text-orange-500" />
          <div className="flex flex-col">
            <span className="text-sm font-bold text-foreground">
              {userStats.currentStreak}
            </span>
            <span className="text-sm text-muted-foreground">يوم</span>
          </div>
        </div>

        {showGoals && (
          <div className="flex items-center gap-2">
            <Target className="w-4 h-4 text-green-500" />
            <div className="w-16">
              <Progress value={overallDailyProgress} className="h-2" />
            </div>
            <span className="text-sm text-muted-foreground">
              {Math.round(overallDailyProgress)}%
            </span>
          </div>
        )}
      </div>
    );
  }

  // Detailed variant for dashboard or profile
  return (
    <div className="space-y-6">
      {/* Main Streak Card */}
      <Card className="border-0 shadow-xl bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-950/20 dark:to-red-950/20">
        <CardHeader className="text-center pb-4">
          <div className="w-20 h-20 bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <Flame className="w-10 h-10 text-white" />
          </div>
          <CardTitle className="text-3xl font-bold text-foreground mb-2">
            {userStats.currentStreak} يوم
          </CardTitle>
          <p className="text-muted-foreground">
            {getStreakTitle(userStats.currentStreak)}
          </p>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Streak Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-white/50 dark:bg-black/10 rounded-xl">
              <div className="text-2xl font-bold text-orange-600">
                {userStats.currentStreak}
              </div>
              <div className="text-sm text-muted-foreground">
                السلسلة الحالية
              </div>
            </div>

            <div className="text-center p-4 bg-white/50 dark:bg-black/10 rounded-xl">
              <div className="text-2xl font-bold text-red-600">
                {userStats.longestStreak}
              </div>
              <div className="text-sm text-muted-foreground">أطول سلسلة</div>
            </div>

            <div className="text-center p-4 bg-white/50 dark:bg-black/10 rounded-xl">
              <div className="text-2xl font-bold text-purple-600">
                {userStats.daysActive}
              </div>
              <div className="text-sm text-muted-foreground">
                إجمالي الأيام النشطة
              </div>
            </div>
          </div>

          {/* Streak Freezes */}
          <div className="flex items-center justify-between p-4 bg-blue-50 dark:bg-blue-950/20 rounded-xl">
            <div className="flex items-center gap-3">
              <Snowflake className="w-6 h-6 text-blue-600" />
              <div>
                <h4 className="font-semibold text-foreground">تجميد السلسلة</h4>
                <p className="text-sm text-muted-foreground">
                  احم سلسلتك من الانقطاع
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Badge className="bg-blue-600 text-white">
                {streakFreezes} متبقي
              </Badge>
              <Button
                onClick={useStreakFreeze}
                disabled={streakFreezes === 0}
                variant="outline"
                className="h-11 min-h-[44px]"
              >
                استخدام
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Daily Goals */}
      {showGoals && (
        <Card className="border-0 shadow-xl bg-gradient-to-br from-green-50 to-blue-50 dark:from-green-950/20 dark:to-blue-950/20">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Target className="w-6 h-6 text-green-600" />
                <CardTitle className="text-xl">الأهداف اليومية</CardTitle>
              </div>

              {isGoalCompleted && (
                <Badge className="bg-green-600 text-white">
                  <CheckCircle className="w-4 h-4 me-1" />
                  مكتمل
                </Badge>
              )}
            </div>
          </CardHeader>

          <CardContent className="space-y-4">
            {/* Overall Progress */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">التقدم الإجمالي</span>
                <span className="font-medium">
                  {Math.round(overallDailyProgress)}%
                </span>
              </div>
              <Progress value={overallDailyProgress} size="lg" />
            </div>

            {/* Individual Goals */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-blue-600" />
                    <span>الدروس</span>
                  </div>
                  <span>
                    {dailyGoals.lessonsCompleted}/
                    {dailyTargets.lessonsCompleted}
                  </span>
                </div>
                <Progress value={dailyProgress.lessons} className="h-2" />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <Trophy className="w-4 h-4 text-green-600" />
                    <span>الاختبارات</span>
                  </div>
                  <span>
                    {dailyGoals.quizzesTaken}/{dailyTargets.quizzesTaken}
                  </span>
                </div>
                <Progress value={dailyProgress.quizzes} className="h-2" />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-purple-600" />
                    <span>وقت الدراسة</span>
                  </div>
                  <span>
                    {dailyGoals.studyTime}/{dailyTargets.studyTime} دقيقة
                  </span>
                </div>
                <Progress value={dailyProgress.studyTime} className="h-2" />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <Star className="w-4 h-4 text-yellow-600" />
                    <span>الملاحظات</span>
                  </div>
                  <span>
                    {dailyGoals.notesWritten}/{dailyTargets.notesWritten}
                  </span>
                </div>
                <Progress value={dailyProgress.notes} className="h-2" />
              </div>
            </div>

            {/* Rewards Preview */}
            <div className="p-4 bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-950/20 dark:to-orange-950/20 rounded-xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Zap className="w-5 h-5 text-yellow-600" />
                  <span className="font-medium text-foreground">
                    مكافأة إكمال الأهداف
                  </span>
                </div>
                <Badge
                  variant="outline"
                  className="bg-yellow-100 text-yellow-800 border-yellow-200"
                >
                  +100 XP
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Streak Milestones */}
      <Card className="border-0 shadow-xl bg-gradient-to-br from-background to-muted/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-6 h-6 text-blue-600" />
            معالم السلسلة
          </CardTitle>
        </CardHeader>

        <CardContent>
          <div className="space-y-3">
            {[
              {
                days: 3,
                title: "شرارة البداية",
                reward: "50 XP",
                achieved: userStats.currentStreak >= 3,
              },
              {
                days: 7,
                title: "أسبوع من التفوق",
                reward: "200 XP",
                achieved: userStats.currentStreak >= 7,
              },
              {
                days: 14,
                title: "أسبوعان متتاليان",
                reward: "500 XP",
                achieved: userStats.currentStreak >= 14,
              },
              {
                days: 30,
                title: "شهر من الإنجاز",
                reward: "1000 XP",
                achieved: userStats.currentStreak >= 30,
              },
              {
                days: 50,
                title: "الخمسين الذهبية",
                reward: "2000 XP",
                achieved: userStats.currentStreak >= 50,
              },
              {
                days: 100,
                title: "المئة الأسطورية",
                reward: "5000 XP",
                achieved: userStats.currentStreak >= 100,
              },
            ].map((milestone, index) => (
              <div
                key={index}
                className={`flex items-center justify-between p-3 rounded-xl ${
                  milestone.achieved
                    ? "bg-green-50 dark:bg-green-950/20 border border-green-200"
                    : "bg-muted/30"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      milestone.achieved
                        ? "bg-green-500 text-white"
                        : "bg-muted border-2 border-muted-foreground/30"
                    }`}
                  >
                    {milestone.achieved ? (
                      <CheckCircle className="w-4 h-4" />
                    ) : (
                      <span className="text-sm font-bold">
                        {milestone.days}
                      </span>
                    )}
                  </div>
                  <div>
                    <div className="font-medium text-foreground">
                      {milestone.title}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {milestone.days} يوم متتالي
                    </div>
                  </div>
                </div>

                <Badge variant={milestone.achieved ? "default" : "outline"}>
                  {milestone.reward}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
