import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";

const badgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded-full border font-medium transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: "border-transparent bg-primary text-primary-foreground",
        secondary: "border-transparent bg-secondary text-secondary-foreground",
        destructive:
          "border-transparent bg-destructive text-destructive-foreground",
        outline: "border-border text-foreground bg-transparent",
        // Gamification variants with subtle glow on hover
        xp: "border-transparent bg-cyan-100 text-cyan-800 dark:bg-cyan-900/50 dark:text-cyan-300 hover:shadow-cyan-500/20 hover:shadow-sm",
        streak:
          "border-transparent bg-orange-100 text-orange-800 dark:bg-orange-900/50 dark:text-orange-300 hover:shadow-orange/20 hover:shadow-sm",
        gems: "border-transparent bg-cyan-100 text-cyan-800 dark:bg-cyan-900/50 dark:text-cyan-300 hover:shadow-cyan-500/20 hover:shadow-sm",
        level:
          "border-transparent bg-violet-100 text-violet-800 dark:bg-violet-900/50 dark:text-violet-300 hover:shadow-violet/20 hover:shadow-sm",
        achievement:
          "border-transparent bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-300 hover:shadow-amber-500/20 hover:shadow-sm",
        // Status variants
        success:
          "border-transparent bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300",
        warning:
          "border-transparent bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-300",
        error:
          "border-transparent bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300",
        info: "border-transparent bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300",
      },
      size: {
        sm: "px-2 py-0.5 text-xs",
        default: "px-2.5 py-0.5 text-sm",
        lg: "px-3 py-1 text-sm",
      },
      // Animation variants
      animated: {
        true: "",
        false: "",
        pulse: "animate-pulse-gentle",
        bounce: "animate-bounce-gentle",
        glow: "animate-glow-pulse",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      animated: false,
    },
  },
);

export interface BadgeProps
  extends
    React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {
  /** Optional icon to display before text */
  icon?: React.ReactNode;
}

function Badge({
  className,
  variant,
  size,
  animated,
  icon,
  children,
  ...props
}: BadgeProps) {
  return (
    <div
      className={cn(badgeVariants({ variant, size, animated }), className)}
      {...props}
    >
      {icon && (
        <span className="shrink-0 [&>svg]:w-3.5 [&>svg]:h-3.5">{icon}</span>
      )}
      {children}
    </div>
  );
}

export { Badge, badgeVariants };
