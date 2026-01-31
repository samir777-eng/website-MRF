"use client";

import { cn } from "@/lib/utils";
import { AlertCircle, CheckCircle } from "lucide-react";
import { useState } from "react";
import { Input } from "./input";
import { Label } from "./label";

interface FormFieldProps {
  label: string;
  name: string;
  type?: string;
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  error?: string;
  validate?: (value: string) => string | null;
  showSuccess?: boolean;
  placeholder?: string;
  required?: boolean;
  className?: string;
}

export function FormField({
  label,
  name,
  type = "text",
  value,
  onChange,
  onBlur,
  error,
  validate,
  showSuccess = true,
  placeholder,
  required = false,
  className,
}: FormFieldProps) {
  const [touched, setTouched] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  const handleBlur = () => {
    setTouched(true);
    if (validate) {
      const err = validate(value);
      setValidationError(err);
    }
    onBlur?.();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    onChange(newValue);

    if (touched && validate) {
      const err = validate(newValue);
      setValidationError(err);
    }
  };

  const displayError = error || validationError;
  const isValid = touched && !displayError && value.length > 0;

  return (
    <div className={cn("space-y-2", className)}>
      <Label htmlFor={name}>
        {label}
        {required && <span className="text-destructive me-1">*</span>}
      </Label>
      <div className="relative">
        <Input
          id={name}
          name={name}
          type={type}
          value={value}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder={placeholder}
          required={required}
          aria-required={required}
          aria-invalid={!!displayError}
          aria-describedby={displayError ? `${name}-error` : undefined}
          className={cn(
            displayError && "border-destructive focus-visible:ring-destructive",
            isValid &&
              showSuccess &&
              "border-green-600 focus-visible:ring-green-600 dark:border-green-500 dark:focus-visible:ring-green-500",
          )}
        />
        {showSuccess && isValid && (
          <CheckCircle className="absolute start-3 top-1/2 -translate-y-1/2 w-5 h-5 text-green-600 dark:text-green-400" />
        )}
        {displayError && (
          <AlertCircle className="absolute start-3 top-1/2 -translate-y-1/2 w-5 h-5 text-destructive" />
        )}
      </div>
      {displayError && (
        <p
          id={`${name}-error`}
          role="alert"
          className="text-sm text-destructive flex items-center gap-1"
        >
          {displayError}
        </p>
      )}
    </div>
  );
}
