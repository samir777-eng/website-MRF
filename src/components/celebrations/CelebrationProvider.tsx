"use client";

/**
 * Enhanced Celebration System - REFINED
 * Phase 1 Refinement: Better animations, haptics, sounds, and polish
 */

import { CELEBRATION_COLORS } from "@/lib/design-tokens";
import confetti from "canvas-confetti";
import { AnimatePresence, motion } from "framer-motion";
import {
  Award,
  Crown,
  Flame,
  Sparkles,
  Star,
  Target,
  Trophy,
  X,
  Zap,
} from "lucide-react";
import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

// ============================================================================
// TYPES
// ============================================================================

interface XPFloatParticle {
  id: number;
  amount: number;
  x: number;
  y: number;
  multiplier?: number;
  delay: number;
  size: "sm" | "md" | "lg";
}

interface CelebrationState {
  xpParticles: XPFloatParticle[];
  levelUp: { show: boolean; level: number; title: string };
  achievement: {
    show: boolean;
    title: string;
    description: string;
    icon: string;
    rarity: string;
    xpReward?: number;
  };
  streak: { show: boolean; days: number; milestone: boolean };
  combo: { show: boolean; count: number; multiplier: number };
  comboBreak: boolean;
  screenShake: boolean;
  perfectScore: boolean;
}

interface CelebrationSettings {
  soundEnabled: boolean;
  hapticEnabled: boolean;
  volume: number;
}

interface CelebrationContextType {
  // XP Celebrations
  showXPGain: (
    amount: number,
    multiplier?: number,
    position?: { x: number; y: number }
  ) => void;

  // Level Up
  showLevelUp: (level: number, title: string) => void;
  hideLevelUp: () => void;

  // Achievements
  showAchievement: (
    title: string,
    description: string,
    icon?: string,
    rarity?: string,
    xpReward?: number
  ) => void;
  hideAchievement: () => void;

  // Streak
  showStreak: (days: number, isMilestone?: boolean) => void;
  hideStreak: () => void;

  // Combo
  showCombo: (count: number) => void;
  hideCombo: () => void;
  incrementCombo: () => void;
  resetCombo: () => void;
  breakCombo: () => void;

  // Effects
  triggerConfetti: (
    type?: "default" | "gold" | "celebration" | "fireworks" | "stars"
  ) => void;
  triggerScreenShake: () => void;
  showPerfectScore: () => void;

  // Settings
  settings: CelebrationSettings;
  updateSettings: (settings: Partial<CelebrationSettings>) => void;

  // State
  state: CelebrationState;
  comboCount: number;
}

const initialState: CelebrationState = {
  xpParticles: [],
  levelUp: { show: false, level: 0, title: "" },
  achievement: {
    show: false,
    title: "",
    description: "",
    icon: "trophy",
    rarity: "common",
  },
  streak: { show: false, days: 0, milestone: false },
  combo: { show: false, count: 0, multiplier: 1 },
  comboBreak: false,
  screenShake: false,
  perfectScore: false,
};

const defaultSettings: CelebrationSettings = {
  soundEnabled: true,
  hapticEnabled: true,
  volume: 0.7,
};

// ============================================================================
// HAPTIC FEEDBACK
// ============================================================================

type HapticType =
  | "light"
  | "medium"
  | "heavy"
  | "success"
  | "warning"
  | "error"
  | "selection";

const hapticPatterns: Record<HapticType, number[]> = {
  light: [10],
  medium: [20],
  heavy: [30],
  success: [10, 30, 10, 30, 20],
  warning: [20, 50, 20],
  error: [30, 50, 30, 50, 30],
  selection: [5],
};

function triggerHaptic(type: HapticType, enabled: boolean) {
  if (
    !enabled ||
    typeof navigator === "undefined" ||
    !("vibrate" in navigator)
  ) {
    return;
  }
  try {
    navigator.vibrate(hapticPatterns[type]);
  } catch {
    // Vibration not supported or blocked
  }
}

// ============================================================================
// SOUND SYSTEM
// ============================================================================

class CelebrationSoundSystem {
  private audioContext: AudioContext | null = null;
  private enabled: boolean = true;
  private volume: number = 0.7;

  setEnabled(enabled: boolean) {
    this.enabled = enabled;
  }

  setVolume(volume: number) {
    this.volume = Math.max(0, Math.min(1, volume));
  }

  private getContext(): AudioContext | null {
    if (typeof window === "undefined") return null;
    if (!this.audioContext) {
      try {
        this.audioContext = new (
          window.AudioContext || (window as any).webkitAudioContext
        )();
      } catch {
        return null;
      }
    }
    return this.audioContext;
  }

  private playTone(
    frequency: number,
    duration: number,
    type: OscillatorType = "sine",
    volumeMultiplier: number = 1
  ) {
    if (!this.enabled) return;
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();
      const finalVolume = this.volume * volumeMultiplier * 0.3;

      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);

      oscillator.type = type;
      oscillator.frequency.setValueAtTime(frequency, ctx.currentTime);

      gainNode.gain.setValueAtTime(0, ctx.currentTime);
      gainNode.gain.linearRampToValueAtTime(
        finalVolume,
        ctx.currentTime + 0.02
      );
      gainNode.gain.exponentialRampToValueAtTime(
        0.001,
        ctx.currentTime + duration
      );

      oscillator.start(ctx.currentTime);
      oscillator.stop(ctx.currentTime + duration);
    } catch {
      // Audio playback failed
    }
  }

  playCorrect() {
    this.playTone(880, 0.1, "sine");
    setTimeout(() => this.playTone(1100, 0.15, "sine"), 80);
  }

  playWrong() {
    this.playTone(200, 0.25, "square", 0.5);
  }

  playCombo(level: number) {
    const baseFreq = 523 + level * 50;
    this.playTone(baseFreq, 0.08, "sine");
    setTimeout(() => this.playTone(baseFreq * 1.25, 0.08, "sine"), 50);
    setTimeout(() => this.playTone(baseFreq * 1.5, 0.12, "sine"), 100);
  }

  playComboBreak() {
    this.playTone(300, 0.15, "sawtooth", 0.4);
    setTimeout(() => this.playTone(200, 0.2, "sawtooth", 0.3), 100);
  }

  playLevelUp() {
    const notes = [523, 659, 784, 1047, 1319];
    notes.forEach((freq, i) => {
      setTimeout(() => this.playTone(freq, 0.2, "sine", 0.8), i * 80);
    });
  }

  playAchievement(rarity: string) {
    const rarityMultiplier =
      rarity === "legendary" ? 1.2 : rarity === "epic" ? 1.1 : 1;
    this.playTone(784 * rarityMultiplier, 0.1, "sine", 0.8);
    setTimeout(
      () => this.playTone(988 * rarityMultiplier, 0.1, "sine", 0.8),
      100
    );
    setTimeout(
      () => this.playTone(1175 * rarityMultiplier, 0.25, "sine", 0.9),
      200
    );
  }

  playStreak(isMilestone: boolean) {
    if (isMilestone) {
      const notes = [523, 659, 784, 880, 1047];
      notes.forEach((freq, i) => {
        setTimeout(() => this.playTone(freq, 0.15, "sine", 0.7), i * 100);
      });
    } else {
      this.playTone(659, 0.1, "sine", 0.6);
      setTimeout(() => this.playTone(880, 0.15, "sine", 0.6), 80);
    }
  }

  playXP() {
    this.playTone(1200, 0.06, "sine", 0.4);
    setTimeout(() => this.playTone(1400, 0.08, "sine", 0.3), 40);
  }

  playPerfectScore() {
    const notes = [523, 659, 784, 1047, 1319, 1568];
    notes.forEach((freq, i) => {
      setTimeout(() => this.playTone(freq, 0.2, "sine", 0.9), i * 70);
    });
  }
}

const soundSystem = new CelebrationSoundSystem();

// ============================================================================
// CONTEXT
// ============================================================================

const CelebrationContext = createContext<CelebrationContextType | undefined>(
  undefined
);

export function CelebrationProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<CelebrationState>(initialState);
  const [settings, setSettings] =
    useState<CelebrationSettings>(defaultSettings);
  const [comboCount, setComboCount] = useState(0);
  const [comboTimeout, setComboTimeout] = useState<NodeJS.Timeout | null>(null);
  const [particleId, setParticleId] = useState(0);
  const lastComboCount = useRef(0);

  // Load settings from localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem("celebration-settings");
        if (saved) {
          const parsed = JSON.parse(saved);
          setSettings((prev) => ({ ...prev, ...parsed }));
          soundSystem.setEnabled(parsed.soundEnabled ?? true);
          soundSystem.setVolume(parsed.volume ?? 0.7);
        }
      } catch {
        // Use defaults
      }
    }
  }, []);

  // Cleanup combo timeout on unmount
  useEffect(() => {
    return () => {
      if (comboTimeout) clearTimeout(comboTimeout);
    };
  }, [comboTimeout]);

  // Update settings
  const updateSettings = useCallback(
    (newSettings: Partial<CelebrationSettings>) => {
      setSettings((prev) => {
        const updated = { ...prev, ...newSettings };
        if (typeof window !== "undefined") {
          localStorage.setItem("celebration-settings", JSON.stringify(updated));
        }
        soundSystem.setEnabled(updated.soundEnabled);
        soundSystem.setVolume(updated.volume);
        return updated;
      });
    },
    []
  );

  // ============================================================================
  // XP GAIN ANIMATION - REFINED with staggered particles
  // ============================================================================

  const showXPGain = useCallback(
    (
      amount: number,
      multiplier?: number,
      position?: { x: number; y: number }
    ) => {
      // Create multiple staggered particles for more visual impact
      const particleCount = multiplier && multiplier > 1 ? 3 : 2;
      const baseX = position?.x ?? 50;
      const baseY = position?.y ?? 50;

      const newParticles: XPFloatParticle[] = [];

      for (let i = 0; i < particleCount; i++) {
        newParticles.push({
          id: particleId + i,
          amount: i === 0 ? amount : Math.floor(amount * 0.1), // Main particle shows full amount
          multiplier: i === 0 ? multiplier : undefined,
          x: baseX + (Math.random() - 0.5) * 15,
          y: baseY + (Math.random() - 0.5) * 10,
          delay: i * 0.1,
          size: i === 0 ? "lg" : Math.random() > 0.5 ? "md" : "sm",
        });
      }

      setParticleId((prev) => prev + particleCount);
      setState((prev) => ({
        ...prev,
        xpParticles: [...prev.xpParticles, ...newParticles],
      }));

      // Play sound and haptic
      soundSystem.playXP();
      triggerHaptic("light", settings.hapticEnabled);

      // Remove particles after animation
      setTimeout(() => {
        setState((prev) => ({
          ...prev,
          xpParticles: prev.xpParticles.filter(
            (p) => !newParticles.find((np) => np.id === p.id)
          ),
        }));
      }, 1800);
    },
    [particleId, settings.hapticEnabled]
  );

  // ============================================================================
  // LEVEL UP - REFINED
  // ============================================================================

  const showLevelUp = useCallback(
    (level: number, title: string) => {
      setState((prev) => ({
        ...prev,
        levelUp: { show: true, level, title },
      }));

      // Trigger effects
      triggerConfetti("gold");
      triggerScreenShake();
      soundSystem.playLevelUp();
      triggerHaptic("success", settings.hapticEnabled);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [settings.hapticEnabled]
  );

  const hideLevelUp = useCallback(() => {
    setState((prev) => ({
      ...prev,
      levelUp: { ...prev.levelUp, show: false },
    }));
  }, []);

  // ============================================================================
  // ACHIEVEMENTS - REFINED
  // ============================================================================

  const showAchievement = useCallback(
    (
      title: string,
      description: string,
      icon: string = "trophy",
      rarity: string = "common",
      xpReward?: number
    ) => {
      setState((prev) => ({
        ...prev,
        achievement: { show: true, title, description, icon, rarity, xpReward },
      }));

      // Auto-hide after 5 seconds
      setTimeout(() => hideAchievement(), 5000);

      // Sound and haptic based on rarity
      soundSystem.playAchievement(rarity);
      const hapticType =
        rarity === "legendary" || rarity === "epic" ? "success" : "medium";
      triggerHaptic(hapticType, settings.hapticEnabled);

      // Confetti for rare achievements
      if (rarity === "legendary") {
        triggerConfetti("fireworks");
      } else if (rarity === "epic") {
        triggerConfetti("celebration");
      } else if (rarity === "rare") {
        triggerConfetti("stars");
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [settings.hapticEnabled]
  );

  const hideAchievement = useCallback(() => {
    setState((prev) => ({
      ...prev,
      achievement: { ...prev.achievement, show: false },
    }));
  }, []);

  // ============================================================================
  // STREAK - REFINED
  // ============================================================================

  const showStreak = useCallback(
    (days: number, isMilestone: boolean = false) => {
      setState((prev) => ({
        ...prev,
        streak: { show: true, days, milestone: isMilestone },
      }));

      soundSystem.playStreak(isMilestone);
      triggerHaptic(isMilestone ? "success" : "medium", settings.hapticEnabled);

      if (isMilestone) {
        triggerConfetti("fireworks");
      }

      // Auto-hide
      setTimeout(() => hideStreak(), 3500);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [settings.hapticEnabled]
  );

  const hideStreak = useCallback(() => {
    setState((prev) => ({
      ...prev,
      streak: { ...prev.streak, show: false },
    }));
  }, []);

  // ============================================================================
  // COMBO SYSTEM - REFINED with break animation
  // ============================================================================

  const getMultiplier = (count: number) => {
    if (count >= 20) return 4;
    if (count >= 10) return 3;
    if (count >= 5) return 2;
    if (count >= 3) return 1.5;
    return 1;
  };

  const showCombo = useCallback(
    (count: number) => {
      const multiplier = getMultiplier(count);
      setState((prev) => ({
        ...prev,
        combo: { show: true, count, multiplier },
        comboBreak: false,
      }));

      // Sound based on combo level
      soundSystem.playCombo(count);

      // Haptic intensity based on multiplier
      const hapticType =
        multiplier >= 3 ? "heavy" : multiplier >= 2 ? "medium" : "light";
      triggerHaptic(hapticType, settings.hapticEnabled);
    },
    [settings.hapticEnabled]
  );

  const hideCombo = useCallback(() => {
    setState((prev) => ({
      ...prev,
      combo: { ...prev.combo, show: false },
    }));
  }, []);

  const incrementCombo = useCallback(() => {
    if (comboTimeout) clearTimeout(comboTimeout);

    const newCount = comboCount + 1;
    lastComboCount.current = newCount;
    setComboCount(newCount);
    showCombo(newCount);

    // Reset combo after 4 seconds of inactivity (increased from 3)
    const timeout = setTimeout(() => {
      if (lastComboCount.current >= 3) {
        breakCombo();
      } else {
        resetCombo();
      }
    }, 4000);
    setComboTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [comboCount, comboTimeout, showCombo]);

  const breakCombo = useCallback(() => {
    // Show break animation
    setState((prev) => ({
      ...prev,
      comboBreak: true,
      combo: { ...prev.combo, show: false },
    }));

    soundSystem.playComboBreak();
    triggerHaptic("error", settings.hapticEnabled);

    // Hide break animation
    setTimeout(() => {
      setState((prev) => ({ ...prev, comboBreak: false }));
    }, 1000);

    setComboCount(0);
    if (comboTimeout) clearTimeout(comboTimeout);
  }, [comboTimeout, settings.hapticEnabled]);

  const resetCombo = useCallback(() => {
    setComboCount(0);
    lastComboCount.current = 0;
    hideCombo();
    if (comboTimeout) clearTimeout(comboTimeout);
  }, [comboTimeout, hideCombo]);

  // ============================================================================
  // CONFETTI EFFECTS - REFINED with stars type
  // ============================================================================

  const triggerConfetti = useCallback(
    (
      type:
        | "default"
        | "gold"
        | "celebration"
        | "fireworks"
        | "stars" = "default"
    ) => {
      const configs = {
        default: {
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
          colors: CELEBRATION_COLORS.confetti,
        },
        gold: {
          particleCount: 150,
          spread: 100,
          origin: { y: 0.5 },
          colors: CELEBRATION_COLORS.sparkle,
          shapes: ["circle", "square"] as confetti.Shape[],
          scalar: 1.2,
        },
        celebration: {
          particleCount: 200,
          spread: 120,
          origin: { y: 0.6 },
          colors: [
            ...CELEBRATION_COLORS.confetti,
            "#FF6B6B", // Extra festive colors
          ],
          gravity: 0.8,
          ticks: 300,
        },
        fireworks: {
          particleCount: 100,
          spread: 360,
          startVelocity: 45,
          decay: 0.95,
          gravity: 0.5,
          origin: { x: 0.5, y: 0.5 },
          colors: [
            "#FF0000", // Rainbow colors for fireworks
            "#FF7F00",
            "#FFFF00",
            "#00FF00",
            "#0000FF",
            "#8B00FF",
          ],
        },
        stars: {
          particleCount: 80,
          spread: 90,
          origin: { y: 0.6 },
          colors: CELEBRATION_COLORS.sparkle,
          shapes: ["star"] as confetti.Shape[],
          scalar: 1.5,
          ticks: 200,
        },
      };

      confetti(configs[type]);

      // For fireworks, add multiple bursts
      if (type === "fireworks") {
        setTimeout(
          () => confetti({ ...configs.fireworks, origin: { x: 0.3, y: 0.4 } }),
          200
        );
        setTimeout(
          () => confetti({ ...configs.fireworks, origin: { x: 0.7, y: 0.4 } }),
          400
        );
        setTimeout(
          () => confetti({ ...configs.fireworks, origin: { x: 0.5, y: 0.3 } }),
          600
        );
      }
    },
    []
  );

  // ============================================================================
  // SCREEN SHAKE - REFINED
  // ============================================================================

  const triggerScreenShake = useCallback(() => {
    setState((prev) => ({ ...prev, screenShake: true }));
    setTimeout(() => {
      setState((prev) => ({ ...prev, screenShake: false }));
    }, 500);
  }, []);

  // ============================================================================
  // PERFECT SCORE - REFINED
  // ============================================================================

  const showPerfectScore = useCallback(() => {
    setState((prev) => ({ ...prev, perfectScore: true }));
    triggerConfetti("gold");
    triggerScreenShake();
    soundSystem.playPerfectScore();
    triggerHaptic("success", settings.hapticEnabled);

    // Show XP gain for perfect score
    setTimeout(() => {
      showXPGain(100, 2, { x: 50, y: 40 });
    }, 500);

    setTimeout(() => {
      setState((prev) => ({ ...prev, perfectScore: false }));
    }, 3500);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [settings.hapticEnabled, showXPGain]);

  const value: CelebrationContextType = {
    showXPGain,
    showLevelUp,
    hideLevelUp,
    showAchievement,
    hideAchievement,
    showStreak,
    hideStreak,
    showCombo,
    hideCombo,
    incrementCombo,
    resetCombo,
    breakCombo,
    triggerConfetti,
    triggerScreenShake,
    showPerfectScore,
    settings,
    updateSettings,
    state,
    comboCount,
  };

  return (
    <CelebrationContext.Provider value={value}>
      <div className={state.screenShake ? "animate-shake" : ""}>{children}</div>
      <CelebrationOverlay
        state={state}
        onHideLevelUp={hideLevelUp}
        onHideAchievement={hideAchievement}
      />
    </CelebrationContext.Provider>
  );
}

export function useCelebration() {
  const context = useContext(CelebrationContext);
  if (!context) {
    throw new Error("useCelebration must be used within CelebrationProvider");
  }
  return context;
}

// ============================================================================
// CELEBRATION OVERLAY COMPONENT
// ============================================================================

function CelebrationOverlay({
  state,
  onHideLevelUp,
  onHideAchievement,
}: {
  state: CelebrationState;
  onHideLevelUp: () => void;
  onHideAchievement: () => void;
}) {
  return (
    <>
      {/* XP Float Particles */}
      <XPFloatParticles particles={state.xpParticles} />

      {/* Level Up Modal */}
      <LevelUpModal
        show={state.levelUp.show}
        level={state.levelUp.level}
        title={state.levelUp.title}
        onClose={onHideLevelUp}
      />

      {/* Achievement Toast */}
      <AchievementToast
        show={state.achievement.show}
        title={state.achievement.title}
        description={state.achievement.description}
        icon={state.achievement.icon}
        rarity={state.achievement.rarity}
        xpReward={state.achievement.xpReward}
        onClose={onHideAchievement}
      />

      {/* Streak Animation */}
      <StreakAnimation
        show={state.streak.show}
        days={state.streak.days}
        milestone={state.streak.milestone}
      />

      {/* Combo Display */}
      <ComboDisplay
        show={state.combo.show}
        count={state.combo.count}
        multiplier={state.combo.multiplier}
      />

      {/* Combo Break */}
      <ComboBreakAnimation show={state.comboBreak} />

      {/* Perfect Score */}
      <PerfectScoreAnimation show={state.perfectScore} />
    </>
  );
}

// ============================================================================
// XP FLOAT PARTICLES - Both light & dark mode friendly
// ============================================================================

function XPFloatParticles({ particles }: { particles: XPFloatParticle[] }) {
  return (
    <div className="fixed inset-0 pointer-events-none z-[300]">
      <AnimatePresence>
        {particles.map((particle) => (
          <motion.div
            key={particle.id}
            initial={{
              opacity: 0,
              y: 0,
              scale: 0.5,
              x: "-50%",
            }}
            animate={{
              opacity: [0, 1, 1, 0.8, 0],
              y: -120,
              scale: [0.5, 1.1, 1],
            }}
            exit={{ opacity: 0 }}
            transition={{
              duration: 1.2,
              ease: [0.22, 1, 0.36, 1],
              delay: particle.delay,
            }}
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              position: "absolute",
            }}
          >
            {particle.size === "lg" ? (
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 shadow-lg shadow-amber-500/30 dark:shadow-amber-500/20 border border-amber-400/50">
                <Zap className="w-4 h-4 text-white" />
                <span className="text-white font-display font-bold text-base drop-shadow-sm">
                  +{particle.amount}
                  {particle.multiplier && particle.multiplier > 1 && (
                    <span className="text-amber-100 text-sm ms-1">
                      ×{particle.multiplier}
                    </span>
                  )}
                </span>
              </div>
            ) : (
              <div className="w-6 h-6 rounded-full bg-gradient-to-br from-amber-400 to-orange-400 flex items-center justify-center shadow-md shadow-amber-500/20 border border-amber-300/50">
                <Sparkles className="w-3 h-3 text-white" />
              </div>
            )}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

// ============================================================================
// LEVEL UP MODAL - Redesigned with better typography & light mode
// ============================================================================

function LevelUpModal({
  show,
  level,
  title,
  onClose,
}: {
  show: boolean;
  level: number;
  title: string;
  onClose: () => void;
}) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-[400] flex items-center justify-center bg-black/60 dark:bg-black/80 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0, y: 50 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0, y: -50 }}
            transition={{ type: "spring", damping: 20, stiffness: 200 }}
            className="relative px-4"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Floating sparkles */}
            {[...Array(8)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0 }}
                animate={{
                  opacity: [0, 1, 0],
                  scale: [0, 1, 0],
                  x: Math.cos((i * Math.PI * 2) / 8) * 140,
                  y: Math.sin((i * Math.PI * 2) / 8) * 140,
                }}
                transition={{
                  delay: 0.5 + i * 0.1,
                  duration: 2,
                  repeat: Infinity,
                  repeatDelay: 1,
                }}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
              >
                <Star className="w-6 h-6 text-amber-400 fill-amber-300" />
              </motion.div>
            ))}

            {/* Main Card */}
            <motion.div
              animate={{
                boxShadow: [
                  "0 20px 60px -10px rgba(251, 191, 36, 0.3), 0 10px 30px -10px rgba(0, 0, 0, 0.1)",
                  "0 20px 80px -10px rgba(251, 191, 36, 0.5), 0 10px 40px -10px rgba(0, 0, 0, 0.15)",
                  "0 20px 60px -10px rgba(251, 191, 36, 0.3), 0 10px 30px -10px rgba(0, 0, 0, 0.1)",
                ],
              }}
              transition={{ duration: 2, repeat: Infinity }}
              className="relative bg-white dark:bg-gray-900 rounded-3xl overflow-hidden max-w-sm w-full border border-amber-100 dark:border-amber-900/50"
            >
              {/* Top gradient banner */}
              <div className="bg-gradient-to-br from-amber-400 via-yellow-500 to-orange-500 px-8 pt-8 pb-12 text-center relative">
                {/* Subtle pattern overlay */}
                <div className="absolute inset-0 opacity-10">
                  <div
                    className="absolute inset-0"
                    style={{
                      backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
                      backgroundSize: "24px 24px",
                    }}
                  />
                </div>

                <motion.div
                  animate={{ rotate: [0, -5, 5, 0], scale: [1, 1.05, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Crown className="w-16 h-16 text-white mx-auto mb-2 drop-shadow-lg" />
                </motion.div>

                <p className="text-white/90 font-display text-lg font-semibold tracking-wide">
                  مستوى جديد
                </p>
              </div>

              {/* Level number - overlapping */}
              <div className="relative -mt-8 text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.3, type: "spring", damping: 10 }}
                  className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-white dark:bg-gray-800 shadow-xl border-4 border-amber-400"
                >
                  <span className="font-display text-4xl font-black text-amber-500">
                    {level}
                  </span>
                </motion.div>
              </div>

              {/* Content */}
              <div className="px-8 pt-6 pb-8 text-center">
                <motion.h2
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="font-display text-2xl font-bold text-gray-900 dark:text-white mb-2"
                >
                  {title}
                </motion.h2>

                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6 }}
                  className="text-gray-500 dark:text-gray-400 text-sm mb-6"
                >
                  استمر في التعلم للوصول للمستوى التالي
                </motion.p>

                <motion.button
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 }}
                  onClick={onClose}
                  className="w-full py-3 px-6 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-display font-semibold rounded-xl transition-all shadow-lg shadow-amber-500/25 hover:shadow-amber-500/40"
                >
                  متابعة
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ============================================================================
// ACHIEVEMENT TOAST - REFINED with close button and XP display
// ============================================================================

const achievementIcons: Record<string, typeof Trophy> = {
  trophy: Trophy,
  star: Star,
  target: Target,
  flame: Flame,
  award: Award,
  zap: Zap,
  crown: Crown,
};

const rarityConfig: Record<
  string,
  { gradient: string; bg: string; border: string; text: string; label: string }
> = {
  common: {
    gradient: "from-slate-400 to-slate-500",
    bg: "bg-slate-50 dark:bg-slate-900/50",
    border: "border-slate-200 dark:border-slate-700",
    text: "text-slate-600 dark:text-slate-400",
    label: "عادي",
  },
  uncommon: {
    gradient: "from-emerald-400 to-emerald-600",
    bg: "bg-emerald-50 dark:bg-emerald-900/20",
    border: "border-emerald-200 dark:border-emerald-800",
    text: "text-emerald-600 dark:text-emerald-400",
    label: "غير شائع",
  },
  rare: {
    gradient: "from-blue-400 to-blue-600",
    bg: "bg-blue-50 dark:bg-blue-900/20",
    border: "border-blue-200 dark:border-blue-800",
    text: "text-blue-600 dark:text-blue-400",
    label: "نادر",
  },
  epic: {
    gradient: "from-purple-400 to-purple-600",
    bg: "bg-purple-50 dark:bg-purple-900/20",
    border: "border-purple-200 dark:border-purple-800",
    text: "text-purple-600 dark:text-purple-400",
    label: "ملحمي",
  },
  legendary: {
    gradient: "from-amber-400 to-orange-500",
    bg: "bg-amber-50 dark:bg-amber-900/20",
    border: "border-amber-200 dark:border-amber-800",
    text: "text-amber-600 dark:text-amber-400",
    label: "أسطوري",
  },
};

function AchievementToast({
  show,
  title,
  description,
  icon,
  rarity,
  xpReward,
  onClose,
}: {
  show: boolean;
  title: string;
  description: string;
  icon: string;
  rarity: string;
  xpReward?: number;
  onClose: () => void;
}) {
  const Icon = achievementIcons[icon] || Trophy;
  const config = rarityConfig[rarity] || rarityConfig.common;

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ x: 400, opacity: 0, scale: 0.9 }}
          animate={{ x: 0, opacity: 1, scale: 1 }}
          exit={{ x: 400, opacity: 0, scale: 0.9 }}
          transition={{ type: "spring", damping: 25, stiffness: 200 }}
          className="fixed top-20 left-4 z-[350] w-80"
          dir="rtl"
        >
          <div
            className={`bg-white dark:bg-gray-900 ${config.border} border rounded-2xl shadow-xl backdrop-blur-sm overflow-hidden`}
          >
            {/* Top accent bar */}
            <div className={`h-1 bg-gradient-to-r ${config.gradient}`} />

            <div className="p-4 relative">
              {/* Close button */}
              <button
                onClick={onClose}
                className="absolute top-3 left-3 p-1.5 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              >
                <X className="w-3.5 h-3.5 text-gray-500 dark:text-gray-400" />
              </button>

              <div className="flex items-start gap-3">
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className={`flex-shrink-0 bg-gradient-to-br ${config.gradient} rounded-xl p-2.5 shadow-lg`}
                >
                  <Icon className="w-6 h-6 text-white drop-shadow-sm" />
                </motion.div>

                <div className="flex-1 min-w-0 pt-0.5">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`text-xs font-semibold ${config.text}`}>
                      إنجاز جديد
                    </span>
                    <span
                      className={`text-xs px-1.5 py-0.5 rounded bg-gradient-to-r ${config.gradient} text-white font-medium shadow-sm`}
                    >
                      {config.label}
                    </span>
                  </div>

                  <h3 className="font-display font-bold text-gray-900 dark:text-white text-base leading-tight">
                    {title}
                  </h3>

                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-0.5 leading-relaxed">
                    {description}
                  </p>

                  {xpReward && (
                    <motion.div
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 }}
                      className="flex items-center gap-1.5 mt-2 pt-2 border-t border-gray-100 dark:border-gray-800"
                    >
                      <div className="flex items-center gap-1 bg-amber-50 dark:bg-amber-900/30 px-2 py-1 rounded-lg border border-amber-200 dark:border-amber-800">
                        <Zap className="w-3.5 h-3.5 text-amber-500" />
                        <span className="text-sm font-bold text-amber-600 dark:text-amber-400">
                          +{xpReward} XP
                        </span>
                      </div>
                    </motion.div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ============================================================================
// STREAK ANIMATION - Light mode friendly
// ============================================================================

function StreakAnimation({
  show,
  days,
  milestone,
}: {
  show: boolean;
  days: number;
  milestone: boolean;
}) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: 80 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 80 }}
          transition={{ type: "spring", damping: 20 }}
          className="fixed bottom-24 left-1/2 -translate-x-1/2 z-[350]"
        >
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl shadow-orange-500/10 dark:shadow-orange-500/5 border border-orange-100 dark:border-orange-900/50 overflow-hidden backdrop-blur-sm">
            {/* Top gradient accent */}
            <div className="h-1.5 bg-gradient-to-r from-orange-400 via-red-500 to-pink-500" />

            <div className="flex items-center gap-4 px-6 py-4">
              <motion.div
                animate={{ scale: [1, 1.15, 1] }}
                transition={{ repeat: Infinity, duration: 0.8 }}
                className="flex-shrink-0 w-14 h-14 bg-gradient-to-br from-orange-400 to-red-500 rounded-xl flex items-center justify-center shadow-lg shadow-orange-500/30"
              >
                <Flame className="w-8 h-8 text-white drop-shadow-sm" />
              </motion.div>

              <div className="text-right">
                <p className="text-sm font-semibold text-orange-600 dark:text-orange-400">
                  {milestone ? "🎉 إنجاز السلسلة!" : "سلسلة أيام"}
                </p>
                <motion.p
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring" }}
                  className="font-display text-4xl font-black text-gray-900 dark:text-white leading-none"
                >
                  {days}
                </motion.p>
                <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mt-0.5">
                  يوم متتالي
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ============================================================================
// COMBO DISPLAY - Light mode friendly
// ============================================================================

function ComboDisplay({
  show,
  count,
  multiplier,
}: {
  show: boolean;
  count: number;
  multiplier: number;
}) {
  const getComboConfig = () => {
    if (multiplier >= 4)
      return {
        gradient: "from-purple-500 to-pink-500",
        bg: "bg-purple-50 dark:bg-purple-900/30",
        border: "border-purple-200 dark:border-purple-800",
        text: "text-purple-600 dark:text-purple-400",
      };
    if (multiplier >= 3)
      return {
        gradient: "from-red-500 to-orange-500",
        bg: "bg-red-50 dark:bg-red-900/30",
        border: "border-red-200 dark:border-red-800",
        text: "text-red-600 dark:text-red-400",
      };
    if (multiplier >= 2)
      return {
        gradient: "from-amber-500 to-orange-500",
        bg: "bg-amber-50 dark:bg-amber-900/30",
        border: "border-amber-200 dark:border-amber-800",
        text: "text-amber-600 dark:text-amber-400",
      };
    return {
      gradient: "from-emerald-500 to-teal-500",
      bg: "bg-emerald-50 dark:bg-emerald-900/30",
      border: "border-emerald-200 dark:border-emerald-800",
      text: "text-emerald-600 dark:text-emerald-400",
    };
  };

  const config = getComboConfig();

  return (
    <AnimatePresence>
      {show && count >= 3 && (
        <motion.div
          initial={{ opacity: 0, x: 60 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 60 }}
          transition={{ type: "spring", damping: 20 }}
          className="fixed top-32 left-4 z-[300]"
          dir="rtl"
        >
          <div
            className={`${config.bg} ${config.border} border rounded-xl shadow-lg backdrop-blur-sm overflow-hidden`}
          >
            {/* Top accent */}
            <div className={`h-1 bg-gradient-to-r ${config.gradient}`} />

            <div className="flex items-center gap-3 px-4 py-3">
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ repeat: Infinity, duration: 0.4 }}
                className={`w-10 h-10 bg-gradient-to-br ${config.gradient} rounded-lg flex items-center justify-center shadow-md`}
              >
                <Zap className="w-5 h-5 text-white drop-shadow-sm" />
              </motion.div>

              <div>
                <p className={`text-xs font-semibold ${config.text}`}>كومبو</p>
                <motion.p
                  key={count}
                  initial={{ scale: 1.3 }}
                  animate={{ scale: 1 }}
                  className="font-display text-2xl font-black text-gray-900 dark:text-white leading-none"
                >
                  {count}
                </motion.p>
              </div>

              <motion.div
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ repeat: Infinity, duration: 0.5 }}
                className={`bg-gradient-to-r ${config.gradient} px-2.5 py-1.5 rounded-lg shadow-sm`}
              >
                <p className="text-lg font-bold text-white drop-shadow-sm">
                  ×{multiplier}
                </p>
              </motion.div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ============================================================================
// COMBO BREAK ANIMATION - Light mode friendly
// ============================================================================

function ComboBreakAnimation({ show }: { show: boolean }) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, x: 60 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 60 }}
          transition={{ type: "spring", damping: 20 }}
          className="fixed top-32 left-4 z-[300]"
          dir="rtl"
        >
          <motion.div
            animate={{ x: [-3, 3, -3, 3, 0] }}
            transition={{ duration: 0.3 }}
            className="bg-white dark:bg-gray-900 border border-red-100 dark:border-red-900/50 rounded-xl shadow-lg shadow-red-500/10 dark:shadow-red-500/5 backdrop-blur-sm overflow-hidden"
          >
            {/* Red accent bar */}
            <div className="h-1 bg-gradient-to-r from-red-400 to-red-500" />

            <div className="flex items-center gap-3 px-4 py-3">
              <div className="w-10 h-10 bg-red-50 dark:bg-red-900/30 rounded-lg flex items-center justify-center border border-red-100 dark:border-red-800">
                <X className="w-5 h-5 text-red-500 dark:text-red-400" />
              </div>
              <div>
                <p className="text-sm font-semibold text-red-600 dark:text-red-400">
                  انتهى الكومبو
                </p>
                <p className="text-xs font-medium text-gray-500 dark:text-gray-400">
                  حاول مجدداً
                </p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ============================================================================
// PERFECT SCORE ANIMATION - Light mode friendly
// ============================================================================

function PerfectScoreAnimation({ show }: { show: boolean }) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[350] flex items-center justify-center pointer-events-none bg-black/40 dark:bg-black/60"
        >
          <motion.div
            initial={{ scale: 0, y: 30 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0, y: -30 }}
            transition={{ type: "spring", damping: 15 }}
            className="relative"
          >
            {/* Floating stars */}
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0 }}
                animate={{
                  opacity: [0, 1, 0],
                  scale: [0, 1, 0],
                  x: Math.cos((i * Math.PI * 2) / 6) * 100,
                  y: Math.sin((i * Math.PI * 2) / 6) * 100,
                }}
                transition={{
                  delay: 0.3 + i * 0.1,
                  duration: 1.5,
                  repeat: Infinity,
                  repeatDelay: 1,
                }}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
              >
                <Star className="w-6 h-6 text-amber-400 fill-amber-300" />
              </motion.div>
            ))}

            {/* Main card */}
            <motion.div
              animate={{
                boxShadow: [
                  "0 20px 60px -10px rgba(251, 191, 36, 0.25), 0 10px 30px -10px rgba(0, 0, 0, 0.1)",
                  "0 20px 80px -10px rgba(251, 191, 36, 0.4), 0 10px 40px -10px rgba(0, 0, 0, 0.15)",
                  "0 20px 60px -10px rgba(251, 191, 36, 0.25), 0 10px 30px -10px rgba(0, 0, 0, 0.1)",
                ],
              }}
              transition={{ duration: 2, repeat: Infinity }}
              className="bg-white dark:bg-gray-900 rounded-3xl overflow-hidden border border-amber-100 dark:border-amber-900/50"
            >
              {/* Top gradient */}
              <div className="bg-gradient-to-br from-amber-400 via-yellow-500 to-orange-500 px-12 pt-8 pb-10 text-center relative">
                <div className="absolute inset-0 opacity-10">
                  <div
                    className="absolute inset-0"
                    style={{
                      backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
                      backgroundSize: "20px 20px",
                    }}
                  />
                </div>
                <motion.div
                  animate={{ rotate: [0, -5, 5, 0], scale: [1, 1.1, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  <Star className="w-12 h-12 text-white mx-auto mb-2 drop-shadow-lg" />
                </motion.div>
                <p className="text-white font-display text-lg font-semibold drop-shadow-sm">
                  درجة كاملة
                </p>
              </div>

              {/* Score display */}
              <div className="relative -mt-6 text-center px-8 pb-8">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring", damping: 10 }}
                  className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-white dark:bg-gray-800 shadow-xl shadow-amber-500/20 border-4 border-amber-400 mb-4"
                >
                  <span className="font-display text-3xl font-black text-amber-500 dark:text-amber-400">
                    100%
                  </span>
                </motion.div>

                <motion.h2
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="font-display text-xl font-bold text-gray-900 dark:text-white"
                >
                  ممتاز!
                </motion.h2>

                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="text-gray-600 dark:text-gray-400 text-sm mt-1"
                >
                  أجبت على جميع الأسئلة بشكل صحيح
                </motion.p>
              </div>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default CelebrationProvider;
