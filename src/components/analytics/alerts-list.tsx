"use client";

import { motion } from "framer-motion";
import { AlertTriangle, TrendingDown, Clock, Trophy, Bell, Check } from "lucide-react";
import { EducatorAlert } from "@/types/analytics";

interface AlertsListProps {
  alerts: EducatorAlert[];
  onDismiss?: (alertId: string) => void;
}

export function AlertsList({ alerts, onDismiss }: AlertsListProps) {
  const alertIcons = {
    streak_lost: <Clock className="text-orange-400" size={18} />,
    low_activity: <AlertTriangle className="text-yellow-400" size={18} />,
    declining_performance: <TrendingDown className="text-red-400" size={18} />,
    achievement_unlocked: <Trophy className="text-green-400" size={18} />,
  };

  const severityStyles = {
    info: "border-blue-500/30 bg-blue-900/10",
    warning: "border-yellow-500/30 bg-yellow-900/10",
    critical: "border-red-500/30 bg-red-900/10",
  };

  if (alerts.length === 0) {
    return (
      <div className="text-center py-8 text-gray-400">
        <Bell className="mx-auto mb-3 opacity-50" size={32} />
        <p>لا توجد تنبيهات جديدة</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {alerts.map((alert, index) => (
        <motion.div
          key={alert.id}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.1 }}
          className={`relative p-4 rounded-xl border ${severityStyles[alert.severity]} ${
            alert.isRead ? "opacity-60" : ""
          }`}
        >
          <div className="flex items-start gap-3">
            <div className="mt-0.5">{alertIcons[alert.type]}</div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-medium text-white">{alert.studentName}</span>
                {!alert.isRead && (
                  <span className="w-2 h-2 bg-purple-500 rounded-full" />
                )}
              </div>
              <p className="text-gray-300 text-sm">{alert.messageAr}</p>
              <p className="text-gray-500 text-sm mt-1">{formatTimeAgo(alert.createdAt)}</p>
            </div>
            {onDismiss && !alert.isRead && (
              <button
                onClick={() => onDismiss(alert.id)}
                className="p-1 hover:bg-gray-700 rounded-lg transition-colors"
                aria-label="تحديد كمقروء"
              >
                <Check size={16} className="text-gray-400" />
              </button>
            )}
          </div>
        </motion.div>
      ))}
    </div>
  );
}

function formatTimeAgo(date: Date): string {
  const seconds = Math.floor((Date.now() - new Date(date).getTime()) / 1000);
  if (seconds < 60) return "الآن";
  if (seconds < 3600) return `منذ ${Math.floor(seconds / 60)} دقيقة`;
  if (seconds < 86400) return `منذ ${Math.floor(seconds / 3600)} ساعة`;
  if (seconds < 604800) return `منذ ${Math.floor(seconds / 86400)} يوم`;
  return new Date(date).toLocaleDateString("ar-EG");
}

