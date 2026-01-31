"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { cn } from "@/lib/utils";

interface SplitTextProps {
  text: string;
  className?: string;
  delay?: number;
  duration?: number;
  stagger?: number;
}

export function SplitText({
  text,
  className,
  delay = 0,
  duration = 0.5,
  stagger = 0.03,
}: SplitTextProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const chars = containerRef.current.querySelectorAll(".char");

    gsap.fromTo(
      chars,
      {
        opacity: 0,
        y: 20,
      },
      {
        opacity: 1,
        y: 0,
        duration,
        delay,
        stagger,
        ease: "power2.out",
      },
    );
  }, [text, delay, duration, stagger]);

  const characters = text.split("").map((char, index) => (
    <span
      key={index}
      className="char inline-block"
      style={{ whiteSpace: char === " " ? "pre" : "normal" }}
    >
      {char === " " ? "\u00A0" : char}
    </span>
  ));

  return (
    <div ref={containerRef} className={cn("inline-block", className)}>
      {characters}
    </div>
  );
}

export default SplitText;
