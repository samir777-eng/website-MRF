"use client";

/**
 * Settings Skeleton Loader - Phase 1 Week 1 Day 2-3
 * Loading state for settings page with tabs and sections
 */

import { EnhancedSkeleton } from "../EnhancedSkeleton";

export function SettingsSkeleton() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 md:px-6 py-6 md:py-8">
        <div className="max-w-5xl mx-auto space-y-6">
          {/* Page Header */}
          <div className="space-y-2">
            <EnhancedSkeleton variant="text" width="150px" height="36px" />
            <EnhancedSkeleton variant="text" width="300px" height="20px" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar Navigation */}
            <div className="lg:col-span-1 space-y-2">
              {Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className={`p-4 rounded-lg ${
                    i === 0 ? 'bg-primary/10 border border-primary/20' : 'bg-card border border-border'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <EnhancedSkeleton variant="circular" width="24px" height="24px" />
                    <EnhancedSkeleton variant="text" width="80px" height="18px" />
                  </div>
                </div>
              ))}
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3 space-y-6">
              {/* Profile Section */}
              <div className="p-6 rounded-xl border border-border bg-card space-y-6">
                <div className="flex items-center justify-between">
                  <EnhancedSkeleton variant="text" width="150px" height="24px" />
                  <EnhancedSkeleton
                    variant="rectangular"
                    width="80px"
                    height="36px"
                    className="rounded-lg"
                  />
                </div>

                {/* Avatar Upload */}
                <div className="flex items-center gap-6">
                  <EnhancedSkeleton variant="circular" width="100px" height="100px" />
                  <div className="flex-1 space-y-3">
                    <EnhancedSkeleton variant="text" width="200px" height="20px" />
                    <EnhancedSkeleton variant="text" width="100%" height="16px" />
                    <EnhancedSkeleton
                      variant="rectangular"
                      width="150px"
                      height="40px"
                      className="rounded-lg"
                    />
                  </div>
                </div>

                {/* Form Fields */}
                <div className="space-y-4 pt-4">
                  {/* Full Name */}
                  <div className="space-y-2">
                    <EnhancedSkeleton variant="text" width="100px" height="16px" />
                    <EnhancedSkeleton
                      variant="rectangular"
                      width="100%"
                      height="48px"
                      className="rounded-lg"
                    />
                  </div>

                  {/* Email & Phone Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <EnhancedSkeleton variant="text" width="80px" height="16px" />
                      <EnhancedSkeleton
                        variant="rectangular"
                        width="100%"
                        height="48px"
                        className="rounded-lg"
                      />
                    </div>
                    <div className="space-y-2">
                      <EnhancedSkeleton variant="text" width="80px" height="16px" />
                      <EnhancedSkeleton
                        variant="rectangular"
                        width="100%"
                        height="48px"
                        className="rounded-lg"
                      />
                    </div>
                  </div>

                  {/* Bio */}
                  <div className="space-y-2">
                    <EnhancedSkeleton variant="text" width="120px" height="16px" />
                    <EnhancedSkeleton
                      variant="rectangular"
                      width="100%"
                      height="96px"
                      className="rounded-lg"
                    />
                  </div>
                </div>
              </div>

              {/* Notifications Section */}
              <div className="p-6 rounded-xl border border-border bg-card space-y-6">
                <EnhancedSkeleton variant="text" width="150px" height="24px" />

                <div className="space-y-4">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <div
                      key={i}
                      className="flex items-start justify-between p-4 rounded-lg bg-muted/30"
                    >
                      <div className="flex-1 space-y-2">
                        <EnhancedSkeleton variant="text" width="70%" height="18px" />
                        <EnhancedSkeleton variant="text" width="90%" height="14px" />
                      </div>
                      <EnhancedSkeleton
                        variant="rectangular"
                        width="48px"
                        height="24px"
                        className="rounded-full"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Privacy Section */}
              <div className="p-6 rounded-xl border border-border bg-card space-y-6">
                <EnhancedSkeleton variant="text" width="150px" height="24px" />

                <div className="space-y-4">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="space-y-2">
                      <EnhancedSkeleton variant="text" width="200px" height="18px" />
                      <EnhancedSkeleton
                        variant="rectangular"
                        width="100%"
                        height="48px"
                        className="rounded-lg"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Security Section */}
              <div className="p-6 rounded-xl border border-border bg-card space-y-6">
                <EnhancedSkeleton variant="text" width="150px" height="24px" />

                <div className="space-y-4">
                  {/* Change Password */}
                  <div className="space-y-2">
                    <EnhancedSkeleton variant="text" width="150px" height="16px" />
                    <EnhancedSkeleton
                      variant="rectangular"
                      width="100%"
                      height="48px"
                      className="rounded-lg"
                    />
                  </div>

                  <div className="space-y-2">
                    <EnhancedSkeleton variant="text" width="150px" height="16px" />
                    <EnhancedSkeleton
                      variant="rectangular"
                      width="100%"
                      height="48px"
                      className="rounded-lg"
                    />
                  </div>

                  <EnhancedSkeleton
                    variant="rectangular"
                    width="180px"
                    height="44px"
                    className="rounded-lg"
                  />
                </div>
              </div>

              {/* Danger Zone */}
              <div className="p-6 rounded-xl border-2 border-destructive/20 bg-destructive/5 space-y-4">
                <EnhancedSkeleton variant="text" width="150px" height="24px" />
                <EnhancedSkeleton variant="text" width="100%" height="16px" />
                <EnhancedSkeleton variant="text" width="90%" height="16px" />
                <div className="flex gap-3 pt-2">
                  <EnhancedSkeleton
                    variant="rectangular"
                    width="150px"
                    height="44px"
                    className="rounded-lg"
                  />
                  <EnhancedSkeleton
                    variant="rectangular"
                    width="150px"
                    height="44px"
                    className="rounded-lg"
                  />
                </div>
              </div>

              {/* Save Button */}
              <div className="flex justify-end gap-3 pt-4">
                <EnhancedSkeleton
                  variant="rectangular"
                  width="100px"
                  height="48px"
                  className="rounded-lg"
                />
                <EnhancedSkeleton
                  variant="rectangular"
                  width="150px"
                  height="48px"
                  className="rounded-lg"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SettingsSkeleton;
