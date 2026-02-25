"use client";

/**
 * Enhanced Skeleton Components - Phase 1 Task 1.3
 * Advanced loading states with various variants and smooth animations
 */

import { cn } from "@/lib/utils";

// ============================================================================
// BASE ENHANCED SKELETON
// ============================================================================

interface EnhancedSkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "text" | "circular" | "rectangular" | "card";
  width?: string | number;
  height?: string | number;
  animation?: "pulse" | "wave" | "shimmer";
}

export function EnhancedSkeleton({
  variant = "rectangular",
  width,
  height,
  animation = "shimmer",
  className,
  ...props
}: EnhancedSkeletonProps) {
  const variantClasses = {
    text: "h-4 rounded",
    circular: "rounded-full",
    rectangular: "rounded-lg",
    card: "h-48 rounded-xl",
  };

  const animationClasses = {
    pulse: "animate-pulse",
    wave: "animate-pulse",
    shimmer:
      "relative overflow-hidden isolate before:absolute before:inset-0 before:-translate-x-full before:animate-shimmer before:bg-gradient-to-r before:from-transparent before:via-foreground/5 before:to-transparent dark:before:via-foreground/10",
  };

  const style: React.CSSProperties = {};
  if (width) style.width = typeof width === "number" ? `${width}px` : width;
  if (height) style.height = typeof height === "number" ? `${height}px` : height;

  return (
    <div
      className={cn(
        "bg-muted",
        variantClasses[variant],
        animationClasses[animation],
        className
      )}
      style={style}
      aria-hidden="true"
      {...props}
    />
  );
}

// ============================================================================
// SPECIALIZED SKELETON COMPONENTS
// ============================================================================

export function SkeletonText({
  lines = 1,
  lastLineWidth = "100%",
  className,
  ...props
}: {
  lines?: number;
  lastLineWidth?: string;
  className?: string;
}) {
  return (
    <div className={cn("space-y-2", className)} {...props}>
      {Array.from({ length: lines }).map((_, i) => (
        <EnhancedSkeleton
          key={i}
          variant="text"
          width={i === lines - 1 ? lastLineWidth : "100%"}
          height="16px"
        />
      ))}
    </div>
  );
}

export function SkeletonCard({
  className,
  hasImage = true,
  hasTitle = true,
  hasDescription = true,
  hasActions = false,
  ...props
}: {
  className?: string;
  hasImage?: boolean;
  hasTitle?: boolean;
  hasDescription?: boolean;
  hasActions?: boolean;
}) {
  return (
    <div
      className={cn(
        "p-4 rounded-xl border border-border bg-card space-y-4",
        className
      )}
      {...props}
    >
      {hasImage && (
        <EnhancedSkeleton variant="rectangular" height="160px" width="100%" />
      )}

      <div className="space-y-3">
        {hasTitle && <EnhancedSkeleton variant="text" width="75%" height="20px" />}

        {hasDescription && (
          <div className="space-y-2">
            <EnhancedSkeleton variant="text" width="100%" height="14px" />
            <EnhancedSkeleton variant="text" width="90%" height="14px" />
          </div>
        )}

        {hasActions && (
          <div className="flex gap-2 pt-2">
            <EnhancedSkeleton variant="rectangular" width="100px" height="36px" />
            <EnhancedSkeleton variant="rectangular" width="80px" height="36px" />
          </div>
        )}
      </div>
    </div>
  );
}

export function SkeletonAvatar({
  size = "md",
  className,
  ...props
}: {
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}) {
  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-10 h-10",
    lg: "w-12 h-12",
    xl: "w-16 h-16",
  };

  return (
    <EnhancedSkeleton
      variant="circular"
      className={cn(sizeClasses[size], className)}
      {...props}
    />
  );
}

export function SkeletonButton({
  size = "md",
  className,
  ...props
}: {
  size?: "sm" | "md" | "lg";
  className?: string;
}) {
  const sizeClasses = {
    sm: "h-9 w-20",
    md: "h-11 w-24",
    lg: "h-12 w-28",
  };

  return (
    <EnhancedSkeleton
      variant="rectangular"
      className={cn("rounded-xl", sizeClasses[size], className)}
      {...props}
    />
  );
}

// ============================================================================
// STAT CARD SKELETON
// ============================================================================

export function SkeletonStatCard({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "p-4 rounded-xl border border-border bg-card space-y-3",
        className
      )}
    >
      <div className="flex items-center justify-between">
        <EnhancedSkeleton variant="text" width="60px" height="14px" />
        <EnhancedSkeleton variant="circular" width="32px" height="32px" />
      </div>
      <EnhancedSkeleton variant="text" width="80px" height="32px" />
      <EnhancedSkeleton variant="text" width="100px" height="12px" />
    </div>
  );
}

// ============================================================================
// LIST ITEM SKELETON
// ============================================================================

export function SkeletonListItem({
  hasAvatar = true,
  hasSecondaryText = true,
  hasTrailing = false,
  className,
}: {
  hasAvatar?: boolean;
  hasSecondaryText?: boolean;
  hasTrailing?: boolean;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex items-center gap-3 p-3 rounded-lg border border-border bg-card",
        className
      )}
    >
      {hasAvatar && <SkeletonAvatar size="md" />}

      <div className="flex-1 space-y-2">
        <EnhancedSkeleton variant="text" width="60%" height="16px" />
        {hasSecondaryText && (
          <EnhancedSkeleton variant="text" width="40%" height="14px" />
        )}
      </div>

      {hasTrailing && <EnhancedSkeleton variant="text" width="48px" height="24px" />}
    </div>
  );
}
