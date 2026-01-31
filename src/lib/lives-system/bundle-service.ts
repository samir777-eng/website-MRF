/**
 * Bundle Service
 * Handles bundle purchases and lecture slot allocation
 */

import type { GradeLevel } from "@/types/lecture";
import type {
  Bundle,
  BundlePurchase,
  BundleType,
  LectureAccess,
  LectureWithAccess,
} from "@/types/lives-system";
import { DEFAULT_SETTINGS } from "@/types/lives-system";
import { createLectureAccess } from "./lecture-service";

// ============================================================================
// IN-MEMORY STORAGE (Replace with database in production)
// ============================================================================

// Mock storage for bundles
const bundleStore: Map<string, Bundle> = new Map();

// Mock storage for bundle purchases
const bundlePurchaseStore: Map<string, BundlePurchase> = new Map();

// ============================================================================
// BUNDLE DEFINITIONS
// ============================================================================

/**
 * Get bundle configuration
 */
export function getBundleConfig(type: BundleType): {
  lectureCount: number;
  durationDays: number;
  name: string;
} {
  switch (type) {
    case "monthly":
      return {
        lectureCount: DEFAULT_SETTINGS.monthly_bundle_lectures,
        durationDays: 30,
        name: "الباقة الشهرية",
      };
    case "semester":
      return {
        lectureCount: DEFAULT_SETTINGS.semester_bundle_lectures,
        durationDays: 90,
        name: "باقة الفصل الدراسي",
      };
    case "custom":
    default:
      return {
        lectureCount: 1,
        durationDays: 0, // No bundle duration for custom/single
        name: "باقة مخصصة",
      };
  }
}

/**
 * Get available bundles for a grade
 */
export function getAvailableBundles(gradeLevel: GradeLevel): Bundle[] {
  const bundles: Bundle[] = [];
  const now = new Date();
  const validTo = new Date(now.getTime() + 365 * 24 * 60 * 60 * 1000); // 1 year validity

  // Create monthly bundle
  const monthlyConfig = getBundleConfig("monthly");
  bundles.push({
    id: `bundle-monthly-${gradeLevel}`,
    name: monthlyConfig.name,
    type: "monthly",
    courseId: `course-${gradeLevel}`,
    gradeLevel,
    lectureCount: monthlyConfig.lectureCount,
    lectureIds: null, // Next N lectures
    price: 200, // Example price in EGP
    originalPrice: 220, // Show 10% discount
    coinsPrice: null,
    description: `${monthlyConfig.lectureCount} محاضرات لمدة شهر كامل`,
    validFrom: now,
    validTo,
    isActive: true,
    createdAt: now,
    updatedAt: now,
  });

  // Create semester bundle
  const semesterConfig = getBundleConfig("semester");
  bundles.push({
    id: `bundle-semester-${gradeLevel}`,
    name: semesterConfig.name,
    type: "semester",
    courseId: `course-${gradeLevel}`,
    gradeLevel,
    lectureCount: semesterConfig.lectureCount,
    lectureIds: null, // Next N lectures
    price: 700, // Example price in EGP
    originalPrice: 875, // Show 20% discount
    coinsPrice: null,
    description: `${semesterConfig.lectureCount} محاضرة لمدة 3 أشهر`,
    validFrom: now,
    validTo,
    isActive: true,
    createdAt: now,
    updatedAt: now,
  });

  return bundles;
}

// ============================================================================
// BUNDLE PURCHASE FUNCTIONS
// ============================================================================

export interface PurchaseBundleRequest {
  bundleId: string;
  userId: string;
}

export interface PurchaseBundleResponse {
  success: boolean;
  bundlePurchase: BundlePurchase | null;
  message: string;
}

/**
 * Purchase a bundle
 */
export function purchaseBundle(
  request: PurchaseBundleRequest,
): PurchaseBundleResponse {
  const { bundleId, userId } = request;

  // Find the bundle
  let bundle: Bundle | undefined;

  // Check in predefined bundles
  const gradeLevels: GradeLevel[] = ["1", "2", "3"];
  for (const gradeLevel of gradeLevels) {
    const bundles = getAvailableBundles(gradeLevel);
    bundle = bundles.find((b) => b.id === bundleId);
    if (bundle) break;
  }

  // Also check store
  if (!bundle) {
    bundle = bundleStore.get(bundleId);
  }

  if (!bundle) {
    return {
      success: false,
      bundlePurchase: null,
      message: "الباقة غير موجودة",
    };
  }

  const now = new Date();
  const config = getBundleConfig(bundle.type);
  const expiresAt = new Date(
    now.getTime() + config.durationDays * 24 * 60 * 60 * 1000,
  );

  // Create bundle purchase
  const purchase: BundlePurchase = {
    id: `bp-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
    userId,
    bundleId: bundle.id,
    purchasedAt: now,
    expiresAt,
    paymentMethod: "card", // Default, should be passed from payment flow
    amountPaid: bundle.price,
    currency: "EGP",
    lecturesRemaining: bundle.lectureCount,
    lecturesRedeemed: [],
    lectureAccessIds: [], // Will be populated when lectures are redeemed
    isActive: true,
    status: "completed",
    transactionId: `txn-${Date.now()}`,
    paymentGatewayRef: null,
  };

  bundlePurchaseStore.set(purchase.id, purchase);

  return {
    success: true,
    bundlePurchase: purchase,
    message: `تم شراء ${bundle.name} بنجاح! لديك ${bundle.lectureCount} محاضرات`,
  };
}

// ============================================================================
// LECTURE REDEMPTION FROM BUNDLE
// ============================================================================

export interface RedeemLectureRequest {
  bundlePurchaseId: string;
  lectureId: string;
  userId: string;
}

export interface RedeemLectureResponse {
  success: boolean;
  lectureAccess: LectureAccess | null;
  lecturesRemaining: number;
  message: string;
}

// Reference to lecture store (for getting lecture with settings)
let lectureStore: Map<string, LectureWithAccess>;

/**
 * Initialize bundle service with lecture store reference
 */
export function initializeBundleService(
  lectureStoreRef: Map<string, LectureWithAccess>,
) {
  lectureStore = lectureStoreRef;
}

/**
 * Redeem a lecture from a bundle
 */
export function redeemLectureFromBundle(
  request: RedeemLectureRequest,
): RedeemLectureResponse {
  const { bundlePurchaseId, lectureId, userId } = request;

  const purchase = bundlePurchaseStore.get(bundlePurchaseId);

  if (!purchase) {
    return {
      success: false,
      lectureAccess: null,
      lecturesRemaining: 0,
      message: "سجل الشراء غير موجود",
    };
  }

  if (purchase.userId !== userId) {
    return {
      success: false,
      lectureAccess: null,
      lecturesRemaining: purchase.lecturesRemaining,
      message: "غير مصرح لك باستخدام هذه الباقة",
    };
  }

  if (!purchase.isActive) {
    return {
      success: false,
      lectureAccess: null,
      lecturesRemaining: 0,
      message: "هذه الباقة غير نشطة",
    };
  }

  if (new Date() > purchase.expiresAt) {
    return {
      success: false,
      lectureAccess: null,
      lecturesRemaining: 0,
      message: "انتهت صلاحية هذه الباقة",
    };
  }

  if (purchase.lecturesRemaining <= 0) {
    return {
      success: false,
      lectureAccess: null,
      lecturesRemaining: 0,
      message: "لا توجد محاضرات متبقية في هذه الباقة",
    };
  }

  if (purchase.lecturesRedeemed.includes(lectureId)) {
    return {
      success: false,
      lectureAccess: null,
      lecturesRemaining: purchase.lecturesRemaining,
      message: "تم استرداد هذه المحاضرة مسبقاً",
    };
  }

  // Get lecture
  const lecture = lectureStore?.get(lectureId);
  if (!lecture) {
    return {
      success: false,
      lectureAccess: null,
      lecturesRemaining: purchase.lecturesRemaining,
      message: "المحاضرة غير موجودة",
    };
  }

  // Create lecture access
  const access = createLectureAccess(userId, lectureId, lecture);

  // Update bundle purchase
  const updatedPurchase: BundlePurchase = {
    ...purchase,
    lecturesRemaining: purchase.lecturesRemaining - 1,
    lecturesRedeemed: [...purchase.lecturesRedeemed, lectureId],
  };
  bundlePurchaseStore.set(bundlePurchaseId, updatedPurchase);

  return {
    success: true,
    lectureAccess: access,
    lecturesRemaining: updatedPurchase.lecturesRemaining,
    message: `تم إضافة المحاضرة! متبقي ${updatedPurchase.lecturesRemaining} محاضرات`,
  };
}

// ============================================================================
// USER BUNDLE QUERIES
// ============================================================================

/**
 * Get user's active bundle purchases
 */
export function getUserBundlePurchases(userId: string): BundlePurchase[] {
  const purchases: BundlePurchase[] = [];
  const now = new Date();

  for (const purchase of bundlePurchaseStore.values()) {
    if (purchase.userId === userId) {
      // Update isActive based on expiry
      if (purchase.isActive && now > purchase.expiresAt) {
        const updated = { ...purchase, isActive: false };
        bundlePurchaseStore.set(purchase.id, updated);
        purchases.push(updated);
      } else {
        purchases.push(purchase);
      }
    }
  }

  return purchases.sort(
    (a, b) => b.purchasedAt.getTime() - a.purchasedAt.getTime(),
  );
}

/**
 * Get user's active bundles with remaining lectures
 */
export function getUserActiveBundles(userId: string): BundlePurchase[] {
  return getUserBundlePurchases(userId).filter(
    (p) => p.isActive && p.lecturesRemaining > 0 && new Date() < p.expiresAt,
  );
}
