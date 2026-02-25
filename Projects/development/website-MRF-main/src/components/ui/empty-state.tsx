import { Button } from "./button";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  secondaryActionLabel?: string;
  onSecondaryAction?: () => void;
  className?: string;
  /** Compact variant for smaller spaces */
  compact?: boolean;
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  actionLabel,
  onAction,
  secondaryActionLabel,
  onSecondaryAction,
  className,
  compact = false,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center text-center",
        compact ? "py-8 px-4" : "py-16 px-4",
        className
      )}
    >
      <div className={cn("relative", compact ? "mb-4" : "mb-6")}>
        {/* Animated background circle */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-primary/5 rounded-full blur-2xl animate-pulse" />

        {/* Icon container */}
        <div
          className={cn(
            "relative rounded-full bg-muted flex items-center justify-center",
            compact ? "w-16 h-16" : "w-20 h-20"
          )}
        >
          <Icon
            className={cn(
              "text-muted-foreground",
              compact ? "w-8 h-8" : "w-10 h-10"
            )}
            strokeWidth={1.5}
          />
        </div>
      </div>

      <h3
        className={cn(
          "font-semibold text-foreground font-display",
          compact ? "text-lg mb-2" : "text-xl mb-3"
        )}
      >
        {title}
      </h3>
      <p
        className={cn(
          "text-muted-foreground max-w-md leading-relaxed",
          compact ? "text-sm mb-4" : "text-base mb-6"
        )}
      >
        {description}
      </p>

      {(actionLabel || secondaryActionLabel) && (
        <div className="flex flex-col sm:flex-row gap-3">
          {actionLabel && onAction && (
            <Button onClick={onAction} size={compact ? "default" : "lg"}>
              {actionLabel}
            </Button>
          )}
          {secondaryActionLabel && onSecondaryAction && (
            <Button
              onClick={onSecondaryAction}
              variant="outline"
              size={compact ? "default" : "lg"}
            >
              {secondaryActionLabel}
            </Button>
          )}
        </div>
      )}
    </div>
  );
}

