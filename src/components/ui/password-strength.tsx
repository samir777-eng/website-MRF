"use client";

import { cn } from "@/lib/utils";

interface PasswordStrengthProps {
  password: string;
  className?: string;
}

type StrengthLevel = "weak" | "fair" | "good" | "strong";

const strengthConfig: Record<
  StrengthLevel,
  { label: string; barColor: string; textColor: string }
> = {
  weak: {
    label: "ضعيف",
    barColor: "bg-red-500 dark:bg-red-400",
    textColor: "text-red-600 dark:text-red-400",
  },
  fair: {
    label: "متوسط",
    barColor: "bg-amber-500 dark:bg-amber-400",
    textColor: "text-amber-600 dark:text-amber-400",
  },
  good: {
    label: "جيد",
    barColor: "bg-blue-500 dark:bg-blue-400",
    textColor: "text-blue-600 dark:text-blue-400",
  },
  strong: {
    label: "قوي جداً",
    barColor: "bg-green-500 dark:bg-green-400",
    textColor: "text-green-600 dark:text-green-400",
  },
};

function calculateStrength(password: string): {
  score: number;
  level: StrengthLevel;
} {
  let score = 0;

  if (password.length >= 8) score++;
  if (password.length >= 12) score++;
  if (/[a-z]/.test(password)) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^a-zA-Z0-9]/.test(password)) score++;

  if (score <= 2) {
    return { score: 1, level: "weak" };
  } else if (score <= 4) {
    return { score: 2, level: "fair" };
  } else if (score <= 5) {
    return { score: 3, level: "good" };
  } else {
    return { score: 4, level: "strong" };
  }
}

export function PasswordStrength({
  password,
  className,
}: PasswordStrengthProps) {
  if (!password) return null;

  const { score, level } = calculateStrength(password);
  const config = strengthConfig[level];
  const percentage = (score / 4) * 100;

  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex items-center justify-between text-sm">
        <span className="text-muted-foreground">قوة كلمة المرور:</span>
        <span className={cn("font-medium", config.textColor)}>
          {config.label}
        </span>
      </div>
      <div className="h-2 bg-muted rounded-full overflow-hidden">
        <div
          className={cn(
            "h-full rounded-full transition-all duration-300",
            config.barColor,
          )}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
