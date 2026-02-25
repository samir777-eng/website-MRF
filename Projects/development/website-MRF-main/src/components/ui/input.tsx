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
          "flex h-11 w-full rounded-xl border-2 border-gray-300 dark:border-gray-600 bg-background/50 px-4 py-2.5 text-base ring-offset-background shadow-sm backdrop-blur-[2px]",
          "file:border-0 file:bg-transparent file:text-base file:font-medium",
          "placeholder:text-gray-500 placeholder:transition-opacity",
          "hover:border-gray-400 dark:hover:border-gray-500",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 focus-visible:border-primary focus-visible:shadow-hue",
          "focus:placeholder:opacity-60",
          "disabled:cursor-not-allowed disabled:opacity-60",
          "transition-all duration-200",
          isLTRInput ? "text-start direction-ltr" : "text-start",
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
