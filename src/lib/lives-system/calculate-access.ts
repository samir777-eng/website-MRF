/**
 * Lives System - Access Calculation
 * Core business logic for calculating lecture access status
 *
 * Rules:
 * - Initial access: 7 days from activation (configurable)
 * - Each life extends access by 3 days (configurable)
 * - Lives expire 30 days after activation (configurable)
 * - Pre-quiz must be passed to unlock videos
 * - Max 2 pre-quiz attempts by default (configurable)
 */

import type {
  AccessState,
  CalculateAccessInput,
  CalculateAccessResult,
  LectureAccessStatus,
  PreQuizStatus,
} from "@/types/lives-system";

// Arabic status messages
const STATUS_MESSAGES: Record<LectureAccessStatus, string> = {
  purchased: "تم الشراء - اضغط للتفعيل",
  activated: "تم التفعيل - اجتز اختبار ما قبل المحاضرة",
  active: "الوصول متاح",
  needs_life: "انتهى الوصول - استخدم حياة للاستمرار",
  expired: "انتهى الوصول - اشترِ حياة إضافية",
  locked: "تم قفل المحاضرة - تواصل مع الدعم",
  not_purchased: "غير مشترك",
};

/**
 * Calculate the current access state for a lecture
 */
export function calculateAccessState(input: CalculateAccessInput): AccessState {
  const { lectureAccess, lectureSettings, now = new Date() } = input;

  // Not activated yet
  if (!lectureAccess.activationDate) {
    return createAccessState({
      status: "purchased",
      livesRemaining: lectureAccess.livesRemaining,
      preQuizAttemptsRemaining:
        lectureSettings.preQuizMaxAttempts - lectureAccess.preQuizAttempts,
      preQuizStatus: "not_started",
      actionRequired: "اضغط على زر التفعيل لبدء المحاضرة",
    });
  }

  const activationDate = new Date(lectureAccess.activationDate);
  const msSinceActivation = now.getTime() - activationDate.getTime();
  const daysSinceActivation = msSinceActivation / (1000 * 60 * 60 * 24);

  // Check if pre-quiz is locked (max attempts reached without passing)
  if (lectureAccess.preQuizLocked) {
    return createAccessState({
      status: "locked",
      livesRemaining: lectureAccess.livesRemaining,
      preQuizAttemptsRemaining: 0,
      preQuizStatus: "locked",
      actionRequired: "تواصل مع الدعم الفني لإعادة فتح المحاضرة",
    });
  }

  // Calculate lives expiry
  const livesExpireAt = new Date(
    activationDate.getTime() +
      lectureSettings.livesExpiryDays * 24 * 60 * 60 * 1000,
  );
  const livesExpired = now > livesExpireAt;

  // Calculate total access days (initial + lives used)
  const livesUsed = lectureSettings.maxLives - lectureAccess.livesRemaining;
  const totalAccessDays =
    lectureSettings.initialAccessDays +
    livesUsed * lectureSettings.lifeExtensionDays;

  // Calculate access expiry
  const accessExpiresAt = new Date(
    activationDate.getTime() + totalAccessDays * 24 * 60 * 60 * 1000,
  );
  const accessExpired = now > accessExpiresAt;

  // Calculate remaining time
  const msRemaining = accessExpiresAt.getTime() - now.getTime();
  const daysRemaining = Math.max(0, msRemaining / (1000 * 60 * 60 * 24));
  const hoursRemaining = Math.max(0, msRemaining / (1000 * 60 * 60));

  // Determine pre-quiz status
  const preQuizAttemptsRemaining =
    lectureSettings.preQuizMaxAttempts - lectureAccess.preQuizAttempts;
  let preQuizStatus: PreQuizStatus;
  if (lectureAccess.preQuizPassed) {
    preQuizStatus = "passed";
  } else if (preQuizAttemptsRemaining <= 0) {
    preQuizStatus = "locked";
  } else if (lectureAccess.preQuizAttempts > 0) {
    preQuizStatus = "failed";
  } else {
    preQuizStatus = "not_started";
  }

  // Determine main status
  let status: LectureAccessStatus;
  let actionRequired: string | null = null;

  if (!accessExpired) {
    // Within access window
    if (!lectureAccess.preQuizPassed) {
      status = "activated";
      actionRequired = "اجتز اختبار ما قبل المحاضرة لفتح الفيديوهات";
    } else {
      status = "active";
    }
  } else if (livesExpired) {
    // Lives have expired, can only purchase more
    status = "expired";
    actionRequired = "اشترِ حياة إضافية للوصول مرة أخرى";
  } else if (lectureAccess.livesRemaining > 0) {
    // Access expired but has lives
    status = "needs_life";
    actionRequired = `استخدم حياة (+${lectureSettings.lifeExtensionDays} أيام)`;
  } else {
    // No lives left, but can purchase
    status = "expired";
    actionRequired = "اشترِ حياة إضافية للوصول مرة أخرى";
  }

  const canAccessVideos = status === "active" && lectureAccess.preQuizPassed;

  return {
    status,
    canAccessVideos,
    canTakePreQuiz:
      (status === "activated" || status === "active") &&
      !lectureAccess.preQuizPassed &&
      preQuizAttemptsRemaining > 0,
    canTakePostQuiz: canAccessVideos,
    canSubmitHomework: true, // Always allowed (late submission OK)
    daysRemaining: accessExpired ? 0 : daysRemaining,
    hoursRemaining: accessExpired ? 0 : hoursRemaining,
    accessExpiresAt: accessExpired ? null : accessExpiresAt,
    livesRemaining: lectureAccess.livesRemaining,
    livesExpireAt: livesExpired ? null : livesExpireAt,
    canUseLives:
      accessExpired && !livesExpired && lectureAccess.livesRemaining > 0,
    canPurchaseLives: accessExpired,
    preQuizAttemptsRemaining,
    preQuizStatus,
    statusMessage: STATUS_MESSAGES[status],
    actionRequired,
  };
}

/** Helper to create a basic AccessState with defaults */
function createAccessState(
  partial: Partial<AccessState> &
    Pick<
      AccessState,
      "status" | "livesRemaining" | "preQuizAttemptsRemaining" | "preQuizStatus"
    >,
): AccessState {
  return {
    canAccessVideos: false,
    canTakePreQuiz:
      partial.status === "activated" || partial.status === "active",
    canTakePostQuiz: false,
    canSubmitHomework: true,
    daysRemaining: null,
    hoursRemaining: null,
    accessExpiresAt: null,
    livesExpireAt: null,
    canUseLives: false,
    canPurchaseLives: false,
    statusMessage: STATUS_MESSAGES[partial.status],
    actionRequired: partial.actionRequired ?? null,
    ...partial,
  };
}

/**
 * Full access calculation with notification flags
 */
export function calculateAccess(
  input: CalculateAccessInput,
): CalculateAccessResult {
  const accessState = calculateAccessState(input);
  const { lectureSettings } = input;

  // Check if should notify about expiring soon (< 24 hours)
  const shouldNotifyExpiringSoon =
    accessState.status === "active" &&
    accessState.hoursRemaining !== null &&
    accessState.hoursRemaining > 0 &&
    accessState.hoursRemaining < 24;

  // Check if should notify about lives expiring (< 7 days)
  const now = input.now ?? new Date();
  const shouldNotifyLivesExpiring =
    accessState.livesExpireAt !== null &&
    accessState.livesRemaining > 0 &&
    (accessState.livesExpireAt.getTime() - now.getTime()) /
      (1000 * 60 * 60 * 24) <
      7;

  return {
    accessState,
    shouldNotifyExpiringSoon,
    shouldNotifyLivesExpiring,
  };
}

/**
 * Format remaining time as Arabic string
 */
export function formatTimeRemaining(
  daysRemaining: number | null,
  hoursRemaining: number | null,
): string {
  if (daysRemaining === null || hoursRemaining === null) {
    return "غير متاح";
  }

  if (daysRemaining >= 1) {
    const days = Math.floor(daysRemaining);
    if (days === 1) return "يوم واحد";
    if (days === 2) return "يومان";
    if (days <= 10) return `${days} أيام`;
    return `${days} يوم`;
  }

  const hours = Math.floor(hoursRemaining);
  if (hours === 0) {
    const minutes = Math.floor((hoursRemaining % 1) * 60);
    if (minutes <= 1) return "أقل من دقيقة";
    return `${minutes} دقيقة`;
  }
  if (hours === 1) return "ساعة واحدة";
  if (hours === 2) return "ساعتان";
  if (hours <= 10) return `${hours} ساعات`;
  return `${hours} ساعة`;
}

/**
 * Get appropriate color class for status
 */
export function getStatusColor(status: LectureAccessStatus): string {
  switch (status) {
    case "active":
      return "text-green-600 dark:text-green-400";
    case "activated":
      return "text-blue-600 dark:text-blue-400";
    case "purchased":
      return "text-purple-600 dark:text-purple-400";
    case "needs_life":
      return "text-amber-600 dark:text-amber-400";
    case "expired":
      return "text-red-600 dark:text-red-400";
    case "locked":
      return "text-red-700 dark:text-red-500";
    case "not_purchased":
      return "text-muted-foreground";
    default:
      return "text-muted-foreground";
  }
}

/**
 * Get background color class for status badge
 */
export function getStatusBgColor(status: LectureAccessStatus): string {
  switch (status) {
    case "active":
      return "bg-green-100 dark:bg-green-900/30";
    case "activated":
      return "bg-blue-100 dark:bg-blue-900/30";
    case "purchased":
      return "bg-purple-100 dark:bg-purple-900/30";
    case "needs_life":
      return "bg-amber-100 dark:bg-amber-900/30";
    case "expired":
      return "bg-red-100 dark:bg-red-900/30";
    case "locked":
      return "bg-red-200 dark:bg-red-900/50";
    case "not_purchased":
      return "bg-muted";
    default:
      return "bg-muted";
  }
}
