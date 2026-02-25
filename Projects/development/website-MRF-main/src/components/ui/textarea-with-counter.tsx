"use client";

import { Textarea } from "./textarea";
import { cn } from "@/lib/utils";

interface TextareaWithCounterProps {
  value: string;
  onChange: (value: string) => void;
  maxLength?: number;
  label?: string;
  placeholder?: string;
  error?: string;
  className?: string;
  rows?: number;
}

export function TextareaWithCounter({
  value,
  onChange,
  maxLength = 500,
  label,
  placeholder,
  error,
  className,
  rows = 4,
}: TextareaWithCounterProps) {
  const remaining = maxLength - value.length;
  const isNearLimit = remaining < maxLength * 0.1;
  const isOverLimit = remaining < 0;

  return (
    <div className={cn("space-y-2", className)}>
      {label && (
        <label className="text-sm font-medium">{label}</label>
      )}
      <Textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
        maxLength={maxLength}
        className={cn(
          error && "border-destructive focus-visible:ring-destructive"
        )}
      />
      <div className="flex items-center justify-between text-sm">
        {error && (
          <span className="text-destructive">{error}</span>
        )}
        <span
          className={cn(
            "mr-auto",
            isOverLimit && "text-destructive",
            isNearLimit && !isOverLimit && "text-yellow-600"
          )}
        >
          {remaining} حرف متبقي
        </span>
      </div>
    </div>
  );
}

