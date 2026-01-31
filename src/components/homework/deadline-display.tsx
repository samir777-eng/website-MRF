"use client";

import { Calendar } from "lucide-react";
import { useEffect, useState } from "react";

interface DeadlineDisplayProps {
  deadline: Date;
  lateSubmissionDeadline?: Date;
  allowLateSubmission?: boolean;
  latePenalty?: number;
}

/**
 * Deadline display component that formats dates on the client side only.
 * Uses a simple mounted state to avoid hydration mismatch.
 *
 * The key insight: we render the SAME structure on both server and client,
 * but with different text content. suppressHydrationWarning handles text-only differences.
 */
export function DeadlineDisplay({
  deadline,
  lateSubmissionDeadline,
  allowLateSubmission,
  latePenalty,
}: DeadlineDisplayProps) {
  // Start with loading text - this will be the same on server and initial client render
  const [formattedDeadline, setFormattedDeadline] = useState("جاري التحميل...");
  const [timeRemaining, setTimeRemaining] = useState("");
  const [isLate, setIsLate] = useState(false);

  useEffect(() => {
    const calculateTimeState = () => {
      const now = new Date();
      const isOverdue = now > deadline;
      const isLateSubmission =
        isOverdue &&
        allowLateSubmission &&
        lateSubmissionDeadline &&
        now <= lateSubmissionDeadline;

      const timeUntilDeadline = deadline.getTime() - now.getTime();
      const daysUntilDeadline = Math.max(
        0,
        Math.floor(timeUntilDeadline / (1000 * 60 * 60 * 24)),
      );
      const hoursUntilDeadline = Math.max(
        0,
        Math.floor(
          (timeUntilDeadline % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
        ),
      );

      const formatted = `${deadline.toLocaleDateString("ar-EG", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      })} - ${deadline.toLocaleTimeString("ar-EG", {
        hour: "2-digit",
        minute: "2-digit",
      })}`;

      setFormattedDeadline(formatted);
      setTimeRemaining(
        daysUntilDeadline >= 0
          ? `متبقي: ${daysUntilDeadline} يوم و ${hoursUntilDeadline} ساعة`
          : "",
      );
      setIsLate(!!isLateSubmission);
    };

    calculateTimeState();
    const interval = setInterval(calculateTimeState, 60000);
    return () => clearInterval(interval);
  }, [deadline, lateSubmissionDeadline, allowLateSubmission]);

  return (
    <div className="p-4 rounded-lg flex items-start gap-3 bg-blue-50 dark:bg-blue-950/20">
      <Calendar className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
      <div className="flex-1">
        <h3 className="font-bold mb-1">الموعد النهائي</h3>
        {/*
          suppressHydrationWarning tells React to ignore text content differences.
          The structure (p tag) is the same, only the text differs.
        */}
        <p className="text-sm text-muted-foreground" suppressHydrationWarning>
          {formattedDeadline}
        </p>
        {/*
          For conditional elements, we always render them but control visibility.
          This ensures the same structure on server and client.
        */}
        <p
          className="text-sm font-medium mt-1"
          style={{ display: timeRemaining ? "block" : "none" }}
          suppressHydrationWarning
        >
          {timeRemaining || "\u00A0"}
        </p>
        <p
          className="text-sm text-red-600 font-medium mt-1"
          style={{ display: isLate && latePenalty ? "block" : "none" }}
          suppressHydrationWarning
        >
          {isLate && latePenalty
            ? `⚠️ التسليم المتأخر سيؤدي لخصم ${latePenalty}% من الدرجة`
            : "\u00A0"}
        </p>
      </div>
    </div>
  );
}
