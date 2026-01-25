import { useState, useEffect } from "react";

interface PerformanceMetrics {
  lcp?: number; // Largest Contentful Paint
  fid?: number; // First Input Delay
  cls?: number; // Cumulative Layout Shift
  fcp?: number; // First Contentful Paint
  ttfb?: number; // Time to First Byte
}

export function usePerformanceMonitor() {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({});

  useEffect(() => {
    if (typeof window === "undefined") return;

    // Function to update metrics
    const updateMetric = (name: string, value: number) => {
      setMetrics((prev) => ({ ...prev, [name]: value }));
    };

    // Get navigation timing metrics
    const getNavigationMetrics = () => {
      if ("performance" in window && "getEntriesByType" in performance) {
        const navigation = performance.getEntriesByType(
          "navigation",
        )[0] as PerformanceNavigationTiming;
        if (navigation) {
          updateMetric(
            "ttfb",
            navigation.responseStart - navigation.requestStart,
          );
        }
      }
    };

    // Get paint timing metrics
    const getPaintMetrics = () => {
      if ("performance" in window && "getEntriesByType" in performance) {
        const paintEntries = performance.getEntriesByType("paint");
        paintEntries.forEach((entry) => {
          if (entry.name === "first-contentful-paint") {
            updateMetric("fcp", entry.startTime);
          }
        });
      }
    };

    // Web Vitals using PerformanceObserver
    const observeWebVitals = () => {
      if ("PerformanceObserver" in window) {
        try {
          // Largest Contentful Paint
          const lcpObserver = new PerformanceObserver((list) => {
            const entries = list.getEntries();
            const lastEntry = entries[entries.length - 1];
            updateMetric("lcp", lastEntry.startTime);
          });
          lcpObserver.observe({ entryTypes: ["largest-contentful-paint"] });

          // Cumulative Layout Shift
          const clsObserver = new PerformanceObserver((list) => {
            let clsValue = 0;
            for (const entry of list.getEntries()) {
              if (!(entry as any).hadRecentInput) {
                clsValue += (entry as any).value;
              }
            }
            updateMetric("cls", clsValue);
          });
          clsObserver.observe({ entryTypes: ["layout-shift"] });

          // First Input Delay
          const fidObserver = new PerformanceObserver((list) => {
            for (const entry of list.getEntries()) {
              updateMetric(
                "fid",
                (entry as any).processingStart - entry.startTime,
              );
            }
          });
          fidObserver.observe({ entryTypes: ["first-input"] });
        } catch (error) {
          console.warn("Performance Observer not fully supported:", error);
        }
      }
    };

    // Initialize metrics collection
    getNavigationMetrics();
    getPaintMetrics();
    observeWebVitals();

    // Fallback for browsers without PerformanceObserver
    const fallbackTimer = setTimeout(() => {
      if ("performance" in window) {
        // Try to get LCP from performance entries
        const lcpEntries = performance.getEntriesByType(
          "largest-contentful-paint",
        );
        if (lcpEntries.length > 0) {
          const lastLCP = lcpEntries[lcpEntries.length - 1];
          updateMetric("lcp", lastLCP.startTime);
        }

        // Get layout shift entries
        const layoutShiftEntries = performance.getEntriesByType("layout-shift");
        let clsValue = 0;
        layoutShiftEntries.forEach((entry: any) => {
          if (!entry.hadRecentInput) {
            clsValue += entry.value;
          }
        });
        if (clsValue > 0) {
          updateMetric("cls", clsValue);
        }
      }
    }, 2000);

    return () => {
      clearTimeout(fallbackTimer);
    };
  }, []);

  return metrics;
}
