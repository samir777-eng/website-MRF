"use client";

import { cn } from "@/lib/utils";
import { useId } from "react";

interface PillNavItem {
  label: string;
  value: string;
  icon?: React.ReactNode;
  count?: number;
}

interface PillNavProps {
  items: PillNavItem[];
  value: string;
  onChange: (value: string) => void;
  /** Accessible label for the navigation */
  ariaLabel?: string;
  className?: string;
}

export function PillNav({
  items,
  value,
  onChange,
  ariaLabel = "التنقل",
  className,
}: PillNavProps) {
  const id = useId();

  return (
    <div
      className={cn(
        "inline-flex items-center gap-1 p-1.5 bg-muted rounded-xl",
        className,
      )}
      role="tablist"
      aria-label={ariaLabel}
    >
      {items.map((item) => {
        const isActive = value === item.value;
        const tabId = `${id}-tab-${item.value}`;

        return (
          <button
            key={item.value}
            id={tabId}
            onClick={() => onChange(item.value)}
            className={cn(
              // 44px minimum touch target
              "flex items-center gap-2 px-4 h-11 min-w-[44px] rounded-lg text-sm font-semibold transition-all",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
              isActive
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground hover:bg-background/50",
            )}
            role="tab"
            aria-selected={isActive}
            tabIndex={isActive ? 0 : -1}
          >
            {item.icon && (
              <span className="shrink-0" aria-hidden="true">
                {item.icon}
              </span>
            )}
            <span>{item.label}</span>
            {item.count !== undefined && (
              <span
                className={cn(
                  "px-2 py-0.5 rounded-full text-xs font-medium",
                  isActive
                    ? "bg-primary/10 text-primary"
                    : "bg-background/50 text-muted-foreground",
                )}
                aria-label={`${item.count} عناصر`}
              >
                {item.count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
