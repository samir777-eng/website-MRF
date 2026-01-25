import { Card, CardContent, CardHeader } from "./card";
import { Skeleton } from "./skeleton";

export function LessonCardSkeleton() {
  return (
    <Card className="overflow-hidden">
      <Skeleton className="h-48 w-full" />
      <CardHeader>
        <Skeleton className="h-6 w-3/4 mb-2" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-16" />
        </div>
      </CardContent>
    </Card>
  );
}

export function QuizCardSkeleton() {
  return (
    <Card className="overflow-hidden">
      <CardHeader>
        <div className="flex items-center justify-between mb-2">
          <Skeleton className="h-6 w-1/2" />
          <Skeleton className="h-6 w-16 rounded-full" />
        </div>
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-20" />
          </div>
          <div className="flex items-center justify-between">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-4 w-16" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function AchievementCardSkeleton() {
  return (
    <Card className="text-center">
      <CardContent className="pt-6">
        <Skeleton className="h-16 w-16 rounded-full mx-auto mb-4" />
        <Skeleton className="h-5 w-3/4 mx-auto mb-2" />
        <Skeleton className="h-4 w-full mb-2" />
        <Skeleton className="h-4 w-2/3 mx-auto" />
      </CardContent>
    </Card>
  );
}

export function LeaderboardEntrySkeleton() {
  return (
    <div className="flex items-center justify-between p-4 border-b">
      <div className="flex items-center gap-4">
        <Skeleton className="h-10 w-10 rounded-full" />
        <div className="space-y-2">
          <Skeleton className="h-5 w-32" />
          <Skeleton className="h-4 w-24" />
        </div>
      </div>
      <div className="text-right space-y-2">
        <Skeleton className="h-5 w-16" />
        <Skeleton className="h-4 w-12" />
      </div>
    </div>
  );
}

export function MaterialItemSkeleton() {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center gap-4">
          <Skeleton className="h-12 w-12 rounded" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-5 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </div>
          <Skeleton className="h-9 w-24" />
        </div>
      </CardContent>
    </Card>
  );
}

export function ListSkeleton({
  count = 3,
  type = "lesson",
}: {
  count?: number;
  type?: "lesson" | "quiz" | "achievement" | "leaderboard" | "material";
}) {
  const SkeletonComponent = {
    lesson: LessonCardSkeleton,
    quiz: QuizCardSkeleton,
    achievement: AchievementCardSkeleton,
    leaderboard: LeaderboardEntrySkeleton,
    material: MaterialItemSkeleton,
  }[type];

  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonComponent key={i} />
      ))}
    </div>
  );
}

// Dashboard Component Skeletons
export function XPDisplaySkeleton() {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center gap-3">
          <Skeleton className="h-12 w-12 rounded-full" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-5 w-24" />
            <Skeleton className="h-3 w-full" />
            <Skeleton className="h-3 w-16" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function StreakDisplaySkeleton() {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center gap-3">
          <Skeleton className="h-10 w-10 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-6 w-16" />
            <Skeleton className="h-4 w-24" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function QuestDisplaySkeleton() {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-6 w-32" />
      </CardHeader>
      <CardContent className="space-y-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="flex items-center gap-3">
            <Skeleton className="h-8 w-8 rounded" />
            <div className="flex-1 space-y-1">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-2 w-full" />
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

export function LeaderboardDisplaySkeleton() {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-6 w-40" />
      </CardHeader>
      <CardContent className="space-y-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <LeaderboardEntrySkeleton key={i} />
        ))}
      </CardContent>
    </Card>
  );
}

export function RewardsSystemSkeleton() {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-6 w-28" />
      </CardHeader>
      <CardContent className="grid grid-cols-2 gap-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="p-3 border rounded-lg">
            <Skeleton className="h-10 w-10 rounded mx-auto mb-2" />
            <Skeleton className="h-4 w-full mb-1" />
            <Skeleton className="h-3 w-2/3 mx-auto" />
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

export function VideoPlayerSkeleton() {
  return (
    <div className="relative aspect-video bg-muted rounded-lg overflow-hidden">
      <Skeleton className="absolute inset-0" />
      <div className="absolute inset-0 flex items-center justify-center">
        <Skeleton className="h-16 w-16 rounded-full" />
      </div>
      <div className="absolute bottom-0 left-0 right-0 p-4 space-y-2">
        <Skeleton className="h-1 w-full" />
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Skeleton className="h-8 w-8 rounded" />
            <Skeleton className="h-8 w-8 rounded" />
            <Skeleton className="h-4 w-20" />
          </div>
          <div className="flex items-center gap-2">
            <Skeleton className="h-8 w-8 rounded" />
            <Skeleton className="h-8 w-8 rounded" />
          </div>
        </div>
      </div>
    </div>
  );
}

export function QuizEngineSkeleton() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-6 w-16" />
        </div>
        <Skeleton className="h-2 w-full mt-2" />
      </CardHeader>
      <CardContent className="space-y-4">
        <Skeleton className="h-8 w-full" />
        <div className="space-y-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-12 w-full rounded-lg" />
          ))}
        </div>
        <div className="flex justify-between pt-4">
          <Skeleton className="h-10 w-24" />
          <Skeleton className="h-10 w-24" />
        </div>
      </CardContent>
    </Card>
  );
}

export function ProgressChartSkeleton() {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-6 w-36" />
      </CardHeader>
      <CardContent>
        <Skeleton className="h-64 w-full" />
      </CardContent>
    </Card>
  );
}

export function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <XPDisplaySkeleton />
        <StreakDisplaySkeleton />
        <QuestDisplaySkeleton />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ProgressChartSkeleton />
        <LeaderboardDisplaySkeleton />
      </div>
    </div>
  );
}
