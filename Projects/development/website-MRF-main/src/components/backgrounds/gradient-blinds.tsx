"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface GradientBlindsProps {
  className?: string;
  colors?: string[];
}

export function GradientBlinds({
  className,
  colors = ["#1e40af", "#9333ea", "#ec4899"],
}: GradientBlindsProps) {
  const blinds = Array.from({ length: 5 }, (_, i) => i);

  return (
    <div className={cn("absolute inset-0 overflow-hidden", className)}>
      {blinds.map((index) => (
        <motion.div
          key={index}
          className="absolute inset-0"
          style={{
            background: `linear-gradient(135deg, ${colors[index % colors.length]}, transparent)`,
            opacity: 0.1,
          }}
          animate={{
            x: ["-100%", "100%"],
          }}
          transition={{
            duration: 20 + index * 5,
            repeat: Infinity,
            ease: "linear",
            delay: index * 2,
          }}
        />
      ))}
    </div>
  );
}


export default GradientBlinds;
