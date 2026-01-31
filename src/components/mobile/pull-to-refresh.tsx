"use client";

import { cn } from "@/lib/utils";
import { ArrowDown, Loader2, RefreshCw } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

interface PullToRefreshProps {
  onRefresh: () => Promise<void>;
  children: React.ReactNode;
  className?: string;
  threshold?: number;
  disabled?: boolean;
  refreshingText?: string;
  pullText?: string;
  releaseText?: string;
}

type PullState = "idle" | "pulling" | "ready" | "refreshing";

export function PullToRefresh({
  onRefresh,
  children,
  className,
  threshold = 80,
  disabled = false,
  refreshingText = "جاري التحديث...",
  pullText = "اسحب للتحديث",
  releaseText = "حرر للتحديث",
}: PullToRefreshProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [pullState, setPullState] = useState<PullState>("idle");
  const [pullDistance, setPullDistance] = useState(0);
  const touchStartY = useRef(0);
  const scrollTopRef = useRef(0);

  const handleTouchStart = useCallback(
    (e: TouchEvent) => {
      if (disabled || pullState === "refreshing") return;

      const container = containerRef.current;
      if (!container) return;

      // Only activate if scrolled to top
      scrollTopRef.current = container.scrollTop;
      if (scrollTopRef.current <= 0) {
        touchStartY.current = e.touches[0].clientY;
      }
    },
    [disabled, pullState],
  );

  const handleTouchMove = useCallback(
    (e: TouchEvent) => {
      if (disabled || pullState === "refreshing") return;
      if (scrollTopRef.current > 0) return;

      const currentY = e.touches[0].clientY;
      const distance = currentY - touchStartY.current;

      if (distance > 0) {
        // Apply resistance to pull (diminishing returns)
        const adjustedDistance = Math.min(distance * 0.5, threshold * 1.5);
        setPullDistance(adjustedDistance);

        if (adjustedDistance >= threshold) {
          setPullState("ready");
        } else if (adjustedDistance > 0) {
          setPullState("pulling");
        }

        // Prevent scroll during pull
        if (distance > 10) {
          e.preventDefault();
        }
      }
    },
    [disabled, pullState, threshold],
  );

  const handleTouchEnd = useCallback(async () => {
    if (disabled || pullState === "refreshing") return;

    if (pullState === "ready") {
      setPullState("refreshing");
      setPullDistance(threshold * 0.6); // Keep indicator visible during refresh

      // Haptic feedback
      if ("vibrate" in navigator) {
        navigator.vibrate(50);
      }

      try {
        await onRefresh();
      } finally {
        setPullState("idle");
        setPullDistance(0);
      }
    } else {
      setPullState("idle");
      setPullDistance(0);
    }

    touchStartY.current = 0;
  }, [disabled, onRefresh, pullState, threshold]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    container.addEventListener("touchstart", handleTouchStart, {
      passive: true,
    });
    container.addEventListener("touchmove", handleTouchMove, {
      passive: false,
    });
    container.addEventListener("touchend", handleTouchEnd, { passive: true });

    return () => {
      container.removeEventListener("touchstart", handleTouchStart);
      container.removeEventListener("touchmove", handleTouchMove);
      container.removeEventListener("touchend", handleTouchEnd);
    };
  }, [handleTouchStart, handleTouchMove, handleTouchEnd]);

  const getIndicatorContent = () => {
    switch (pullState) {
      case "refreshing":
        return (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            <span className="text-sm font-medium">{refreshingText}</span>
          </>
        );
      case "ready":
        return (
          <>
            <RefreshCw className="w-5 h-5" />
            <span className="text-sm font-medium">{releaseText}</span>
          </>
        );
      case "pulling":
      default:
        return (
          <>
            <ArrowDown
              className="w-5 h-5 transition-transform duration-200"
              style={{
                transform: `rotate(${Math.min((pullDistance / threshold) * 180, 180)}deg)`,
              }}
            />
            <span className="text-sm font-medium">{pullText}</span>
          </>
        );
    }
  };

  const indicatorOpacity =
    pullState === "idle" ? 0 : Math.min(pullDistance / (threshold * 0.5), 1);
  const indicatorScale =
    pullState === "refreshing"
      ? 1
      : Math.min(0.5 + (pullDistance / threshold) * 0.5, 1);

  return (
    <div
      ref={containerRef}
      className={cn("relative overflow-auto", className)}
      style={{
        // Prevent overscroll on iOS
        WebkitOverflowScrolling: "touch",
        overscrollBehavior: "none",
      }}
    >
      {/* Pull-to-refresh indicator */}
      <div
        className="absolute left-0 right-0 flex justify-center pointer-events-none z-50"
        style={{
          top: Math.max(pullDistance - 60, -60),
          transition: pullState === "idle" ? "top 300ms ease-out" : "none",
        }}
      >
        <div
          className={cn(
            "flex items-center gap-2 px-4 py-2 rounded-full",
            "bg-primary/10 text-primary backdrop-blur-sm",
            "border border-primary/20 shadow-lg",
            "transition-all duration-200",
          )}
          style={{
            opacity: indicatorOpacity,
            transform: `scale(${indicatorScale})`,
          }}
        >
          {getIndicatorContent()}
        </div>
      </div>

      {/* Content wrapper with pull offset */}
      <div
        style={{
          transform: `translateY(${pullDistance}px)`,
          transition:
            pullState === "idle" ? "transform 300ms ease-out" : "none",
        }}
      >
        {children}
      </div>
    </div>
  );
}

// Hook version for more control
export function usePullToRefresh(
  onRefresh: () => Promise<void>,
  options: {
    threshold?: number;
    disabled?: boolean;
  } = {},
) {
  const { threshold = 80, disabled = false } = options;
  const [pullState, setPullState] = useState<PullState>("idle");
  const [pullDistance, setPullDistance] = useState(0);
  const touchStartY = useRef(0);
  const scrollTopRef = useRef(0);

  const bind = useCallback(
    () => ({
      onTouchStart: (e: React.TouchEvent) => {
        if (disabled || pullState === "refreshing") return;
        scrollTopRef.current =
          window.scrollY || document.documentElement.scrollTop;
        if (scrollTopRef.current <= 0) {
          touchStartY.current = e.touches[0].clientY;
        }
      },
      onTouchMove: (e: React.TouchEvent) => {
        if (disabled || pullState === "refreshing" || scrollTopRef.current > 0)
          return;

        const distance = e.touches[0].clientY - touchStartY.current;
        if (distance > 0) {
          const adjusted = Math.min(distance * 0.5, threshold * 1.5);
          setPullDistance(adjusted);
          setPullState(adjusted >= threshold ? "ready" : "pulling");
        }
      },
      onTouchEnd: async () => {
        if (disabled || pullState === "refreshing") return;

        if (pullState === "ready") {
          setPullState("refreshing");
          if ("vibrate" in navigator) navigator.vibrate(50);
          try {
            await onRefresh();
          } finally {
            setPullState("idle");
            setPullDistance(0);
          }
        } else {
          setPullState("idle");
          setPullDistance(0);
        }
      },
    }),
    [disabled, onRefresh, pullState, threshold],
  );

  return {
    pullState,
    pullDistance,
    isRefreshing: pullState === "refreshing",
    bind,
  };
}
