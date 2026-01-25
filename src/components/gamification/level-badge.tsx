import { Badge } from "@/components/ui/badge";
import { Crown } from "lucide-react";
import { cn } from "@/lib/utils";

interface LevelBadgeProps {
  level: number;
  className?: string;
  showIcon?: boolean;
  size?: "sm" | "md" | "lg";
}

export function LevelBadge({
  level,
  className,
  showIcon = true,
  size = "md",
}: LevelBadgeProps) {
  // Ensure level is never less than 1
  const displayLevel = Math.max(1, level);

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

  const ariaLabel = `المستوى ${displayLevel}`;

  return (
    <Badge
      data-testid="level-badge"
      variant="level"
      className={cn(
        "inline-flex items-center gap-1 font-bold",
        sizeClasses[size],
        className,
      )}
      aria-label={ariaLabel}
      role="status"
    >
      {showIcon && <Crown className={cn("fill-current", iconSizes[size])} />}
      المستوى {displayLevel}
    </Badge>
  );
}
export default LevelBadge;
