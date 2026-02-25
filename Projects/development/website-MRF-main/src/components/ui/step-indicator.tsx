import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface Step {
  label: string;
  description?: string;
}

interface StepIndicatorProps {
  steps: Step[];
  currentStep: number;
  className?: string;
  /** Vertical layout for mobile */
  vertical?: boolean;
}

export function StepIndicator({
  steps,
  currentStep,
  className,
  vertical = false,
}: StepIndicatorProps) {
  return (
    <div className={cn("w-full", className)}>
      <div
        className={cn(
          "flex",
          vertical ? "flex-col gap-4" : "items-center justify-between"
        )}
      >
        {steps.map((step, index) => {
          const stepNumber = index + 1;
          const isCompleted = stepNumber < currentStep;
          const isCurrent = stepNumber === currentStep;
          const isUpcoming = stepNumber > currentStep;

          return (
            <div
              key={index}
              className={cn(
                "flex items-center",
                vertical ? "gap-4" : "flex-1"
              )}
            >
              <div
                className={cn(
                  "flex items-center",
                  vertical ? "flex-row gap-4" : "flex-col"
                )}
              >
                <div
                  className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all shrink-0",
                    isCompleted && "bg-primary text-primary-foreground",
                    isCurrent &&
                      "bg-primary text-primary-foreground ring-4 ring-primary/20",
                    isUpcoming && "bg-muted text-muted-foreground"
                  )}
                >
                  {isCompleted ? (
                    <Check className="w-5 h-5" />
                  ) : (
                    <span className="text-sm">{stepNumber}</span>
                  )}
                </div>
                <div className={cn(vertical ? "text-start" : "mt-3 text-center")}>
                  <div
                    className={cn(
                      "text-sm font-medium",
                      isCompleted && "text-foreground",
                      isCurrent && "text-primary",
                      isUpcoming && "text-muted-foreground"
                    )}
                  >
                    {step.label}
                  </div>
                  {step.description && (
                    <div className="text-sm text-muted-foreground mt-0.5">
                      {step.description}
                    </div>
                  )}
                </div>
              </div>
              {index < steps.length - 1 && (
                <div
                  className={cn(
                    "transition-all",
                    vertical
                      ? "w-0.5 h-8 ms-5 bg-border"
                      : "flex-1 h-0.5 mx-3",
                    isCompleted ? "bg-primary" : "bg-muted"
                  )}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

