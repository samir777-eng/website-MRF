"use client";

interface PerformanceMetric {
  name: string;
  value: number;
  timestamp: number;
  url: string;
  userAgent: string;
  connectionType?: string;
}

interface PerformanceAlert {
  metric: string;
  threshold: number;
  value: number;
  severity: "low" | "medium" | "high" | "critical";
  timestamp: number;
}

interface RUMData {
  sessionId: string;
  userId?: string;
  pageViews: number;
  bounceRate: number;
  avgSessionDuration: number;
  errorRate: number;
  performanceScore: number;
}

class PerformanceMonitor {
  private metrics: PerformanceMetric[] = [];
  private alerts: PerformanceAlert[] = [];
  private sessionId: string;
  private startTime: number;
  private isEnabled: boolean;
  private endpoint?: string;

  // Performance thresholds
  private thresholds = {
    fcp: { warning: 2000, critical: 3000 },
    lcp: { warning: 2500, critical: 4000 },
    fid: { warning: 100, critical: 300 },
    cls: { warning: 0.1, critical: 0.25 },
    ttfb: { warning: 600, critical: 1000 },
    tbt: { warning: 200, critical: 600 },
  };

  constructor() {
    this.sessionId = this.generateSessionId();
    this.startTime = Date.now();
    this.isEnabled =
      typeof window !== "undefined" && process.env.NODE_ENV === "production";
    this.endpoint = process.env.NEXT_PUBLIC_PERFORMANCE_ENDPOINT;

    if (this.isEnabled) {
      this.initializeMonitoring();
    }
  }

  private generateSessionId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  private initializeMonitoring() {
    // Monitor Core Web Vitals
    this.observeWebVitals();

    // Monitor navigation timing
    this.observeNavigationTiming();

    // Monitor resource loading
    this.observeResourceTiming();

    // Monitor long tasks
    this.observeLongTasks();

    // Monitor memory usage
    this.observeMemoryUsage();

    // Monitor errors
    this.observeErrors();

    // Send data periodically
    this.startPeriodicReporting();
  }

  private observeWebVitals() {
    // First Contentful Paint
    new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.name === "first-contentful-paint") {
          this.recordMetric("fcp", entry.startTime);
        }
      }
    }).observe({ entryTypes: ["paint"] });

    // Largest Contentful Paint
    new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const lastEntry = entries[entries.length - 1];
      this.recordMetric("lcp", lastEntry.startTime);
    }).observe({ entryTypes: ["largest-contentful-paint"] });

    // First Input Delay
    new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        const fidEntry = entry as any;
        if (fidEntry.processingStart) {
          this.recordMetric("fid", fidEntry.processingStart - entry.startTime);
        }
      }
    }).observe({ entryTypes: ["first-input"] });

    // Cumulative Layout Shift
    let clsValue = 0;
    new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        const clsEntry = entry as any;
        if (!clsEntry.hadRecentInput && clsEntry.value) {
          clsValue += clsEntry.value;
        }
      }
      this.recordMetric("cls", clsValue);
    }).observe({ entryTypes: ["layout-shift"] });
  }

  private observeNavigationTiming() {
    window.addEventListener("load", () => {
      setTimeout(() => {
        const navigation = performance.getEntriesByType(
          "navigation",
        )[0] as PerformanceNavigationTiming;

        if (navigation) {
          this.recordMetric(
            "ttfb",
            navigation.responseStart - navigation.requestStart,
          );
          this.recordMetric(
            "domContentLoaded",
            navigation.domContentLoadedEventEnd - navigation.fetchStart,
          );
          this.recordMetric(
            "loadComplete",
            navigation.loadEventEnd - navigation.fetchStart,
          );
        }
      }, 0);
    });
  }

  private observeResourceTiming() {
    new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        const resource = entry as PerformanceResourceTiming;

        // Track slow resources
        const duration = resource.responseEnd - resource.startTime;
        if (duration > 1000) {
          // Resources taking more than 1s
          this.recordMetric("slowResource", duration, {
            resourceUrl: resource.name,
            resourceType: resource.initiatorType,
          });
        }
      }
    }).observe({ entryTypes: ["resource"] });
  }

  private observeLongTasks() {
    if ("PerformanceObserver" in window) {
      try {
        new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            this.recordMetric("longTask", entry.duration);
          }
        }).observe({ entryTypes: ["longtask"] });
      } catch (_e) {
        // Long task observer not supported
      }
    }
  }

  private observeMemoryUsage() {
    if ("memory" in performance) {
      setInterval(() => {
        const memory = (performance as any).memory;
        this.recordMetric("memoryUsed", memory.usedJSHeapSize);
        this.recordMetric("memoryTotal", memory.totalJSHeapSize);
        this.recordMetric("memoryLimit", memory.jsHeapSizeLimit);
      }, 30000); // Every 30 seconds
    }
  }

  private observeErrors() {
    window.addEventListener("error", (event: ErrorEvent) => {
      this.recordMetric("jsError", 1, {
        message: event.message,
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
      });
    });

    window.addEventListener("unhandledrejection", (event) => {
      this.recordMetric("promiseRejection", 1, {
        reason: String(event.reason),
      });
    });
  }

  private recordMetric(
    name: string,
    value: number,
    extra?: Record<string, any>,
  ) {
    const metric: PerformanceMetric = {
      name,
      value,
      timestamp: Date.now(),
      url: window.location.href,
      userAgent: navigator.userAgent,
      connectionType: this.getConnectionType(),
      ...extra,
    };

    this.metrics.push(metric);
    this.checkThresholds(metric);

    // Limit stored metrics to prevent memory issues
    if (this.metrics.length > 1000) {
      this.metrics = this.metrics.slice(-500);
    }
  }

  private getConnectionType(): string {
    const connection =
      (navigator as any).connection ||
      (navigator as any).mozConnection ||
      (navigator as any).webkitConnection;
    return connection ? connection.effectiveType || connection.type : "unknown";
  }

  private checkThresholds(metric: PerformanceMetric) {
    const threshold =
      this.thresholds[metric.name as keyof typeof this.thresholds];
    if (!threshold) return;

    let severity: PerformanceAlert["severity"] = "low";

    if (metric.value > threshold.critical) {
      severity = "critical";
    } else if (metric.value > threshold.warning) {
      severity = "medium";
    } else {
      return; // No alert needed
    }

    const alert: PerformanceAlert = {
      metric: metric.name,
      threshold:
        severity === "critical" ? threshold.critical : threshold.warning,
      value: metric.value,
      severity,
      timestamp: metric.timestamp,
    };

    this.alerts.push(alert);
    this.triggerAlert(alert);
  }

  private triggerAlert(alert: PerformanceAlert) {
    // Send immediate alert for critical issues
    if (alert.severity === "critical") {
      this.sendAlert(alert);
    }

    // Log to console in development
    if (process.env.NODE_ENV === "development") {
      console.warn(
        `Performance Alert: ${alert.metric} = ${alert.value}ms (threshold: ${alert.threshold}ms)`,
      );
    }
  }

  private async sendAlert(alert: PerformanceAlert) {
    if (!this.endpoint) return;

    try {
      await fetch(`${this.endpoint}/alerts`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId: this.sessionId,
          alert,
          url: window.location.href,
          timestamp: Date.now(),
        }),
      });
    } catch (_error) {
      console.error("Failed to send performance alert:", _error);
    }
  }

  private startPeriodicReporting() {
    // Send metrics every 30 seconds
    setInterval(() => {
      this.sendMetrics();
    }, 30000);

    // Send final report on page unload
    window.addEventListener("beforeunload", () => {
      this.sendMetrics(true);
    });

    // Send report on visibility change (tab switch)
    document.addEventListener("visibilitychange", () => {
      if (document.visibilityState === "hidden") {
        this.sendMetrics();
      }
    });
  }

  private async sendMetrics(isFinal = false) {
    if (!this.endpoint || this.metrics.length === 0) return;

    const rumData = this.generateRUMData();

    try {
      const payload = {
        sessionId: this.sessionId,
        metrics: this.metrics,
        alerts: this.alerts,
        rumData,
        isFinal,
        timestamp: Date.now(),
      };

      if (isFinal && "sendBeacon" in navigator) {
        // Use sendBeacon for reliable delivery on page unload
        navigator.sendBeacon(
          `${this.endpoint}/metrics`,
          JSON.stringify(payload),
        );
      } else {
        await fetch(`${this.endpoint}/metrics`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      }

      // Clear sent metrics
      this.metrics = [];
      this.alerts = [];
    } catch (_error) {
      console.error("Failed to send performance metrics:", _error);
    }
  }

  private generateRUMData(): RUMData {
    const sessionDuration = Date.now() - this.startTime;
    const errorCount = this.metrics.filter(
      (m) => m.name === "jsError" || m.name === "promiseRejection",
    ).length;

    return {
      sessionId: this.sessionId,
      pageViews: 1, // This would be tracked across navigation
      bounceRate: sessionDuration < 10000 ? 1 : 0, // Less than 10s = bounce
      avgSessionDuration: sessionDuration,
      errorRate: errorCount / this.metrics.length,
      performanceScore: this.calculatePerformanceScore(),
    };
  }

  private calculatePerformanceScore(): number {
    const fcpMetric = this.metrics.find((m) => m.name === "fcp");
    const lcpMetric = this.metrics.find((m) => m.name === "lcp");
    const fidMetric = this.metrics.find((m) => m.name === "fid");
    const clsMetric = this.metrics.find((m) => m.name === "cls");

    if (!fcpMetric || !lcpMetric) return 0;

    // Simplified scoring based on Core Web Vitals
    let score = 100;

    if (fcpMetric.value > 3000) score -= 20;
    else if (fcpMetric.value > 2000) score -= 10;

    if (lcpMetric.value > 4000) score -= 30;
    else if (lcpMetric.value > 2500) score -= 15;

    if (fidMetric && fidMetric.value > 300) score -= 25;
    else if (fidMetric && fidMetric.value > 100) score -= 10;

    if (clsMetric && clsMetric.value > 0.25) score -= 25;
    else if (clsMetric && clsMetric.value > 0.1) score -= 10;

    return Math.max(0, score);
  }

  // Public API
  public getMetrics(): PerformanceMetric[] {
    return [...this.metrics];
  }

  public getAlerts(): PerformanceAlert[] {
    return [...this.alerts];
  }

  public getSessionId(): string {
    return this.sessionId;
  }

  public manualMetric(
    name: string,
    value: number,
    extra?: Record<string, any>,
  ) {
    this.recordMetric(name, value, extra);
  }

  public getPerformanceScore(): number {
    return this.calculatePerformanceScore();
  }

  public getRUMData(): RUMData {
    return this.generateRUMData();
  }
}

// Global instance
export const performanceMonitor = new PerformanceMonitor();

export default performanceMonitor;
export type { PerformanceMetric, PerformanceAlert, RUMData };
