"use client";

/**
 * Books Grid Skeleton Loader - Phase 1 Week 1 Day 2-3
 * Loading state for books page with grid layout
 */

import { EnhancedSkeleton } from "../EnhancedSkeleton";

export function BooksGridSkeleton() {
  return (
    <div className="min-h-screen bg-background" dir="rtl">
      <div className="container mx-auto px-4 md:px-6 py-6 md:py-8 space-y-6">
        {/* Page Header */}
        <div className="space-y-4">
          <EnhancedSkeleton variant="text" width="150px" height="40px" />
          <EnhancedSkeleton variant="text" width="350px" height="20px" />
        </div>

        {/* Filters Bar */}
        <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between">
          <div className="flex gap-3 flex-wrap">
            {Array.from({ length: 4 }).map((_, i) => (
              <EnhancedSkeleton
                key={i}
                variant="rectangular"
                width="100px"
                height="40px"
                className="rounded-lg"
              />
            ))}
          </div>
          <div className="flex gap-3">
            <EnhancedSkeleton
              variant="rectangular"
              width="200px"
              height="40px"
              className="rounded-lg"
            />
            <EnhancedSkeleton
              variant="rectangular"
              width="120px"
              height="40px"
              className="rounded-lg"
            />
          </div>
        </div>

        {/* Books Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {Array.from({ length: 12 }).map((_, i) => (
            <div
              key={i}
              className="group rounded-xl border border-border bg-card overflow-hidden hover:shadow-xl transition-all"
            >
              {/* Book Cover */}
              <div className="relative aspect-[3/4] bg-muted">
                <EnhancedSkeleton
                  variant="rectangular"
                  width="100%"
                  height="100%"
                  className="absolute inset-0"
                />
                
                {/* Badge */}
                <div className="absolute top-3 right-3">
                  <EnhancedSkeleton
                    variant="rectangular"
                    width="60px"
                    height="24px"
                    className="rounded-full"
                  />
                </div>

                {/* Hover Overlay Actions */}
                <div className="absolute inset-0 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
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

              {/* Book Info */}
              <div className="p-4 space-y-3">
                {/* Title */}
                <EnhancedSkeleton variant="text" width="90%" height="20px" />

                {/* Author */}
                <EnhancedSkeleton variant="text" width="70%" height="16px" />

                {/* Rating */}
                <div className="flex items-center gap-2">
                  <div className="flex gap-1">
                    {Array.from({ length: 5 }).map((_, j) => (
                      <EnhancedSkeleton
                        key={j}
                        variant="circular"
                        width="16px"
                        height="16px"
                      />
                    ))}
                  </div>
                  <EnhancedSkeleton variant="text" width="40px" height="14px" />
                </div>

                {/* Price & Button */}
                <div className="flex items-center justify-between pt-2">
                  <div className="space-y-1">
                    <EnhancedSkeleton variant="text" width="70px" height="24px" />
                    <EnhancedSkeleton variant="text" width="50px" height="12px" />
                  </div>
                  <EnhancedSkeleton
                    variant="rectangular"
                    width="80px"
                    height="36px"
                    className="rounded-lg"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Load More / Pagination */}
        <div className="flex justify-center pt-8">
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

export default BooksGridSkeleton;
