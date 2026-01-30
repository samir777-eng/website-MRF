"use client";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, Target } from "lucide-react";
import { memo } from "react";
import { DAILY_QUESTS, TEXT, type DailyQuest } from "../dashboard-data";

function DailyQuestsCardComponent() {
  const completedCount = DAILY_QUESTS.filter((q) => q.completed).length;

  return (
    <Card className="border-0 shadow-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white overflow-hidden relative">
      <div className="absolute top-0 start-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 ltr:-translate-x-16 rtl:translate-x-16" />
      <CardHeader>
        <CardTitle className="text-xl md:text-2xl font-bold leading-tight tracking-tight flex items-center gap-2 md:gap-3">
          <Target className="w-6 h-6 md:w-7 md:h-7" />
          {TEXT.dailyQuestsTitle}
          <Badge
            variant="secondary"
            className="bg-white/20 text-white border-white/30 text-sm md:text-base"
          >
            {completedCount}/{DAILY_QUESTS.length}
          </Badge>
        </CardTitle>
        <CardDescription className="text-emerald-100">
          {TEXT.dailyQuestsDescription}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {DAILY_QUESTS.map((quest) => (
            <QuestItem key={quest.id} quest={quest} />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

// Memoized quest item
const QuestItem = memo(function QuestItem({ quest }: { quest: DailyQuest }) {
  return (
    <div className="flex items-center justify-between p-4 bg-white/10 rounded-lg backdrop-blur-sm">
      <div className="flex items-center gap-3">
        <div
          className={`w-6 h-6 rounded-full flex items-center justify-center ${
            quest.completed ? "bg-green-400" : "bg-white/20"
          }`}
        >
          {quest.completed && (
            <CheckCircle className="w-4 h-4 text-green-800" />
          )}
        </div>
        <div>
          <h4 className="font-semibold">{quest.title}</h4>
          <p className="text-emerald-100 text-sm">{quest.reward}</p>
        </div>
      </div>
      <div className="text-start">
        <div className="text-sm font-semibold mb-1">%{quest.progress}</div>
        <Progress value={quest.progress} className="w-24 h-2 bg-white/20" />
      </div>
    </div>
  );
});

export const DailyQuestsCard = memo(DailyQuestsCardComponent);

