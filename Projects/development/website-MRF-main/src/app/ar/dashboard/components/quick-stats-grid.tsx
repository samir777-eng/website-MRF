"use client";

import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle, Clock, Flame, TrendingUp } from "lucide-react";
import { memo } from "react";
import { PERFORMANCE_STATS } from "../dashboard-data";

interface QuickStatsGridProps {
  currentStreak: number;
}

interface StatCardProps {
  icon: React.ReactNode;
  value: string | number;
  label: string;
  gradientFrom: string;
  gradientTo: string;
  iconBg: string;
  textColor: string;
}

const StatCard = memo(function StatCard({
  icon,
  value,
  label,
  gradientFrom,
  gradientTo,
  iconBg,
  textColor,
}: StatCardProps) {
  return (
    <Card
      className={`border-0 shadow-lg hover:shadow-xl transition-all duration-200 bg-gradient-to-br ${gradientFrom} ${gradientTo}`}
    >
      <CardContent className="p-6 text-center">
        <div
          className={`w-12 h-12 ${iconBg} rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg`}
        >
          {icon}
        </div>
        <div className={`text-3xl font-bold ${textColor} mb-1`}>{value}</div>
        <div className={`${textColor.replace("700", "600")} font-medium`}>
          {label}
        </div>
      </CardContent>
    </Card>
  );
});

function QuickStatsGridComponent({ currentStreak }: QuickStatsGridProps) {
  const stats: StatCardProps[] = [
    {
      icon: <CheckCircle className="w-6 h-6 text-white" />,
      value: PERFORMANCE_STATS.lessonsCompleted,
      label: "درس مكتمل",
      gradientFrom: "from-green-50",
      gradientTo: "to-emerald-50",
      iconBg: "bg-green-500",
      textColor: "text-green-700",
    },
    {
      icon: <Flame className="w-6 h-6 text-white" />,
      value: currentStreak,
      label: "سلسلة أيام",
      gradientFrom: "from-orange-50",
      gradientTo: "to-red-50",
      iconBg: "bg-orange-500",
      textColor: "text-orange-700",
    },
    {
      icon: <Clock className="w-6 h-6 text-white" />,
      value: PERFORMANCE_STATS.weeklyTime,
      label: "هذا الأسبوع",
      gradientFrom: "from-purple-50",
      gradientTo: "to-pink-50",
      iconBg: "bg-purple-500",
      textColor: "text-purple-700",
    },
    {
      icon: <TrendingUp className="w-6 h-6 text-white" />,
      value: `%${PERFORMANCE_STATS.averageScore}`,
      label: "متوسط النتيجة",
      gradientFrom: "from-blue-50",
      gradientTo: "to-cyan-50",
      iconBg: "bg-blue-500",
      textColor: "text-blue-700",
    },
  ];

  return (
    <div className="grid md:grid-cols-4 gap-6">
      {stats.map((stat, index) => (
        <StatCard key={index} {...stat} />
      ))}
    </div>
  );
}

export const QuickStatsGrid = memo(QuickStatsGridComponent);

