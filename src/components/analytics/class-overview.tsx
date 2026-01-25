"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Users, Target, Flame, BarChart3, AlertTriangle, Award } from "lucide-react";
import { ClassOverview as ClassOverviewType } from "@/types/analytics";
import { StudentPerformanceCard } from "./student-performance-card";

interface ClassOverviewProps {
  classId: string;
}

export function ClassOverview({ classId }: ClassOverviewProps) {
  const [overview, setOverview] = useState<ClassOverviewType | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchOverview();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [classId]);

  async function fetchOverview() {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/analytics/class?classId=${classId}`);
      const data = await res.json();
      if (data.success) {
        setOverview(data.overview);
      }
    } catch (error) {
      console.error("Failed to fetch class overview:", error);
    } finally {
      setIsLoading(false);
    }
  }

  if (isLoading) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-24 bg-gray-800 rounded-2xl" />
        <div className="grid grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-20 bg-gray-800 rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  if (!overview) return null;

  const stats = [
    { icon: Users, label: "الطلاب النشطون", value: `${overview.activeStudents}/${overview.totalStudents}`, color: "blue" },
    { icon: Target, label: "متوسط المستوى", value: overview.averageLevel.toFixed(1), color: "purple" },
    { icon: BarChart3, label: "متوسط الدقة", value: `${overview.averageAccuracy}%`, color: "green" },
    { icon: Flame, label: "متوسط السلسلة", value: `${overview.averageStreak} يوم`, color: "orange" },
  ];

  return (
    <div className="space-y-6">
      {/* Class header */}
      <div className="p-6 bg-gradient-to-r from-purple-900/50 to-pink-900/50 border border-purple-500/20 rounded-2xl">
        <h2 className="text-2xl font-bold text-white mb-2">{overview.className}</h2>
        <p className="text-purple-200">الصف {overview.gradeLevel === "1" ? "الأول" : overview.gradeLevel === "2" ? "الثاني" : "الثالث"} الثانوي</p>
        <div className="mt-4 flex items-center gap-2">
          <span className="px-3 py-1 bg-purple-500/20 text-purple-300 rounded-full text-sm">
            {overview.totalStudents} طالب
          </span>
          <span className="px-3 py-1 bg-green-500/20 text-green-300 rounded-full text-sm">
            متوسط {overview.averageXP.toLocaleString("ar-EG")} XP
          </span>
        </div>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="p-4 bg-gray-800/50 border border-gray-700/50 rounded-xl"
          >
            <stat.icon className={`text-${stat.color}-400 mb-2`} size={24} />
            <p className="text-2xl font-bold text-white">{stat.value}</p>
            <p className="text-gray-400 text-sm">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Top performers and needs attention */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="p-5 bg-gray-800/50 border border-gray-700/50 rounded-2xl">
          <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <Award className="text-yellow-400" /> المتفوقون
          </h3>
          <div className="space-y-2">
            {overview.topPerformers.map((student, index) => (
              <StudentPerformanceCard key={student.id} student={student} rank={index + 1} />
            ))}
          </div>
        </div>

        <div className="p-5 bg-gray-800/50 border border-gray-700/50 rounded-2xl">
          <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <AlertTriangle className="text-red-400" /> يحتاجون اهتمام
          </h3>
          {overview.needsAttention.length === 0 ? (
            <div className="text-center py-8 text-gray-400">
              <Users className="mx-auto mb-3 opacity-50" size={32} />
              <p>جميع الطلاب في أداء جيد</p>
            </div>
          ) : (
            <div className="space-y-2">
              {overview.needsAttention.map((student) => (
                <StudentPerformanceCard key={student.id} student={student} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

