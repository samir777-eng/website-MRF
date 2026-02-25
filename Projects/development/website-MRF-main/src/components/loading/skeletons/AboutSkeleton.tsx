"use client";

/**
 * About Page Skeleton Loader - Phase 1 Week 1 Day 1-2
 * Loading state for about page with sections
 */

import { EnhancedSkeleton, SkeletonText } from "../EnhancedSkeleton";

export function AboutSkeleton() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="py-16 md:py-24 bg-gradient-to-br from-primary/5 to-primary/10">
        <div className="container mx-auto px-6 md:px-8">
          <div className="max-w-4xl mx-auto text-center space-y-6">
            <EnhancedSkeleton variant="text" width="60%" height="56px" className="mx-auto" />
            <EnhancedSkeleton variant="text" width="80%" height="24px" className="mx-auto" />
            <div className="space-y-2 max-w-2xl mx-auto">
              <EnhancedSkeleton variant="text" width="100%" height="20px" />
              <EnhancedSkeleton variant="text" width="95%" height="20px" className="mx-auto" />
              <EnhancedSkeleton variant="text" width="90%" height="20px" className="mx-auto" />
            </div>
          </div>
        </div>
      </section>

      {/* Teacher Profile Section */}
      <section className="py-16 md:py-20">
        <div className="container mx-auto px-6 md:px-8">
          <div className="max-w-5xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              {/* Image */}
              <EnhancedSkeleton
                variant="rectangular"
                width="100%"
                height="400px"
                className="rounded-2xl"
              />
              
              {/* Content */}
              <div className="space-y-6">
                <EnhancedSkeleton variant="text" width="200px" height="32px" />
                <EnhancedSkeleton variant="text" width="80%" height="28px" />
                <div className="space-y-3">
                  <SkeletonText lines={4} />
                </div>
                <div className="space-y-3 pt-4">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <EnhancedSkeleton variant="circular" width="24px" height="24px" />
                      <EnhancedSkeleton variant="text" width="70%" height="18px" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 md:py-20 bg-muted/30">
        <div className="container mx-auto px-6 md:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="p-8 rounded-xl border border-border bg-card text-center space-y-3">
                <EnhancedSkeleton variant="text" width="80px" height="48px" className="mx-auto" />
                <EnhancedSkeleton variant="text" width="70%" height="18px" className="mx-auto" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission & Vision Section */}
      <section className="py-16 md:py-20">
        <div className="container mx-auto px-6 md:px-8">
          <div className="max-w-5xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Mission */}
              <div className="p-8 rounded-2xl border border-border bg-card space-y-4">
                <div className="flex items-center gap-3">
                  <EnhancedSkeleton variant="circular" width="56px" height="56px" />
                  <EnhancedSkeleton variant="text" width="120px" height="28px" />
                </div>
                <div className="space-y-3">
                  <SkeletonText lines={5} />
                </div>
              </div>

              {/* Vision */}
              <div className="p-8 rounded-2xl border border-border bg-card space-y-4">
                <div className="flex items-center gap-3">
                  <EnhancedSkeleton variant="circular" width="56px" height="56px" />
                  <EnhancedSkeleton variant="text" width="120px" height="28px" />
                </div>
                <div className="space-y-3">
                  <SkeletonText lines={5} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-16 md:py-20 bg-muted/30">
        <div className="container mx-auto px-6 md:px-8">
          <div className="text-center mb-12 space-y-4">
            <EnhancedSkeleton variant="text" width="250px" height="40px" className="mx-auto" />
            <EnhancedSkeleton variant="text" width="400px" height="24px" className="mx-auto" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
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

      {/* Team Section */}
      <section className="py-16 md:py-20">
        <div className="container mx-auto px-6 md:px-8">
          <div className="text-center mb-12 space-y-4">
            <EnhancedSkeleton variant="text" width="200px" height="40px" className="mx-auto" />
            <EnhancedSkeleton variant="text" width="350px" height="24px" className="mx-auto" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="text-center space-y-4">
                <EnhancedSkeleton
                  variant="circular"
                  width="120px"
                  height="120px"
                  className="mx-auto"
                />
                <div className="space-y-2">
                  <EnhancedSkeleton variant="text" width="80%" height="20px" className="mx-auto" />
                  <EnhancedSkeleton variant="text" width="60%" height="16px" className="mx-auto" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-20 bg-gradient-to-br from-primary/5 to-primary/10">
        <div className="container mx-auto px-6 md:px-8">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <EnhancedSkeleton variant="text" width="300px" height="48px" className="mx-auto" />
            <EnhancedSkeleton variant="text" width="500px" height="24px" className="mx-auto" />
            <EnhancedSkeleton
              variant="rectangular"
              width="200px"
              height="56px"
              className="rounded-xl mx-auto"
            />
          </div>
        </div>
      </section>
    </div>
  );
}

export default AboutSkeleton;
