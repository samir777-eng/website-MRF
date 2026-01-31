import useSWR from "swr";
import { fetcher } from "@/lib/swr/config";

export interface Lesson {
  id: string;
  title: string;
  description: string;
  duration: number;
  videoUrl: string;
  thumbnailUrl: string;
  completed: boolean;
}

export function useLessons() {
  const { data, error, isLoading, mutate } = useSWR<Lesson[]>(
    "/api/lessons",
    fetcher,
    {
      revalidateOnFocus: false,
      dedupingInterval: 60000, // 1 minute
    },
  );

  return {
    lessons: data,
    isLoading,
    isError: error,
    mutate,
  };
}

export function useLesson(id: string) {
  const { data, error, isLoading, mutate } = useSWR<Lesson>(
    id ? `/api/lessons/${id}` : null,
    fetcher,
  );

  return {
    lesson: data,
    isLoading,
    isError: error,
    mutate,
  };
}

// Prefetch next lesson
export function usePrefetchLesson(nextLessonId: string | null) {
  useSWR(nextLessonId ? `/api/lessons/${nextLessonId}` : null, fetcher, {
    revalidateOnMount: false,
    revalidateOnFocus: false,
  });
}
