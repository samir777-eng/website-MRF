"use client";

/**
 * Lecture Detail Skeleton Loader - Phase 1 Week 1 Day 1-2
 * Loading state for lecture detail page with progress tracker and steps
 */

import { EnhancedSkeleton, SkeletonText } from "../EnhancedSkeleton";

export function LectureDetailSkeleton() {
  return (
    <div className="min-h-screen bg-background" dir="rtl">
      <div className="max-w-5xl mx-auto px-4 md:px-6 py-6 md:py-8 space-y-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2">
          <EnhancedSkeleton variant="text" width="80px" height="16px" />
          <EnhancedSkeleton variant="text" width="20px" height="16px" />
          <EnhancedSkeleton variant="text" width="120px" height="16px" />
        </div>

        {/* Lecture Header */}
        <div className="space-y-4">
          <EnhancedSkeleton variant="text" width="150px" height="24px" />
          <EnhancedSkeleton variant="text" width="80%" height="48px" />
          <div className="flex items-center gap-6">
            <EnhancedSkeleton variant="text" width="120px" height="20px" />
            <EnhancedSkeleton variant="text" width="100px" height="20px" />
            <EnhancedSkeleton variant="text" width="100px" height="20px" />
          </div>
        </div>

        {/* Description */}
        <div className="space-y-3">
          <SkeletonText lines={3} />
        </div>

        {/* Progress Tracker Card */}
        <div className="p-6 rounded-xl border border-border bg-card space-y-6">
          <div className="flex items-center justify-between">
            <EnhancedSkeleton variant="text" width="150px" height="24px" />
            <EnhancedSkeleton variant="text" width="80px" height="20px" />
          </div>

          {/* Progress Bar */}
          <div className="space-y-2">
            <EnhancedSkeleton variant="rectangular" width="100%" height="12px" className="rounded-full" />
            <div className="flex justify-between">
              <EnhancedSkeleton variant="text" width="100px" height="14px" />
              <EnhancedSkeleton variant="text" width="60px" height="14px" />
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="text-center space-y-2">
                <EnhancedSkeleton variant="text" width="60%" height="32px" className="mx-auto" />
                <EnhancedSkeleton variant="text" width="80%" height="14px" className="mx-auto" />
              </div>
            ))}
          </div>
        </div>

        {/* Tabs Navigation */}
        <div className="flex gap-4 border-b border-border">
          {Array.from({ length: 4 }).map((_, i) => (
            <EnhancedSkeleton
              key={i}
              variant="text"
              width="100px"
              height="40px"
            />
          ))}
        </div>

        {/* Lecture Steps */}
        <div className="space-y-4">
          <EnhancedSkeleton variant="text" width="150px" height="28px" />
          
          {/* Step Cards */}
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="p-6 rounded-xl border border-border bg-card hover:shadow-lg transition-all"
            >
              <div className="flex items-start gap-4">
                {/* Step Number */}
                <EnhancedSkeleton
                  variant="rectangular"
                  width="48px"
                  height="48px"
                  className="rounded-xl"
                />

                {/* Content */}
                <div className="flex-1 space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 space-y-2">
                      <EnhancedSkeleton variant="text" width="30%" height="20px" />
                      <EnhancedSkeleton variant="text" width="60%" height="24px" />
                    </div>
                    <EnhancedSkeleton
                      variant="rectangular"
                      width="32px"
                      height="32px"
                      className="rounded-full"
                    />
                  </div>

                  {/* Description */}
                  <div className="space-y-2">
                    <EnhancedSkeleton variant="text" width="100%" height="16px" />
                    <EnhancedSkeleton variant="text" width="85%" height="16px" />
                  </div>

                  {/* Meta Info */}
                  <div className="flex items-center gap-4 pt-2">
                    <div className="flex items-center gap-2">
                      <EnhancedSkeleton variant="circular" width="20px" height="20px" />
                      <EnhancedSkeleton variant="text" width="60px" height="16px" />
                    </div>
                    <div className="flex items-center gap-2">
                      <EnhancedSkeleton variant="circular" width="20px" height="20px" />
                      <EnhancedSkeleton variant="text" width="80px" height="16px" />
                    </div>
                  </div>

                  {/* Action Button */}
                  <EnhancedSkeleton
                    variant="rectangular"
                    width="120px"
                    height="40px"
                    className="rounded-lg"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Sidebar Info (Desktop Only) */}
        <div className="hidden lg:block">
          <div className="sticky top-24 space-y-6">
            {/* Quick Stats Card */}
            <div className="p-6 rounded-xl border border-border bg-card space-y-4">
              <EnhancedSkeleton variant="text" width="120px" height="20px" />
              <div className="space-y-3">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <EnhancedSkeleton variant="text" width="100px" height="16px" />
                    <EnhancedSkeleton variant="text" width="60px" height="16px" />
                  </div>
                ))}
              </div>
            </div>

            {/* Related Lectures */}
            <div className="p-6 rounded-xl border border-border bg-card space-y-4">
              <EnhancedSkeleton variant="text" width="150px" height="20px" />
              <div className="space-y-3">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <EnhancedSkeleton
                      variant="rectangular"
                      width="60px"
                      height="60px"
                      className="rounded-lg"
                    />
                    <div className="flex-1 space-y-2">
                      <EnhancedSkeleton variant="text" width="100%" height="16px" />
                      <EnhancedSkeleton variant="text" width="70%" height="14px" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LectureDetailSkeleton;
