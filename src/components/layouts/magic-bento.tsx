"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface BentoItem {
  id: string;
  title: string;
  content: React.ReactNode;
  size: "small" | "medium" | "large";
}

interface MagicBentoProps {
  items: BentoItem[];
  className?: string;
}

const sizeClasses = {
  small: "col-span-1 row-span-1",
  medium: "col-span-2 row-span-1",
  large: "col-span-2 row-span-2",
};

export function MagicBento({ items, className }: MagicBentoProps) {
  return (
    <div
      className={cn(
        "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 auto-rows-[200px]",
        className,
      )}
    >
      {items.map((item, index) => (
        <motion.div
          key={item.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1, duration: 0.5 }}
          className={cn(
            "bg-card border rounded-lg p-6 overflow-hidden",
            "hover:shadow-lg transition-shadow",
            sizeClasses[item.size],
          )}
        >
          <h3 className="font-semibold mb-4">{item.title}</h3>
          <div className="h-full overflow-auto">{item.content}</div>
        </motion.div>
      ))}
    </div>
  );
}

export default MagicBento;
