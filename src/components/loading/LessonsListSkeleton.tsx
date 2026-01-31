"use client";

/**
 * Lessons List Skeleton Loader - Phase 1 Task 1.3
 * Loading state for lessons page with lesson cards
 */

import {
  EnhancedSkeleton,
  SkeletonListItem as _SkeletonListItem,
} from "./EnhancedSkeleton";

export function LessonsListSkeleton() {
  return (
    <div className="space-y-6 p-4 md:p-6" dir="rtl">
      {/* Header with Lecture Info */}
      <div className="p-6 rounded-xl border border-border bg-card space-y-3">
        <EnhancedSkeleton variant="text" width="250px" height="28px" />
        <EnhancedSkeleton variant="text" width="180px" height="16px" />
        <div className="flex items-center gap-4 pt-2">
          <EnhancedSkeleton variant="text" width="80px" height="20px" />
          <EnhancedSkeleton variant="text" width="100px" height="20px" />
          <EnhancedSkeleton variant="text" width="90px" height="20px" />
        </div>
      </div>

      {/* Progress Overview */}
      <div className="p-4 rounded-xl border border-border bg-card space-y-3">
        <div className="flex items-center justify-between">
          <EnhancedSkeleton variant="text" width="100px" height="16px" />
          <EnhancedSkeleton variant="text" width="60px" height="16px" />
        </div>
        <EnhancedSkeleton variant="rectangular" height="8px" width="100%" />
      </div>

      {/* Lessons List */}
      <div className="space-y-3">
        <EnhancedSkeleton variant="text" width="150px" height="20px" />

        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="flex items-center gap-4 p-4 rounded-xl border border-border bg-card"
          >
            {/* Lesson Number Circle */}
            <EnhancedSkeleton variant="circular" width="48px" height="48px" />

            {/* Lesson Info */}
            <div className="flex-1 space-y-2">
              <EnhancedSkeleton variant="text" width="70%" height="18px" />
              <EnhancedSkeleton variant="text" width="40%" height="14px" />
            </div>

            {/* Status/Duration */}
            <div className="flex flex-col items-end gap-2">
              <EnhancedSkeleton variant="text" width="60px" height="20px" />
              <EnhancedSkeleton variant="text" width="48px" height="14px" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default LessonsListSkeleton;
