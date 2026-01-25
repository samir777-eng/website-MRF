"use client";

import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, Minus, Flame, Target } from "lucide-react";
import { StudentSummary } from "@/types/analytics";
import Link from "next/link";

interface StudentPerformanceCardProps {
  student: StudentSummary;
  rank?: number;
  showDetails?: boolean;
}

export function StudentPerformanceCard({ student, rank, showDetails: _showDetails = false }: StudentPerformanceCardProps) {
  const trendIcons = {
    improving: <TrendingUp className="text-green-400" size={16} />,
    stable: <Minus className="text-gray-400" size={16} />,
    declining: <TrendingDown className="text-red-400" size={16} />,
  };

  const trendColors = {
    improving: "text-green-400",
    stable: "text-gray-400",
    declining: "text-red-400",
  };

  const trendLabels = {
    improving: "تحسن",
    stable: "مستقر",
    declining: "تراجع",
  };

  return (
    <Link href={`/ar/educator/students/${student.id}`}>
      <motion.div
        whileHover={{ scale: 1.02 }}
        className="flex items-center gap-4 p-3 bg-gray-900/50 rounded-xl hover:bg-gray-800/50 transition-colors cursor-pointer"
      >
        {/* Rank */}
        {rank && (
          <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
            rank === 1 ? "bg-yellow-500 text-black" :
            rank === 2 ? "bg-gray-400 text-black" :
            rank === 3 ? "bg-amber-700 text-white" :
            "bg-gray-700 text-gray-300"
          }`}>
            {rank}
          </div>
        )}

        {/* Avatar */}
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold">
          {student.avatar || student.name.charAt(0)}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <h3 className="font-medium text-white truncate">{student.name}</h3>
          <div className="flex items-center gap-3 text-sm text-gray-400">
            <span className="flex items-center gap-1">
              <Target size={12} />
              المستوى {student.level}
            </span>
            <span className="flex items-center gap-1">
              <Flame size={12} className="text-orange-400" />
              {student.streak} يوم
            </span>
          </div>
        </div>

        {/* Stats */}
        <div className="text-left">
          <p className="text-sm font-medium text-purple-400">{student.totalXP.toLocaleString("ar-EG")} XP</p>
          <div className="flex items-center gap-1 text-sm">
            {trendIcons[student.trend]}
            <span className={trendColors[student.trend]}>{trendLabels[student.trend]}</span>
          </div>
        </div>

        {/* Accuracy */}
        <div className="w-16 text-left">
          <div className="text-sm font-bold text-white">{student.accuracy}%</div>
          <div className="w-full h-1.5 bg-gray-700 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full ${
                student.accuracy >= 85 ? "bg-green-500" :
                student.accuracy >= 70 ? "bg-yellow-500" :
                "bg-red-500"
              }`}
              style={{ width: `${student.accuracy}%` }}
            />
          </div>
        </div>
      </motion.div>
    </Link>
  );
}

// Compact version for lists
export function StudentCompactCard({ student }: { student: StudentSummary }) {
  const isActive = Date.now() - new Date(student.lastActiveAt).getTime() < 24 * 60 * 60 * 1000;

  return (
    <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-800/50 transition-colors">
      <div className="relative">
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-sm font-bold">
          {student.name.charAt(0)}
        </div>
        {isActive && (
          <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-gray-900" />
        )}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm text-white truncate">{student.name}</p>
        <p className="text-sm text-gray-400">مستوى {student.level}</p>
      </div>
      <div className="text-sm text-gray-400">{student.accuracy}%</div>
    </div>
  );
}

