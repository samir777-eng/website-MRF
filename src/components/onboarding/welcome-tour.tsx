"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ArrowLeft, ArrowRight, CheckCircle } from "lucide-react";
import { useState } from "react";

interface TourStep {
  title: string;
  description: string;
  image?: string;
}

const tourSteps: TourStep[] = [
  {
    title: "مرحباً بك في منصة الأستاذ رضا الفاروق",
    description: "منصة تعليمية متكاملة للطلاب المصريين في المرحلة الثانوية",
  },
  {
    title: "دروس فيديو تفاعلية",
    description:
      "شاهد دروس فيديو عالية الجودة مع إمكانية تدوين الملاحظات والإشارات المرجعية",
  },
  {
    title: "اختبارات وتقييمات",
    description: "اختبر معلوماتك مع اختبارات تفاعلية وتقييمات فورية",
  },
  {
    title: "نظام المكافآت والإنجازات",
    description: "اكسب نقاط الخبرة والشارات والإنجازات مع تقدمك في التعلم",
  },
  {
    title: "تتبع التقدم",
    description: "راقب تقدمك وأدائك من خلال لوحة التحكم الشخصية",
  },
];

export function WelcomeTour() {
  const [isOpen, setIsOpen] = useState(true);
  const [currentStep, setCurrentStep] = useState(0);

  const handleNext = () => {
    if (currentStep < tourSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = () => {
    localStorage.setItem("onboarding_completed", "true");
    setIsOpen(false);
  };

  const handleSkip = () => {
    localStorage.setItem("onboarding_skipped", "true");
    setIsOpen(false);
  };

  const step = tourSteps[currentStep];
  const isLastStep = currentStep === tourSteps.length - 1;

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="max-w-2xl" dir="rtl">
        <DialogHeader>
          <DialogTitle>{step.title}</DialogTitle>
          <DialogDescription>{step.description}</DialogDescription>
        </DialogHeader>

        <div className="py-6">
          {step.image && (
            <div className="mb-6 rounded-lg overflow-hidden bg-muted h-64 flex items-center justify-center">
              <span className="text-muted-foreground">صورة توضيحية</span>
            </div>
          )}

          <div className="flex items-center justify-center gap-2 mb-6">
            {tourSteps.map((_, index) => (
              <div
                key={index}
                className={`h-2 rounded-full transition-all ${
                  index === currentStep
                    ? "w-8 bg-primary"
                    : index < currentStep
                      ? "w-2 bg-primary/50"
                      : "w-2 bg-muted"
                }`}
              />
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between">
          <Button variant="ghost" onClick={handleSkip}>
            تخطي
          </Button>

          <div className="flex items-center gap-2">
            {currentStep > 0 && (
              <Button variant="outline" onClick={handlePrevious}>
                <ArrowRight className="w-4 h-4 ml-2 rtl:-scale-x-100" />
                السابق
              </Button>
            )}
            <Button onClick={handleNext}>
              {isLastStep ? (
                <>
                  <CheckCircle className="w-4 h-4 ml-2" />
                  ابدأ الآن
                </>
              ) : (
                <>
                  التالي
                  <ArrowLeft className="w-4 h-4 mr-2 rtl:-scale-x-100" />
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
