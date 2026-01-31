"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { Clock, LogOut, RefreshCw } from "lucide-react";
import { useEffect, useState } from "react";

interface SessionExpiryModalProps {
  isOpen: boolean;
  onExtendSession: () => void;
  onLogout: () => void;
  secondsRemaining: number;
  isRefreshing?: boolean;
}

export function SessionExpiryModal({
  isOpen,
  onExtendSession,
  onLogout,
  secondsRemaining,
  isRefreshing = false,
}: SessionExpiryModalProps) {
  const [countdown, setCountdown] = useState(secondsRemaining);

  // Update countdown when modal opens or secondsRemaining changes
  useEffect(() => {
    setCountdown(secondsRemaining);
  }, [secondsRemaining, isOpen]);

  // Countdown timer
  useEffect(() => {
    if (!isOpen || countdown <= 0) return;

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          onLogout();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isOpen, countdown, onLogout]);

  // Format time remaining
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    if (mins > 0) {
      return `${mins} دقيقة و ${secs} ثانية`;
    }
    return `${secs} ثانية`;
  };

  // Progress percentage for visual indicator
  const progressPercentage = (countdown / 60) * 100;

  return (
    <Dialog open={isOpen} onOpenChange={() => {}}>
      <DialogContent dir="rtl" className="sm:max-w-md text-center">
        <DialogHeader className="space-y-4">
          {/* Warning Icon with animated ring */}
          <div className="mx-auto relative">
            <div
              className={cn(
                "w-20 h-20 rounded-full flex items-center justify-center",
                "bg-gradient-to-br from-amber-100 to-amber-200",
                "dark:from-amber-900/30 dark:to-amber-800/30",
                "shadow-lg shadow-amber-500/20",
              )}
            >
              <Clock className="w-10 h-10 text-amber-600 dark:text-amber-400" />
            </div>
            {/* Animated ring */}
            <svg
              className="absolute inset-0 w-20 h-20 -rotate-90"
              viewBox="0 0 80 80"
            >
              <circle
                cx="40"
                cy="40"
                r="36"
                fill="none"
                stroke="currentColor"
                strokeWidth="4"
                className="text-amber-200 dark:text-amber-900/50"
              />
              <circle
                cx="40"
                cy="40"
                r="36"
                fill="none"
                stroke="currentColor"
                strokeWidth="4"
                strokeDasharray={`${2 * Math.PI * 36}`}
                strokeDashoffset={`${2 * Math.PI * 36 * (1 - progressPercentage / 100)}`}
                className="text-amber-500 transition-all duration-1000"
                strokeLinecap="round"
              />
            </svg>
          </div>

          <DialogTitle className="text-2xl font-bold text-amber-600 dark:text-amber-400">
            جلستك على وشك الانتهاء
          </DialogTitle>

          <DialogDescription className="text-base text-muted-foreground">
            سيتم تسجيل خروجك تلقائياً خلال{" "}
            <span className="font-bold text-amber-600 dark:text-amber-400">
              {formatTime(countdown)}
            </span>
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          <p className="text-sm text-muted-foreground">
            هل تريد تمديد جلستك والاستمرار في استخدام المنصة؟
          </p>
        </div>

        <DialogFooter className="flex flex-col sm:flex-row gap-3">
          <Button
            onClick={onExtendSession}
            disabled={isRefreshing}
            className={cn(
              "flex-1 bg-gradient-to-r from-blue-600 to-purple-600",
              "hover:from-blue-700 hover:to-purple-700 text-white",
            )}
            size="lg"
          >
            {isRefreshing ? (
              <>
                <RefreshCw className="w-5 h-5 me-2 animate-spin" />
                جاري التمديد...
              </>
            ) : (
              <>
                <RefreshCw className="w-5 h-5 me-2" />
                تمديد الجلسة
              </>
            )}
          </Button>
          <Button
            variant="outline"
            onClick={onLogout}
            disabled={isRefreshing}
            className="flex-1"
            size="lg"
          >
            <LogOut className="w-5 h-5 me-2" />
            تسجيل الخروج
          </Button>
        </DialogFooter>

        {/* Warning message */}
        <p className="text-xs text-muted-foreground mt-2">
          للحفاظ على أمان حسابك، يتم إنهاء الجلسات غير النشطة تلقائياً
        </p>
      </DialogContent>
    </Dialog>
  );
}

export default SessionExpiryModal;
