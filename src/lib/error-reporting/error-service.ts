interface ErrorReport {
  message: string;
  stack?: string;
  componentStack?: string;
  timestamp: string;
  userAgent: string;
  url: string;
  userId?: string;
  sessionId?: string;
  buildVersion?: string;
  environment: string;
  severity: "low" | "medium" | "high" | "critical";
  tags?: Record<string, string>;
  extra?: Record<string, unknown>;
}

interface ErrorContext {
  userId?: string;
  sessionId?: string;
  tags?: Record<string, string>;
  extra?: Record<string, unknown>;
}

class ErrorReportingService {
  private context: ErrorContext = {};
  private isEnabled: boolean;
  private endpoint?: string;

  constructor() {
    this.isEnabled = process.env.NODE_ENV === "production";
    this.endpoint = process.env.NEXT_PUBLIC_ERROR_REPORTING_ENDPOINT;
  }

  setContext(context: Partial<ErrorContext>) {
    this.context = { ...this.context, ...context };
  }

  setUser(userId: string) {
    this.context.userId = userId;
  }

  setSession(sessionId: string) {
    this.context.sessionId = sessionId;
  }

  addTag(key: string, value: string) {
    this.context.tags = { ...this.context.tags, [key]: value };
  }

  addExtra(key: string, value: unknown) {
    this.context.extra = { ...this.context.extra, [key]: value };
  }

  captureException(
    error: Error,
    options: {
      severity?: ErrorReport["severity"];
      tags?: Record<string, string>;
      extra?: Record<string, unknown>;
      componentStack?: string;
    } = {},
  ) {
    const report: ErrorReport = {
      message: error.message,
      stack: error.stack,
      componentStack: options.componentStack,
      timestamp: new Date().toISOString(),
      userAgent:
        typeof navigator !== "undefined" ? navigator.userAgent : "unknown",
      url: typeof window !== "undefined" ? window.location.href : "unknown",
      userId: this.context.userId,
      sessionId: this.context.sessionId,
      buildVersion: process.env.NEXT_PUBLIC_BUILD_VERSION || "unknown",
      environment: process.env.NODE_ENV || "unknown",
      severity: options.severity || "medium",
      tags: { ...this.context.tags, ...options.tags },
      extra: { ...this.context.extra, ...options.extra },
    };

    // Always log to console in development
    if (process.env.NODE_ENV === "development") {
      console.group("🚨 Error Report");
      console.error("Error:", error);
      console.log("Report:", report);
      console.groupEnd();
    }

    // Send to external service in production
    if (this.isEnabled && this.endpoint) {
      this.sendToService(report).catch((err) => {
        console.error("Failed to send error report:", err);
      });
    }

    // Store locally for debugging
    this.storeLocally(report);
  }

  captureMessage(
    message: string,
    severity: ErrorReport["severity"] = "low",
    extra?: Record<string, unknown>,
  ) {
    const error = new Error(message);
    this.captureException(error, { severity, extra });
  }

  private async sendToService(report: ErrorReport): Promise<void> {
    if (!this.endpoint) return;

    try {
      const response = await fetch(this.endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(report),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
    } catch (error) {
      // Fallback: store in localStorage for later retry
      this.storeForRetry(report);
      throw error;
    }
  }

  private storeLocally(report: ErrorReport) {
    if (typeof window === "undefined") return;

    try {
      const key = `error_report_${Date.now()}`;
      const stored = localStorage.getItem("error_reports") || "[]";
      const reports = JSON.parse(stored);

      reports.push({ key, report, timestamp: Date.now() });

      // Keep only last 10 reports
      if (reports.length > 10) {
        reports.splice(0, reports.length - 10);
      }

      localStorage.setItem("error_reports", JSON.stringify(reports));
    } catch (error) {
      console.warn("Failed to store error report locally:", error);
    }
  }

  private storeForRetry(report: ErrorReport) {
    if (typeof window === "undefined") return;

    try {
      const stored = localStorage.getItem("error_reports_retry") || "[]";
      const reports = JSON.parse(stored);

      reports.push({ report, timestamp: Date.now() });

      // Keep only last 5 reports for retry
      if (reports.length > 5) {
        reports.splice(0, reports.length - 5);
      }

      localStorage.setItem("error_reports_retry", JSON.stringify(reports));
    } catch (error) {
      console.warn("Failed to store error report for retry:", error);
    }
  }

  async retryFailedReports(): Promise<void> {
    if (typeof window === "undefined" || !this.endpoint) return;

    try {
      const stored = localStorage.getItem("error_reports_retry");
      if (!stored) return;

      const reports = JSON.parse(stored);
      const successful: number[] = [];

      for (let i = 0; i < reports.length; i++) {
        try {
          await this.sendToService(reports[i].report);
          successful.push(i);
        } catch (error) {
          // Keep failed reports for next retry
          console.warn("Retry failed for error report:", error);
        }
      }

      // Remove successful reports
      const remaining = reports.filter(
        (_: unknown, index: number) => !successful.includes(index),
      );
      localStorage.setItem("error_reports_retry", JSON.stringify(remaining));
    } catch (error) {
      console.warn("Failed to retry error reports:", error);
    }
  }

  getStoredReports(): ErrorReport[] {
    if (typeof window === "undefined") return [];

    try {
      const stored = localStorage.getItem("error_reports") || "[]";
      const reports = JSON.parse(stored);
      return reports.map((item: { report: ErrorReport }) => item.report);
    } catch (error) {
      console.warn("Failed to get stored error reports:", error);
      return [];
    }
  }

  clearStoredReports() {
    if (typeof window === "undefined") return;

    try {
      localStorage.removeItem("error_reports");
      localStorage.removeItem("error_reports_retry");
    } catch (error) {
      console.warn("Failed to clear stored error reports:", error);
    }
  }
}

// Global instance
export const errorReportingService = new ErrorReportingService();

// Initialize error reporting
export function initializeErrorReporting(context?: ErrorContext) {
  if (context) {
    errorReportingService.setContext(context);
  }

  // Set up global error handlers
  if (typeof window !== "undefined") {
    window.addEventListener("error", (event) => {
      errorReportingService.captureException(new Error(event.message), {
        severity: "high",
        extra: {
          filename: event.filename,
          lineno: event.lineno,
          colno: event.colno,
        },
      });
    });

    window.addEventListener("unhandledrejection", (event) => {
      const error =
        event.reason instanceof Error
          ? event.reason
          : new Error(String(event.reason));

      errorReportingService.captureException(error, {
        severity: "high",
        tags: { type: "unhandled_promise_rejection" },
      });
    });

    // Retry failed reports on page load
    setTimeout(() => {
      errorReportingService.retryFailedReports();
    }, 5000);
  }
}

export default errorReportingService;
