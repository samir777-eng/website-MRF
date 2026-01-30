"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  BookOpen,
  CheckCircle,
  Clock,
  Flame,
  Star,
  Target,
  Trophy,
  Zap,
} from "lucide-react";
import Link from "next/link";

// Mock achievement data
const stats = {
  completedLectures: 24,
  totalLectures: 30,
  pendingLectures: 6,
  overallLevel: 85,
  totalPoints: 12500,
  studySessions: 48,
  completedTasks: 156,
  currentStreak: 7,
};

const recentAchievements = [
  { id: 1, title: "متعلم نشط", icon: Flame, color: "from-orange-500 to-red-500", date: "اليوم" },
  { id: 2, title: "أسبوع متواصل", icon: Zap, color: "from-amber-500 to-yellow-500", date: "أمس" },
  { id: 3, title: "مكمل المحاضرات", icon: BookOpen, color: "from-blue-500 to-indigo-500", date: "منذ 3 أيام" },
];

export default function AchievementCornerPage() {
  const lectureProgress = Math.round((stats.completedLectures / stats.totalLectures) * 100);

  return (
    <div className="min-h-screen bg-background dark:bg-zinc-950 pb-24 lg:pb-8">
      <div className="container mx-auto px-4 md:px-6 py-8 space-y-8">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Link href="/ar/corners">
            <Button variant="ghost" size="icon" className="rounded-full">
              <ArrowLeft className="w-5 h-5 rtl:-scale-x-100" />
            </Button>
          </Link>
          <div className="flex-1">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-amber-600 rounded-xl flex items-center justify-center">
                <Trophy className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">ركن الإنجاز</h1>
                <p className="text-sm text-muted-foreground">تقدمك الكامل</p>
              </div>
            </div>
          </div>
        </div>

        {/* Overall Level */}
        <Card className="border-amber-500/20 bg-gradient-to-r from-amber-50 to-yellow-50 dark:from-amber-950/30 dark:to-yellow-950/30">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Star className="w-5 h-5 text-amber-600" />
                <span className="font-semibold text-foreground">المستوى الكلي</span>
              </div>
              <span className="text-3xl font-bold text-amber-600 dark:text-amber-400">
                {stats.overallLevel}%
              </span>
            </div>
            <Progress value={stats.overallLevel} className="h-3" />
            <div className="flex items-center justify-center gap-2 mt-4 text-sm text-muted-foreground">
              <Flame className="w-4 h-4 text-orange-500" />
              <span>سلسلة {stats.currentStreak} أيام متواصلة!</span>
            </div>
          </CardContent>
        </Card>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "المحاضرات المكتملة", value: stats.completedLectures, icon: CheckCircle, color: "text-green-600" },
            { label: "المحاضرات المتبقية", value: stats.pendingLectures, icon: Clock, color: "text-amber-600" },
            { label: "جلسات الدراسة", value: stats.studySessions, icon: Target, color: "text-blue-600" },
            { label: "النقاط المكتسبة", value: stats.totalPoints.toLocaleString(), icon: Zap, color: "text-purple-600" },
          ].map((stat, idx) => (
            <Card key={idx}>
              <CardContent className="p-4 text-center">
                <stat.icon className={`w-6 h-6 mx-auto mb-2 ${stat.color}`} />
                <div className="text-2xl font-bold text-foreground">{stat.value}</div>
                <div className="text-xs text-muted-foreground">{stat.label}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Lecture Progress */}
        <Card>
          <CardContent className="p-6 space-y-4">
            <h2 className="font-semibold text-foreground flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-blue-600" />
              تقدم المحاضرات
            </h2>
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <Progress value={lectureProgress} className="h-4" />
              </div>
              <span className="text-lg font-bold text-foreground">
                {stats.completedLectures}/{stats.totalLectures}
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Recent Achievements */}
        <Card>
          <CardContent className="p-6 space-y-4">
            <h2 className="font-semibold text-foreground flex items-center gap-2">
              <Trophy className="w-5 h-5 text-amber-600" />
              آخر الإنجازات
            </h2>
            <div className="space-y-3">
              {recentAchievements.map((achievement) => (
                <motion.div
                  key={achievement.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex items-center gap-4 p-3 rounded-lg bg-muted/50"
                >
                  <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${achievement.color} flex items-center justify-center`}>
                    <achievement.icon className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-foreground">{achievement.title}</div>
                    <div className="text-sm text-muted-foreground">{achievement.date}</div>
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

