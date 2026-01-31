/**
 * Gamification API Client
 *
 * Client-side service for communicating with the server-side gamification API.
 * All gamification state should flow through this client.
 */

import { ENERGY_CONFIG, XP_ACTIONS } from "@/lib/gamification";

const API_BASE = "/api/gamification";

export interface AwardXPResult {
  success: boolean;
  xpAwarded: number;
  totalXP: number;
  level: number;
  levelUp: boolean;
  previousLevel?: number;
  newAchievements?: string[];
  error?: string;
}

export interface StatsResult {
  success: boolean;
  stats?: {
    totalXP: number;
    level: number;
    currentStreak: number;
    longestStreak: number;
    currentEnergy: number;
    lessonsCompleted: number;
    quizzesTaken: number;
    perfectScores: number;
    unlockedAchievements: string[];
    daysActive: number;
    totalStudyTime: number;
  };
  levelInfo?: {
    currentLevel: number;
    nextLevel: number;
    progress: number;
    remainingXP: number;
  };
  error?: string;
}

export interface StreakResult {
  success: boolean;
  currentStreak: number;
  longestStreak: number;
  xpAwarded: number;
  isNewDay: boolean;
  streakMaintained: boolean;
  error?: string;
}

export interface EnergyResult {
  success: boolean;
  energyConsumed?: number;
  currentEnergy: number;
  timeToNextEnergy: number;
  error?: string;
}

/**
 * Award XP for an action (server-validated)
 */
export async function awardXP(
  action: keyof typeof XP_ACTIONS,
  context?: {
    lessonId?: string;
    quizId?: string;
    score?: number;
  },
): Promise<AwardXPResult> {
  try {
    const response = await fetch(`${API_BASE}/award-xp`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Requested-With": "XMLHttpRequest",
      },
      credentials: "include",
      body: JSON.stringify({
        action,
        context,
        nonce: crypto.randomUUID(),
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        xpAwarded: 0,
        totalXP: 0,
        level: 1,
        levelUp: false,
        error: data.error || "فشل في منح XP",
      };
    }

    return data;
  } catch (error) {
    console.error("Failed to award XP:", error);
    return {
      success: false,
      xpAwarded: 0,
      totalXP: 0,
      level: 1,
      levelUp: false,
      error: "خطأ في الاتصال بالخادم",
    };
  }
}

/**
 * Get current user stats from server
 */
export async function getStats(): Promise<StatsResult> {
  try {
    const response = await fetch(`${API_BASE}/stats`, {
      method: "GET",
      headers: {
        "X-Requested-With": "XMLHttpRequest",
      },
      credentials: "include",
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: data.error || "فشل في جلب الإحصائيات",
      };
    }

    return data;
  } catch (error) {
    console.error("Failed to get stats:", error);
    return {
      success: false,
      error: "خطأ في الاتصال بالخادم",
    };
  }
}

/**
 * Update streak on daily login
 */
export async function updateStreak(): Promise<StreakResult> {
  try {
    const response = await fetch(`${API_BASE}/streak`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Requested-With": "XMLHttpRequest",
      },
      credentials: "include",
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        currentStreak: 0,
        longestStreak: 0,
        xpAwarded: 0,
        isNewDay: false,
        streakMaintained: false,
        error: data.error || "فشل في تحديث السلسلة",
      };
    }

    return data;
  } catch (error) {
    console.error("Failed to update streak:", error);
    return {
      success: false,
      currentStreak: 0,
      longestStreak: 0,
      xpAwarded: 0,
      isNewDay: false,
      streakMaintained: false,
      error: "خطأ في الاتصال بالخادم",
    };
  }
}

/**
 * Consume energy for an action
 */
export async function consumeEnergy(
  action: keyof typeof ENERGY_CONFIG.ENERGY_COST,
): Promise<EnergyResult> {
  try {
    const response = await fetch(`${API_BASE}/energy`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Requested-With": "XMLHttpRequest",
      },
      credentials: "include",
      body: JSON.stringify({ action }),
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        currentEnergy: data.currentEnergy || 0,
        timeToNextEnergy: data.timeToNextEnergy || 0,
        error: data.error || "فشل في استهلاك الطاقة",
      };
    }

    return data;
  } catch (error) {
    console.error("Failed to consume energy:", error);
    return {
      success: false,
      currentEnergy: 0,
      timeToNextEnergy: 0,
      error: "خطأ في الاتصال بالخادم",
    };
  }
}

// ============================================
// GEMS & SHOP API
// ============================================

export interface GemsResult {
  success: boolean;
  balance?: number;
  totalEarned?: number;
  totalSpent?: number;
  recentPurchases?: { itemId: string; quantity: number; purchasedAt: Date }[];
  error?: string;
}

export interface PurchaseResult {
  success: boolean;
  itemPurchased?: {
    id: string;
    name: string;
    nameAr: string;
    quantity: number;
  };
  gemsSpent?: number;
  newBalance?: number;
  error?: string;
  required?: number;
  available?: number;
}

export interface ShopItemsResult {
  success: boolean;
  items?: import("@/types/gamification").ShopItem[];
  grouped?: {
    "power-ups": import("@/types/gamification").ShopItem[];
    cosmetics: import("@/types/gamification").ShopItem[];
    content: import("@/types/gamification").ShopItem[];
    bundles: import("@/types/gamification").ShopItem[];
  };
  totalItems?: number;
  error?: string;
}

/**
 * Get user's gem balance and transaction history
 */
export async function getGems(): Promise<GemsResult> {
  try {
    const response = await fetch(`${API_BASE}/gems`, {
      method: "GET",
      headers: {
        "X-Requested-With": "XMLHttpRequest",
      },
      credentials: "include",
      cache: "no-store",
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: data.error || "فشل في جلب رصيد الجواهر",
      };
    }

    return data;
  } catch (error) {
    console.error("Failed to get gems:", error);
    return {
      success: false,
      error: "خطأ في الاتصال بالخادم",
    };
  }
}

/**
 * Purchase an item from the shop using gems
 */
export async function purchaseItem(
  itemId: string,
  quantity: number = 1,
): Promise<PurchaseResult> {
  try {
    const response = await fetch(`${API_BASE}/gems?operation=spend`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Requested-With": "XMLHttpRequest",
      },
      credentials: "include",
      body: JSON.stringify({
        itemId,
        quantity,
        nonce: crypto.randomUUID(),
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: data.error || "فشل في عملية الشراء",
        required: data.required,
        available: data.available,
      };
    }

    return data;
  } catch (error) {
    console.error("Failed to purchase item:", error);
    return {
      success: false,
      error: "خطأ في الاتصال بالخادم",
    };
  }
}

/**
 * Get shop items, optionally filtered by category
 */
export async function getShopItems(
  category?: "power-ups" | "cosmetics" | "content" | "bundles",
): Promise<ShopItemsResult> {
  try {
    const url = category
      ? `${API_BASE}/shop?category=${category}`
      : `${API_BASE}/shop`;

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "X-Requested-With": "XMLHttpRequest",
      },
      credentials: "include",
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: data.error || "فشل في جلب المنتجات",
      };
    }

    return data;
  } catch (error) {
    console.error("Failed to get shop items:", error);
    return {
      success: false,
      error: "خطأ في الاتصال بالخادم",
    };
  }
}
