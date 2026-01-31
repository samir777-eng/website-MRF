"use client";

type HapticType =
  | "light"
  | "medium"
  | "heavy"
  | "success"
  | "warning"
  | "error";

export function useHapticFeedback() {
  const triggerHaptic = (type: HapticType = "light") => {
    // Check if the Vibration API is supported
    if (!("vibrate" in navigator)) {
      return;
    }

    // Vibration patterns for different feedback types
    const patterns = {
      light: [10],
      medium: [20],
      heavy: [30],
      success: [10, 50, 10],
      warning: [20, 100, 20],
      error: [30, 100, 30, 100, 30],
    };

    navigator.vibrate(patterns[type]);
  };

  return { triggerHaptic };
}
