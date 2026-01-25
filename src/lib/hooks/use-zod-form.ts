"use client";

import { useCallback, useState } from "react";
import { ZodError, ZodSchema } from "zod";

export interface FormState<T> {
  values: T;
  errors: Partial<Record<keyof T, string>>;
  touched: Partial<Record<keyof T, boolean>>;
  isValid: boolean;
  isSubmitting: boolean;
  isSubmitted: boolean;
}

export interface UseZodFormOptions<T> {
  schema: ZodSchema<T>;
  initialValues: T;
  onSubmit?: (values: T) => Promise<void> | void;
  validateOnBlur?: boolean;
  validateOnChange?: boolean;
}

export interface UseZodFormReturn<T> {
  // State
  values: T;
  errors: Partial<Record<keyof T, string>>;
  touched: Partial<Record<keyof T, boolean>>;
  isValid: boolean;
  isSubmitting: boolean;
  isSubmitted: boolean;

  // Actions
  setValue: (field: keyof T, value: T[keyof T]) => void;
  setValues: (values: Partial<T>) => void;
  setError: (field: keyof T, message: string) => void;
  clearError: (field: keyof T) => void;
  setTouched: (field: keyof T) => void;
  validateField: (field: keyof T) => string | null;
  validateForm: () => boolean;
  handleSubmit: (e?: React.FormEvent) => Promise<void>;
  reset: () => void;

  // Helpers
  getFieldProps: (field: keyof T) => {
    value: T[keyof T];
    onChange: (
      e: React.ChangeEvent<
        HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
      >
    ) => void;
    onBlur: () => void;
    error: string | undefined;
    touched: boolean;
  };
  getCheckboxProps: (field: keyof T) => {
    checked: boolean;
    onChange: (checked: boolean) => void;
    error: string | undefined;
  };
}

/**
 * A custom hook for form validation using Zod schemas
 * Provides consistent validation behavior across all forms
 */
export function useZodForm<T extends Record<string, unknown>>(
  options: UseZodFormOptions<T>
): UseZodFormReturn<T> {
  const {
    schema,
    initialValues,
    onSubmit,
    validateOnBlur = true,
    validateOnChange = false,
  } = options;

  const [state, setState] = useState<FormState<T>>({
    values: initialValues,
    errors: {},
    touched: {},
    isValid: false,
    isSubmitting: false,
    isSubmitted: false,
  });

  // Parse Zod error into field-specific errors
  const parseZodError = useCallback(
    (error: ZodError): Partial<Record<keyof T, string>> => {
      const fieldErrors: Partial<Record<keyof T, string>> = {};
      error.issues.forEach((issue) => {
        const path = issue.path[0] as keyof T;
        if (path && !fieldErrors[path]) {
          fieldErrors[path] = issue.message;
        }
      });
      return fieldErrors;
    },
    []
  );

  // Validate a single field
  const validateField = useCallback(
    (field: keyof T): string | null => {
      try {
        // Create a partial schema for single field validation
        const fieldValue = state.values[field];
        const result = schema.safeParse(state.values);

        if (!result.success) {
          const fieldError = result.error.issues.find(
            (e) => e.path[0] === field
          );
          return fieldError?.message || null;
        }
        return null;
      } catch {
        return null;
      }
    },
    [schema, state.values]
  );

  // Validate entire form
  const validateForm = useCallback((): boolean => {
    const result = schema.safeParse(state.values);

    if (!result.success) {
      const fieldErrors = parseZodError(result.error);
      setState((prev) => ({
        ...prev,
        errors: fieldErrors,
        isValid: false,
      }));
      return false;
    }

    setState((prev) => ({
      ...prev,
      errors: {},
      isValid: true,
    }));
    return true;
  }, [schema, state.values, parseZodError]);

  // Set a single field value
  const setValue = useCallback(
    (field: keyof T, value: T[keyof T]) => {
      setState((prev) => {
        const newValues = { ...prev.values, [field]: value };
        let newErrors = { ...prev.errors };

        // Clear error when user starts typing
        if (prev.errors[field]) {
          delete newErrors[field];
        }

        // Validate on change if enabled
        if (validateOnChange && prev.touched[field]) {
          const result = schema.safeParse(newValues);
          if (!result.success) {
            const fieldError = result.error.issues.find(
              (e) => e.path[0] === field
            );
            if (fieldError) {
              newErrors[field] = fieldError.message;
            }
          }
        }

        return {
          ...prev,
          values: newValues,
          errors: newErrors,
        };
      });
    },
    [schema, validateOnChange]
  );

  // Set multiple values at once
  const setValues = useCallback((values: Partial<T>) => {
    setState((prev) => ({
      ...prev,
      values: { ...prev.values, ...values },
    }));
  }, []);

  // Set a field as touched
  const setTouched = useCallback(
    (field: keyof T) => {
      setState((prev) => {
        const newTouched = { ...prev.touched, [field]: true };
        let newErrors = { ...prev.errors };

        // Validate on blur if enabled
        if (validateOnBlur) {
          const result = schema.safeParse(prev.values);
          if (!result.success) {
            const fieldError = result.error.issues.find(
              (e) => e.path[0] === field
            );
            if (fieldError) {
              newErrors[field] = fieldError.message;
            }
          } else {
            delete newErrors[field];
          }
        }

        return {
          ...prev,
          touched: newTouched,
          errors: newErrors,
        };
      });
    },
    [schema, validateOnBlur]
  );

  // Manually set an error
  const setError = useCallback((field: keyof T, message: string) => {
    setState((prev) => ({
      ...prev,
      errors: { ...prev.errors, [field]: message },
    }));
  }, []);

  // Clear a field error
  const clearError = useCallback((field: keyof T) => {
    setState((prev) => {
      const newErrors = { ...prev.errors };
      delete newErrors[field];
      return { ...prev, errors: newErrors };
    });
  }, []);

  // Handle form submission
  const handleSubmit = useCallback(
    async (e?: React.FormEvent) => {
      e?.preventDefault();

      // Mark all fields as touched
      const allTouched = Object.keys(state.values).reduce(
        (acc, key) => {
          acc[key as keyof T] = true;
          return acc;
        },
        {} as Partial<Record<keyof T, boolean>>
      );

      setState((prev) => ({ ...prev, touched: allTouched, isSubmitted: true }));

      const isValid = validateForm();
      if (!isValid) {
        return;
      }

      if (onSubmit) {
        setState((prev) => ({ ...prev, isSubmitting: true }));
        try {
          await onSubmit(state.values);
        } finally {
          setState((prev) => ({ ...prev, isSubmitting: false }));
        }
      }
    },
    [state.values, validateForm, onSubmit]
  );

  // Reset form to initial values
  const reset = useCallback(() => {
    setState({
      values: initialValues,
      errors: {},
      touched: {},
      isValid: false,
      isSubmitting: false,
      isSubmitted: false,
    });
  }, [initialValues]);

  // Get props for input fields
  const getFieldProps = useCallback(
    (field: keyof T) => ({
      value: state.values[field] as T[keyof T],
      onChange: (
        e: React.ChangeEvent<
          HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
        >
      ) => {
        const value =
          e.target.type === "checkbox"
            ? (e.target as HTMLInputElement).checked
            : e.target.value;
        setValue(field, value as T[keyof T]);
      },
      onBlur: () => setTouched(field),
      error: state.errors[field],
      touched: !!state.touched[field],
    }),
    [state.values, state.errors, state.touched, setValue, setTouched]
  );

  // Get props for checkbox fields
  const getCheckboxProps = useCallback(
    (field: keyof T) => ({
      checked: state.values[field] as boolean,
      onChange: (checked: boolean) => setValue(field, checked as T[keyof T]),
      error: state.errors[field],
    }),
    [state.values, state.errors, setValue]
  );

  return {
    // State
    values: state.values,
    errors: state.errors,
    touched: state.touched,
    isValid: state.isValid,
    isSubmitting: state.isSubmitting,
    isSubmitted: state.isSubmitted,

    // Actions
    setValue,
    setValues,
    setError,
    clearError,
    setTouched,
    validateField,
    validateForm,
    handleSubmit,
    reset,

    // Helpers
    getFieldProps,
    getCheckboxProps,
  };
}

/**
 * Get first error from a Zod validation result
 */
export function getFirstError<T>(
  schema: ZodSchema<T>,
  values: T
): { field: string; message: string } | null {
  const result = schema.safeParse(values);
  if (result.success) return null;

  const firstIssue = result.error.issues[0];
  return {
    field: String(firstIssue.path[0] || "unknown"),
    message: firstIssue.message,
  };
}
