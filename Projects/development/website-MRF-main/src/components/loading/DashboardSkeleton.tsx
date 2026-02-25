"use client";

/**
 * Dashboard Skeleton Loader - Phase 1 Task 1.3
 * Loading state for dashboard page with all key sections
 */

import {
  EnhancedSkeleton,
  SkeletonStatCard,
  SkeletonCard,
  SkeletonListItem,
} from "./EnhancedSkeleton";

export function DashboardSkeleton() {
  return (
    <div className="space-y-6 p-4 md:p-6">
      {/* Header with greeting */}
      <div className="space-y-2">
        <EnhancedSkeleton variant="text" width="200px" height="32px" />
        <EnhancedSkeleton variant="text" width="300px" height="16px" />
      </div>

      {/* Stats Cards Row (3 cards) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <SkeletonStatCard />
        <SkeletonStatCard />
        <SkeletonStatCard />
      </div>

      {/* Current Lesson Card */}
      <div className="space-y-3">
        <EnhancedSkeleton variant="text" width="120px" height="20px" />
        <SkeletonCard hasImage hasTitle hasDescription hasActions />
      </div>

      {/* Daily Quests Section */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <EnhancedSkeleton variant="text" width="120px" height="20px" />
          <EnhancedSkeleton variant="text" width="60px" height="16px" />
        </div>
        <div className="space-y-2">
          <SkeletonListItem hasAvatar={false} hasSecondaryText hasTrailing />
          <SkeletonListItem hasAvatar={false} hasSecondaryText hasTrailing />
          <SkeletonListItem hasAvatar={false} hasSecondaryText hasTrailing />
          <SkeletonListItem hasAvatar={false} hasSecondaryText hasTrailing />
        </div>
      </div>

      {/* Quick Access Grid (4 items) */}
      <div className="space-y-3">
        <EnhancedSkeleton variant="text" width="120px" height="20px" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="p-4 rounded-xl border border-border bg-card space-y-2"
            >
              <EnhancedSkeleton variant="circular" width="48px" height="48px" />
              <EnhancedSkeleton variant="text" width="80%" height="16px" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default DashboardSkeleton;
