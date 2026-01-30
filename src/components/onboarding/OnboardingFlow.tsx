"use client";

/**
 * OnboardingFlow - Phase 2 Task 2.4
 * Multi-step onboarding experience for new users
 */

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { ChevronRight, ChevronLeft } from "lucide-react";

// ============================================================================
// TYPES
// ============================================================================

export interface OnboardingStep {
  id: string;
  name: string;
  component: React.ReactNode;
  canSkip?: boolean;
  validation?: () => boolean | Promise<boolean>;
}

interface OnboardingFlowProps {
  steps: OnboardingStep[];
  onComplete: (data?: any) => void;
  onSkip?: () => void;
  className?: string;
}

// ============================================================================
// ONBOARDING FLOW COMPONENT
// ============================================================================

export function OnboardingFlow({
  steps,
  onComplete,
  onSkip,
  className,
}: OnboardingFlowProps) {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isValidating, setIsValidating] = useState(false);
  const [stepData, setStepData] = useState<Record<string, any>>({});

  const currentStep = steps[currentStepIndex];
  const progress = ((currentStepIndex + 1) / steps.length) * 100;
  const isFirstStep = currentStepIndex === 0;
  const isLastStep = currentStepIndex === steps.length - 1;

  // Navigate to next step
  const handleNext = useCallback(async () => {
    // Validate current step if validation function exists
    if (currentStep.validation) {
      setIsValidating(true);
      const isValid = await currentStep.validation();
      setIsValidating(false);

      if (!isValid) {
        return;
      }
    }

    if (isLastStep) {
      onComplete(stepData);
    } else {
      setCurrentStepIndex((prev) => prev + 1);
    }
  }, [currentStep, isLastStep, onComplete, stepData]);

  // Navigate to previous step
  const handleBack = useCallback(() => {
    if (!isFirstStep) {
      setCurrentStepIndex((prev) => prev - 1);
    }
  }, [isFirstStep]);

  // Skip onboarding
  const handleSkip = useCallback(() => {
    if (currentStep.canSkip && onSkip) {
      onSkip();
    }
  }, [currentStep, onSkip]);

  // Update step data
  const updateStepData = useCallback((key: string, value: any) => {
    setStepData((prev) => ({ ...prev, [key]: value }));
  }, []);

  return (
    <div
      className={cn(
        "min-h-screen bg-gradient-to-b from-background to-muted/20",
        className
      )}
     
    >
      {/* Progress Bar */}
      <div className="fixed top-0 inset-x-0 z-50 bg-background/80 backdrop-blur-sm border-b border-border">
        <div className="max-w-3xl mx-auto p-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-foreground">
              {currentStep.name}
            </h3>
            <span className="text-xs text-muted-foreground">
              {currentStepIndex + 1} من {steps.length}
            </span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
      </div>

      {/* Steps Content */}
      <div className="pt-24 pb-32 px-4">
        <div className="max-w-3xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep.id}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3 }}
            >
              {currentStep.component}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Navigation Footer */}
      <div className="fixed bottom-0 inset-x-0 bg-background/95 backdrop-blur-sm border-t border-border">
        <div className="max-w-3xl mx-auto p-4">
          <div className="flex items-center justify-between gap-4">
            {/* Back Button */}
            <Button
              variant="ghost"
              onClick={handleBack}
              disabled={isFirstStep}
              className={cn(
                "gap-2",
                isFirstStep && "invisible"
              )}
            >
              <ChevronRight className="w-4 h-4" />
              السابق
            </Button>

            {/* Skip Button */}
            {currentStep.canSkip && (
              <Button variant="ghost" onClick={handleSkip} className="text-muted-foreground">
                تخطي
              </Button>
            )}

            {/* Next/Complete Button */}
            <Button
              onClick={handleNext}
              disabled={isValidating}
              className="bg-premium-gradient gap-2 mr-auto"
              size="lg"
            >
              {isValidating
                ? "جاري التحقق..."
                : isLastStep
                  ? "إنهاء"
                  : "التالي"}
              {!isLastStep && <ChevronLeft className="w-4 h-4" />}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// ONBOARDING STEP WRAPPER
// ============================================================================

interface OnboardingStepWrapperProps {
  title: string;
  description?: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

export function OnboardingStepWrapper({
  title,
  description,
  icon,
  children,
  className,
}: OnboardingStepWrapperProps) {
  return (
    <div className={cn("space-y-6", className)}>
      {/* Header */}
      <div className="text-center space-y-3">
        {icon && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200 }}
            className="flex justify-center"
          >
            {icon}
          </motion.div>
        )}
        <h2 className="text-3xl md:text-4xl font-bold text-foreground">
          {title}
        </h2>
        {description && (
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {description}
          </p>
        )}
      </div>

      {/* Content */}
      <div className="mt-8">{children}</div>
    </div>
  );
}

export default OnboardingFlow;
