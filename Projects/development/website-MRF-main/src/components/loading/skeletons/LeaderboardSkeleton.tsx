"use client";

/**
 * Leaderboard Skeleton Loader - Phase 1 Week 1 Day 2-3
 * Loading state for leaderboard page with rankings
 */

import { EnhancedSkeleton } from "../EnhancedSkeleton";

export function LeaderboardSkeleton() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 md:px-6 py-6 md:py-8 space-y-8">
        {/* Page Header */}
        <div className="text-center space-y-4">
          <EnhancedSkeleton variant="text" width="200px" height="40px" className="mx-auto" />
          <EnhancedSkeleton variant="text" width="350px" height="20px" className="mx-auto" />
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 flex-wrap justify-center">
          {Array.from({ length: 4 }).map((_, i) => (
            <EnhancedSkeleton
              key={i}
              variant="rectangular"
              width="120px"
              height="44px"
              className="rounded-lg"
            />
          ))}
        </div>

        {/* Time Period Selector */}
        <div className="flex gap-3 justify-center">
          {Array.from({ length: 3 }).map((_, i) => (
            <EnhancedSkeleton
              key={i}
              variant="rectangular"
              width="100px"
              height="36px"
              className="rounded-lg"
            />
          ))}
        </div>

        {/* Top 3 Podium */}
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-3 gap-4 items-end">
            {/* 2nd Place */}
            <div className="space-y-4">
              <div className="p-6 rounded-xl border border-border bg-gradient-to-br from-muted to-muted/50 text-center space-y-4 h-[280px]">
                <EnhancedSkeleton
                  variant="circular"
                  width="80px"
                  height="80px"
                  className="mx-auto"
                />
                <EnhancedSkeleton variant="text" width="70%" height="20px" className="mx-auto" />
                <EnhancedSkeleton variant="text" width="80%" height="16px" className="mx-auto" />
                <div className="flex items-center justify-center gap-2">
                  <EnhancedSkeleton variant="circular" width="20px" height="20px" />
                  <EnhancedSkeleton variant="text" width="60px" height="24px" />
                </div>
              </div>
              <EnhancedSkeleton
                variant="rectangular"
                width="60px"
                height="60px"
                className="mx-auto rounded-xl"
              />
            </div>

            {/* 1st Place */}
            <div className="space-y-4">
              <div className="p-8 rounded-xl border-2 border-yellow-500/30 bg-gradient-to-br from-yellow-500/10 to-yellow-600/10 text-center space-y-4 h-[320px]">
                <div className="relative">
                  <EnhancedSkeleton
                    variant="circular"
                    width="100px"
                    height="100px"
                    className="mx-auto"
                  />
                  <div className="absolute -top-2 -end-2">
                    <EnhancedSkeleton variant="circular" width="32px" height="32px" />
                  </div>
                </div>
                <EnhancedSkeleton variant="text" width="70%" height="24px" className="mx-auto" />
                <EnhancedSkeleton variant="text" width="80%" height="16px" className="mx-auto" />
                <div className="flex items-center justify-center gap-2">
                  <EnhancedSkeleton variant="circular" width="24px" height="24px" />
                  <EnhancedSkeleton variant="text" width="70px" height="28px" />
                </div>
              </div>
              <EnhancedSkeleton
                variant="rectangular"
                width="70px"
                height="70px"
                className="mx-auto rounded-xl"
              />
            </div>

            {/* 3rd Place */}
            <div className="space-y-4">
              <div className="p-6 rounded-xl border border-border bg-gradient-to-br from-muted to-muted/50 text-center space-y-4 h-[260px]">
                <EnhancedSkeleton
                  variant="circular"
                  width="70px"
                  height="70px"
                  className="mx-auto"
                />
                <EnhancedSkeleton variant="text" width="70%" height="20px" className="mx-auto" />
                <EnhancedSkeleton variant="text" width="80%" height="16px" className="mx-auto" />
                <div className="flex items-center justify-center gap-2">
                  <EnhancedSkeleton variant="circular" width="20px" height="20px" />
                  <EnhancedSkeleton variant="text" width="60px" height="24px" />
                </div>
              </div>
              <EnhancedSkeleton
                variant="rectangular"
                width="60px"
                height="60px"
                className="mx-auto rounded-xl"
              />
            </div>
          </div>
        </div>

        {/* Current User Position (if not in top 3) */}
        <div className="max-w-4xl mx-auto">
          <div className="p-6 rounded-xl border-2 border-primary/30 bg-primary/5">
            <div className="flex items-center gap-4">
              <EnhancedSkeleton
                variant="rectangular"
                width="48px"
                height="48px"
                className="rounded-lg"
              />
              <EnhancedSkeleton variant="circular" width="60px" height="60px" />
              <div className="flex-1 space-y-2">
                <EnhancedSkeleton variant="text" width="40%" height="20px" />
                <EnhancedSkeleton variant="text" width="30%" height="16px" />
              </div>
              <div className="text-end space-y-2">
                <EnhancedSkeleton variant="text" width="80px" height="28px" />
                <EnhancedSkeleton variant="text" width="60px" height="16px" />
              </div>
            </div>
          </div>
        </div>

        {/* Leaderboard List */}
        <div className="max-w-4xl mx-auto space-y-3">
          {Array.from({ length: 20 }).map((_, i) => (
            <div
              key={i}
              className={`p-4 rounded-xl border border-border bg-card hover:shadow-md transition-all ${
                i < 3 ? 'border-yellow-500/20' : ''
              }`}
            >
              <div className="flex items-center gap-4">
                {/* Rank */}
                <EnhancedSkeleton
                  variant="rectangular"
                  width="48px"
                  height="48px"
                  className="rounded-lg"
                />

                {/* Avatar */}
                <EnhancedSkeleton variant="circular" width="56px" height="56px" />

                {/* User Info */}
                <div className="flex-1 space-y-2">
                  <EnhancedSkeleton variant="text" width="50%" height="20px" />
                  <EnhancedSkeleton variant="text" width="40%" height="16px" />
                </div>

                {/* Stats */}
                <div className="hidden md:flex items-center gap-6">
                  <div className="text-center space-y-1">
                    <EnhancedSkeleton variant="text" width="60px" height="24px" className="mx-auto" />
                    <EnhancedSkeleton variant="text" width="40px" height="12px" className="mx-auto" />
                  </div>
                  <div className="text-center space-y-1">
                    <EnhancedSkeleton variant="text" width="60px" height="24px" className="mx-auto" />
                    <EnhancedSkeleton variant="text" width="40px" height="12px" className="mx-auto" />
                  </div>
                </div>

                {/* XP Score */}
                <div className="text-end space-y-1">
                  <EnhancedSkeleton variant="text" width="80px" height="28px" />
                  <EnhancedSkeleton variant="text" width="60px" height="14px" />
                </div>

                {/* Trend Indicator */}
                <EnhancedSkeleton
                  variant="rectangular"
                  width="32px"
                  height="32px"
                  className="rounded-lg"
                />
              </div>
            </div>
          ))}
        </div>

        {/* Load More */}
        <div className="flex justify-center pt-4">
          <EnhancedSkeleton
            variant="rectangular"
            width="150px"
            height="44px"
            className="rounded-lg"
          />
        </div>
      </div>
    </div>
  );
}

export default LeaderboardSkeleton;
