"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useGamification } from "@/contexts/GamificationContext";
import {
  QUEST_DIFFICULTY,
  QUEST_TYPES,
  Quest,
  SAMPLE_QUESTS,
  calculateQuestReward,
  canCompleteQuest,
  getActiveQuests,
  getQuestProgress,
  getQuestsByType,
  getTimeRemaining,
} from "@/lib/quests";
import {
  Award,
  CheckCircle,
  Clock,
  Gift,
  Lock,
  Star,
  Target,
  Users,
  Zap,
} from "lucide-react";
import { useState } from "react";

interface QuestDisplayProps {
  variant?: "compact" | "detailed" | "dashboard";
  questType?:
    | "all"
    | "daily"
    | "weekly"
    | "learning_path"
    | "group"
    | "competition";
  maxDisplay?: number;
  showCompleted?: boolean;
}

export default function QuestDisplay({
  variant = "compact",
  questType = "all",
  maxDisplay = 6,
  showCompleted = false,
}: QuestDisplayProps) {
  const { addXP } = useGamification();
  const [quests, setQuests] = useState<Quest[]>(SAMPLE_QUESTS);
  const [selectedType, setSelectedType] = useState<string>(questType);

  // Filter quests based on type and completion status
  const filteredQuests = quests.filter((quest) => {
    const typeMatch = selectedType === "all" || quest.type === selectedType;
    const completionMatch = showCompleted || !quest.isCompleted;
    return typeMatch && completionMatch;
  });

  const activeQuests = getActiveQuests(filteredQuests);
  const displayQuests =
    variant === "compact" ? activeQuests.slice(0, maxDisplay) : filteredQuests;

  // Complete a quest
  const completeQuest = (questId: string) => {
    setQuests((prev) =>
      prev.map((quest) => {
        if (quest.id === questId && canCompleteQuest(quest)) {
          const reward = calculateQuestReward(quest);
          addXP("CHALLENGE_COMPLETED", reward);

          return {
            ...quest,
            isCompleted: true,
            currentProgress: quest.targetProgress,
          };
        }
        return quest;
      })
    );
  };

  // Claim quest rewards
  const claimRewards = (quest: Quest) => {
    if (quest.isCompleted) {
      const reward = calculateQuestReward(quest);
      addXP("CHALLENGE_COMPLETED", reward);
      alert(`تم الحصول على ${reward} نقطة خبرة!`);
    }
  };

  // Compact variant for sidebar or navigation
  if (variant === "compact") {
    return (
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-foreground flex items-center gap-2">
            <Target className="w-5 h-5 text-blue-600" />
            المهام النشطة
          </h3>
          <Badge variant="outline">{activeQuests.length}</Badge>
        </div>

        <div className="space-y-2">
          {displayQuests.map((quest) => (
            <div
              key={quest.id}
              className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg"
            >
              <div className="text-lg">{quest.icon}</div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-foreground truncate">
                  {quest.title}
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <Progress
                    value={getQuestProgress(quest)}
                    className="h-1 flex-1"
                  />
                  <span className="text-sm text-muted-foreground">
                    {quest.currentProgress}/{quest.targetProgress}
                  </span>
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant="outline" className="text-sm">
                    +{calculateQuestReward(quest)} XP
                  </Badge>
                  {quest.expiresAt && (
                    <span className="text-sm text-muted-foreground">
                      {getTimeRemaining(quest)}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {activeQuests.length === 0 && (
          <div className="text-center py-4 text-muted-foreground">
            <Target className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">لا توجد مهام نشطة</p>
          </div>
        )}
      </div>
    );
  }

  // Dashboard variant
  if (variant === "dashboard") {
    return (
      <Card className="border-0 shadow-xl bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20">
        <CardHeader>
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold leading-none tracking-tight flex items-center gap-2">
              <Target className="w-6 h-6 text-blue-600" />
              المهام اليومية
            </h2>
            <Badge className="bg-blue-600 text-white">
              {activeQuests.length} نشط
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {displayQuests.slice(0, 3).map((quest) => (
            <div
              key={quest.id}
              className={`p-4 rounded-xl border-2 ${
                quest.isCompleted
                  ? "bg-green-50 dark:bg-green-950/20 border-green-200"
                  : "bg-white/50 dark:bg-black/10 border-muted"
              }`}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="text-2xl">{quest.icon}</div>
                  <div>
                    <h3 className="font-semibold text-foreground">
                      {quest.title}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {quest.description}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Badge className={QUEST_DIFFICULTY[quest.difficulty].color}>
                    {QUEST_DIFFICULTY[quest.difficulty].label}
                  </Badge>
                  <Badge className={QUEST_TYPES[quest.type].color}>
                    {QUEST_TYPES[quest.type].label}
                  </Badge>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">التقدم</span>
                  <span className="font-medium">
                    {quest.currentProgress}/{quest.targetProgress}{" "}
                    {quest.progressUnit}
                  </span>
                </div>
                <Progress value={getQuestProgress(quest)} className="h-2" />
              </div>

              <div className="flex items-center justify-between mt-3">
                <div className="flex items-center gap-2">
                  <Award className="w-4 h-4 text-yellow-600" />
                  <span className="text-sm font-medium">
                    +{calculateQuestReward(quest)} XP
                  </span>
                  {quest.bonusRewards && quest.bonusRewards.length > 0 && (
                    <Badge variant="outline" className="text-sm">
                      +{quest.bonusRewards.length} مكافأة
                    </Badge>
                  )}
                </div>

                {quest.expiresAt && (
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Clock className="w-4 h-4" />
                    <span>{getTimeRemaining(quest)}</span>
                  </div>
                )}
              </div>

              {quest.isCompleted ? (
                <div className="flex items-center justify-center mt-3 text-green-600">
                  <CheckCircle className="w-5 h-5 mr-2" />
                  <span className="font-medium">مكتمل</span>
                </div>
              ) : canCompleteQuest(quest) && getQuestProgress(quest) >= 100 ? (
                <Button
                  onClick={() => completeQuest(quest.id)}
                  className="w-full mt-3"
                  variant="default"
                >
                  <Gift className="w-4 h-4 mr-2" />
                  استلام المكافأة
                </Button>
              ) : (
                <div className="text-center mt-3 text-muted-foreground">
                  <span className="text-sm">
                    {quest.isLocked ? "مقفل" : "في التقدم..."}
                  </span>
                </div>
              )}
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }

  // Detailed variant for dedicated quests page
  return (
    <div className="space-y-6">
      {/* Quest Type Filter */}
      <div className="flex flex-wrap gap-2">
        <Button
          onClick={() => setSelectedType("all")}
          variant={selectedType === "all" ? "default" : "outline"}
          size="sm"
          className="flex items-center gap-2"
        >
          <Target className="w-4 h-4" />
          الكل ({quests.length})
        </Button>

        {Object.entries(QUEST_TYPES).map(([type, config]) => {
          const count = getQuestsByType(quests, type as Quest["type"]).length;
          return (
            <Button
              key={type}
              onClick={() => setSelectedType(type)}
              variant={selectedType === type ? "default" : "outline"}
              size="sm"
              className="flex items-center gap-2"
            >
              <span>{config.icon}</span>
              {config.label} ({count})
            </Button>
          );
        })}
      </div>

      {/* Quest Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {displayQuests.map((quest) => (
          <Card
            key={quest.id}
            className={`border-2 shadow-lg hover:shadow-xl transition-all duration-300 ${
              quest.isCompleted
                ? "border-green-400 bg-green-50 dark:bg-green-950/20"
                : quest.isLocked
                  ? "border-muted opacity-60"
                  : "border-blue-200 hover:border-blue-400"
            }`}
          >
            <CardHeader className="pb-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl ${
                      quest.isLocked
                        ? "bg-muted"
                        : "bg-gradient-to-br from-blue-400 to-purple-500"
                    }`}
                  >
                    {quest.isLocked ? (
                      <Lock className="w-6 h-6 text-muted-foreground" />
                    ) : (
                      quest.icon
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold leading-none tracking-tight text-foreground">
                      {quest.title}
                    </h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      {quest.description}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 mt-3">
                <Badge className={QUEST_TYPES[quest.type].color}>
                  {QUEST_TYPES[quest.type].icon} {QUEST_TYPES[quest.type].label}
                </Badge>
                <Badge className={QUEST_DIFFICULTY[quest.difficulty].color}>
                  {QUEST_DIFFICULTY[quest.difficulty].icon}{" "}
                  {QUEST_DIFFICULTY[quest.difficulty].label}
                </Badge>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              {/* Progress */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">التقدم</span>
                  <span className="font-medium">
                    {quest.currentProgress}/{quest.targetProgress}{" "}
                    {quest.progressUnit}
                  </span>
                </div>
                <Progress value={getQuestProgress(quest)} size="lg" />
                <div className="text-center text-sm text-muted-foreground">
                  {Math.round(getQuestProgress(quest))}% مكتمل
                </div>
              </div>

              {/* Group Quest Info */}
              {quest.isGroupQuest && (
                <div className="p-3 bg-orange-50 dark:bg-orange-950/20 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Users className="w-4 h-4 text-orange-600" />
                    <span className="text-sm font-medium text-orange-800 dark:text-orange-200">
                      مهمة جماعية
                    </span>
                  </div>
                  <div className="text-sm text-orange-700 dark:text-orange-300">
                    {quest.participantCount} مشارك • {quest.groupProgress}/
                    {quest.groupTarget} مكتمل
                  </div>
                </div>
              )}

              {/* Time Remaining */}
              {quest.expiresAt && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="w-4 h-4" />
                  <span>ينتهي في: {getTimeRemaining(quest)}</span>
                </div>
              )}

              {/* Rewards */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Star className="w-4 h-4 text-yellow-600" />
                  <span className="text-sm font-medium">
                    +{calculateQuestReward(quest)} XP
                  </span>
                </div>

                {quest.bonusRewards && quest.bonusRewards.length > 0 && (
                  <div className="space-y-1">
                    <div className="text-sm text-muted-foreground">
                      مكافآت إضافية:
                    </div>
                    {quest.bonusRewards.map((reward, index) => (
                      <Badge
                        key={index}
                        variant="outline"
                        className="text-sm mr-1"
                      >
                        {reward}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>

              {/* Action Button */}
              {quest.isCompleted ? (
                <div className="flex items-center justify-center text-green-600">
                  <CheckCircle className="w-5 h-5 mr-2" />
                  <span className="font-medium">مكتمل</span>
                </div>
              ) : quest.isLocked ? (
                <div className="flex items-center justify-center text-muted-foreground">
                  <Lock className="w-5 h-5 mr-2" />
                  <span className="font-medium">مقفل</span>
                </div>
              ) : canCompleteQuest(quest) && getQuestProgress(quest) >= 100 ? (
                <Button
                  onClick={() => completeQuest(quest.id)}
                  className="w-full"
                  variant="default"
                >
                  <Gift className="w-4 h-4 mr-2" />
                  استلام المكافأة
                </Button>
              ) : (
                <Button variant="outline" className="w-full" disabled>
                  <Zap className="w-4 h-4 mr-2" />
                  في التقدم...
                </Button>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
