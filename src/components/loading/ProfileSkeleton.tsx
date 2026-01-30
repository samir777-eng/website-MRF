"use client";

/**
 * Profile Page Skeleton Loader - Phase 1 Task 1.3
 * Loading state for user profile page
 */

import {
  EnhancedSkeleton,
  SkeletonAvatar,
  SkeletonStatCard,
  SkeletonButton,
  SkeletonListItem,
} from "./EnhancedSkeleton";

export function ProfileSkeleton() {
  return (
    <div className="space-y-6 p-4 md:p-6">
      {/* Profile Header Card */}
      <div className="p-6 rounded-xl border border-border bg-card">
        <div className="flex flex-col md:flex-row items-center gap-6">
          {/* Avatar */}
          <SkeletonAvatar size="xl" className="w-24 h-24" />

          {/* User Info */}
          <div className="flex-1 space-y-3 text-center md:text-end">
            <EnhancedSkeleton variant="text" width="180px" height="28px" className="mx-auto md:mx-0" />
            <EnhancedSkeleton variant="text" width="140px" height="16px" className="mx-auto md:mx-0" />
            
            {/* Stats Row */}
            <div className="flex gap-4 justify-center md:justify-start pt-2">
              <div className="text-center space-y-1">
                <EnhancedSkeleton variant="text" width="40px" height="24px" />
                <EnhancedSkeleton variant="text" width="60px" height="14px" />
              </div>
              <div className="text-center space-y-1">
                <EnhancedSkeleton variant="text" width="40px" height="24px" />
                <EnhancedSkeleton variant="text" width="60px" height="14px" />
              </div>
              <div className="text-center space-y-1">
                <EnhancedSkeleton variant="text" width="40px" height="24px" />
                <EnhancedSkeleton variant="text" width="60px" height="14px" />
              </div>
            </div>
          </div>

          {/* Edit Button */}
          <SkeletonButton size="md" className="w-28" />
        </div>
      </div>

      {/* Gamification Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <SkeletonStatCard />
        <SkeletonStatCard />
        <SkeletonStatCard />
        <SkeletonStatCard />
      </div>

      {/* Recent Activity Section */}
      <div className="space-y-3">
        <EnhancedSkeleton variant="text" width="150px" height="20px" />
        <div className="space-y-2">
          <SkeletonListItem hasAvatar hasSecondaryText hasTrailing />
          <SkeletonListItem hasAvatar hasSecondaryText hasTrailing />
          <SkeletonListItem hasAvatar hasSecondaryText hasTrailing />
          <SkeletonListItem hasAvatar hasSecondaryText hasTrailing />
        </div>
      </div>

      {/* Achievements Section */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <EnhancedSkeleton variant="text" width="120px" height="20px" />
          <EnhancedSkeleton variant="text" width="80px" height="16px" />
        </div>
        
        <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="flex flex-col items-center gap-2 p-3 rounded-lg border border-border bg-card">
              <EnhancedSkeleton variant="circular" width="48px" height="48px" />
              <EnhancedSkeleton variant="text" width="60px" height="14px" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ProfileSkeleton;
