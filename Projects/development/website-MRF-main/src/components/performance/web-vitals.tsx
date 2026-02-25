"use client";

import { useEffect, useState } from "react";
import { onCLS, onFCP, onLCP, onTTFB, onINP } from "web-vitals";
import { useNonce } from "@/lib/security/nonce-provider";
import { logger } from "@/lib/utils/logger";

interface WebVitalsMetric {
  name: string;
  value: number;
  rating: "good" | "needs-improvement" | "poor";
  delta: number;
  id: string;
}

// Performance thresholds based on Core Web Vitals
const THRESHOLDS = {
  LCP: { good: 2500, poor: 4000 },
  CLS: { good: 0.1, poor: 0.25 },
  FCP: { good: 1800, poor: 3000 },
  TTFB: { good: 800, poor: 1800 },
  INP: { good: 200, poor: 500 },
};

function getRating(
  name: string,
  value: number,
): "good" | "needs-improvement" | "poor" {
  const threshold = THRESHOLDS[name as keyof typeof THRESHOLDS];
  if (!threshold) return "good";

  if (value <= threshold.good) return "good";
  if (value <= threshold.poor) return "needs-improvement";
  return "poor";
}

function sendToAnalytics(metric: WebVitalsMetric) {
  // Send to your analytics service
  if (process.env.NODE_ENV === "production") {
    // Example: Send to Google Analytics 4
    if (typeof window !== "undefined" && "gtag" in window) {
      (window as any).gtag("event", metric.name, {
        event_category: "Web Vitals",
        event_label: metric.id,
        value: Math.round(
          metric.name === "CLS" ? metric.value * 1000 : metric.value,
        ),
        custom_map: {
          metric_rating: metric.rating,
          metric_delta: metric.delta,
        },
      });
    }

    // Example: Send to custom analytics endpoint
    fetch("/api/analytics/web-vitals", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: metric.name,
        value: metric.value,
        rating: metric.rating,
        delta: metric.delta,
        id: metric.id,
        url: window.location.href,
        timestamp: Date.now(),
        userAgent: navigator.userAgent,
      }),
    }).catch(() => {
      // Failed to send analytics - could implement retry logic here
    });
  } else {
    // Development logging
    logger.performance(metric.name, metric.value);
  }
}

export function WebVitalsReporter() {
  const nonce = useNonce();

  useEffect(() => {
    // Measure Core Web Vitals
    onCLS((metric) => {
      const webVitalsMetric: WebVitalsMetric = {
        name: "CLS",
        value: metric.value,
        rating: getRating("CLS", metric.value),
        delta: metric.delta,
        id: metric.id,
      };
      sendToAnalytics(webVitalsMetric);
    });

    onFCP((metric) => {
      const webVitalsMetric: WebVitalsMetric = {
        name: "FCP",
        value: metric.value,
        rating: getRating("FCP", metric.value),
        delta: metric.delta,
        id: metric.id,
      };
      sendToAnalytics(webVitalsMetric);
    });

    onLCP((metric) => {
      const webVitalsMetric: WebVitalsMetric = {
        name: "LCP",
        value: metric.value,
        rating: getRating("LCP", metric.value),
        delta: metric.delta,
        id: metric.id,
      };
      sendToAnalytics(webVitalsMetric);
    });

    onTTFB((metric) => {
      const webVitalsMetric: WebVitalsMetric = {
        name: "TTFB",
        value: metric.value,
        rating: getRating("TTFB", metric.value),
        delta: metric.delta,
        id: metric.id,
      };
      sendToAnalytics(webVitalsMetric);
    });

    onINP((metric) => {
      const webVitalsMetric: WebVitalsMetric = {
        name: "INP",
        value: metric.value,
        rating: getRating("INP", metric.value),
        delta: metric.delta,
        id: metric.id,
      };
      sendToAnalytics(webVitalsMetric);
    });
  }, []);

  // This component doesn't render anything
  return null;
}

// Hook for accessing performance metrics in components
export function useWebVitals() {
  const [metrics, setMetrics] = useState<Record<string, WebVitalsMetric>>({});

  useEffect(() => {
    const updateMetric = (metric: WebVitalsMetric) => {
      setMetrics((prev) => ({
        ...prev,
        [metric.name]: metric,
      }));
    };

    onCLS((metric) =>
      updateMetric({
        name: "CLS",
        value: metric.value,
        rating: getRating("CLS", metric.value),
        delta: metric.delta,
        id: metric.id,
      }),
    );

    // Add other metrics as needed...
  }, []);

  return metrics;
}
