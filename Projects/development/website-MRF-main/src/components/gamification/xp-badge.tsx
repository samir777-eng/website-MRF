"use client";

import { Badge } from "@/components/ui/badge";
import { Zap } from "@/components/ui/icons";
import { cn } from "@/lib/utils";
import { ScaleIn } from "@/lib/animations/lightweight-motion";

interface XPBadgeProps {
  xp: number;
  className?: string;
  showIcon?: boolean;
  size?: "sm" | "md" | "lg";
  xpGained?: number;
  showAnimation?: boolean;
}

export function XPBadge({
  xp,
  className,
  showIcon = true,
  size = "md",
  xpGained = 0,
  showAnimation = false,
}: XPBadgeProps) {
  // Ensure XP is never negative
  const displayXP = Math.max(0, xp);

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

  const ariaLabel = `نقاط الخبرة: ${displayXP.toLocaleString()}`;

  return (
    <div className="relative">
      <ScaleIn
        scale={showAnimation ? 0.8 : 1}
        duration={showAnimation ? 500 : 0}
      >
        <Badge
          data-testid="xp-badge"
          variant="xp"
          className={cn(
            "inline-flex items-center gap-1 font-bold gen-z-gradient text-white border-0 shadow-lg",
            sizeClasses[size],
            showAnimation && "micro-pulse",
            className,
          )}
          aria-label={ariaLabel}
          role="status"
        >
          {showIcon && <Zap className={cn("text-white", iconSizes[size])} />}
          {displayXP.toLocaleString()} XP
        </Badge>
      </ScaleIn>

      {xpGained > 0 && showAnimation && (
        <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 z-10 micro-bounce">
          <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-sm font-bold px-3 py-1.5 rounded-full shadow-lg whitespace-nowrap gen-z-glow">
            +{xpGained} XP ✨
          </div>
        </div>
      )}
    </div>
  );
}
export default XPBadge;
