"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useSpacedRepetition } from "@/contexts/SpacedRepetitionContext";
import { logger } from "@/lib/utils/logger";
import {
  AlertCircle,
  BarChart3,
  BookOpen,
  Brain,
  Calendar,
  CheckCircle,
  Clock,
  Flame,
  RefreshCw,
  Target,
  TrendingUp,
} from "lucide-react";
import { useState } from "react";

interface SpacedRepetitionDisplayProps {
  variant?: "compact" | "detailed" | "dashboard";
  showStartButton?: boolean;
}

export default function SpacedRepetitionDisplay({
  variant = "compact",
  showStartButton = true,
}: SpacedRepetitionDisplayProps) {
  const {
    reviewStats,
    itemsDueToday,
    itemsOverdue,
    userPerformance,
    recommendedSessionSize,
    weakAreas,
    startReviewSession,
    currentSession,
  } = useSpacedRepetition();

  const [selectedSessionType, setSelectedSessionType] = useState<
    "scheduled" | "practice" | "weak_areas"
  >("scheduled");

  const handleStartSession = () => {
    const session = startReviewSession(
      selectedSessionType,
      recommendedSessionSize,
    );
    if (session) {
      // Navigate to review session page or show review interface
      logger.debug("Started review session", {
        context: "SpacedRepetition",
        data: { session },
      });
    } else {
      alert("لا توجد عناصر للمراجعة في الوقت الحالي");
    }
  };

  // Compact variant for sidebar
  if (variant === "compact") {
    return (
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-foreground flex items-center gap-2">
            <Brain className="w-5 h-5 text-blue-600" />
            المراجعة الذكية
          </h3>
          <Badge variant={itemsOverdue.length > 0 ? "destructive" : "default"}>
            {itemsDueToday.length + itemsOverdue.length}
          </Badge>
        </div>

        <div className="space-y-2">
          {itemsOverdue.length > 0 && (
            <div className="flex items-center gap-2 p-2 bg-red-50 dark:bg-red-950/20 rounded-lg border border-red-200">
              <AlertCircle className="w-4 h-4 text-red-600" />
              <div className="flex-1">
                <div className="text-sm font-medium text-red-800">متأخرة</div>
                <div className="text-sm text-red-600">
                  {itemsOverdue.length} عنصر
                </div>
              </div>
            </div>
          )}

          {itemsDueToday.length > 0 && (
            <div className="flex items-center gap-2 p-2 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200">
              <Clock className="w-4 h-4 text-blue-600" />
              <div className="flex-1">
                <div className="text-sm font-medium text-blue-800">اليوم</div>
                <div className="text-sm text-blue-600">
                  {itemsDueToday.length} عنصر
                </div>
              </div>
            </div>
          )}

          <div className="flex items-center gap-2 p-2 bg-green-50 dark:bg-green-950/20 rounded-lg">
            <TrendingUp className="w-4 h-4 text-green-600" />
            <div className="flex-1">
              <div className="text-sm font-medium text-green-800">الدقة</div>
              <div className="text-sm text-green-600">
                {userPerformance.averageAccuracy.toFixed(0)}%
              </div>
            </div>
          </div>

          {showStartButton &&
            (itemsDueToday.length > 0 || itemsOverdue.length > 0) && (
              <Button
                onClick={handleStartSession}
                className="w-full h-11 min-h-[44px]"
                disabled={!!currentSession}
              >
                <Brain className="w-4 h-4 me-2" />
                {currentSession ? "جلسة نشطة" : "ابدأ المراجعة"}
              </Button>
            )}
        </div>
      </div>
    );
  }

  // Dashboard variant
  if (variant === "dashboard") {
    return (
      <Card className="border-0 shadow-xl bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20">
        <CardHeader>
          <h2 className="text-2xl font-semibold leading-none tracking-tight flex items-center gap-2">
            <Brain className="w-6 h-6 text-blue-600" />
            نظام المراجعة الذكية
          </h2>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Quick Stats */}
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-3 bg-white/50 dark:bg-black/10 rounded-xl">
              <div className="text-2xl font-bold text-blue-600">
                {itemsDueToday.length + itemsOverdue.length}
              </div>
              <div className="text-sm text-muted-foreground">
                للمراجعة اليوم
              </div>
            </div>

            <div className="text-center p-3 bg-white/50 dark:bg-black/10 rounded-xl">
              <div className="text-2xl font-bold text-green-600">
                {userPerformance.averageAccuracy.toFixed(0)}%
              </div>
              <div className="text-sm text-muted-foreground">متوسط الدقة</div>
            </div>
          </div>

          {/* Progress Overview */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">التقدم العام</span>
              <span className="text-sm text-muted-foreground">
                {reviewStats.mastered}/{reviewStats.totalItems} متقن
              </span>
            </div>
            <Progress
              value={
                (reviewStats.mastered / Math.max(reviewStats.totalItems, 1)) *
                100
              }
              className="h-2"
            />
          </div>

          {/* Session Recommendation */}
          <div className="p-4 bg-gradient-to-r from-blue-100 to-indigo-100 dark:from-blue-950/30 dark:to-indigo-950/30 rounded-xl">
            <div className="flex items-center gap-3 mb-2">
              <Target className="w-5 h-5 text-blue-600" />
              <span className="font-medium text-blue-800">جلسة موصى بها</span>
            </div>
            <div className="text-sm text-blue-700 mb-3">
              {recommendedSessionSize} عنصر • حوالي{" "}
              {Math.ceil(recommendedSessionSize * 0.75)} دقيقة
            </div>

            {showStartButton && (
              <Button
                onClick={handleStartSession}
                disabled={
                  !!currentSession ||
                  itemsDueToday.length + itemsOverdue.length === 0
                }
                className="w-full h-11 min-h-[44px]"
              >
                <Brain className="w-4 h-4 me-2" />
                {currentSession ? "جلسة نشطة" : "ابدأ المراجعة"}
              </Button>
            )}
          </div>

          {/* Weak Areas */}
          {weakAreas.length > 0 && (
            <div className="space-y-3">
              <h3 className="font-semibold text-foreground flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-orange-600" />
                المجالات التي تحتاج تحسين
              </h3>

              <div className="space-y-2">
                {weakAreas.slice(0, 3).map((area) => (
                  <div
                    key={area.subject}
                    className="flex items-center justify-between p-2 bg-orange-50 dark:bg-orange-950/20 rounded-lg"
                  >
                    <span className="text-sm font-medium text-orange-800">
                      {area.subject}
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-orange-600">
                        {area.accuracy.toFixed(0)}%
                      </span>
                      <Badge variant="outline" className="text-sm">
                        {area.count} عنصر
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    );
  }

  // Detailed variant for dedicated page
  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-500 to-indigo-600 text-white">
          <CardContent className="p-6 text-center">
            <BookOpen className="w-8 h-8 mx-auto mb-3" />
            <div className="text-3xl font-bold mb-1">
              {reviewStats.totalItems}
            </div>
            <div className="text-blue-100">إجمالي العناصر</div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-gradient-to-br from-orange-500 to-red-600 text-white">
          <CardContent className="p-6 text-center">
            <Clock className="w-8 h-8 mx-auto mb-3" />
            <div className="text-3xl font-bold mb-1">
              {reviewStats.dueToday + reviewStats.overdue}
            </div>
            <div className="text-orange-100">للمراجعة اليوم</div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-gradient-to-br from-green-500 to-emerald-600 text-white">
          <CardContent className="p-6 text-center">
            <CheckCircle className="w-8 h-8 mx-auto mb-3" />
            <div className="text-3xl font-bold mb-1">
              {reviewStats.mastered}
            </div>
            <div className="text-green-100">متقن</div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-500 to-pink-600 text-white">
          <CardContent className="p-6 text-center">
            <TrendingUp className="w-8 h-8 mx-auto mb-3" />
            <div className="text-3xl font-bold mb-1">
              {userPerformance.averageAccuracy.toFixed(0)}%
            </div>
            <div className="text-purple-100">متوسط الدقة</div>
          </CardContent>
        </Card>
      </div>

      {/* Session Controls */}
      <Card className="border-0 shadow-xl">
        <CardHeader>
          <h2 className="text-2xl font-semibold leading-none tracking-tight flex items-center gap-2">
            <Target className="w-6 h-6 text-blue-600" />
            بدء جلسة مراجعة
          </h2>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-2">
            {[
              { key: "scheduled", label: "مراجعة مجدولة", icon: Calendar },
              { key: "practice", label: "تدريب إضافي", icon: RefreshCw },
              {
                key: "weak_areas",
                label: "المجالات الضعيفة",
                icon: AlertCircle,
              },
            ].map(({ key, label, icon: Icon }) => (
              <Button
                key={key}
                onClick={() => setSelectedSessionType(key as any)}
                variant={selectedSessionType === key ? "default" : "outline"}
                className="flex items-center gap-2 h-11 min-h-[44px]"
              >
                <Icon className="w-4 h-4" />
                {label}
              </Button>
            ))}
          </div>

          <div className="p-4 bg-muted/30 rounded-xl">
            <div className="flex items-center justify-between mb-2">
              <span className="font-medium">الجلسة الموصى بها</span>
              <Badge variant="outline">{recommendedSessionSize} عنصر</Badge>
            </div>
            <div className="text-sm text-muted-foreground mb-3">
              مدة متوقعة: {Math.ceil(recommendedSessionSize * 0.75)} دقيقة
            </div>

            {showStartButton && (
              <Button
                onClick={handleStartSession}
                disabled={
                  !!currentSession ||
                  itemsDueToday.length + itemsOverdue.length === 0
                }
                className="w-full h-11 min-h-[44px]"
              >
                <Brain className="w-4 h-4 me-2" />
                {currentSession ? "جلسة نشطة" : "ابدأ المراجعة"}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Performance Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border-0 shadow-xl">
          <CardHeader>
            <h2 className="text-2xl font-semibold leading-none tracking-tight flex items-center gap-2">
              <BarChart3 className="w-6 h-6 text-green-600" />
              إحصائيات الأداء
            </h2>
          </CardHeader>

          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  إجمالي المراجعات
                </span>
                <span className="font-bold">{reviewStats.totalReviews}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  متوسط الدقة
                </span>
                <span className="font-bold text-green-600">
                  {reviewStats.averageAccuracy.toFixed(1)}%
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  العناصر المتقنة
                </span>
                <span className="font-bold text-blue-600">
                  {reviewStats.mastered}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  السلسلة الحالية
                </span>
                <span className="font-bold text-orange-600 flex items-center gap-1">
                  <Flame className="w-4 h-4" />
                  {userPerformance.streakDays} أيام
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-xl">
          <CardHeader>
            <h2 className="text-2xl font-semibold leading-none tracking-tight flex items-center gap-2">
              <AlertCircle className="w-6 h-6 text-orange-600" />
              المجالات التي تحتاج تحسين
            </h2>
          </CardHeader>

          <CardContent>
            {weakAreas.length > 0 ? (
              <div className="space-y-3">
                {weakAreas.map((area) => (
                  <div key={area.subject} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{area.subject}</span>
                      <span className="text-sm text-muted-foreground">
                        {area.accuracy.toFixed(0)}% • {area.count} عنصر
                      </span>
                    </div>
                    <Progress value={area.accuracy} className="h-2" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <CheckCircle className="w-12 h-12 mx-auto mb-3 text-green-500" />
                <p>ممتاز! لا توجد مجالات تحتاج تحسين</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
