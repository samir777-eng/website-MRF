"use client";

/**
 * Signup Skeleton Loader - Phase 1 Week 1 Day 1-2
 * Loading state for signup page with multi-step form
 */

import { EnhancedSkeleton } from "../EnhancedSkeleton";

export function SignupSkeleton() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-background via-background to-primary/5" dir="rtl">
      <div className="w-full max-w-2xl">
        {/* Logo/Header Area */}
        <div className="text-center mb-8 space-y-4">
          <EnhancedSkeleton
            variant="circular"
            width="80px"
            height="80px"
            className="mx-auto"
          />
          <EnhancedSkeleton
            variant="text"
            width="200px"
            height="32px"
            className="mx-auto"
          />
          <EnhancedSkeleton
            variant="text"
            width="300px"
            height="20px"
            className="mx-auto"
          />
        </div>

        {/* Progress Stepper */}
        <div className="mb-8">
          <div className="flex items-center justify-between max-w-md mx-auto">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-center flex-1">
                <EnhancedSkeleton variant="circular" width="40px" height="40px" />
                {i < 4 && (
                  <EnhancedSkeleton
                    variant="rectangular"
                    width="100%"
                    height="2px"
                    className="mx-2"
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Card Container */}
        <div className="p-8 rounded-2xl border border-border bg-card shadow-lg space-y-6">
          {/* Step Title */}
          <div className="space-y-2">
            <EnhancedSkeleton variant="text" width="180px" height="28px" />
            <EnhancedSkeleton variant="text" width="100%" height="16px" />
          </div>

          {/* Form Fields (varies by step) */}
          <div className="space-y-5">
            {/* Field 1 */}
            <div className="space-y-2">
              <EnhancedSkeleton variant="text" width="120px" height="16px" />
              <EnhancedSkeleton variant="rectangular" width="100%" height="48px" className="rounded-lg" />
            </div>

            {/* Field 2 */}
            <div className="space-y-2">
              <EnhancedSkeleton variant="text" width="100px" height="16px" />
              <EnhancedSkeleton variant="rectangular" width="100%" height="48px" className="rounded-lg" />
            </div>

            {/* Field 3 - Two columns */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <EnhancedSkeleton variant="text" width="80px" height="16px" />
                <EnhancedSkeleton variant="rectangular" width="100%" height="48px" className="rounded-lg" />
              </div>
              <div className="space-y-2">
                <EnhancedSkeleton variant="text" width="80px" height="16px" />
                <EnhancedSkeleton variant="rectangular" width="100%" height="48px" className="rounded-lg" />
              </div>
            </div>

            {/* Field 4 */}
            <div className="space-y-2">
              <EnhancedSkeleton variant="text" width="140px" height="16px" />
              <EnhancedSkeleton variant="rectangular" width="100%" height="48px" className="rounded-lg" />
            </div>

            {/* Avatar Upload Section */}
            <div className="space-y-3 pt-4">
              <EnhancedSkeleton variant="text" width="160px" height="16px" />
              <div className="flex items-center gap-4">
                <EnhancedSkeleton variant="circular" width="100px" height="100px" />
                <div className="flex-1 space-y-3">
                  <EnhancedSkeleton variant="rectangular" width="100%" height="40px" className="rounded-lg" />
                  <EnhancedSkeleton variant="text" width="80%" height="14px" />
                </div>
              </div>
            </div>

            {/* Terms Checkbox */}
            <div className="flex items-start gap-2 pt-2">
              <EnhancedSkeleton variant="rectangular" width="20px" height="20px" className="rounded mt-1" />
              <div className="flex-1 space-y-1">
                <EnhancedSkeleton variant="text" width="100%" height="16px" />
                <EnhancedSkeleton variant="text" width="60%" height="16px" />
              </div>
            </div>
          </div>

          {/* Navigation Buttons */}
          <div className="flex gap-4 pt-6">
            <EnhancedSkeleton variant="rectangular" width="120px" height="48px" className="rounded-lg" />
            <EnhancedSkeleton variant="rectangular" width="100%" height="48px" className="rounded-lg" />
          </div>
        </div>

        {/* Login Link */}
        <div className="text-center mt-6">
          <EnhancedSkeleton variant="text" width="250px" height="20px" className="mx-auto" />
        </div>

        {/* Quick Links */}
        <div className="flex justify-center gap-4 mt-8">
          <EnhancedSkeleton variant="text" width="80px" height="16px" />
          <EnhancedSkeleton variant="text" width="80px" height="16px" />
          <EnhancedSkeleton variant="text" width="80px" height="16px" />
        </div>
      </div>
    </div>
  );
}

export default SignupSkeleton;
