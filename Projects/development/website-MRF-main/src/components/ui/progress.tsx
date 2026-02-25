import { cn } from "@/lib/utils";
import * as ProgressPrimitive from "@radix-ui/react-progress";
import * as React from "react";

const variantStyles = {
  default: "bg-primary",
  xp: "bg-gradient-to-r from-green-500 to-emerald-400",
  streak: "bg-gradient-to-r from-orange-500 to-amber-400",
  gems: "bg-gradient-to-r from-cyan-500 to-sky-400",
  level: "bg-gradient-to-r from-violet-500 to-purple-400",
  success: "bg-green-500 dark:bg-green-400",
  warning: "bg-amber-500 dark:bg-amber-400",
  error: "bg-red-500 dark:bg-red-400",
};

const sizeStyles = {
  sm: "h-1.5",
  default: "h-2.5",
  lg: "h-4",
  xl: "h-6",
};

type ProgressVariant = keyof typeof variantStyles;
type ProgressSize = keyof typeof sizeStyles;

interface ProgressProps
  extends React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root> {
  variant?: ProgressVariant;
  size?: ProgressSize;
  /** Show label with percentage above the bar */
  showLabel?: boolean;
  /** Custom label text (defaults to "التقدم") */
  label?: string;
  /** Show percentage inside the bar (requires lg or xl size) */
  showPercentageInside?: boolean;
}

const Progress = React.forwardRef<
  React.ElementRef<typeof ProgressPrimitive.Root>,
  ProgressProps
>(
  (
    {
      className,
      value,
      variant = "default",
      size = "default",
      showLabel = false,
      label,
      showPercentageInside = false,
      ...props
    },
    ref
  ) => {
    const max = props.max ?? 100;

    // Sanitize value: convert NaN, negative, or invalid values to null (indeterminate)
    const sanitizedValue =
      value === null || value === undefined
        ? null
        : typeof value === "number" && !Number.isNaN(value) && value >= 0
          ? Math.min(value, max)
          : null;

    const percentage =
      sanitizedValue !== null ? Math.round((sanitizedValue / max) * 100) : 0;
    const canShowInside =
      (size === "lg" || size === "xl") && showPercentageInside;

    const progressBar = (
      <ProgressPrimitive.Root
        ref={ref}
        value={sanitizedValue}
        className={cn(
          "relative w-full overflow-hidden rounded-full bg-muted",
          sizeStyles[size]
        )}
        {...props}
      >
        <ProgressPrimitive.Indicator
          className={cn(
            "h-full rounded-full transition-all duration-300 ease-out",
            variantStyles[variant]
          )}
          style={{
            width: `${percentage}%`,
          }}
        />
        {canShowInside && percentage > 10 && (
          <span className="absolute inset-0 flex items-center justify-center text-xs font-semibold text-white mix-blend-difference">
            {percentage}%
          </span>
        )}
      </ProgressPrimitive.Root>
    );

    if (!showLabel) {
      return <div className={className}>{progressBar}</div>;
    }

    return (
      <div className={cn("w-full", className)}>
        <div className="flex items-center justify-between mb-2 text-sm">
          <span className="text-muted-foreground">{label || "التقدم"}</span>
          <span className="font-semibold text-foreground tabular-nums">
            {percentage}%
          </span>
        </div>
        {progressBar}
      </div>
    );
  }
);
Progress.displayName = ProgressPrimitive.Root.displayName;

export { Progress, type ProgressVariant, type ProgressSize };
