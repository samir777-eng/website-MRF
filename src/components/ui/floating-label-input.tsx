"use client";

import { cn } from "@/lib/utils";
import { AlertCircle, CheckCircle2 } from "lucide-react";
import { useState } from "react";
import { Input } from "./input";

interface FloatingLabelInputProps {
  label: string;
  name: string;
  type?: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  success?: boolean;
  placeholder?: string;
  required?: boolean;
  className?: string;
  disabled?: boolean;
  onValidate?: (value: string) => string | undefined;
  "data-testid"?: string;
  autoComplete?: string;
}

export function FloatingLabelInput({
  label,
  name,
  type = "text",
  value,
  onChange,
  error,
  success = false,
  placeholder,
  required = false,
  className,
  disabled = false,
  onValidate,
  "data-testid": dataTestId,
  autoComplete,
}: FloatingLabelInputProps) {
  const [isFocused, setIsFocused] = useState(false);
  const [touched, setTouched] = useState(false);
  const hasValue = value.length > 0;
  const isFloating = isFocused || hasValue;

  // Show success only if touched, has value, no error, and success prop is true
  const showSuccess = touched && hasValue && !error && success;
  const showError = touched && error;

  const handleBlur = () => {
    setIsFocused(false);
    setTouched(true);

    // Run validation on blur if provided
    if (onValidate && value) {
      const validationError = onValidate(value);
      if (validationError) {
        // Validation error will be handled by parent component
      }
    }
  };

  return (
    <div className={cn("relative", className)}>
      <Input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setIsFocused(true)}
        onBlur={handleBlur}
        placeholder={isFloating ? placeholder : ""}
        disabled={disabled}
        data-testid={dataTestId || name}
        autoComplete={autoComplete}
        className={cn(
          "pt-6 pb-2 pe-10",
          showError && "border-destructive focus-visible:ring-destructive",
          showSuccess &&
            "border-green-600 focus-visible:ring-green-600 dark:border-green-500 dark:focus-visible:ring-green-500"
        )}
      />
      <label
        htmlFor={name}
        className={cn(
          "absolute end-3 transition-all pointer-events-none font-medium",
          isFloating
            ? "top-1.5 text-sm text-muted-foreground"
            : "top-1/2 -translate-y-1/2 text-base text-muted-foreground"
        )}
      >
        {label}
        {required && <span className="text-destructive mr-1">*</span>}
      </label>

      {/* Success/Error Icon */}
      {(showSuccess || showError) && (
        <div className="absolute start-3 top-1/2 -translate-y-1/2">
          {showSuccess && (
            <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400" />
          )}
          {showError && <AlertCircle className="w-5 h-5 text-destructive" />}
        </div>
      )}

      {/* Error Message */}
      {showError && (
        <p className="text-sm text-destructive mt-2 flex items-center gap-1.5">
          <AlertCircle className="w-4 h-4 shrink-0" />
          {error}
        </p>
      )}

      {/* Success Message (optional) */}
      {showSuccess && !error && (
        <p className="text-sm text-green-600 dark:text-green-400 mt-2 flex items-center gap-1.5">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          صحيح
        </p>
      )}
    </div>
  );
}
