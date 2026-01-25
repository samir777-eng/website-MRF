"use client";

import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import { Check } from "lucide-react";
import * as React from "react";

import { cn } from "@/lib/utils";

/**
 * Checkbox component with accessible touch target
 *
 * ACCESSIBILITY: The checkbox wrapper has 44x44px minimum touch target
 * with the visual checkbox indicator (20px) centered inside
 */
const Checkbox = React.forwardRef<
  React.ElementRef<typeof CheckboxPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>
>(({ className, ...props }, ref) => (
  <CheckboxPrimitive.Root
    ref={ref}
    className={cn(
      // Touch target wrapper - 44px minimum
      "peer relative flex items-center justify-center shrink-0",
      "min-w-[44px] min-h-[44px]",
      // Focus styling
      "ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-md",
      "disabled:cursor-not-allowed disabled:opacity-50",
      "group",
      className
    )}
    {...props}
  >
    {/* Visual checkbox indicator - 20px */}
    <span
      className={cn(
        "flex items-center justify-center h-5 w-5 rounded-md border-2 transition-all duration-150",
        "border-input bg-background",
        "group-hover:border-primary/50",
        "group-active:scale-90",
        "data-[state=checked]:border-primary data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground",
        "data-[state=checked]:scale-100"
      )}
      data-state={props.checked ? "checked" : "unchecked"}
    >
      <CheckboxPrimitive.Indicator className="flex items-center justify-center text-current animate-scale-in">
        <Check className="h-3.5 w-3.5" strokeWidth={3} />
      </CheckboxPrimitive.Indicator>
    </span>
  </CheckboxPrimitive.Root>
));
Checkbox.displayName = CheckboxPrimitive.Root.displayName;

export { Checkbox };
