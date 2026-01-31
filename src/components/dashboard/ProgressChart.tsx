"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CHART_COLORS } from "@/lib/design-tokens";
import { Calendar, TrendingUp } from "lucide-react";
import { useState } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

interface ProgressChartProps {
  variant?: "line" | "area";
}

export function ProgressChart({ variant = "area" }: ProgressChartProps) {
  const [timeframe, setTimeframe] = useState<"week" | "month">("week");

  // Mock data - replace with real data
  const weeklyData = [
    { day: "السبت", lessons: 3, quizzes: 2, xp: 150, score: 85 },
    { day: "الأحد", lessons: 4, quizzes: 3, xp: 200, score: 88 },
    { day: "الاثنين", lessons: 2, quizzes: 1, xp: 100, score: 82 },
    { day: "الثلاثاء", lessons: 5, quizzes: 4, xp: 250, score: 92 },
    { day: "الأربعاء", lessons: 3, quizzes: 2, xp: 180, score: 87 },
    { day: "الخميس", lessons: 4, quizzes: 3, xp: 220, score: 90 },
    { day: "الجمعة", lessons: 6, quizzes: 5, xp: 300, score: 95 },
  ];

  const monthlyData = [
    { week: "الأسبوع 1", lessons: 15, quizzes: 10, xp: 800, score: 85 },
    { week: "الأسبوع 2", lessons: 18, quizzes: 12, xp: 950, score: 88 },
    { week: "الأسبوع 3", lessons: 20, quizzes: 15, xp: 1100, score: 90 },
    { week: "الأسبوع 4", lessons: 22, quizzes: 18, xp: 1250, score: 92 },
  ];

  const data = timeframe === "week" ? weeklyData : monthlyData;
  const xKey = timeframe === "week" ? "day" : "week";

  // Custom tooltip
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background/95 backdrop-blur-sm border border-border rounded-lg p-4 shadow-xl">
          <p className="font-bold text-foreground mb-2">{label}</p>
          {payload.map((entry: any, index: number) => (
            <div key={index} className="flex items-center gap-2 text-sm">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: entry.color }}
              />
              <span className="text-muted-foreground">{entry.name}:</span>
              <span className="font-bold text-foreground">{entry.value}</span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  // Calculate trend
  const calculateTrend = () => {
    if (data.length < 2) return "0";
    const firstScore = data[0].score;
    const lastScore = data[data.length - 1].score;
    return (((lastScore - firstScore) / firstScore) * 100).toFixed(1);
  };

  const trend = calculateTrend();
  const isPositive = parseFloat(trend) >= 0;

  return (
    <Card className="border-0 shadow-xl overflow-hidden">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-2xl flex items-center gap-2">
              <TrendingUp className="w-6 h-6 text-blue-600" />
              تقدمك الدراسي
            </CardTitle>
            <CardDescription className="mt-2">
              تتبع أدائك وتقدمك بمرور الوقت
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant={timeframe === "week" ? "default" : "outline"}
              onClick={() => setTimeframe("week")}
              className="gap-2 h-11 min-h-[44px]"
            >
              <Calendar className="w-4 h-4" />
              أسبوعي
            </Button>
            <Button
              variant={timeframe === "month" ? "default" : "outline"}
              onClick={() => setTimeframe("month")}
              className="gap-2 h-11 min-h-[44px]"
            >
              <Calendar className="w-4 h-4" />
              شهري
            </Button>
          </div>
        </div>

        {/* Trend Indicator */}
        <div
          className={`mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-full ${
            isPositive
              ? "bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400"
              : "bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400"
          }`}
        >
          <TrendingUp className={`w-4 h-4 ${!isPositive && "rotate-180"}`} />
          <span className="font-bold">
            {isPositive ? "+" : ""}
            {trend}%
          </span>
          <span className="text-sm">
            {timeframe === "week" ? "هذا الأسبوع" : "هذا الشهر"}
          </span>
        </div>
      </CardHeader>

      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            {variant === "area" ? (
              <AreaChart
                data={data}
                margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="colorXP" x1="0" y1="0" x2="0" y2="1">
                    <stop
                      offset="5%"
                      stopColor={CHART_COLORS.hex.info}
                      stopOpacity={0.8}
                    />
                    <stop
                      offset="95%"
                      stopColor={CHART_COLORS.hex.info}
                      stopOpacity={0}
                    />
                  </linearGradient>
                  <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                    <stop
                      offset="5%"
                      stopColor={CHART_COLORS.hex.primary}
                      stopOpacity={0.8}
                    />
                    <stop
                      offset="95%"
                      stopColor={CHART_COLORS.hex.primary}
                      stopOpacity={0}
                    />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis
                  dataKey={xKey}
                  className="text-sm"
                  tick={{ fill: "currentColor" }}
                />
                <YAxis className="text-sm" tick={{ fill: "currentColor" }} />
                <Tooltip content={<CustomTooltip />} />
                <Legend
                  wrapperStyle={{ paddingTop: "20px" }}
                  formatter={(value) => {
                    const labels: Record<string, string> = {
                      xp: "النقاط",
                      score: "الدرجة %",
                      lessons: "الدروس",
                      quizzes: "الاختبارات",
                    };
                    return labels[value] || value;
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="xp"
                  stroke={CHART_COLORS.hex.info}
                  fillOpacity={1}
                  fill="url(#colorXP)"
                  strokeWidth={2}
                  name="xp"
                />
                <Area
                  type="monotone"
                  dataKey="score"
                  stroke={CHART_COLORS.hex.primary}
                  fillOpacity={1}
                  fill="url(#colorScore)"
                  strokeWidth={2}
                  name="score"
                />
              </AreaChart>
            ) : (
              <LineChart
                data={data}
                margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis
                  dataKey={xKey}
                  className="text-sm"
                  tick={{ fill: "currentColor" }}
                />
                <YAxis className="text-sm" tick={{ fill: "currentColor" }} />
                <Tooltip content={<CustomTooltip />} />
                <Legend
                  wrapperStyle={{ paddingTop: "20px" }}
                  formatter={(value) => {
                    const labels: Record<string, string> = {
                      lessons: "الدروس",
                      quizzes: "الاختبارات",
                      xp: "النقاط",
                      score: "الدرجة %",
                    };
                    return labels[value] || value;
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="lessons"
                  stroke={CHART_COLORS.hex.info}
                  strokeWidth={3}
                  dot={{ r: 5 }}
                  activeDot={{ r: 7 }}
                  name="lessons"
                />
                <Line
                  type="monotone"
                  dataKey="quizzes"
                  stroke={CHART_COLORS.hex.primary}
                  strokeWidth={3}
                  dot={{ r: 5 }}
                  activeDot={{ r: 7 }}
                  name="quizzes"
                />
              </LineChart>
            )}
          </ResponsiveContainer>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
          {[
            {
              label: "إجمالي الدروس",
              value: data.reduce((sum, d) => sum + d.lessons, 0),
              color: "from-blue-500 to-cyan-500",
            },
            {
              label: "إجمالي الاختبارات",
              value: data.reduce((sum, d) => sum + d.quizzes, 0),
              color: "from-purple-500 to-pink-500",
            },
            {
              label: "إجمالي النقاط",
              value: data.reduce((sum, d) => sum + d.xp, 0),
              color: "from-green-500 to-emerald-500",
            },
            {
              label: "متوسط الدرجة",
              value:
                Math.round(
                  data.reduce((sum, d) => sum + d.score, 0) / data.length,
                ) + "%",
              color: "from-orange-500 to-red-500",
            },
          ].map((stat, index) => (
            <div
              key={index}
              className={`bg-gradient-to-br ${stat.color} rounded-xl p-4 text-white`}
            >
              <div className="text-2xl font-bold">{stat.value}</div>
              <div className="text-sm opacity-90">{stat.label}</div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export default ProgressChart;
