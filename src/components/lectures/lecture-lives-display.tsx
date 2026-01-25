"use client";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { formatTimeRemaining } from "@/lib/lives-system";
import { cn } from "@/lib/utils";
import { Heart, HeartOff, Sparkles } from "lucide-react";

interface LectureLifeDisplayProps {
  livesRemaining: number;
  maxLives?: number;
  livesExpiryDate?: Date;
  className?: string;
  variant?: "default" | "compact" | "detailed";
  onPurchaseClick?: () => void;
}

export function LectureLifeDisplay({
  livesRemaining,
  maxLives = 3,
  livesExpiryDate,
  className,
  variant = "default",
  onPurchaseClick,
}: LectureLifeDisplayProps) {
  const hasLives = livesRemaining > 0;
  const livesExpired = livesExpiryDate ? new Date() > livesExpiryDate : false;

  // Calculate expiry time remaining
  const getExpiryTimeRemaining = () => {
    if (!livesExpiryDate) return null;
    const diff = livesExpiryDate.getTime() - Date.now();
    if (diff <= 0) return null;
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    return formatTimeRemaining(days, hours);
  };
  const expiryTimeRemaining = getExpiryTimeRemaining();

  if (variant === "compact") {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div
              className={cn(
                "flex items-center gap-1 text-sm",
                hasLives && !livesExpired
                  ? "text-rose-500"
                  : "text-muted-foreground",
                className
              )}
            >
              <Heart
                className={cn(
                  "w-4 h-4",
                  hasLives && !livesExpired ? "fill-rose-500" : ""
                )}
              />
              <span className="font-medium">{livesRemaining}</span>
            </div>
          </TooltipTrigger>
          <TooltipContent side="top" className="text-center">
            <p>
              {livesRemaining} من {maxLives} حياة متبقية
            </p>
            {expiryTimeRemaining && !livesExpired && (
              <p className="text-xs text-muted-foreground">
                تنتهي خلال {expiryTimeRemaining}
              </p>
            )}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  if (variant === "detailed") {
    return (
      <div className={cn("space-y-2", className)}>
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">الحياة المتبقية</span>
          <span className="text-sm text-muted-foreground">
            {livesRemaining} / {maxLives}
          </span>
        </div>

        {/* Hearts display */}
        <div className="flex items-center gap-1">
          {Array.from({ length: maxLives }).map((_, i) => {
            const isActive = i < livesRemaining && !livesExpired;
            return (
              <Heart
                key={i}
                className={cn(
                  "w-6 h-6 transition-colors",
                  isActive
                    ? "text-rose-500 fill-rose-500"
                    : "text-muted-foreground/30"
                )}
              />
            );
          })}
        </div>

        {/* Expiry info */}
        {expiryTimeRemaining && !livesExpired && (
          <p className="text-xs text-muted-foreground">
            صلاحية الحياة تنتهي خلال {expiryTimeRemaining}
          </p>
        )}

        {/* Lives expired warning */}
        {livesExpired && (
          <p className="text-xs text-amber-500 flex items-center gap-1">
            <HeartOff className="w-3 h-3" />
            انتهت صلاحية الحياة
          </p>
        )}

        {/* Purchase button */}
        {!hasLives && onPurchaseClick && (
          <button
            onClick={onPurchaseClick}
            className="w-full mt-2 px-3 py-2 bg-rose-500/10 hover:bg-rose-500/20 
                       text-rose-500 rounded-lg text-sm font-medium
                       flex items-center justify-center gap-2 transition-colors"
          >
            <Sparkles className="w-4 h-4" />
            شراء حياة جديدة
          </button>
        )}
      </div>
    );
  }

  // Default variant
  return (
    <div className={cn("flex items-center gap-1.5", className)}>
      {Array.from({ length: maxLives }).map((_, i) => {
        const isActive = i < livesRemaining && !livesExpired;
        return (
          <Heart
            key={i}
            className={cn(
              "w-5 h-5 transition-colors",
              isActive
                ? "text-rose-500 fill-rose-500"
                : "text-muted-foreground/30"
            )}
          />
        );
      })}
    </div>
  );
}
