"use client";

import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface FadeContentProps {
  children: React.ReactNode;
  className?: string;
  show?: boolean;
  duration?: number;
  delay?: number;
}

export function FadeContent({
  children,
  className,
  show = true,
  duration = 0.3,
  delay = 0,
}: FadeContentProps) {
  return (
    <AnimatePresence mode="wait">
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{
            duration,
            delay,
            ease: "easeInOut",
          }}
          className={cn(className)}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
}


export default FadeContent;
