"use client";

import { CELEBRATION_COLORS } from "@/lib/design-tokens";
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, Trophy, Star, Zap } from 'lucide-react';

interface SuccessCelebrationProps {
  show: boolean;
  message?: string;
  type?: 'achievement' | 'level-up' | 'quiz-complete' | 'lesson-complete';
  xpGained?: number;
  onComplete?: () => void;
}

export function SuccessCelebration({ 
  show, 
  message = 'أحسنت!', 
  type = 'achievement',
  xpGained,
  onComplete 
}: SuccessCelebrationProps) {
  const [confetti, setConfetti] = useState<Array<{ id: number; x: number; y: number; color: string; rotation: number }>>([]);

  useEffect(() => {
    if (show) {
      // Generate confetti
      const newConfetti = Array.from({ length: 50 }, (_, i) => ({
        id: i,
        x: Math.random() * window.innerWidth,
        y: -20,
        color: CELEBRATION_COLORS.confetti[Math.floor(Math.random() * CELEBRATION_COLORS.confetti.length)],
        rotation: Math.random() * 360
      }));
      setConfetti(newConfetti);

      // Trigger haptic feedback
      if ('vibrate' in navigator) {
        navigator.vibrate([50, 100, 50]);
      }

      // Auto-close after 3 seconds
      const timer = setTimeout(() => {
        onComplete?.();
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [show, onComplete]);

  const getIcon = () => {
    switch (type) {
      case 'achievement':
        return Trophy;
      case 'level-up':
        return Zap;
      case 'quiz-complete':
      case 'lesson-complete':
        return CheckCircle;
      default:
        return Star;
    }
  };

  const Icon = getIcon();

  const getGradient = () => {
    switch (type) {
      case 'achievement':
        return 'from-yellow-500 to-orange-500';
      case 'level-up':
        return 'from-purple-500 to-pink-500';
      case 'quiz-complete':
        return 'from-green-500 to-emerald-500';
      case 'lesson-complete':
        return 'from-blue-500 to-cyan-500';
      default:
        return 'from-blue-500 to-purple-500';
    }
  };

  return (
    <AnimatePresence>
      {show && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center"
            onClick={onComplete}
          >
            {/* Confetti */}
            {confetti.map(particle => (
              <motion.div
                key={particle.id}
                className="absolute w-3 h-3 rounded-sm"
                style={{ 
                  backgroundColor: particle.color,
                  left: particle.x,
                  top: particle.y
                }}
                initial={{ y: -20, opacity: 1, rotate: particle.rotation }}
                animate={{
                  y: window.innerHeight + 20,
                  opacity: [1, 1, 0],
                  rotate: particle.rotation + 720
                }}
                transition={{
                  duration: 3,
                  ease: "easeIn"
                }}
              />
            ))}

            {/* Main Card */}
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              exit={{ scale: 0, rotate: 180 }}
              transition={{ type: "spring", stiffness: 200, damping: 20 }}
              className="relative bg-background rounded-3xl p-8 shadow-2xl max-w-md mx-4"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Glow Effect */}
              <div className={`absolute inset-0 bg-gradient-to-br ${getGradient()} opacity-20 rounded-3xl blur-xl`} />

              {/* Content */}
              <div className="relative z-10 text-center">
                {/* Icon */}
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                  className={`w-24 h-24 bg-gradient-to-br ${getGradient()} rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg`}
                >
                  <Icon className="w-12 h-12 text-white" />
                </motion.div>

                {/* Message */}
                <motion.h2
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="text-3xl font-bold text-foreground mb-2"
                >
                  {message}
                </motion.h2>

                {/* XP Gained */}
                {xpGained && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.4, type: "spring" }}
                    className="inline-flex items-center gap-2 bg-purple-100 dark:bg-purple-900/20 text-purple-700 dark:text-purple-400 px-6 py-3 rounded-full font-bold text-xl mb-4"
                  >
                    <Zap className="w-6 h-6" />
                    +{xpGained} XP
                  </motion.div>
                )}

                {/* Stars Animation */}
                <div className="flex justify-center gap-2 mb-6">
                  {[0, 1, 2].map((i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, scale: 0, rotate: -180 }}
                      animate={{ opacity: 1, scale: 1, rotate: 0 }}
                      transition={{ delay: 0.5 + i * 0.1, type: "spring" }}
                    >
                      <Star className="w-8 h-8 text-yellow-500 fill-yellow-500" />
                    </motion.div>
                  ))}
                </div>

                {/* Description */}
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.8 }}
                  className="text-muted-foreground"
                >
                  استمر في التقدم الرائع!
                </motion.p>
              </div>

              {/* Pulse Rings */}
              <motion.div
                className={`absolute inset-0 rounded-3xl border-4 border-gradient-to-br ${getGradient()}`}
                initial={{ scale: 1, opacity: 0.5 }}
                animate={{ scale: 1.1, opacity: 0 }}
                transition={{ duration: 1, repeat: Infinity }}
              />
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

// Floating XP Animation
export function FloatingXP({ value, show, onComplete }: { value: number; show: boolean; onComplete?: () => void }) {
  useEffect(() => {
    if (show) {
      const timer = setTimeout(() => {
        onComplete?.();
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [show, onComplete]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: 0, scale: 1 }}
          animate={{ opacity: [0, 1, 1, 0], y: -100, scale: [1, 1.2, 1] }}
          exit={{ opacity: 0 }}
          transition={{ duration: 2 }}
          className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 pointer-events-none"
        >
          <div className="flex items-center gap-2 bg-purple-600 text-white px-6 py-3 rounded-full font-bold text-2xl shadow-2xl">
            <Zap className="w-6 h-6" />
            +{value} XP
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// Level Up Animation
export function LevelUpAnimation({ show, level, onComplete }: { show: boolean; level: number; onComplete?: () => void }) {
  useEffect(() => {
    if (show) {
      if ('vibrate' in navigator) {
        navigator.vibrate([100, 50, 100, 50, 200]);
      }
      const timer = setTimeout(() => {
        onComplete?.();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [show, onComplete]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-gradient-to-br from-purple-900/90 to-pink-900/90 backdrop-blur-sm z-50 flex items-center justify-center"
          onClick={onComplete}
        >
          <div className="text-center">
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", stiffness: 100, damping: 15 }}
            >
              <Zap className="w-32 h-32 text-yellow-400 mx-auto mb-6" />
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-6xl font-bold text-white mb-4"
            >
              مستوى جديد!
            </motion.h1>

            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5, type: "spring" }}
              className="text-8xl font-bold text-yellow-400 mb-6"
            >
              {level}
            </motion.div>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="text-2xl text-white/90"
            >
              أنت الآن أقوى من أي وقت مضى!
            </motion.p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default SuccessCelebration;
