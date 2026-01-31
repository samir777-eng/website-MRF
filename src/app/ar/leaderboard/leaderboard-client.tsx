"use client";

/**
 * Enhanced Leaderboard - Phase 2 Task 2.1
 * Animated leaderboard with rank changes, tabs, and smooth transitions
 */

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import {
  Trophy,
  Medal,
  Crown,
  TrendingUp,
  TrendingDown,
  Minus,
  Star,
  Zap,
  Users,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

// ============================================================================
// TYPES
// ============================================================================

interface LeaderboardUser {
  id: string;
  name: string;
  grade: string;
  xp: number;
  rank: number;
  previousRank: number;
  rankChange: number;
  avatar?: string;
  badges?: string[];
  cosmetics?: {
    avatarFrame?: string;
    nameColor?: string;
  };
  weeklyXP?: number;
  isCurrentUser?: boolean;
}

type LeaderboardPeriod = "weekly" | "monthly" | "all-time" | "friends";

// ============================================================================
// MOCK DATA
// ============================================================================

const mockUsers: LeaderboardUser[] = [
  {
    id: "1",
    name: "أحمد محمد",
    grade: "الثالث الثانوي",
    xp: 15420,
    rank: 1,
    previousRank: 3,
    rankChange: 2,
    weeklyXP: 2840,
    badges: ["🏆", "⭐", "🔥"],
    isCurrentUser: true,
  },
  {
    id: "2",
    name: "فاطمة علي",
    grade: "الثالث الثانوي",
    xp: 14890,
    rank: 2,
    previousRank: 1,
    rankChange: -1,
    weeklyXP: 2120,
    badges: ["👑", "⭐"],
  },
  {
    id: "3",
    name: "محمد حسن",
    grade: "الثالث الثانوي",
    xp: 13750,
    rank: 3,
    previousRank: 2,
    rankChange: -1,
    weeklyXP: 1950,
    badges: ["🏅"],
  },
  {
    id: "4",
    name: "سارة أحمد",
    grade: "الثاني الثانوي",
    xp: 12800,
    rank: 4,
    previousRank: 6,
    rankChange: 2,
    weeklyXP: 2240,
    badges: ["⭐", "🔥"],
  },
  {
    id: "5",
    name: "عمر خالد",
    grade: "الثالث الثانوي",
    xp: 11950,
    rank: 5,
    previousRank: 5,
    rankChange: 0,
    weeklyXP: 1580,
  },
  {
    id: "6",
    name: "نور الدين",
    grade: "الثالث الثانوي",
    xp: 11200,
    rank: 6,
    previousRank: 4,
    rankChange: -2,
    weeklyXP: 1120,
    badges: ["⭐"],
  },
  {
    id: "7",
    name: "ليلى حسام",
    grade: "الثاني الثانوي",
    xp: 10800,
    rank: 7,
    previousRank: 8,
    rankChange: 1,
    weeklyXP: 1680,
  },
  {
    id: "8",
    name: "كريم محمود",
    grade: "الثالث الثانوي",
    xp: 10450,
    rank: 8,
    previousRank: 7,
    rankChange: -1,
    weeklyXP: 1320,
  },
  {
    id: "9",
    name: "مريم سعيد",
    grade: "الأول الثانوي",
    xp: 9800,
    rank: 9,
    previousRank: 10,
    rankChange: 1,
    weeklyXP: 1920,
    badges: ["🔥"],
  },
  {
    id: "10",
    name: "يوسف إبراهيم",
    grade: "الثالث الثانوي",
    xp: 9520,
    rank: 10,
    previousRank: 9,
    rankChange: -1,
    weeklyXP: 980,
  },
];

const currentUserRank = {
  rank: 1,
  totalUsers: 1247,
  xpToNext: 530, // XP needed to reach next rank
  nextRankUser: "فاطمة علي",
};

// ============================================================================
// LEADERBOARD CLIENT COMPONENT
// ============================================================================

export function LeaderboardClient() {
  const [period, setPeriod] = useState<LeaderboardPeriod>("weekly");
  const [users, setUsers] = useState(mockUsers);

  return (
    <div className="max-w-4xl mx-auto space-y-6 p-4 md:p-6" dir="rtl">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="flex items-center justify-center gap-3">
          <Trophy className="w-8 h-8 text-amber-500 fill-amber-500" />
          <h1 className="text-3xl md:text-4xl font-bold text-foreground">
            لوحة المتصدرين
          </h1>
          <Trophy className="w-8 h-8 text-amber-500 fill-amber-500" />
        </div>
        <p className="text-muted-foreground">
          تنافس مع أفضل الطلاب واحصل على ترتيب أعلى!
        </p>
      </div>

      {/* Current User Rank Card */}
      <CurrentUserRankCard
        rank={currentUserRank.rank}
        totalUsers={currentUserRank.totalUsers}
        xpToNext={currentUserRank.xpToNext}
        nextRankUser={currentUserRank.nextRankUser}
      />

      {/* Tabs */}
      <Card className="glass border-border/50">
        <CardContent className="p-6">
          <Tabs
            value={period}
            onValueChange={(v) => setPeriod(v as LeaderboardPeriod)}
          >
            <TabsList className="grid w-full grid-cols-4 mb-6">
              <TabsTrigger value="weekly" className="flex items-center gap-2">
                <Zap className="w-4 h-4" />
                الأسبوع
              </TabsTrigger>
              <TabsTrigger value="monthly" className="flex items-center gap-2">
                <Star className="w-4 h-4" />
                الشهر
              </TabsTrigger>
              <TabsTrigger value="all-time" className="flex items-center gap-2">
                <Trophy className="w-4 h-4" />
                كل الأوقات
              </TabsTrigger>
              <TabsTrigger value="friends" className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                الأصدقاء
              </TabsTrigger>
            </TabsList>

            <TabsContent value={period} className="space-y-3 mt-0">
              <AnimatePresence mode="popLayout">
                {users.map((user, index) => (
                  <LeaderboardItem key={user.id} user={user} index={index} />
                ))}
              </AnimatePresence>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Stats Footer */}
      <Card className="glass border-border/50">
        <CardContent className="p-4">
          <div className="text-center text-sm text-muted-foreground">
            يتم تحديث الترتيب كل ساعة • إجمالي الطلاب:{" "}
            {currentUserRank.totalUsers.toLocaleString()}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// ============================================================================
// CURRENT USER RANK CARD
// ============================================================================

function CurrentUserRankCard({
  rank,
  totalUsers,
  xpToNext,
  nextRankUser,
}: {
  rank: number;
  totalUsers: number;
  xpToNext: number;
  nextRankUser: string;
}) {
  const percentile = Math.round(((totalUsers - rank) / totalUsers) * 100);
  const progressToNext = 100 - (xpToNext / 1000) * 100; // Assume 1000 XP difference

  return (
    <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>
      <Card className="border-0 bg-gradient-to-br from-amber-500 to-orange-600 text-white shadow-2xl">
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            {/* Rank Badge */}
            <div className="flex-shrink-0">
              <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center border-4 border-white/40">
                <div className="text-center">
                  <div className="text-3xl font-bold">#{rank}</div>
                </div>
              </div>
            </div>

            {/* Info */}
            <div className="flex-1 space-y-2">
              <div>
                <h3 className="text-2xl font-bold">ترتيبك الحالي</h3>
                <div className="flex items-center gap-2 text-white/90 text-sm">
                  <TrendingUp className="w-4 h-4" />
                  <span>
                    أفضل من <strong>{percentile}%</strong> من الطلاب
                  </span>
                </div>
              </div>

              {/* Progress to Next Rank */}
              {xpToNext > 0 && (
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-xs text-white/80">
                    <span>{xpToNext} XP للترتيب التالي</span>
                    <span>{nextRankUser}</span>
                  </div>
                  <Progress
                    value={progressToNext}
                    className="h-2 bg-white/20"
                  />
                </div>
              )}
            </div>

            {/* Crown Icon */}
            <div className="flex-shrink-0">
              <Crown className="w-12 h-12 text-white/80" />
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

// ============================================================================
// LEADERBOARD ITEM
// ============================================================================

function LeaderboardItem({
  user,
  index,
}: {
  user: LeaderboardUser;
  index: number;
}) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{
        layout: { type: "spring", stiffness: 300, damping: 30 },
        opacity: { duration: 0.2 },
      }}
      className={cn(
        "flex items-center gap-4 p-4 rounded-xl transition-all group",
        user.isCurrentUser
          ? "bg-primary/10 border-2 border-primary shadow-lg"
          : "bg-muted/30 hover:bg-muted/60 border border-transparent",
        user.rank <= 3 && "shadow-md",
      )}
    >
      {/* Rank Badge */}
      <div className="flex-shrink-0 w-12 text-center">
        <RankBadge rank={user.rank} />
      </div>

      {/* Rank Change */}
      <div className="flex-shrink-0 w-8">
        <RankChange change={user.rankChange} />
      </div>

      {/* Avatar */}
      <div className="flex-shrink-0">
        <div
          className={cn(
            "w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg",
            user.rank === 1 &&
              "bg-gradient-to-br from-amber-400 to-orange-500 ring-4 ring-amber-400/30",
            user.rank === 2 &&
              "bg-gradient-to-br from-gray-300 to-gray-500 ring-4 ring-gray-400/30",
            user.rank === 3 &&
              "bg-gradient-to-br from-orange-400 to-orange-600 ring-4 ring-orange-400/30",
            user.rank > 3 &&
              "bg-gradient-to-br from-brand-indigo-500 to-brand-indigo-600",
          )}
        >
          {user.name.charAt(0)}
        </div>
      </div>

      {/* User Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <h3 className="font-bold text-foreground truncate">{user.name}</h3>
          {user.isCurrentUser && (
            <Badge className="bg-primary text-white text-xs">أنت</Badge>
          )}
          {user.badges && (
            <div className="flex gap-1">
              {user.badges.map((badge, i) => (
                <span key={i} className="text-sm">
                  {badge}
                </span>
              ))}
            </div>
          )}
        </div>
        <div className="text-xs text-muted-foreground">{user.grade}</div>
      </div>

      {/* XP Display */}
      <div className="text-left flex-shrink-0">
        <motion.div
          key={user.xp}
          initial={{ scale: 1.2, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-xl font-bold text-primary"
        >
          {user.xp.toLocaleString()}
        </motion.div>
        <div className="text-xs text-muted-foreground">XP</div>
        {user.weeklyXP && (
          <div className="text-xs text-success-600 font-medium">
            +{user.weeklyXP} هذا الأسبوع
          </div>
        )}
      </div>
    </motion.div>
  );
}

// ============================================================================
// RANK BADGE
// ============================================================================

function RankBadge({ rank }: { rank: number }) {
  if (rank === 1) {
    return (
      <motion.div
        animate={{ rotate: [0, 10, -10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="text-3xl"
      >
        🥇
      </motion.div>
    );
  }

  if (rank === 2) {
    return <div className="text-3xl">🥈</div>;
  }

  if (rank === 3) {
    return <div className="text-3xl">🥉</div>;
  }

  return <div className="text-xl font-bold text-muted-foreground">#{rank}</div>;
}

// ============================================================================
// RANK CHANGE INDICATOR
// ============================================================================

function RankChange({ change }: { change: number }) {
  if (change === 0) {
    return (
      <div className="text-muted-foreground/50">
        <Minus className="w-4 h-4" />
      </div>
    );
  }

  if (change > 0) {
    return (
      <motion.div
        initial={{ y: 10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="flex items-center gap-1 text-success-600 font-bold text-sm"
      >
        <TrendingUp className="w-4 h-4" />
        <span>{change}</span>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ y: -10, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="flex items-center gap-1 text-destructive font-bold text-sm"
    >
      <TrendingDown className="w-4 h-4" />
      <span>{Math.abs(change)}</span>
    </motion.div>
  );
}

export default LeaderboardClient;
