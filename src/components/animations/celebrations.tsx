"use client";

import { CELEBRATION_COLORS } from "@/lib/design-tokens";
import { AnimatePresence, motion } from "framer-motion";
import {
  Award,
  Flame,
  Sparkles,
  Star,
  Target,
  Trophy,
  Zap,
} from "lucide-react";
import { useEffect, useState } from "react";

// XP Gain Animation - shows floating +XP numbers
interface XPGainProps {
  amount: number;
  show: boolean;
  onComplete?: () => void;
}

export function XPGainAnimation({ amount, show, onComplete }: XPGainProps) {
  return (
    <AnimatePresence onExitComplete={onComplete}>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: 0, scale: 0.5 }}
          animate={{ opacity: 1, y: -60, scale: 1 }}
          exit={{ opacity: 0, y: -100, scale: 0.8 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[200] pointer-events-none"
        >
          <div className="flex items-center gap-2 text-3xl font-bold text-yellow-500 drop-shadow-lg">
            <Zap className="w-8 h-8 fill-yellow-400" />
            <span>+{amount} XP</span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// Level Up Celebration
interface LevelUpProps {
  level: number;
  show: boolean;
  onComplete?: () => void;
}

export function LevelUpCelebration({ level, show, onComplete }: LevelUpProps) {
  return (
    <AnimatePresence onExitComplete={onComplete}>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 backdrop-blur-sm"
        >
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            exit={{ scale: 0, rotate: 180 }}
            transition={{ type: "spring", damping: 15, stiffness: 200 }}
            className="relative"
          >
            {/* Sparkle effects */}
            {[...Array(8)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0 }}
                animate={{
                  opacity: [0, 1, 0],
                  scale: [0, 1.5, 0],
                  x: Math.cos((i * Math.PI * 2) / 8) * 120,
                  y: Math.sin((i * Math.PI * 2) / 8) * 120,
                }}
                transition={{ delay: 0.2, duration: 0.8 }}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
              >
                <Sparkles className="w-6 h-6 text-yellow-400" />
              </motion.div>
            ))}

            <div className="bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full p-8 shadow-2xl">
              <div className="bg-white rounded-full p-6">
                <div className="text-center">
                  <motion.div
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ repeat: 3, duration: 0.3 }}
                  >
                    <Star className="w-16 h-16 text-yellow-500 fill-yellow-400 mx-auto" />
                  </motion.div>
                  <p className="text-sm text-gray-600 mt-2">مستوى جديد!</p>
                  <p className="text-4xl font-bold text-gray-900">{level}</p>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// Achievement Unlock Animation
interface AchievementUnlockProps {
  title: string;
  description: string;
  icon?: "trophy" | "star" | "target" | "flame" | "award";
  show: boolean;
  onComplete?: () => void;
}

const achievementIcons = {
  trophy: Trophy,
  star: Star,
  target: Target,
  flame: Flame,
  award: Award,
};

export function AchievementUnlock({
  title,
  description,
  icon = "trophy",
  show,
  onComplete,
}: AchievementUnlockProps) {
  const Icon = achievementIcons[icon];

  useEffect(() => {
    if (show) {
      const timer = setTimeout(() => onComplete?.(), 4000);
      return () => clearTimeout(timer);
    }
  }, [show, onComplete]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ x: 400, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: 400, opacity: 0 }}
          transition={{ type: "spring", damping: 20, stiffness: 200 }}
          className="fixed top-20 left-4 z-[200] max-w-sm"
        >
          <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl p-1 shadow-2xl">
            <div className="bg-white dark:bg-gray-900 rounded-lg p-4 flex items-center gap-4">
              <motion.div
                animate={{ rotate: [0, -10, 10, 0], scale: [1, 1.1, 1] }}
                transition={{ repeat: 2, duration: 0.5 }}
                className="bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full p-3"
              >
                <Icon className="w-8 h-8 text-white" />
              </motion.div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-purple-600 font-semibold">
                  🎉 إنجاز جديد!
                </p>
                <p className="font-bold text-gray-900 dark:text-white truncate">
                  {title}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
                  {description}
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// Streak Fire Animation
interface StreakFireProps {
  streak: number;
  show: boolean;
  onComplete?: () => void;
}

export function StreakFireAnimation({
  streak,
  show,
  onComplete,
}: StreakFireProps) {
  useEffect(() => {
    if (show) {
      const timer = setTimeout(() => onComplete?.(), 2500);
      return () => clearTimeout(timer);
    }
  }, [show, onComplete]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0 }}
          transition={{ type: "spring", damping: 15 }}
          className="fixed bottom-24 left-1/2 -translate-x-1/2 z-[200]"
        >
          <div className="flex items-center gap-3 bg-gradient-to-r from-orange-500 to-red-500 text-white px-6 py-3 rounded-full shadow-lg">
            <motion.div
              animate={{
                scale: [1, 1.3, 1],
                rotate: [0, -10, 10, 0],
              }}
              transition={{ repeat: Infinity, duration: 0.5 }}
            >
              <Flame className="w-8 h-8 fill-yellow-300 text-yellow-200" />
            </motion.div>
            <div className="text-center">
              <p className="text-sm opacity-80">سلسلة أيام!</p>
              <p className="text-2xl font-bold">{streak} 🔥</p>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// Combo Multiplier Animation
interface ComboProps {
  multiplier: number;
  show: boolean;
}

export function ComboAnimation({ multiplier, show }: ComboProps) {
  return (
    <AnimatePresence>
      {show && multiplier > 1 && (
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          className="fixed top-32 left-4 z-[150]"
        >
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ repeat: Infinity, duration: 0.8 }}
            className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-4 py-2 rounded-lg shadow-lg"
          >
            <p className="text-sm opacity-80">مضاعف!</p>
            <p className="text-xl font-bold">x{multiplier}</p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// Confetti burst for major celebrations
export function ConfettiBurst({ show }: { show: boolean }) {
  const [particles, setParticles] = useState<
    Array<{ id: number; x: number; color: string }>
  >([]);

  useEffect(() => {
    if (show) {
      const newParticles = Array.from({ length: 30 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        color: CELEBRATION_COLORS.confetti[
          Math.floor(Math.random() * CELEBRATION_COLORS.confetti.length)
        ],
      }));
      setParticles(newParticles);

      const timer = setTimeout(() => setParticles([]), 2000);
      return () => clearTimeout(timer);
    }
  }, [show]);

  return (
    <div className="fixed inset-0 pointer-events-none z-[300] overflow-hidden">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          initial={{ y: -20, x: `${p.x}vw`, opacity: 1, rotate: 0 }}
          animate={{
            y: "110vh",
            opacity: [1, 1, 0],
            rotate: Math.random() * 720 - 360,
          }}
          transition={{ duration: 2 + Math.random(), ease: "linear" }}
          className="absolute w-3 h-3 rounded-sm"
          style={{ backgroundColor: p.color }}
        />
      ))}
    </div>
  );
}
