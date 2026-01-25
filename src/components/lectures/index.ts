/**
 * Lecture Components
 *
 * Components for the Lives System lecture access control:
 * - LectureCard: Main card with access status, timer, lives, and actions
 * - LectureAccessTimer: Countdown timer for lecture access expiry
 * - LectureLifeDisplay: Hearts display for remaining lives
 * - PreQuizGate: Gate component for pre-quiz requirement
 * - ActivateLectureModal: Confirmation modal for lecture activation
 * - PurchaseLifeModal: Modal for purchasing additional lives
 * - RedeemLectureModal: Modal for redeeming lectures from bundles
 * - LectureProgressTracker: 4-step progress indicator (Pre-Quiz → Videos → Post-Quiz → Homework)
 * - LectureCompletionModal: Celebration modal with badge, XP bonus, and unlock message
 */

export { ActivateLectureModal } from "./activate-lecture-modal";
export { DetailedCountdown, LectureAccessTimer } from "./lecture-access-timer";
export { LectureCard } from "./lecture-card";
export { LectureCompletionModal } from "./lecture-completion-modal";
export { LectureLifeDisplay } from "./lecture-lives-display";
export { LectureProgressTracker } from "./lecture-progress-tracker";
export type { LectureProgress, LectureStep } from "./lecture-progress-tracker";
export { LivesPurchaseModal } from "./lives-purchase-modal";
export { PreQuizGate } from "./pre-quiz-gate";
export { PurchaseLifeModal } from "./purchase-life-modal";
export { RedeemLectureModal } from "./redeem-lecture-modal";
