"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { memo } from "react";

// Skeleton building blocks
const Shimmer = memo(function Shimmer({
  className = "",
}: {
  className?: string;
}) {
  return (
    <div
      className={`animate-pulse bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 dark:from-gray-700 dark:via-gray-600 dark:to-gray-700 rounded ${className}`}
      style={{
        backgroundSize: "200% 100%",
        animation: "shimmer 1.5s infinite",
      }}
    />
  );
});

// Header skeleton
export const DashboardHeaderSkeleton = memo(function DashboardHeaderSkeleton() {
  return (
    <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700 shadow-lg">
      <div className="max-w-7xl mx-auto px-6 md:px-8 py-6 md:py-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4 md:gap-6">
            <Shimmer className="w-16 h-16 rounded-full" />
            <div className="space-y-2">
              <Shimmer className="h-8 w-48" />
              <Shimmer className="h-4 w-64" />
            </div>
          </div>
          <div className="hidden md:flex items-center gap-4">
            <Shimmer className="h-10 w-28 rounded-full" />
            <Shimmer className="h-10 w-28 rounded-full" />
            <Shimmer className="h-10 w-32 rounded-full" />
          </div>
        </div>
      </div>
    </div>
  );
});

// Stats section skeleton
export const StatsSkeleton = memo(function StatsSkeleton() {
  return (
    <div className="mb-8 md:mb-10">
      <Shimmer className="h-8 w-48 mb-6" />
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <Card key={i} className="border-0 shadow-lg">
            <CardContent className="p-4 text-center">
              <Shimmer className="w-12 h-12 rounded-full mx-auto mb-3" />
              <Shimmer className="h-6 w-16 mx-auto mb-2" />
              <Shimmer className="h-4 w-20 mx-auto" />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
});

// Card skeleton
export const CardSkeleton = memo(function CardSkeleton({
  hasGradient = false,
}: {
  hasGradient?: boolean;
}) {
  return (
    <Card
      className={`border-0 shadow-xl ${hasGradient ? "bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600" : ""}`}
    >
      <CardHeader>
        <div className="flex items-center gap-2">
          <Shimmer className="w-6 h-6 rounded" />
          <Shimmer className="h-6 w-32" />
        </div>
        <Shimmer className="h-4 w-48 mt-2" />
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="flex items-center justify-between p-4 rounded-lg bg-gray-100 dark:bg-gray-700"
            >
              <div className="flex items-center gap-3">
                <Shimmer className="w-6 h-6 rounded-full" />
                <div className="space-y-2">
                  <Shimmer className="h-4 w-32" />
                  <Shimmer className="h-3 w-20" />
                </div>
              </div>
              <Shimmer className="h-2 w-24" />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
});

// Sidebar skeleton
export const SidebarSkeleton = memo(function SidebarSkeleton() {
  return (
    <div className="space-y-6">
      <Card className="border-0 shadow-xl bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600">
        <CardHeader>
          <Shimmer className="h-6 w-32" />
        </CardHeader>
        <CardContent>
          <div className="text-center space-y-3">
            <Shimmer className="w-12 h-12 rounded-full mx-auto" />
            <Shimmer className="h-8 w-16 mx-auto" />
            <Shimmer className="h-4 w-24 mx-auto" />
            <Shimmer className="h-10 w-32 mx-auto rounded-lg" />
          </div>
        </CardContent>
      </Card>
      <Card className="border-0 shadow-xl">
        <CardHeader>
          <Shimmer className="h-6 w-28" />
        </CardHeader>
        <CardContent className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Shimmer key={i} className="h-11 w-full rounded-lg" />
          ))}
        </CardContent>
      </Card>
    </div>
  );
});

// Progress Ring Skeleton
export const ProgressRingSkeleton = memo(function ProgressRingSkeleton() {
  return (
    <Card className="border-0 bg-gradient-to-br from-violet-500/5 via-purple-500/5 to-pink-500/5">
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row items-center gap-6">
          <div className="relative w-[140px] h-[140px]">
            <Shimmer className="w-full h-full rounded-full" />
          </div>
          <div className="flex-1 space-y-3 text-center md:text-start">
            <Shimmer className="h-6 w-40 mx-auto md:mx-0" />
            <Shimmer className="h-4 w-56 mx-auto md:mx-0" />
            <div className="flex flex-wrap gap-2 justify-center md:justify-start">
              <Shimmer className="h-7 w-28 rounded-full" />
              <Shimmer className="h-7 w-28 rounded-full" />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
});

// Quick Actions Skeleton
export const QuickActionsSkeleton = memo(function QuickActionsSkeleton() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      {Array.from({ length: 4 }).map((_, i) => (
        <Card key={i} className="border-border/50">
          <CardContent className="p-4 text-center space-y-2">
            <Shimmer className="w-12 h-12 mx-auto rounded-xl" />
            <Shimmer className="h-4 w-16 mx-auto" />
          </CardContent>
        </Card>
      ))}
    </div>
  );
});

// Full page skeleton - Updated to match new layout
export const DashboardSkeleton = memo(function DashboardSkeleton() {
  return (
    <div
     
      className="min-h-screen bg-background dark:bg-zinc-950 pb-24 lg:pb-8"
    >
      <div className="container mx-auto px-4 md:px-6 py-8 space-y-8">
        {/* Header Skeleton */}
        <div className="text-center space-y-4">
          <Shimmer className="w-20 h-20 rounded-2xl mx-auto" />
          <Shimmer className="h-5 w-32 mx-auto" />
          <Shimmer className="h-10 w-48 mx-auto" />
          <Shimmer className="h-4 w-64 mx-auto" />
        </div>

        {/* Stats Grid Skeleton */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 rounded-2xl p-4 h-24"
            >
              <div className="space-y-2">
                <Shimmer className="h-7 w-24" />
                <Shimmer className="h-4 w-20" />
              </div>
            </div>
          ))}
        </div>

        {/* Progress Ring Skeleton */}
        <ProgressRingSkeleton />

        {/* Continue Learning Skeleton */}
        <div className="space-y-4">
          <Shimmer className="h-7 w-40" />
          <Card className="border-purple-500/20 bg-card/50">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex-1 space-y-3">
                  <div className="flex items-center gap-2">
                    <Shimmer className="h-6 w-16 rounded-lg" />
                    <Shimmer className="h-4 w-20" />
                  </div>
                  <Shimmer className="h-6 w-48" />
                  <div className="space-y-1">
                    <Shimmer className="h-4 w-full" />
                    <Shimmer className="h-2 w-full" />
                  </div>
                </div>
                <Shimmer className="h-12 w-32 rounded-xl" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Daily Quests Skeleton */}
        <div className="space-y-4">
          <Shimmer className="h-7 w-32" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <Card key={i} className="border-border/50">
                <CardContent className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Shimmer className="w-8 h-8 rounded-full" />
                    <Shimmer className="h-4 w-32" />
                  </div>
                  <Shimmer className="h-4 w-16" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Quick Actions Skeleton */}
        <QuickActionsSkeleton />
      </div>
    </div>
  );
});
