"use client";

/**
 * Checkout Skeleton Loader - Phase 1 Week 1 Day 2-3
 * Loading state for checkout page with multi-step form
 */

import { EnhancedSkeleton } from "../EnhancedSkeleton";

export function CheckoutSkeleton() {
  return (
    <div className="min-h-screen bg-background" dir="rtl">
      <div className="container mx-auto px-4 md:px-6 py-6 md:py-8 space-y-8">
        {/* Page Header */}
        <div className="text-center space-y-2">
          <EnhancedSkeleton variant="text" width="200px" height="36px" className="mx-auto" />
          <EnhancedSkeleton variant="text" width="300px" height="20px" className="mx-auto" />
        </div>

        {/* Progress Steps */}
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center justify-between">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex items-center flex-1">
                <div className="flex flex-col items-center gap-2">
                  <EnhancedSkeleton
                    variant="circular"
                    width="48px"
                    height="48px"
                  />
                  <EnhancedSkeleton variant="text" width="80px" height="14px" />
                </div>
                {i < 3 && (
                  <EnhancedSkeleton
                    variant="rectangular"
                    width="100%"
                    height="2px"
                    className="mx-4"
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {/* Form Area - 2/3 width */}
          <div className="lg:col-span-2 space-y-6">
            {/* Contact Information */}
            <div className="p-6 rounded-xl border border-border bg-card space-y-6">
              <div className="flex items-center justify-between">
                <EnhancedSkeleton variant="text" width="150px" height="24px" />
                <EnhancedSkeleton
                  variant="rectangular"
                  width="32px"
                  height="32px"
                  className="rounded-full"
                />
              </div>

              <div className="space-y-4">
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

                {/* Email & Phone */}
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
              </div>
            </div>

            {/* Shipping Address */}
            <div className="p-6 rounded-xl border border-border bg-card space-y-6">
              <div className="flex items-center justify-between">
                <EnhancedSkeleton variant="text" width="150px" height="24px" />
                <EnhancedSkeleton
                  variant="rectangular"
                  width="32px"
                  height="32px"
                  className="rounded-full"
                />
              </div>

              <div className="space-y-4">
                {/* Governorate & City */}
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

                {/* Street Address */}
                <div className="space-y-2">
                  <EnhancedSkeleton variant="text" width="120px" height="16px" />
                  <EnhancedSkeleton
                    variant="rectangular"
                    width="100%"
                    height="48px"
                    className="rounded-lg"
                  />
                </div>

                {/* Additional Details */}
                <div className="space-y-2">
                  <EnhancedSkeleton variant="text" width="150px" height="16px" />
                  <EnhancedSkeleton
                    variant="rectangular"
                    width="100%"
                    height="96px"
                    className="rounded-lg"
                  />
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div className="p-6 rounded-xl border border-border bg-card space-y-6">
              <EnhancedSkeleton variant="text" width="150px" height="24px" />

              <div className="space-y-3">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div
                    key={i}
                    className="p-4 rounded-lg border-2 border-border hover:border-primary/30 transition-all"
                  >
                    <div className="flex items-center gap-4">
                      <EnhancedSkeleton
                        variant="circular"
                        width="24px"
                        height="24px"
                      />
                      <div className="flex-1 flex items-center justify-between">
                        <EnhancedSkeleton variant="text" width="150px" height="20px" />
                        <EnhancedSkeleton
                          variant="rectangular"
                          width="60px"
                          height="32px"
                          className="rounded"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Navigation Buttons */}
            <div className="flex items-center justify-between pt-4">
              <EnhancedSkeleton
                variant="rectangular"
                width="120px"
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

          {/* Order Summary - 1/3 width */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              {/* Summary Card */}
              <div className="p-6 rounded-xl border border-border bg-card space-y-6">
                <EnhancedSkeleton variant="text" width="150px" height="24px" />

                {/* Order Items */}
                <div className="space-y-3">
                  {Array.from({ length: 2 }).map((_, i) => (
                    <div key={i} className="flex gap-3 pb-3 border-b border-border last:border-0">
                      <EnhancedSkeleton
                        variant="rectangular"
                        width="60px"
                        height="60px"
                        className="rounded-lg"
                      />
                      <div className="flex-1 space-y-2">
                        <EnhancedSkeleton variant="text" width="100%" height="16px" />
                        <EnhancedSkeleton variant="text" width="40%" height="14px" />
                        <EnhancedSkeleton variant="text" width="60px" height="20px" />
                      </div>
                    </div>
                  ))}
                </div>

                {/* Price Breakdown */}
                <div className="space-y-3 pt-3 border-t border-border">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="flex items-center justify-between">
                      <EnhancedSkeleton variant="text" width="100px" height="16px" />
                      <EnhancedSkeleton variant="text" width="80px" height="16px" />
                    </div>
                  ))}
                </div>

                {/* Total */}
                <div className="flex items-center justify-between pt-3 border-t-2 border-border">
                  <EnhancedSkeleton variant="text" width="80px" height="24px" />
                  <EnhancedSkeleton variant="text" width="120px" height="32px" />
                </div>

                {/* Place Order Button */}
                <EnhancedSkeleton
                  variant="rectangular"
                  width="100%"
                  height="56px"
                  className="rounded-lg"
                />

                {/* Terms */}
                <div className="flex items-start gap-2 pt-2">
                  <EnhancedSkeleton
                    variant="rectangular"
                    width="20px"
                    height="20px"
                    className="rounded mt-1"
                  />
                  <div className="flex-1 space-y-1">
                    <EnhancedSkeleton variant="text" width="100%" height="14px" />
                    <EnhancedSkeleton variant="text" width="80%" height="14px" />
                  </div>
                </div>
              </div>

              {/* Security Badges */}
              <div className="p-4 rounded-xl border border-border bg-card">
                <div className="flex items-center justify-center gap-4">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <EnhancedSkeleton
                      key={i}
                      variant="rectangular"
                      width="60px"
                      height="40px"
                      className="rounded"
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CheckoutSkeleton;
