"use client";

import { LoadingSpinner } from "./loading-spinner";

interface PageLoaderProps {
  text?: string;
  fullScreen?: boolean;
}

export function PageLoader({
  text = "جاري التحميل...",
  fullScreen = true,
}: PageLoaderProps) {
  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
        <div className="flex flex-col items-center gap-4">
          <LoadingSpinner size="xl" />
          <p className="text-lg font-medium text-foreground">{text}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-[400px] items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <LoadingSpinner size="lg" />
        <p className="text-base font-medium text-foreground">{text}</p>
      </div>
    </div>
  );
}
