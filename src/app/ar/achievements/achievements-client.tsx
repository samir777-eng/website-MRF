"use client";

/**
 * Enhanced Achievements Page - Phase 2 Task 2.1
 * Improved achievement display with filters, progress, and animations
 */

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2, Clock, Lock, Star, Trophy, Zap } from "lucide-react";
import { useState } from "react";

// ============================================================================
// TYPES
// ============================================================================

type AchievementRarity = "common" | "rare" | "epic" | "legendary";
type AchievementFilter = "all" | "unlocked" | "locked" | "recent";

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  rarity: AchievementRarity;
  xpReward: number;
  unlocked: boolean;
  unlockedAt?: Date;
  progress?: number;
  requirement?: number;
  category: string;
}

// ============================================================================
// MOCK DATA
// ============================================================================

const mockAchievements: Achievement[] = [
  {
    id: "first-lesson",
    title: "أول خطوة",
    description: "أكمل أول درس لك",
    icon: "🎯",
    rarity: "common",
    xpReward: 50,
    unlocked: true,
    unlockedAt: new Date(2024, 0, 15),
    category: "الدروس",
  },
  {
    id: "week-streak",
    title: "أسبوع متواصل",
    description: "حافظ على سلسلة 7 أيام",
    icon: "🔥",
    rarity: "rare",
    xpReward: 150,
    unlocked: true,
    unlockedAt: new Date(2024, 0, 20),
    category: "السلسلة",
  },
  {
    id: "perfect-score",
    title: "المتفوق",
    description: "احصل على 100% في اختبار",
    icon: "⭐",
    rarity: "epic",
    xpReward: 200,
    unlocked: true,
    unlockedAt: new Date(2024, 0, 18),
    category: "الاختبارات",
  },
  {
    id: "master",
    title: "الأستاذ",
    description: "أكمل 100 درس",
    icon: "👑",
    rarity: "legendary",
    xpReward: 500,
    unlocked: false,
    progress: 42,
    requirement: 100,
    category: "الدروس",
  },
  {
    id: "speed-demon",
    title: "البرق",
    description: "أكمل درساً في أقل من 10 دقائق",
    icon: "⚡",
    rarity: "rare",
    xpReward: 100,
    unlocked: false,
    progress: 0,
    requirement: 1,
    category: "السرعة",
  },
  {
    id: "night-owl",
    title: "بومة الليل",
    description: "أكمل درساً بعد منتصف الليل",
    icon: "🦉",
    rarity: "common",
    xpReward: 50,
    unlocked: false,
    progress: 0,
    requirement: 1,
    category: "خاص",
  },
  {
    id: "quiz-master",
    title: "سيد الاختبارات",
    description: "اجتاز 50 اختبار",
    icon: "📝",
    rarity: "epic",
    xpReward: 300,
    unlocked: false,
    progress: 23,
    requirement: 50,
    category: "الاختبارات",
  },
  {
    id: "social-butterfly",
    title: "النجم الاجتماعي",
    description: "ساعد 10 زملاء في الأسئلة",
    icon: "🤝",
    rarity: "rare",
    xpReward: 150,
    unlocked: false,
    progress: 4,
    requirement: 10,
    category: "اجتماعي",
  },
];

const achievementStats = {
  total: mockAchievements.length,
  unlocked: mockAchievements.filter((a) => a.unlocked).length,
  totalXP: mockAchievements
    .filter((a) => a.unlocked)
    .reduce((sum, a) => sum + a.xpReward, 0),
};

// ============================================================================
// ACHIEVEMENTS CLIENT COMPONENT
// ============================================================================

export function AchievementsClient() {
  const [filter, setFilter] = useState<AchievementFilter>("all");
  const [selectedRarity, setSelectedRarity] = useState<
    AchievementRarity | "all"
  >("all");

  // Filter achievements
  const filteredAchievements = mockAchievements.filter((achievement) => {
    // Filter by status
    if (filter === "unlocked" && !achievement.unlocked) return false;
    if (filter === "locked" && achievement.unlocked) return false;
    if (
      filter === "recent" &&
      (!achievement.unlocked || !achievement.unlockedAt)
    )
      return false;

    // Filter by rarity
    if (selectedRarity !== "all" && achievement.rarity !== selectedRarity)
      return false;

    return true;
  });

  // Sort recent by date
  const sortedAchievements =
    filter === "recent"
      ? [...filteredAchievements].sort((a, b) => {
          const dateA = a.unlockedAt?.getTime() || 0;
          const dateB = b.unlockedAt?.getTime() || 0;
          return dateB - dateA;
        })
      : filteredAchievements;

  const completionRate = Math.round(
    (achievementStats.unlocked / achievementStats.total) * 100,
  );

  return (
    <div className="max-w-5xl mx-auto space-y-6 p-4 md:p-6" dir="rtl">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="flex items-center justify-center gap-3">
          <Trophy className="w-8 h-8 text-amber-500 fill-amber-500" />
          <h1 className="text-3xl md:text-4xl font-bold text-foreground">
            الإنجازات
          </h1>
          <Trophy className="w-8 h-8 text-amber-500 fill-amber-500" />
        </div>
        <p className="text-muted-foreground">اجمع الشارات وأثبت تميزك</p>
      </div>

      {/* Stats Card */}
      <Card className="border-0 bg-gradient-to-br from-amber-500 to-orange-600 text-white shadow-2xl">
        <CardContent className="p-6">
          <div className="grid grid-cols-3 gap-4 text-center mb-4">
            <StatsItem
              icon={<CheckCircle2 className="w-6 h-6" />}
              value={`${achievementStats.unlocked}/${achievementStats.total}`}
              label="إنجاز مكتمل"
            />
            <StatsItem
              icon={<Star className="w-6 h-6" />}
              value={`${completionRate}%`}
              label="مكتمل"
            />
            <StatsItem
              icon={<Zap className="w-6 h-6" />}
              value={achievementStats.totalXP.toLocaleString()}
              label="نقاط XP"
            />
          </div>

          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm text-white/90">
              <span>التقدم الإجمالي</span>
              <span>
                {achievementStats.unlocked} من {achievementStats.total}
              </span>
            </div>
            <Progress value={completionRate} className="h-3 bg-white/20" />
          </div>
        </CardContent>
      </Card>

      {/* Filters */}
      <Card className="glass border-border/50">
        <CardContent className="p-4">
          <Tabs
            value={filter}
            onValueChange={(v: string) => setFilter(v as AchievementFilter)}
          >
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="all">الكل</TabsTrigger>
              <TabsTrigger value="unlocked">مفتوح</TabsTrigger>
              <TabsTrigger value="locked">مقفل</TabsTrigger>
              <TabsTrigger value="recent">الأخيرة</TabsTrigger>
            </TabsList>
          </Tabs>

          {/* Rarity Filter */}
          <div className="mt-4 flex flex-wrap gap-2">
            <Button
              size="sm"
              variant={selectedRarity === "all" ? "default" : "outline"}
              onClick={() => setSelectedRarity("all")}
              className="text-xs"
            >
              كل الندرة
            </Button>
            <RarityFilterButton
              rarity="common"
              label="عادي"
              selected={selectedRarity === "common"}
              onClick={() => setSelectedRarity("common")}
            />
            <RarityFilterButton
              rarity="rare"
              label="نادر"
              selected={selectedRarity === "rare"}
              onClick={() => setSelectedRarity("rare")}
            />
            <RarityFilterButton
              rarity="epic"
              label="ملحمي"
              selected={selectedRarity === "epic"}
              onClick={() => setSelectedRarity("epic")}
            />
            <RarityFilterButton
              rarity="legendary"
              label="أسطوري"
              selected={selectedRarity === "legendary"}
              onClick={() => setSelectedRarity("legendary")}
            />
          </div>
        </CardContent>
      </Card>

      {/* Achievements Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <AnimatePresence mode="popLayout">
          {sortedAchievements.map((achievement) => (
            <AchievementCard key={achievement.id} achievement={achievement} />
          ))}
        </AnimatePresence>
      </div>

      {/* Empty State */}
      {sortedAchievements.length === 0 && (
        <Card className="glass border-border/50">
          <CardContent className="p-12 text-center">
            <div className="text-6xl mb-4">🏆</div>
            <h3 className="text-xl font-bold text-foreground mb-2">
              لا توجد إنجازات
            </h3>
            <p className="text-muted-foreground">جرب فلتر مختلف</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

// ============================================================================
// HELPER COMPONENTS
// ============================================================================

function StatsItem({
  icon,
  value,
  label,
}: {
  icon: React.ReactNode;
  value: string;
  label: string;
}) {
  return (
    <div className="bg-white/10 rounded-xl p-3 backdrop-blur-sm">
      <div className="flex justify-center mb-2 text-yellow-300">{icon}</div>
      <div className="text-2xl font-bold mb-1">{value}</div>
      <div className="text-xs text-white/80">{label}</div>
    </div>
  );
}

function RarityFilterButton({
  rarity,
  label,
  selected,
  onClick,
}: {
  rarity: AchievementRarity;
  label: string;
  selected: boolean;
  onClick: () => void;
}) {
  const colors = {
    common: "border-zinc-500 text-zinc-500 hover:bg-zinc-500/10",
    rare: "border-blue-500 text-blue-500 hover:bg-blue-500/10",
    epic: "border-purple-500 text-purple-500 hover:bg-purple-500/10",
    legendary: "border-amber-500 text-amber-500 hover:bg-amber-500/10",
  };

  return (
    <Button
      size="sm"
      variant="outline"
      className={cn(
        "text-xs",
        colors[rarity],
        selected && "ring-2 ring-offset-2",
      )}
      onClick={onClick}
    >
      {label}
    </Button>
  );
}

function AchievementCard({ achievement }: { achievement: Achievement }) {
  const rarityColors = {
    common: {
      border: "border-zinc-500/50",
      bg: "from-zinc-500/10 to-zinc-600/10",
      icon: "text-zinc-400",
      badge: "bg-zinc-500/20 text-zinc-400 border-zinc-500/30",
    },
    rare: {
      border: "border-blue-500/50",
      bg: "from-blue-500/10 to-blue-600/10",
      icon: "text-blue-400",
      badge: "bg-blue-500/20 text-blue-400 border-blue-500/30",
    },
    epic: {
      border: "border-purple-500/50",
      bg: "from-purple-500/10 to-purple-600/10",
      icon: "text-purple-400",
      badge: "bg-purple-500/20 text-purple-400 border-purple-500/30",
    },
    legendary: {
      border: "border-amber-500/50",
      bg: "from-amber-500/10 to-orange-600/10",
      icon: "text-amber-400",
      badge: "bg-amber-500/20 text-amber-400 border-amber-500/30",
    },
  };

  const colors = rarityColors[achievement.rarity];

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
    >
      <Card
        className={cn(
          "relative overflow-hidden border-2 transition-all",
          colors.border,
          achievement.unlocked ? "bg-card" : "bg-muted/30",
        )}
      >
        {/* Gradient Background */}
        <div
          className={cn(
            "absolute inset-0 opacity-50 bg-gradient-to-br",
            colors.bg,
          )}
        />

        <CardContent className="relative p-5 space-y-4">
          {/* Icon & Lock Status */}
          <div className="flex items-start justify-between">
            <motion.div
              animate={
                achievement.unlocked
                  ? { rotate: [0, 10, -10, 0] }
                  : { scale: 1 }
              }
              transition={{
                duration: 2,
                repeat: achievement.unlocked ? Infinity : 0,
              }}
              className={cn(
                "text-5xl",
                !achievement.unlocked && "grayscale opacity-40",
              )}
            >
              {achievement.icon}
            </motion.div>

            {achievement.unlocked ? (
              <CheckCircle2 className="w-6 h-6 text-success-500 fill-success-500" />
            ) : (
              <Lock className="w-5 h-5 text-muted-foreground" />
            )}
          </div>

          {/* Title & Description */}
          <div>
            <h3
              className={cn(
                "font-bold text-lg mb-1",
                achievement.unlocked ? colors.icon : "text-muted-foreground",
              )}
            >
              {achievement.title}
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {achievement.description}
            </p>
          </div>

          {/* Progress Bar (for locked achievements) */}
          {!achievement.unlocked &&
            achievement.progress !== undefined &&
            achievement.requirement && (
              <div className="space-y-1">
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>التقدم</span>
                  <span>
                    {achievement.progress} / {achievement.requirement}
                  </span>
                </div>
                <Progress
                  value={(achievement.progress / achievement.requirement) * 100}
                  className="h-2"
                />
              </div>
            )}

          {/* Footer */}
          <div className="flex items-center justify-between pt-2 border-t border-border/50">
            <Badge className={cn("text-xs font-bold", colors.badge)}>
              +{achievement.xpReward} XP
            </Badge>

            <Badge variant="outline" className="text-xs">
              {achievement.category}
            </Badge>
          </div>

          {/* Unlocked Date */}
          {achievement.unlocked && achievement.unlockedAt && (
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Clock className="w-3 h-3" />
              <span>
                {achievement.unlockedAt.toLocaleDateString("ar-EG", {
                  month: "short",
                  day: "numeric",
                })}
              </span>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}

export default AchievementsClient;
