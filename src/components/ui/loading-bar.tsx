"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

export function LoadingBar() {
  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => setIsLoading(false), 500);
    return () => clearTimeout(timer);
  }, [pathname]);

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          className="fixed top-0 inset-x-0 z-50 h-1 bg-primary"
          initial={{ scaleX: 0, transformOrigin: "right" }}
          animate={{ scaleX: 1, transformOrigin: "right" }}
          exit={{ scaleX: 0, transformOrigin: "left" }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
        />
      )}
    </AnimatePresence>
  );
}

