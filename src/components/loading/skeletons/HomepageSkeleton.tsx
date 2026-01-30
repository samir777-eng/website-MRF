"use client";

/**
 * Homepage Skeleton Loader - Phase 1 Week 1 Day 1-2
 * Loading state for the homepage with hero, stats, and sections
 */

import {
  EnhancedSkeleton,
  SkeletonCard,
  SkeletonText,
} from "../EnhancedSkeleton";

export function HomepageSkeleton() {
  return (
    <div className="min-h-screen">
      {/* Hero Section Skeleton */}
      <div className="container mx-auto px-6 py-16 md:py-24">
        <div className="text-center max-w-4xl mx-auto space-y-6">
          {/* Hero Title */}
          <EnhancedSkeleton
            variant="text"
            width="70%"
            height="64px"
            className="mx-auto"
          />
          
          {/* Hero Subtitle */}
          <EnhancedSkeleton
            variant="text"
            width="85%"
            height="32px"
            className="mx-auto"
          />
          
          {/* Hero Description */}
          <div className="space-y-2 max-w-2xl mx-auto">
            <EnhancedSkeleton variant="text" width="100%" height="20px" />
            <EnhancedSkeleton variant="text" width="90%" height="20px" className="mx-auto" />
          </div>
          
          {/* CTA Buttons */}
          <div className="flex gap-4 justify-center mt-8">
            <EnhancedSkeleton variant="rectangular" width="200px" height="56px" className="rounded-xl" />
            <EnhancedSkeleton variant="rectangular" width="200px" height="56px" className="rounded-xl" />
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mt-16">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="p-6 rounded-xl border border-border bg-card space-y-3 text-center"
            >
              <EnhancedSkeleton variant="text" width="60px" height="48px" className="mx-auto" />
              <EnhancedSkeleton variant="text" width="80%" height="16px" className="mx-auto" />
            </div>
          ))}
        </div>
      </div>

      {/* How It Works Section */}
      <section className="py-16 md:py-20 bg-muted/30">
        <div className="container mx-auto px-6 md:px-8">
          <div className="text-center mb-12 space-y-4">
            <EnhancedSkeleton variant="text" width="200px" height="40px" className="mx-auto" />
            <EnhancedSkeleton variant="text" width="400px" height="24px" className="mx-auto" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="text-center space-y-4">
                <EnhancedSkeleton
                  variant="rectangular"
                  width="80px"
                  height="80px"
                  className="rounded-2xl mx-auto"
                />
                <EnhancedSkeleton variant="text" width="60px" height="16px" className="mx-auto" />
                <EnhancedSkeleton variant="text" width="80%" height="24px" className="mx-auto" />
                <EnhancedSkeleton variant="text" width="100%" height="16px" />
                <EnhancedSkeleton variant="text" width="90%" height="16px" className="mx-auto" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Grade Selection Section */}
      <section className="py-16 md:py-20">
        <div className="container mx-auto px-6 md:px-8">
          <div className="text-center mb-12 space-y-4">
            <EnhancedSkeleton variant="text" width="250px" height="40px" className="mx-auto" />
            <EnhancedSkeleton variant="text" width="400px" height="24px" className="mx-auto" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {Array.from({ length: 3 }).map((_, i) => (
              <SkeletonCard
                key={i}
                hasImage={false}
                hasTitle
                hasDescription
                hasActions
                className="h-64"
              />
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 md:py-20 bg-muted/30">
        <div className="container mx-auto px-6 md:px-8">
          <div className="text-center mb-12 space-y-4">
            <EnhancedSkeleton variant="text" width="200px" height="40px" className="mx-auto" />
            <EnhancedSkeleton variant="text" width="400px" height="24px" className="mx-auto" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="p-6 rounded-xl border border-border bg-card space-y-4">
                <EnhancedSkeleton
                  variant="rectangular"
                  width="56px"
                  height="56px"
                  className="rounded-xl"
                />
                <EnhancedSkeleton variant="text" width="70%" height="24px" />
                <div className="space-y-2">
                  <EnhancedSkeleton variant="text" width="100%" height="16px" />
                  <EnhancedSkeleton variant="text" width="90%" height="16px" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 md:py-20">
        <div className="container mx-auto px-6 md:px-8">
          <div className="text-center mb-12 space-y-4">
            <EnhancedSkeleton variant="text" width="200px" height="40px" className="mx-auto" />
            <EnhancedSkeleton variant="text" width="400px" height="24px" className="mx-auto" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="p-6 rounded-xl border border-border bg-card space-y-4">
                <div className="flex items-center gap-3">
                  <EnhancedSkeleton variant="circular" width="48px" height="48px" />
                  <div className="flex-1 space-y-2">
                    <EnhancedSkeleton variant="text" width="120px" height="16px" />
                    <EnhancedSkeleton variant="text" width="80px" height="14px" />
                  </div>
                </div>
                <SkeletonText lines={3} />
                <EnhancedSkeleton variant="text" width="100px" height="20px" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 md:py-20 bg-muted/30">
        <div className="container mx-auto px-6 md:px-8 max-w-3xl">
          <div className="text-center mb-12 space-y-4">
            <EnhancedSkeleton variant="text" width="250px" height="40px" className="mx-auto" />
            <EnhancedSkeleton variant="text" width="400px" height="24px" className="mx-auto" />
          </div>

          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="p-6 rounded-xl border border-border bg-card">
                <EnhancedSkeleton variant="text" width="80%" height="20px" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-20">
        <div className="container mx-auto px-6 md:px-8">
          <div className="max-w-4xl mx-auto text-center p-12 rounded-2xl border border-border bg-gradient-to-br from-primary/5 to-primary/10 space-y-6">
            <EnhancedSkeleton variant="text" width="300px" height="48px" className="mx-auto" />
            <EnhancedSkeleton variant="text" width="500px" height="24px" className="mx-auto" />
            <EnhancedSkeleton variant="rectangular" width="200px" height="56px" className="rounded-xl mx-auto" />
          </div>
        </div>
      </section>
    </div>
  );
}

export default HomepageSkeleton;
