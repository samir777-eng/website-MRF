"use client";

import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";

// Google Analytics types
declare global {
  interface Window {
    dataLayer: any[];
    gtag: (...args: any[]) => void;
  }
}
import { useNonce } from "@/lib/security/nonce-provider";
import { CSPScriptLoader } from "@/lib/security/csp-utils";

interface AnalyticsConfig {
  googleAnalyticsId?: string;
  enableInDevelopment?: boolean;
  customDimensions?: Record<string, string>;
}

/**
 * CSP-compliant Google Analytics component
 */
export function CSPGoogleAnalytics({
  googleAnalyticsId,
  enableInDevelopment = false,
  customDimensions = {},
}: AnalyticsConfig) {
  const nonce = useNonce();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    // Only load in production unless explicitly enabled for development
    if (process.env.NODE_ENV === "development" && !enableInDevelopment) {
      return;
    }

    if (!googleAnalyticsId) {
      console.warn("Google Analytics ID not provided");
      return;
    }

    const initializeGA = async () => {
      try {
        // Load Google Analytics script
        await CSPScriptLoader.loadScript(
          `https://www.googletagmanager.com/gtag/js?id=${googleAnalyticsId}`,
          {
            async: true,
            nonce: nonce || undefined,
          },
        );

        // Initialize dataLayer and gtag function
        if (typeof window !== "undefined") {
          window.dataLayer = window.dataLayer || [];
          window.gtag = function () {
            window.dataLayer.push(arguments);
          };

          // Configure Google Analytics
          window.gtag("js", new Date());
          window.gtag("config", googleAnalyticsId, {
            page_title: document.title,
            page_location: window.location.href,
            custom_map: customDimensions,
            // Privacy-focused settings
            anonymize_ip: true,
            allow_google_signals: false,
            allow_ad_personalization_signals: false,
          });
        }
      } catch (error) {
        console.error("Failed to initialize Google Analytics:", error);
      }
    };

    initializeGA();
  }, [googleAnalyticsId, nonce, enableInDevelopment, customDimensions]);

  // Track page views
  useEffect(() => {
    if (typeof window !== "undefined" && window.gtag) {
      window.gtag("config", googleAnalyticsId, {
        page_path:
          pathname +
          (searchParams.toString() ? `?${searchParams.toString()}` : ""),
        page_title: document.title,
      });
    }
  }, [pathname, searchParams, googleAnalyticsId]);

  return null;
}

/**
 * CSP-compliant custom analytics tracker
 */
export class CSPAnalytics {
  private static instance: CSPAnalytics;
  private config: AnalyticsConfig;
  private queue: Array<{ event: string; data: Record<string, unknown> }> = [];
  private initialized = false;

  private constructor(config: AnalyticsConfig) {
    this.config = config;
  }

  static getInstance(config?: AnalyticsConfig): CSPAnalytics {
    if (!CSPAnalytics.instance && config) {
      CSPAnalytics.instance = new CSPAnalytics(config);
    }
    return CSPAnalytics.instance;
  }

  async initialize(): Promise<void> {
    if (this.initialized) return;

    try {
      // Process queued events
      while (this.queue.length > 0) {
        const { event, data } = this.queue.shift()!;
        await this.sendEvent(event, data);
      }

      this.initialized = true;
    } catch (error) {
      console.error("Analytics initialization failed:", error);
    }
  }

  /**
   * Track page view
   */
  trackPageView(path: string, title?: string): void {
    this.track("page_view", {
      page_path: path,
      page_title: title || document.title,
      timestamp: Date.now(),
    });
  }

  /**
   * Track custom event
   */
  track(event: string, data: Record<string, any> = {}): void {
    const eventData = {
      event,
      ...data,
      timestamp: Date.now(),
      user_agent: navigator.userAgent,
      referrer: document.referrer,
      url: window.location.href,
    };

    if (this.initialized) {
      this.sendEvent(event, eventData);
    } else {
      this.queue.push({ event, data: eventData });
    }
  }

  /**
   * Track user interaction
   */
  trackInteraction(element: string, action: string, value?: string): void {
    this.track("user_interaction", {
      element,
      action,
      value,
      page_path: window.location.pathname,
    });
  }

  /**
   * Track performance metrics
   */
  trackPerformance(metrics: Record<string, number>): void {
    this.track("performance", {
      ...metrics,
      connection_type:
        (navigator as Navigator & { connection?: { effectiveType?: string } })
          .connection?.effectiveType || "unknown",
    });
  }

  /**
   * Track error
   */
  trackError(error: Error, context?: Record<string, any>): void {
    this.track("error", {
      error_message: error.message,
      error_stack: error.stack,
      error_name: error.name,
      ...context,
    });
  }

  private async sendEvent(
    event: string,
    data: Record<string, unknown>,
  ): Promise<void> {
    try {
      // Send to Google Analytics if configured
      if (
        this.config.googleAnalyticsId &&
        typeof window !== "undefined" &&
        window.gtag
      ) {
        window.gtag("event", event, data);
      }

      // Send to custom endpoint if needed
      if (process.env.NEXT_PUBLIC_ANALYTICS_ENDPOINT) {
        await fetch(process.env.NEXT_PUBLIC_ANALYTICS_ENDPOINT, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ event, data }),
        });
      }

      // Log in development
      if (process.env.NODE_ENV === "development") {
        console.log("📊 Analytics Event:", event, data);
      }
    } catch (error) {
      console.error("Failed to send analytics event:", error);
    }
  }
}

/**
 * React hook for analytics tracking
 */
export function useAnalytics() {
  const analytics = CSPAnalytics.getInstance();

  const trackPageView = (path?: string, title?: string) => {
    analytics.trackPageView(path || window.location.pathname, title);
  };

  const trackEvent = (event: string, data?: Record<string, any>) => {
    analytics.track(event, data);
  };

  const trackClick = (element: string, value?: string) => {
    analytics.trackInteraction(element, "click", value);
  };

  const trackFormSubmit = (formName: string, success: boolean) => {
    analytics.track("form_submit", {
      form_name: formName,
      success,
      page_path: window.location.pathname,
    });
  };

  const trackError = (error: Error, context?: Record<string, any>) => {
    analytics.trackError(error, context);
  };

  return {
    trackPageView,
    trackEvent,
    trackClick,
    trackFormSubmit,
    trackError,
  };
}

/**
 * Higher-order component for automatic analytics tracking
 */
export function withAnalytics<P extends object>(
  Component: React.ComponentType<P>,
  eventName?: string,
) {
  return function AnalyticsWrappedComponent(props: P) {
    const { trackEvent } = useAnalytics();

    useEffect(() => {
      if (eventName) {
        trackEvent(`component_mounted`, {
          component: eventName,
          props: Object.keys(props as Record<string, unknown>),
        });
      }
    }, [trackEvent, props]);

    return <Component {...props} />;
  };
}

/**
 * Analytics provider component
 */
interface AnalyticsProviderProps {
  children: React.ReactNode;
  config: AnalyticsConfig;
}

export function AnalyticsProvider({
  children,
  config,
}: AnalyticsProviderProps) {
  useEffect(() => {
    const analytics = CSPAnalytics.getInstance(config);
    analytics.initialize();

    // Track unhandled errors
    const handleError = (event: ErrorEvent) => {
      analytics.trackError(new Error(event.message), {
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
      });
    };

    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      analytics.trackError(new Error(String(event.reason)), {
        type: "unhandled_promise_rejection",
      });
    };

    window.addEventListener("error", handleError);
    window.addEventListener("unhandledrejection", handleUnhandledRejection);

    return () => {
      window.removeEventListener("error", handleError);
      window.removeEventListener(
        "unhandledrejection",
        handleUnhandledRejection,
      );
    };
  }, [config]);

  return <>{children}</>;
}
