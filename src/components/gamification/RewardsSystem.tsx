"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useGamification } from "@/contexts/GamificationContext";
import {
  Award,
  Coins,
  Crown,
  Gem,
  Gift,
  Heart,
  PartyPopper,
  ShoppingCart,
  Star,
  Wallet,
  Zap,
} from "lucide-react";
import { useEffect, useState } from "react";

interface VirtualCurrency {
  coins: number;
  gems: number;
  hearts: number;
  maxHearts: number;
  heartRegenTime: number; // minutes
  lastHeartRegen: Date;
}

interface RewardItem {
  id: string;
  name: string;
  description: string;
  icon: string;
  type: "cosmetic" | "functional" | "boost" | "special";
  cost: {
    coins?: number;
    gems?: number;
  };
  rarity: "common" | "rare" | "epic" | "legendary";
  owned: boolean;
  equipped?: boolean;
}

interface CelebrationEffect {
  id: string;
  type: "levelUp" | "achievement" | "perfectScore" | "streak" | "reward";
  title: string;
  message: string;
  icon: string;
  color: string;
  duration: number;
  show: boolean;
}

const MOCK_CURRENCY: VirtualCurrency = {
  coins: 5000,
  gems: 500,
  hearts: 5,
  maxHearts: 5,
  heartRegenTime: 30,
  lastHeartRegen: new Date(Date.now() - 15 * 60 * 1000), // 15 minutes ago
};

// Using IDs that match SHOP_ITEMS in types/gamification.ts
const REWARD_ITEMS: RewardItem[] = [
  {
    id: "avatar-crown",
    name: "تاج الملك",
    description: "تاج ذهبي يظهر على صورتك الشخصية",
    icon: "👑",
    type: "cosmetic",
    cost: { coins: 1000 },
    rarity: "epic",
    owned: false,
  },
  {
    id: "double-xp-1h",
    name: "مضاعف الخبرة",
    description: "يضاعف نقاط الخبرة لمدة ساعة",
    icon: "⚡",
    type: "boost",
    cost: { gems: 75 },
    rarity: "rare",
    owned: false,
  },
  {
    id: "energy-refill",
    name: "إعادة ملء القلوب",
    description: "يملأ جميع قلوب الطاقة فوراً",
    icon: "💖",
    type: "functional",
    cost: { gems: 30 },
    rarity: "common",
    owned: false,
  },
  {
    id: "streak-freeze",
    name: "تجميد السلسلة",
    description: "يحمي سلسلتك من الانقطاع ليوم واحد",
    icon: "🧊",
    type: "functional",
    cost: { gems: 50 },
    rarity: "rare",
    owned: false,
  },
  {
    id: "rainbow-theme",
    name: "ثيم قوس قزح",
    description: "ثيم ملون خاص للواجهة",
    icon: "🌈",
    type: "cosmetic",
    cost: { gems: 150 },
    rarity: "legendary",
    owned: false,
  },
  {
    id: "hint-pack-5",
    name: "لفافة الحكمة",
    description: "تكشف إجابة سؤال واحد في الاختبار",
    icon: "📜",
    type: "functional",
    cost: { gems: 40 },
    rarity: "rare",
    owned: false,
  },
];

interface RewardsSystemProps {
  variant?: "compact" | "detailed" | "shop";
  showCelebrations?: boolean;
}

export default function RewardsSystem({
  variant = "compact",
  showCelebrations = true,
}: RewardsSystemProps) {
  const {
    userStats: _userStats,
    addXP: _addXP,
    gems,
    purchaseItem: apiPurchaseItem,
    refreshGems,
  } = useGamification();
  const [currency, setCurrency] = useState<VirtualCurrency>({
    ...MOCK_CURRENCY,
    gems: 0, // Will be updated from context
  });
  const [rewardItems, setRewardItems] = useState<RewardItem[]>(REWARD_ITEMS);
  const [celebrations, setCelebrations] = useState<CelebrationEffect[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<
    "all" | "cosmetic" | "functional" | "boost"
  >("all");
  const [isPurchasing, setIsPurchasing] = useState(false);

  // Sync gems from context
  useEffect(() => {
    setCurrency((prev) => ({
      ...prev,
      gems: gems,
    }));
  }, [gems]);

  // Calculate heart regeneration
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrency((prev) => {
        if (prev.hearts >= prev.maxHearts) return prev;

        const now = new Date();
        const timeSinceLastRegen =
          now.getTime() - prev.lastHeartRegen.getTime();
        const heartsToAdd = Math.floor(
          timeSinceLastRegen / (prev.heartRegenTime * 60 * 1000),
        );

        if (heartsToAdd > 0) {
          return {
            ...prev,
            hearts: Math.min(prev.maxHearts, prev.hearts + heartsToAdd),
            lastHeartRegen: now,
          };
        }

        return prev;
      });
    }, 60000); // Check every minute

    return () => clearInterval(interval);
  }, []);

  // Show celebration effect
  const showCelebration = (effect: Omit<CelebrationEffect, "id" | "show">) => {
    const celebration: CelebrationEffect = {
      ...effect,
      id: Date.now().toString(),
      show: true,
    };

    setCelebrations((prev) => [...prev, celebration]);

    setTimeout(() => {
      setCelebrations((prev) => prev.filter((c) => c.id !== celebration.id));
    }, effect.duration);
  };

  // Purchase item
  const purchaseItem = async (itemId: string) => {
    if (isPurchasing) return;

    const item = rewardItems.find((i) => i.id === itemId);
    if (!item || item.owned) return;

    const canAfford =
      (!item.cost.coins || currency.coins >= item.cost.coins) &&
      (!item.cost.gems || currency.gems >= item.cost.gems);

    if (!canAfford) {
      showCelebration({
        type: "reward",
        title: "رصيد غير كافٍ",
        message: "ليس لديك عملة كافية لشراء هذا العنصر",
        icon: "❌",
        color: "text-red-600",
        duration: 3000,
      });
      return;
    }

    setIsPurchasing(true);

    try {
      // Call API to purchase (for gems-based items)
      if (item.cost.gems) {
        const result = await apiPurchaseItem(itemId, 1);
        if (!result.success) {
          showCelebration({
            type: "reward",
            title: "فشل الشراء",
            message: result.error || "حدث خطأ أثناء الشراء",
            icon: "❌",
            color: "text-red-600",
            duration: 3000,
          });
          setIsPurchasing(false);
          return;
        }
        // Refresh gems from server
        await refreshGems();
      } else {
        // For coin-based items (local only for now)
        setCurrency((prev) => ({
          ...prev,
          coins: prev.coins - (item.cost.coins || 0),
        }));
      }

      // Mark as owned
      setRewardItems((prev) =>
        prev.map((i) => (i.id === itemId ? { ...i, owned: true } : i)),
      );

      // Show celebration
      showCelebration({
        type: "reward",
        title: "مبروك!",
        message: `حصلت على ${item.name}`,
        icon: item.icon,
        color: "text-green-600",
        duration: 3000,
      });
    } catch (error) {
      console.error("Purchase error:", error);
      showCelebration({
        type: "reward",
        title: "خطأ",
        message: "حدث خطأ أثناء الشراء",
        icon: "❌",
        color: "text-red-600",
        duration: 3000,
      });
    } finally {
      setIsPurchasing(false);
    }
  };

  // Apply or equip item
  const applyItem = (itemId: string) => {
    const item = rewardItems.find((i) => i.id === itemId);
    if (!item || !item.owned) return;

    // For cosmetic items, toggle equipped state
    if (item.type === "cosmetic") {
      setRewardItems((prev) =>
        prev.map((i) => {
          if (i.id === itemId) {
            return { ...i, equipped: !i.equipped };
          }
          // Unequip other items of the same type (only one theme/avatar at a time)
          if (i.type === "cosmetic" && i.id !== itemId) {
            return { ...i, equipped: false };
          }
          return i;
        }),
      );

      const isNowEquipped = !item.equipped;
      showCelebration({
        type: "reward",
        title: isNowEquipped ? "تم التفعيل! ✨" : "تم إلغاء التفعيل",
        message: isNowEquipped
          ? `تم تفعيل ${item.name}`
          : `تم إلغاء تفعيل ${item.name}`,
        icon: item.icon,
        color: isNowEquipped ? "text-green-600" : "text-gray-600",
        duration: 2000,
      });
      return;
    }

    // For functional/boost items
    switch (itemId) {
      case "energy-refill":
        setCurrency((prev) => ({ ...prev, hearts: prev.maxHearts }));
        showCelebration({
          type: "reward",
          title: "تم إعادة الملء!",
          message: "تم ملء جميع قلوب الطاقة",
          icon: "💖",
          color: "text-red-600",
          duration: 2000,
        });
        break;
      case "double-xp-1h":
        showCelebration({
          type: "reward",
          title: "مضاعف الخبرة نشط!",
          message: "ستحصل على ضعف النقاط لمدة ساعة",
          icon: "⚡",
          color: "text-yellow-600",
          duration: 3000,
        });
        break;
      case "streak-freeze":
        showCelebration({
          type: "reward",
          title: "تم تجميد السلسلة!",
          message: "سلسلتك محمية لمدة 24 ساعة",
          icon: "🧊",
          color: "text-blue-600",
          duration: 2000,
        });
        break;
      case "hint-pack-5":
        showCelebration({
          type: "reward",
          title: "تم تفعيل التلميحات!",
          message: "يمكنك الآن استخدام التلميحات في الاختبارات",
          icon: "📜",
          color: "text-amber-600",
          duration: 2000,
        });
        break;
      default:
        showCelebration({
          type: "reward",
          title: "تم التفعيل!",
          message: `تم تفعيل ${item.name}`,
          icon: item.icon,
          color: "text-green-600",
          duration: 2000,
        });
    }
  };

  // Get time until next heart
  const getTimeToNextHeart = () => {
    if (currency.hearts >= currency.maxHearts) return "";

    const now = new Date();
    const timeSinceLastRegen =
      now.getTime() - currency.lastHeartRegen.getTime();
    const timeToNext =
      currency.heartRegenTime * 60 * 1000 -
      (timeSinceLastRegen % (currency.heartRegenTime * 60 * 1000));

    const minutes = Math.floor(timeToNext / (1000 * 60));
    const seconds = Math.floor((timeToNext % (1000 * 60)) / 1000);

    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  // Filter items by category
  const filteredItems = rewardItems.filter(
    (item) => selectedCategory === "all" || item.type === selectedCategory,
  );

  // Compact variant for navigation
  if (variant === "compact") {
    return (
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-foreground flex items-center gap-2">
            <Wallet className="w-5 h-5 text-yellow-600" />
            المحفظة
          </h3>
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2 p-2 bg-yellow-50 dark:bg-yellow-950/20 rounded-lg">
            <Coins className="w-5 h-5 text-yellow-600" />
            <span className="font-bold text-foreground">
              {currency.coins.toLocaleString()}
            </span>
            <span className="text-sm text-muted-foreground">عملة</span>
          </div>

          <div className="flex items-center gap-2 p-2 bg-purple-50 dark:bg-purple-950/20 rounded-lg">
            <Gem className="w-5 h-5 text-purple-600" />
            <span className="font-bold text-foreground">{currency.gems}</span>
            <span className="text-sm text-muted-foreground">جوهرة</span>
          </div>

          <div className="flex items-center gap-2 p-2 bg-red-50 dark:bg-red-950/20 rounded-lg">
            <div className="flex items-center gap-1">
              {Array.from({ length: currency.maxHearts }, (_, i) => (
                <Heart
                  key={i}
                  className={`w-4 h-4 ${
                    i < currency.hearts
                      ? "text-red-500 fill-current"
                      : "text-red-200"
                  }`}
                />
              ))}
            </div>
            {currency.hearts < currency.maxHearts && (
              <span className="text-sm text-muted-foreground">
                {getTimeToNextHeart()}
              </span>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Shop variant
  if (variant === "shop") {
    return (
      <div className="space-y-6">
        {/* Category Filter */}
        <div className="flex flex-wrap gap-2">
          {[
            { key: "all", label: "الكل", icon: ShoppingCart },
            { key: "cosmetic", label: "تجميلي", icon: Crown },
            { key: "functional", label: "وظيفي", icon: Zap },
            { key: "boost", label: "تعزيز", icon: Star },
          ].map(({ key, label, icon: Icon }) => (
            <Button
              key={key}
              onClick={() => setSelectedCategory(key as any)}
              className={`flex items-center gap-2 h-11 min-h-[44px] rounded-xl ${
                selectedCategory === key
                  ? "bg-cyan-500 hover:bg-cyan-400 text-white"
                  : "bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300 border border-zinc-300 dark:border-zinc-600"
              }`}
            >
              <Icon className="w-4 h-4" />
              {label}
            </Button>
          ))}
        </div>

        {/* Items Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className={`border-2 rounded-2xl transition-all duration-300 p-5 relative ${
                item.equipped
                  ? "border-amber-500 bg-gradient-to-br from-amber-900/30 to-orange-900/20 shadow-lg shadow-amber-500/20"
                  : item.owned
                    ? "border-green-500/50 bg-green-50 dark:bg-green-950/30"
                    : "border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-900 hover:border-zinc-400 dark:hover:border-zinc-600"
              }`}
            >
              {/* Equipped Badge */}
              {item.equipped && (
                <div className="absolute -top-2 -left-2 bg-amber-500 text-black text-xs font-bold px-2 py-1 rounded-full">
                  مُفعّل ✓
                </div>
              )}
              <div className="text-center pb-4">
                <div className="text-5xl mb-3">{item.icon}</div>
                <h3 className="text-lg font-bold text-foreground">
                  {item.name}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {item.description}
                </p>

                <div className="flex items-center justify-center gap-2 mt-2">
                  <Badge
                    className={
                      item.rarity === "legendary"
                        ? "bg-amber-500 text-black"
                        : item.rarity === "epic"
                          ? "bg-purple-500 text-white"
                          : item.rarity === "rare"
                            ? "bg-blue-500 text-white"
                            : "bg-gray-500 text-white"
                    }
                  >
                    {item.rarity === "legendary"
                      ? "أسطوري"
                      : item.rarity === "epic"
                        ? "ملحمي"
                        : item.rarity === "rare"
                          ? "نادر"
                          : "عادي"}
                  </Badge>

                  <Badge className="bg-zinc-200 dark:bg-zinc-700 text-zinc-700 dark:text-zinc-200">
                    {item.type === "cosmetic"
                      ? "تجميلي"
                      : item.type === "functional"
                        ? "وظيفي"
                        : item.type === "boost"
                          ? "تعزيز"
                          : "خاص"}
                  </Badge>
                </div>
              </div>

              <div className="space-y-4">
                {/* Cost */}
                <div className="flex items-center justify-center gap-4">
                  {item.cost.coins && (
                    <div className="flex items-center gap-1 text-amber-400">
                      <Coins className="w-4 h-4" />
                      <span className="font-bold">
                        {item.cost.coins.toLocaleString()}
                      </span>
                    </div>
                  )}
                  {item.cost.gems && (
                    <div className="flex items-center gap-1 text-purple-400">
                      <Gem className="w-4 h-4" />
                      <span className="font-bold">{item.cost.gems}</span>
                    </div>
                  )}
                </div>

                {/* Action Button */}
                {item.owned ? (
                  item.type === "cosmetic" ? (
                    <Button
                      onClick={() => applyItem(item.id)}
                      className={`w-full h-11 min-h-[44px] rounded-xl ${
                        item.equipped
                          ? "bg-amber-500 hover:bg-amber-400 text-black"
                          : "bg-purple-600 hover:bg-purple-500 text-white"
                      }`}
                    >
                      {item.equipped ? (
                        <>
                          <Star className="w-4 h-4 me-2 fill-current" />
                          مُفعّل ✓
                        </>
                      ) : (
                        <>
                          <Crown className="w-4 h-4 me-2" />
                          تفعيل
                        </>
                      )}
                    </Button>
                  ) : item.type === "functional" || item.type === "boost" ? (
                    <Button
                      onClick={() => applyItem(item.id)}
                      className="w-full h-11 min-h-[44px] bg-green-600 hover:bg-green-500 text-white rounded-xl"
                    >
                      <Zap className="w-4 h-4 me-2" />
                      استخدام
                    </Button>
                  ) : (
                    <div className="flex items-center justify-center text-green-400 h-11 min-h-[44px]">
                      <Award className="w-5 h-5 me-2" />
                      <span className="font-medium">مملوك</span>
                    </div>
                  )
                ) : (
                  <Button
                    onClick={() => purchaseItem(item.id)}
                    className="w-full h-11 min-h-[44px] bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl"
                  >
                    <ShoppingCart className="w-4 h-4 me-2" />
                    شراء
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Detailed variant for dashboard
  return (
    <Card className="border-0 shadow-xl bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-950/20 dark:to-orange-950/20">
      <CardHeader>
        <h2 className="text-2xl font-semibold leading-none tracking-tight flex items-center gap-2">
          <Gift className="w-6 h-6 text-yellow-600" />
          نظام المكافآت
        </h2>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Currency Overview */}
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center p-3 bg-yellow-100 dark:bg-yellow-950/30 rounded-xl">
            <Coins className="w-6 h-6 text-yellow-600 mx-auto mb-1" />
            <div className="text-xl font-bold text-yellow-800">
              {currency.coins.toLocaleString()}
            </div>
            <div className="text-sm text-yellow-700">عملة</div>
          </div>

          <div className="text-center p-3 bg-purple-100 dark:bg-purple-950/30 rounded-xl">
            <Gem className="w-6 h-6 text-purple-600 mx-auto mb-1" />
            <div className="text-xl font-bold text-purple-800">
              {currency.gems}
            </div>
            <div className="text-sm text-purple-700">جوهرة</div>
          </div>

          <div className="text-center p-3 bg-red-100 dark:bg-red-950/30 rounded-xl">
            <div className="flex justify-center gap-1 mb-1">
              {Array.from({ length: currency.maxHearts }, (_, i) => (
                <Heart
                  key={i}
                  className={`w-4 h-4 ${
                    i < currency.hearts
                      ? "text-red-500 fill-current"
                      : "text-red-200"
                  }`}
                />
              ))}
            </div>
            <div className="text-sm text-red-700">
              {currency.hearts < currency.maxHearts
                ? getTimeToNextHeart()
                : "ممتلئة"}
            </div>
          </div>
        </div>

        {/* Recent Rewards */}
        <div className="space-y-3">
          <h3 className="font-semibold text-foreground">العناصر المملوكة</h3>

          <div className="grid grid-cols-2 gap-3">
            {rewardItems
              .filter((item) => item.owned)
              .slice(0, 4)
              .map((item) => (
                <div
                  key={item.id}
                  className="flex items-center gap-2 p-3 bg-white/50 dark:bg-black/10 rounded-xl"
                >
                  <div className="text-2xl">{item.icon}</div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-foreground truncate">
                      {item.name}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {item.type === "cosmetic"
                        ? "تجميلي"
                        : item.type === "functional"
                          ? "وظيفي"
                          : "تعزيز"}
                    </div>
                  </div>
                  {item.type === "functional" && (
                    <Button
                      onClick={() => applyItem(item.id)}
                      variant="outline"
                      className="h-11 min-h-[44px]"
                    >
                      استخدام
                    </Button>
                  )}
                </div>
              ))}
          </div>
        </div>
      </CardContent>

      {/* Celebration Effects */}
      {showCelebrations &&
        celebrations.map((celebration) => {
          const dismissCelebration = () =>
            setCelebrations((prev) =>
              prev.filter((c) => c.id !== celebration.id),
            );
          return (
            <div
              key={celebration.id}
              className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 animate-in fade-in duration-500"
              role="dialog"
              aria-modal="true"
              aria-labelledby={`celebration-title-${celebration.id}`}
              onClick={dismissCelebration}
            >
              <div
                className="border-0 shadow-2xl bg-gradient-to-br from-yellow-400 to-orange-500 text-white max-w-md mx-4 rounded-lg"
                onClick={(e: React.MouseEvent) => e.stopPropagation()}
              >
                <CardContent className="p-8 text-center relative">
                  <button
                    onClick={dismissCelebration}
                    className="absolute top-2 left-2 p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
                    aria-label="إغلاق"
                  >
                    <span className="text-white text-lg">✕</span>
                  </button>
                  <div
                    className="text-6xl mb-4 animate-bounce"
                    aria-hidden="true"
                  >
                    {celebration.icon}
                  </div>
                  <h2
                    id={`celebration-title-${celebration.id}`}
                    className="text-3xl font-bold mb-2"
                  >
                    {celebration.title}
                  </h2>
                  <p className="text-xl">{celebration.message}</p>
                  <div className="mt-4">
                    <PartyPopper
                      className="w-8 h-8 mx-auto animate-pulse"
                      aria-hidden="true"
                    />
                  </div>
                </CardContent>
              </div>
            </div>
          );
        })}
    </Card>
  );
}
