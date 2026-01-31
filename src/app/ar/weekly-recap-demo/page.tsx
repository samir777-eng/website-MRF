"use client";

/**
 * Weekly Recap Demo Page
 */

import { WeeklyRecap } from "@/components/gamification/WeeklyRecap";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  BarChart3,
  Calendar,
  ChevronDown,
  Flame,
  Sparkles,
  Trophy,
  Zap,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

// Different week scenarios to demo
const WEEK_SCENARIOS = {
  great: {
    name: "أسبوع رائع",
    data: {
      xpEarned: 3200,
      xpChange: 45,
      lessonsCompleted: 18,
      lessonsChange: 80,
      quizzesTaken: 12,
      quizzesChange: 20,
      perfectScores: 5,
      studyMinutes: 280,
      studyChange: 35,
      streakDays: 7,
      streakBest: true,
      achievementsUnlocked: ["week-champion", "perfect-week"],
      daysActive: 7,
      topSubject: "البلاغة",
      rank: 15,
      rankChange: 28,
    },
  },
  average: {
    name: "أسبوع عادي",
    data: {
      xpEarned: 1500,
      xpChange: 5,
      lessonsCompleted: 8,
      lessonsChange: 0,
      quizzesTaken: 5,
      quizzesChange: -10,
      perfectScores: 1,
      studyMinutes: 120,
      studyChange: -5,
      streakDays: 4,
      streakBest: false,
      achievementsUnlocked: [],
      daysActive: 4,
      topSubject: "النحو",
      rank: 89,
      rankChange: 3,
    },
  },
  comeback: {
    name: "عودة قوية",
    data: {
      xpEarned: 2800,
      xpChange: 120,
      lessonsCompleted: 15,
      lessonsChange: 200,
      quizzesTaken: 10,
      quizzesChange: 100,
      perfectScores: 3,
      studyMinutes: 200,
      studyChange: 150,
      streakDays: 5,
      streakBest: false,
      achievementsUnlocked: ["comeback-king"],
      daysActive: 5,
      topSubject: "الأدب",
      rank: 45,
      rankChange: 55,
    },
  },
};

export default function WeeklyRecapDemoPage() {
  const [isRecapOpen, setIsRecapOpen] = useState(false);
  const [selectedScenario, setSelectedScenario] =
    useState<keyof typeof WEEK_SCENARIOS>("great");

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 dark:from-gray-900 dark:via-gray-950 dark:to-purple-950"
      dir="rtl"
    >
      {/* Header */}
      <header className="sticky top-0 z-40 backdrop-blur-lg bg-white/80 dark:bg-gray-900/80 border-b border-gray-200/50 dark:border-gray-800/50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              href="/ar/dashboard"
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="font-display text-xl font-bold">ملخص الأسبوع</h1>
              <p className="text-sm text-gray-500">عرض توضيحي</p>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-xl shadow-purple-500/25">
            <BarChart3 className="w-12 h-12 text-white" />
          </div>

          <h2 className="font-display text-3xl font-bold mb-3">
            ملخص أسبوعي تفاعلي
          </h2>
          <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto mb-8">
            يظهر للطلاب في نهاية كل أسبوع لعرض إنجازاتهم وتحفيزهم على الاستمرار
          </p>
        </motion.section>

        {/* Scenario Selector */}
        <section className="max-w-md mx-auto mb-8">
          <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
            اختر سيناريو
          </label>
          <div className="relative">
            <select
              value={selectedScenario}
              onChange={(e) =>
                setSelectedScenario(
                  e.target.value as keyof typeof WEEK_SCENARIOS,
                )
              }
              className="w-full p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl appearance-none text-lg font-medium"
            >
              {Object.entries(WEEK_SCENARIOS).map(([key, { name }]) => (
                <option key={key} value={key}>
                  {name}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          </div>
        </section>

        {/* Preview Stats */}
        <section className="max-w-md mx-auto mb-8">
          <div className="grid grid-cols-2 gap-4">
            <StatPreview
              icon={<Zap className="w-5 h-5" />}
              label="XP مكتسب"
              value={WEEK_SCENARIOS[
                selectedScenario
              ].data.xpEarned.toLocaleString("ar-EG")}
              color="yellow"
            />
            <StatPreview
              icon={<Flame className="w-5 h-5" />}
              label="أيام السلسلة"
              value={WEEK_SCENARIOS[
                selectedScenario
              ].data.streakDays.toLocaleString("ar-EG")}
              color="orange"
            />
            <StatPreview
              icon={<Trophy className="w-5 h-5" />}
              label="الترتيب"
              value={`#${WEEK_SCENARIOS[selectedScenario].data.rank}`}
              color="purple"
            />
            <StatPreview
              icon={<Calendar className="w-5 h-5" />}
              label="أيام نشاط"
              value={WEEK_SCENARIOS[
                selectedScenario
              ].data.daysActive.toLocaleString("ar-EG")}
              color="blue"
            />
          </div>
        </section>

        {/* Open Button */}
        <section className="text-center">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setIsRecapOpen(true)}
            className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold rounded-xl shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 transition-all text-lg"
          >
            <Sparkles className="w-6 h-6" />
            عرض الملخص الأسبوعي
          </motion.button>
        </section>

        {/* Features */}
        <section className="mt-16 grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          <FeatureCard
            icon={<BarChart3 className="w-8 h-8" />}
            title="إحصائيات مفصلة"
            description="عرض XP، الدروس، الاختبارات، وقت الدراسة، ومقارنة بالأسبوع السابق"
            color="purple"
          />
          <FeatureCard
            icon={<Flame className="w-8 h-8" />}
            title="تتبع السلسلة"
            description="عرض سلسلة التعلم مع تنبيه للأرقام القياسية الجديدة"
            color="orange"
          />
          <FeatureCard
            icon={<Trophy className="w-8 h-8" />}
            title="الترتيب والإنجازات"
            description="عرض الترتيب والتغير وأبرز الإنجازات"
            color="yellow"
          />
        </section>
      </main>

      {/* Weekly Recap Modal */}
      <WeeklyRecap
        isOpen={isRecapOpen}
        onClose={() => setIsRecapOpen(false)}
        weekData={WEEK_SCENARIOS[selectedScenario].data}
      />
    </div>
  );
}

// Sub-components
function StatPreview({
  icon,
  label,
  value,
  color,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  color: "yellow" | "orange" | "purple" | "blue";
}) {
  const colorClasses = {
    yellow:
      "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400",
    orange:
      "bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400",
    purple:
      "bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400",
    blue: "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400",
  };

  return (
    <div className="p-4 bg-white dark:bg-gray-800/50 rounded-xl shadow-sm">
      <div
        className={`w-10 h-10 ${colorClasses[color]} rounded-lg flex items-center justify-center mb-3`}
      >
        {icon}
      </div>
      <p className="text-sm text-gray-500 dark:text-gray-400">{label}</p>
      <p className="text-xl font-bold">{value}</p>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  description,
  color,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  color: "purple" | "orange" | "yellow";
}) {
  const colorClasses = {
    purple:
      "bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400",
    orange:
      "bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400",
    yellow:
      "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-6 bg-white dark:bg-gray-800/50 rounded-xl shadow-lg"
    >
      <div
        className={`w-14 h-14 ${colorClasses[color]} rounded-xl flex items-center justify-center mb-4`}
      >
        {icon}
      </div>
      <h3 className="font-bold text-lg mb-2">{title}</h3>
      <p className="text-gray-600 dark:text-gray-400 text-sm">{description}</p>
    </motion.div>
  );
}
