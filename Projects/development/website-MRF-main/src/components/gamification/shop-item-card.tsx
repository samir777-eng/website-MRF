"use client";

import { ShopItem } from "@/types/gamification";
import { motion } from "framer-motion";
import { Check, Gem, Lock, ShoppingCart, Sparkles } from "lucide-react";
import { useState, memo } from "react";

interface ShopItemCardProps {
  item: ShopItem;
  userGems: number;
  isPurchased?: boolean;
  onPurchase: (itemId: string) => Promise<boolean>;
}

export const ShopItemCard = memo(function ShopItemCard({
  item,
  userGems,
  isPurchased = false,
  onPurchase,
}: ShopItemCardProps) {
  const [isPurchasing, setIsPurchasing] = useState(false);
  const [justPurchased, setJustPurchased] = useState(false);

  const canAfford = userGems >= item.price;
  const isDisabled = isPurchased || !canAfford || isPurchasing;

  const categoryColors: Record<string, string> = {
    "power-ups": "from-blue-500 to-cyan-500",
    cosmetics: "from-purple-500 to-pink-500",
    content: "from-green-500 to-emerald-500",
    bundles: "from-amber-500 to-orange-500",
  };

  const categoryLabels: Record<string, string> = {
    "power-ups": "تعزيز",
    cosmetics: "مظهر",
    content: "محتوى",
    bundles: "حزمة",
  };

  async function handlePurchase() {
    if (isDisabled) return;
    setIsPurchasing(true);
    const success = await onPurchase(item.id);
    setIsPurchasing(false);
    if (success) {
      setJustPurchased(true);
    }
  }

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={`relative overflow-hidden rounded-2xl border-2 transition-all ${
        isPurchased
          ? "border-green-500/50 bg-green-50 dark:bg-green-950/20"
          : canAfford
            ? "border-purple-500/30 bg-purple-50 dark:bg-zinc-900/50"
            : "border-zinc-300 dark:border-zinc-700 bg-zinc-100 dark:bg-zinc-900/30 opacity-75"
      }`}
    >
      {/* Category badge */}
      <div
        className={`absolute top-2 end-2 px-2 py-1 rounded-full text-sm font-bold bg-gradient-to-r ${categoryColors[item.category]} text-white`}
      >
        {categoryLabels[item.category]}
      </div>

      {/* Discount badge */}
      {item.discount && (
        <div className="absolute top-2 start-2 px-2 py-1 rounded-full text-sm font-bold bg-red-500 text-white flex items-center gap-1">
          <Sparkles size={12} /> -{item.discount}%
        </div>
      )}

      <div className="p-4 pt-10">
        {/* Icon */}
        <div className="text-4xl mb-3 text-center">{item.icon}</div>

        {/* Name */}
        <h3 className="font-bold text-foreground text-center mb-1">
          {item.nameAr}
        </h3>

        {/* Description */}
        <p className="text-muted-foreground text-sm text-center mb-4 line-clamp-2">
          {item.descriptionAr}
        </p>

        {/* Price and Buy Button */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            <Gem className="text-purple-500 dark:text-purple-400" size={18} />
            <span
              className={`font-bold ${canAfford ? "text-purple-600 dark:text-purple-300" : "text-zinc-500"}`}
            >
              {item.price}
            </span>
            {item.originalPrice && (
              <span className="text-zinc-500 line-through text-sm me-1">
                {item.originalPrice}
              </span>
            )}
          </div>

          <motion.button
            whileHover={!isDisabled ? { scale: 1.05 } : {}}
            whileTap={!isDisabled ? { scale: 0.95 } : {}}
            onClick={handlePurchase}
            disabled={isDisabled}
            className={`flex items-center gap-2 px-4 py-2 rounded-full font-bold transition-all ${
              isPurchased || justPurchased
                ? "bg-green-500 text-white"
                : !canAfford
                  ? "bg-zinc-200 dark:bg-zinc-700 text-zinc-500 dark:text-zinc-400 cursor-not-allowed"
                  : "bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:shadow-lg hover:shadow-purple-500/25"
            }`}
            aria-label={isPurchased ? "تم الشراء" : `شراء ${item.nameAr}`}
          >
            {isPurchasing ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : isPurchased || justPurchased ? (
              <>
                <Check size={18} />
                <span>مُشترى</span>
              </>
            ) : !canAfford ? (
              <>
                <Lock size={18} />
                <span>غير كافي</span>
              </>
            ) : (
              <>
                <ShoppingCart size={18} />
                <span>اشترِ</span>
              </>
            )}
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
});
