"use client";

import LeaderboardDisplay from "@/components/gamification/LeaderboardDisplay";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useGamification } from "@/contexts/GamificationContext";
import { useCountUp } from "@/hooks/useCountUp";
import {
  Award,
  ChevronDown,
  Crown,
  Flame,
  Medal,
  Target,
  TrendingDown,
  TrendingUp,
  Trophy,
  Users,
  Zap,
} from "lucide-react";
import { useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";

// Top 3 Podium Component
function TopThreePodium({
  entries,
}: {
  entries: Array<{
    id: string;
    name: string;
    value: number;
    rank: number;
  }>;
}) {
  const [first, second, third] = [
    entries.find((e) => e.rank === 1),
    entries.find((e) => e.rank === 2),
    entries.find((e) => e.rank === 3),
  ];

  if (!first || !second || !third) return null;

  return (
    <div className="flex items-end justify-center gap-2 sm:gap-4 py-4">
      {/* 2nd Place - Right side in RTL */}
      <div className="flex flex-col items-center">
        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-zinc-300 via-zinc-200 to-zinc-400 flex items-center justify-center text-zinc-900 font-bold text-xl shadow-xl shadow-zinc-400/30 border-2 border-white/20">
          {second.name.charAt(0)}
        </div>
        <span className="text-3xl my-2">🥈</span>
        <p className="font-bold text-sm text-center line-clamp-1 max-w-[80px] text-foreground">
          {second.name}
        </p>
        <p className="text-xs text-amber-500 font-medium">
          {second.value.toLocaleString()} XP
        </p>
        {/* Podium block - Silver */}
        <div className="h-20 w-20 sm:w-24 bg-gradient-to-t from-zinc-500 to-zinc-400 rounded-t-xl mt-3 flex items-center justify-center shadow-lg">
          <span className="text-white font-bold text-xl">#2</span>
        </div>
      </div>

      {/* 1st Place - Center */}
      <div className="flex flex-col items-center">
        <Crown className="w-8 h-8 text-amber-400 mb-1 animate-pulse" />
        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-amber-400 via-yellow-400 to-amber-500 flex items-center justify-center text-zinc-900 font-bold text-2xl shadow-xl shadow-amber-500/40 border-2 border-white/20">
          {first.name.charAt(0)}
        </div>
        <span className="text-4xl my-2">🥇</span>
        <p className="font-bold text-sm text-center line-clamp-1 max-w-[90px] text-foreground">
          {first.name}
        </p>
        <p className="text-xs text-amber-500 font-medium">
          {first.value.toLocaleString()} XP
        </p>
        {/* Podium block - Gold */}
        <div className="h-28 w-20 sm:w-24 bg-gradient-to-t from-amber-600 to-amber-500 rounded-t-xl mt-3 flex items-center justify-center shadow-lg">
          <span className="text-white font-bold text-2xl">#1</span>
        </div>
      </div>

      {/* 3rd Place - Left side in RTL */}
      <div className="flex flex-col items-center">
        <div className="w-14 h-14 rounded-full bg-gradient-to-br from-orange-400 via-orange-300 to-orange-500 flex items-center justify-center text-zinc-900 font-bold text-lg shadow-xl shadow-orange-500/30 border-2 border-white/20">
          {third.name.charAt(0)}
        </div>
        <span className="text-3xl my-2">🥉</span>
        <p className="font-bold text-sm text-center line-clamp-1 max-w-[80px] text-foreground">
          {third.name}
        </p>
        <p className="text-xs text-amber-500 font-medium">
          {third.value.toLocaleString()} XP
        </p>
        {/* Podium block - Bronze */}
        <div className="h-16 w-20 sm:w-24 bg-gradient-to-t from-orange-600 to-orange-500 rounded-t-xl mt-3 flex items-center justify-center shadow-lg">
          <span className="text-white font-bold text-xl">#3</span>
        </div>
      </div>
    </div>
  );
}

// Rank Change Badge
function RankChange({ change }: { change: number }) {
  if (change === 0) {
    return (
      <Badge
        variant="outline"
        className="text-xs border-zinc-600 text-zinc-400"
      >
        —
      </Badge>
    );
  }
  if (change > 0) {
    return (
      <Badge className="bg-green-500/20 text-green-400 border border-green-500/30 text-xs gap-1">
        <TrendingUp className="w-3 h-3" />+{change}
      </Badge>
    );
  }
  return (
    <Badge className="bg-red-500/20 text-red-400 border border-red-500/30 text-xs gap-1">
      <TrendingDown className="w-3 h-3" />
      {change}
    </Badge>
  );
}

// Stat Card Component
function StatCard({
  icon: Icon,
  label,
  value,
  subValue,
}: {
  icon: React.ElementType;
  label: string;
  value: string | number;
  subValue?: React.ReactNode;
}) {
  return (
    <div className="bg-zinc-800/50 rounded-xl p-4 border border-zinc-700/50">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-amber-500/20 to-orange-500/20 flex items-center justify-center">
          <Icon className="w-5 h-5 text-amber-500" />
        </div>
        <div className="flex-1">
          <p className="text-xs text-zinc-400">{label}</p>
          <div className="flex items-center gap-2">
            <p className="text-xl font-bold text-foreground">{value}</p>
            {subValue}
          </div>
        </div>
      </div>
    </div>
  );
}

// League Card
function LeagueCard({
  name,
  icon,
  minXP,
  isCurrent,
}: {
  name: string;
  icon: string;
  minXP: number;
  isCurrent: boolean;
}) {
  return (
    <div
      className={`relative p-4 rounded-xl border text-center transition-all ${
        isCurrent
          ? "bg-gradient-to-br from-amber-500/20 to-orange-500/20 border-amber-500/50 shadow-lg shadow-amber-500/10"
          : "bg-zinc-800/30 border-zinc-700/50 opacity-60"
      }`}
    >
      {isCurrent && (
        <div className="absolute -top-2 left-1/2 -translate-x-1/2">
          <Badge className="bg-amber-500 text-zinc-900 text-[10px] font-bold">
            أنت هنا
          </Badge>
        </div>
      )}
      <span className="text-3xl block mb-2">{icon}</span>
      <p
        className={`font-bold text-sm ${isCurrent ? "text-amber-400" : "text-zinc-400"}`}
      >
        {name}
      </p>
      <p className="text-xs text-zinc-500">{minXP.toLocaleString()}+ XP</p>
    </div>
  );
}

function LeaderboardContent() {
  const { userStats: _userStats } = useGamification();
  const _searchParams = useSearchParams();

  const [selectedTimeframe, setSelectedTimeframe] = useState<
    "weekly" | "monthly" | "alltime"
  >("weekly");
  const [selectedCategory, setSelectedCategory] = useState<
    "xp" | "streak" | "lessons" | "score"
  >("xp");
  const [showFilters, setShowFilters] = useState(false);

  // Mock data
  const userRankingData = {
    weekly: { rank: 1, totalUsers: 1247, xp: 1250, percentile: 99, change: 2 },
    monthly: {
      rank: 3,
      totalUsers: 1247,
      xp: 4800,
      percentile: 97,
      change: -1,
    },
    alltime: {
      rank: 15,
      totalUsers: 1247,
      xp: 15420,
      percentile: 88,
      change: 0,
    },
  };

  const currentRanking = userRankingData[selectedTimeframe];

  // Animated counters
  const animatedRank = useCountUp(currentRanking.rank, 800);
  const animatedXP = useCountUp(currentRanking.xp, 1000);

  // Top 3 for podium
  const top3Entries = [
    { id: "1", name: "أحمد محمد", value: 1580, rank: 1 },
    { id: "2", name: "سارة أحمد", value: 1420, rank: 2 },
    { id: "3", name: "محمود علي", value: 1350, rank: 3 },
  ];

  // League data (Bronze on right → Diamond on left for RTL progress)
  const leagues = [
    { name: "البرونزية", icon: "🥉", minXP: 0 },
    { name: "الفضية", icon: "🥈", minXP: 5000 },
    { name: "الذهبية", icon: "🥇", minXP: 10000 },
    { name: "البلاتينية", icon: "💎", minXP: 20000 },
    { name: "الماسية", icon: "👑", minXP: 35000 },
  ];

  // Find current league (using alltime XP)
  const userTotalXP = userRankingData.alltime.xp;
  const currentLeagueIndex = leagues.findIndex((l, i) => {
    const nextLeague = leagues[i + 1];
    return (
      userTotalXP >= l.minXP && (!nextLeague || userTotalXP < nextLeague.minXP)
    );
  });

  const currentLeague = leagues[currentLeagueIndex] || leagues[0];
  const nextLeague = leagues[currentLeagueIndex + 1];
  const progressToNext = nextLeague
    ? ((userTotalXP - currentLeague.minXP) /
        (nextLeague.minXP - currentLeague.minXP)) *
      100
    : 100;

  return (
    <div
     
      className="min-h-screen bg-gradient-to-b from-zinc-950 via-zinc-900 to-zinc-950 pb-24"
    >
      <div className="container mx-auto px-4 py-8 max-w-5xl space-y-6">
        {/* Header */}
        <header className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 shadow-xl shadow-amber-500/30">
            <Trophy className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-1">لوحة المتصدرين</h1>
          <p className="text-zinc-400">تنافس مع زملائك واكتشف أفضل الطلاب</p>
        </header>

        {/* Main Stats Card */}
        <Card className="border-0 bg-gradient-to-br from-amber-500 to-orange-600 text-white overflow-hidden relative">
          <div className="absolute inset-0 bg-[url('/patterns/grid.svg')] opacity-10" />
          <CardContent className="p-6 relative">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {/* Rank */}
              <div className="text-center p-4 bg-white/10 rounded-xl backdrop-blur-sm">
                <div className="flex items-center justify-center gap-2 mb-1">
                  <span className="text-4xl font-bold">#{animatedRank}</span>
                </div>
                <RankChange change={currentRanking.change} />
                <p className="text-white/70 text-xs mt-2">ترتيبك</p>
              </div>

              {/* XP */}
              <div className="text-center p-4 bg-white/10 rounded-xl backdrop-blur-sm">
                <Zap className="w-6 h-6 mx-auto mb-1 text-yellow-300" />
                <p className="text-3xl font-bold">
                  {animatedXP.toLocaleString()}
                </p>
                <p className="text-white/70 text-xs mt-1">نقاط XP</p>
              </div>

              {/* Percentile */}
              <div className="text-center p-4 bg-white/10 rounded-xl backdrop-blur-sm">
                <Award className="w-6 h-6 mx-auto mb-1 text-yellow-300" />
                <p className="text-3xl font-bold">
                  {currentRanking.percentile}%
                </p>
                <p className="text-white/70 text-xs mt-1">أفضل من</p>
              </div>

              {/* Total Users */}
              <div className="text-center p-4 bg-white/10 rounded-xl backdrop-blur-sm">
                <Users className="w-6 h-6 mx-auto mb-1 text-yellow-300" />
                <p className="text-3xl font-bold">
                  {currentRanking.totalUsers.toLocaleString()}
                </p>
                <p className="text-white/70 text-xs mt-1">متنافس</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Filters */}
        <div className="space-y-3">
          <Button
            variant="outline"
            className="w-full md:hidden justify-between border-zinc-700 bg-zinc-800/50"
            onClick={() => setShowFilters(!showFilters)}
          >
            <span>الفلاتر</span>
            <ChevronDown
              className={`w-4 h-4 transition-transform ${showFilters ? "rotate-180" : ""}`}
            />
          </Button>

          <div
            className={`flex flex-wrap justify-center gap-3 ${showFilters ? "block" : "hidden md:flex"}`}
          >
            {/* Timeframe */}
            <div className="flex gap-1 p-1 bg-zinc-800/50 rounded-xl border border-zinc-700/50">
              {(["weekly", "monthly", "alltime"] as const).map((tf) => (
                <Button
                  key={tf}
                  onClick={() => setSelectedTimeframe(tf)}
                  variant="ghost"
                  size="sm"
                  className={`h-9 px-4 rounded-lg ${
                    selectedTimeframe === tf
                      ? "bg-gradient-to-r from-amber-500 to-orange-500 text-white"
                      : "text-zinc-400 hover:text-white hover:bg-zinc-700"
                  }`}
                >
                  {tf === "weekly"
                    ? "أسبوعي"
                    : tf === "monthly"
                      ? "شهري"
                      : "إجمالي"}
                </Button>
              ))}
            </div>

            {/* Category */}
            <div className="flex gap-1 p-1 bg-zinc-800/50 rounded-xl border border-zinc-700/50">
              {[
                { key: "xp", label: "XP", icon: Zap },
                { key: "streak", label: "السلسلة", icon: Flame },
                { key: "lessons", label: "الدروس", icon: Target },
                { key: "score", label: "المتوسط", icon: TrendingUp },
              ].map((cat) => (
                <Button
                  key={cat.key}
                  onClick={() =>
                    setSelectedCategory(cat.key as typeof selectedCategory)
                  }
                  variant="ghost"
                  size="sm"
                  className={`h-9 px-3 rounded-lg gap-1 ${
                    selectedCategory === cat.key
                      ? "bg-gradient-to-r from-amber-500 to-orange-500 text-white"
                      : "text-zinc-400 hover:text-white hover:bg-zinc-700"
                  }`}
                >
                  <cat.icon className="w-4 h-4" />
                  <span className="hidden sm:inline">{cat.label}</span>
                </Button>
              ))}
            </div>
          </div>
        </div>

        {/* Top 3 Podium */}
        <Card className="border-zinc-800 bg-zinc-900/50 overflow-hidden">
          <div className="bg-gradient-to-r from-amber-500/10 via-transparent to-orange-500/10 p-6">
            <h2 className="text-lg font-bold text-center mb-2 flex items-center justify-center gap-2">
              <Crown className="w-5 h-5 text-amber-500" />
              <span className="text-white">المتصدرون</span>
            </h2>
            <TopThreePodium entries={top3Entries} />
          </div>
        </Card>

        {/* League Progress - RTL: Current (right) → Next (left) */}
        {nextLeague && (
          <Card className="border-zinc-800 bg-zinc-900/50">
            <CardContent className="p-5">
              <div className="flex items-center gap-4">
                {/* Current League - RIGHT side in RTL */}
                <div className="flex items-center gap-3 shrink-0">
                  <span className="text-4xl">{currentLeague.icon}</span>
                  <div>
                    <p className="text-[10px] text-zinc-500 uppercase tracking-wider">
                      الآن
                    </p>
                    <p className="font-bold text-amber-500">
                      {currentLeague.name}
                    </p>
                    <p className="text-xs text-zinc-400">
                      {currentLeague.minXP.toLocaleString()}+ XP
                    </p>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="flex-1">
                  <div className="relative h-3 bg-zinc-800 rounded-full overflow-hidden">
                    {/* Progress fill - goes from RIGHT to LEFT in RTL */}
                    <div
                      className="absolute inset-y-0 end-0 bg-gradient-to-l from-amber-500 to-orange-500 rounded-full transition-all duration-500"
                      style={{ width: `${progressToNext}%` }}
                    />
                    {/* Progress indicator */}
                    <div
                      className="absolute top-1/2 -translate-y-1/2 w-5 h-5 bg-white rounded-full shadow-lg border-2 border-amber-500 transition-all duration-500"
                      style={{ insetInlineEnd: `calc(${progressToNext}% - 10px)` }}
                    />
                  </div>
                  <div className="flex justify-between mt-2 text-xs">
                    <span className="text-zinc-500">
                      {userTotalXP.toLocaleString()} XP
                    </span>
                    <span className="text-amber-500 font-bold">
                      ← {(nextLeague.minXP - userTotalXP).toLocaleString()} XP
                    </span>
                    <span className="text-zinc-500">
                      {nextLeague.minXP.toLocaleString()} XP
                    </span>
                  </div>
                </div>

                {/* Next League - LEFT side in RTL */}
                <div className="flex items-center gap-3 shrink-0">
                  <div className="text-start">
                    <p className="text-[10px] text-zinc-500 uppercase tracking-wider">
                      التالي
                    </p>
                    <p className="font-bold text-zinc-300">{nextLeague.name}</p>
                    <p className="text-xs text-zinc-500">
                      {nextLeague.minXP.toLocaleString()}+ XP
                    </p>
                  </div>
                  <span className="text-4xl grayscale opacity-40">
                    {nextLeague.icon}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Leagues Grid */}
        <div className="grid grid-cols-5 gap-2">
          {leagues.map((league, index) => (
            <LeagueCard
              key={league.name}
              name={league.name}
              icon={league.icon}
              minXP={league.minXP}
              isCurrent={index === currentLeagueIndex}
            />
          ))}
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <StatCard icon={Target} label="الدروس المكتملة" value="12" />
          <StatCard icon={Flame} label="السلسلة الحالية" value="21 يوم" />
          <StatCard icon={Trophy} label="الاختبارات" value="8" />
          <StatCard icon={TrendingUp} label="متوسط النتيجة" value="92%" />
        </div>

        {/* Main Leaderboard */}
        <Card className="border-zinc-800 bg-zinc-900/50">
          <CardContent className="p-6">
            <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
              <Medal className="w-5 h-5 text-amber-500" />
              <span className="text-white">الترتيب الكامل</span>
            </h2>
            <LeaderboardDisplay
              variant="full"
              timeframe={selectedTimeframe}
              category={selectedCategory}
              showLeagues={false}
              hideFilters={true}
            />
          </CardContent>
        </Card>

        {/* Upcoming Events */}
        <Card className="border-zinc-800 bg-zinc-900/50">
          <CardContent className="p-6">
            <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
              <Zap className="w-5 h-5 text-amber-500" />
              <span className="text-white">المسابقات القادمة</span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-gradient-to-l from-amber-500/10 to-orange-500/10 border border-amber-500/20">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-3xl">🏆</span>
                  <div>
                    <h3 className="font-bold text-white">بطولة نهاية الشهر</h3>
                    <p className="text-xs text-zinc-400">تبدأ في 25 ديسمبر</p>
                  </div>
                </div>
                <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/30">
                  10,000 XP
                </Badge>
              </div>

              <div className="p-4 rounded-xl bg-gradient-to-l from-green-500/10 to-emerald-500/10 border border-green-500/20">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-3xl">⚡</span>
                  <div>
                    <h3 className="font-bold text-white">تحدي السرعة</h3>
                    <p className="text-xs text-zinc-400">كل يوم جمعة</p>
                  </div>
                </div>
                <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                  2,000 XP
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// Loading skeleton
function LeaderboardSkeleton() {
  return (
    <div className="min-h-screen bg-zinc-950 pb-24">
      <div className="container mx-auto px-4 py-8 max-w-5xl space-y-6">
        <div className="text-center">
          <div className="w-16 h-16 bg-zinc-800 rounded-2xl mx-auto mb-4 animate-pulse" />
          <div className="h-8 bg-zinc-800 rounded w-48 mx-auto mb-2 animate-pulse" />
          <div className="h-4 bg-zinc-800 rounded w-64 mx-auto animate-pulse" />
        </div>
        <div className="h-40 bg-zinc-800 rounded-xl animate-pulse" />
        <div className="h-60 bg-zinc-800 rounded-xl animate-pulse" />
      </div>
    </div>
  );
}

import { LeaderboardErrorBoundary } from "@/components/error-boundary/section-error-boundary";

export default function LeaderboardPage() {
  return (
    <LeaderboardErrorBoundary>
      <Suspense fallback={<LeaderboardSkeleton />}>
        <LeaderboardContent />
      </Suspense>
    </LeaderboardErrorBoundary>
  );
}
