"use client";

/**
 * Quiz Skeleton Loader - Phase 1 Week 1 Day 1-2
 * Loading state for quiz page with questions and options
 */

import { EnhancedSkeleton } from "../EnhancedSkeleton";

export function QuizSkeleton() {
  return (
    <div className="min-h-screen bg-background" dir="rtl">
      <div className="max-w-4xl mx-auto px-4 md:px-6 py-6 md:py-8 space-y-6">
        {/* Quiz Header */}
        <div className="p-6 rounded-xl border border-border bg-card space-y-4">
          <div className="flex items-center justify-between">
            <EnhancedSkeleton variant="text" width="200px" height="28px" />
            <EnhancedSkeleton variant="text" width="100px" height="24px" />
          </div>

          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <EnhancedSkeleton variant="text" width="100px" height="16px" />
              <EnhancedSkeleton variant="text" width="60px" height="16px" />
            </div>
            <EnhancedSkeleton
              variant="rectangular"
              width="100%"
              height="12px"
              className="rounded-full"
            />
          </div>

          {/* Quiz Info */}
          <div className="flex flex-wrap items-center gap-6 pt-2">
            <div className="flex items-center gap-2">
              <EnhancedSkeleton variant="circular" width="20px" height="20px" />
              <EnhancedSkeleton variant="text" width="100px" height="16px" />
            </div>
            <div className="flex items-center gap-2">
              <EnhancedSkeleton variant="circular" width="20px" height="20px" />
              <EnhancedSkeleton variant="text" width="80px" height="16px" />
            </div>
            <div className="flex items-center gap-2">
              <EnhancedSkeleton variant="circular" width="20px" height="20px" />
              <EnhancedSkeleton variant="text" width="120px" height="16px" />
            </div>
          </div>
        </div>

        {/* Question Card */}
        <div className="p-8 rounded-xl border border-border bg-card space-y-6">
          {/* Question Number & Type */}
          <div className="flex items-center justify-between">
            <EnhancedSkeleton variant="text" width="150px" height="20px" />
            <EnhancedSkeleton
              variant="rectangular"
              width="100px"
              height="28px"
              className="rounded-full"
            />
          </div>

          {/* Question Text */}
          <div className="space-y-3">
            <EnhancedSkeleton variant="text" width="100%" height="24px" />
            <EnhancedSkeleton variant="text" width="95%" height="24px" />
            <EnhancedSkeleton variant="text" width="60%" height="24px" />
          </div>

          {/* Question Image (Optional) */}
          <EnhancedSkeleton
            variant="rectangular"
            width="100%"
            height="200px"
            className="rounded-xl"
          />

          {/* Answer Options */}
          <div className="space-y-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="p-4 rounded-xl border-2 border-border bg-muted/20 hover:border-primary/30 transition-all cursor-pointer"
              >
                <div className="flex items-center gap-4">
                  <EnhancedSkeleton
                    variant="rectangular"
                    width="40px"
                    height="40px"
                    className="rounded-lg"
                  />
                  <div className="flex-1 space-y-2">
                    <EnhancedSkeleton variant="text" width="80%" height="20px" />
                    <EnhancedSkeleton variant="text" width="60%" height="16px" />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Navigation Buttons */}
          <div className="flex items-center justify-between pt-6 border-t border-border">
            <EnhancedSkeleton
              variant="rectangular"
              width="120px"
              height="44px"
              className="rounded-lg"
            />
            <div className="flex gap-3">
              <EnhancedSkeleton
                variant="rectangular"
                width="120px"
                height="44px"
                className="rounded-lg"
              />
              <EnhancedSkeleton
                variant="rectangular"
                width="120px"
                height="44px"
                className="rounded-lg"
              />
            </div>
          </div>
        </div>

        {/* Question Navigator */}
        <div className="p-6 rounded-xl border border-border bg-card space-y-4">
          <EnhancedSkeleton variant="text" width="150px" height="20px" />
          
          <div className="grid grid-cols-5 sm:grid-cols-8 md:grid-cols-10 gap-2">
            {Array.from({ length: 20 }).map((_, i) => (
              <EnhancedSkeleton
                key={i}
                variant="rectangular"
                width="40px"
                height="40px"
                className="rounded-lg"
              />
            ))}
          </div>
        </div>

        {/* Lives Display (if applicable) */}
        <div className="flex items-center justify-center gap-2">
          {Array.from({ length: 3 }).map((_, i) => (
            <EnhancedSkeleton
              key={i}
              variant="circular"
              width="32px"
              height="32px"
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default QuizSkeleton;
