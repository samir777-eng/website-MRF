"use client";

import { useCallback, useEffect, useState } from "react";

/**
 * Lecture Progress Tracking Hook
 *
 * Tracks and enforces the learning progression sequence:
 * Pre-Quiz → Videos → Post-Quiz → Homework
 *
 * Progress is stored in localStorage per lecture.
 */

export interface LectureProgressData {
  lectureId: string;
  preQuizCompleted: boolean;
  preQuizScore?: number;
  preQuizCompletedAt?: string;
  videosWatched: string[]; // video IDs
  allVideosCompleted: boolean;
  postQuizCompleted: boolean;
  postQuizScore?: number;
  postQuizCompletedAt?: string;
  homeworkCompleted: boolean;
  homeworkScore?: number;
  homeworkCompletedAt?: string;
  lastUpdated: string;
}

export type LectureStep = "pre-quiz" | "videos" | "post-quiz" | "homework";

export interface StepAccessResult {
  canAccess: boolean;
  reason?: string;
  redirectTo?: string;
}

const STORAGE_KEY_PREFIX = "mrf_lecture_progress_";

function getStorageKey(lectureId: string): string {
  return `${STORAGE_KEY_PREFIX}${lectureId}`;
}

function getDefaultProgress(lectureId: string): LectureProgressData {
  return {
    lectureId,
    preQuizCompleted: false,
    videosWatched: [],
    allVideosCompleted: false,
    postQuizCompleted: false,
    homeworkCompleted: false,
    lastUpdated: new Date().toISOString(),
  };
}

function loadProgress(lectureId: string): LectureProgressData {
  if (typeof window === "undefined") {
    return getDefaultProgress(lectureId);
  }

  try {
    const stored = localStorage.getItem(getStorageKey(lectureId));
    if (stored) {
      const parsed = JSON.parse(stored) as LectureProgressData;
      // Ensure lectureId matches
      if (parsed.lectureId === lectureId) {
        return parsed;
      }
    }
  } catch (error) {
    console.error("Failed to load lecture progress:", error);
  }

  return getDefaultProgress(lectureId);
}

function saveProgress(progress: LectureProgressData): void {
  if (typeof window === "undefined") return;

  try {
    progress.lastUpdated = new Date().toISOString();
    localStorage.setItem(
      getStorageKey(progress.lectureId),
      JSON.stringify(progress)
    );
  } catch (error) {
    console.error("Failed to save lecture progress:", error);
  }
}

export function useLectureProgress(lectureId: string, totalVideos: number = 5) {
  const [progress, setProgress] = useState<LectureProgressData>(() =>
    getDefaultProgress(lectureId)
  );
  const [isLoaded, setIsLoaded] = useState(false);

  // Load progress on mount
  useEffect(() => {
    const loaded = loadProgress(lectureId);
    setProgress(loaded);
    setIsLoaded(true);
  }, [lectureId]);

  // Check if user can access a specific step
  const canAccessStep = useCallback(
    (step: LectureStep, videoId?: string): StepAccessResult => {
      switch (step) {
        case "pre-quiz":
          // Pre-quiz is always accessible
          return { canAccess: true };

        case "videos":
          if (!progress.preQuizCompleted) {
            return {
              canAccess: false,
              reason: "يجب إكمال الاختبار القبلي أولاً للوصول إلى الفيديوهات",
              redirectTo: `/ar/lectures/${lectureId}/pre-quiz`,
            };
          }
          return { canAccess: true };

        case "post-quiz":
          if (!progress.preQuizCompleted) {
            return {
              canAccess: false,
              reason: "يجب إكمال الاختبار القبلي أولاً",
              redirectTo: `/ar/lectures/${lectureId}/pre-quiz`,
            };
          }
          if (!progress.allVideosCompleted) {
            return {
              canAccess: false,
              reason: "يجب مشاهدة جميع الفيديوهات أولاً للوصول إلى الاختبار البعدي",
              redirectTo: `/ar/lectures/${lectureId}`,
            };
          }
          return { canAccess: true };

        case "homework":
          if (!progress.preQuizCompleted) {
            return {
              canAccess: false,
              reason: "يجب إكمال الاختبار القبلي أولاً",
              redirectTo: `/ar/lectures/${lectureId}/pre-quiz`,
            };
          }
          if (!progress.allVideosCompleted) {
            return {
              canAccess: false,
              reason: "يجب مشاهدة جميع الفيديوهات أولاً",
              redirectTo: `/ar/lectures/${lectureId}`,
            };
          }
          if (!progress.postQuizCompleted) {
            return {
              canAccess: false,
              reason: "يجب إكمال الاختبار البعدي أولاً للوصول إلى الواجب المنزلي",
              redirectTo: `/ar/lectures/${lectureId}/post-quiz`,
            };
          }
          return { canAccess: true };

        default:
          return { canAccess: true };
      }
    },
    [progress, lectureId]
  );

  // Mark pre-quiz as completed
  const completePreQuiz = useCallback(
    (score: number) => {
      setProgress((prev) => {
        const updated: LectureProgressData = {
          ...prev,
          preQuizCompleted: true,
          preQuizScore: score,
          preQuizCompletedAt: new Date().toISOString(),
        };
        saveProgress(updated);
        return updated;
      });
    },
    []
  );

  // Mark a video as watched
  const markVideoWatched = useCallback(
    (videoId: string) => {
      setProgress((prev) => {
        const videosWatched = prev.videosWatched.includes(videoId)
          ? prev.videosWatched
          : [...prev.videosWatched, videoId];
        const allVideosCompleted = videosWatched.length >= totalVideos;

        const updated: LectureProgressData = {
          ...prev,
          videosWatched,
          allVideosCompleted,
        };
        saveProgress(updated);
        return updated;
      });
    },
    [totalVideos]
  );

  // Mark all videos as completed (for testing or admin)
  const markAllVideosCompleted = useCallback(() => {
    setProgress((prev) => {
      const updated: LectureProgressData = {
        ...prev,
        allVideosCompleted: true,
      };
      saveProgress(updated);
      return updated;
    });
  }, []);

  // Mark post-quiz as completed
  const completePostQuiz = useCallback(
    (score: number) => {
      setProgress((prev) => {
        const updated: LectureProgressData = {
          ...prev,
          postQuizCompleted: true,
          postQuizScore: score,
          postQuizCompletedAt: new Date().toISOString(),
        };
        saveProgress(updated);
        return updated;
      });
    },
    []
  );

  // Mark homework as completed
  const completeHomework = useCallback(
    (score: number) => {
      setProgress((prev) => {
        const updated: LectureProgressData = {
          ...prev,
          homeworkCompleted: true,
          homeworkScore: score,
          homeworkCompletedAt: new Date().toISOString(),
        };
        saveProgress(updated);
        return updated;
      });
    },
    []
  );

  // Reset all progress for this lecture
  const resetProgress = useCallback(() => {
    const defaultProgress = getDefaultProgress(lectureId);
    setProgress(defaultProgress);
    saveProgress(defaultProgress);
  }, [lectureId]);

  // Calculate overall completion percentage
  const getCompletionPercentage = useCallback((): number => {
    let completed = 0;
    if (progress.preQuizCompleted) completed += 25;
    if (progress.allVideosCompleted) completed += 25;
    if (progress.postQuizCompleted) completed += 25;
    if (progress.homeworkCompleted) completed += 25;
    return completed;
  }, [progress]);

  // Get the current step the user should be on
  const getCurrentStep = useCallback((): LectureStep => {
    if (!progress.preQuizCompleted) return "pre-quiz";
    if (!progress.allVideosCompleted) return "videos";
    if (!progress.postQuizCompleted) return "post-quiz";
    return "homework";
  }, [progress]);

  // Check if lecture is fully completed
  const isLectureCompleted = useCallback((): boolean => {
    return (
      progress.preQuizCompleted &&
      progress.allVideosCompleted &&
      progress.postQuizCompleted &&
      progress.homeworkCompleted
    );
  }, [progress]);

  return {
    progress,
    isLoaded,
    canAccessStep,
    completePreQuiz,
    markVideoWatched,
    markAllVideosCompleted,
    completePostQuiz,
    completeHomework,
    resetProgress,
    getCompletionPercentage,
    getCurrentStep,
    isLectureCompleted,
  };
}

// Utility function to get all lecture progress from localStorage
export function getAllLectureProgress(): LectureProgressData[] {
  if (typeof window === "undefined") return [];

  const results: LectureProgressData[] = [];
  try {
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key?.startsWith(STORAGE_KEY_PREFIX)) {
        const stored = localStorage.getItem(key);
        if (stored) {
          results.push(JSON.parse(stored));
        }
      }
    }
  } catch (error) {
    console.error("Failed to get all lecture progress:", error);
  }
  return results;
}

// Utility function to clear all lecture progress
export function clearAllLectureProgress(): void {
  if (typeof window === "undefined") return;

  try {
    const keysToRemove: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key?.startsWith(STORAGE_KEY_PREFIX)) {
        keysToRemove.push(key);
      }
    }
    keysToRemove.forEach((key) => localStorage.removeItem(key));
  } catch (error) {
    console.error("Failed to clear all lecture progress:", error);
  }
}

export default useLectureProgress;
