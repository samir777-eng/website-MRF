"use client";

import { useCallback } from "react";
import { useToast } from "@/hooks/useToast";
import {
  parseAPIError,
  isRetriableError,
  ERROR_MESSAGES,
} from "@/lib/utils/error-messages";

interface ErrorHandlerOptions {
  showToast?: boolean;
  onError?: (message: string) => void;
  retryAction?: () => Promise<void>;
}

/**
 * Custom hook for consistent error handling with toast notifications
 */
export function useErrorHandler() {
  const {
    error: showErrorToast,
    success: showSuccessToast,
    warning: showWarningToast,
  } = useToast();

  /**
   * Handle an error with optional toast notification
   */
  const handleError = useCallback(
    (error: unknown, options: ErrorHandlerOptions = {}) => {
      const { showToast = true, onError, retryAction } = options;

      const message = parseAPIError(error);
      const canRetry = isRetriableError(error);

      if (showToast) {
        if (canRetry && retryAction) {
          showWarningToast(message, "يمكنك المحاولة مرة أخرى");
        } else {
          showErrorToast("خطأ", message);
        }
      }

      if (onError) {
        onError(message);
      }

      // Log error for debugging (could integrate with error reporting service)
      console.error("[Error Handler]", error);

      return { message, canRetry };
    },
    [showErrorToast, showWarningToast],
  );

  /**
   * Handle a successful operation with toast notification
   */
  const handleSuccess = useCallback(
    (messageKey: keyof typeof ERROR_MESSAGES, customMessage?: string) => {
      const message = customMessage || ERROR_MESSAGES[messageKey] || messageKey;
      showSuccessToast("نجاح", message);
    },
    [showSuccessToast],
  );

  /**
   * Wrapper for async operations with automatic error handling
   */
  const withErrorHandling = useCallback(
    async <T>(
      operation: () => Promise<T>,
      options: ErrorHandlerOptions & {
        successMessage?: keyof typeof ERROR_MESSAGES;
        loadingMessage?: string;
      } = {},
    ): Promise<{ success: boolean; data?: T; error?: string }> => {
      try {
        const result = await operation();

        if (options.successMessage) {
          handleSuccess(options.successMessage);
        }

        return { success: true, data: result };
      } catch (error) {
        const { message } = handleError(error, options);
        return { success: false, error: message };
      }
    },
    [handleError, handleSuccess],
  );

  return {
    handleError,
    handleSuccess,
    withErrorHandling,
    // Expose common error messages for direct use
    messages: ERROR_MESSAGES,
  };
}
