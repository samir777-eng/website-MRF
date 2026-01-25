/**
 * Lecture Service
 * Handles lecture activation, pre-quiz attempts, and access management
 */

import type {
  AccessState,
  ActivateLectureRequest,
  ActivateLectureResponse,
  LectureAccess,
  LectureDetailWithAccess,
  LectureSettings,
  LectureWithAccess,
} from "@/types/lives-system";
import { DEFAULT_SETTINGS } from "@/types/lives-system";
import { calculateAccessState } from "./calculate-access";

// ============================================================================
// IN-MEMORY STORAGE (Replace with database in production)
// ============================================================================

// Mock storage for lecture access records
const lectureAccessStore: Map<string, LectureAccess> = new Map();

// Mock storage for lectures with settings
const lectureStore: Map<string, LectureWithAccess> = new Map();

// ============================================================================
// LECTURE ACCESS FUNCTIONS
// ============================================================================

/**
 * Get or create lecture access for a user
 */
export function getLectureAccess(
  userId: string,
  lectureId: string
): LectureAccess | null {
  const key = `${userId}-${lectureId}`;
  return lectureAccessStore.get(key) ?? null;
}

/**
 * Create initial lecture access (after purchase)
 */
export function createLectureAccess(
  userId: string,
  lectureId: string,
  lecture: LectureWithAccess
): LectureAccess {
  const key = `${userId}-${lectureId}`;

  const access: LectureAccess = {
    id: `access-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
    userId,
    lectureId,
    purchasedAt: new Date(),
    activationDate: null,
    livesRemaining: lecture.settings.maxLives,
    livesUsedHistory: [],
    preQuizAttempts: 0,
    preQuizPassed: false,
    preQuizBestScore: null,
    preQuizLocked: false,
    postQuizCompleted: false,
    postQuizScore: null,
    homeworkSubmitted: false,
    homeworkSubmittedAt: null,
    currentStatus: "purchased",
  };

  lectureAccessStore.set(key, access);
  return access;
}

/**
 * Activate a lecture (starts the timer)
 */
export function activateLecture(
  request: ActivateLectureRequest,
  userId: string
): ActivateLectureResponse {
  const { lectureId } = request;
  const key = `${userId}-${lectureId}`;

  let access = lectureAccessStore.get(key);
  const lecture = lectureStore.get(lectureId);

  if (!lecture) {
    return {
      success: false,
      lectureAccess: null as unknown as LectureAccess,
      accessState: null as unknown as AccessState,
      message: "المحاضرة غير موجودة",
    };
  }

  if (!access) {
    return {
      success: false,
      lectureAccess: null as unknown as LectureAccess,
      accessState: null as unknown as AccessState,
      message: "لم تقم بشراء هذه المحاضرة",
    };
  }

  if (access.activationDate) {
    const accessState = calculateAccessState({
      lectureAccess: access,
      lectureSettings: lecture.settings,
    });
    return {
      success: false,
      lectureAccess: access,
      accessState,
      message: "تم تفعيل المحاضرة مسبقاً",
    };
  }

  // Activate the lecture
  access = {
    ...access,
    activationDate: new Date(),
    currentStatus: "active",
  };
  lectureAccessStore.set(key, access);

  const accessState = calculateAccessState({
    lectureAccess: access,
    lectureSettings: lecture.settings,
  });

  return {
    success: true,
    lectureAccess: access,
    accessState,
    message: `تم تفعيل المحاضرة! لديك ${lecture.settings.initialAccessDays} أيام للوصول`,
  };
}

/**
 * Get default lecture settings
 */
export function getDefaultLectureSettings(): LectureSettings {
  return {
    preQuizThreshold: null, // No threshold by default
    preQuizMaxAttempts: DEFAULT_SETTINGS.default_pre_quiz_attempts,
    initialAccessDays: DEFAULT_SETTINGS.default_access_days,
    lifeExtensionDays: DEFAULT_SETTINGS.default_life_extension_days,
    maxLives: DEFAULT_SETTINGS.default_max_lives,
    livesExpiryDays: DEFAULT_SETTINGS.default_lives_expiry_days,
  };
}

// ============================================================================
// PRE-QUIZ FUNCTIONS
// ============================================================================

export interface RecordPreQuizAttemptInput {
  userId: string;
  lectureId: string;
  score: number;
}

export interface RecordPreQuizAttemptResult {
  success: boolean;
  passed: boolean;
  locked: boolean;
  attemptsRemaining: number;
  message: string;
  accessState: AccessState | null;
}

/**
 * Record a pre-quiz attempt
 */
export function recordPreQuizAttempt(
  input: RecordPreQuizAttemptInput
): RecordPreQuizAttemptResult {
  const { userId, lectureId, score } = input;
  const key = `${userId}-${lectureId}`;

  let access = lectureAccessStore.get(key);
  const lecture = lectureStore.get(lectureId);

  if (!lecture || !access) {
    return {
      success: false,
      passed: false,
      locked: false,
      attemptsRemaining: 0,
      message: "المحاضرة غير متاحة",
      accessState: null,
    };
  }

  if (access.preQuizPassed) {
    return {
      success: false,
      passed: true,
      locked: false,
      attemptsRemaining: 0,
      message: "لقد اجتزت هذا الاختبار مسبقاً",
      accessState: calculateAccessState({
        lectureAccess: access,
        lectureSettings: lecture.settings,
      }),
    };
  }

  if (access.preQuizLocked) {
    return {
      success: false,
      passed: false,
      locked: true,
      attemptsRemaining: 0,
      message: "تم قفل الاختبار - تواصل مع الدعم الفني",
      accessState: calculateAccessState({
        lectureAccess: access,
        lectureSettings: lecture.settings,
      }),
    };
  }

  // Determine if passed
  const threshold = lecture.settings.preQuizThreshold;
  const passed = threshold === null || score >= threshold;

  // Update attempts
  const newAttempts = access.preQuizAttempts + 1;
  const attemptsRemaining = lecture.settings.preQuizMaxAttempts - newAttempts;
  const shouldLock = !passed && attemptsRemaining <= 0;

  access = {
    ...access,
    preQuizAttempts: newAttempts,
    preQuizPassed: passed,
    preQuizBestScore:
      access.preQuizBestScore === null
        ? score
        : Math.max(access.preQuizBestScore, score),
    preQuizLocked: shouldLock,
    currentStatus: shouldLock
      ? "locked"
      : passed
        ? "active"
        : access.currentStatus,
  };
  lectureAccessStore.set(key, access);

  const accessState = calculateAccessState({
    lectureAccess: access,
    lectureSettings: lecture.settings,
  });

  if (passed) {
    return {
      success: true,
      passed: true,
      locked: false,
      attemptsRemaining: 0,
      message: "تهانينا! لقد اجتزت الاختبار ويمكنك الآن مشاهدة الفيديوهات",
      accessState,
    };
  }

  if (shouldLock) {
    return {
      success: true,
      passed: false,
      locked: true,
      attemptsRemaining: 0,
      message:
        "للأسف استنفدت جميع المحاولات - تواصل مع الدعم الفني لإعادة الفتح",
      accessState,
    };
  }

  return {
    success: true,
    passed: false,
    locked: false,
    attemptsRemaining,
    message: `للأسف لم تجتز الاختبار. متبقي ${attemptsRemaining} محاولة`,
    accessState,
  };
}

// ============================================================================
// LECTURE DETAIL FUNCTIONS
// ============================================================================

/**
 * Get lecture detail with access info
 */
export function getLectureDetail(
  userId: string,
  lectureId: string
): LectureDetailWithAccess | null {
  const lecture = lectureStore.get(lectureId);
  if (!lecture) return null;

  const access = getLectureAccess(userId, lectureId);

  // If no access, return not purchased state
  if (!access) {
    return {
      lecture,
      access: null,
      accessState: {
        status: "not_purchased",
        canAccessVideos: false,
        canTakePreQuiz: false,
        canTakePostQuiz: false,
        canSubmitHomework: false,
        daysRemaining: null,
        hoursRemaining: null,
        accessExpiresAt: null,
        livesRemaining: 0,
        livesExpireAt: null,
        canUseLives: false,
        canPurchaseLives: false,
        preQuizAttemptsRemaining: 0,
        preQuizStatus: "not_started",
        statusMessage: "غير مشترك",
        actionRequired: "قم بشراء المحاضرة للوصول",
      },
      preQuizInfo: {
        attemptsUsed: 0,
        maxAttempts: lecture.settings.preQuizMaxAttempts,
        bestScore: null,
        threshold: lecture.settings.preQuizThreshold,
        canAttempt: false,
      },
      videosWatched: 0,
      totalVideos: lecture.videoIds.length,
      postQuizCompleted: false,
      homeworkSubmitted: false,
    };
  }

  const accessState = calculateAccessState({
    lectureAccess: access,
    lectureSettings: lecture.settings,
  });

  return {
    lecture,
    access,
    accessState,
    preQuizInfo: {
      attemptsUsed: access.preQuizAttempts,
      maxAttempts: lecture.settings.preQuizMaxAttempts,
      bestScore: access.preQuizBestScore,
      threshold: lecture.settings.preQuizThreshold,
      canAttempt: accessState.canTakePreQuiz,
    },
    videosWatched: 0, // Video progress tracked separately
    totalVideos: lecture.videoIds.length,
    postQuizCompleted: access.postQuizCompleted,
    homeworkSubmitted: access.homeworkSubmitted,
  };
}

// ============================================================================
// VIDEO PROGRESS FUNCTIONS
// ============================================================================

/**
 * Mark a video as watched
 * Note: Video progress tracking is handled separately from the Lives System
 * This is a placeholder for future integration with a video progress service
 */
export function markVideoWatched(
  userId: string,
  lectureId: string,
  videoId: string
): boolean {
  const key = `${userId}-${lectureId}`;
  const access = lectureAccessStore.get(key);

  if (!access) return false;

  // Video progress tracking would be handled by a separate service
  // For now, just verify the user has access to the lecture
  console.log(
    `Video ${videoId} watched by user ${userId} in lecture ${lectureId}`
  );

  return true;
}

// ============================================================================
// STORAGE ACCESS (For testing/debugging)
// ============================================================================

export function _getLectureStore() {
  return lectureStore;
}

export function _getLectureAccessStore() {
  return lectureAccessStore;
}
