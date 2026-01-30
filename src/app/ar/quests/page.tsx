"use client";

import QuestDisplay from "@/components/gamification/QuestDisplay";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useGamification } from "@/contexts/GamificationContext";
import {
  QUEST_TYPES,
  SAMPLE_QUESTS,
  getActiveQuests,
  getCompletedQuests,
  getQuestsByType,
} from "@/lib/quests";
import {
  Award,
  Calendar,
  CheckCircle,
  Flame,
  Star,
  Target,
  TrendingUp,
  Trophy,
} from "lucide-react";
import { useState } from "react";

export default function QuestsPage() {
  const { userStats } = useGamification();
  const [selectedTab, setSelectedTab] = useState<
    "active" | "completed" | "all"
  >("active");

  // Calculate quest statistics
  const allQuests = SAMPLE_QUESTS;
  const activeQuests = getActiveQuests(allQuests);
  const completedQuests = getCompletedQuests(allQuests);

  const questStats = {
    total: allQuests.length,
    active: activeQuests.length,
    completed: completedQuests.length,
    completionRate: Math.round(
      (completedQuests.length / allQuests.length) * 100
    ),
  };

  const typeStats = Object.keys(QUEST_TYPES).map((type) => {
    const typeQuests = getQuestsByType(allQuests, type as any);
    const completedTypeQuests = getCompletedQuests(typeQuests);
    return {
      type,
      total: typeQuests.length,
      completed: completedTypeQuests.length,
      active: getActiveQuests(typeQuests).length,
      completionRate:
        typeQuests.length > 0
          ? Math.round((completedTypeQuests.length / typeQuests.length) * 100)
          : 0,
    };
  });

  const totalXPFromQuests = completedQuests.reduce((sum, quest) => {
    return (
      sum +
      quest.xpReward *
        (quest.difficulty === "expert"
          ? 3
          : quest.difficulty === "hard"
            ? 2
            : quest.difficulty === "medium"
              ? 1.5
              : 1)
    );
  }, 0);

  return (
    <div className="min-h-screen page-bg-purple">
      <div className="container mx-auto px-6 py-8 space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <Target className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            مركز المهام والتحديات
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            أكمل المهام اليومية والأسبوعية، شارك في التحديات الجماعية، واكسب
            نقاط الخبرة والمكافآت
          </p>
        </div>

        {/* Statistics Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="border-0 shadow-xl bg-gradient-to-br from-blue-500 to-blue-600 text-white">
            <CardContent className="p-6 text-center">
              <Target className="w-8 h-8 mx-auto mb-3" />
              <div className="text-3xl font-bold mb-1">{questStats.active}</div>
              <div className="text-blue-100">مهام نشطة</div>
              <div className="text-sm text-blue-200 mt-1">جاهزة للإكمال</div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-xl bg-gradient-to-br from-green-500 to-green-600 text-white">
            <CardContent className="p-6 text-center">
              <CheckCircle className="w-8 h-8 mx-auto mb-3" />
              <div className="text-3xl font-bold mb-1">
                {questStats.completed}
              </div>
              <div className="text-green-100">مهام مكتملة</div>
              <div className="text-sm text-green-200 mt-1">
                من أصل {questStats.total}
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-xl bg-gradient-to-br from-purple-500 to-purple-600 text-white">
            <CardContent className="p-6 text-center">
              <TrendingUp className="w-8 h-8 mx-auto mb-3" />
              <div className="text-3xl font-bold mb-1">
                {questStats.completionRate}%
              </div>
              <div className="text-purple-100">معدل الإكمال</div>
              <div className="text-sm text-purple-200 mt-1">
                التقدم الإجمالي
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-xl bg-gradient-to-br from-orange-500 to-orange-600 text-white">
            <CardContent className="p-6 text-center">
              <Star className="w-8 h-8 mx-auto mb-3" />
              <div className="text-3xl font-bold mb-1">
                {Math.floor(totalXPFromQuests).toLocaleString()}
              </div>
              <div className="text-orange-100">XP من المهام</div>
              <div className="text-sm text-orange-200 mt-1">نقاط الخبرة</div>
            </CardContent>
          </Card>
        </div>

        {/* Quest Type Breakdown */}
        <Card className="border-0 shadow-xl bg-gradient-to-br from-background to-muted/20">
          <CardHeader>
            <h2 className="text-2xl font-semibold leading-none tracking-tight flex items-center gap-2">
              <Trophy className="w-6 h-6 text-yellow-600" />
              التقدم حسب نوع المهمة
            </h2>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              {typeStats.map((stat) => {
                const config =
                  QUEST_TYPES[stat.type as keyof typeof QUEST_TYPES];
                return (
                  <div
                    key={stat.type}
                    className={`text-center p-4 rounded-xl ${config.color}`}
                  >
                    <div className="text-3xl mb-2">{config.icon}</div>
                    <div className="font-bold">{config.label}</div>
                    <div className="text-2xl font-bold mt-2">
                      {stat.completed}/{stat.total}
                    </div>
                    <div className="text-sm opacity-80">
                      {stat.completionRate}%
                    </div>
                    <div className="text-sm opacity-70 mt-1">
                      {stat.active} نشط
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Quest Tabs */}
        <div className="flex flex-wrap gap-2 justify-center">
          <Button
            onClick={() => setSelectedTab("active")}
            variant={selectedTab === "active" ? "default" : "outline"}
            className="flex items-center gap-2"
          >
            <Target className="w-4 h-4" />
            المهام النشطة ({questStats.active})
          </Button>

          <Button
            onClick={() => setSelectedTab("completed")}
            variant={selectedTab === "completed" ? "default" : "outline"}
            className="flex items-center gap-2"
          >
            <CheckCircle className="w-4 h-4" />
            المهام المكتملة ({questStats.completed})
          </Button>

          <Button
            onClick={() => setSelectedTab("all")}
            variant={selectedTab === "all" ? "default" : "outline"}
            className="flex items-center gap-2"
          >
            <Award className="w-4 h-4" />
            جميع المهام ({questStats.total})
          </Button>
        </div>

        {/* Featured Quests */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Daily Quests */}
          <Card className="border-0 shadow-xl bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20">
            <CardHeader>
              <h2 className="text-2xl font-semibold leading-none tracking-tight flex items-center gap-2">
                <Calendar className="w-6 h-6 text-blue-600" />
                المهام اليومية
              </h2>
            </CardHeader>
            <CardContent>
              <QuestDisplay
                variant="compact"
                questType="daily"
                maxDisplay={4}
                showCompleted={false}
              />
            </CardContent>
          </Card>

          {/* Weekly Challenges */}
          <Card className="border-0 shadow-xl bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20">
            <CardHeader>
              <h2 className="text-2xl font-semibold leading-none tracking-tight flex items-center gap-2">
                <Trophy className="w-6 h-6 text-purple-600" />
                التحديات الأسبوعية
              </h2>
            </CardHeader>
            <CardContent>
              <QuestDisplay
                variant="compact"
                questType="weekly"
                maxDisplay={4}
                showCompleted={false}
              />
            </CardContent>
          </Card>
        </div>

        {/* Special Events */}
        <Card className="border-0 shadow-xl bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-950/20 dark:to-red-950/20">
          <CardHeader>
            <h2 className="text-2xl font-semibold leading-none tracking-tight flex items-center gap-2">
              <Flame className="w-6 h-6 text-orange-600" />
              الأحداث الخاصة والمسابقات
            </h2>
          </CardHeader>
          <CardContent>
            <QuestDisplay
              variant="compact"
              questType="competition"
              maxDisplay={3}
              showCompleted={false}
            />
          </CardContent>
        </Card>

        {/* All Quests */}
        <Card className="border-0 shadow-xl bg-gradient-to-br from-background to-muted/20">
          <CardHeader>
            <h2 className="text-2xl font-semibold leading-none tracking-tight flex items-center gap-2">
              <Target className="w-6 h-6 text-blue-600" />
              {selectedTab === "active" && "المهام النشطة"}
              {selectedTab === "completed" && "المهام المكتملة"}
              {selectedTab === "all" && "جميع المهام"}
            </h2>
          </CardHeader>
          <CardContent>
            <QuestDisplay
              variant="detailed"
              questType="all"
              showCompleted={
                selectedTab === "completed" || selectedTab === "all"
              }
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
