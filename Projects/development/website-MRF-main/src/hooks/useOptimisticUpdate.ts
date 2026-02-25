"use client";

import { useState } from "react";
import { useToast } from "./useToast";

interface OptimisticUpdateOptions<T> {
  onSuccess?: (data: T) => void;
  onError?: (error: Error) => void;
  successMessage?: string;
  errorMessage?: string;
}

export function useOptimisticUpdate<T>() {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const execute = async (
    optimisticValue: T,
    apiCall: () => Promise<T>,
    options?: OptimisticUpdateOptions<T>
  ): Promise<T | null> => {
    setIsLoading(true);

    // Immediately return optimistic value
    const rollback = optimisticValue;

    try {
      // Execute API call
      const result = await apiCall();

      if (options?.successMessage) {
        toast({
          title: "نجح",
          description: options.successMessage,
          variant: "success",
        });
      }

      options?.onSuccess?.(result);
      return result;
    } catch (error) {
      // Rollback on error
      if (options?.errorMessage) {
        toast({
          title: "خطأ",
          description: options.errorMessage,
          variant: "destructive",
        });
      }

      options?.onError?.(error as Error);
      return rollback;
    } finally {
      setIsLoading(false);
    }
  };

  return { execute, isLoading };
}

