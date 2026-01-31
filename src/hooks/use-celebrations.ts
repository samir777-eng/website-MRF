"use client";

import { useState, useCallback } from "react";

interface CelebrationState {
  xpGain: { show: boolean; amount: number };
  levelUp: { show: boolean; level: number };
  achievement: {
    show: boolean;
    title: string;
    description: string;
    icon: "trophy" | "star" | "target" | "flame" | "award";
  };
  streak: { show: boolean; streak: number };
  combo: { show: boolean; multiplier: number };
  confetti: boolean;
}

const initialState: CelebrationState = {
  xpGain: { show: false, amount: 0 },
  levelUp: { show: false, level: 0 },
  achievement: { show: false, title: "", description: "", icon: "trophy" },
  streak: { show: false, streak: 0 },
  combo: { show: false, multiplier: 1 },
  confetti: false,
};

export function useCelebrations() {
  const [state, setState] = useState<CelebrationState>(initialState);

  const showXPGain = useCallback((amount: number) => {
    setState((prev) => ({
      ...prev,
      xpGain: { show: true, amount },
    }));
  }, []);

  const hideXPGain = useCallback(() => {
    setState((prev) => ({
      ...prev,
      xpGain: { ...prev.xpGain, show: false },
    }));
  }, []);

  const showLevelUp = useCallback((level: number) => {
    setState((prev) => ({
      ...prev,
      levelUp: { show: true, level },
      confetti: true,
    }));
    // Auto-hide confetti after animation
    setTimeout(() => {
      setState((prev) => ({ ...prev, confetti: false }));
    }, 2500);
  }, []);

  const hideLevelUp = useCallback(() => {
    setState((prev) => ({
      ...prev,
      levelUp: { ...prev.levelUp, show: false },
    }));
  }, []);

  const showAchievement = useCallback(
    (
      title: string,
      description: string,
      icon: "trophy" | "star" | "target" | "flame" | "award" = "trophy",
    ) => {
      setState((prev) => ({
        ...prev,
        achievement: { show: true, title, description, icon },
      }));
    },
    [],
  );

  const hideAchievement = useCallback(() => {
    setState((prev) => ({
      ...prev,
      achievement: { ...prev.achievement, show: false },
    }));
  }, []);

  const showStreak = useCallback((streak: number) => {
    setState((prev) => ({
      ...prev,
      streak: { show: true, streak },
    }));
  }, []);

  const hideStreak = useCallback(() => {
    setState((prev) => ({
      ...prev,
      streak: { ...prev.streak, show: false },
    }));
  }, []);

  const showCombo = useCallback((multiplier: number) => {
    setState((prev) => ({
      ...prev,
      combo: { show: true, multiplier },
    }));
  }, []);

  const hideCombo = useCallback(() => {
    setState((prev) => ({
      ...prev,
      combo: { show: false, multiplier: 1 },
    }));
  }, []);

  const triggerConfetti = useCallback(() => {
    setState((prev) => ({ ...prev, confetti: true }));
    setTimeout(() => {
      setState((prev) => ({ ...prev, confetti: false }));
    }, 2500);
  }, []);

  return {
    state,
    showXPGain,
    hideXPGain,
    showLevelUp,
    hideLevelUp,
    showAchievement,
    hideAchievement,
    showStreak,
    hideStreak,
    showCombo,
    hideCombo,
    triggerConfetti,
  };
}
