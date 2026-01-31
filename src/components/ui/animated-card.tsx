"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";

export interface AnimatedCardProps extends React.HTMLAttributes<HTMLDivElement> {
  animation?: "lift" | "tilt" | "glow" | "float" | "fade-in";
  delay?: number;
}

export const AnimatedCard = React.forwardRef<HTMLDivElement, AnimatedCardProps>(
  ({ className, animation = "lift", delay = 0, children, ...props }, ref) => {
    const [tilt, setTilt] = React.useState({ x: 0, y: 0 });
    const cardRef = React.useRef<HTMLDivElement>(null);

    // Tilt effect
    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
      if (animation === "tilt" && cardRef.current) {
        const rect = cardRef.current.getBoundingClientRect();
        const x = (e.clientY - rect.top - rect.height / 2) / 20;
        const y = (e.clientX - rect.left - rect.width / 2) / 20;
        setTilt({ x, y });
      }
    };

    const handleMouseLeave = () => {
      if (animation === "tilt") {
        setTilt({ x: 0, y: 0 });
      }
    };

    // Animation variants
    const animations: Record<string, any> = {
      lift: {
        whileHover: { y: -8, scale: 1.02 },
        transition: { type: "spring" as const, stiffness: 300, damping: 20 },
      },
      tilt: {
        animate: { rotateX: tilt.x, rotateY: tilt.y },
        transition: { type: "spring" as const, stiffness: 300, damping: 20 },
      },
      glow: {
        whileHover: {
          boxShadow:
            "0 0 20px rgba(59, 130, 246, 0.5), 0 0 40px rgba(59, 130, 246, 0.3)",
          scale: 1.02,
        },
        transition: { duration: 0.3 },
      },
      float: {
        animate: { y: [-5, 5, -5] },
        transition: {
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut" as const,
          delay,
        },
      },
      "fade-in": {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.5, delay },
      },
    };

    const MotionCard = motion(Card);

    return (
      <MotionCard
        ref={(node) => {
          cardRef.current = node;
          if (typeof ref === "function") {
            ref(node);
          } else if (ref) {
            ref.current = node;
          }
        }}
        className={cn(
          "transition-shadow duration-300",
          animation === "tilt" && "transform-gpu perspective-1000",
          className,
        )}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        {...animations[animation]}
        {...props}
      >
        {children}
      </MotionCard>
    );
  },
);

AnimatedCard.displayName = "AnimatedCard";
