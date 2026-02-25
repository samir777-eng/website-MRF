/**
 * Error Boundary Components
 *
 * This module exports all error boundary related components:
 * - ErrorBoundary: The main error boundary class component
 * - withErrorBoundary: HOC for wrapping functional components
 * - useErrorHandler: Hook for manual error reporting
 * - Section-specific error boundaries for different parts of the app
 */

export {
  ErrorBoundary,
  withErrorBoundary,
  useErrorHandler,
} from "./error-boundary";

export {
  SectionErrorBoundary,
  HeaderErrorBoundary,
  FooterErrorBoundary,
  LessonErrorBoundary,
  QuizErrorBoundary,
  DashboardErrorBoundary,
  VideoPlayerErrorBoundary,
  GamificationErrorBoundary,
  ExerciseErrorBoundary,
  LeaderboardErrorBoundary,
  AchievementErrorBoundary,
  NotesErrorBoundary,
  ProgressErrorBoundary,
  FormErrorBoundary,
  SearchErrorBoundary,
} from "./section-error-boundary";

// Default export for convenience
export { default } from "./error-boundary";
