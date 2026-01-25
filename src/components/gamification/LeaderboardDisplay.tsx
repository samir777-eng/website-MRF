"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useGamification } from "@/contexts/GamificationContext";
import {
  ChevronDown,
  ChevronUp,
  Crown,
  Medal,
  Minus,
  Trophy,
} from "lucide-react";
import { useEffect, useState } from "react";

interface LeaderboardEntry {
  id: string;
  name: string;
  avatar?: string;
  level: number;
  xp: number;
  weeklyXP: number;
  monthlyXP: number;
  streak: number;
  lessonsCompleted: number;
  quizzesTaken: number;
  averageScore: number;
  rank: number;
  previousRank?: number;
  league: "bronze" | "silver" | "gold" | "platinum" | "diamond";
  isCurrentUser?: boolean;
}

interface LeaderboardDisplayProps {
  variant?: "compact" | "detailed" | "full";
  timeframe?: "weekly" | "monthly" | "alltime";
  category?: "xp" | "streak" | "lessons" | "quizzes" | "score";
  maxDisplay?: number;
  showLeagues?: boolean;
  hideFilters?: boolean;
}

// Mock leaderboard data
const MOCK_LEADERBOARD: LeaderboardEntry[] = [
  {
    id: "user1",
    name: "أحمد محمد",
    level: 25,
    xp: 15420,
    weeklyXP: 1250,
    monthlyXP: 4800,
    streak: 21,
    lessonsCompleted: 156,
    quizzesTaken: 89,
    averageScore: 92,
    rank: 1,
    previousRank: 2,
    league: "diamond",
    isCurrentUser: true,
  },
  {
    id: "user2",
    name: "فاطمة علي",
    level: 28,
    xp: 18750,
    weeklyXP: 980,
    monthlyXP: 3200,
    streak: 45,
    lessonsCompleted: 203,
    quizzesTaken: 124,
    averageScore: 95,
    rank: 2,
    previousRank: 1,
    league: "diamond",
  },
  {
    id: "user3",
    name: "محمد حسن",
    level: 22,
    xp: 12890,
    weeklyXP: 850,
    monthlyXP: 2900,
    streak: 12,
    lessonsCompleted: 134,
    quizzesTaken: 76,
    averageScore: 88,
    rank: 3,
    previousRank: 4,
    league: "gold",
  },
  {
    id: "user4",
    name: "نور الدين",
    level: 20,
    xp: 11200,
    weeklyXP: 720,
    monthlyXP: 2400,
    streak: 8,
    lessonsCompleted: 98,
    quizzesTaken: 65,
    averageScore: 85,
    rank: 4,
    previousRank: 3,
    league: "gold",
  },
  {
    id: "user5",
    name: "سارة أحمد",
    level: 19,
    xp: 10500,
    weeklyXP: 650,
    monthlyXP: 2100,
    streak: 15,
    lessonsCompleted: 87,
    quizzesTaken: 52,
    averageScore: 90,
    rank: 5,
    previousRank: 5,
    league: "silver",
  },
  {
    id: "user6",
    name: "عبد الرحمن",
    level: 18,
    xp: 9800,
    weeklyXP: 580,
    monthlyXP: 1900,
    streak: 6,
    lessonsCompleted: 76,
    quizzesTaken: 48,
    averageScore: 82,
    rank: 6,
    previousRank: 7,
    league: "silver",
  },
  {
    id: "user7",
    name: "مريم خالد",
    level: 17,
    xp: 8900,
    weeklyXP: 520,
    monthlyXP: 1700,
    streak: 4,
    lessonsCompleted: 65,
    quizzesTaken: 41,
    averageScore: 87,
    rank: 7,
    previousRank: 6,
    league: "silver",
  },
  {
    id: "user8",
    name: "يوسف محمود",
    level: 16,
    xp: 7800,
    weeklyXP: 450,
    monthlyXP: 1500,
    streak: 3,
    lessonsCompleted: 54,
    quizzesTaken: 35,
    averageScore: 79,
    rank: 8,
    previousRank: 8,
    league: "bronze",
  },
];

const LEAGUE_CONFIG = {
  bronze: {
    name: "البرونزية",
    color:
      "text-orange-700 bg-orange-100 dark:bg-orange-950/30 dark:text-orange-400",
    icon: "🥉",
    minXP: 0,
  },
  silver: {
    name: "الفضية",
    color: "text-zinc-700 bg-zinc-100 dark:bg-zinc-800 dark:text-zinc-400",
    icon: "🥈",
    minXP: 5000,
  },
  gold: {
    name: "الذهبية",
    color:
      "text-yellow-700 bg-yellow-100 dark:bg-yellow-950/30 dark:text-yellow-400",
    icon: "🥇",
    minXP: 10000,
  },
  platinum: {
    name: "البلاتينية",
    color: "text-blue-700 bg-blue-100 dark:bg-blue-950/30 dark:text-blue-400",
    icon: "💎",
    minXP: 20000,
  },
  diamond: {
    name: "الماسية",
    color:
      "text-purple-700 bg-purple-100 dark:bg-purple-950/30 dark:text-purple-400",
    icon: "💎",
    minXP: 35000,
  },
};

export default function LeaderboardDisplay({
  variant = "compact",
  timeframe = "weekly",
  category = "xp",
  maxDisplay = 10,
  showLeagues = true,
  hideFilters = false,
}: LeaderboardDisplayProps) {
  const { userStats: _userStats } = useGamification();
  const [selectedTimeframe, setSelectedTimeframe] = useState(timeframe);
  const [selectedCategory, setSelectedCategory] = useState(category);
  const [leaderboardData, _setLeaderboardData] = useState(MOCK_LEADERBOARD);

  // Sync internal state with props when they change (for controlled usage)
  useEffect(() => {
    setSelectedTimeframe(timeframe);
  }, [timeframe]);

  useEffect(() => {
    setSelectedCategory(category);
  }, [category]);

  // Get rank change indicator
  const getRankChangeIcon = (current: number, previous?: number) => {
    if (!previous) return <Minus className="w-4 h-4 text-muted-foreground" />;
    if (current < previous)
      return <ChevronUp className="w-4 h-4 text-green-600" />;
    if (current > previous)
      return <ChevronDown className="w-4 h-4 text-red-600" />;
    return <Minus className="w-4 h-4 text-muted-foreground" />;
  };

  // Get rank medal/crown
  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="w-6 h-6 text-yellow-500" />;
      case 2:
        return <Medal className="w-6 h-6 text-zinc-400 dark:text-zinc-500" />;
      case 3:
        return <Medal className="w-6 h-6 text-orange-500" />;
      default:
        return (
          <span className="w-6 h-6 flex items-center justify-center text-sm font-bold text-muted-foreground">
            #{rank}
          </span>
        );
    }
  };

  // Get value based on category
  const getCategoryValue = (entry: LeaderboardEntry) => {
    switch (selectedCategory) {
      case "xp":
        return selectedTimeframe === "weekly"
          ? entry.weeklyXP
          : selectedTimeframe === "monthly"
            ? entry.monthlyXP
            : entry.xp;
      case "streak":
        return entry.streak;
      case "lessons":
        return entry.lessonsCompleted;
      case "quizzes":
        return entry.quizzesTaken;
      case "score":
        return entry.averageScore;
      default:
        return entry.xp;
    }
  };

  // Get category label
  const getCategoryLabel = () => {
    switch (selectedCategory) {
      case "xp":
        return "نقاط الخبرة";
      case "streak":
        return "السلسلة";
      case "lessons":
        return "الدروس";
      case "quizzes":
        return "الاختبارات";
      case "score":
        return "المتوسط";
      default:
        return "نقاط الخبرة";
    }
  };

  // Compact variant for sidebar
  if (variant === "compact") {
    const topEntries = leaderboardData.slice(0, maxDisplay);

    return (
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-foreground flex items-center gap-2">
            <Trophy className="w-5 h-5 text-yellow-600" />
            المتصدرون
          </h3>
          <Badge variant="outline">
            {selectedTimeframe === "weekly"
              ? "أسبوعي"
              : selectedTimeframe === "monthly"
                ? "شهري"
                : "إجمالي"}
          </Badge>
        </div>

        <div className="space-y-2">
          {topEntries.map((entry) => (
            <div
              key={entry.id}
              className={`flex items-center gap-3 p-2 rounded-lg ${
                entry.isCurrentUser
                  ? "bg-blue-50 dark:bg-blue-950/20 border border-blue-200"
                  : "bg-muted/30"
              }`}
            >
              <div className="flex items-center gap-2">
                {getRankIcon(entry.rank)}
                {getRankChangeIcon(entry.rank, entry.previousRank)}
              </div>

              <Avatar className="w-8 h-8">
                <AvatarFallback className="text-sm">
                  {entry.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>

              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-foreground truncate">
                  {entry.name}
                </div>
                <div className="text-sm text-muted-foreground">
                  المستوى {entry.level} •{" "}
                  {getCategoryValue(entry).toLocaleString()}{" "}
                  {getCategoryLabel()}
                </div>
              </div>

              {showLeagues && (
                <Badge className={LEAGUE_CONFIG[entry.league].color}>
                  {LEAGUE_CONFIG[entry.league].icon}
                </Badge>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Detailed variant for dashboard
  if (variant === "detailed") {
    return (
      <Card className="border-0 shadow-xl bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-950/20 dark:to-orange-950/20">
        <CardHeader>
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold leading-none tracking-tight flex items-center gap-2">
              <Trophy className="w-6 h-6 text-yellow-600" />
              لوحة المتصدرين
            </h2>
            <div className="flex items-center gap-2">
              <Button
                onClick={() =>
                  setSelectedTimeframe(
                    selectedTimeframe === "weekly" ? "monthly" : "weekly"
                  )
                }
                variant="outline"
                className="h-11 min-h-[44px]"
              >
                {selectedTimeframe === "weekly" ? "أسبوعي" : "شهري"}
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Top 3 Podium */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            {leaderboardData.slice(0, 3).map((entry, index) => (
              <div
                key={entry.id}
                className={`text-center p-4 rounded-xl ${
                  index === 0
                    ? "bg-gradient-to-br from-yellow-100 to-orange-100"
                    : index === 1
                      ? "bg-gradient-to-br from-gray-100 to-gray-200"
                      : "bg-gradient-to-br from-orange-100 to-red-100"
                } ${entry.isCurrentUser ? "ring-2 ring-blue-400" : ""}`}
              >
                <div className="text-4xl mb-2">
                  {index === 0 ? "🥇" : index === 1 ? "🥈" : "🥉"}
                </div>
                <Avatar className="w-12 h-12 mx-auto mb-2">
                  <AvatarFallback>
                    {entry.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div className="font-bold text-sm text-foreground truncate">
                  {entry.name}
                </div>
                <div className="text-sm text-muted-foreground">
                  المستوى {entry.level}
                </div>
                <div className="text-lg font-bold text-foreground mt-1">
                  {getCategoryValue(entry).toLocaleString()}
                </div>
                <div className="text-sm text-muted-foreground">
                  {getCategoryLabel()}
                </div>
              </div>
            ))}
          </div>

          {/* Rest of leaderboard */}
          <div className="space-y-2">
            {leaderboardData.slice(3, maxDisplay).map((entry) => (
              <div
                key={entry.id}
                className={`flex items-center gap-3 p-3 rounded-lg ${
                  entry.isCurrentUser
                    ? "bg-blue-50 dark:bg-blue-950/20 border border-blue-200"
                    : "bg-white/50 dark:bg-black/10"
                }`}
              >
                <div className="flex items-center gap-2 w-12">
                  <span className="text-sm font-bold text-muted-foreground">
                    #{entry.rank}
                  </span>
                  {getRankChangeIcon(entry.rank, entry.previousRank)}
                </div>

                <Avatar className="w-10 h-10">
                  <AvatarFallback>
                    {entry.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>

                <div className="flex-1">
                  <div className="font-medium text-foreground">
                    {entry.name}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    المستوى {entry.level}
                  </div>
                </div>

                <div className="text-right">
                  <div className="font-bold text-foreground">
                    {getCategoryValue(entry).toLocaleString()}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {getCategoryLabel()}
                  </div>
                </div>

                {showLeagues && (
                  <Badge className={LEAGUE_CONFIG[entry.league].color}>
                    {LEAGUE_CONFIG[entry.league].icon}
                  </Badge>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  // Full variant for dedicated leaderboard page
  return (
    <div className="space-y-6">
      {/* Filters - can be hidden when parent controls timeframe/category */}
      {!hideFilters && (
        <div className="flex flex-wrap gap-4 justify-center">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">الفترة الزمنية:</span>
            {["weekly", "monthly", "alltime"].map((period) => (
              <Button
                key={period}
                onClick={() => setSelectedTimeframe(period as any)}
                variant={selectedTimeframe === period ? "default" : "outline"}
                className="h-11 min-h-[44px]"
              >
                {period === "weekly"
                  ? "أسبوعي"
                  : period === "monthly"
                    ? "شهري"
                    : "إجمالي"}
              </Button>
            ))}
          </div>

          {/* Force recompile: v2 - touch target fix */}
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">الفئة:</span>
            {["xp", "streak", "lessons", "quizzes", "score"].map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat as any)}
                className={`inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-semibold transition-all duration-200 ease-out focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 h-11 px-3 rounded-md ${selectedCategory === cat ? "bg-primary-500 text-white shadow hover:bg-primary-600" : "border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground"}`}
                style={{ minWidth: "44px" }}
              >
                {cat === "xp"
                  ? "XP"
                  : cat === "streak"
                    ? "السلسلة"
                    : cat === "lessons"
                      ? "الدروس"
                      : cat === "quizzes"
                        ? "الاختبارات"
                        : "المتوسط"}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Leagues Overview */}
      {showLeagues && (
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {Object.entries(LEAGUE_CONFIG).map(([key, config]) => (
            <div
              key={key}
              className={`text-center p-4 rounded-xl ${config.color}`}
            >
              <div className="text-3xl mb-2">{config.icon}</div>
              <div className="font-bold">{config.name}</div>
              <div className="text-sm opacity-80">
                {config.minXP.toLocaleString()}+ XP
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Full Leaderboard */}
      <Card className="border-0 shadow-xl">
        <CardHeader>
          <h2 className="text-2xl font-semibold leading-none tracking-tight flex items-center gap-2">
            <Trophy className="w-6 h-6 text-yellow-600" />
            لوحة المتصدرين - {getCategoryLabel()}
          </h2>
        </CardHeader>

        <CardContent>
          <div className="space-y-3">
            {leaderboardData.map((entry) => (
              <div
                key={entry.id}
                className={`flex items-center gap-4 p-4 rounded-xl border-2 transition-all duration-300 ${
                  entry.isCurrentUser
                    ? "border-blue-400 bg-blue-50 dark:bg-blue-950/20 shadow-lg"
                    : "border-muted hover:border-blue-200 bg-background"
                }`}
              >
                <div className="flex items-center gap-3 w-20">
                  {getRankIcon(entry.rank)}
                  {getRankChangeIcon(entry.rank, entry.previousRank)}
                </div>

                <Avatar className="w-12 h-12">
                  <AvatarFallback className="text-lg">
                    {entry.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>

                <div className="flex-1">
                  <div className="font-bold text-lg text-foreground">
                    {entry.name}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    المستوى {entry.level} • {entry.lessonsCompleted} درس •{" "}
                    {entry.quizzesTaken} اختبار
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-2xl font-bold text-foreground">
                    {getCategoryValue(entry).toLocaleString()}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {getCategoryLabel()}
                  </div>
                </div>

                {showLeagues && (
                  <Badge
                    className={`${LEAGUE_CONFIG[entry.league].color} text-lg px-3 py-1`}
                  >
                    {LEAGUE_CONFIG[entry.league].icon}{" "}
                    {LEAGUE_CONFIG[entry.league].name}
                  </Badge>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
