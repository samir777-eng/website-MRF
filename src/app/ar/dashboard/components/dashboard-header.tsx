"use client";

import { Crown, Flame, Sparkles, Star, Trophy } from "lucide-react";
import { memo } from "react";
import { TEXT } from "../dashboard-data";

interface DashboardHeaderProps {
  currentLevel: number;
  totalXP: number;
  currentStreak: number;
}

function DashboardHeaderComponent({
  currentLevel,
  totalXP,
  currentStreak,
}: DashboardHeaderProps) {
  return (
    <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700 shadow-lg">
      <div className="max-w-7xl mx-auto px-6 md:px-8 py-6 md:py-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4 md:gap-6">
            <div className="relative">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                أ
              </div>
              <div className="absolute -bottom-1 -left-1 w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center">
                <Crown className="w-3 h-3 text-yellow-800" />
              </div>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                {TEXT.greeting}
                <span className="motion-safe:animate-bounce">👋</span>
              </h1>
              <p className="text-gray-600 dark:text-gray-300 mt-1 flex items-center gap-2">
                <Sparkles className="w-4 h-4" />
                {TEXT.greetingSubtitle}
              </p>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-4">
            <StatBadge
              icon={<Trophy className="w-4 h-4" />}
              label={`المستوى ${currentLevel}`}
              gradient="from-yellow-400 to-orange-500"
            />
            <StatBadge
              icon={<Star className="w-4 h-4" />}
              label={`${totalXP.toLocaleString()} نقطة`}
              gradient="from-purple-500 to-pink-500"
            />
            <StatBadge
              icon={<Flame className="w-4 h-4" />}
              label={`سلسلة ${currentStreak} أيام`}
              gradient="from-orange-500 to-red-500"
              animate
            />
          </div>
        </div>
      </div>
    </div>
  );
}

// Memoized stat badge sub-component
interface StatBadgeProps {
  icon: React.ReactNode;
  label: string;
  gradient: string;
  animate?: boolean;
}

const StatBadge = memo(function StatBadge({
  icon,
  label,
  gradient,
  animate,
}: StatBadgeProps) {
  return (
    <div
      className={`flex items-center gap-2 bg-gradient-to-r ${gradient} text-white px-4 py-2 rounded-full shadow-lg ${animate ? "motion-safe:animate-pulse" : ""}`}
    >
      {icon}
      <span className="font-bold">{label}</span>
    </div>
  );
});

export const DashboardHeader = memo(DashboardHeaderComponent);

