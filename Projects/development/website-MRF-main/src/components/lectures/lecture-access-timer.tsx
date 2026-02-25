"use client";

import { formatTimeRemaining } from "@/lib/lives-system";
import { cn } from "@/lib/utils";
import { AlertTriangle, Clock } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

interface LectureAccessTimerProps {
  expiresAt: Date;
  className?: string;
  variant?: "default" | "compact" | "large";
  showIcon?: boolean;
  onExpire?: () => void;
}

export function LectureAccessTimer({
  expiresAt,
  className,
  variant = "default",
  showIcon = true,
  onExpire,
}: LectureAccessTimerProps) {
  const [timeRemaining, setTimeRemaining] = useState<string>("");
  const [isExpired, setIsExpired] = useState(false);
  const [isUrgent, setIsUrgent] = useState(false);

  const updateTimer = useCallback(() => {
    const now = new Date();
    const diff = expiresAt.getTime() - now.getTime();

    if (diff <= 0) {
      setIsExpired(true);
      setTimeRemaining("انتهى الوقت");
      onExpire?.();
      return;
    }

    // Calculate days and hours from diff
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

    // Less than 24 hours = urgent
    setIsUrgent(diff < 24 * 60 * 60 * 1000);
    setTimeRemaining(formatTimeRemaining(days, hours));
  }, [expiresAt, onExpire]);

  useEffect(() => {
    updateTimer();
    const interval = setInterval(updateTimer, 60000); // Update every minute
    return () => clearInterval(interval);
  }, [updateTimer]);

  const sizeClasses = {
    compact: "text-xs",
    default: "text-sm",
    large: "text-base font-medium",
  };

  const iconSizes = {
    compact: "w-3 h-3",
    default: "w-4 h-4",
    large: "w-5 h-5",
  };

  return (
    <div
      className={cn(
        "flex items-center gap-1.5",
        sizeClasses[variant],
        isExpired
          ? "text-destructive"
          : isUrgent
            ? "text-amber-500"
            : "text-muted-foreground",
        className
      )}
      role="timer"
      aria-live="polite"
      aria-label={`الوقت المتبقي: ${timeRemaining}`}
    >
      {showIcon && (
        <>
          {isUrgent || isExpired ? (
            <AlertTriangle className={iconSizes[variant]} />
          ) : (
            <Clock className={iconSizes[variant]} />
          )}
        </>
      )}
      <span>{timeRemaining}</span>
    </div>
  );
}

// Countdown variant with days/hours/minutes/seconds
interface DetailedCountdownProps {
  expiresAt: Date;
  className?: string;
  onExpire?: () => void;
}

export function DetailedCountdown({
  expiresAt,
  className,
  onExpire,
}: DetailedCountdownProps) {
  const [time, setTime] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const [isExpired, setIsExpired] = useState(false);

  const updateTimer = useCallback(() => {
    const now = new Date();
    const diff = expiresAt.getTime() - now.getTime();

    if (diff <= 0) {
      setIsExpired(true);
      setTime({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      onExpire?.();
      return;
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    setTime({ days, hours, minutes, seconds });
  }, [expiresAt, onExpire]);

  useEffect(() => {
    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [updateTimer]);

  if (isExpired) {
    return (
      <div className={cn("text-destructive font-medium", className)}>
        انتهى الوقت
      </div>
    );
  }

  const TimeUnit = ({ value, label }: { value: number; label: string }) => (
    <div className="flex flex-col items-center">
      <span className="text-2xl font-bold tabular-nums">
        {String(value).padStart(2, "0")}
      </span>
      <span className="text-xs text-muted-foreground">{label}</span>
    </div>
  );

  return (
    <div
      className={cn("flex items-center gap-3 rtl:flex-row-reverse", className)}
    >
      {time.days > 0 && <TimeUnit value={time.days} label="يوم" />}
      <TimeUnit value={time.hours} label="ساعة" />
      <TimeUnit value={time.minutes} label="دقيقة" />
      <TimeUnit value={time.seconds} label="ثانية" />
    </div>
  );
}
