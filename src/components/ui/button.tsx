"use client";
// Force recompile: v4 - WCAG 2.2 AA touch target compliance (44px minimum all breakpoints)

import { cn } from "@/lib/utils";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-semibold transition-all duration-150 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-60 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 active:scale-[0.98] active:transition-transform active:duration-75",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground shadow-soft hover:bg-primary/90 hover:shadow-soft-lg hover:-translate-y-0.5",
        destructive:
          "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90 hover:shadow-md",
        outline:
          "border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground hover:border-accent hover:shadow-sm",
        secondary:
          "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline active:scale-100",
        // Gamification/Status variants
        success:
          "bg-green-600 text-white shadow-soft hover:bg-green-700 hover:shadow-green/25 hover:shadow-soft-lg dark:bg-green-600 dark:hover:bg-green-500",
        warning:
          "bg-amber-600 text-white shadow-soft hover:bg-amber-700 hover:shadow-amber/25 hover:shadow-soft-lg focus-visible:ring-amber-500 dark:bg-amber-600 dark:hover:bg-amber-500",
        // Special effect variants
        glass:
          "glass text-foreground hover:bg-background/80 shadow-soft hover:shadow-soft-lg hover:-translate-y-0.5",
        gradient:
          "bg-gradient-primary text-white shadow-lg hover:shadow-xl hover:shadow-primary/25 hover:-translate-y-0.5 border-0",
      },
      size: {
        default: "h-11 px-4 py-2", // 44px - WCAG 2.2 AA compliant
        sm: "h-11 px-3 text-sm", // 44px - WCAG 2.2 AA compliant (14px font)
        lg: "h-12 px-8", // 48px
        xl: "h-14 px-10 text-base", // 56px
        icon: "h-11 w-11", // 44px x 44px - WCAG 2.2 AA compliant
      },
      rounded: {
        default: "rounded-lg",
        md: "rounded-md",
        xl: "rounded-xl",
        "2xl": "rounded-2xl",
        full: "rounded-full",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      rounded: "default",
    },
  },
);

export interface ButtonProps
  extends
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  loading?: boolean;
  "aria-label"?: string; // Make it obvious this is needed for icon-only buttons
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      rounded,
      asChild = false,
      loading = false,
      children,
      disabled,
      type = "button",
      ...props
    },
    ref,
  ) => {
    // Check for icon-only buttons and warn if missing aria-label
    React.useEffect(() => {
      if (
        typeof window !== "undefined" &&
        process.env.NODE_ENV === "development"
      ) {
        const hasOnlyIcon =
          (React.Children.count(children) === 1 &&
            React.isValidElement(children) &&
            (children.type as any)?.displayName?.includes("Icon")) ||
          (typeof children === "object" && children && "type" in children);

        if (hasOnlyIcon && !props["aria-label"] && !props["aria-labelledby"]) {
          console.warn("Icon-only button missing aria-label:", children);
        }
      }
    }, [children, props]);

    // For asChild, just pass through to Slot without modifications
    if (asChild) {
      return (
        <Slot
          className={cn(buttonVariants({ variant, size, rounded, className }))}
          ref={ref}
          {...props}
        >
          {children}
        </Slot>
      );
    }

    // Regular button with loading support
    return (
      <button
        className={cn(buttonVariants({ variant, size, rounded, className }))}
        ref={ref}
        disabled={disabled || loading}
        type={type}
        {...props}
      >
        {loading && (
          <svg
            className="animate-spin -ms-1 me-2 h-4 w-4"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
        )}
        {children}
      </button>
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
