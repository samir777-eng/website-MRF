import { useEffect, useLayoutEffect } from "react";

/**
 * Custom hook to set the page title dynamically
 * @param title - The page title (will be appended with " | منصة الأستاذ رضا الفاروق")
 */
export function usePageTitle(title: string) {
  // Use useLayoutEffect to set title before paint (synchronously)
  // This ensures the title is set before the page is visible
  const useIsomorphicLayoutEffect =
    typeof window !== "undefined" ? useLayoutEffect : useEffect;

  useIsomorphicLayoutEffect(() => {
    const fullTitle = `${title} | منصة الأستاذ رضا الفاروق`;
    document.title = fullTitle;

    // Cleanup: restore default title when component unmounts
    return () => {
      document.title =
        "منصة الأستاذ رضا الفاروق التعليمية - تعلم اللغة العربية للثانوية العامة";
    };
  }, [title]);
}
