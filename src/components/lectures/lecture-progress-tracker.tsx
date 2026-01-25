"use client";

import { cn } from "@/lib/utils";
import {
  BookOpen,
  CheckCircle,
  Circle,
  ClipboardList,
  FileText,
  Play,
  Video,
} from "lucide-react";

export type LectureStep = "pre-quiz" | "videos" | "post-quiz" | "homework";

export interface LectureProgress {
  preQuizPassed: boolean;
  videosCompleted: number;
  videosTotal: number;
  postQuizPassed: boolean;
  homeworkCompleted: boolean;
}

interface LectureProgressTrackerProps {
  progress: LectureProgress;
  currentStep?: LectureStep;
  onStepClick?: (step: LectureStep) => void;
  compact?: boolean;
  className?: string;
}

const steps: {
  id: LectureStep;
  label: string;
  icon: React.ElementType;
}[] = [
  { id: "pre-quiz", label: "اختبار قبلي", icon: FileText },
  { id: "videos", label: "الفيديوهات", icon: Video },
  { id: "post-quiz", label: "اختبار بعدي", icon: BookOpen },
  { id: "homework", label: "الواجب", icon: ClipboardList },
];

function getStepStatus(
  step: LectureStep,
  progress: LectureProgress
): "completed" | "current" | "locked" {
  switch (step) {
    case "pre-quiz":
      return progress.preQuizPassed ? "completed" : "current";
    case "videos":
      if (!progress.preQuizPassed) return "locked";
      if (progress.videosCompleted === progress.videosTotal) return "completed";
      return "current";
    case "post-quiz":
      if (progress.videosCompleted < progress.videosTotal) return "locked";
      return progress.postQuizPassed ? "completed" : "current";
    case "homework":
      if (!progress.postQuizPassed) return "locked";
      return progress.homeworkCompleted ? "completed" : "current";
  }
}

export function LectureProgressTracker({
  progress,
  currentStep,
  onStepClick,
  compact = false,
  className,
}: LectureProgressTrackerProps) {
  return (
    <div className={cn("w-full", className)}>
      <div
        className={cn(
          "flex items-center justify-between",
          compact ? "gap-2" : "gap-4"
        )}
      >
        {steps.map((step, index) => {
          const status = getStepStatus(step.id, progress);
          const isActive = currentStep === step.id;
          const StepIcon = step.icon;

          return (
            <div key={step.id} className="flex-1 flex flex-col items-center">
              {/* Connector line before */}
              {index > 0 && (
                <div
                  className={cn(
                    "absolute top-1/2 -translate-y-1/2 h-0.5 w-full -right-1/2",
                    status === "completed" || getStepStatus(steps[index - 1].id, progress) === "completed"
                      ? "bg-green-500"
                      : "bg-border"
                  )}
                  style={{ zIndex: 0 }}
                />
              )}

              {/* Step circle */}
              <button
                onClick={() => status !== "locked" && onStepClick?.(step.id)}
                disabled={status === "locked"}
                className={cn(
                  "relative z-10 flex items-center justify-center rounded-full transition-all",
                  compact ? "w-8 h-8" : "w-12 h-12",
                  status === "completed" &&
                    "bg-green-500 text-white shadow-lg shadow-green-500/30",
                  status === "current" &&
                    "bg-blue-500 text-white shadow-lg shadow-blue-500/30 ring-4 ring-blue-500/20",
                  status === "locked" &&
                    "bg-muted text-muted-foreground cursor-not-allowed",
                  isActive && "ring-4 ring-primary/30"
                )}
              >
                {status === "completed" ? (
                  <CheckCircle className={compact ? "w-4 h-4" : "w-6 h-6"} />
                ) : status === "current" ? (
                  <StepIcon className={compact ? "w-4 h-4" : "w-6 h-6"} />
                ) : (
                  <Circle className={compact ? "w-4 h-4" : "w-6 h-6"} />
                )}
              </button>

              {/* Label */}
              {!compact && (
                <span
                  className={cn(
                    "mt-2 text-xs font-medium text-center",
                    status === "completed" && "text-green-600",
                    status === "current" && "text-blue-600",
                    status === "locked" && "text-muted-foreground"
                  )}
                >
                  {step.label}
                  {step.id === "videos" && (
                    <span className="block text-[10px]">
                      {progress.videosCompleted}/{progress.videosTotal}
                    </span>
                  )}
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default LectureProgressTracker;

