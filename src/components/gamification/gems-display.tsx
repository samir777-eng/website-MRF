"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Gem, Plus, Sparkles } from "lucide-react";
import Link from "next/link";

interface GemsDisplayProps {
  showAddButton?: boolean;
  size?: "sm" | "md" | "lg";
  animated?: boolean;
}

export function GemsDisplay({ showAddButton = true, size = "md", animated = true }: GemsDisplayProps) {
  const [gems, setGems] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [showPulse, setShowPulse] = useState(false);

  useEffect(() => {
    fetchGems();
  }, []);

  async function fetchGems() {
    try {
      const res = await fetch("/api/gamification/gems");
      const data = await res.json();
      if (data.success) {
        setGems(data.balance);
      }
    } catch (error) {
      console.error("Failed to fetch gems:", error);
    } finally {
      setIsLoading(false);
    }
  }

  const sizeClasses = {
    sm: "text-sm gap-1 px-2 py-1",
    md: "text-base gap-2 px-3 py-1.5",
    lg: "text-lg gap-2 px-4 py-2",
  };

  const iconSizes = { sm: 14, md: 18, lg: 24 };

  return (
    <div className={`flex items-center ${sizeClasses[size]} bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-full border border-purple-500/20`}>
      <motion.div
        animate={animated && showPulse ? { scale: [1, 1.2, 1] } : {}}
        transition={{ duration: 0.3 }}
      >
        <Gem className="text-purple-400" size={iconSizes[size]} />
      </motion.div>
      
      <AnimatePresence mode="wait">
        <motion.span
          key={gems}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          className="font-bold text-purple-300"
        >
          {isLoading ? "..." : gems.toLocaleString("ar-EG")}
        </motion.span>
      </AnimatePresence>

      {showAddButton && (
        <Link href="/ar/store?tab=rewards" className="ml-1 p-1 hover:bg-purple-500/20 rounded-full transition-colors" aria-label="اذهب للمتجر">
          <Plus size={iconSizes[size] - 4} className="text-purple-400" />
        </Link>
      )}
    </div>
  );
}

// Gems earned animation overlay
export function GemsEarnedAnimation({ amount, onComplete }: { amount: number; onComplete: () => void }) {
  useEffect(() => {
    const timer = setTimeout(onComplete, 2000);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.5, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.5, y: -20 }}
      className="fixed top-20 right-4 z-50 flex items-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 px-4 py-3 rounded-xl shadow-2xl"
    >
      <Sparkles className="text-yellow-300" size={24} />
      <span className="text-white font-bold text-lg">+{amount}</span>
      <Gem className="text-purple-200" size={20} />
      <span className="text-purple-100">جواهر!</span>
    </motion.div>
  );
}

