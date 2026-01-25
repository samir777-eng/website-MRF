interface APICall {
  id: string;
  url: string;
  method: string;
  status?: number;
  statusText?: string;
  requestHeaders?: Record<string, string>;
  responseHeaders?: Record<string, string>;
  requestBody?: any;
  responseBody?: any;
  startTime: number;
  endTime?: number;
  duration?: number;
  error?: string;
  cached?: boolean;
}

class APIMonitor {
  private calls: APICall[] = [];
  private maxCalls = 100;
  private originalFetch: typeof fetch = fetch;

  constructor() {
    if (typeof window !== "undefined") {
      this.originalFetch = window.fetch;
      this.setupFetchInterceptor();
    }
  }

  private setupFetchInterceptor() {
    window.fetch = async (
      input: RequestInfo | URL,
      init?: RequestInit,
    ): Promise<Response> => {
      const url =
        typeof input === "string"
          ? input
          : input instanceof URL
            ? input.toString()
            : input.url;
      const method = init?.method || "GET";
      const startTime = performance.now();

      const callId = `api_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

      // Extract request headers
      const requestHeaders: Record<string, string> = {};
      if (init?.headers) {
        if (init.headers instanceof Headers) {
          init.headers.forEach((value, key) => {
            requestHeaders[key] = value;
          });
        } else if (Array.isArray(init.headers)) {
          init.headers.forEach(([key, value]) => {
            requestHeaders[key] = value;
          });
        } else {
          Object.entries(init.headers).forEach(([key, value]) => {
            requestHeaders[key] = value;
          });
        }
      }

      // Extract request body
      let requestBody: any;
      if (init?.body) {
        try {
          if (typeof init.body === "string") {
            requestBody = JSON.parse(init.body);
          } else {
            requestBody = init.body;
          }
        } catch {
          requestBody = init.body;
        }
      }

      const apiCall: APICall = {
        id: callId,
        url,
        method,
        requestHeaders,
        requestBody,
        startTime,
      };

      try {
        const response = await this.originalFetch(input, init);
        const endTime = performance.now();

        // Extract response headers
        const responseHeaders: Record<string, string> = {};
        response.headers.forEach((value, key) => {
          responseHeaders[key] = value;
        });

        // Clone response to read body without consuming it
        const responseClone = response.clone();
        let responseBody: any;

        try {
          const contentType = response.headers.get("content-type");
          if (contentType?.includes("application/json")) {
            responseBody = await responseClone.json();
          } else if (contentType?.includes("text/")) {
            responseBody = await responseClone.text();
          }
        } catch {
          // Could not parse response body
          responseBody = "[Could not parse response body]";
        }

        // Check if response was cached
        const cached =
          responseHeaders["x-cache"] === "HIT" ||
          responseHeaders["cf-cache-status"] === "HIT" ||
          response.headers.get("cache-control")?.includes("max-age");

        apiCall.status = response.status;
        apiCall.statusText = response.statusText;
        apiCall.responseHeaders = responseHeaders;
        apiCall.responseBody = responseBody;
        apiCall.endTime = endTime;
        apiCall.duration = endTime - startTime;
        apiCall.cached = cached;

        this.addCall(apiCall);

        return response;
      } catch (error) {
        const endTime = performance.now();

        apiCall.endTime = endTime;
        apiCall.duration = endTime - startTime;
        apiCall.error = error instanceof Error ? error.message : String(error);

        this.addCall(apiCall);

        throw error;
      }
    };
  }

  private addCall(call: APICall) {
    this.calls.unshift(call);

    // Keep only the most recent calls
    if (this.calls.length > this.maxCalls) {
      this.calls = this.calls.slice(0, this.maxCalls);
    }

    // Store in localStorage for persistence
    try {
      localStorage.setItem(
        "dev_api_calls",
        JSON.stringify(this.calls.slice(0, 50)),
      ); // Store only 50 most recent
    } catch (e) {
      console.warn("Could not save API calls to localStorage:", e);
    }

    // Log in development
    if (process.env.NODE_ENV === "development") {
      const emoji = call.error
        ? "❌"
        : call.status && call.status >= 400
          ? "⚠️"
          : "✅";
      const duration = call.duration
        ? `${call.duration.toFixed(2)}ms`
        : "pending";
      const cached = call.cached ? "(cached)" : "";

      console.log(
        `${emoji} ${call.method} ${call.url} - ${call.status || "pending"} ${duration} ${cached}`,
      );

      if (call.error) {
        console.error("API Error:", call.error);
      }
    }
  }

  getCalls(): APICall[] {
    return [...this.calls];
  }

  getCallsByStatus(status: number): APICall[] {
    return this.calls.filter((call) => call.status === status);
  }

  getFailedCalls(): APICall[] {
    return this.calls.filter(
      (call) => call.error || (call.status && call.status >= 400),
    );
  }

  getSlowCalls(threshold = 1000): APICall[] {
    return this.calls.filter(
      (call) => call.duration && call.duration > threshold,
    );
  }

  getCachedCalls(): APICall[] {
    return this.calls.filter((call) => call.cached);
  }

  getCallsByEndpoint(endpoint: string): APICall[] {
    return this.calls.filter((call) => call.url.includes(endpoint));
  }

  getStats() {
    const now = performance.now();
    const recentCalls = this.calls.filter(
      (call) => now - call.startTime < 60000,
    ); // Last minute

    const statusCounts = this.calls.reduce(
      (acc, call) => {
        if (call.status) {
          const statusGroup = Math.floor(call.status / 100) * 100;
          acc[statusGroup] = (acc[statusGroup] || 0) + 1;
        }
        return acc;
      },
      {} as Record<number, number>,
    );

    const avgDuration =
      this.calls
        .filter((call) => call.duration)
        .reduce((sum, call) => sum + (call.duration || 0), 0) /
      this.calls.length;

    const errorRate = (this.getFailedCalls().length / this.calls.length) * 100;
    const cacheHitRate =
      (this.getCachedCalls().length / this.calls.length) * 100;

    return {
      totalCalls: this.calls.length,
      recentCalls: recentCalls.length,
      statusCounts,
      averageDuration: avgDuration || 0,
      errorRate: errorRate || 0,
      cacheHitRate: cacheHitRate || 0,
      slowCalls: this.getSlowCalls().length,
      failedCalls: this.getFailedCalls().length,
    };
  }

  clearCalls() {
    this.calls = [];
    localStorage.removeItem("dev_api_calls");
  }

  exportCalls(): string {
    return JSON.stringify(
      {
        timestamp: Date.now(),
        calls: this.calls,
        stats: this.getStats(),
      },
      null,
      2,
    );
  }

  // Load persisted calls
  loadPersistedCalls() {
    try {
      const stored = localStorage.getItem("dev_api_calls");
      if (stored) {
        const parsedCalls = JSON.parse(stored);
        if (Array.isArray(parsedCalls)) {
          this.calls = parsedCalls.slice(0, this.maxCalls);
        }
      }
    } catch (e) {
      console.warn("Could not load persisted API calls:", e);
    }
  }

  // Restore original fetch (for cleanup)
  restore() {
    window.fetch = this.originalFetch;
  }
}

// Create singleton instance
export const apiMonitor = new APIMonitor();

// Load persisted calls on initialization
if (typeof window !== "undefined") {
  apiMonitor.loadPersistedCalls();
}

// Export types
export type { APICall };
