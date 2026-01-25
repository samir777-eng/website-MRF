"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Clock, Flame, Play, Target, Trophy, Zap } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

// Challenge data (standalone quizzes for practice)
const challenges = [
  {
    id: 1,
    title: "تحدي أساسيات النحو",
    category: "النحو",
    questions: 15,
    duration: "20 دقيقة",
    difficulty: "مبتدئ",
    completed: true,
    bestScore: 92,
    xpReward: 150,
    attempts: 3,
  },
  {
    id: 2,
    title: "تحدي تحليل النصوص",
    category: "الأدب",
    questions: 20,
    duration: "30 دقيقة",
    difficulty: "متوسط",
    completed: false,
    bestScore: null,
    xpReward: 200,
    attempts: 0,
  },
  {
    id: 3,
    title: "تحدي البلاغة والبيان",
    category: "البلاغة",
    questions: 12,
    duration: "15 دقيقة",
    difficulty: "متقدم",
    completed: true,
    bestScore: 88,
    xpReward: 180,
    attempts: 2,
  },
  {
    id: 4,
    title: "تحدي القراءة والفهم",
    category: "القراءة",
    questions: 10,
    duration: "25 دقيقة",
    difficulty: "مبتدئ",
    completed: false,
    bestScore: null,
    xpReward: 120,
    attempts: 0,
  },
  {
    id: 5,
    title: "التحدي الشامل",
    category: "شامل",
    questions: 30,
    duration: "45 دقيقة",
    difficulty: "متقدم",
    completed: false,
    bestScore: null,
    xpReward: 300,
    attempts: 1,
  },
  {
    id: 6,
    title: "تحدي التعبير والإنشاء",
    category: "التعبير",
    questions: 8,
    duration: "20 دقيقة",
    difficulty: "متوسط",
    completed: true,
    bestScore: 95,
    xpReward: 160,
    attempts: 4,
  },
];

const categories = [
  "الكل",
  "النحو",
  "الأدب",
  "البلاغة",
  "القراءة",
  "التعبير",
  "شامل",
];

function getDifficultyColor(difficulty: string) {
  switch (difficulty) {
    case "مبتدئ":
      return "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400";
    case "متوسط":
      return "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400";
    case "متقدم":
      return "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400";
    default:
      return "bg-muted text-muted-foreground";
  }
}

export default function ChallengesPage() {
  const [selectedCategory, setSelectedCategory] = useState("الكل");

  const filteredChallenges =
    selectedCategory === "الكل"
      ? challenges
      : challenges.filter((c) => c.category === selectedCategory);

  const completedCount = challenges.filter((c) => c.completed).length;
  const totalXP = challenges
    .filter((c) => c.completed)
    .reduce((sum, c) => sum + c.xpReward, 0);

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20 pb-24">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <header className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-500 to-rose-500 shadow-lg">
            <Flame className="h-7 w-7 text-white" />
          </div>
          <h1 className="mb-2 text-3xl font-bold">التحديات</h1>
          <p className="text-muted-foreground">
            اختبر مهاراتك واربح نقاط الخبرة
          </p>
        </header>

        {/* Stats */}
        <div className="mb-6 grid grid-cols-2 gap-4">
          <Card className="border border-orange-200 dark:border-orange-500/20 bg-gradient-to-br from-orange-50 to-rose-50 dark:from-orange-500/10 dark:to-rose-500/10">
            <CardContent className="p-4 text-center">
              <Trophy className="mx-auto mb-2 h-6 w-6 text-orange-500" />
              <div className="text-2xl font-bold text-orange-700 dark:text-foreground">
                {completedCount}/{challenges.length}
              </div>
              <div className="text-xs text-orange-600 dark:text-muted-foreground">
                مكتملة
              </div>
            </CardContent>
          </Card>
          <Card className="border border-amber-200 dark:border-amber-500/20 bg-gradient-to-br from-amber-50 to-yellow-50 dark:from-amber-500/10 dark:to-yellow-500/10">
            <CardContent className="p-4 text-center">
              <Zap className="mx-auto mb-2 h-6 w-6 text-amber-500" />
              <div className="text-2xl font-bold text-amber-700 dark:text-foreground">
                {totalXP}
              </div>
              <div className="text-xs text-amber-600 dark:text-muted-foreground">
                نقاط XP
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Category Pills */}
        <div className="mb-6 flex gap-2 overflow-x-auto pb-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`shrink-0 rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                selectedCategory === cat
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Challenge Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredChallenges.map((challenge) => (
            <Card
              key={challenge.id}
              className="group overflow-hidden border-0 bg-card/50 backdrop-blur transition-all hover:shadow-lg"
            >
              <CardContent className="p-4">
                <div className="mb-3 flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="mb-1 font-semibold">{challenge.title}</h3>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <span>{challenge.category}</span>
                      <span>•</span>
                      <span>{challenge.questions} سؤال</span>
                    </div>
                  </div>
                  <Badge className={getDifficultyColor(challenge.difficulty)}>
                    {challenge.difficulty}
                  </Badge>
                </div>

                <div className="mb-3 flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    {challenge.duration}
                  </div>
                  <div className="flex items-center gap-1">
                    <Zap className="h-4 w-4 text-amber-500" />+
                    {challenge.xpReward} XP
                  </div>
                </div>

                {challenge.completed && challenge.bestScore && (
                  <div className="mb-3">
                    <div className="mb-1 flex items-center justify-between text-sm">
                      <span>أفضل نتيجة</span>
                      <span className="font-bold text-emerald-500">
                        {challenge.bestScore}%
                      </span>
                    </div>
                    <Progress value={challenge.bestScore} className="h-2" />
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">
                    {challenge.attempts} محاولة
                  </span>
                  <Link href={`/ar/challenges/${challenge.id}`}>
                    <Button size="sm" className="gap-2">
                      <Play className="h-4 w-4" />
                      {challenge.completed ? "إعادة" : "ابدأ"}
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Leaderboard Link */}
        <div className="mt-8 text-center">
          <Link href="/ar/leaderboard?tab=challenges">
            <Button variant="outline" className="gap-2">
              <Target className="h-4 w-4" />
              عرض لوحة المتصدرين
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
