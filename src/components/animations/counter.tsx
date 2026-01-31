"use client";

import { useEffect } from "react";
import { motion, useSpring, useTransform } from "framer-motion";
import { cn } from "@/lib/utils";

interface CounterProps {
  value: number;
  className?: string;
  duration?: number;
  suffix?: string;
  prefix?: string;
  decimals?: number;
}

export function Counter({
  value,
  className,
  duration = 2,
  suffix = "",
  prefix = "",
  decimals = 0,
}: CounterProps) {
  const spring = useSpring(0, {
    duration: duration * 1000,
    bounce: 0,
  });

  const display = useTransform(spring, (current) => {
    const formatted =
      decimals > 0
        ? current.toFixed(decimals)
        : Math.floor(current).toLocaleString();
    return `${prefix}${formatted}${suffix}`;
  });

  useEffect(() => {
    spring.set(value);
  }, [spring, value]);

  return (
    <motion.span className={cn("tabular-nums", className)}>
      {display}
    </motion.span>
  );
}

export default Counter;
