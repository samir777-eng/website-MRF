"use client";

import * as SwitchPrimitives from "@radix-ui/react-switch";
import * as React from "react";

import { cn } from "@/lib/utils";

/**
 * Switch component with accessible touch target
 *
 * ACCESSIBILITY: Wrapper ensures 44x44px minimum touch target on mobile
 * RTL: Thumb translation direction is reversed in RTL mode
 */
const Switch = React.forwardRef<
  React.ElementRef<typeof SwitchPrimitives.Root>,
  React.ComponentPropsWithoutRef<typeof SwitchPrimitives.Root>
>(({ className, ...props }, ref) => (
  // Wrapper provides 44px touch target on mobile
  <div className="relative flex items-center min-h-[44px] md:min-h-0">
    <SwitchPrimitives.Root
      className={cn(
        "peer inline-flex h-7 w-12 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent",
        "transition-all duration-200 ease-spring",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        "disabled:cursor-not-allowed disabled:opacity-50",
        "data-[state=checked]:bg-primary data-[state=unchecked]:bg-input",
        "hover:data-[state=unchecked]:bg-input/80",
        "active:scale-[0.97]",
        className
      )}
      {...props}
      ref={ref}
    >
      <SwitchPrimitives.Thumb
        className={cn(
          "pointer-events-none block h-6 w-6 rounded-full bg-background shadow-md ring-0",
          "transition-all duration-200 ease-spring",
          // LTR: unchecked=left(0), checked=right(5)
          // RTL: unchecked=right(0), checked=left(-5) - handled by rtl: variant
          "data-[state=unchecked]:translate-x-0 data-[state=unchecked]:shadow-sm",
          "data-[state=checked]:translate-x-5 data-[state=checked]:shadow-lg",
          "rtl:data-[state=checked]:-translate-x-5"
        )}
      />
    </SwitchPrimitives.Root>
  </div>
));
Switch.displayName = SwitchPrimitives.Root.displayName;

export { Switch };
