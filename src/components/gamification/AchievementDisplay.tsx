"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useGamification } from "@/contexts/GamificationContext";
import { ACHIEVEMENTS, getAchievementRarityColor } from "@/lib/gamification";
import {
  Award,
  BookOpen,
  CheckCircle,
  Crown,
  Flame,
  Lock,
  Medal,
  Share2,
  Star,
  Trophy,
  Users,
} from "lucide-react";
import { useState } from "react";

interface AchievementDisplayProps {
  variant?: "compact" | "detailed" | "gallery";
  showProgress?: boolean;
  showSharing?: boolean;
  maxDisplay?: number;
}

export default function AchievementDisplay({
  variant = "compact",
  showProgress = true,
  showSharing = true,
  maxDisplay = 6,
}: AchievementDisplayProps) {
  const { userStats, unlockedAchievements } = useGamification();
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [showShareModal, setShowShareModal] = useState<string | null>(null);

  // Filter achievements by category
  const filteredAchievements = ACHIEVEMENTS.filter(
    (achievement) =>
      selectedCategory === "all" || achievement.category === selectedCategory
  );

  // Separate unlocked and locked achievements
  const unlockedAchievementsList = filteredAchievements.filter((achievement) =>
    unlockedAchievements.includes(achievement.id)
  );

  const lockedAchievements = filteredAchievements.filter(
    (achievement) => !unlockedAchievements.includes(achievement.id)
  );

  // Get category icon
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "learning":
        return <BookOpen className="w-4 h-4" />;
      case "streak":
        return <Flame className="w-4 h-4" />;
      case "social":
        return <Users className="w-4 h-4" />;
      case "mastery":
        return <Crown className="w-4 h-4" />;
      case "special":
        return <Star className="w-4 h-4" />;
      default:
        return <Award className="w-4 h-4" />;
    }
  };

  // Get rarity icon
  const getRarityIcon = (rarity: string) => {
    switch (rarity) {
      case "common":
        return <Medal className="w-4 h-4" />;
      case "rare":
        return <Trophy className="w-4 h-4" />;
      case "epic":
        return <Crown className="w-4 h-4" />;
      case "legendary":
        return <Star className="w-4 h-4" />;
      default:
        return <Award className="w-4 h-4" />;
    }
  };

  // Share achievement
  const shareAchievement = (achievement: any) => {
    const shareText = `🎉 لقد حصلت على إنجاز "${achievement.title}" في منصة الأستاذ رضا الفاروق! ${achievement.description}`;

    if (navigator.share) {
      navigator.share({
        title: "إنجاز جديد!",
        text: shareText,
        url: window.location.origin,
      });
    } else {
      // Fallback to copying to clipboard
      navigator.clipboard.writeText(shareText);
      alert("تم نسخ الإنجاز للمشاركة!");
    }
    setShowShareModal(null);
  };

  // Compact variant for navigation or sidebar
  if (variant === "compact") {
    const recentAchievements = unlockedAchievementsList.slice(0, maxDisplay);

    return (
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-foreground flex items-center gap-2">
            <Trophy className="w-5 h-5 text-yellow-600" />
            الإنجازات
          </h3>
          <Badge variant="outline">
            {unlockedAchievements.length}/{ACHIEVEMENTS.length}
          </Badge>
        </div>

        <div className="grid grid-cols-2 gap-2">
          {recentAchievements.map((achievement) => (
            <div
              key={achievement.id}
              className="flex items-center gap-2 p-2 bg-muted/30 rounded-lg"
            >
              <div className="text-lg">{achievement.icon}</div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-foreground truncate">
                  {achievement.title}
                </div>
                <div className="text-sm text-muted-foreground">
                  +{achievement.xpReward} XP
                </div>
              </div>
            </div>
          ))}
        </div>

        {unlockedAchievements.length === 0 && (
          <div className="text-center py-4 text-muted-foreground">
            <Lock className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">لم تحصل على أي إنجازات بعد</p>
          </div>
        )}
      </div>
    );
  }

  // Gallery variant for achievements page
  if (variant === "gallery") {
    return (
      <div className="space-y-6">
        {/* Category Filter */}
        <div className="flex flex-wrap gap-2">
          <Button
            onClick={() => setSelectedCategory("all")}
            variant={selectedCategory === "all" ? "default" : "outline"}
            size="sm"
            className="flex items-center gap-2"
          >
            <Award className="w-4 h-4" />
            الكل ({ACHIEVEMENTS.length})
          </Button>

          {["learning", "streak", "social", "mastery", "special"].map(
            (category) => {
              const count = ACHIEVEMENTS.filter(
                (a) => a.category === category
              ).length;
              const categoryNames = {
                learning: "التعلم",
                streak: "السلاسل",
                social: "اجتماعي",
                mastery: "الإتقان",
                special: "خاص",
              };

              return (
                <Button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  variant={
                    selectedCategory === category ? "default" : "outline"
                  }
                  size="sm"
                  className="flex items-center gap-2"
                >
                  {getCategoryIcon(category)}
                  {categoryNames[category as keyof typeof categoryNames]} (
                  {count})
                </Button>
              );
            }
          )}
        </div>

        {/* Achievement Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Unlocked Achievements */}
          {unlockedAchievementsList.map((achievement) => (
            <Card
              key={achievement.id}
              className={`border-2 shadow-lg hover:shadow-xl transition-all duration-300 ${getAchievementRarityColor(achievement.rarity)} border-current`}
            >
              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-3 text-3xl shadow-lg">
                  {achievement.icon}
                </div>
                <CardTitle className="text-lg text-foreground">
                  {achievement.title}
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  {achievement.description}
                </p>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Badge
                    className={getAchievementRarityColor(achievement.rarity)}
                  >
                    {getRarityIcon(achievement.rarity)}
                    <span className="mr-1">{achievement.rarity}</span>
                  </Badge>
                  <Badge variant="outline">+{achievement.xpReward} XP</Badge>
                </div>

                <div className="flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                  <span className="text-sm font-medium text-green-600">
                    مكتمل
                  </span>
                </div>

                {showSharing && (
                  <Button
                    onClick={() => shareAchievement(achievement)}
                    variant="outline"
                    size="sm"
                    className="w-full"
                  >
                    <Share2 className="w-4 h-4 mr-2" />
                    مشاركة
                  </Button>
                )}
              </CardContent>
            </Card>
          ))}

          {/* Locked Achievements */}
          {lockedAchievements.map((achievement) => (
            <Card
              key={achievement.id}
              className="border-2 border-muted shadow-lg opacity-60 hover:opacity-80 transition-opacity duration-300"
            >
              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-3 text-3xl">
                  <Lock className="w-8 h-8 text-muted-foreground" />
                </div>
                <CardTitle className="text-lg text-muted-foreground">
                  {achievement.title}
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  {achievement.description}
                </p>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Badge variant="outline" className="opacity-60">
                    {getRarityIcon(achievement.rarity)}
                    <span className="mr-1">{achievement.rarity}</span>
                  </Badge>
                  <Badge variant="outline" className="opacity-60">
                    +{achievement.xpReward} XP
                  </Badge>
                </div>

                {showProgress && (
                  <div className="space-y-2">
                    <div className="text-sm text-muted-foreground">التقدم:</div>
                    <Progress
                      value={getAchievementProgress(achievement, userStats)}
                      className="h-2"
                    />
                    <div className="text-sm text-muted-foreground text-center">
                      {getProgressText(achievement, userStats)}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  // Detailed variant for dashboard
  return (
    <Card className="border-0 shadow-xl bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-950/20 dark:to-orange-950/20">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Trophy className="w-6 h-6 text-yellow-600" />
            الإنجازات
          </CardTitle>
          <Badge className="bg-yellow-600 text-white">
            {unlockedAchievements.length}/{ACHIEVEMENTS.length}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Progress Overview */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">التقدم الإجمالي</span>
            <span className="font-medium">
              {Math.round(
                (unlockedAchievements.length / ACHIEVEMENTS.length) * 100
              )}
              %
            </span>
          </div>
          <Progress
            value={(unlockedAchievements.length / ACHIEVEMENTS.length) * 100}
            size="lg"
          />
        </div>

        {/* Recent Achievements */}
        <div className="space-y-3">
          <h4 className="font-semibold text-foreground">الإنجازات الأخيرة</h4>

          {unlockedAchievementsList.slice(0, 3).map((achievement) => (
            <div
              key={achievement.id}
              className="flex items-center gap-3 p-3 bg-white/50 dark:bg-black/10 rounded-xl"
            >
              <div className="text-2xl">{achievement.icon}</div>
              <div className="flex-1">
                <div className="font-medium text-foreground">
                  {achievement.title}
                </div>
                <div className="text-sm text-muted-foreground">
                  {achievement.description}
                </div>
              </div>
              <Badge className={getAchievementRarityColor(achievement.rarity)}>
                +{achievement.xpReward} XP
              </Badge>
            </div>
          ))}

          {unlockedAchievements.length === 0 && (
            <div className="text-center py-6 text-muted-foreground">
              <Lock className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>ابدأ رحلتك التعليمية لتحصل على إنجازاتك الأولى!</p>
            </div>
          )}
        </div>

        {/* Next Achievement */}
        {lockedAchievements.length > 0 && (
          <div className="space-y-3">
            <h4 className="font-semibold text-foreground">الإنجاز التالي</h4>

            {lockedAchievements.slice(0, 1).map((achievement) => (
              <div
                key={achievement.id}
                className="flex items-center gap-3 p-3 bg-muted/30 rounded-xl border-2 border-dashed border-muted-foreground/30"
              >
                <div className="text-2xl opacity-50">
                  <Lock className="w-8 h-8 text-muted-foreground" />
                </div>
                <div className="flex-1">
                  <div className="font-medium text-muted-foreground">
                    {achievement.title}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {achievement.description}
                  </div>
                  {showProgress && (
                    <div className="mt-2 space-y-1">
                      <Progress
                        value={getAchievementProgress(achievement, userStats)}
                        className="h-2"
                      />
                      <div className="text-sm text-muted-foreground">
                        {getProgressText(achievement, userStats)}
                      </div>
                    </div>
                  )}
                </div>
                <Badge variant="outline" className="opacity-60">
                  +{achievement.xpReward} XP
                </Badge>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// Helper functions for achievement progress
function getAchievementProgress(achievement: any, userStats: any): number {
  // This would calculate actual progress based on achievement conditions
  // For now, return mock progress
  if (achievement.id === "first_lesson") {
    return Math.min(100, (userStats.lessonsCompleted / 1) * 100);
  }
  if (achievement.id === "week_streak") {
    return Math.min(100, (userStats.currentStreak / 7) * 100);
  }
  if (achievement.id === "quiz_master") {
    return Math.min(100, (userStats.quizzesTaken / 100) * 100);
  }
  return Math.random() * 60; // Mock progress
}

function getProgressText(achievement: any, userStats: any): string {
  if (achievement.id === "first_lesson") {
    return `${userStats.lessonsCompleted}/1 درس`;
  }
  if (achievement.id === "week_streak") {
    return `${userStats.currentStreak}/7 أيام`;
  }
  if (achievement.id === "quiz_master") {
    return `${userStats.quizzesTaken}/100 اختبار`;
  }
  return "قريباً...";
}
