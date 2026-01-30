"use client";

import { useLectureProgress, type LectureStep } from "@/hooks/useLectureProgress";
import { useToast } from "@/hooks/useToast";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface LectureProgressGuardProps {
  lectureId: string;
  requiredStep: LectureStep;
  totalVideos?: number;
  children: React.ReactNode;
  /** Optional fallback UI while checking access */
  loadingFallback?: React.ReactNode;
}

/**
 * LectureProgressGuard
 *
 * A wrapper component that enforces the learning progression sequence.
 * If the user hasn't completed the prerequisites for a step, they are
 * redirected with an Arabic toast message explaining why.
 *
 * Learning sequence:
 * 1. Pre-Quiz (always accessible)
 * 2. Videos (requires pre-quiz completion)
 * 3. Post-Quiz (requires all videos watched)
 * 4. Homework (requires post-quiz completion)
 */
export function LectureProgressGuard({
  lectureId,
  requiredStep,
  totalVideos = 5,
  children,
  loadingFallback,
}: LectureProgressGuardProps) {
  const router = useRouter();
  const { toast } = useToast();
  const { canAccessStep, isLoaded } = useLectureProgress(lectureId, totalVideos);
  const [hasAccess, setHasAccess] = useState<boolean | null>(null);

  useEffect(() => {
    if (!isLoaded) return;

    const accessResult = canAccessStep(requiredStep);

    if (!accessResult.canAccess) {
      // Show toast with Arabic message
      toast({
        variant: "warning",
        title: "غير مسموح بالوصول",
        description: accessResult.reason,
      });

      // Redirect to the appropriate step
      if (accessResult.redirectTo) {
        router.replace(accessResult.redirectTo);
      }

      setHasAccess(false);
    } else {
      setHasAccess(true);
    }
  }, [isLoaded, canAccessStep, requiredStep, router, toast]);

  // Show loading state while checking
  if (!isLoaded || hasAccess === null) {
    if (loadingFallback) {
      return <>{loadingFallback}</>;
    }

    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto" />
          <p className="text-muted-foreground">جاري التحقق من الصلاحيات...</p>
        </div>
      </div>
    );
  }

  // If no access, return null (redirect will happen)
  if (!hasAccess) {
    return null;
  }

  // Render children if access granted
  return <>{children}</>;
}

export default LectureProgressGuard;
