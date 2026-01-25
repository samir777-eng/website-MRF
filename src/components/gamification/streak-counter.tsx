"use client";

import { Badge } from "@/components/ui/badge";
import { Flame } from "@/components/ui/icons";
import { cn } from "@/lib/utils";
import { useState, useCallback, useRef } from "react";
import { ScaleIn } from "@/lib/animations/lightweight-motion";

interface StreakCounterProps {
  days: number;
  className?: string;
  showIcon?: boolean;
  size?: "sm" | "md" | "lg";
  animated?: boolean;
  onSwipeLeft?: () => void; // Mobile gesture
  onSwipeRight?: () => void; // Mobile gesture
  onTap?: () => void; // Mobile tap
  hapticFeedback?: boolean;
}

export function StreakCounter({
  days,
  className,
  showIcon = true,
  size = "md",
  animated = false,
  onSwipeLeft,
  onSwipeRight,
  onTap,
  hapticFeedback = true,
}: StreakCounterProps) {
  const [isPressed, setIsPressed] = useState(false);
  const [swipeDirection, setSwipeDirection] = useState<"left" | "right" | null>(
    null,
  );
  const touchStartX = useRef<number>(0);
  const touchStartY = useRef<number>(0);

  // Simulate haptic feedback
  const simulateHaptic = useCallback(
    (intensity: "light" | "medium" | "heavy" = "light") => {
      if (hapticFeedback && "vibrate" in navigator) {
        const patterns = {
          light: 50,
          medium: 100,
          heavy: 200,
        };
        navigator.vibrate(patterns[intensity]);
      }
    },
    [hapticFeedback],
  );

  // Touch handlers for swipe gestures
  const handleTouchStart = useCallback(
    (e: React.TouchEvent) => {
      const touch = e.touches[0];
      touchStartX.current = touch.clientX;
      touchStartY.current = touch.clientY;
      setIsPressed(true);
      simulateHaptic("light");
    },
    [simulateHaptic],
  );

  // Mouse handlers
  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      touchStartX.current = e.clientX;
      touchStartY.current = e.clientY;
      setIsPressed(true);
      simulateHaptic("light");
    },
    [simulateHaptic],
  );

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (!touchStartX.current) return;

    const touch = e.touches[0];
    const deltaX = touch.clientX - touchStartX.current;
    const deltaY = touch.clientY - touchStartY.current;

    // Only trigger swipe if horizontal movement is greater than vertical
    if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 50) {
      const direction = deltaX > 0 ? "right" : "left";
      setSwipeDirection(direction);
    }
  }, []);

  const handleTouchEnd = useCallback(() => {
    setIsPressed(false);

    if (swipeDirection === "left" && onSwipeLeft) {
      simulateHaptic("medium");
      onSwipeLeft();
    } else if (swipeDirection === "right" && onSwipeRight) {
      simulateHaptic("medium");
      onSwipeRight();
    } else if (!swipeDirection && onTap) {
      simulateHaptic("light");
      onTap();
    }

    setSwipeDirection(null);
    touchStartX.current = 0;
    touchStartY.current = 0;
  }, [swipeDirection, onSwipeLeft, onSwipeRight, onTap, simulateHaptic]);
  // Ensure days is never negative
  const displayDays = Math.max(0, days);

  const sizeClasses = {
    sm: "text-sm px-2 py-1",
    md: "text-sm px-3 py-1.5",
    lg: "text-lg px-4 py-2",
  };

  const iconSizes = {
    sm: "w-3 h-3",
    md: "w-4 h-4",
    lg: "w-5 h-5",
  };

  const ariaLabel = `سلسلة التعلم: ${displayDays} ${displayDays === 1 ? "يوم" : "أيام"}`;

  return (
    <ScaleIn scale={animated ? 0.8 : 1} duration={animated ? 500 : 0}>
      <div
        className={cn(
          "relative select-none",
          (onTap || onSwipeLeft || onSwipeRight) && "cursor-pointer",
        )}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onMouseDown={handleMouseDown}
        onMouseUp={handleTouchEnd}
        onMouseLeave={() => setIsPressed(false)}
      >
        <Badge
          data-testid="streak-counter"
          variant="streak"
          className={cn(
            "inline-flex items-center gap-2 font-bold transition-all duration-200",
            "gen-z-gradient text-white border-0 shadow-lg",
            sizeClasses[size],
            isPressed && "scale-95 brightness-110",
            swipeDirection === "left" && "translate-x-[-4px]",
            swipeDirection === "right" && "translate-x-[4px]",
            animated && displayDays > 0 && "micro-pulse",
            className,
          )}
          aria-label={ariaLabel}
          role="status"
        >
          {showIcon && (
            <div
              data-testid="flame-icon"
              className={cn(
                "transition-all duration-200",
                animated && displayDays > 0 && "animate-pulse",
                isPressed && "scale-110",
              )}
            >
              <Flame className={cn("text-orange-200", iconSizes[size])} />
            </div>
          )}
          <span className="font-bold">
            {displayDays} {displayDays === 1 ? "يوم" : "أيام"}
          </span>
        </Badge>

        {/* Swipe indicators */}
        {(onSwipeLeft || onSwipeRight) && (
          <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-sm text-muted-foreground opacity-60">
            {onSwipeLeft && onSwipeRight
              ? "اسحب يميناً أو يساراً"
              : onSwipeLeft
                ? "اسحب يساراً"
                : "اسحب يميناً"}
          </div>
        )}
      </div>
    </ScaleIn>
  );
}
