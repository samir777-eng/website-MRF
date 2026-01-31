"use client";

/**
 * Enhanced Streak Display
 * Phase 1.4: Dynamic fire animations based on streak length
 *
 * Features:
 * - Fire intensity scales with streak length
 * - Milestone celebrations (7, 14, 30, 100 days)
 * - Streak protection indicator
 * - Animated flame particles
 */

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { Crown, Flame, Shield, Zap } from "lucide-react";
import { useEffect, useState } from "react";

interface EnhancedStreakDisplayProps {
  days: number;
  longestStreak?: number;
  hasStreakFreeze?: boolean;
  streakFreezeCount?: number;
  isAtRisk?: boolean; // True if streak might be lost today
  className?: string;
  variant?: "badge" | "card" | "mini";
  onStreakClick?: () => void;
}

// Milestone definitions
const MILESTONES = [
  { days: 7, label: "أسبوع!", icon: "🔥", color: "from-orange-400 to-red-500" },
  {
    days: 14,
    label: "أسبوعين!",
    icon: "💪",
    color: "from-red-500 to-pink-500",
  },
  { days: 30, label: "شهر!", icon: "⭐", color: "from-pink-500 to-purple-500" },
  {
    days: 60,
    label: "شهرين!",
    icon: "🏆",
    color: "from-purple-500 to-indigo-500",
  },
  {
    days: 100,
    label: "100 يوم!",
    icon: "👑",
    color: "from-yellow-400 to-amber-500",
  },
  {
    days: 365,
    label: "سنة!",
    icon: "🎉",
    color: "from-amber-400 to-yellow-500",
  },
];

// Get fire intensity based on streak length
function getFireIntensity(days: number): {
  scale: number;
  particles: number;
  color: string;
  glowIntensity: number;
  animationSpeed: number;
} {
  if (days >= 100) {
    return {
      scale: 1.5,
      particles: 12,
      color: "from-yellow-300 via-amber-400 to-orange-500",
      glowIntensity: 0.8,
      animationSpeed: 0.3,
    };
  }
  if (days >= 30) {
    return {
      scale: 1.3,
      particles: 8,
      color: "from-orange-400 via-red-500 to-pink-500",
      glowIntensity: 0.6,
      animationSpeed: 0.4,
    };
  }
  if (days >= 14) {
    return {
      scale: 1.2,
      particles: 6,
      color: "from-orange-500 to-red-500",
      glowIntensity: 0.4,
      animationSpeed: 0.5,
    };
  }
  if (days >= 7) {
    return {
      scale: 1.1,
      particles: 4,
      color: "from-orange-400 to-red-400",
      glowIntensity: 0.3,
      animationSpeed: 0.6,
    };
  }
  if (days >= 3) {
    return {
      scale: 1,
      particles: 2,
      color: "from-yellow-400 to-orange-500",
      glowIntensity: 0.2,
      animationSpeed: 0.7,
    };
  }
  return {
    scale: 0.9,
    particles: 0,
    color: "from-yellow-300 to-orange-400",
    glowIntensity: 0.1,
    animationSpeed: 0.8,
  };
}

// Get the next milestone
function getNextMilestone(days: number) {
  return (
    MILESTONES.find((m) => m.days > days) || MILESTONES[MILESTONES.length - 1]
  );
}

// Get achieved milestones
function getAchievedMilestone(days: number) {
  return MILESTONES.filter((m) => days >= m.days).pop();
}

export function EnhancedStreakDisplay({
  days,
  longestStreak = 0,
  hasStreakFreeze = false,
  streakFreezeCount = 0,
  isAtRisk = false,
  className,
  variant = "badge",
  onStreakClick,
}: EnhancedStreakDisplayProps) {
  const [showParticles, setShowParticles] = useState(true);
  const fireIntensity = getFireIntensity(days);
  const nextMilestone = getNextMilestone(days);
  const achievedMilestone = getAchievedMilestone(days);
  const daysToNext = nextMilestone ? nextMilestone.days - days : 0;
  const progressToNext = nextMilestone
    ? ((days -
        (MILESTONES.find((m) => m.days < nextMilestone.days)?.days || 0)) /
        (nextMilestone.days -
          (MILESTONES.find((m) => m.days < nextMilestone.days)?.days || 0))) *
      100
    : 100;

  // Disable particles on low-power mode
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setShowParticles(!mediaQuery.matches);

    const handler = (e: MediaQueryListEvent) => setShowParticles(!e.matches);
    mediaQuery.addEventListener("change", handler);
    return () => mediaQuery.removeEventListener("change", handler);
  }, []);

  if (variant === "mini") {
    return (
      <MiniStreak
        days={days}
        fireIntensity={fireIntensity}
        isAtRisk={isAtRisk}
        onClick={onStreakClick}
        className={className}
      />
    );
  }

  if (variant === "badge") {
    return (
      <BadgeStreak
        days={days}
        fireIntensity={fireIntensity}
        isAtRisk={isAtRisk}
        hasStreakFreeze={hasStreakFreeze}
        onClick={onStreakClick}
        className={className}
        showParticles={showParticles}
      />
    );
  }

  // Full Card variant
  return (
    <CardStreak
      days={days}
      longestStreak={longestStreak}
      fireIntensity={fireIntensity}
      isAtRisk={isAtRisk}
      hasStreakFreeze={hasStreakFreeze}
      streakFreezeCount={streakFreezeCount}
      nextMilestone={nextMilestone}
      achievedMilestone={achievedMilestone}
      daysToNext={daysToNext}
      progressToNext={progressToNext}
      onClick={onStreakClick}
      className={className}
      showParticles={showParticles}
    />
  );
}

// ============================================================================
// MINI VARIANT
// ============================================================================

function MiniStreak({
  days,
  fireIntensity,
  isAtRisk,
  onClick,
  className,
}: {
  days: number;
  fireIntensity: ReturnType<typeof getFireIntensity>;
  isAtRisk: boolean;
  onClick?: () => void;
  className?: string;
}) {
  return (
    <motion.button
      onClick={onClick}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className={cn(
        "flex items-center gap-1.5 px-3 py-1.5 rounded-full",
        "bg-gradient-to-r",
        fireIntensity.color,
        "text-white font-bold text-sm shadow-lg",
        isAtRisk && "animate-pulse",
        className,
      )}
      style={{
        boxShadow: `0 0 ${20 * fireIntensity.glowIntensity}px rgba(251, 146, 60, ${fireIntensity.glowIntensity})`,
      }}
    >
      <motion.div
        animate={{
          scale: [1, fireIntensity.scale, 1],
          rotate: [0, -5, 5, 0],
        }}
        transition={{
          duration: fireIntensity.animationSpeed,
          repeat: Infinity,
        }}
      >
        <Flame className="w-4 h-4 fill-yellow-200" />
      </motion.div>
      <span>{days}</span>
    </motion.button>
  );
}

// ============================================================================
// BADGE VARIANT
// ============================================================================

function BadgeStreak({
  days,
  fireIntensity,
  isAtRisk,
  hasStreakFreeze,
  onClick,
  className,
  showParticles,
}: {
  days: number;
  fireIntensity: ReturnType<typeof getFireIntensity>;
  isAtRisk: boolean;
  hasStreakFreeze: boolean;
  onClick?: () => void;
  className?: string;
  showParticles: boolean;
}) {
  return (
    <motion.button
      onClick={onClick}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className={cn(
        "relative flex items-center gap-2 px-4 py-2 rounded-xl",
        "bg-gradient-to-r",
        fireIntensity.color,
        "text-white font-bold shadow-xl",
        isAtRisk &&
          "ring-2 ring-yellow-300 ring-offset-2 ring-offset-background",
        className,
      )}
      style={{
        boxShadow: `0 0 ${30 * fireIntensity.glowIntensity}px rgba(251, 146, 60, ${fireIntensity.glowIntensity})`,
      }}
    >
      {/* Fire particles */}
      {showParticles && <FireParticles count={fireIntensity.particles} />}

      {/* Main flame */}
      <motion.div
        animate={{
          scale: [1, fireIntensity.scale, 1],
          rotate: [0, -8, 8, 0],
        }}
        transition={{
          duration: fireIntensity.animationSpeed,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="relative"
      >
        <Flame className="w-6 h-6 fill-yellow-200 drop-shadow-lg" />
        {days >= 30 && (
          <motion.div
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 0.5, repeat: Infinity }}
            className="absolute inset-0"
          >
            <Flame className="w-6 h-6 fill-white/50" />
          </motion.div>
        )}
      </motion.div>

      {/* Days count */}
      <div className="flex flex-col items-start">
        <span className="text-lg leading-tight">{days} يوم</span>
        {days >= 7 && (
          <span className="text-xs opacity-80 leading-tight">🔥 سلسلة!</span>
        )}
      </div>

      {/* Streak freeze indicator */}
      {hasStreakFreeze && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute -top-1 -right-1 bg-blue-500 rounded-full p-1 shadow-lg"
        >
          <Shield className="w-3 h-3 text-white" />
        </motion.div>
      )}

      {/* At risk indicator */}
      {isAtRisk && !hasStreakFreeze && (
        <motion.div
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ repeat: Infinity, duration: 0.5 }}
          className="absolute -top-1 -right-1 bg-yellow-400 rounded-full p-1 shadow-lg"
        >
          <span className="text-xs">⚠️</span>
        </motion.div>
      )}
    </motion.button>
  );
}

// ============================================================================
// CARD VARIANT
// ============================================================================

function CardStreak({
  days,
  longestStreak,
  fireIntensity,
  isAtRisk,
  hasStreakFreeze,
  streakFreezeCount,
  nextMilestone,
  achievedMilestone,
  daysToNext,
  progressToNext,
  onClick,
  className,
  showParticles,
}: {
  days: number;
  longestStreak: number;
  fireIntensity: ReturnType<typeof getFireIntensity>;
  isAtRisk: boolean;
  hasStreakFreeze: boolean;
  streakFreezeCount: number;
  nextMilestone: (typeof MILESTONES)[0] | undefined;
  achievedMilestone: (typeof MILESTONES)[0] | undefined;
  daysToNext: number;
  progressToNext: number;
  onClick?: () => void;
  className?: string;
  showParticles: boolean;
}) {
  return (
    <motion.div
      onClick={onClick}
      whileHover={onClick ? { scale: 1.02 } : {}}
      className={cn(
        "relative overflow-hidden rounded-2xl p-6",
        "bg-gradient-to-br",
        fireIntensity.color,
        "text-white shadow-2xl",
        onClick && "cursor-pointer",
        className,
      )}
      style={{
        boxShadow: `0 0 ${40 * fireIntensity.glowIntensity}px rgba(251, 146, 60, ${fireIntensity.glowIntensity})`,
      }}
    >
      {/* Background particles */}
      {showParticles && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <FireParticles count={fireIntensity.particles * 2} spread />
        </div>
      )}

      {/* Main content */}
      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <motion.div
              animate={{
                scale: [1, fireIntensity.scale, 1],
                rotate: [0, -10, 10, 0],
              }}
              transition={{
                duration: fireIntensity.animationSpeed,
                repeat: Infinity,
              }}
              className="relative"
            >
              <Flame className="w-12 h-12 fill-yellow-200 drop-shadow-lg" />
              {days >= 100 && (
                <Crown className="absolute -top-2 -right-2 w-6 h-6 text-yellow-300 drop-shadow-lg" />
              )}
            </motion.div>
            <div>
              <h3 className="text-lg font-bold opacity-90">سلسلة التعلم</h3>
              {achievedMilestone && (
                <span className="text-sm opacity-80">
                  {achievedMilestone.icon} {achievedMilestone.label}
                </span>
              )}
            </div>
          </div>

          {/* Streak freeze badge */}
          {hasStreakFreeze && (
            <div className="flex items-center gap-2 bg-white/20 rounded-full px-3 py-1">
              <Shield className="w-4 h-4" />
              <span className="text-sm">{streakFreezeCount}</span>
            </div>
          )}
        </div>

        {/* Days count */}
        <div className="text-center my-6">
          <motion.div
            animate={days > 0 ? { scale: [1, 1.05, 1] } : {}}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <span className="text-6xl font-black drop-shadow-lg">{days}</span>
            <span className="text-2xl font-bold me-2">يوم</span>
          </motion.div>
          {longestStreak > days && (
            <p className="text-sm opacity-80 mt-2">
              أطول سلسلة: {longestStreak} يوم
            </p>
          )}
        </div>

        {/* Progress to next milestone */}
        {nextMilestone && days > 0 && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span>الهدف التالي: {nextMilestone.label}</span>
              <span>{daysToNext} يوم متبقي</span>
            </div>
            <div className="h-2 bg-white/20 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${Math.min(progressToNext, 100)}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
                className="h-full bg-white/60 rounded-full"
              />
            </div>
          </div>
        )}

        {/* At risk warning */}
        {isAtRisk && !hasStreakFreeze && (
          <motion.div
            animate={{ opacity: [1, 0.7, 1] }}
            transition={{ repeat: Infinity, duration: 1 }}
            className="mt-4 p-3 bg-yellow-400/30 rounded-xl flex items-center gap-2"
          >
            <Zap className="w-5 h-5" />
            <span className="text-sm font-medium">
              أكمل درسًا اليوم للحفاظ على السلسلة!
            </span>
          </motion.div>
        )}

        {/* Protected badge */}
        {hasStreakFreeze && isAtRisk && (
          <div className="mt-4 p-3 bg-blue-400/30 rounded-xl flex items-center gap-2">
            <Shield className="w-5 h-5" />
            <span className="text-sm font-medium">سلسلتك محمية اليوم! 🛡️</span>
          </div>
        )}
      </div>
    </motion.div>
  );
}

// ============================================================================
// FIRE PARTICLES - Using deterministic values to avoid hydration mismatch
// ============================================================================

// Deterministic pseudo-random based on index (consistent server/client)
function seededValue(index: number, offset: number = 0): number {
  const seed = (index + 1) * 9301 + offset * 49297;
  return ((seed * 233280) % 1000) / 1000;
}

function FireParticles({
  count,
  spread = false,
}: {
  count: number;
  spread?: boolean;
}) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => {
        // Use deterministic values based on index
        const xStart = seededValue(i, 1) * 100;
        const yStart = seededValue(i, 2) * 100;
        const xEnd = spread
          ? (seededValue(i, 3) - 0.5) * 50 + 50
          : 50 + (seededValue(i, 3) - 0.5) * 30;
        const duration = 1 + seededValue(i, 4) * 0.5;

        return (
          <motion.div
            key={i}
            className="absolute w-2 h-2 rounded-full bg-yellow-300/60"
            initial={{
              x: spread ? `${xStart}%` : "50%",
              y: spread ? `${yStart}%` : "100%",
              scale: 0,
              opacity: 0.8,
            }}
            animate={{
              y: spread ? [null, "-20%"] : [null, "-200%"],
              x: [null, `${xEnd}%`],
              scale: [0, 1, 0],
              opacity: [0, 0.8, 0],
            }}
            transition={{
              duration,
              repeat: Infinity,
              delay: i * 0.15,
              ease: "easeOut",
            }}
          />
        );
      })}
    </>
  );
}

export default EnhancedStreakDisplay;
