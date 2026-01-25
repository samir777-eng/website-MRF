"use client";

/**
 * Lectures List Skeleton Loader - Phase 1 Task 1.3
 * Loading state for lectures page with filters and cards grid
 */

import { EnhancedSkeleton, SkeletonCard, SkeletonButton } from "./EnhancedSkeleton";

export function LecturesListSkeleton() {
  return (
    <div className="space-y-6 p-4 md:p-6" dir="rtl">
      {/* Header */}
      <div className="space-y-2">
        <EnhancedSkeleton variant="text" width="200px" height="32px" />
        <EnhancedSkeleton variant="text" width="300px" height="16px" />
      </div>

      {/* Filter Buttons Row */}
      <div className="flex flex-wrap gap-2">
        <SkeletonButton size="sm" className="w-20" />
        <SkeletonButton size="sm" className="w-24" />
        <SkeletonButton size="sm" className="w-28" />
        <SkeletonButton size="sm" className="w-20" />
        <SkeletonButton size="sm" className="w-24" />
      </div>

      {/* Search and Sort */}
      <div className="flex gap-3">
        <div className="flex-1">
          <EnhancedSkeleton variant="rectangular" height="44px" width="100%" />
        </div>
        <SkeletonButton size="md" className="w-32" />
      </div>

      {/* Lecture Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <SkeletonCard
            key={i}
            hasImage
            hasTitle
            hasDescription
            hasActions
          />
        ))}
      </div>

      {/* Load More Button */}
      <div className="flex justify-center pt-4">
        <SkeletonButton size="lg" className="w-40" />
      </div>
    </div>
  );
}

export default LecturesListSkeleton;
