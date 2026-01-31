"use client";

/**
 * Analytics Provider - Unified analytics tracking for the platform
 *
 * Features:
 * - Page view tracking
 * - User action tracking
 * - Performance monitoring integration
 * - Development logging
 */

import { usePathname, useSearchParams } from "next/navigation";
import {
  useEffect,
  useCallback,
  createContext,
  useContext,
  Suspense,
} from "react";

interface AnalyticsContextType {
  trackEvent: (event: string, data?: Record<string, unknown>) => void;
  trackClick: (element: string, value?: string) => void;
  trackFormSubmit: (formName: string, success: boolean) => void;
  trackError: (error: Error, context?: Record<string, unknown>) => void;
}

const AnalyticsContext = createContext<AnalyticsContextType | undefined>(
  undefined,
);

// Page view tracker component
function PageViewTrackerInner() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    // Track page view
    const url =
      pathname +
      (searchParams?.toString() ? `?${searchParams.toString()}` : "");

    // Send to Google Analytics if available
    if (typeof window !== "undefined" && window.gtag) {
      window.gtag("event", "page_view", {
        page_path: url,
        page_title: document.title,
      });
    }

    // Log in development
    if (process.env.NODE_ENV === "development") {
      console.log("📄 Page View:", url);
    }

    // Send to custom endpoint
    fetch("/api/analytics/page-view", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        url,
        title: typeof document !== "undefined" ? document.title : "",
        timestamp: Date.now(),
        referrer: typeof document !== "undefined" ? document.referrer : "",
      }),
    }).catch(() => {
      // Silently fail - analytics should never break the app
    });
  }, [pathname, searchParams]);

  return null;
}

// Wrapped with Suspense for search params
function PageViewTracker() {
  return (
    <Suspense fallback={null}>
      <PageViewTrackerInner />
    </Suspense>
  );
}

interface AnalyticsProviderProps {
  children: React.ReactNode;
}

export function AnalyticsProvider({ children }: AnalyticsProviderProps) {
  const trackEvent = useCallback(
    (event: string, data?: Record<string, unknown>) => {
      // Google Analytics
      if (typeof window !== "undefined" && window.gtag) {
        window.gtag("event", event, data);
      }

      // Development logging
      if (process.env.NODE_ENV === "development") {
        console.log("📊 Event:", event, data);
      }
    },
    [],
  );

  const trackClick = useCallback(
    (element: string, value?: string) => {
      trackEvent("click", {
        element,
        value,
        page_path:
          typeof window !== "undefined" ? window.location.pathname : "",
      });
    },
    [trackEvent],
  );

  const trackFormSubmit = useCallback(
    (formName: string, success: boolean) => {
      trackEvent("form_submit", {
        form_name: formName,
        success,
        page_path:
          typeof window !== "undefined" ? window.location.pathname : "",
      });
    },
    [trackEvent],
  );

  const trackError = useCallback(
    (error: Error, context?: Record<string, unknown>) => {
      trackEvent("error", {
        error_name: error.name,
        error_message: error.message,
        ...context,
        page_path:
          typeof window !== "undefined" ? window.location.pathname : "",
      });
    },
    [trackEvent],
  );

  return (
    <AnalyticsContext.Provider
      value={{ trackEvent, trackClick, trackFormSubmit, trackError }}
    >
      <PageViewTracker />
      {children}
    </AnalyticsContext.Provider>
  );
}

export function useAnalytics() {
  const context = useContext(AnalyticsContext);
  if (context === undefined) {
    // Return no-op functions if used outside provider
    return {
      trackEvent: () => {},
      trackClick: () => {},
      trackFormSubmit: () => {},
      trackError: () => {},
    };
  }
  return context;
}
