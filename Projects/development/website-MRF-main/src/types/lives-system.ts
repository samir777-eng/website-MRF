// Lives System Types for MRF Educational Platform
// CRITICAL: Core business model - Lecture access with time limits and lives
//
// System Overview:
// - Each lecture has 7-day initial access from activation
// - 3 lives per lecture (extend access by 3 days each)
// - Lives expire 30 days after activation
// - Pre-quiz required to unlock videos (admin-configurable threshold)
// - Bundles: Monthly (4 lectures), Semester (12 lectures)

import type { GradeLevel } from "./lecture";

// ============================================================================
// ACCESS STATUS TYPES
// ============================================================================

/** Current access status for a lecture */
export type LectureAccessStatus =
  | "purchased" // Purchased but not yet activated
  | "activated" // Activated but pre-quiz not passed
  | "active" // Full access (pre-quiz passed, within time window)
  | "needs_life" // Access expired, has lives remaining
  | "expired" // Access expired, no lives, can purchase more
  | "locked" // Pre-quiz max attempts reached - contact support
  | "not_purchased"; // Not owned

/** Pre-quiz status */
export type PreQuizStatus =
  | "not_required" // No pre-quiz for this lecture
  | "not_started"
  | "in_progress"
  | "passed"
  | "failed"
  | "locked"; // Max attempts reached

// ============================================================================
// LECTURE (ENHANCED WITH LIVES SETTINGS)
// ============================================================================

/**
 * Lecture admin-configurable settings
 * All settings are per-lecture and can be changed from admin panel
 */
export interface LectureSettings {
  // Pre-quiz settings
  preQuizThreshold: number | null; // null = no threshold, any score passes
  preQuizMaxAttempts: number; // Default: 2

  // Access settings
  initialAccessDays: number; // Default: 7
  lifeExtensionDays: number; // Default: 3
  maxLives: number; // Default: 3
  livesExpiryDays: number; // Default: 30
}

/**
 * Enhanced Lecture type with Lives System settings
 * Extends the base Lecture concept with access control
 */
export interface LectureWithAccess {
  id: string;
  courseId: string;
  title: string;
  description: string;
  gradeLevel: GradeLevel;
  order: number; // Order within course/period

  // Content IDs
  preQuizId: string;
  postQuizId: string;
  homeworkId: string;
  videoIds: string[]; // Ordered list of video IDs

  // Release
  status: "draft" | "released";
  releaseDate: Date | null; // When lecture becomes available

  // Settings (admin-configurable)
  settings: LectureSettings;

  // Metadata
  createdAt: Date;
  updatedAt: Date;
  createdBy: string; // Admin/Teacher ID
}

// ============================================================================
// LECTURE ACCESS (USER-LECTURE RELATIONSHIP)
// ============================================================================

/** Record of when a life was used */
export interface LifeUsageRecord {
  usedAt: Date;
  source: "initial" | "coins" | "money"; // How the life was obtained
  lifeNumber: number; // 1st, 2nd, 3rd life
}

/**
 * Student's access to a specific lecture
 * This is the core of the Lives System
 */
export interface LectureAccess {
  id: string;
  userId: string;
  lectureId: string;

  // Activation
  purchasedAt: Date;
  activationDate: Date | null; // null = not activated yet

  // Lives
  livesRemaining: number; // Starts at settings.maxLives
  livesUsedHistory: LifeUsageRecord[];

  // Pre-Quiz Progress
  preQuizAttempts: number; // Starts at 0
  preQuizPassed: boolean;
  preQuizBestScore: number | null;
  preQuizLocked: boolean; // true = max attempts reached

  // Post-Quiz Progress
  postQuizCompleted: boolean;
  postQuizScore: number | null;

  // Homework
  homeworkSubmitted: boolean;
  homeworkSubmittedAt: Date | null;

  // Computed (or calculated on-demand)
  currentStatus: LectureAccessStatus;
}

// ============================================================================
// COMPUTED ACCESS STATE
// ============================================================================

/**
 * Detailed access state calculated from LectureAccess
 * Used for UI display and access control decisions
 */
export interface AccessState {
  status: LectureAccessStatus;
  canAccessVideos: boolean;
  canTakePreQuiz: boolean;
  canTakePostQuiz: boolean;
  canSubmitHomework: boolean;

  // Time info (only relevant when activated)
  daysRemaining: number | null;
  hoursRemaining: number | null;
  accessExpiresAt: Date | null;

  // Lives info
  livesRemaining: number;
  livesExpireAt: Date | null;
  canUseLives: boolean;
  canPurchaseLives: boolean;

  // Pre-quiz info
  preQuizAttemptsRemaining: number;
  preQuizStatus: PreQuizStatus;

  // Messages for UI
  statusMessage: string; // Arabic status text
  actionRequired: string | null; // What user needs to do
}

// ============================================================================
// BUNDLE SYSTEM
// ============================================================================

/** Bundle type */
export type BundleType = "monthly" | "semester" | "custom";

/**
 * A bundle of lectures that can be purchased together
 */
export interface Bundle {
  id: string;
  name: string;
  description: string;
  type: BundleType;
  courseId: string;
  gradeLevel: GradeLevel;

  // What's included
  lectureCount: number; // 4 for monthly, 12 for semester
  lectureIds: string[] | null; // Specific lectures, or null for "next N"

  // Pricing
  price: number; // EGP
  originalPrice: number | null; // For showing discounts
  coinsPrice: number | null; // If purchasable with coins

  // Validity period
  validFrom: Date;
  validTo: Date;

  // Status
  isActive: boolean;

  // Metadata
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Student's purchase of a bundle
 */
export interface BundlePurchase {
  id: string;
  userId: string;
  bundleId: string;

  // Purchase details
  purchasedAt: Date;
  expiresAt: Date;
  paymentMethod: "card" | "wallet" | "fawry" | "coins" | "code";
  amountPaid: number;
  currency: "EGP" | "coins";

  // Bundle usage tracking
  lecturesRemaining: number;
  lecturesRedeemed: string[]; // IDs of lectures redeemed
  lectureAccessIds: string[]; // IDs of LectureAccess records created

  // Status
  isActive: boolean;
  status: "pending" | "completed" | "refunded" | "cancelled";

  // Transaction reference
  transactionId: string | null;
  paymentGatewayRef: string | null;
}

// ============================================================================
// LIFE PURCHASES
// ============================================================================

/**
 * Record of a student purchasing additional lives
 */
export interface LifePurchase {
  id: string;
  userId: string;
  lectureAccessId: string; // Which lecture access this life is for

  // Purchase details
  purchasedAt: Date;
  paymentType: "coins" | "money";
  amount: number; // Coins spent or EGP paid
  livesAdded: number; // Usually 1

  // Transaction
  transactionId: string | null;
  status: "pending" | "completed" | "refunded";
}

// ============================================================================
// CHALLENGES (STANDALONE QUIZZES)
// ============================================================================

/**
 * A standalone quiz available for practice (not tied to lecture access)
 * Replaces the old "quizzes" page concept
 */
export interface Challenge {
  id: string;
  title: string;
  description: string;
  quizId: string; // Reference to Quiz
  gradeLevel: GradeLevel;

  // Configuration
  timeLimit: number; // Seconds
  difficulty: "easy" | "medium" | "hard";
  category: string; // e.g., "نحو", "بلاغة"

  // Availability
  isActive: boolean;
  availableFrom: Date | null;
  availableTo: Date | null;

  // Display
  order: number;
  iconUrl: string | null;
  accentColor: string | null; // Hex color

  // Stats
  totalAttempts: number;
  averageScore: number;

  // Metadata
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Student's attempt at a challenge
 */
export interface ChallengeAttempt {
  id: string;
  userId: string;
  challengeId: string;
  quizAttemptId: string; // Reference to QuizAttempt

  // Results
  score: number;
  completedAt: Date;
  timeTaken: number; // Seconds

  // Leaderboard
  rank: number | null; // Rank at time of completion
  xpEarned: number;
}

// ============================================================================
// LEADERBOARD
// ============================================================================

/** Leaderboard type */
export type LeaderboardType = "main" | "challenges";

/**
 * Leaderboard entry
 */
export interface LeaderboardEntry {
  rank: number;
  userId: string;
  userName: string;
  userAvatar: string | null;

  // Scores
  totalScore: number;
  weeklyScore: number;
  monthlyScore: number;

  // Stats
  challengesCompleted: number;
  averageScore: number;
  bestScore: number;
  streak: number;

  // Change
  rankChange: number; // Positive = moved up
}

// ============================================================================
// ADMIN SETTINGS
// ============================================================================

/** Admin setting keys */
export type AdminSettingKey =
  | "life_price_coins"
  | "life_price_money"
  | "default_access_days"
  | "default_life_extension_days"
  | "default_max_lives"
  | "default_lives_expiry_days"
  | "default_pre_quiz_attempts"
  | "monthly_bundle_lectures"
  | "semester_bundle_lectures";

/**
 * Admin-configurable system settings
 */
export interface AdminSetting {
  id: string;
  key: AdminSettingKey;
  value: string | number | boolean;
  description: string; // Arabic description
  updatedAt: Date;
  updatedBy: string; // Admin ID
}

/**
 * Default system settings
 */
export const DEFAULT_SETTINGS: Record<AdminSettingKey, number> = {
  life_price_coins: 50,
  life_price_money: 10, // EGP
  default_access_days: 7,
  default_life_extension_days: 3,
  default_max_lives: 3,
  default_lives_expiry_days: 30,
  default_pre_quiz_attempts: 2,
  monthly_bundle_lectures: 4,
  semester_bundle_lectures: 12,
};

// ============================================================================
// API REQUEST/RESPONSE TYPES
// ============================================================================

/**
 * Request to activate a lecture
 */
export interface ActivateLectureRequest {
  lectureId: string;
}

export interface ActivateLectureResponse {
  success: boolean;
  lectureAccess: LectureAccess;
  accessState: AccessState;
  message: string; // Arabic message
}

/**
 * Request to use a life
 */
export interface UseLifeRequest {
  lectureAccessId: string;
}

export interface UseLifeResponse {
  success: boolean;
  lectureAccess: LectureAccess;
  accessState: AccessState;
  message: string;
}

/**
 * Request to purchase a life
 */
export interface PurchaseLifeRequest {
  lectureAccessId: string;
  paymentType: "coins" | "money";
}

export interface PurchaseLifeResponse {
  success: boolean;
  lifePurchase: LifePurchase;
  lectureAccess: LectureAccess;
  accessState: AccessState;
  newBalance: number; // Coins or wallet balance
  message: string;
}

/**
 * Lecture detail with access info
 */
export interface LectureDetailWithAccess {
  lecture: LectureWithAccess;
  access: LectureAccess | null;
  accessState: AccessState;

  // Pre-quiz info
  preQuizInfo: {
    attemptsUsed: number;
    maxAttempts: number;
    bestScore: number | null;
    threshold: number | null;
    canAttempt: boolean;
  };

  // Progress
  videosWatched: number;
  totalVideos: number;
  postQuizCompleted: boolean;
  homeworkSubmitted: boolean;
}

// ============================================================================
// UTILITY FUNCTIONS TYPES
// ============================================================================

/**
 * Input for calculating access state
 */
export interface CalculateAccessInput {
  lectureAccess: LectureAccess;
  lectureSettings: LectureSettings;
  now?: Date; // For testing, defaults to current time
}

/**
 * Result of access calculation
 */
export interface CalculateAccessResult {
  accessState: AccessState;
  shouldNotifyExpiringSoon: boolean; // True if < 24h remaining
  shouldNotifyLivesExpiring: boolean; // True if < 7 days until lives expire
}
