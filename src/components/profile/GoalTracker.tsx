"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  Award,
  BookOpen,
  Brain,
  Calendar,
  CheckCircle,
  Clock,
  Edit,
  Flag,
  Plus,
  Target,
  Trash2,
  TrendingUp,
  Trophy,
  Zap,
} from "lucide-react";
import { useState } from "react";

interface Goal {
  id: string;
  title: string;
  description: string;
  type: "daily" | "weekly" | "monthly" | "custom";
  category: "lessons" | "quizzes" | "xp" | "streak" | "accuracy" | "time";
  target: number;
  current: number;
  unit: string;
  deadline?: Date;
  priority: "low" | "medium" | "high";
  status: "active" | "completed" | "failed" | "paused";
  createdAt: Date;
  completedAt?: Date;
  reward?: {
    xp: number;
    coins: number;
    badge?: string;
  };
}

const MOCK_GOALS: Goal[] = [
  {
    id: "1",
    title: "إكمال 30 درس",
    description: "أكمل 30 درساً في النحو والبلاغة",
    type: "monthly",
    category: "lessons",
    target: 30,
    current: 24,
    unit: "درس",
    deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    priority: "high",
    status: "active",
    createdAt: new Date(Date.now() - 23 * 24 * 60 * 60 * 1000),
    reward: { xp: 500, coins: 100, badge: "محارب الشهر" },
  },
  {
    id: "2",
    title: "الحفاظ على سلسلة 10 أيام",
    description: "ادرس كل يوم لمدة 10 أيام متتالية",
    type: "custom",
    category: "streak",
    target: 10,
    current: 7,
    unit: "يوم",
    priority: "high",
    status: "active",
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    reward: { xp: 300, coins: 50 },
  },
  {
    id: "3",
    title: "الحصول على 1500 نقطة خبرة",
    description: "اجمع 1500 نقطة خبرة من الدروس والاختبارات",
    type: "monthly",
    category: "xp",
    target: 1500,
    current: 1247,
    unit: "نقطة",
    deadline: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
    priority: "medium",
    status: "active",
    createdAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000),
    reward: { xp: 200, coins: 75 },
  },
  {
    id: "4",
    title: "تحسين الدقة إلى 90%",
    description: "حقق دقة 90% أو أكثر في الاختبارات",
    type: "weekly",
    category: "accuracy",
    target: 90,
    current: 85,
    unit: "%",
    deadline: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
    priority: "high",
    status: "active",
    createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
    reward: { xp: 400, coins: 80 },
  },
  {
    id: "5",
    title: "إتمام 5 اختبارات",
    description: "أكمل 5 اختبارات بنجاح",
    type: "weekly",
    category: "quizzes",
    target: 5,
    current: 5,
    unit: "اختبار",
    priority: "medium",
    status: "completed",
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    completedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    reward: { xp: 250, coins: 50 },
  },
];

interface GoalTrackerProps {
  variant?: "compact" | "detailed" | "dashboard";
}

export default function GoalTracker({ variant = "compact" }: GoalTrackerProps) {
  const [goals] = useState<Goal[]>(MOCK_GOALS);
  const [filter, setFilter] = useState<"all" | "active" | "completed">(
    "active"
  );

  const filteredGoals = goals.filter((goal) => {
    if (filter === "all") return true;
    return goal.status === filter;
  });

  const activeGoals = goals.filter((g) => g.status === "active");
  const completedGoals = goals.filter((g) => g.status === "completed");
  const completionRate =
    goals.length > 0 ? (completedGoals.length / goals.length) * 100 : 0;

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "lessons":
        return <BookOpen className="w-4 h-4" />;
      case "quizzes":
        return <Brain className="w-4 h-4" />;
      case "xp":
        return <Zap className="w-4 h-4" />;
      case "streak":
        return <Target className="w-4 h-4" />;
      case "accuracy":
        return <TrendingUp className="w-4 h-4" />;
      case "time":
        return <Clock className="w-4 h-4" />;
      default:
        return <Target className="w-4 h-4" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "text-red-600 bg-red-100";
      case "medium":
        return "text-yellow-600 bg-yellow-100";
      case "low":
        return "text-blue-600 bg-blue-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "text-green-600 bg-green-100";
      case "active":
        return "text-blue-600 bg-blue-100";
      case "failed":
        return "text-red-600 bg-red-100";
      case "paused":
        return "text-gray-600 bg-gray-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  const getDaysRemaining = (deadline?: Date) => {
    if (!deadline) return null;
    const days = Math.ceil(
      (deadline.getTime() - Date.now()) / (1000 * 60 * 60 * 24)
    );
    return days;
  };

  // Compact variant for sidebar
  if (variant === "compact") {
    return (
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-foreground flex items-center gap-2">
            <Target className="w-5 h-5 text-green-600" />
            أهدافي
          </h3>
          <Badge variant="outline">{activeGoals.length}</Badge>
        </div>

        <div className="space-y-2">
          {activeGoals.slice(0, 3).map((goal) => (
            <div key={goal.id} className="p-3 bg-muted/30 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                {getCategoryIcon(goal.category)}
                <span className="text-sm font-medium text-foreground truncate">
                  {goal.title}
                </span>
              </div>
              <Progress
                value={(goal.current / goal.target) * 100}
                className="h-2 mb-1"
              />
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <span>
                  {goal.current}/{goal.target} {goal.unit}
                </span>
                {goal.deadline && (
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {getDaysRemaining(goal.deadline)} يوم
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>

        <Button size="sm" variant="outline" className="w-full">
          <Plus className="w-4 h-4 me-2" />
          هدف جديد
        </Button>
      </div>
    );
  }

  // Dashboard variant
  if (variant === "dashboard") {
    return (
      <Card className="border-0 shadow-xl bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="w-6 h-6 text-green-600" />
            أهداف التعلم
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Stats */}
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center p-3 bg-white/50 dark:bg-black/10 rounded-xl">
              <div className="text-2xl font-bold text-blue-600">
                {activeGoals.length}
              </div>
              <div className="text-sm text-muted-foreground">نشط</div>
            </div>
            <div className="text-center p-3 bg-white/50 dark:bg-black/10 rounded-xl">
              <div className="text-2xl font-bold text-green-600">
                {completedGoals.length}
              </div>
              <div className="text-sm text-muted-foreground">مكتمل</div>
            </div>
            <div className="text-center p-3 bg-white/50 dark:bg-black/10 rounded-xl">
              <div className="text-2xl font-bold text-purple-600">
                {completionRate.toFixed(0)}%
              </div>
              <div className="text-sm text-muted-foreground">معدل الإنجاز</div>
            </div>
          </div>

          {/* Active Goals */}
          <div className="space-y-3">
            {activeGoals.slice(0, 3).map((goal) => (
              <div
                key={goal.id}
                className="p-4 bg-white/50 dark:bg-black/10 rounded-xl"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    {getCategoryIcon(goal.category)}
                    <span className="font-medium text-foreground">
                      {goal.title}
                    </span>
                  </div>
                  <Badge className={getPriorityColor(goal.priority)} size="sm">
                    {goal.priority === "high"
                      ? "عالي"
                      : goal.priority === "medium"
                        ? "متوسط"
                        : "منخفض"}
                  </Badge>
                </div>

                <Progress
                  value={(goal.current / goal.target) * 100}
                  className="h-2 mb-2"
                />

                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">
                    {goal.current}/{goal.target} {goal.unit}
                  </span>
                  {goal.deadline && (
                    <span className="flex items-center gap-1 text-muted-foreground">
                      <Clock className="w-3 h-3" />
                      {getDaysRemaining(goal.deadline)} يوم متبقي
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>

          <Button className="w-full">
            <Plus className="w-4 h-4 me-2" />
            إضافة هدف جديد
          </Button>
        </CardContent>
      </Card>
    );
  }

  // Detailed variant for full page
  return (
    <div className="space-y-6">
      {/* Header Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-500 to-indigo-600 text-white">
          <CardContent className="p-6 text-center">
            <Target className="w-8 h-8 mx-auto mb-3" />
            <div className="text-3xl font-bold mb-1">{activeGoals.length}</div>
            <div className="text-blue-100">أهداف نشطة</div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-gradient-to-br from-green-500 to-emerald-600 text-white">
          <CardContent className="p-6 text-center">
            <CheckCircle className="w-8 h-8 mx-auto mb-3" />
            <div className="text-3xl font-bold mb-1">
              {completedGoals.length}
            </div>
            <div className="text-green-100">أهداف مكتملة</div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-500 to-pink-600 text-white">
          <CardContent className="p-6 text-center">
            <TrendingUp className="w-8 h-8 mx-auto mb-3" />
            <div className="text-3xl font-bold mb-1">
              {completionRate.toFixed(0)}%
            </div>
            <div className="text-purple-100">معدل الإنجاز</div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-gradient-to-br from-orange-500 to-red-600 text-white">
          <CardContent className="p-6 text-center">
            <Award className="w-8 h-8 mx-auto mb-3" />
            <div className="text-3xl font-bold mb-1">
              {goals.reduce((sum, g) => sum + (g.reward?.xp || 0), 0)}
            </div>
            <div className="text-orange-100">XP محتمل</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Add Button */}
      <div className="flex items-center justify-between">
        <div className="flex gap-2">
          <Button
            variant={filter === "all" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter("all")}
          >
            الكل ({goals.length})
          </Button>
          <Button
            variant={filter === "active" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter("active")}
          >
            نشط ({activeGoals.length})
          </Button>
          <Button
            variant={filter === "completed" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter("completed")}
          >
            مكتمل ({completedGoals.length})
          </Button>
        </div>

        <Button>
          <Plus className="w-4 h-4 me-2" />
          هدف جديد
        </Button>
      </div>

      {/* Goals List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredGoals.map((goal) => (
          <Card
            key={goal.id}
            className="border-0 shadow-xl hover:shadow-2xl transition-shadow"
          >
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white">
                    {getCategoryIcon(goal.category)}
                  </div>
                  <div>
                    <CardTitle className="text-lg">{goal.title}</CardTitle>
                    <p className="text-sm text-muted-foreground">
                      {goal.description}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Badge className={getPriorityColor(goal.priority)} size="sm">
                    {goal.priority === "high"
                      ? "عالي"
                      : goal.priority === "medium"
                        ? "متوسط"
                        : "منخفض"}
                  </Badge>
                  <Badge className={getStatusColor(goal.status)} size="sm">
                    {goal.status === "completed"
                      ? "مكتمل"
                      : goal.status === "active"
                        ? "نشط"
                        : goal.status === "failed"
                          ? "فشل"
                          : "متوقف"}
                  </Badge>
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              {/* Progress */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">التقدم</span>
                  <span className="text-sm text-muted-foreground">
                    {goal.current}/{goal.target} {goal.unit} (
                    {((goal.current / goal.target) * 100).toFixed(0)}%)
                  </span>
                </div>
                <Progress
                  value={(goal.current / goal.target) * 100}
                  size="lg"
                />
              </div>

              {/* Details */}
              <div className="grid grid-cols-2 gap-4 text-sm">
                {goal.deadline && (
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    <div>
                      <div className="text-muted-foreground">
                        الموعد النهائي
                      </div>
                      <div className="font-medium">
                        {getDaysRemaining(goal.deadline)} يوم متبقي
                      </div>
                    </div>
                  </div>
                )}

                {goal.reward && (
                  <div className="flex items-center gap-2">
                    <Award className="w-4 h-4 text-muted-foreground" />
                    <div>
                      <div className="text-muted-foreground">المكافأة</div>
                      <div className="font-medium">
                        {goal.reward.xp} XP + {goal.reward.coins} عملة
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Actions */}
              {goal.status === "active" && (
                <div className="flex gap-2 pt-2">
                  <Button size="sm" variant="outline" className="flex-1">
                    <Edit className="w-4 h-4 me-2" />
                    تعديل
                  </Button>
                  <Button size="sm" variant="outline" className="flex-1">
                    <Flag className="w-4 h-4 me-2" />
                    إيقاف
                  </Button>
                  <Button size="sm" variant="outline">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              )}

              {goal.status === "completed" && goal.reward && (
                <div className="p-3 bg-green-50 dark:bg-green-950/20 rounded-lg flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Trophy className="w-5 h-5 text-green-600" />
                    <span className="text-sm font-medium text-green-800">
                      تم الإنجاز!
                    </span>
                  </div>
                  <div className="text-sm text-green-600">
                    +{goal.reward.xp} XP
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
