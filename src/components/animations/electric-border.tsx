"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface ElectricBorderProps {
  children: React.ReactNode;
  className?: string;
  color?: string;
}

export function ElectricBorder({
  children,
  className,
  color = "#9333ea",
}: ElectricBorderProps) {
  return (
    <div className={cn("relative p-[2px] rounded-lg overflow-hidden", className)}>
      <motion.div
        className="absolute inset-0"
        style={{
          background: `conic-gradient(from 0deg, transparent, ${color}, transparent)`,
        }}
        animate={{
          rotate: 360,
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "linear",
        }}
      />
      <div className="relative bg-background rounded-lg">{children}</div>
    </div>
  );
}


export default ElectricBorder;
