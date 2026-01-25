"use client";

import { useCallback, useEffect, useState } from "react";

type Orientation = "portrait" | "landscape";

interface OrientationState {
  orientation: Orientation;
  angle: number;
  isPortrait: boolean;
  isLandscape: boolean;
}

/**
 * Hook to detect and respond to device orientation changes
 * Useful for adapting UI layouts on mobile devices
 */
export function useOrientation(): OrientationState {
  const [state, setState] = useState<OrientationState>(() => {
    // Default to portrait for SSR
    if (typeof window === "undefined") {
      return {
        orientation: "portrait",
        angle: 0,
        isPortrait: true,
        isLandscape: false,
      };
    }

    return getOrientationState();
  });

  const handleOrientationChange = useCallback(() => {
    setState(getOrientationState());
  }, []);

  useEffect(() => {
    // Update on mount
    setState(getOrientationState());

    // Listen for orientation changes
    window.addEventListener("orientationchange", handleOrientationChange);
    window.addEventListener("resize", handleOrientationChange);

    // Also listen to screen.orientation API if available
    if (screen.orientation) {
      screen.orientation.addEventListener("change", handleOrientationChange);
    }

    return () => {
      window.removeEventListener("orientationchange", handleOrientationChange);
      window.removeEventListener("resize", handleOrientationChange);
      if (screen.orientation) {
        screen.orientation.removeEventListener(
          "change",
          handleOrientationChange
        );
      }
    };
  }, [handleOrientationChange]);

  return state;
}

function getOrientationState(): OrientationState {
  if (typeof window === "undefined") {
    return {
      orientation: "portrait",
      angle: 0,
      isPortrait: true,
      isLandscape: false,
    };
  }

  // Try screen.orientation API first (more reliable)
  if (screen.orientation) {
    const type = screen.orientation.type;
    const angle = screen.orientation.angle;
    const isLandscape = type.includes("landscape");

    return {
      orientation: isLandscape ? "landscape" : "portrait",
      angle,
      isPortrait: !isLandscape,
      isLandscape,
    };
  }

  // Fallback to window.orientation (deprecated but still works)
  const angle = typeof window.orientation === "number" ? window.orientation : 0;
  const isLandscape = Math.abs(angle) === 90;

  // Also check aspect ratio as a fallback
  const aspectRatio = window.innerWidth / window.innerHeight;
  const isLandscapeByAspect = aspectRatio > 1;

  return {
    orientation: isLandscape || isLandscapeByAspect ? "landscape" : "portrait",
    angle,
    isPortrait: !isLandscape && !isLandscapeByAspect,
    isLandscape: isLandscape || isLandscapeByAspect,
  };
}

// Orientation lock types supported by the Screen Orientation API
type OrientationLock =
  | "any"
  | "natural"
  | "landscape"
  | "portrait"
  | "portrait-primary"
  | "portrait-secondary"
  | "landscape-primary"
  | "landscape-secondary";

// Type for screen orientation with optional lock/unlock methods
interface ScreenOrientationWithLock {
  type: OrientationType;
  angle: number;
  lock?: (orientation: OrientationLock) => Promise<void>;
  unlock?: () => void;
  addEventListener: ScreenOrientation["addEventListener"];
  removeEventListener: ScreenOrientation["removeEventListener"];
}

/**
 * Hook to lock orientation (requires user gesture and HTTPS)
 * Note: This only works on mobile devices with fullscreen mode
 */
export function useOrientationLock() {
  const lock = useCallback(async (orientation: OrientationLock) => {
    const screenOrientation = screen.orientation as
      | ScreenOrientationWithLock
      | undefined;

    if (!screenOrientation?.lock) {
      console.warn("Screen orientation lock is not supported");
      return false;
    }

    try {
      await screenOrientation.lock(orientation);
      return true;
    } catch (error) {
      console.warn("Failed to lock orientation:", error);
      return false;
    }
  }, []);

  const unlock = useCallback(() => {
    const screenOrientation = screen.orientation as
      | ScreenOrientationWithLock
      | undefined;
    if (screenOrientation?.unlock) {
      screenOrientation.unlock();
    }
  }, []);

  return { lock, unlock };
}
