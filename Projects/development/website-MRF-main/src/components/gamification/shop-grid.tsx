"use client";

import { SHOP_ITEMS, ShopItem } from "@/types/gamification";
import { motion } from "framer-motion";
import { BookOpen, Filter, Gift, Palette, Store, Zap } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { GemsDisplay, GemsEarnedAnimation } from "./gems-display";
import { ShopItemCard } from "./shop-item-card";

const categoryIcons: Record<string, React.ComponentType<{ size: number }>> = {
  all: Store,
  "power-ups": Zap,
  cosmetics: Palette,
  content: BookOpen,
  bundles: Gift,
};

const categoryLabels: Record<string, string> = {
  all: "الكل",
  "power-ups": "التعزيزات",
  cosmetics: "المظاهر",
  content: "المحتوى",
  bundles: "الحزم",
};

type ShopItemCategory = "power-ups" | "cosmetics" | "content" | "bundles";
type CategoryFilter = ShopItemCategory | "all";

export function ShopGrid() {
  const [items, setItems] = useState<ShopItem[]>(SHOP_ITEMS);
  const [userGems, setUserGems] = useState(0);
  const [purchasedIds, setPurchasedIds] = useState<Set<string>>(new Set());
  const [activeCategory, setActiveCategory] = useState<CategoryFilter>("all");
  const [earnedGems, setEarnedGems] = useState<number | null>(null);

  useEffect(() => {
    fetchUserData();
    fetchShopItems();
  }, []);

  async function fetchUserData() {
    try {
      const res = await fetch("/api/gamification/gems");
      const data = await res.json();
      if (data.success) {
        setUserGems(data.balance);
        setPurchasedIds(
          new Set(
            data.purchases?.map((p: { itemId: string }) => p.itemId) || []
          )
        );
      }
    } catch (error) {
      console.error("Failed to fetch user data:", error);
    }
  }

  async function fetchShopItems() {
    try {
      const res = await fetch("/api/gamification/shop");
      const data = await res.json();
      if (data.success && data.items) {
        setItems(data.items);
      }
    } catch (error) {
      console.error("Failed to fetch shop items:", error);
    }
  }

  const handlePurchase = useCallback(
    async (itemId: string): Promise<boolean> => {
      try {
        const res = await fetch(`/api/gamification/gems?operation=spend`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ itemId }),
        });
        const data = await res.json();
        if (data.success) {
          setUserGems(data.newBalance);
          setPurchasedIds((prev) => new Set([...prev, itemId]));
          return true;
        }
        return false;
      } catch (error) {
        console.error("Purchase failed:", error);
        return false;
      }
    },
    []
  );

  const filteredItems =
    activeCategory === "all"
      ? items
      : items.filter((item) => item.category === activeCategory);

  const categories: CategoryFilter[] = [
    "all",
    "power-ups",
    "cosmetics",
    "content",
    "bundles",
  ];

  return (
    <div className="space-y-6">
      {/* Header with gems display */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Store className="text-purple-400" size={28} />
          <h2 className="text-2xl font-bold text-white">المتجر</h2>
        </div>
        <GemsDisplay size="lg" showAddButton={false} />
      </div>

      {/* Category filters */}
      <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
        {categories.map((cat) => {
          const Icon = categoryIcons[cat];
          return (
            <motion.button
              key={cat}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveCategory(cat)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full font-medium transition-all ${
                activeCategory === cat
                  ? "bg-purple-500 text-white shadow-lg shadow-purple-500/25"
                  : "bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700"
              }`}
            >
              <Icon size={18} />
              <span>{categoryLabels[cat]}</span>
            </motion.button>
          );
        })}
      </div>

      {/* Items grid */}
      <motion.div
        layout
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
      >
        {filteredItems.map((item, index) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <ShopItemCard
              item={item}
              userGems={userGems}
              isPurchased={purchasedIds.has(item.id)}
              onPurchase={handlePurchase}
            />
          </motion.div>
        ))}
      </motion.div>

      {filteredItems.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          <Filter className="mx-auto mb-3 opacity-50" size={48} />
          <p>لا توجد عناصر في هذه الفئة</p>
        </div>
      )}

      {/* Gems earned animation */}
      {earnedGems !== null && (
        <GemsEarnedAnimation
          amount={earnedGems}
          onComplete={() => setEarnedGems(null)}
        />
      )}
    </div>
  );
}
