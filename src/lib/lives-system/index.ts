/**
 * Lives System - Core Module
 *
 * This module contains the core business logic for the lecture access system.
 *
 * Key features:
 * - 7-day initial access from activation
 * - 3 lives per lecture (extend by 3 days each)
 * - Lives expire 30 days after activation
 * - Pre-quiz required to unlock videos
 * - Bundles: Monthly (4 lectures), Semester (12 lectures)
 */

// Types
export type {
  AccessState,
  ActivateLectureRequest,
  ActivateLectureResponse,
  AdminSetting,
  AdminSettingKey,
  Bundle,
  BundlePurchase,
  BundleType,
  CalculateAccessInput,
  CalculateAccessResult,
  Challenge,
  ChallengeAttempt,
  LeaderboardEntry,
  LeaderboardType,
  LectureAccess,
  LectureAccessStatus,
  LectureDetailWithAccess,
  LectureSettings,
  LectureWithAccess,
  LifePurchase,
  LifeUsageRecord,
  PreQuizStatus,
  PurchaseLifeRequest,
  PurchaseLifeResponse,
  UseLifeRequest,
  UseLifeResponse,
} from "@/types/lives-system";

// Constants
export { DEFAULT_SETTINGS } from "@/types/lives-system";

// Access calculation functions
export {
  calculateAccess,
  calculateAccessState,
  formatTimeRemaining,
  getStatusBgColor,
  getStatusColor,
} from "./calculate-access";

// Lecture service functions
export {
  activateLecture,
  createLectureAccess,
  getDefaultLectureSettings,
  getLectureAccess,
  getLectureDetail,
  markVideoWatched,
  recordPreQuizAttempt,
} from "./lecture-service";

export type {
  RecordPreQuizAttemptInput,
  RecordPreQuizAttemptResult,
} from "./lecture-service";

// Life service functions
export {
  addUserCoins,
  getLifePrices,
  getUserCoinsBalance,
  getUserLifePurchases,
  initializeLifeService,
  purchaseLife,
  useLife,
} from "./life-service";

// Bundle service functions
export {
  getAvailableBundles,
  getBundleConfig,
  getUserActiveBundles,
  getUserBundlePurchases,
  initializeBundleService,
  purchaseBundle,
  redeemLectureFromBundle,
} from "./bundle-service";

export type {
  PurchaseBundleRequest,
  PurchaseBundleResponse,
  RedeemLectureRequest,
  RedeemLectureResponse,
} from "./bundle-service";
