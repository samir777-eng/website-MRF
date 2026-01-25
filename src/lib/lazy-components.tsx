/**
 * Lazy Loading Configuration for Heavy Components
 * Improves initial page load performance by code-splitting heavy components
 *
 * Uses Next.js dynamic imports with proper Suspense boundaries
 */

import {
  AchievementCardSkeleton,
  LeaderboardDisplaySkeleton,
  ProgressChartSkeleton,
  QuestDisplaySkeleton,
  QuizEngineSkeleton,
  RewardsSystemSkeleton,
  StreakDisplaySkeleton,
  VideoPlayerSkeleton,
  XPDisplaySkeleton,
} from "@/components/ui/skeleton-loaders";
import dynamic from "next/dynamic";
import React, { ComponentType, Suspense } from "react";

// Loading component for lazy-loaded components (fallback)
const LoadingSpinner = () => (
  <div
    className="flex items-center justify-center p-8"
    role="status"
    aria-label="جاري التحميل"
  >
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
    <span className="sr-only">جاري التحميل...</span>
  </div>
);

// ============================================
// GAMIFICATION COMPONENTS (Heavy - animations)
// ============================================

export const LazyAchievementDisplay = dynamic(
  () => import("@/components/gamification/AchievementDisplay"),
  {
    loading: () => <AchievementCardSkeleton />,
    ssr: false,
  }
);

export const LazyXPDisplay = dynamic(
  () => import("@/components/gamification/XPDisplay"),
  {
    loading: () => <XPDisplaySkeleton />,
    ssr: false,
  }
);

export const LazyStreakDisplay = dynamic(
  () => import("@/components/gamification/StreakDisplay"),
  {
    loading: () => <StreakDisplaySkeleton />,
    ssr: false,
  }
);

export const LazyQuestDisplay = dynamic(
  () => import("@/components/gamification/QuestDisplay"),
  {
    loading: () => <QuestDisplaySkeleton />,
    ssr: false,
  }
);

export const LazyLeaderboardDisplay = dynamic(
  () => import("@/components/gamification/LeaderboardDisplay"),
  {
    loading: () => <LeaderboardDisplaySkeleton />,
    ssr: false,
  }
);

export const LazyRewardsSystem = dynamic(
  () => import("@/components/gamification/RewardsSystem"),
  {
    loading: () => <RewardsSystemSkeleton />,
    ssr: false,
  }
);

// ============================================
// VIDEO COMPONENTS (Heavy - video player)
// ============================================

export const LazyVideoPlayer = dynamic(
  () =>
    import("@/components/video/video-player").then((mod) => ({
      default: mod.VideoPlayer,
    })),
  {
    loading: () => <VideoPlayerSkeleton />,
    ssr: false,
  }
);

export const LazyInteractiveVideoPlayer = dynamic(
  () => import("@/components/video/InteractiveVideoPlayer"),
  {
    loading: () => <VideoPlayerSkeleton />,
    ssr: false,
  }
);

// ============================================
// QUIZ COMPONENTS (Heavy - complex state)
// ============================================

export const LazyQuizEngine = dynamic(
  () =>
    import("@/components/quiz/quiz-engine").then((mod) => ({
      default: mod.QuizEngine,
    })),
  {
    loading: () => <QuizEngineSkeleton />,
    ssr: false,
  }
);

// ============================================
// DASHBOARD COMPONENTS (Heavy - charts)
// ============================================

export const LazyProgressChart = dynamic(
  () =>
    import("@/components/dashboard/ProgressChart").then((mod) => ({
      default: mod.ProgressChart,
    })),
  {
    loading: () => <ProgressChartSkeleton />,
    ssr: false,
  }
);

export const LazyAnimatedStats = dynamic(
  () =>
    import("@/components/dashboard/AnimatedStats").then((mod) => ({
      default: mod.AnimatedStats,
    })),
  {
    loading: () => <LoadingSpinner />,
    ssr: false,
  }
);

export const LazyPerformanceBreakdown = dynamic(
  () =>
    import("@/components/dashboard/PerformanceBreakdown").then((mod) => ({
      default: mod.PerformanceBreakdown,
    })),
  {
    loading: () => <LoadingSpinner />,
    ssr: false,
  }
);

// ============================================
// LEARNING COMPONENTS (Heavy - algorithms)
// ============================================

export const LazyAdaptiveLearningDisplay = dynamic(
  () => import("@/components/learning/AdaptiveLearningDisplay"),
  {
    loading: () => <LoadingSpinner />,
    ssr: false,
  }
);

export const LazySpacedRepetitionDisplay = dynamic(
  () => import("@/components/learning/SpacedRepetitionDisplay"),
  {
    loading: () => <LoadingSpinner />,
    ssr: false,
  }
);

// ============================================
// UTILITY FUNCTIONS
// ============================================

// Generic lazy loader with custom options
export function lazyLoad<T extends ComponentType<unknown>>(
  importFunc: () => Promise<{ default: T }>,
  options?: {
    loading?: () => React.ReactElement | null;
    ssr?: boolean;
  }
) {
  return dynamic(importFunc, {
    loading: options?.loading || (() => <LoadingSpinner />),
    ssr: options?.ssr ?? true,
  });
}

// Preload function for critical components
export function preloadComponent(importFunc: () => Promise<unknown>) {
  if (typeof window !== "undefined") {
    // Preload on idle
    if ("requestIdleCallback" in window) {
      requestIdleCallback(() => importFunc());
    } else {
      // Fallback for browsers without requestIdleCallback
      setTimeout(() => importFunc(), 1);
    }
  }
}

// Suspense wrapper with consistent fallback
export function withSuspense<P extends object>(
  Component: React.ComponentType<P>,
  fallback?: React.ReactNode
) {
  return function SuspenseWrapper(props: P) {
    return (
      <Suspense fallback={fallback || <LoadingSpinner />}>
        <Component {...props} />
      </Suspense>
    );
  };
}

// Preload functions for specific component groups
export const preloadGamification = () => {
  preloadComponent(
    () => import("@/components/gamification/AchievementDisplay")
  );
  preloadComponent(() => import("@/components/gamification/XPDisplay"));
  preloadComponent(() => import("@/components/gamification/StreakDisplay"));
};

export const preloadDashboard = () => {
  preloadComponent(() => import("@/components/dashboard/ProgressChart"));
  preloadComponent(() => import("@/components/dashboard/AnimatedStats"));
  preloadGamification();
};

export const preloadQuiz = () => {
  preloadComponent(() => import("@/components/quiz/quiz-engine"));
};

export const preloadVideo = () => {
  preloadComponent(() => import("@/components/video/video-player"));
};
