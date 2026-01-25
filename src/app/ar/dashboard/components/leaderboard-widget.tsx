"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ArrowLeft, Crown, Medal, TrendingUp, Trophy } from "lucide-react";
import Link from "next/link";

interface LeaderboardUser {
  id: string;
  name: string;
  xp: number;
  rank: number;
  avatar?: string;
  isCurrentUser?: boolean;
  rankChange?: number;
}

// Mock leaderboard data
const topUsers: LeaderboardUser[] = [
  { id: "1", name: "أحمد محمد", xp: 15420, rank: 1, rankChange: 0, isCurrentUser: true },
  { id: "2", name: "فاطمة علي", xp: 14890, rank: 2, rankChange: 1 },
  { id: "3", name: "محمد حسن", xp: 13750, rank: 3, rankChange: -1 },
  { id: "4", name: "سارة أحمد", xp: 12800, rank: 4, rankChange: 2 },
  { id: "5", name: "عمر خالد", xp: 11950, rank: 5, rankChange: 0 },
];

const currentUserRank = {
  rank: 1,
  totalUsers: 1247,
  percentile: 99,
  weeklyXP: 1250,
};

export function LeaderboardWidget() {
  return (
    <Card className="border-0 shadow-xl bg-gradient-to-br from-yellow-50/50 to-orange-50/50 dark:from-yellow-950/10 dark:to-orange-950/10">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Trophy className="w-5 h-5 text-yellow-600" />
            لوحة المتصدرين
          </h2>
          <Link href="/ar/leaderboard">
            <Button variant="ghost" size="sm" className="text-primary">
              عرض الكل
              <ArrowLeft className="w-4 h-4 mr-2" />
            </Button>
          </Link>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Current User Rank Summary */}
        <div className="p-4 bg-gradient-to-r from-yellow-100 to-orange-100 dark:from-yellow-900/20 dark:to-orange-900/20 rounded-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                <Crown className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="text-2xl font-bold text-foreground">#{currentUserRank.rank}</div>
                <div className="text-sm text-muted-foreground">ترتيبك الحالي</div>
              </div>
            </div>
            <div className="text-left">
              <div className="text-lg font-bold text-yellow-600">+{currentUserRank.weeklyXP} XP</div>
              <div className="text-sm text-muted-foreground">هذا الأسبوع</div>
            </div>
          </div>
          <div className="mt-3 flex items-center gap-2 text-sm text-muted-foreground">
            <TrendingUp className="w-4 h-4 text-green-600" />
            <span>أفضل من <strong className="text-foreground">{currentUserRank.percentile}%</strong> من الطلاب</span>
          </div>
        </div>

        {/* Top 5 Users */}
        <div className="space-y-2">
          {topUsers.map((user, index) => (
            <div
              key={user.id}
              className={`flex items-center gap-3 p-3 rounded-xl transition-all ${
                user.isCurrentUser
                  ? "bg-primary/10 border-2 border-primary"
                  : "bg-muted/50 hover:bg-muted"
              }`}
            >
              {/* Rank */}
              <div className="w-8 text-center flex-shrink-0">
                {user.rank === 1 ? (
                  <span className="text-2xl">🥇</span>
                ) : user.rank === 2 ? (
                  <span className="text-2xl">🥈</span>
                ) : user.rank === 3 ? (
                  <span className="text-2xl">🥉</span>
                ) : (
                  <span className="text-lg font-bold text-muted-foreground">#{user.rank}</span>
                )}
              </div>

              {/* Avatar */}
              <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold ${
                user.rank === 1 ? "bg-gradient-to-br from-yellow-400 to-orange-500" :
                user.rank === 2 ? "bg-gradient-to-br from-gray-300 to-gray-400" :
                user.rank === 3 ? "bg-gradient-to-br from-orange-300 to-orange-500" :
                "bg-gradient-to-br from-blue-400 to-purple-500"
              }`}>
                {user.name.charAt(0)}
              </div>

              {/* Name */}
              <div className="flex-1 min-w-0">
                <div className="font-semibold truncate flex items-center gap-2">
                  {user.name}
                  {user.isCurrentUser && (
                    <Badge className="bg-primary text-white text-xs">أنت</Badge>
                  )}
                </div>
              </div>

              {/* XP */}
              <div className="text-left flex-shrink-0">
                <div className="font-bold text-primary">{user.xp.toLocaleString()}</div>
                <div className="text-xs text-muted-foreground">XP</div>
              </div>

              {/* Rank Change */}
              {user.rankChange !== undefined && user.rankChange !== 0 && (
                <div className={`text-xs font-semibold ${user.rankChange > 0 ? "text-green-600" : "text-red-600"}`}>
                  {user.rankChange > 0 ? `↑${user.rankChange}` : `↓${Math.abs(user.rankChange)}`}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* View Full Leaderboard */}
        <Link href="/ar/leaderboard" className="block">
          <Button variant="outline" className="w-full">
            <Medal className="w-4 h-4 ml-2" />
            عرض الترتيب الكامل
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
}

