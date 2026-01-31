/**
 * Haptic Feedback Manager - Phase 2 Task 2.3
 * Unified haptic feedback system for mobile devices
 */

// ============================================================================
// TYPES
// ============================================================================

export type HapticPattern =
  | "light"
  | "medium"
  | "heavy"
  | "success"
  | "error"
  | "warning"
  | "selection"
  | "impact"
  | "notification";

interface HapticOptions {
  enabled?: boolean;
  fallback?: () => void;
}

// ============================================================================
// HAPTIC PATTERNS
// ============================================================================

const HAPTIC_PATTERNS: Record<HapticPattern, number | number[]> = {
  // Basic intensities
  light: [10],
  medium: [20],
  heavy: [30],

  // Feedback types
  selection: [5], // UI selection (button tap)
  impact: [15], // Impact (toggle, swipe)
  notification: [10, 50, 10], // Notification received

  // Status feedback
  success: [10, 50, 10, 50, 10], // Success action (triple tap)
  error: [50, 100, 50], // Error (long-pause-long)
  warning: [20, 50, 20], // Warning (medium-pause-medium)
};

// ============================================================================
// STORAGE KEY
// ============================================================================

const STORAGE_KEY = "haptics_enabled";

// ============================================================================
// HAPTIC MANAGER CLASS
// ============================================================================

export class HapticManager {
  private static _enabled: boolean | null = null;

  /**
   * Check if haptics are enabled
   */
  static get enabled(): boolean {
    if (this._enabled === null) {
      // Check localStorage
      const stored = localStorage.getItem(STORAGE_KEY);
      this._enabled = stored !== null ? stored === "true" : true; // Default enabled
    }
    return this._enabled;
  }

  /**
   * Check if device supports haptics
   */
  static get supported(): boolean {
    return (
      typeof navigator !== "undefined" &&
      "vibrate" in navigator &&
      typeof navigator.vibrate === "function"
    );
  }

  /**
   * Trigger haptic feedback
   */
  static trigger(pattern: HapticPattern, options?: HapticOptions): void {
    const { enabled = this.enabled, fallback } = options || {};

    // Check if enabled and supported
    if (!enabled || !this.supported) {
      fallback?.();
      return;
    }

    try {
      const vibrationPattern = HAPTIC_PATTERNS[pattern];
      navigator.vibrate(vibrationPattern);
    } catch (error) {
      console.warn("Haptic feedback failed:", error);
      fallback?.();
    }
  }

  /**
   * Enable haptics
   */
  static enable(): void {
    this._enabled = true;
    localStorage.setItem(STORAGE_KEY, "true");
  }

  /**
   * Disable haptics
   */
  static disable(): void {
    this._enabled = false;
    localStorage.setItem(STORAGE_KEY, "false");
  }

  /**
   * Toggle haptics
   */
  static toggle(): boolean {
    if (this.enabled) {
      this.disable();
    } else {
      this.enable();
    }
    return this.enabled;
  }

  /**
   * Cancel any ongoing vibration
   */
  static cancel(): void {
    if (this.supported) {
      navigator.vibrate(0);
    }
  }

  /**
   * Custom pattern (advanced)
   */
  static triggerCustom(
    pattern: number | number[],
    options?: HapticOptions,
  ): void {
    const { enabled = this.enabled, fallback } = options || {};

    if (!enabled || !this.supported) {
      fallback?.();
      return;
    }

    try {
      navigator.vibrate(pattern);
    } catch (error) {
      console.warn("Custom haptic feedback failed:", error);
      fallback?.();
    }
  }
}

// ============================================================================
// REACT HOOK
// ============================================================================

import { useCallback, useEffect, useState } from "react";

export function useHaptics() {
  const [enabled, setEnabled] = useState(HapticManager.enabled);

  // Sync with manager state
  useEffect(() => {
    const interval = setInterval(() => {
      setEnabled(HapticManager.enabled);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const trigger = useCallback(
    (pattern: HapticPattern, options?: HapticOptions) => {
      HapticManager.trigger(pattern, options);
    },
    [],
  );

  const enable = useCallback(() => {
    HapticManager.enable();
    setEnabled(true);
  }, []);

  const disable = useCallback(() => {
    HapticManager.disable();
    setEnabled(false);
  }, []);

  const toggle = useCallback(() => {
    const newState = HapticManager.toggle();
    setEnabled(newState);
    return newState;
  }, []);

  return {
    enabled,
    supported: HapticManager.supported,
    trigger,
    enable,
    disable,
    toggle,
  };
}

// ============================================================================
// CONVENIENCE FUNCTIONS
// ============================================================================

/**
 * Trigger haptic feedback for button press
 */
export function hapticSelection() {
  HapticManager.trigger("selection");
}

/**
 * Trigger haptic feedback for successful action
 */
export function hapticSuccess() {
  HapticManager.trigger("success");
}

/**
 * Trigger haptic feedback for error
 */
export function hapticError() {
  HapticManager.trigger("error");
}

/**
 * Trigger haptic feedback for warning
 */
export function hapticWarning() {
  HapticManager.trigger("warning");
}

/**
 * Trigger haptic feedback for notification
 */
export function hapticNotification() {
  HapticManager.trigger("notification");
}

/**
 * Trigger haptic feedback for impact
 */
export function hapticImpact() {
  HapticManager.trigger("impact");
}

// ============================================================================
// HIGHER-ORDER COMPONENT
// ============================================================================

/**
 * Wrap a function with haptic feedback
 */
export function withHaptic<T extends (...args: any[]) => any>(
  fn: T,
  pattern: HapticPattern = "selection",
): T {
  return ((...args: Parameters<T>) => {
    HapticManager.trigger(pattern);
    return fn(...args);
  }) as T;
}

// ============================================================================
// CONTEXT (Optional)
// ============================================================================

import { createContext, useContext } from "react";

interface HapticContextValue {
  enabled: boolean;
  supported: boolean;
  trigger: (pattern: HapticPattern, options?: HapticOptions) => void;
  enable: () => void;
  disable: () => void;
  toggle: () => boolean;
}

const HapticContext = createContext<HapticContextValue | undefined>(undefined);

export function HapticProvider({ children }: { children: React.ReactNode }) {
  const haptics = useHaptics();

  return (
    <HapticContext.Provider value={haptics}>{children}</HapticContext.Provider>
  );
}

export function useHapticContext() {
  const context = useContext(HapticContext);
  if (!context) {
    throw new Error("useHapticContext must be used within HapticProvider");
  }
  return context;
}

// ============================================================================
// DEFAULT EXPORT
// ============================================================================

export default HapticManager;
