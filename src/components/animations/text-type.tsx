"use client";

import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

interface TextTypeProps {
  text: string;
  speed?: number;
  className?: string;
  onComplete?: () => void;
}

export function TextType({
  text,
  speed = 50,
  className,
  onComplete,
}: TextTypeProps) {
  const [displayedText, setDisplayedText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setDisplayedText((prev) => prev + text[currentIndex]);
        setCurrentIndex((prev) => prev + 1);
      }, speed);

      return () => clearTimeout(timeout);
    } else if (onComplete) {
      onComplete();
    }
  }, [currentIndex, text, speed, onComplete]);

  return (
    <span className={cn(className)}>
      {displayedText}
      {currentIndex < text.length && <span className="animate-pulse">|</span>}
    </span>
  );
}

export default TextType;
