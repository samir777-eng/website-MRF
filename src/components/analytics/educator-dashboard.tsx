"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Users, Activity, TrendingUp, Bell, Award, Calendar, ChevronDown } from "lucide-react";
import { DashboardSummary, TimeRange, getTimeRangeLabel } from "@/types/analytics";
import { StudentPerformanceCard } from "./student-performance-card";
import { AlertsList } from "./alerts-list";

export function EducatorDashboard() {
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<TimeRange>("week");

  useEffect(() => {
    fetchDashboard();
  }, [timeRange]);

  async function fetchDashboard() {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/analytics/dashboard?range=${timeRange}`);
      const data = await res.json();
      if (data.success) {
        setSummary(data.summary);
      }
    } catch (error) {
      console.error("Failed to fetch dashboard:", error);
    } finally {
      setIsLoading(false);
    }
  }

  const timeRanges: TimeRange[] = ["today", "week", "month", "semester"];

  if (isLoading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-32 bg-gray-800 rounded-2xl" />
          ))}
        </div>
      </div>
    );
  }

  if (!summary) return null;

  const stats = [
    { icon: Users, label: "إجمالي الطلاب", value: summary.totalStudents, color: "blue" },
    { icon: Activity, label: "نشطون اليوم", value: summary.activeToday, color: "green" },
    { icon: Calendar, label: "نشطون هذا الأسبوع", value: summary.activeThisWeek, color: "purple" },
    { icon: TrendingUp, label: "متوسط المشاركة", value: `${summary.averageEngagement}%`, color: "amber" },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">لوحة تحكم المعلم</h1>
          <p className="text-gray-400">تتبع تقدم طلابك</p>
        </div>
        <div className="flex items-center gap-2 bg-gray-800 rounded-xl p-1">
          {timeRanges.map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                timeRange === range ? "bg-purple-500 text-white" : "text-gray-300 hover:bg-gray-700"
              }`}
            >
              {getTimeRangeLabel(range).ar}
            </button>
          ))}
        </div>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="p-5 bg-gray-800/50 border border-gray-700/50 rounded-2xl"
          >
            <stat.icon className={`text-${stat.color}-400 mb-3`} size={28} />
            <p className="text-3xl font-bold text-white">{stat.value}</p>
            <p className="text-gray-400 text-sm">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Weekly trend */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <TrendCard label="نمو النقاط" value={summary.weeklyTrend.xpGrowth} />
        <TrendCard label="نمو النشاط" value={summary.weeklyTrend.activityGrowth} />
        <TrendCard label="تغيير الأداء" value={summary.weeklyTrend.performanceChange} />
      </div>

      {/* Top performers and alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="p-6 bg-gray-800/50 border border-gray-700/50 rounded-2xl">
          <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2"><Award className="text-yellow-400" /> المتفوقون</h2>
          <div className="space-y-3">
            {summary.topAchievers.slice(0, 5).map((student, index) => (
              <StudentPerformanceCard key={student.id} student={student} rank={index + 1} />
            ))}
          </div>
        </div>

        <div className="p-6 bg-gray-800/50 border border-gray-700/50 rounded-2xl">
          <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2"><Bell className="text-red-400" /> التنبيهات</h2>
          <AlertsList alerts={summary.recentAlerts} />
        </div>
      </div>
    </div>
  );
}

function TrendCard({ label, value }: { label: string; value: number }) {
  const isPositive = value >= 0;
  return (
    <div className="p-4 bg-gray-800/50 border border-gray-700/50 rounded-xl">
      <p className="text-gray-400 text-sm mb-1">{label}</p>
      <p className={`text-2xl font-bold ${isPositive ? "text-green-400" : "text-red-400"}`}>
        {isPositive ? "+" : ""}{value.toFixed(1)}%
      </p>
    </div>
  );
}

