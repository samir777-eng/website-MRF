"use client";

import React, { useEffect } from "react";
import { performanceMonitor } from "@/lib/monitoring/performance-monitor";
import { PerformanceDashboard } from "@/components/monitoring/performance-dashboard";

interface PerformanceProviderProps {
  children: React.ReactNode;
  showDashboard?: boolean;
  userId?: string;
}

export function PerformanceProvider({
  children,
  showDashboard = process.env.NODE_ENV === "development",
  userId,
}: PerformanceProviderProps) {
  useEffect(() => {
    // Initialize performance monitoring
    if (typeof window !== "undefined") {
      // Track page load performance
      performanceMonitor.manualMetric("pageLoad", Date.now());

      // Track user interactions
      const trackInteraction = (event: Event) => {
        performanceMonitor.manualMetric("userInteraction", Date.now(), {
          type: event.type,
          target: (event.target as Element)?.tagName?.toLowerCase(),
        });
      };

      // Track clicks and key presses
      document.addEventListener("click", trackInteraction);
      document.addEventListener("keydown", trackInteraction);

      // Track route changes (for SPA navigation)
      const originalPushState = history.pushState;
      const originalReplaceState = history.replaceState;

      history.pushState = function (...args) {
        performanceMonitor.manualMetric("routeChange", Date.now(), {
          url: args[2],
          type: "pushState",
        });
        return originalPushState.apply(history, args);
      };

      history.replaceState = function (...args) {
        performanceMonitor.manualMetric("routeChange", Date.now(), {
          url: args[2],
          type: "replaceState",
        });
        return originalReplaceState.apply(history, args);
      };

      window.addEventListener("popstate", () => {
        performanceMonitor.manualMetric("routeChange", Date.now(), {
          url: window.location.href,
          type: "popstate",
        });
      });

      // Cleanup
      return () => {
        document.removeEventListener("click", trackInteraction);
        document.removeEventListener("keydown", trackInteraction);
        history.pushState = originalPushState;
        history.replaceState = originalReplaceState;
      };
    }
  }, [userId]);

  return (
    <>
      {children}
      {showDashboard && <PerformanceDashboard />}
    </>
  );
}
