/**
 * Loading Component for Arabic Layout
 *
 * This component is automatically shown by Next.js when navigating between pages
 * or when a page is loading. It provides a smooth loading experience.
 */

import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center bg-background"
      role="status"
      aria-label="جاري التحميل"
    >
      <div className="flex flex-col items-center gap-4">
        {/* Animated Logo/Spinner */}
        <div className="relative">
          <div className="w-16 h-16 rounded-full border-4 border-primary/20 animate-pulse" />
          <Loader2 className="w-16 h-16 text-primary animate-spin absolute inset-0" />
        </div>

        {/* Loading Text */}
        <div className="text-center">
          <p className="text-lg font-medium text-foreground">جاري التحميل...</p>
          <p className="text-sm text-muted-foreground mt-1">يرجى الانتظار</p>
        </div>
      </div>

      {/* Screen reader announcement */}
      <span className="sr-only">جاري تحميل الصفحة، يرجى الانتظار</span>
    </div>
  );
}
