"use client";

/**
 * Login Skeleton Loader - Phase 1 Week 1 Day 1-2
 * Loading state for login page with form layout
 */

import { EnhancedSkeleton } from "../EnhancedSkeleton";

export function LoginSkeleton() {
  return (
    <div
      className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-background via-background to-primary/5"
      dir="rtl"
    >
      <div className="w-full max-w-md">
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
            width="250px"
            height="20px"
            className="mx-auto"
          />
        </div>

        {/* Card Container */}
        <div className="p-8 rounded-2xl border border-border bg-card shadow-lg space-y-6">
          {/* Form Title */}
          <div className="space-y-2">
            <EnhancedSkeleton variant="text" width="120px" height="28px" />
            <EnhancedSkeleton variant="text" width="100%" height="16px" />
          </div>

          {/* Email/Phone Input */}
          <div className="space-y-2">
            <EnhancedSkeleton variant="text" width="150px" height="16px" />
            <EnhancedSkeleton
              variant="rectangular"
              width="100%"
              height="48px"
              className="rounded-lg"
            />
          </div>

          {/* Password Input */}
          <div className="space-y-2">
            <EnhancedSkeleton variant="text" width="100px" height="16px" />
            <EnhancedSkeleton
              variant="rectangular"
              width="100%"
              height="48px"
              className="rounded-lg"
            />
          </div>

          {/* Remember Me & Forgot Password Row */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <EnhancedSkeleton
                variant="rectangular"
                width="20px"
                height="20px"
                className="rounded"
              />
              <EnhancedSkeleton variant="text" width="80px" height="16px" />
            </div>
            <EnhancedSkeleton variant="text" width="120px" height="16px" />
          </div>

          {/* Submit Button */}
          <EnhancedSkeleton
            variant="rectangular"
            width="100%"
            height="48px"
            className="rounded-lg"
          />

          {/* Divider */}
          <div className="flex items-center gap-4 my-6">
            <EnhancedSkeleton variant="text" width="100%" height="1px" />
            <EnhancedSkeleton variant="text" width="40px" height="16px" />
            <EnhancedSkeleton variant="text" width="100%" height="1px" />
          </div>

          {/* Social Login Buttons */}
          <div className="space-y-3">
            <EnhancedSkeleton
              variant="rectangular"
              width="100%"
              height="48px"
              className="rounded-lg"
            />
            <EnhancedSkeleton
              variant="rectangular"
              width="100%"
              height="48px"
              className="rounded-lg"
            />
          </div>
        </div>

        {/* Sign Up Link */}
        <div className="text-center mt-6">
          <EnhancedSkeleton
            variant="text"
            width="250px"
            height="20px"
            className="mx-auto"
          />
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

export default LoginSkeleton;
