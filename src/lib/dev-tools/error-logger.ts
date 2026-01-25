interface ErrorLogEntry {
  id: string;
  timestamp: number;
  type: "error" | "warning" | "info";
  message: string;
  stack?: string;
  url?: string;
  lineNumber?: number;
  columnNumber?: number;
  userAgent?: string;
  userId?: string;
  sessionId?: string;
  additionalData?: Record<string, any>;
}

class ErrorLogger {
  private logs: ErrorLogEntry[] = [];
  private maxLogs = 100;
  private sessionId: string;

  constructor() {
    this.sessionId = this.generateSessionId();
    if (typeof window !== "undefined") {
      this.setupGlobalErrorHandlers();
    }
  }

  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private setupGlobalErrorHandlers() {
    // Only run on client side
    if (typeof window === "undefined") return;

    // Handle JavaScript errors
    window.addEventListener("error", (event) => {
      this.logError({
        type: "error",
        message: event.message,
        stack: event.error?.stack,
        url: event.filename,
        lineNumber: event.lineno,
        columnNumber: event.colno,
      });
    });

    // Handle unhandled promise rejections
    window.addEventListener("unhandledrejection", (event) => {
      this.logError({
        type: "error",
        message: `Unhandled Promise Rejection: ${event.reason}`,
        stack: event.reason?.stack,
        additionalData: { reason: event.reason },
      });
    });

    // Handle console errors (override console.error)
    const originalConsoleError = console.error;
    console.error = (...args) => {
      this.logError({
        type: "error",
        message: args.join(" "),
        additionalData: { consoleArgs: args },
      });
      originalConsoleError.apply(console, args);
    };

    // Handle console warnings
    const originalConsoleWarn = console.warn;
    console.warn = (...args) => {
      this.logError({
        type: "warning",
        message: args.join(" "),
        additionalData: { consoleArgs: args },
      });
      originalConsoleWarn.apply(console, args);
    };
  }

  logError(errorData: Partial<ErrorLogEntry>) {
    const entry: ErrorLogEntry = {
      id: `error_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: Date.now(),
      type: errorData.type || "error",
      message: errorData.message || "Unknown error",
      stack: errorData.stack,
      url: errorData.url || window.location.href,
      lineNumber: errorData.lineNumber,
      columnNumber: errorData.columnNumber,
      userAgent: navigator.userAgent,
      sessionId: this.sessionId,
      additionalData: errorData.additionalData,
    };

    this.logs.unshift(entry);

    // Keep only the most recent logs
    if (this.logs.length > this.maxLogs) {
      this.logs = this.logs.slice(0, this.maxLogs);
    }

    // Store in localStorage for persistence
    try {
      localStorage.setItem("dev_error_logs", JSON.stringify(this.logs));
    } catch (e) {
      // Handle localStorage quota exceeded
      console.warn("Could not save error logs to localStorage:", e);
    }

    // In development, also log to console with enhanced formatting
    if (process.env.NODE_ENV === "development") {
      console.group(`🚨 ${entry.type.toUpperCase()}: ${entry.message}`);
      console.log("Timestamp:", new Date(entry.timestamp).toISOString());
      console.log("URL:", entry.url);
      if (entry.lineNumber) console.log("Line:", entry.lineNumber);
      if (entry.columnNumber) console.log("Column:", entry.columnNumber);
      if (entry.stack) console.log("Stack:", entry.stack);
      if (entry.additionalData)
        console.log("Additional Data:", entry.additionalData);
      console.groupEnd();
    }
  }

  getLogs(): ErrorLogEntry[] {
    return [...this.logs];
  }

  getLogsByType(type: ErrorLogEntry["type"]): ErrorLogEntry[] {
    return this.logs.filter((log) => log.type === type);
  }

  clearLogs() {
    this.logs = [];
    localStorage.removeItem("dev_error_logs");
  }

  exportLogs(): string {
    return JSON.stringify(
      {
        sessionId: this.sessionId,
        exportTimestamp: Date.now(),
        logs: this.logs,
        systemInfo: {
          userAgent: navigator.userAgent,
          url: window.location.href,
          timestamp: Date.now(),
        },
      },
      null,
      2,
    );
  }

  // Load logs from localStorage on initialization
  loadPersistedLogs() {
    try {
      const stored = localStorage.getItem("dev_error_logs");
      if (stored) {
        const parsedLogs = JSON.parse(stored);
        if (Array.isArray(parsedLogs)) {
          this.logs = parsedLogs.slice(0, this.maxLogs);
        }
      }
    } catch (e) {
      console.warn("Could not load persisted error logs:", e);
    }
  }

  // Get error statistics
  getStats() {
    const now = Date.now();
    const oneHourAgo = now - 60 * 60 * 1000;
    const oneDayAgo = now - 24 * 60 * 60 * 1000;

    const recentLogs = this.logs.filter((log) => log.timestamp > oneHourAgo);
    const dailyLogs = this.logs.filter((log) => log.timestamp > oneDayAgo);

    return {
      total: this.logs.length,
      lastHour: recentLogs.length,
      lastDay: dailyLogs.length,
      byType: {
        errors: this.logs.filter((log) => log.type === "error").length,
        warnings: this.logs.filter((log) => log.type === "warning").length,
        info: this.logs.filter((log) => log.type === "info").length,
      },
      mostCommon: this.getMostCommonErrors(),
    };
  }

  private getMostCommonErrors() {
    const errorCounts: Record<string, number> = {};

    this.logs.forEach((log) => {
      const key = log.message.substring(0, 100); // First 100 chars as key
      errorCounts[key] = (errorCounts[key] || 0) + 1;
    });

    return Object.entries(errorCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([message, count]) => ({ message, count }));
  }
}

// Create singleton instance
export const errorLogger = new ErrorLogger();

// Load persisted logs on initialization
if (typeof window !== "undefined") {
  errorLogger.loadPersistedLogs();
}

// Export types for use in components
export type { ErrorLogEntry };
