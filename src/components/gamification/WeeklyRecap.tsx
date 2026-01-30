"use client";

/**
 * Weekly Progress Recap
 * Animated summary of user's weekly learning progress
 */

import { useGamification } from "@/contexts/GamificationContext";
import { AnimatePresence, motion } from "framer-motion";
import {
  Award,
  Book,
  Calendar,
  ChevronRight,
  Clock,
  Flame,
  Sparkles,
  Star,
  Target,
  TrendingUp,
  Trophy,
  X,
  Zap,
} from "lucide-react";
import { useEffect, useState } from "react";

interface WeeklyRecapProps {
  isOpen: boolean;
  onClose: () => void;
  weekData?: WeeklyStats;
}

interface WeeklyStats {
  xpEarned: number;
  xpChange: number; // % compared to last week
  lessonsCompleted: number;
  lessonsChange: number;
  quizzesTaken: number;
  quizzesChange: number;
  perfectScores: number;
  studyMinutes: number;
  studyChange: number;
  streakDays: number;
  streakBest: boolean; // Is this their best streak?
  achievementsUnlocked: string[];
  daysActive: number;
  topSubject?: string;
  rank?: number;
  rankChange?: number;
}

// Default demo data
const DEFAULT_WEEK_DATA: WeeklyStats = {
  xpEarned: 2450,
  xpChange: 23,
  lessonsCompleted: 12,
  lessonsChange: 50,
  quizzesTaken: 8,
  quizzesChange: -10,
  perfectScores: 3,
  studyMinutes: 185,
  studyChange: 15,
  streakDays: 7,
  streakBest: true,
  achievementsUnlocked: ["first-week", "quiz-master"],
  daysActive: 6,
  topSubject: "النحو",
  rank: 42,
  rankChange: 15,
};

export function WeeklyRecap({ isOpen, onClose, weekData }: WeeklyRecapProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const { userStats } = useGamification();

  // Use provided data or demo data
  const data = weekData || DEFAULT_WEEK_DATA;

  // Auto-advance slides
  useEffect(() => {
    if (!isOpen) return;

    const timer = setTimeout(() => {
      if (currentSlide < 4) {
        setCurrentSlide((prev) => prev + 1);
      }
    }, 4000);

    return () => clearTimeout(timer);
  }, [isOpen, currentSlide]);

  // Reset on close
  useEffect(() => {
    if (!isOpen) {
      setCurrentSlide(0);
    }
  }, [isOpen]);

  const handleNext = () => {
    if (currentSlide < 4) {
      setCurrentSlide((prev) => prev + 1);
    } else {
      onClose();
    }
  };

  const handleSkip = () => {
    onClose();
  };

  const slides = [
    { id: "intro", component: <IntroSlide data={data} /> },
    { id: "xp", component: <XPSlide data={data} /> },
    { id: "progress", component: <ProgressSlide data={data} /> },
    { id: "streak", component: <StreakSlide data={data} /> },
    {
      id: "summary",
      component: <SummarySlide data={data} userStats={userStats} />,
    },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4"
          onClick={handleSkip}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            className="relative w-full max-w-md overflow-hidden rounded-3xl bg-gradient-to-br from-purple-600 via-purple-700 to-indigo-800 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
           
          >
            {/* Close button */}
            <button
              onClick={handleSkip}
              className="absolute top-4 start-4 z-10 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
            >
              <X className="w-5 h-5 text-white" />
            </button>

            {/* Skip button */}
            <button
              onClick={handleSkip}
              className="absolute top-4 end-4 z-10 text-sm text-white/60 hover:text-white transition-colors"
            >
              تخطي
            </button>

            {/* Slide content */}
            <div className="min-h-[500px] flex flex-col">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentSlide}
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  transition={{ duration: 0.3 }}
                  className="flex-1"
                >
                  {slides[currentSlide].component}
                </motion.div>
              </AnimatePresence>

              {/* Progress dots & Next button */}
              <div className="p-6 flex items-center justify-between">
                <div className="flex gap-2">
                  {slides.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentSlide(index)}
                      className={`w-2 h-2 rounded-full transition-all ${
                        index === currentSlide
                          ? "bg-white w-6"
                          : index < currentSlide
                            ? "bg-white/60"
                            : "bg-white/30"
                      }`}
                    />
                  ))}
                </div>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleNext}
                  className="flex items-center gap-2 px-6 py-3 bg-white text-purple-700 rounded-full font-bold shadow-lg"
                >
                  {currentSlide === 4 ? "إغلاق" : "التالي"}
                  <ChevronRight className="w-5 h-5 rotate-180" />
                </motion.button>
              </div>
            </div>

            {/* Decorative elements */}
            <div className="absolute top-0 end-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 start-0 w-48 h-48 bg-pink-500/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ============================================================================
// SLIDE COMPONENTS
// ============================================================================

function IntroSlide({ data }: { data: WeeklyStats }) {
  return (
    <div className="p-8 pt-16 text-center text-white">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", delay: 0.2 }}
        className="w-24 h-24 mx-auto mb-6 bg-white/20 rounded-full flex items-center justify-center"
      >
        <Calendar className="w-12 h-12" />
      </motion.div>

      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="text-3xl font-bold mb-3"
      >
        ملخص الأسبوع
      </motion.h2>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="text-white/70 text-lg mb-8"
      >
        لنرى ما أنجزته هذا الأسبوع!
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 rounded-full"
      >
        <Flame className="w-5 h-5 text-orange-400" />
        <span>{data.daysActive} أيام نشاط</span>
      </motion.div>
    </div>
  );
}

function XPSlide({ data }: { data: WeeklyStats }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const duration = 1500;
    const steps = 60;
    const increment = data.xpEarned / steps;
    let current = 0;

    const timer = setInterval(() => {
      current += increment;
      if (current >= data.xpEarned) {
        setCount(data.xpEarned);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [data.xpEarned]);

  return (
    <div className="p-8 pt-16 text-center text-white">
      <motion.div
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: "spring", delay: 0.2 }}
        className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-lg shadow-yellow-500/30"
      >
        <Zap className="w-10 h-10 text-white" />
      </motion.div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="text-white/70 mb-2"
      >
        كسبت هذا الأسبوع
      </motion.p>

      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="mb-4"
      >
        <span className="text-6xl font-bold">
          {count.toLocaleString("ar-EG")}
        </span>
        <span className="text-2xl me-2">XP</span>
      </motion.div>

      {data.xpChange !== 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className={`inline-flex items-center gap-2 px-4 py-2 rounded-full ${
            data.xpChange > 0
              ? "bg-green-500/20 text-green-300"
              : "bg-red-500/20 text-red-300"
          }`}
        >
          <TrendingUp
            className={`w-5 h-5 ${data.xpChange < 0 ? "rotate-180" : ""}`}
          />
          <span>
            {Math.abs(data.xpChange)}% {data.xpChange > 0 ? "أكثر" : "أقل"} من
            الأسبوع الماضي
          </span>
        </motion.div>
      )}
    </div>
  );
}

function ProgressSlide({ data }: { data: WeeklyStats }) {
  const stats = [
    {
      icon: Book,
      label: "الدروس",
      value: data.lessonsCompleted,
      change: data.lessonsChange,
      color: "from-blue-400 to-blue-600",
    },
    {
      icon: Target,
      label: "الاختبارات",
      value: data.quizzesTaken,
      change: data.quizzesChange,
      color: "from-green-400 to-green-600",
    },
    {
      icon: Star,
      label: "درجات كاملة",
      value: data.perfectScores,
      color: "from-yellow-400 to-orange-500",
    },
    {
      icon: Clock,
      label: "وقت الدراسة",
      value: `${Math.floor(data.studyMinutes / 60)}س ${data.studyMinutes % 60}د`,
      change: data.studyChange,
      color: "from-pink-400 to-pink-600",
    },
  ];

  return (
    <div className="p-8 pt-14 text-white">
      <motion.h3
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-xl font-bold mb-6 text-center"
      >
        إنجازات الأسبوع
      </motion.h3>

      <div className="space-y-4">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.15 }}
            className="flex items-center gap-4 p-4 bg-white/10 rounded-2xl backdrop-blur-sm"
          >
            <div
              className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center shadow-lg`}
            >
              <stat.icon className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <p className="text-white/60 text-sm">{stat.label}</p>
              <p className="text-xl font-bold">
                {typeof stat.value === "number"
                  ? stat.value.toLocaleString("ar-EG")
                  : stat.value}
              </p>
            </div>
            {stat.change !== undefined && stat.change !== 0 && (
              <div
                className={`text-sm ${stat.change > 0 ? "text-green-400" : "text-red-400"}`}
              >
                {stat.change > 0 ? "+" : ""}
                {stat.change}%
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function StreakSlide({ data }: { data: WeeklyStats }) {
  return (
    <div className="p-8 pt-16 text-center text-white">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", delay: 0.2 }}
        className="relative w-32 h-32 mx-auto mb-6"
      >
        {/* Fire animation */}
        <motion.div
          animate={{
            scale: [1, 1.1, 1],
            rotate: [0, 5, -5, 0],
          }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute inset-0 bg-gradient-to-t from-orange-600 via-orange-500 to-yellow-400 rounded-full blur-xl opacity-60"
        />
        <div className="relative w-full h-full bg-gradient-to-t from-orange-600 via-orange-500 to-yellow-400 rounded-full flex items-center justify-center shadow-2xl shadow-orange-500/50">
          <Flame className="w-16 h-16 text-white" />
        </div>
      </motion.div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="text-white/70 mb-2"
      >
        سلسلة التعلم
      </motion.p>

      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.4, type: "spring" }}
        className="mb-4"
      >
        <span className="text-7xl font-bold">
          {data.streakDays.toLocaleString("ar-EG")}
        </span>
        <span className="text-2xl me-2">يوم</span>
      </motion.div>

      {data.streakBest && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full shadow-lg"
        >
          <Trophy className="w-5 h-5" />
          <span className="font-bold">رقم قياسي جديد!</span>
        </motion.div>
      )}

      {/* Streak days visualization */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="flex justify-center gap-2 mt-8"
      >
        {Array.from({ length: 7 }).map((_, i) => (
          <motion.div
            key={i}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.8 + i * 0.1 }}
            className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold ${
              i < data.daysActive
                ? "bg-white/20 text-white"
                : "bg-white/5 text-white/30"
            }`}
          >
            {["س", "ح", "ن", "ث", "ر", "خ", "ج"][i]}
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}

function SummarySlide({
  data,
  userStats,
}: {
  data: WeeklyStats;
  userStats: { totalXP: number; level: number };
}) {
  const highlights = [
    data.streakBest && "رقم قياسي جديد في السلسلة",
    data.perfectScores > 0 && `${data.perfectScores} درجات كاملة`,
    data.xpChange > 20 && "تحسن كبير هذا الأسبوع",
    data.topSubject && `تميزت في ${data.topSubject}`,
  ].filter(Boolean);

  return (
    <div className="p-8 pt-14 text-white">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring" }}
        className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full flex items-center justify-center"
      >
        <Sparkles className="w-8 h-8" />
      </motion.div>

      <motion.h3
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-2xl font-bold mb-2 text-center"
      >
        أسبوع رائع!
      </motion.h3>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="text-white/60 text-center mb-6"
      >
        استمر في العمل الجاد
      </motion.p>

      {/* Level & XP Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="p-4 bg-white/10 rounded-2xl mb-4"
      >
        <div className="flex items-center justify-between mb-3">
          <span className="text-white/60">مستواك الحالي</span>
          <span className="text-2xl font-bold">
            المستوى {userStats.level.toLocaleString("ar-EG")}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-white/60">إجمالي XP</span>
          <span className="text-xl font-bold">
            {userStats.totalXP.toLocaleString("ar-EG")}
          </span>
        </div>
      </motion.div>

      {/* Highlights */}
      {highlights.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="space-y-2"
        >
          <p className="text-sm text-white/60 mb-2">أبرز الإنجازات</p>
          {highlights.map((highlight, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 + index * 0.1 }}
              className="flex items-center gap-3 p-3 bg-white/10 rounded-xl"
            >
              <Award className="w-5 h-5 text-yellow-400" />
              <span>{highlight}</span>
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* Rank */}
      {data.rank && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="mt-4 p-4 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 rounded-2xl border border-yellow-500/30"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Trophy className="w-6 h-6 text-yellow-400" />
              <span>ترتيبك</span>
            </div>
            <div className="text-start">
              <span className="text-2xl font-bold">#{data.rank}</span>
              {data.rankChange && data.rankChange > 0 && (
                <span className="text-green-400 text-sm me-2">
                  +{data.rankChange}
                </span>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}

export default WeeklyRecap;
