"use client";

import { useEffect } from "react";
import {
  initializeErrorReporting,
  errorReportingService,
} from "@/lib/error-reporting/error-service";

interface ErrorReportingProviderProps {
  children: React.ReactNode;
  userId?: string;
  sessionId?: string;
}

export function ErrorReportingProvider({
  children,
  userId,
  sessionId,
}: ErrorReportingProviderProps) {
  useEffect(() => {
    // Initialize error reporting
    initializeErrorReporting({
      userId,
      sessionId,
      tags: {
        component: "app",
        version: process.env.NEXT_PUBLIC_BUILD_VERSION || "unknown",
      },
    });

    // Set user context if provided
    if (userId) {
      errorReportingService.setUser(userId);
    }

    if (sessionId) {
      errorReportingService.setSession(sessionId);
    }

    // Add page-specific tags
    errorReportingService.addTag("page", window.location.pathname);
    errorReportingService.addTag(
      "locale",
      document.documentElement.lang || "unknown",
    );

    // Clean up old reports (keep only recent ones)
    const cleanup = () => {
      try {
        const reports = errorReportingService.getStoredReports();
        if (reports.length > 50) {
          errorReportingService.clearStoredReports();
        }
      } catch (error) {
        console.warn("Failed to cleanup error reports:", error);
      }
    };

    cleanup();

    // Cleanup on page unload
    const handleBeforeUnload = () => {
      cleanup();
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [userId, sessionId]);

  return <>{children}</>;
}
