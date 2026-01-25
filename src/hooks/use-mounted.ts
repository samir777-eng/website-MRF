"use client";

import { useState, useEffect } from "react";

/**
 * Hook to detect if the component has mounted on the client.
 * 
 * Use this hook to prevent SSR hydration mismatches when accessing
 * browser-only APIs like localStorage, window, or document.
 * 
 * @example
 * ```tsx
 * function MyComponent() {
 *   const isMounted = useMounted();
 *   
 *   // Prevent hydration mismatch
 *   if (!isMounted) return <Skeleton />;
 *   
 *   // Safe to use localStorage
 *   const data = localStorage.getItem('key');
 *   return <div>{data}</div>;
 * }
 * ```
 */
export function useMounted(): boolean {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return isMounted;
}

/**
 * Hook to safely get localStorage value after hydration.
 * Returns null during SSR and initial client render to prevent mismatches.
 * 
 * @param key - localStorage key
 * @param defaultValue - Value to return if key doesn't exist (after mount)
 * @returns [value, setValue, isMounted]
 * 
 * @example
 * ```tsx
 * function MyComponent() {
 *   const [theme, setTheme, isMounted] = useLocalStorage('theme', 'light');
 *   
 *   if (!isMounted) return <Skeleton />;
 *   
 *   return <div>Theme: {theme}</div>;
 * }
 * ```
 */
export function useLocalStorage<T>(
  key: string,
  defaultValue: T
): [T | null, (value: T) => void, boolean] {
  const [isMounted, setIsMounted] = useState(false);
  const [value, setValue] = useState<T | null>(null);

  useEffect(() => {
    setIsMounted(true);
    try {
      const stored = localStorage.getItem(key);
      if (stored !== null) {
        setValue(JSON.parse(stored));
      } else {
        setValue(defaultValue);
      }
    } catch {
      setValue(defaultValue);
    }
  }, [key, defaultValue]);

  const setStoredValue = (newValue: T) => {
    setValue(newValue);
    try {
      localStorage.setItem(key, JSON.stringify(newValue));
    } catch (error) {
      console.error("Failed to save to localStorage:", error);
    }
  };

  return [value, setStoredValue, isMounted];
}

export default useMounted;

