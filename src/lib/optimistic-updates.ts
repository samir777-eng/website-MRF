/**
 * Optimistic UI Helper - Phase 1 Task 1.3
 * Utilities for implementing optimistic updates throughout the app
 */

import { useCallback, useState } from "react";

// ============================================================================
// TYPES
// ============================================================================

export interface OptimisticUpdate<T> {
  optimisticData: T;
  revert: () => void;
}

export interface OptimisticUpdateOptions<T, R> {
  /** The current data before the update */
  currentData: T;
  /** Function to apply optimistic update to current data */
  updateFn: (data: T) => T;
  /** API call that performs the actual update */
  apiFn: () => Promise<R>;
  /** Callback when API call succeeds */
  onSuccess?: (result: R) => void;
  /** Callback when API call fails (after revert) */
  onError?: (error: Error) => void;
  /** Custom error message */
  errorMessage?: string;
}

// ============================================================================
// OPTIMISTIC UPDATE HOOK
// ============================================================================

/**
 * Hook for managing optimistic updates with automatic revert on error
 * 
 * @example
 * ```tsx
 * const { performOptimisticUpdate, isUpdating } = useOptimisticUpdate();
 * 
 * const completeLesson = async (lessonId: string) => {
 *   await performOptimisticUpdate({
 *     currentData: lessons,
 *     updateFn: (data) => data.map(l => 
 *       l.id === lessonId ? { ...l, completed: true } : l
 *     ),
 *     apiFn: () => api.completeLesson(lessonId),
 *     onSuccess: () => toast.success('تم إكمال الدرس'),
 *     onError: () => toast.error('حدث خطأ'),
 *   });
 * };
 * ```
 */
export function useOptimisticUpdate<T>() {
  const [isUpdating, setIsUpdating] = useState(false);

  const performOptimisticUpdate = useCallback(
    async <R,>({
      currentData,
      updateFn,
      apiFn,
      onSuccess,
      onError,
      errorMessage = "حدث خطأ، يرجى المحاولة مرة أخرى",
    }: OptimisticUpdateOptions<T, R>) => {
      // Store original data for potential revert
      const originalData = currentData;
      let reverted = false;

      const revert = () => {
        if (!reverted) {
          // This should trigger a state update in the calling component
          reverted = true;
          return originalData;
        }
        return currentData;
      };

      try {
        setIsUpdating(true);

        // Apply optimistic update immediately
        const optimisticData = updateFn(currentData);

        // Perform API call
        const result = await apiFn();

        // Success - call success callback
        onSuccess?.(result);

        return { success: true, data: result };
      } catch (error) {
        // Error - revert optimistic update
        const revertedData = revert();

        // Call error callback
        onError?.(error instanceof Error ? error : new Error(errorMessage));

        return { success: false, data: revertedData, error };
      } finally {
        setIsUpdating(false);
      }
    },
    []
  );

  return {
    performOptimisticUpdate,
    isUpdating,
  };
}

// ============================================================================
// OPTIMISTIC UPDATE UTILITIES
// ============================================================================

/**
 * Performs an optimistic update on an array by updating a single item
 */
export function optimisticUpdateArray<T extends { id: string | number }>(
  array: T[],
  itemId: string | number,
  updateFn: (item: T) => T
): T[] {
  return array.map((item) => (item.id === itemId ? updateFn(item) : item));
}

/**
 * Performs an optimistic update by adding an item to an array
 */
export function optimisticAddToArray<T>(array: T[], newItem: T): T[] {
  return [...array, newItem];
}

/**
 * Performs an optimistic update by removing an item from an array
 */
export function optimisticRemoveFromArray<T extends { id: string | number }>(
  array: T[],
  itemId: string | number
): T[] {
  return array.filter((item) => item.id !== itemId);
}

/**
 * Performs an optimistic update by updating a nested property
 */
export function optimisticUpdateNested<T extends Record<string, any>>(
  obj: T,
  path: string[],
  value: any
): T {
  if (path.length === 0) return value;

  const [head, ...tail] = path;
  return {
    ...obj,
    [head]: tail.length === 0 ? value : optimisticUpdateNested(obj[head], tail, value),
  };
}

// ============================================================================
// EXAMPLE USAGE PATTERNS
// ============================================================================

/**
 * Example: Optimistic Lesson Completion
 * 
 * ```tsx
 * const { performOptimisticUpdate } = useOptimisticUpdate();
 * const [lessons, setLessons] = useState<Lesson[]>([]);
 * const [userStats, setUserStats] = useState<UserStats>({ totalXP: 0 });
 * 
 * const completeLesson = async (lessonId: string) => {
 *   const lessonXP = 100;
 *   
 *   const result = await performOptimisticUpdate({
 *     currentData: { lessons, userStats },
 *     updateFn: (data) => ({
 *       lessons: optimisticUpdateArray(
 *         data.lessons,
 *         lessonId,
 *         (lesson) => ({ ...lesson, completed: true, progress: 100 })
 *       ),
 *       userStats: {
 *         ...data.userStats,
 *         totalXP: data.userStats.totalXP + lessonXP,
 *       },
 *     }),
 *     apiFn: () => api.completeLesson(lessonId),
 *     onSuccess: () => {
 *       toast.success('تم إكمال الدرس! +100 XP');
 *       celebration.showXPGain(lessonXP);
 *     },
 *     onError: () => {
 *       toast.error('حدث خطأ، يرجى المحاولة مرة أخرى');
 *     },
 *   });
 * 
 *   if (result.success) {
 *     setLessons(result.data.lessons);
 *     setUserStats(result.data.userStats);
 *   }
 * };
 * ```
 */

/**
 * Example: Optimistic Quiz Answer Submit
 * 
 * ```tsx
 * const submitAnswer = async (questionId: string, answer: string) => {
 *   await performOptimisticUpdate({
 *     currentData: answers,
 *     updateFn: (data) => ({
 *       ...data,
 *       [questionId]: { answer, isCorrect: true, timestamp: Date.now() },
 *     }),
 *     apiFn: () => api.submitQuizAnswer(questionId, answer),
 *     onSuccess: (result) => {
 *       if (result.isCorrect) {
 *         celebration.showXPGain(10);
 *       }
 *     },
 *     onError: () => {
 *       toast.error('فشل في تسجيل الإجابة');
 *     },
 *   });
 * };
 * ```
 */

export const OptimisticUpdateExamples = {
  lessonCompletion: `
// Optimistic Lesson Completion Example
const completeLesson = async (lessonId: string) => {
  await performOptimisticUpdate({
    currentData: lessons,
    updateFn: (data) => optimisticUpdateArray(
      data,
      lessonId,
      (lesson) => ({ ...lesson, completed: true })
    ),
    apiFn: () => api.completeLesson(lessonId),
    onSuccess: () => toast.success('تم إكمال الدرس'),
    onError: () => toast.error('حدث خطأ'),
  });
};
  `,

  xpGain: `
// Optimistic XP Gain Example
const addXP = async (amount: number) => {
  await performOptimisticUpdate({
    currentData: userStats,
    updateFn: (data) => ({ ...data, totalXP: data.totalXP + amount }),
    apiFn: () => api.addXP(amount),
    onSuccess: () => celebration.showXPGain(amount),
    onError: () => toast.error('فشل في إضافة النقاط'),
  });
};
  `,
};
