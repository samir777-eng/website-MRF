"use client";

/**
 * Store Tabs Skeleton Loader - Phase 1 Week 1 Day 2-3
 * Loading state for store page with tabs and product grids
 */

import { EnhancedSkeleton, SkeletonCard } from "../EnhancedSkeleton";

export function StoreTabsSkeleton() {
  return (
    <div className="min-h-screen bg-background" dir="rtl">
      <div className="container mx-auto px-4 md:px-6 py-6 md:py-8 space-y-6">
        {/* Page Header */}
        <div className="space-y-4">
          <EnhancedSkeleton variant="text" width="200px" height="40px" />
          <EnhancedSkeleton variant="text" width="400px" height="20px" />
        </div>

        {/* Balance Card */}
        <div className="p-6 rounded-xl border border-border bg-gradient-to-br from-primary/5 to-primary/10">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <EnhancedSkeleton variant="text" width="100px" height="16px" />
              <EnhancedSkeleton variant="text" width="150px" height="32px" />
            </div>
            <EnhancedSkeleton
              variant="rectangular"
              width="120px"
              height="44px"
              className="rounded-lg"
            />
          </div>
        </div>

        {/* Tabs Navigation */}
        <div className="flex gap-2 border-b border-border overflow-x-auto">
          {Array.from({ length: 5 }).map((_, i) => (
            <EnhancedSkeleton
              key={i}
              variant="rectangular"
              width="120px"
              height="44px"
              className="rounded-t-lg"
            />
          ))}
        </div>

        {/* Filters & Search */}
        <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between">
          <div className="flex gap-3 flex-1">
            <EnhancedSkeleton
              variant="rectangular"
              width="100%"
              height="44px"
              className="rounded-lg max-w-md"
            />
            <EnhancedSkeleton
              variant="rectangular"
              width="120px"
              height="44px"
              className="rounded-lg"
            />
          </div>
          <EnhancedSkeleton
            variant="rectangular"
            width="150px"
            height="44px"
            className="rounded-lg"
          />
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 9 }).map((_, i) => (
            <div key={i} className="p-6 rounded-xl border border-border bg-card space-y-4">
              {/* Product Image */}
              <EnhancedSkeleton
                variant="rectangular"
                width="100%"
                height="200px"
                className="rounded-lg"
              />

              {/* Product Badge */}
              <EnhancedSkeleton
                variant="rectangular"
                width="80px"
                height="24px"
                className="rounded-full"
              />

              {/* Product Title */}
              <EnhancedSkeleton variant="text" width="80%" height="24px" />

              {/* Product Description */}
              <div className="space-y-2">
                <EnhancedSkeleton variant="text" width="100%" height="16px" />
                <EnhancedSkeleton variant="text" width="90%" height="16px" />
              </div>

              {/* Product Features */}
              <div className="space-y-2">
                {Array.from({ length: 3 }).map((_, j) => (
                  <div key={j} className="flex items-center gap-2">
                    <EnhancedSkeleton variant="circular" width="16px" height="16px" />
                    <EnhancedSkeleton variant="text" width="70%" height="14px" />
                  </div>
                ))}
              </div>

              {/* Price & Button */}
              <div className="flex items-center justify-between pt-4 border-t border-border">
                <div className="space-y-1">
                  <EnhancedSkeleton variant="text" width="80px" height="28px" />
                  <EnhancedSkeleton variant="text" width="60px" height="14px" />
                </div>
                <EnhancedSkeleton
                  variant="rectangular"
                  width="100px"
                  height="44px"
                  className="rounded-lg"
                />
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-center gap-2 pt-8">
          {Array.from({ length: 5 }).map((_, i) => (
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
    </div>
  );
}

export default StoreTabsSkeleton;
