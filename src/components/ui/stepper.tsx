import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface Step {
  label: string;
  description?: string;
}

interface StepperProps {
  steps: Step[];
  currentStep: number;
  className?: string;
}

export function Stepper({ steps, currentStep, className }: StepperProps) {
  return (
    <div className={cn("w-full", className)}>
      <div className="flex items-center justify-between">
        {steps.map((step, index) => {
          const isCompleted = index < currentStep;
          const isCurrent = index === currentStep;
          const isUpcoming = index > currentStep;

          return (
            <div key={index} className="flex items-center flex-1">
              <div className="flex flex-col items-center">
                <div
                  className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all",
                    isCompleted &&
                      "bg-primary border-primary text-primary-foreground",
                    isCurrent && "border-primary text-primary",
                    isUpcoming && "border-muted text-muted-foreground",
                  )}
                >
                  {isCompleted ? (
                    <Check className="w-5 h-5" />
                  ) : (
                    <span className="font-semibold">{index + 1}</span>
                  )}
                </div>

                <div className="mt-2 text-center">
                  <div
                    className={cn(
                      "text-sm font-medium",
                      isCurrent && "text-primary",
                      isUpcoming && "text-muted-foreground",
                    )}
                  >
                    {step.label}
                  </div>
                  {step.description && (
                    <div className="text-sm text-muted-foreground mt-1">
                      {step.description}
                    </div>
                  )}
                </div>
              </div>

              {index < steps.length - 1 && (
                <div
                  className={cn(
                    "flex-1 h-0.5 mx-4 transition-all",
                    isCompleted ? "bg-primary" : "bg-muted",
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
