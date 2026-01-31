"use client";

import { ErrorBoundary } from "@/components/error-boundary";
import AchievementDisplay from "@/components/gamification/AchievementDisplay";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { useGamification } from "@/contexts/GamificationContext";
import { useCountUp } from "@/hooks/useCountUp";
import { ACHIEVEMENTS } from "@/lib/gamification";
import { Award, Clock, Sparkles, Star, Trophy, Zap } from "lucide-react";
import { useEffect, useState } from "react";

function AchievementsContent() {
  const { unlockedAchievements } = useGamification();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    return () => setIsMounted(false);
  }, []);

  const safeUnlockedAchievements = unlockedAchievements || [];

  // Statistics
  const totalAchievements = ACHIEVEMENTS.length;
  const unlockedCount = safeUnlockedAchievements.length;
  const completionRate = Math.round((unlockedCount / totalAchievements) * 100);
  const totalXP = ACHIEVEMENTS.filter((a) =>
    safeUnlockedAchievements.includes(a.id),
  ).reduce((sum, a) => sum + a.xpReward, 0);

  // Animated counters
  const animatedUnlocked = useCountUp(isMounted ? unlockedCount : 0, 800);
  const animatedXP = useCountUp(isMounted ? totalXP : 0, 1000);
  const animatedPercent = useCountUp(isMounted ? completionRate : 0, 600);

  // Get recently unlocked (mock - last 3)
  const recentlyUnlocked = ACHIEVEMENTS.filter((a) =>
    safeUnlockedAchievements.includes(a.id),
  ).slice(0, 3);

  // Get next achievements to unlock
  const nextToUnlock = ACHIEVEMENTS.filter(
    (a) => !safeUnlockedAchievements.includes(a.id),
  ).slice(0, 2);

  // Rarity distribution
  const rarityCount = {
    common: ACHIEVEMENTS.filter((a) => a.rarity === "common").length,
    rare: ACHIEVEMENTS.filter((a) => a.rarity === "rare").length,
    epic: ACHIEVEMENTS.filter((a) => a.rarity === "epic").length,
    legendary: ACHIEVEMENTS.filter((a) => a.rarity === "legendary").length,
  };

  if (!isMounted) {
    return (
      <div dir="rtl" className="min-h-screen bg-zinc-950 pb-24">
        <div className="container mx-auto px-4 py-8 max-w-5xl">
          <div className="text-center">
            <div className="w-16 h-16 bg-zinc-800 rounded-2xl mx-auto mb-4 animate-pulse" />
            <div className="h-8 bg-zinc-800 rounded w-32 mx-auto mb-2 animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      dir="rtl"
      className="min-h-screen bg-gradient-to-b from-zinc-950 via-zinc-900 to-zinc-950 pb-24"
    >
      <div className="container mx-auto px-4 py-8 max-w-5xl space-y-6">
        {/* Header */}
        <header className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 shadow-xl shadow-amber-500/30">
            <Trophy className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-1">الإنجازات</h1>
          <p className="text-zinc-400">اجمع الشارات وأثبت تميزك</p>
        </header>

        {/* Main Stats */}
        <Card className="border-0 bg-gradient-to-br from-amber-500 to-orange-600 text-white overflow-hidden">
          <CardContent className="p-6">
            <div className="grid grid-cols-3 gap-4 text-center">
              {/* Unlocked */}
              <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm">
                <Award className="w-6 h-6 mx-auto mb-2 text-yellow-300" />
                <p className="text-3xl font-bold">
                  {animatedUnlocked}/{totalAchievements}
                </p>
                <p className="text-white/70 text-xs mt-1">إنجاز مكتمل</p>
              </div>

              {/* XP Earned */}
              <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm">
                <Zap className="w-6 h-6 mx-auto mb-2 text-yellow-300" />
                <p className="text-3xl font-bold">
                  {animatedXP.toLocaleString()}
                </p>
                <p className="text-white/70 text-xs mt-1">نقاط XP</p>
              </div>

              {/* Completion */}
              <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm">
                <Star className="w-6 h-6 mx-auto mb-2 text-yellow-300" />
                <p className="text-3xl font-bold">{animatedPercent}%</p>
                <p className="text-white/70 text-xs mt-1">مكتمل</p>
              </div>
            </div>

            {/* Progress bar */}
            <div className="mt-4">
              <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                <div
                  className="h-full bg-white rounded-full transition-all duration-1000"
                  style={{ width: `${completionRate}%` }}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recently Unlocked */}
        {recentlyUnlocked.length > 0 && (
          <Card className="border-zinc-800 bg-zinc-900/50">
            <CardContent className="p-5">
              <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                <Clock className="w-5 h-5 text-amber-500" />
                <span className="text-white">آخر الإنجازات</span>
              </h2>
              <div className="flex gap-3 overflow-x-auto pb-2">
                {recentlyUnlocked.map((achievement) => (
                  <div
                    key={achievement.id}
                    className="flex-shrink-0 w-32 text-center p-3 rounded-xl bg-gradient-to-br from-amber-500/10 to-orange-500/10 border border-amber-500/20"
                  >
                    <span className="text-3xl block mb-2">
                      {achievement.icon}
                    </span>
                    <p className="text-xs font-medium text-white line-clamp-1">
                      {achievement.title}
                    </p>
                    <Badge className="mt-2 bg-amber-500/20 text-amber-400 border-amber-500/30 text-[10px]">
                      +{achievement.xpReward} XP
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Next to Unlock */}
        {nextToUnlock.length > 0 && (
          <Card className="border-zinc-800 bg-zinc-900/50">
            <CardContent className="p-5">
              <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-purple-500" />
                <span className="text-white">الإنجازات التالية</span>
              </h2>
              <div className="space-y-3">
                {nextToUnlock.map((achievement) => (
                  <div
                    key={achievement.id}
                    className="flex items-center gap-4 p-3 rounded-xl bg-zinc-800/50 border border-zinc-700/50"
                  >
                    <span className="text-3xl grayscale opacity-50">
                      {achievement.icon}
                    </span>
                    <div className="flex-1">
                      <p className="font-medium text-zinc-300">
                        {achievement.title}
                      </p>
                      <p className="text-xs text-zinc-500">
                        {achievement.description}
                      </p>
                    </div>
                    <Badge
                      variant="outline"
                      className="border-zinc-600 text-zinc-400 text-xs"
                    >
                      +{achievement.xpReward} XP
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Rarity Overview */}
        <Card className="border-zinc-800 bg-zinc-900/50">
          <CardContent className="p-5">
            <h2 className="text-lg font-bold mb-4 text-white">
              التوزيع حسب الندرة
            </h2>
            <div className="grid grid-cols-4 gap-2">
              {[
                {
                  key: "common",
                  label: "عادي",
                  color: "from-zinc-400 to-zinc-500",
                  count: rarityCount.common,
                },
                {
                  key: "rare",
                  label: "نادر",
                  color: "from-blue-400 to-blue-500",
                  count: rarityCount.rare,
                },
                {
                  key: "epic",
                  label: "ملحمي",
                  color: "from-purple-400 to-purple-500",
                  count: rarityCount.epic,
                },
                {
                  key: "legendary",
                  label: "أسطوري",
                  color: "from-amber-400 to-orange-500",
                  count: rarityCount.legendary,
                },
              ].map((rarity) => (
                <div
                  key={rarity.key}
                  className="text-center p-3 rounded-xl bg-zinc-800/50 border border-zinc-700/50"
                >
                  <div
                    className={`w-8 h-8 mx-auto rounded-full bg-gradient-to-br ${rarity.color} mb-2`}
                  />
                  <p className="text-xs text-zinc-400">{rarity.label}</p>
                  <p className="text-lg font-bold text-white">{rarity.count}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* All Achievements Gallery */}
        <Card className="border-zinc-800 bg-zinc-900/50">
          <CardContent className="p-5">
            <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
              <Trophy className="w-5 h-5 text-amber-500" />
              <span className="text-white">جميع الإنجازات</span>
            </h2>
            <AchievementDisplay
              variant="gallery"
              showProgress={true}
              showSharing={true}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default function AchievementsPage() {
  return (
    <ErrorBoundary>
      <AchievementsContent />
    </ErrorBoundary>
  );
}
