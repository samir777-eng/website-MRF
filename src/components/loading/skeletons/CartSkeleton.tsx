"use client";

/**
 * Cart Skeleton Loader - Phase 1 Week 1 Day 2-3
 * Loading state for shopping cart page
 */

import { EnhancedSkeleton } from "../EnhancedSkeleton";

export function CartSkeleton() {
  return (
    <div className="min-h-screen bg-background" dir="rtl">
      <div className="container mx-auto px-4 md:px-6 py-6 md:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items - 2/3 width */}
          <div className="lg:col-span-2 space-y-6">
            {/* Page Header */}
            <div className="space-y-2">
              <EnhancedSkeleton variant="text" width="150px" height="36px" />
              <EnhancedSkeleton variant="text" width="200px" height="20px" />
            </div>

            {/* Cart Items */}
            <div className="space-y-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <div
                  key={i}
                  className="p-6 rounded-xl border border-border bg-card"
                >
                  <div className="flex items-start gap-4">
                    {/* Checkbox */}
                    <EnhancedSkeleton
                      variant="rectangular"
                      width="20px"
                      height="20px"
                      className="rounded mt-2"
                    />

                    {/* Product Image */}
                    <EnhancedSkeleton
                      variant="rectangular"
                      width="120px"
                      height="120px"
                      className="rounded-lg"
                    />

                    {/* Product Details */}
                    <div className="flex-1 space-y-3">
                      <div className="flex items-start justify-between">
                        <div className="flex-1 space-y-2">
                          <EnhancedSkeleton
                            variant="text"
                            width="70%"
                            height="24px"
                          />
                          <EnhancedSkeleton
                            variant="text"
                            width="50%"
                            height="16px"
                          />
                        </div>
                        <EnhancedSkeleton
                          variant="circular"
                          width="32px"
                          height="32px"
                        />
                      </div>

                      {/* Price & Quantity */}
                      <div className="flex items-center justify-between pt-2">
                        <EnhancedSkeleton
                          variant="text"
                          width="100px"
                          height="28px"
                        />

                        {/* Quantity Controls */}
                        <div className="flex items-center gap-3 p-2 rounded-lg border border-border">
                          <EnhancedSkeleton
                            variant="rectangular"
                            width="32px"
                            height="32px"
                            className="rounded"
                          />
                          <EnhancedSkeleton
                            variant="text"
                            width="24px"
                            height="24px"
                          />
                          <EnhancedSkeleton
                            variant="rectangular"
                            width="32px"
                            height="32px"
                            className="rounded"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Continue Shopping Button */}
            <EnhancedSkeleton
              variant="rectangular"
              width="200px"
              height="44px"
              className="rounded-lg"
            />

            {/* Recommended Products */}
            <div className="space-y-4 pt-8">
              <EnhancedSkeleton variant="text" width="200px" height="28px" />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Array.from({ length: 2 }).map((_, i) => (
                  <div
                    key={i}
                    className="p-4 rounded-xl border border-border bg-card flex gap-4"
                  >
                    <EnhancedSkeleton
                      variant="rectangular"
                      width="80px"
                      height="80px"
                      className="rounded-lg"
                    />
                    <div className="flex-1 space-y-2">
                      <EnhancedSkeleton
                        variant="text"
                        width="100%"
                        height="20px"
                      />
                      <EnhancedSkeleton
                        variant="text"
                        width="70%"
                        height="16px"
                      />
                      <EnhancedSkeleton
                        variant="text"
                        width="60px"
                        height="24px"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Order Summary - 1/3 width */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              {/* Summary Card */}
              <div className="p-6 rounded-xl border border-border bg-card space-y-6">
                <EnhancedSkeleton variant="text" width="150px" height="24px" />

                {/* Summary Items */}
                <div className="space-y-3">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="flex items-center justify-between">
                      <EnhancedSkeleton
                        variant="text"
                        width="100px"
                        height="18px"
                      />
                      <EnhancedSkeleton
                        variant="text"
                        width="80px"
                        height="18px"
                      />
                    </div>
                  ))}
                </div>

                {/* Divider */}
                <div className="border-t border-border" />

                {/* Total */}
                <div className="flex items-center justify-between">
                  <EnhancedSkeleton variant="text" width="80px" height="24px" />
                  <EnhancedSkeleton
                    variant="text"
                    width="120px"
                    height="32px"
                  />
                </div>

                {/* Checkout Button */}
                <EnhancedSkeleton
                  variant="rectangular"
                  width="100%"
                  height="56px"
                  className="rounded-lg"
                />

                {/* Secure Payment Info */}
                <div className="flex items-center justify-center gap-2 pt-2">
                  <EnhancedSkeleton
                    variant="circular"
                    width="20px"
                    height="20px"
                  />
                  <EnhancedSkeleton
                    variant="text"
                    width="150px"
                    height="14px"
                  />
                </div>
              </div>

              {/* Coupon Card */}
              <div className="p-6 rounded-xl border border-border bg-card space-y-4">
                <EnhancedSkeleton variant="text" width="120px" height="20px" />

                <div className="flex gap-2">
                  <EnhancedSkeleton
                    variant="rectangular"
                    width="100%"
                    height="44px"
                    className="rounded-lg"
                  />
                  <EnhancedSkeleton
                    variant="rectangular"
                    width="80px"
                    height="44px"
                    className="rounded-lg"
                  />
                </div>
              </div>

              {/* Payment Methods */}
              <div className="p-6 rounded-xl border border-border bg-card space-y-4">
                <EnhancedSkeleton variant="text" width="140px" height="20px" />

                <div className="grid grid-cols-3 gap-2">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <EnhancedSkeleton
                      key={i}
                      variant="rectangular"
                      width="100%"
                      height="40px"
                      className="rounded-lg"
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

export default CartSkeleton;
