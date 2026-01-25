"use client";

import { cn } from "@/lib/utils";
import { useState, useCallback } from "react";
import { ScaleIn } from "@/lib/animations/lightweight-motion";

interface ProgressRingProps {
  progress: number; // 0-100
  size?: number;
  strokeWidth?: number;
  className?: string;
  children?: React.ReactNode;
  color?: "primary" | "secondary" | "accent" | "xp" | "streak" | "purple";
  showAnimation?: boolean;
  onTap?: () => void; // Mobile tap handler
  hapticFeedback?: boolean; // Simulate haptic feedback
}

export function ProgressRing({
  progress,
  size = 120,
  strokeWidth = 8,
  className,
  children,
  color = "primary",
  showAnimation = true,
  onTap,
  hapticFeedback = true,
}: ProgressRingProps) {
  const [isPressed, setIsPressed] = useState(false);

  // Simulate haptic feedback for mobile
  const simulateHaptic = useCallback(() => {
    if (hapticFeedback && "vibrate" in navigator) {
      navigator.vibrate(50); // Light haptic feedback
    }
  }, [hapticFeedback]);

  const handleTouchStart = useCallback(() => {
    setIsPressed(true);
    simulateHaptic();
  }, [simulateHaptic]);

  const handleTouchEnd = useCallback(() => {
    setIsPressed(false);
    if (onTap) {
      onTap();
    }
  }, [onTap]);
  // Clamp progress between 0 and 100
  const clampedProgress = Math.min(100, Math.max(0, progress));

  const normalizedRadius = (size - strokeWidth) / 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDasharray = `${circumference} ${circumference}`;
  const strokeDashoffset =
    circumference - (clampedProgress / 100) * circumference;

  const colorClasses = {
    primary: "stroke-primary-500",
    secondary: "stroke-secondary-500",
    accent: "stroke-accent-500",
    xp: "stroke-green-500",
    streak: "stroke-orange-500",
    purple: "stroke-purple-500",
  };

  const glowClasses = {
    primary: "drop-shadow-[0_0_8px_hsl(var(--primary-500))]",
    secondary: "drop-shadow-[0_0_8px_hsl(var(--secondary-500))]",
    accent: "drop-shadow-[0_0_8px_hsl(var(--accent-500))]",
    xp: "drop-shadow-[0_0_8px_rgb(34,197,94)]",
    streak: "drop-shadow-[0_0_8px_rgb(249,115,22)]",
    purple: "drop-shadow-[0_0_8px_rgb(147,51,234)]",
  };

  const ariaLabel = `التقدم: ${clampedProgress}%`;

  return (
    <ScaleIn scale={isPressed ? 0.95 : 1} duration={150}>
      <div
        className={cn(
          "relative inline-flex items-center justify-center cursor-pointer select-none",
          "transition-all duration-200 ease-out",
          isPressed && "scale-95",
          onTap && "active:scale-90 hover:scale-105",
          className,
        )}
        data-testid="progress-ring"
        role="progressbar"
        aria-valuenow={clampedProgress}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={ariaLabel}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        onMouseDown={handleTouchStart}
        onMouseUp={handleTouchEnd}
        onMouseLeave={() => setIsPressed(false)}
      >
        <svg height={size} width={size} className="transform -rotate-90">
          {/* Background circle */}
          <circle
            stroke="currentColor"
            fill="transparent"
            strokeWidth={strokeWidth}
            r={normalizedRadius}
            cx={size / 2}
            cy={size / 2}
            className="text-muted stroke-current opacity-20"
          />
          {/* Progress circle */}
          <circle
            stroke="currentColor"
            fill="transparent"
            strokeWidth={strokeWidth}
            strokeDasharray={strokeDasharray}
            strokeLinecap="round"
            r={normalizedRadius}
            cx={size / 2}
            cy={size / 2}
            className={cn(
              "transition-all duration-500 ease-in-out",
              colorClasses[color],
              isPressed && glowClasses[color],
            )}
            style={{
              strokeDashoffset: showAnimation
                ? strokeDashoffset
                : circumference - (clampedProgress / 100) * circumference,
              filter: isPressed ? "brightness(1.2)" : "brightness(1)",
            }}
            data-testid="progress-circle"
          />
        </svg>
        {/* Center content - Mobile optimized */}
        <div
          className={cn(
            "absolute inset-0 flex items-center justify-center",
            "text-sm font-bold transition-all duration-200",
            isPressed && "scale-110 text-primary-400",
          )}
        >
          {children || (
            <div className="text-center">
              <div className="text-lg font-bold">{clampedProgress}%</div>
              {onTap && (
                <div className="text-sm text-muted-foreground mt-1">
                  اضغط للتفاصيل
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </ScaleIn>
  );
}
export default ProgressRing;
