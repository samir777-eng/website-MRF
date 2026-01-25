"use client";

/**
 * PullToRefresh - Phase 2 Task 2.3
 * Smooth pull-to-refresh with rubber band effect and haptic feedback
 */

import { motion, useMotionValue, useTransform, AnimatePresence } from "framer-motion";
import { RefreshCw, Loader2 } from "lucide-react";
import { usePullToRefresh } from "@/lib/swipe-gestures";
import { cn } from "@/lib/utils";

// ============================================================================
// TYPES
// ============================================================================

interface PullToRefreshProps {
  onRefresh: () => Promise<void>;
  children: React.ReactNode;
  threshold?: number;
  refreshingDuration?: number;
  disabled?: boolean;
  className?: string;
}

// ============================================================================
// PULL TO REFRESH COMPONENT
// ============================================================================

export function PullToRefresh({
  onRefresh,
  children,
  threshold = 80,
  refreshingDuration = 1000,
  disabled = false,
  className,
}: PullToRefreshProps) {
  const { isRefreshing, pullDistance, progress } = usePullToRefresh(onRefresh, {
    threshold,
    refreshingDuration,
    disabled,
  });

  // Rubber band effect - diminishing returns as you pull further
  const rubberBandDistance = useTransform(
    useMotionValue(pullDistance),
    [0, threshold, threshold * 1.5],
    [0, threshold, threshold * 1.2]
  );

  // Rotation based on pull distance
  const rotation = useTransform(
    useMotionValue(pullDistance),
    [0, threshold],
    [0, 180]
  );

  // Opacity fade in
  const opacity = useTransform(
    useMotionValue(pullDistance),
    [0, threshold / 2, threshold],
    [0, 0.5, 1]
  );

  // Scale up as approaching threshold
  const scale = useTransform(
    useMotionValue(pullDistance),
    [0, threshold / 2, threshold],
    [0.5, 0.8, 1]
  );

  const isTriggered = pullDistance >= threshold;

  return (
    <div className={cn("relative overflow-hidden", className)}>
      {/* Pull Indicator */}
      <AnimatePresence>
        {(pullDistance > 0 || isRefreshing) && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="absolute top-0 left-0 right-0 z-50 flex items-center justify-center"
            style={{
              height: isRefreshing ? threshold : rubberBandDistance,
            }}
          >
            <div className="flex flex-col items-center gap-2">
              {/* Icon */}
              <motion.div
                style={{
                  opacity,
                  scale,
                  rotate: isRefreshing ? 0 : rotation,
                }}
                animate={
                  isRefreshing
                    ? {
                        rotate: 360,
                      }
                    : {}
                }
                transition={
                  isRefreshing
                    ? {
                        duration: 1,
                        repeat: Infinity,
                        ease: "linear",
                      }
                    : {}
                }
                className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center",
                  isTriggered || isRefreshing
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground"
                )}
              >
                {isRefreshing ? (
                  <Loader2 className="w-5 h-5" />
                ) : (
                  <RefreshCw className="w-5 h-5" />
                )}
              </motion.div>

              {/* Text */}
              <motion.p
                style={{ opacity }}
                className="text-xs font-medium text-muted-foreground"
              >
                {isRefreshing
                  ? "جاري التحديث..."
                  : isTriggered
                    ? "اترك للتحديث"
                    : "اسحب للتحديث"}
              </motion.p>

              {/* Progress Bar */}
              {!isRefreshing && (
                <motion.div
                  style={{ opacity }}
                  className="w-24 h-1 bg-muted rounded-full overflow-hidden"
                >
                  <motion.div
                    className="h-full bg-primary"
                    style={{
                      width: `${progress}%`,
                    }}
                  />
                </motion.div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Content */}
      <motion.div
        style={{
          y: isRefreshing ? threshold : rubberBandDistance,
        }}
        transition={{
          type: "spring",
          stiffness: 300,
          damping: 30,
        }}
      >
        {children}
      </motion.div>
    </div>
  );
}

// ============================================================================
// SIMPLE REFRESH INDICATOR (Alternative)
// ============================================================================

export function SimpleRefreshIndicator({
  isRefreshing,
  className,
}: {
  isRefreshing: boolean;
  className?: string;
}) {
  return (
    <AnimatePresence>
      {isRefreshing && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className={cn(
            "fixed top-0 left-0 right-0 z-50 bg-primary/90 backdrop-blur-sm",
            "py-2 px-4 flex items-center justify-center gap-2 text-primary-foreground",
            className
          )}
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          >
            <RefreshCw className="w-4 h-4" />
          </motion.div>
          <span className="text-sm font-medium">جاري التحديث...</span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default PullToRefresh;
