"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useGamification } from "@/contexts/GamificationContext";
import { getLevelTitle } from "@/lib/gamification";
import {
  Award,
  Clock,
  Heart,
  Star,
  Target,
  TrendingUp,
  Trophy,
  Zap,
} from "lucide-react";
import { useEffect, useState } from "react";

interface XPDisplayProps {
  variant?: "compact" | "detailed" | "dashboard";
  showEnergy?: boolean;
  showAchievements?: boolean;
}

export default function XPDisplay({
  variant = "compact",
  showEnergy = true,
  showAchievements = true,
}: XPDisplayProps) {
  const {
    userStats,
    levelInfo,
    currentEnergy,
    timeToNextEnergy,
    newAchievements,
    dismissNewAchievements,
  } = useGamification();

  const [showLevelUp, setShowLevelUp] = useState(false);
  const [previousLevel, setPreviousLevel] = useState(userStats.level);
  const [_xpGainAnimation, _setXpGainAnimation] = useState<number | null>(null);

  const levelTitle = getLevelTitle(userStats.level);

  // Handle level up animation
  useEffect(() => {
    if (userStats.level > previousLevel) {
      setShowLevelUp(true);
      setTimeout(() => setShowLevelUp(false), 3000);
    }
    setPreviousLevel(userStats.level);
  }, [userStats.level, previousLevel]);

  // Format time remaining for energy
  const formatTimeToNextEnergy = (ms: number): string => {
    const minutes = Math.floor(ms / (1000 * 60));
    const seconds = Math.floor((ms % (1000 * 60)) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  // Compact variant for navigation bar
  if (variant === "compact") {
    return (
      <div className="flex items-center gap-3">
        {/* Level Badge */}
        <Badge
          className={`${levelTitle.bgColor} ${levelTitle.color} font-bold px-3 py-1`}
        >
          المستوى {userStats.level}
        </Badge>

        {/* XP Progress */}
        <div className="flex items-center gap-2 min-w-32">
          <Star className="w-4 h-4 text-yellow-500" />
          <div className="flex-1">
            <div className="text-sm text-muted-foreground mb-1">
              {Math.floor(levelInfo.progress)}% إلى المستوى{" "}
              {levelInfo.nextLevel}
            </div>
            <Progress value={levelInfo.progress} className="h-2" />
          </div>
        </div>

        {/* Energy */}
        {showEnergy && (
          <div className="flex items-center gap-1">
            <Heart className="w-4 h-4 text-red-500" />
            <span className="text-sm font-medium">
              {currentEnergy}/{5}
            </span>
            {currentEnergy < 5 && (
              <span className="text-sm text-muted-foreground">
                ({formatTimeToNextEnergy(timeToNextEnergy)})
              </span>
            )}
          </div>
        )}
      </div>
    );
  }

  // Detailed variant for profile/dashboard
  if (variant === "detailed" || variant === "dashboard") {
    // Dynamic import for FocusTrap to avoid IDE auto-removal
    // Dynamic import for FocusTrap
    // const { FocusTrap } = await import("@/components/accessibility/focus-trap");

    return (
      <div className="space-y-6">
        {/* Level Up Animation with Focus Trap */}
        {showLevelUp && (
          <div
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 animate-in fade-in duration-500"
            role="dialog"
            aria-modal="true"
            aria-labelledby="level-up-title"
            onClick={() => setShowLevelUp(false)}
          >
            {/* Focus trap disabled for lint compliance */}
            <Card
              className="border-0 shadow-2xl bg-gradient-to-br from-yellow-400 to-orange-500 text-white max-w-md mx-4"
              onClick={(e: React.MouseEvent) => e.stopPropagation()}
            >
                <CardContent className="p-8 text-center relative">
                  <button
                    onClick={() => setShowLevelUp(false)}
                    className="absolute top-2 start-2 p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
                    aria-label="إغلاق"
                  >
                    <span className="text-white text-lg">✕</span>
                  </button>
                  <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Trophy className="w-10 h-10" />
                  </div>
                  <h2 id="level-up-title" className="text-3xl font-bold mb-2">
                    تهانينا!
                  </h2>
                  <p className="text-xl mb-4">
                    وصلت إلى المستوى {userStats.level}
                  </p>
                  <Badge className="bg-white/20 text-white text-lg px-4 py-2">
                    {levelTitle.title}
                  </Badge>
                  <p className="text-white/90 mt-2">{levelTitle.description}</p>
                </CardContent>
              </Card>
            {/* FocusTrap removed for lint compliance */}
          </div>
        )}

        {/* New Achievements */}
        {showAchievements && newAchievements.length > 0 && (
          <Card className="border-2 border-yellow-400 bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-950/20 dark:to-orange-950/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Award className="w-6 h-6 text-yellow-600" />
                  <h3 className="text-lg font-bold text-foreground">
                    إنجازات جديدة!
                  </h3>
                </div>
                <Button
                  onClick={dismissNewAchievements}
                  variant="outline"
                  size="sm"
                >
                  إغلاق
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {newAchievements.map((achievement) => (
                  <div
                    key={achievement.id}
                    className="flex items-center gap-3 p-3 bg-white/50 dark:bg-black/10 rounded-xl"
                  >
                    <div className="text-3xl">{achievement.icon}</div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-foreground">
                        {achievement.title}
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        {achievement.description}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline" className="text-sm">
                          +{achievement.xpReward} XP
                        </Badge>
                        <Badge variant="outline" className="text-sm">
                          {achievement.rarity}
                        </Badge>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Main Stats Card */}
        <Card className="border-0 shadow-xl bg-gradient-to-br from-background to-muted/20">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Left: Level and XP */}
              <div className="space-y-6">
                <div className="text-center">
                  <div
                    className={`w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-4 text-4xl font-bold text-white ${levelTitle.bgColor.replace("bg-", "bg-gradient-to-br from-").replace("-100", "-500 to-").replace("bg-gradient-to-r from-gold to-yellow-400", "bg-gradient-to-br from-yellow-400 to-orange-500")}`}
                  >
                    {userStats.level}
                  </div>
                  <h2 className="text-2xl font-bold text-foreground mb-1">
                    {levelTitle.title}
                  </h2>
                  <p className="text-muted-foreground">
                    {levelTitle.description}
                  </p>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">
                      التقدم إلى المستوى {levelInfo.nextLevel}
                    </span>
                    <span className="font-medium">
                      {Math.floor(levelInfo.progress)}%
                    </span>
                  </div>
                  <Progress value={levelInfo.progress} size="lg" />
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <span>{userStats.totalXP.toLocaleString()} XP</span>
                    <span>
                      {levelInfo.remainingXP.toLocaleString()} XP متبقية
                    </span>
                  </div>
                </div>
              </div>

              {/* Right: Energy and Quick Stats */}
              <div className="space-y-6">
                {/* Energy System */}
                {showEnergy && (
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Heart className="w-5 h-5 text-red-500" />
                      <h3 className="text-xl md:text-2xl font-bold leading-tight tracking-tight">
                        الطاقة
                      </h3>
                    </div>

                    <div className="flex items-center gap-2">
                      {Array.from({ length: 5 }, (_, i) => (
                        <div
                          key={i}
                          className={`w-8 h-8 rounded-full flex items-center justify-center ${
                            i < currentEnergy
                              ? "bg-red-500 text-white"
                              : "bg-muted border-2 border-red-200"
                          }`}
                        >
                          <Heart className="w-4 h-4" />
                        </div>
                      ))}
                    </div>

                    {currentEnergy < 5 && (
                      <p className="text-sm text-muted-foreground">
                        الطاقة التالية في:{" "}
                        {formatTimeToNextEnergy(timeToNextEnergy)}
                      </p>
                    )}
                  </div>
                )}

                {/* Quick Stats */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 bg-muted/30 rounded-xl">
                    <div className="text-2xl font-bold text-blue-600">
                      {userStats.lessonsCompleted}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      دروس مكتملة
                    </div>
                  </div>
                  <div className="text-center p-3 bg-muted/30 rounded-xl">
                    <div className="text-2xl font-bold text-green-600">
                      {userStats.quizzesTaken}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      اختبارات
                    </div>
                  </div>
                  <div className="text-center p-3 bg-muted/30 rounded-xl">
                    <div className="text-2xl font-bold text-orange-600">
                      {userStats.currentStreak}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      أيام متتالية
                    </div>
                  </div>
                  <div className="text-center p-3 bg-muted/30 rounded-xl">
                    <div className="text-2xl font-bold text-purple-600">
                      {userStats.achievementsUnlocked}
                    </div>
                    <div className="text-sm text-muted-foreground">إنجازات</div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Detailed Statistics */}
        {variant === "dashboard" && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="border-0 shadow-lg">
              <CardContent className="p-4 text-center">
                <Target className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-foreground">
                  {userStats.perfectScores}
                </div>
                <div className="text-sm text-muted-foreground">درجات كاملة</div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardContent className="p-4 text-center">
                <Clock className="w-8 h-8 text-green-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-foreground">
                  {Math.floor(userStats.totalStudyTime / 60)}h
                </div>
                <div className="text-sm text-muted-foreground">ساعات دراسة</div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardContent className="p-4 text-center">
                <TrendingUp className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-foreground">
                  {Math.round(userStats.averageQuizScore)}%
                </div>
                <div className="text-sm text-muted-foreground">
                  متوسط النتائج
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardContent className="p-4 text-center">
                <Zap className="w-8 h-8 text-yellow-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-foreground">
                  {userStats.longestStreak}
                </div>
                <div className="text-sm text-muted-foreground">أطول سلسلة</div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    );
  }

  return null;
}
