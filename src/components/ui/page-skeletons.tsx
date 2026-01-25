"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

/**
 * Reusable page skeleton components for consistent loading states
 */

// Profile page skeleton
export function ProfileSkeleton() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl" dir="rtl">
      <Skeleton className="h-9 w-40 mb-6" />
      
      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <Skeleton className="h-7 w-48" />
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-6">
              {/* Avatar */}
              <div className="flex flex-col items-center gap-4">
                <Skeleton className="w-32 h-32 rounded-full" />
                <Skeleton className="h-9 w-32" />
              </div>
              {/* Info */}
              <div className="flex-1 space-y-4">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="flex items-center gap-3">
                    <Skeleton className="w-5 h-5" />
                    <div className="space-y-1">
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="h-5 w-40" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i}>
              <CardContent className="p-4 text-center">
                <Skeleton className="h-8 w-16 mx-auto mb-2" />
                <Skeleton className="h-4 w-20 mx-auto" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

// Shop/Store page skeleton
export function ShopSkeleton() {
  return (
    <div className="container mx-auto px-4 py-8" dir="rtl">
      <div className="mb-8">
        <Skeleton className="h-9 w-32 mb-2" />
        <Skeleton className="h-5 w-64" />
      </div>

      {/* Balance card */}
      <Card className="mb-8">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Skeleton className="w-12 h-12 rounded-full" />
              <div>
                <Skeleton className="h-4 w-24 mb-2" />
                <Skeleton className="h-8 w-32" />
              </div>
            </div>
            <Skeleton className="h-10 w-28" />
          </div>
        </CardContent>
      </Card>

      {/* Category tabs */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {[1, 2, 3, 4].map((i) => (
          <Skeleton key={i} className="h-10 w-24 rounded-full flex-shrink-0" />
        ))}
      </div>

      {/* Items grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
          <Card key={i}>
            <CardContent className="p-4">
              <Skeleton className="w-16 h-16 mx-auto mb-4" />
              <Skeleton className="h-5 w-full mb-2" />
              <Skeleton className="h-4 w-3/4 mx-auto mb-4" />
              <Skeleton className="h-9 w-full rounded-lg" />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

// Leaderboard page skeleton
export function LeaderboardSkeleton() {
  return (
    <div className="container mx-auto px-4 py-8" dir="rtl">
      <div className="mb-8 text-center">
        <Skeleton className="h-9 w-48 mx-auto mb-2" />
        <Skeleton className="h-5 w-64 mx-auto" />
      </div>

      {/* Top 3 podium */}
      <div className="flex justify-center items-end gap-4 mb-8">
        <Skeleton className="w-24 h-32 rounded-lg" />
        <Skeleton className="w-28 h-40 rounded-lg" />
        <Skeleton className="w-24 h-28 rounded-lg" />
      </div>

      {/* Leaderboard list */}
      <Card>
        <CardContent className="p-0">
          {[4, 5, 6, 7, 8, 9, 10].map((i) => (
            <div key={i} className="flex items-center gap-4 p-4 border-b last:border-b-0">
              <Skeleton className="w-8 h-8 rounded-full" />
              <Skeleton className="w-10 h-10 rounded-full" />
              <div className="flex-1">
                <Skeleton className="h-5 w-32 mb-1" />
                <Skeleton className="h-4 w-24" />
              </div>
              <Skeleton className="h-6 w-20" />
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}

// Courses page skeleton
export function CoursesSkeleton() {
  return (
    <div className="container mx-auto px-4 py-8" dir="rtl">
      <div className="mb-8">
        <Skeleton className="h-9 w-32 mb-2" />
        <Skeleton className="h-5 w-64" />
      </div>

      {/* Filters */}
      <div className="flex gap-4 mb-6 overflow-x-auto pb-2">
        {[1, 2, 3, 4, 5].map((i) => (
          <Skeleton key={i} className="h-10 w-28 rounded-full flex-shrink-0" />
        ))}
      </div>

      {/* Course grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <Card key={i} className="overflow-hidden">
            <Skeleton className="h-48 w-full" />
            <CardHeader className="pb-2">
              <Skeleton className="h-6 w-3/4 mb-2" />
              <Skeleton className="h-4 w-full" />
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2 mb-4">
                <Skeleton className="h-5 w-16 rounded-full" />
                <Skeleton className="h-5 w-20 rounded-full" />
              </div>
              <Skeleton className="h-2 w-full rounded-full mb-2" />
              <div className="flex justify-between">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-4 w-16" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

// Generic page skeleton
export function GenericPageSkeleton() {
  return (
    <div className="container mx-auto px-4 py-8" dir="rtl">
      <Skeleton className="h-9 w-48 mb-4" />
      <Skeleton className="h-5 w-full max-w-2xl mb-8" />
      
      <div className="grid gap-6">
        {[1, 2, 3].map((i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <Skeleton className="h-6 w-1/3 mb-4" />
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-5/6 mb-2" />
              <Skeleton className="h-4 w-4/6" />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

