"use client";

/**
 * Video Player Skeleton Loader - Phase 1 Week 1 Day 1-2
 * Loading state for video player page
 */

import { EnhancedSkeleton, SkeletonText } from "../EnhancedSkeleton";

export function VideoPlayerSkeleton() {
  return (
    <div className="min-h-screen bg-background" dir="rtl">
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-6 md:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Video Area */}
          <div className="lg:col-span-2 space-y-6">
            {/* Video Player */}
            <div className="relative aspect-video rounded-xl overflow-hidden bg-black/5">
              <EnhancedSkeleton
                variant="rectangular"
                width="100%"
                height="100%"
                className="absolute inset-0"
              />

              {/* Play Button Overlay */}
              <div className="absolute inset-0 flex items-center justify-center">
                <EnhancedSkeleton
                  variant="circular"
                  width="80px"
                  height="80px"
                />
              </div>

              {/* Video Controls */}
              <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
                <div className="space-y-3">
                  {/* Progress Bar */}
                  <EnhancedSkeleton
                    variant="rectangular"
                    width="100%"
                    height="6px"
                    className="rounded-full"
                  />

                  {/* Controls */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <EnhancedSkeleton
                        variant="circular"
                        width="40px"
                        height="40px"
                      />
                      <EnhancedSkeleton
                        variant="circular"
                        width="40px"
                        height="40px"
                      />
                      <EnhancedSkeleton
                        variant="text"
                        width="80px"
                        height="16px"
                      />
                    </div>
                    <div className="flex items-center gap-3">
                      <EnhancedSkeleton
                        variant="circular"
                        width="40px"
                        height="40px"
                      />
                      <EnhancedSkeleton
                        variant="circular"
                        width="40px"
                        height="40px"
                      />
                      <EnhancedSkeleton
                        variant="circular"
                        width="40px"
                        height="40px"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Video Info */}
            <div className="p-6 rounded-xl border border-border bg-card space-y-4">
              <div className="flex items-start justify-between">
                <div className="flex-1 space-y-3">
                  <EnhancedSkeleton variant="text" width="70%" height="32px" />
                  <EnhancedSkeleton variant="text" width="50%" height="20px" />
                </div>
                <EnhancedSkeleton
                  variant="rectangular"
                  width="120px"
                  height="44px"
                  className="rounded-lg"
                />
              </div>

              {/* Video Stats */}
              <div className="flex items-center gap-6 pt-2">
                <div className="flex items-center gap-2">
                  <EnhancedSkeleton
                    variant="circular"
                    width="20px"
                    height="20px"
                  />
                  <EnhancedSkeleton variant="text" width="80px" height="16px" />
                </div>
                <div className="flex items-center gap-2">
                  <EnhancedSkeleton
                    variant="circular"
                    width="20px"
                    height="20px"
                  />
                  <EnhancedSkeleton variant="text" width="60px" height="16px" />
                </div>
                <div className="flex items-center gap-2">
                  <EnhancedSkeleton
                    variant="circular"
                    width="20px"
                    height="20px"
                  />
                  <EnhancedSkeleton
                    variant="text"
                    width="100px"
                    height="16px"
                  />
                </div>
              </div>
            </div>

            {/* Video Description */}
            <div className="p-6 rounded-xl border border-border bg-card space-y-4">
              <EnhancedSkeleton variant="text" width="120px" height="24px" />
              <div className="space-y-2">
                <SkeletonText lines={4} />
              </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-4 border-b border-border">
              {Array.from({ length: 3 }).map((_, i) => (
                <EnhancedSkeleton
                  key={i}
                  variant="text"
                  width="100px"
                  height="40px"
                />
              ))}
            </div>

            {/* Notes/Comments Section */}
            <div className="space-y-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <div
                  key={i}
                  className="p-4 rounded-xl border border-border bg-card"
                >
                  <div className="flex items-start gap-3">
                    <EnhancedSkeleton
                      variant="circular"
                      width="40px"
                      height="40px"
                    />
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-3">
                        <EnhancedSkeleton
                          variant="text"
                          width="120px"
                          height="16px"
                        />
                        <EnhancedSkeleton
                          variant="text"
                          width="80px"
                          height="14px"
                        />
                      </div>
                      <SkeletonText lines={2} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Sidebar - Playlist */}
          <div className="space-y-4">
            <div className="p-4 rounded-xl border border-border bg-card">
              <div className="flex items-center justify-between mb-4">
                <EnhancedSkeleton variant="text" width="150px" height="24px" />
                <EnhancedSkeleton variant="text" width="60px" height="20px" />
              </div>

              {/* Playlist Items */}
              <div className="space-y-3">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div
                    key={i}
                    className={`p-3 rounded-lg ${
                      i === 0
                        ? "bg-primary/10 border border-primary/20"
                        : "bg-muted/20"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <EnhancedSkeleton
                        variant="rectangular"
                        width="80px"
                        height="60px"
                        className="rounded-lg"
                      />
                      <div className="flex-1 space-y-2">
                        <EnhancedSkeleton
                          variant="text"
                          width="100%"
                          height="16px"
                        />
                        <EnhancedSkeleton
                          variant="text"
                          width="70%"
                          height="14px"
                        />
                        <EnhancedSkeleton
                          variant="text"
                          width="50px"
                          height="12px"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Related Videos */}
            <div className="p-4 rounded-xl border border-border bg-card">
              <EnhancedSkeleton
                variant="text"
                width="120px"
                height="20px"
                className="mb-4"
              />

              <div className="space-y-3">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <EnhancedSkeleton
                      variant="rectangular"
                      width="80px"
                      height="60px"
                      className="rounded-lg"
                    />
                    <div className="flex-1 space-y-2">
                      <EnhancedSkeleton
                        variant="text"
                        width="100%"
                        height="16px"
                      />
                      <EnhancedSkeleton
                        variant="text"
                        width="60%"
                        height="14px"
                      />
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

export default VideoPlayerSkeleton;
