"use client";

import { useState } from "react";
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
import { motion, AnimatePresence } from "framer-motion";
import {
  Target,
  Trophy,
  Clock,
  CheckCircle,
  Gift,
  Zap,
  BookOpen,
  Brain,
  Award,
  Calendar,
  Flame,
} from "lucide-react";

interface Quest {
  id: string;
  title: string;
  description: string;
  type: "daily" | "weekly" | "achievement";
  progress: number;
  target: number;
  xpReward: number;
  completed: boolean;
  expiresAt?: Date;
  icon: string;
  difficulty: "easy" | "medium" | "hard";
}

interface QuestsPanelProps {
  className?: string;
}

export function QuestsPanel({ className }: QuestsPanelProps) {
  const [activeTab, setActiveTab] = useState<
    "daily" | "weekly" | "achievement"
  >("daily");

  // Mock quests data
  const quests: Quest[] = [
    {
      id: "1",
      title: "متعلم نشط",
      description: "أكمل 3 دروس اليوم",
      type: "daily",
      progress: 2,
      target: 3,
      xpReward: 50,
      completed: false,
      expiresAt: new Date(Date.now() + 8 * 60 * 60 * 1000), // 8 hours
      icon: "BookOpen",
      difficulty: "easy",
    },
    {
      id: "2",
      title: "خبير الاختبارات",
      description: "احصل على 90% أو أكثر في اختبار",
      type: "daily",
      progress: 0,
      target: 1,
      xpReward: 75,
      completed: false,
      expiresAt: new Date(Date.now() + 12 * 60 * 60 * 1000),
      icon: "Brain",
      difficulty: "medium",
    },
    {
      id: "3",
      title: "سلسلة التعلم",
      description: "حافظ على سلسلة 7 أيام",
      type: "weekly",
      progress: 5,
      target: 7,
      xpReward: 200,
      completed: false,
      icon: "Flame",
      difficulty: "medium",
    },
    {
      id: "4",
      title: "ماراثون الأسبوع",
      description: "أكمل 20 درساً هذا الأسبوع",
      type: "weekly",
      progress: 12,
      target: 20,
      xpReward: 300,
      completed: false,
      icon: "Target",
      difficulty: "hard",
    },
    {
      id: "5",
      title: "أول نجاح",
      description: "أكمل أول درس لك",
      type: "achievement",
      progress: 1,
      target: 1,
      xpReward: 100,
      completed: true,
      icon: "Trophy",
      difficulty: "easy",
    },
    {
      id: "6",
      title: "عالم النحو",
      description: "أكمل 50 درساً في النحو",
      type: "achievement",
      progress: 23,
      target: 50,
      xpReward: 500,
      completed: false,
      icon: "Award",
      difficulty: "hard",
    },
  ];

  const getIcon = (iconName: string) => {
    const icons = {
      BookOpen,
      Brain,
      Flame,
      Target,
      Trophy,
      Award,
    };
    return icons[iconName as keyof typeof icons] || Target;
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "easy":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case "medium":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
      case "hard":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "daily":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
      case "weekly":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200";
      case "achievement":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "daily":
        return "يومي";
      case "weekly":
        return "أسبوعي";
      case "achievement":
        return "إنجاز";
      default:
        return type;
    }
  };

  const formatTimeLeft = (expiresAt?: Date) => {
    if (!expiresAt) return "";

    const now = new Date();
    const diff = expiresAt.getTime() - now.getTime();

    if (diff <= 0) return "انتهت";

    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    if (hours > 0) {
      return `${hours}س ${minutes}د`;
    }
    return `${minutes}د`;
  };

  const filteredQuests = quests.filter((quest) => quest.type === activeTab);
  const completedQuests = filteredQuests.filter((quest) => quest.completed);
  const activeQuests = filteredQuests.filter((quest) => !quest.completed);

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Target className="h-5 w-5" />
          المهام والتحديات
        </CardTitle>
        <CardDescription>
          أكمل المهام واكسب نقاط الخبرة والمكافآت
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Tabs */}
        <div className="flex gap-1 p-1 bg-muted rounded-lg">
          {(["daily", "weekly", "achievement"] as const).map((tab) => (
            <Button
              key={tab}
              variant={activeTab === tab ? "default" : "ghost"}
              size="sm"
              className="flex-1"
              onClick={() => setActiveTab(tab)}
            >
              {tab === "daily" && <Calendar className="w-4 h-4 me-1" />}
              {tab === "weekly" && <Clock className="w-4 h-4 me-1" />}
              {tab === "achievement" && <Trophy className="w-4 h-4 me-1" />}
              {getTypeLabel(tab)}
            </Button>
          ))}
        </div>

        {/* Quest Stats */}
        <div className="grid grid-cols-3 gap-2 text-center text-sm">
          <div className="p-2 bg-muted/50 rounded">
            <div className="font-bold text-green-600">
              {completedQuests.length}
            </div>
            <div className="text-muted-foreground">مكتملة</div>
          </div>
          <div className="p-2 bg-muted/50 rounded">
            <div className="font-bold text-blue-600">{activeQuests.length}</div>
            <div className="text-muted-foreground">نشطة</div>
          </div>
          <div className="p-2 bg-muted/50 rounded">
            <div className="font-bold text-purple-600">
              {filteredQuests.reduce((sum, quest) => sum + quest.xpReward, 0)}
            </div>
            <div className="text-muted-foreground">XP متاح</div>
          </div>
        </div>

        {/* Quests List */}
        <div className="space-y-3 max-h-96 overflow-y-auto">
          <AnimatePresence>
            {filteredQuests.map((quest) => {
              const IconComponent = getIcon(quest.icon);
              const progressPercentage = (quest.progress / quest.target) * 100;

              return (
                <motion.div
                  key={quest.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className={`p-3 border rounded-lg ${
                    quest.completed
                      ? "bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800"
                      : "bg-card"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        quest.completed
                          ? "bg-green-500 text-white"
                          : "bg-primary-100 dark:bg-primary-900 text-primary-600"
                      }`}
                    >
                      {quest.completed ? (
                        <CheckCircle className="w-5 h-5" />
                      ) : (
                        <IconComponent className="w-5 h-5" />
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <h4 className="font-semibold text-sm">{quest.title}</h4>
                        <div className="flex items-center gap-1 shrink-0">
                          <Badge
                            className={getTypeColor(quest.type)}
                            variant="secondary"
                          >
                            {getTypeLabel(quest.type)}
                          </Badge>
                          <Badge
                            className={getDifficultyColor(quest.difficulty)}
                            variant="secondary"
                          >
                            {quest.difficulty === "easy"
                              ? "سهل"
                              : quest.difficulty === "medium"
                                ? "متوسط"
                                : "صعب"}
                          </Badge>
                        </div>
                      </div>

                      <p className="text-sm text-muted-foreground mb-2">
                        {quest.description}
                      </p>

                      {!quest.completed && (
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <span>
                              {quest.progress} / {quest.target}
                            </span>
                            <span className="flex items-center gap-1 text-purple-600">
                              <Zap className="w-3 h-3" />+{quest.xpReward} XP
                            </span>
                          </div>
                          <Progress
                            value={progressPercentage}
                            className="h-1.5"
                          />

                          {quest.expiresAt && (
                            <div className="flex items-center gap-1 text-sm text-orange-600">
                              <Clock className="w-3 h-3" />
                              ينتهي خلال {formatTimeLeft(quest.expiresAt)}
                            </div>
                          )}
                        </div>
                      )}

                      {quest.completed && (
                        <div className="flex items-center gap-2 text-sm text-green-600">
                          <CheckCircle className="w-3 h-3" />
                          <span>مكتمل! حصلت على +{quest.xpReward} XP</span>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        {filteredQuests.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <Target className="h-12 w-12 mx-auto mb-3 opacity-50" />
            <p>لا توجد مهام {getTypeLabel(activeTab)} حالياً</p>
            <p className="text-sm">تحقق مرة أخرى لاحقاً</p>
          </div>
        )}

        {/* Quick Actions */}
        <div className="pt-2 border-t">
          <Button variant="outline" size="sm" className="w-full">
            <Gift className="w-4 h-4 me-2" />
            عرض جميع المكافآت
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
