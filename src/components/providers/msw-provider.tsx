"use client";

import { useEffect, useState } from "react";

interface MSWProviderProps {
  children: React.ReactNode;
}

/**
 * MSW Provider - Mock Service Worker for API mocking
 * SECURITY: Only initializes in development mode to prevent mock data leaking to production
 */
export function MSWProvider({ children }: MSWProviderProps) {
  const [isMSWReady, setIsMSWReady] = useState(false);
  const isDevelopment = process.env.NODE_ENV === "development";

  useEffect(() => {
    const initMSW = async () => {
      // SECURITY: Only initialize MSW in development mode
      if (typeof window !== "undefined" && isDevelopment) {
        try {
          const { worker } = await import("@/mocks/browser");

          await worker.start({
            onUnhandledRequest: "bypass",
            serviceWorker: {
              url: "/mockServiceWorker.js",
            },
          });

          if (process.env.NODE_ENV === "development") {
            console.log(
              "[MSW] Mock Service Worker started in development mode",
            );
          }
        } catch (error) {
          console.error("[MSW] Failed to initialize:", error);
        }
      }
      setIsMSWReady(true);
    };

    initMSW();
  }, [isDevelopment]);

  // In production, skip the loading state entirely
  if (!isDevelopment) {
    return <>{children}</>;
  }

  if (!isMSWReady) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return <>{children}</>;
}
