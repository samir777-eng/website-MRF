"use client";

import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import { useId, useState } from "react";

interface BubbleMenuItem {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
}

interface BubbleMenuProps {
  items: BubbleMenuItem[];
  trigger: React.ReactNode;
  /** Accessible label for the menu */
  menuLabel?: string;
  className?: string;
}

export function BubbleMenu({
  items,
  trigger,
  menuLabel = "خيارات",
  className,
}: BubbleMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const menuId = useId();

  return (
    <div className={cn("relative", className)}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-haspopup="menu"
        aria-controls={menuId}
        className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-lg"
      >
        {trigger}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.2 }}
            className="absolute bottom-full mb-2 inset-x-0 flex justify-center"
          >
            <div
              id={menuId}
              className="flex gap-2 bg-background border border-border rounded-full p-2 shadow-lg"
              role="menu"
              aria-label={menuLabel}
            >
              {items.map((item, index) => (
                <motion.button
                  key={item.label}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() => {
                    item.onClick();
                    setIsOpen(false);
                  }}
                  className="w-11 h-11 rounded-full flex items-center justify-center hover:bg-muted transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  aria-label={item.label}
                  role="menuitem"
                >
                  <span aria-hidden="true">{item.icon}</span>
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
