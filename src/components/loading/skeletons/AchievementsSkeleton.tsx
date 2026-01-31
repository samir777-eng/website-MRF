"use client";

/**
 * Achievements Skeleton Loader - Phase 1 Week 1 Day 2-3
 * Loading state for achievements page with categories and cards
 */

import { EnhancedSkeleton } from "../EnhancedSkeleton";

export function AchievementsSkeleton() {
  return (
    <div className="min-h-screen bg-background" dir="rtl">
      <div className="container mx-auto px-4 md:px-6 py-6 md:py-8 space-y-8">
        {/* Page Header */}
        <div className="text-center space-y-4">
          <EnhancedSkeleton
            variant="text"
            width="200px"
            height="40px"
            className="mx-auto"
          />
          <EnhancedSkeleton
            variant="text"
            width="350px"
            height="20px"
            className="mx-auto"
          />
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="p-6 rounded-xl border border-border bg-card text-center space-y-3"
            >
              <EnhancedSkeleton
                variant="circular"
                width="56px"
                height="56px"
                className="mx-auto"
              />
              <EnhancedSkeleton
                variant="text"
                width="70%"
                height="28px"
                className="mx-auto"
              />
              <EnhancedSkeleton
                variant="text"
                width="80%"
                height="16px"
                className="mx-auto"
              />
            </div>
          ))}
        </div>

        {/* Progress Bar */}
        <div className="max-w-4xl mx-auto p-6 rounded-xl border border-border bg-gradient-to-br from-primary/5 to-primary/10">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <EnhancedSkeleton variant="text" width="200px" height="20px" />
              <EnhancedSkeleton variant="text" width="80px" height="20px" />
            </div>
            <EnhancedSkeleton
              variant="rectangular"
              width="100%"
              height="12px"
              className="rounded-full"
            />
            <div className="flex justify-between">
              <EnhancedSkeleton variant="text" width="150px" height="14px" />
              <EnhancedSkeleton variant="text" width="100px" height="14px" />
            </div>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 flex-wrap justify-center">
          {Array.from({ length: 5 }).map((_, i) => (
            <EnhancedSkeleton
              key={i}
              variant="rectangular"
              width="120px"
              height="40px"
              className="rounded-lg"
            />
          ))}
        </div>

        {/* Achievement Categories */}
        {Array.from({ length: 3 }).map((_, categoryIdx) => (
          <div key={categoryIdx} className="space-y-6">
            {/* Category Header */}
            <div className="flex items-center gap-4">
              <EnhancedSkeleton
                variant="rectangular"
                width="48px"
                height="48px"
                className="rounded-xl"
              />
              <div className="flex-1 space-y-2">
                <EnhancedSkeleton variant="text" width="200px" height="24px" />
                <EnhancedSkeleton variant="text" width="300px" height="16px" />
              </div>
              <EnhancedSkeleton variant="text" width="80px" height="20px" />
            </div>

            {/* Achievement Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className="group p-6 rounded-xl border border-border bg-card hover:shadow-xl transition-all"
                >
                  {/* Badge */}
                  <div className="relative mb-6">
                    <EnhancedSkeleton
                      variant="circular"
                      width="100px"
                      height="100px"
                      className="mx-auto"
                    />

                    {/* Rarity Badge */}
                    <div className="absolute top-0 right-1/2 translate-x-1/2 -translate-y-2">
                      <EnhancedSkeleton
                        variant="rectangular"
                        width="60px"
                        height="24px"
                        className="rounded-full"
                      />
                    </div>

                    {/* Progress Ring (for locked achievements) */}
                    {i % 3 === 0 && (
                      <div className="absolute bottom-0 right-1/2 translate-x-1/2 translate-y-2">
                        <EnhancedSkeleton
                          variant="circular"
                          width="40px"
                          height="40px"
                        />
                      </div>
                    )}
                  </div>

                  {/* Achievement Info */}
                  <div className="text-center space-y-3">
                    <EnhancedSkeleton
                      variant="text"
                      width="80%"
                      height="24px"
                      className="mx-auto"
                    />
                    <div className="space-y-1">
                      <EnhancedSkeleton
                        variant="text"
                        width="100%"
                        height="16px"
                      />
                      <EnhancedSkeleton
                        variant="text"
                        width="90%"
                        height="16px"
                        className="mx-auto"
                      />
                    </div>

                    {/* Reward */}
                    <div className="flex items-center justify-center gap-2 pt-2">
                      <EnhancedSkeleton
                        variant="circular"
                        width="24px"
                        height="24px"
                      />
                      <EnhancedSkeleton
                        variant="text"
                        width="80px"
                        height="20px"
                      />
                    </div>

                    {/* Progress (for in-progress achievements) */}
                    {i % 3 === 0 && (
                      <div className="pt-3 space-y-2">
                        <EnhancedSkeleton
                          variant="rectangular"
                          width="100%"
                          height="8px"
                          className="rounded-full"
                        />
                        <EnhancedSkeleton
                          variant="text"
                          width="60px"
                          height="14px"
                          className="mx-auto"
                        />
                      </div>
                    )}

                    {/* Unlocked Date (for completed achievements) */}
                    {i % 3 === 1 && (
                      <div className="pt-3 flex items-center justify-center gap-2">
                        <EnhancedSkeleton
                          variant="circular"
                          width="16px"
                          height="16px"
                        />
                        <EnhancedSkeleton
                          variant="text"
                          width="100px"
                          height="14px"
                        />
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}

        {/* Recent Achievements */}
        <div className="max-w-4xl mx-auto space-y-4">
          <EnhancedSkeleton variant="text" width="200px" height="28px" />

          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="p-4 rounded-xl border border-border bg-card flex items-center gap-4"
              >
                <EnhancedSkeleton
                  variant="circular"
                  width="60px"
                  height="60px"
                />
                <div className="flex-1 space-y-2">
                  <EnhancedSkeleton variant="text" width="60%" height="20px" />
                  <EnhancedSkeleton variant="text" width="80%" height="16px" />
                </div>
                <EnhancedSkeleton variant="text" width="80px" height="16px" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AchievementsSkeleton;
