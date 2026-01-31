/**
 * Swipe Gesture Utilities - Phase 2 Task 2.3
 * Handle touch-based swipe interactions for mobile
 */

import { useEffect, useRef, useCallback } from "react";
import { HapticManager } from "./haptics";

// ============================================================================
// TYPES
// ============================================================================

export type SwipeDirection = "left" | "right" | "up" | "down";

export interface SwipeConfig {
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  onSwipeUp?: () => void;
  onSwipeDown?: () => void;
  onSwipeStart?: (direction: SwipeDirection) => void;
  onSwipeEnd?: () => void;
  threshold?: number; // Minimum distance for swipe (default: 50px)
  preventDefaultTouchmoveEvent?: boolean;
  trackMouse?: boolean;
  hapticFeedback?: boolean;
  delta?: number; // Alias for threshold
}

interface TouchPoint {
  x: number;
  y: number;
  time: number;
}

// ============================================================================
// SWIPE DETECTION HOOK
// ============================================================================

export function useSwipeable(config: SwipeConfig) {
  const {
    onSwipeLeft,
    onSwipeRight,
    onSwipeUp,
    onSwipeDown,
    onSwipeStart,
    onSwipeEnd,
    threshold = config.delta || 50,
    preventDefaultTouchmoveEvent = false,
    trackMouse = false,
    hapticFeedback = true,
  } = config;

  const startPoint = useRef<TouchPoint | null>(null);
  const isSwiping = useRef(false);

  const getTouchPoint = useCallback(
    (event: TouchEvent | MouseEvent): TouchPoint => {
      const touch =
        "touches" in event ? event.touches[0] : (event as MouseEvent);
      return {
        x: touch.clientX,
        y: touch.clientY,
        time: Date.now(),
      };
    },
    [],
  );

  const getSwipeDirection = useCallback(
    (start: TouchPoint, end: TouchPoint): SwipeDirection | null => {
      const deltaX = end.x - start.x;
      const deltaY = end.y - start.y;
      const absDeltaX = Math.abs(deltaX);
      const absDeltaY = Math.abs(deltaY);

      // Check if movement exceeds threshold
      if (Math.max(absDeltaX, absDeltaY) < threshold) {
        return null;
      }

      // Determine primary direction
      if (absDeltaX > absDeltaY) {
        return deltaX > 0 ? "right" : "left";
      } else {
        return deltaY > 0 ? "down" : "up";
      }
    },
    [threshold],
  );

  const handleStart = useCallback(
    (event: TouchEvent | MouseEvent) => {
      startPoint.current = getTouchPoint(event);
      isSwiping.current = true;
    },
    [getTouchPoint],
  );

  const handleMove = useCallback(
    (event: TouchEvent | MouseEvent) => {
      if (!startPoint.current || !isSwiping.current) return;

      if (preventDefaultTouchmoveEvent && "touches" in event) {
        event.preventDefault();
      }

      const currentPoint = getTouchPoint(event);
      const direction = getSwipeDirection(startPoint.current, currentPoint);

      if (direction && onSwipeStart) {
        onSwipeStart(direction);
      }
    },
    [
      getTouchPoint,
      getSwipeDirection,
      onSwipeStart,
      preventDefaultTouchmoveEvent,
    ],
  );

  const handleEnd = useCallback(
    (event: TouchEvent | MouseEvent) => {
      if (!startPoint.current || !isSwiping.current) return;

      const endPoint = getTouchPoint(
        "changedTouches" in event
          ? { ...event, touches: event.changedTouches }
          : event,
      );
      const direction = getSwipeDirection(startPoint.current, endPoint);

      if (direction) {
        // Trigger haptic feedback
        if (hapticFeedback) {
          HapticManager.trigger("impact");
        }

        // Call appropriate handler
        switch (direction) {
          case "left":
            onSwipeLeft?.();
            break;
          case "right":
            onSwipeRight?.();
            break;
          case "up":
            onSwipeUp?.();
            break;
          case "down":
            onSwipeDown?.();
            break;
        }
      }

      onSwipeEnd?.();
      startPoint.current = null;
      isSwiping.current = false;
    },
    [
      getTouchPoint,
      getSwipeDirection,
      onSwipeLeft,
      onSwipeRight,
      onSwipeUp,
      onSwipeDown,
      onSwipeEnd,
      hapticFeedback,
    ],
  );

  // Return event handlers
  const handlers = {
    onTouchStart: handleStart,
    onTouchMove: handleMove,
    onTouchEnd: handleEnd,
    ...(trackMouse && {
      onMouseDown: handleStart,
      onMouseMove: handleMove,
      onMouseUp: handleEnd,
    }),
  };

  return handlers;
}

// ============================================================================
// SWIPEABLE COMPONENT WRAPPER
// ============================================================================

interface SwipeableProps extends SwipeConfig {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export function Swipeable({
  children,
  className,
  style,
  ...config
}: SwipeableProps) {
  const handlers = useSwipeable(config);

  return (
    <div {...(handlers as any)} className={className} style={style}>
      {children}
    </div>
  );
}

// ============================================================================
// SWIPE PROGRESS HOOK (Advanced)
// ============================================================================

interface SwipeProgress {
  direction: SwipeDirection | null;
  distance: number;
  percentage: number; // 0-100
  isActive: boolean;
}

export function useSwipeProgress(maxDistance: number = 200) {
  const [progress, setProgress] = React.useState<SwipeProgress>({
    direction: null,
    distance: 0,
    percentage: 0,
    isActive: false,
  });

  const startPoint = useRef<TouchPoint | null>(null);

  const handleStart = useCallback((event: TouchEvent) => {
    const touch = event.touches[0];
    startPoint.current = {
      x: touch.clientX,
      y: touch.clientY,
      time: Date.now(),
    };
  }, []);

  const handleMove = useCallback(
    (event: TouchEvent) => {
      if (!startPoint.current) return;

      const touch = event.touches[0];
      const deltaX = touch.clientX - startPoint.current.x;
      const deltaY = touch.clientY - startPoint.current.y;
      const absDeltaX = Math.abs(deltaX);
      const absDeltaY = Math.abs(deltaY);

      let direction: SwipeDirection | null = null;
      let distance = 0;

      if (absDeltaX > absDeltaY) {
        direction = deltaX > 0 ? "right" : "left";
        distance = absDeltaX;
      } else {
        direction = deltaY > 0 ? "down" : "up";
        distance = absDeltaY;
      }

      const percentage = Math.min((distance / maxDistance) * 100, 100);

      setProgress({
        direction,
        distance,
        percentage,
        isActive: true,
      });
    },
    [maxDistance],
  );

  const handleEnd = useCallback(() => {
    setProgress({
      direction: null,
      distance: 0,
      percentage: 0,
      isActive: false,
    });
    startPoint.current = null;
  }, []);

  useEffect(() => {
    const element = document.body;

    element.addEventListener("touchstart", handleStart);
    element.addEventListener("touchmove", handleMove);
    element.addEventListener("touchend", handleEnd);

    return () => {
      element.removeEventListener("touchstart", handleStart);
      element.removeEventListener("touchmove", handleMove);
      element.removeEventListener("touchend", handleEnd);
    };
  }, [handleStart, handleMove, handleEnd]);

  return progress;
}

// Fix missing React import
import React from "react";

// ============================================================================
// CAROUSEL SWIPE HOOK
// ============================================================================

export function useCarouselSwipe(
  itemCount: number,
  onIndexChange?: (index: number) => void,
) {
  const [currentIndex, setCurrentIndex] = React.useState(0);

  const handleSwipeLeft = useCallback(() => {
    const newIndex = Math.min(currentIndex + 1, itemCount - 1);
    setCurrentIndex(newIndex);
    onIndexChange?.(newIndex);
  }, [currentIndex, itemCount, onIndexChange]);

  const handleSwipeRight = useCallback(() => {
    const newIndex = Math.max(currentIndex - 1, 0);
    setCurrentIndex(newIndex);
    onIndexChange?.(newIndex);
  }, [currentIndex, onIndexChange]);

  const handlers = useSwipeable({
    onSwipeLeft: handleSwipeLeft,
    onSwipeRight: handleSwipeRight,
    threshold: 50,
    trackMouse: false,
  });

  return {
    currentIndex,
    setCurrentIndex,
    handlers,
    canGoNext: currentIndex < itemCount - 1,
    canGoPrevious: currentIndex > 0,
  };
}

// ============================================================================
// NAVIGATION SWIPE HOOK
// ============================================================================

export function useNavigationSwipe(
  onNext?: () => void,
  onPrevious?: () => void,
  options?: {
    threshold?: number;
    hapticFeedback?: boolean;
    disabled?: boolean;
  },
) {
  const {
    threshold = 100,
    hapticFeedback = true,
    disabled = false,
  } = options || {};

  const handlers = useSwipeable({
    onSwipeLeft: disabled ? undefined : onNext,
    onSwipeRight: disabled ? undefined : onPrevious,
    threshold,
    hapticFeedback,
    trackMouse: false,
    preventDefaultTouchmoveEvent: true,
  });

  return disabled ? {} : handlers;
}

// ============================================================================
// PULL-TO-REFRESH HOOK
// ============================================================================

export function usePullToRefresh(
  onRefresh: () => Promise<void>,
  options?: {
    threshold?: number;
    refreshingDuration?: number;
    disabled?: boolean;
  },
) {
  const {
    threshold = 80,
    refreshingDuration = 1000,
    disabled = false,
  } = options || {};

  const [isRefreshing, setIsRefreshing] = React.useState(false);
  const [pullDistance, setPullDistance] = React.useState(0);
  const startY = useRef<number>(0);
  const isPulling = useRef(false);

  const handleTouchStart = useCallback(
    (event: TouchEvent) => {
      if (disabled || window.scrollY > 0) return;
      startY.current = event.touches[0].clientY;
    },
    [disabled],
  );

  const handleTouchMove = useCallback(
    (event: TouchEvent) => {
      if (disabled || window.scrollY > 0 || !startY.current) return;

      const currentY = event.touches[0].clientY;
      const distance = currentY - startY.current;

      if (distance > 0) {
        isPulling.current = true;
        setPullDistance(Math.min(distance, threshold * 1.5));

        // Light haptic at threshold
        if (distance >= threshold && pullDistance < threshold) {
          HapticManager.trigger("light");
        }
      }
    },
    [disabled, threshold, pullDistance],
  );

  const handleTouchEnd = useCallback(async () => {
    if (disabled || !isPulling.current) return;

    if (pullDistance >= threshold) {
      setIsRefreshing(true);
      HapticManager.trigger("success");

      await onRefresh();

      setTimeout(() => {
        setIsRefreshing(false);
      }, refreshingDuration);
    }

    setPullDistance(0);
    startY.current = 0;
    isPulling.current = false;
  }, [disabled, pullDistance, threshold, onRefresh, refreshingDuration]);

  useEffect(() => {
    if (disabled) return;

    document.addEventListener("touchstart", handleTouchStart);
    document.addEventListener("touchmove", handleTouchMove);
    document.addEventListener("touchend", handleTouchEnd);

    return () => {
      document.removeEventListener("touchstart", handleTouchStart);
      document.removeEventListener("touchmove", handleTouchMove);
      document.removeEventListener("touchend", handleTouchEnd);
    };
  }, [disabled, handleTouchStart, handleTouchMove, handleTouchEnd]);

  return {
    isRefreshing,
    pullDistance,
    progress: Math.min((pullDistance / threshold) * 100, 100),
  };
}

export default useSwipeable;
