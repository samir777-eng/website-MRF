"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface AnimatedListProps {
  children: React.ReactNode[];
  className?: string;
  delay?: number;
  stagger?: number;
  variant?: "fade" | "slide" | "scale";
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  fade: {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  },
  slide: {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  },
  scale: {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { opacity: 1, scale: 1 },
  },
};

export function AnimatedList({
  children,
  className,
  delay = 0,
  stagger = 0.1,
  variant = "slide",
}: AnimatedListProps) {
  return (
    <motion.div
      className={cn(className)}
      initial="hidden"
      animate="visible"
      variants={{
        ...containerVariants,
        visible: {
          ...containerVariants.visible,
          transition: {
            staggerChildren: stagger,
            delayChildren: delay,
          },
        },
      }}
    >
      {children.map((child, index) => (
        <motion.div
          key={index}
          variants={itemVariants[variant]}
          transition={{
            duration: 0.5,
            ease: [0.4, 0, 0.2, 1],
          }}
        >
          {child}
        </motion.div>
      ))}
    </motion.div>
  );
}


export default AnimatedList;
