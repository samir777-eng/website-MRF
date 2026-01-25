"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface Spark {
  id: number;
  x: number;
  y: number;
}

interface ClickSparkProps {
  children: React.ReactNode;
  className?: string;
  color?: string;
  count?: number;
}

export function ClickSpark({
  children,
  className,
  color = "rgb(59, 130, 246)",
  count = 8,
}: ClickSparkProps) {
  const [sparks, setSparks] = useState<Spark[]>([]);

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const newSparks = Array.from({ length: count }, (_, i) => ({
      id: Date.now() + i,
      x,
      y,
    }));

    setSparks((prev) => [...prev, ...newSparks]);

    setTimeout(() => {
      setSparks((prev) => prev.filter((spark) => !newSparks.includes(spark)));
    }, 1000);
  };

  return (
    <div className={cn("relative", className)} onClick={handleClick}>
      {children}
      <AnimatePresence>
        {sparks.map((spark, index) => {
          const angle = (360 / count) * index;
          const distance = 40;
          const x = Math.cos((angle * Math.PI) / 180) * distance;
          const y = Math.sin((angle * Math.PI) / 180) * distance;

          return (
            <motion.div
              key={spark.id}
              className="pointer-events-none absolute rounded-full"
              style={{
                left: spark.x,
                top: spark.y,
                width: 4,
                height: 4,
                backgroundColor: color,
              }}
              initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
              animate={{
                x,
                y,
                opacity: 0,
                scale: 0,
              }}
              exit={{ opacity: 0 }}
              transition={{
                duration: 0.6,
                ease: "easeOut",
              }}
            />
          );
        })}
      </AnimatePresence>
    </div>
  );
}


export default ClickSpark;
