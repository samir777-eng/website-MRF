"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

interface CountUpProps {
  end: number;
  start?: number;
  duration?: number;
  delay?: number;
  className?: string;
  suffix?: string;
  prefix?: string;
  decimals?: number;
}

export function CountUp({
  end,
  start = 0,
  duration = 2000,
  delay = 0,
  className,
  suffix = "",
  prefix = "",
  decimals = 0,
}: CountUpProps) {
  const [count, setCount] = useState(start);
  const countRef = useRef(start);
  const rafRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    const startTime = Date.now() + delay;
    const endTime = startTime + duration;

    const animate = () => {
      const now = Date.now();

      if (now < startTime) {
        rafRef.current = requestAnimationFrame(animate);
        return;
      }

      if (now >= endTime) {
        setCount(end);
        return;
      }

      const progress = (now - startTime) / duration;
      const easeOutQuad = 1 - (1 - progress) * (1 - progress);
      const current = start + (end - start) * easeOutQuad;

      countRef.current = current;
      setCount(current);

      rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);

    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [end, start, duration, delay]);

  const displayValue =
    decimals > 0
      ? count.toFixed(decimals)
      : Math.floor(count).toLocaleString("ar-EG");

  return (
    <span className={cn("tabular-nums", className)}>
      {prefix}
      {displayValue}
      {suffix}
    </span>
  );
}

export default CountUp;
