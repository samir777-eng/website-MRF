"use client";

import * as React from "react";
import * as SeparatorPrimitive from "@radix-ui/react-separator";

import { cn } from "@/lib/utils";

interface SeparatorProps
  extends React.ComponentPropsWithoutRef<typeof SeparatorPrimitive.Root> {
  /** Text label to show in the middle of the separator */
  label?: string;
}

const Separator = React.forwardRef<
  React.ElementRef<typeof SeparatorPrimitive.Root>,
  SeparatorProps
>(
  (
    {
      className,
      orientation = "horizontal",
      decorative = false,
      label,
      ...props
    },
    ref
  ) => {
    if (label && orientation === "horizontal") {
      return (
        <div className={cn("flex items-center gap-3 w-full", className)}>
          <SeparatorPrimitive.Root
            ref={ref}
            decorative={decorative}
            orientation={orientation}
            className="shrink-0 bg-border h-[1px] flex-1"
            {...props}
          />
          <span className="text-sm text-muted-foreground shrink-0">{label}</span>
          <SeparatorPrimitive.Root
            decorative={decorative}
            orientation={orientation}
            className="shrink-0 bg-border h-[1px] flex-1"
          />
        </div>
      );
    }

    return (
      <SeparatorPrimitive.Root
        ref={ref}
        decorative={decorative}
        orientation={orientation}
        className={cn(
          "shrink-0 bg-border",
          orientation === "horizontal" ? "h-[1px] w-full" : "h-full w-[1px]",
          className
        )}
        {...props}
      />
    );
  }
);
Separator.displayName = SeparatorPrimitive.Root.displayName;

export { Separator };
