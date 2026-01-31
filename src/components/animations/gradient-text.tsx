"use client";

import { cn } from "@/lib/utils";

interface GradientTextProps {
  children: React.ReactNode;
  className?: string;
  from?: string;
  via?: string;
  to?: string;
  animate?: boolean;
}

export function GradientText({
  children,
  className,
  from = "from-blue-600",
  via,
  to = "to-purple-600",
  animate = false,
}: GradientTextProps) {
  const gradientClasses = via
    ? `bg-gradient-to-r ${from} ${via} ${to}`
    : `bg-gradient-to-r ${from} ${to}`;

  return (
    <span
      className={cn(
        "bg-clip-text text-transparent",
        gradientClasses,
        animate && "animate-gradient bg-[length:200%_auto]",
        className,
      )}
    >
      {children}
    </span>
  );
}

export default GradientText;
