import * as React from "react";

import { cn } from "@/lib/utils";

export type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

/**
 * Input component with WCAG 2.2 AA compliance:
 * - 44px height (h-11) for touch targets
 * - 16px font size (text-base) to prevent iOS Safari auto-zoom on focus
 * - RTL text alignment
 */
const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    // Email, URL, and tel inputs should remain LTR even in RTL layouts
    const isLTRInput = type === "email" || type === "url" || type === "tel";

    return (
      <input
        type={type}
        className={cn(
          "flex h-11 w-full rounded-xl border border-input bg-background/50 px-4 py-2.5 text-base ring-offset-background shadow-sm backdrop-blur-[2px]",
          "file:border-0 file:bg-transparent file:text-base file:font-medium",
          "placeholder:text-muted-foreground placeholder:transition-opacity",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 focus-visible:border-primary focus-visible:shadow-hue transition-all duration-200",
          "focus:placeholder:opacity-60",
          "disabled:cursor-not-allowed disabled:opacity-50",
          "transition-all duration-150",
          isLTRInput ? "text-left direction-ltr" : "text-start",
          className,
        )}
        ref={ref}
        {...props}
      />
    );
  },
);
Input.displayName = "Input";

export { Input };
