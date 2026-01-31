"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CheckCircle, Medal } from "lucide-react";
import { memo } from "react";
import { ACHIEVEMENTS, TEXT, type Achievement } from "../dashboard-data";

function AchievementsCardComponent() {
  return (
    <Card className="border-0 shadow-xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Medal className="w-5 h-5 text-yellow-600" />
          {TEXT.achievementsTitle}
        </CardTitle>
        <CardDescription>{TEXT.achievementsDescription}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid md:grid-cols-2 gap-4">
          {ACHIEVEMENTS.map((achievement) => (
            <AchievementItem key={achievement.id} achievement={achievement} />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

// Memoized achievement item
const AchievementItem = memo(function AchievementItem({
  achievement,
}: {
  achievement: Achievement;
}) {
  return (
    <div
      className={`p-4 rounded-lg border-2 transition-all duration-200 ${
        achievement.unlocked
          ? "bg-gradient-to-br from-yellow-50 to-orange-50 border-yellow-200 shadow-lg dark:from-yellow-900/20 dark:to-orange-900/20 dark:border-yellow-700"
          : "bg-gray-50 border-gray-200 opacity-60 dark:bg-gray-800 dark:border-gray-700"
      }`}
    >
      <div className="flex items-center gap-3">
        <div
          className={`text-2xl ${achievement.unlocked ? "motion-safe:animate-bounce" : "grayscale"}`}
        >
          {achievement.icon}
        </div>
        <div className="flex-1 min-w-0">
          <h4
            className={`font-semibold ${achievement.unlocked ? "text-gray-900 dark:text-gray-100" : "text-gray-500 dark:text-gray-400"}`}
          >
            {achievement.title}
          </h4>
          <p
            className={`text-sm ${achievement.unlocked ? "text-gray-600 dark:text-gray-300" : "text-gray-400 dark:text-gray-500"}`}
          >
            {achievement.description}
          </p>
        </div>
        {achievement.unlocked && (
          <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
        )}
      </div>
    </div>
  );
});

export const AchievementsCard = memo(AchievementsCardComponent);
