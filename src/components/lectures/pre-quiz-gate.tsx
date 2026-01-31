"use client";

import { useState } from "react";
import {
  Lock,
  Unlock,
  AlertCircle,
  CheckCircle,
  Play,
  RefreshCw,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import type { PreQuizStatus } from "@/types/lives-system";

interface PreQuizGateProps {
  status: PreQuizStatus;
  quizTitle?: string;
  threshold: number;
  attemptsUsed: number;
  maxAttempts: number;
  lastScore?: number;
  className?: string;
  onStartQuiz?: () => void;
  onContactSupport?: () => void;
}

export function PreQuizGate({
  status,
  quizTitle = "اختبار المتطلبات",
  threshold,
  attemptsUsed,
  maxAttempts,
  lastScore,
  className,
  onStartQuiz,
  onContactSupport,
}: PreQuizGateProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleStartQuiz = async () => {
    setIsLoading(true);
    try {
      await onStartQuiz?.();
    } finally {
      setIsLoading(false);
    }
  };

  // No quiz required
  if (status === "not_required") {
    return null;
  }

  // Quiz passed - show success
  if (status === "passed") {
    return (
      <div
        className={cn(
          "p-4 rounded-xl bg-green-500/10 border border-green-500/20",
          className,
        )}
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center">
            <CheckCircle className="w-5 h-5 text-green-500" />
          </div>
          <div>
            <h4 className="font-medium text-green-700 dark:text-green-400">
              تم اجتياز {quizTitle}
            </h4>
            {lastScore !== undefined && (
              <p className="text-sm text-green-600/70 dark:text-green-400/70">
                درجتك: {lastScore}%
              </p>
            )}
          </div>
          <Unlock className="w-5 h-5 text-green-500 ms-auto" />
        </div>
      </div>
    );
  }

  // Locked after max attempts
  if (status === "locked") {
    return (
      <div
        className={cn(
          "p-4 rounded-xl bg-destructive/10 border border-destructive/20",
          className,
        )}
      >
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-full bg-destructive/20 flex items-center justify-center flex-shrink-0">
            <Lock className="w-5 h-5 text-destructive" />
          </div>
          <div className="flex-1">
            <h4 className="font-medium text-destructive">المحاضرة مقفلة</h4>
            <p className="text-sm text-muted-foreground mt-1">
              استنفدت جميع محاولات {quizTitle}. تواصل مع الدعم الفني لإعادة فتح
              المحاضرة.
            </p>
            {onContactSupport && (
              <Button
                variant="outline"
                size="sm"
                className="mt-3 border-destructive/30 text-destructive hover:bg-destructive/10"
                onClick={onContactSupport}
              >
                <AlertCircle className="w-4 h-4 me-2" />
                تواصل مع الدعم
              </Button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Pending or failed - show quiz gate
  const attemptsRemaining = maxAttempts - attemptsUsed;
  const hasFailed = status === "failed";

  return (
    <div
      className={cn(
        "p-4 rounded-xl border",
        hasFailed
          ? "bg-amber-500/10 border-amber-500/20"
          : "bg-primary/5 border-primary/20",
        className,
      )}
    >
      <div className="flex items-start gap-3">
        <div
          className={cn(
            "w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0",
            hasFailed ? "bg-amber-500/20" : "bg-primary/20",
          )}
        >
          {hasFailed ? (
            <RefreshCw
              className={cn(
                "w-5 h-5",
                hasFailed ? "text-amber-500" : "text-primary",
              )}
            />
          ) : (
            <Lock className="w-5 h-5 text-primary" />
          )}
        </div>
        <div className="flex-1">
          <h4
            className={cn(
              "font-medium",
              hasFailed
                ? "text-amber-700 dark:text-amber-400"
                : "text-foreground",
            )}
          >
            {hasFailed ? "أعد المحاولة" : "اجتز الاختبار أولاً"}
          </h4>
          <p className="text-sm text-muted-foreground mt-1">
            {hasFailed
              ? `لم تصل للحد الأدنى (${threshold}%). لديك ${attemptsRemaining} محاولة متبقية.`
              : `يجب اجتياز ${quizTitle} بنسبة ${threshold}% على الأقل لفتح المحاضرة.`}
          </p>

          {/* Attempts progress */}
          <div className="mt-3 space-y-1">
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">المحاولات</span>
              <span
                className={cn(
                  "font-medium",
                  attemptsRemaining <= 1 ? "text-amber-500" : "text-foreground",
                )}
              >
                {attemptsRemaining} / {maxAttempts}
              </span>
            </div>
            <Progress
              value={(attemptsRemaining / maxAttempts) * 100}
              className="h-1.5"
            />
          </div>

          {/* Last score if failed */}
          {hasFailed && lastScore !== undefined && (
            <p className="text-sm text-amber-600/70 dark:text-amber-400/70 mt-2">
              درجتك السابقة: {lastScore}%
            </p>
          )}

          {/* Start quiz button */}
          {onStartQuiz && (
            <Button
              className="mt-3 w-full sm:w-auto"
              onClick={handleStartQuiz}
              disabled={isLoading}
            >
              {isLoading ? (
                <RefreshCw className="w-4 h-4 me-2 animate-spin" />
              ) : (
                <Play className="w-4 h-4 me-2" />
              )}
              {hasFailed ? "أعد المحاولة" : "ابدأ الاختبار"}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
