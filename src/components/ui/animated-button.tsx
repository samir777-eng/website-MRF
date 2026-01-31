"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Button, ButtonProps } from "@/components/ui/button";

export interface AnimatedButtonProps extends ButtonProps {
  animation?: "bounce" | "scale" | "rotate" | "magnetic" | "ripple" | "shine";
}

export const AnimatedButton = React.forwardRef<
  HTMLButtonElement,
  AnimatedButtonProps
>(({ className, animation = "scale", children, ...props }, ref) => {
  const [ripples, setRipples] = React.useState<
    Array<{ x: number; y: number; id: number }>
  >([]);
  const [position, setPosition] = React.useState({ x: 0, y: 0 });
  const buttonRef = React.useRef<HTMLButtonElement>(null);

  // Ripple effect
  const handleRippleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (animation === "ripple" && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const id = Date.now();

      setRipples([...ripples, { x, y, id }]);
      setTimeout(() => {
        setRipples((ripples) => ripples.filter((r) => r.id !== id));
      }, 600);
    }
  };

  // Magnetic effect
  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (animation === "magnetic" && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      const x = (e.clientX - rect.left - rect.width / 2) / 5;
      const y = (e.clientY - rect.top - rect.height / 2) / 5;
      setPosition({ x, y });
    }
  };

  const handleMouseLeave = () => {
    if (animation === "magnetic") {
      setPosition({ x: 0, y: 0 });
    }
  };

  // Animation variants
  const animations: Record<string, any> = {
    bounce: {
      whileHover: { scale: 1.05, y: -3 },
      whileTap: { scale: 0.95, y: 0 },
      transition: { type: "spring" as const, stiffness: 400, damping: 10 },
    },
    scale: {
      whileHover: { scale: 1.05 },
      whileTap: { scale: 0.95 },
      transition: { type: "spring" as const, stiffness: 400, damping: 17 },
    },
    rotate: {
      whileHover: { scale: 1.05, rotate: 2 },
      whileTap: { scale: 0.95, rotate: 0 },
      transition: { type: "spring" as const, stiffness: 300 },
    },
    magnetic: {
      animate: { x: position.x, y: position.y },
      transition: { type: "spring" as const, stiffness: 150, damping: 15 },
    },
    ripple: {
      whileTap: { scale: 0.98 },
    },
    shine: {
      whileHover: { scale: 1.02 },
      whileTap: { scale: 0.98 },
    },
  };

  const MotionButton = motion(Button);

  return (
    <MotionButton
      ref={(node) => {
        buttonRef.current = node;
        if (typeof ref === "function") {
          ref(node);
        } else if (ref) {
          ref.current = node;
        }
      }}
      className={cn(
        "relative overflow-hidden",
        animation === "shine" &&
          "before:absolute before:inset-0 before:bg-gradient-to-r before:from-transparent before:via-white/20 before:to-transparent before:translate-x-[-200%] hover:before:translate-x-[200%] before:transition-transform before:duration-700",
        className,
      )}
      onClick={(e) => {
        handleRippleClick(e);
        props.onClick?.(e);
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      {...animations[animation]}
      {...props}
    >
      {children}

      {/* Ripple effect */}
      {animation === "ripple" &&
        ripples.map((ripple) => (
          <motion.span
            key={ripple.id}
            className="absolute bg-white/30 rounded-full pointer-events-none"
            initial={{ width: 0, height: 0, opacity: 1 }}
            animate={{ width: 300, height: 300, opacity: 0 }}
            transition={{ duration: 0.6 }}
            style={{
              left: ripple.x - 150,
              top: ripple.y - 150,
            }}
          />
        ))}
    </MotionButton>
  );
});

AnimatedButton.displayName = "AnimatedButton";
