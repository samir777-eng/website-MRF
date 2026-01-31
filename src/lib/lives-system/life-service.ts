/**
 * Life Service
 * Handles life usage and purchase logic
 */

import type {
  AccessState,
  LectureAccess,
  LectureSettings,
  LifePurchase,
  LifeUsageRecord,
  PurchaseLifeRequest,
  PurchaseLifeResponse,
  UseLifeRequest,
  UseLifeResponse,
} from "@/types/lives-system";
import { DEFAULT_SETTINGS } from "@/types/lives-system";
import { calculateAccessState } from "./calculate-access";

// ============================================================================
// IN-MEMORY STORAGE (Replace with database in production)
// ============================================================================

// Mock storage for life purchases
const lifePurchaseStore: Map<string, LifePurchase> = new Map();

// Mock user balances (coins)
const userCoinsBalance: Map<string, number> = new Map();

// Reference to lecture access store (shared with lecture-service)
let lectureAccessStore: Map<string, LectureAccess>;
let lectureSettingsGetter: (lectureId: string) => LectureSettings | null;

/**
 * Initialize life service with shared stores
 */
export function initializeLifeService(
  accessStore: Map<string, LectureAccess>,
  settingsGetter: (lectureId: string) => LectureSettings | null,
) {
  lectureAccessStore = accessStore;
  lectureSettingsGetter = settingsGetter;
}

// ============================================================================
// LIFE USAGE FUNCTIONS
// ============================================================================

/**
 * Use a life to extend lecture access
 */
export function useLife(
  request: UseLifeRequest,
  userId: string,
): UseLifeResponse {
  const { lectureAccessId } = request;

  // Find the access record
  let access: LectureAccess | undefined;
  let accessKey: string | undefined;

  for (const [key, value] of lectureAccessStore.entries()) {
    if (value.id === lectureAccessId && value.userId === userId) {
      access = value;
      accessKey = key;
      break;
    }
  }

  if (!access || !accessKey) {
    return {
      success: false,
      lectureAccess: null as unknown as LectureAccess,
      accessState: null as unknown as AccessState,
      message: "سجل الوصول غير موجود",
    };
  }

  const settings = lectureSettingsGetter(access.lectureId);
  if (!settings) {
    return {
      success: false,
      lectureAccess: access,
      accessState: null as unknown as AccessState,
      message: "إعدادات المحاضرة غير موجودة",
    };
  }

  // Check if has lives remaining
  if (access.livesRemaining <= 0) {
    return {
      success: false,
      lectureAccess: access,
      accessState: calculateAccessState({
        lectureAccess: access,
        lectureSettings: settings,
      }),
      message: "لا توجد حيوات متبقية",
    };
  }

  // Check if lives have expired
  if (access.activationDate) {
    const activationDate = new Date(access.activationDate);
    const livesExpireAt = new Date(
      activationDate.getTime() + settings.livesExpiryDays * 24 * 60 * 60 * 1000,
    );
    if (new Date() > livesExpireAt) {
      return {
        success: false,
        lectureAccess: access,
        accessState: calculateAccessState({
          lectureAccess: access,
          lectureSettings: settings,
        }),
        message: "انتهت صلاحية الحيوات",
      };
    }
  }

  // Use the life
  const lifeNumber = access.livesUsedHistory.length + 1;
  const usageRecord: LifeUsageRecord = {
    usedAt: new Date(),
    source: "initial", // Using an existing life
    lifeNumber,
  };

  const updatedAccess: LectureAccess = {
    ...access,
    livesRemaining: access.livesRemaining - 1,
    livesUsedHistory: [...access.livesUsedHistory, usageRecord],
    currentStatus: "active",
  };

  lectureAccessStore.set(accessKey, updatedAccess);

  const accessState = calculateAccessState({
    lectureAccess: updatedAccess,
    lectureSettings: settings,
  });

  return {
    success: true,
    lectureAccess: updatedAccess,
    accessState,
    message: `تم استخدام حياة! لديك ${settings.lifeExtensionDays} أيام إضافية`,
  };
}

// ============================================================================
// LIFE PURCHASE FUNCTIONS
// ============================================================================

/**
 * Purchase a life with coins or money
 */
export function purchaseLife(
  request: PurchaseLifeRequest,
  userId: string,
): PurchaseLifeResponse {
  const { lectureAccessId, paymentType } = request;

  // Find the access record
  let access: LectureAccess | undefined;
  let accessKey: string | undefined;

  for (const [key, value] of lectureAccessStore.entries()) {
    if (value.id === lectureAccessId && value.userId === userId) {
      access = value;
      accessKey = key;
      break;
    }
  }

  if (!access || !accessKey) {
    return {
      success: false,
      lifePurchase: null as unknown as LifePurchase,
      lectureAccess: null as unknown as LectureAccess,
      accessState: null as unknown as AccessState,
      newBalance: 0,
      message: "سجل الوصول غير موجود",
    };
  }

  const settings = lectureSettingsGetter(access.lectureId);
  if (!settings) {
    return {
      success: false,
      lifePurchase: null as unknown as LifePurchase,
      lectureAccess: access,
      accessState: null as unknown as AccessState,
      newBalance: 0,
      message: "إعدادات المحاضرة غير موجودة",
    };
  }

  // Get price
  const price =
    paymentType === "coins"
      ? DEFAULT_SETTINGS.life_price_coins
      : DEFAULT_SETTINGS.life_price_money;

  // Check user balance (for coins)
  if (paymentType === "coins") {
    const currentBalance = userCoinsBalance.get(userId) ?? 0;
    if (currentBalance < price) {
      return {
        success: false,
        lifePurchase: null as unknown as LifePurchase,
        lectureAccess: access,
        accessState: calculateAccessState({
          lectureAccess: access,
          lectureSettings: settings,
        }),
        newBalance: currentBalance,
        message: `رصيد العملات غير كافٍ. لديك ${currentBalance} وتحتاج ${price}`,
      };
    }

    // Deduct coins
    const newBalance = currentBalance - price;
    userCoinsBalance.set(userId, newBalance);
  }

  // Create purchase record
  const purchase: LifePurchase = {
    id: `purchase-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
    userId,
    lectureAccessId,
    paymentType,
    amount: price,
    purchasedAt: new Date(),
    livesAdded: 1,
    transactionId: `txn-${Date.now()}`,
    status: "completed",
  };

  lifePurchaseStore.set(purchase.id, purchase);

  // Add life to access
  const lifeNumber = access.livesUsedHistory.length + access.livesRemaining + 1;
  const usageRecord: LifeUsageRecord = {
    usedAt: new Date(),
    source: paymentType === "coins" ? "coins" : "money",
    lifeNumber,
  };

  const updatedAccess: LectureAccess = {
    ...access,
    livesRemaining: access.livesRemaining + 1,
    livesUsedHistory: [...access.livesUsedHistory, usageRecord],
  };

  lectureAccessStore.set(accessKey, updatedAccess);

  const accessState = calculateAccessState({
    lectureAccess: updatedAccess,
    lectureSettings: settings,
  });

  const newBalance =
    paymentType === "coins" ? (userCoinsBalance.get(userId) ?? 0) : 0;

  return {
    success: true,
    lifePurchase: purchase,
    lectureAccess: updatedAccess,
    accessState,
    newBalance,
    message: "تم شراء حياة إضافية بنجاح!",
  };
}

// ============================================================================
// USER BALANCE FUNCTIONS
// ============================================================================

/**
 * Get user coins balance
 */
export function getUserCoinsBalance(userId: string): number {
  return userCoinsBalance.get(userId) ?? 0;
}

/**
 * Add coins to user balance
 */
export function addUserCoins(userId: string, amount: number): number {
  const currentBalance = userCoinsBalance.get(userId) ?? 0;
  const newBalance = currentBalance + amount;
  userCoinsBalance.set(userId, newBalance);
  return newBalance;
}

/**
 * Get life price (for UI display)
 */
export function getLifePrices(): { coins: number; money: number } {
  return {
    coins: DEFAULT_SETTINGS.life_price_coins,
    money: DEFAULT_SETTINGS.life_price_money,
  };
}

// ============================================================================
// PURCHASE HISTORY
// ============================================================================

/**
 * Get user's life purchase history
 */
export function getUserLifePurchases(userId: string): LifePurchase[] {
  const purchases: LifePurchase[] = [];
  for (const purchase of lifePurchaseStore.values()) {
    if (purchase.userId === userId) {
      purchases.push(purchase);
    }
  }
  return purchases.sort(
    (a, b) => b.purchasedAt.getTime() - a.purchasedAt.getTime(),
  );
}
