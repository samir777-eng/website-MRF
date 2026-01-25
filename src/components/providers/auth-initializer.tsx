"use client";

import { useEffect, useState } from "react";
import { useAuthInit, useAuthMonitor } from "@/lib/hooks/use-auth-init";

interface AuthInitializerProps {
  children: React.ReactNode;
}

/**
 * AuthInitializer component that handles authentication initialization
 * and provides loading states during auth setup
 */
export function AuthInitializer({ children }: AuthInitializerProps) {
  const { isInitialized, isLoading, error } = useAuthInit();
  const { isExpiringSoon, minutesUntilExpiry } = useAuthMonitor();
  const [showExpiryWarning, setShowExpiryWarning] = useState(false);

  // Show expiry warning when token is expiring soon
  useEffect(() => {
    if (isExpiringSoon && minutesUntilExpiry > 0) {
      setShowExpiryWarning(true);

      // Auto-hide warning after 10 seconds
      const timer = setTimeout(() => {
        setShowExpiryWarning(false);
      }, 10000);

      return () => clearTimeout(timer);
    } else {
      setShowExpiryWarning(false);
    }
  }, [isExpiringSoon, minutesUntilExpiry]);

  // Show loading screen while initializing
  if (isLoading || !isInitialized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-secondary-50">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 mx-auto">
            <div className="w-16 h-16 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin"></div>
          </div>
          <div className="space-y-2">
            <h2 className="text-xl font-semibold text-primary-900">
              جاري تحميل المنصة...
            </h2>
            <p className="text-sm text-primary-600">يتم تهيئة نظام المصادقة</p>
          </div>
        </div>
      </div>
    );
  }

  // Show error screen if initialization failed
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-orange-50">
        <div className="text-center space-y-4 max-w-md mx-auto p-6">
          <div className="w-16 h-16 mx-auto bg-red-100 rounded-full flex items-center justify-center">
            <svg
              className="w-8 h-8 text-red-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
          </div>
          <div className="space-y-2">
            <h2 className="text-xl font-semibold text-red-900">
              خطأ في تهيئة المنصة
            </h2>
            <p className="text-sm text-red-600">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
            >
              إعادة المحاولة
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      {children}

      {/* Token Expiry Warning */}
      {showExpiryWarning && (
        <div className="fixed top-4 right-4 z-50 max-w-sm">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 shadow-lg">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <svg
                  className="w-5 h-5 text-yellow-400"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ms-3">
                <h3 className="text-sm font-medium text-yellow-800">
                  انتهاء صلاحية الجلسة قريباً
                </h3>
                <p className="mt-1 text-sm text-yellow-700">
                  ستنتهي جلستك خلال {minutesUntilExpiry} دقيقة. سيتم تجديدها
                  تلقائياً.
                </p>
              </div>
              <div className="ms-auto ps-3">
                <button
                  onClick={() => setShowExpiryWarning(false)}
                  className="inline-flex rounded-md bg-yellow-50 p-1.5 text-yellow-500 hover:bg-yellow-100 focus:outline-none focus:ring-2 focus:ring-yellow-600 focus:ring-offset-2 focus:ring-offset-yellow-50"
                >
                  <span className="sr-only">إغلاق</span>
                  <svg
                    className="w-3 h-3"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

/**
 * Development-only auth debug panel
 */
export function AuthDebugPanel() {
  const [isVisible, setIsVisible] = useState(false);

  // Only show in development
  if (process.env.NODE_ENV !== "development") {
    return null;
  }

  return (
    <>
      {/* Debug toggle button */}
      <button
        onClick={() => setIsVisible(!isVisible)}
        className="fixed bottom-4 left-4 z-50 bg-gray-800 text-white p-2 rounded-full shadow-lg hover:bg-gray-700 transition-colors"
        title="Toggle Auth Debug Panel"
      >
        🔐
      </button>

      {/* Debug panel */}
      {isVisible && (
        <div className="fixed bottom-16 left-4 z-50 bg-white border border-gray-200 rounded-lg shadow-xl p-4 max-w-sm">
          <div className="space-y-2">
            <h3 className="font-semibold text-gray-900">Auth Debug</h3>
            <AuthDebugInfo />
          </div>
        </div>
      )}
    </>
  );
}

/**
 * Auth debug information component
 */
function AuthDebugInfo() {
  const { isAuthenticated, user, timeUntilExpiry, minutesUntilExpiry } =
    useAuthMonitor();
  const [tokenInfo, setTokenInfo] = useState<{
    isValid: boolean;
    isExpired: boolean;
    error?: string;
  } | null>(null);

  useEffect(() => {
    const updateTokenInfo = async () => {
      try {
        const { tokenManager } = await import("@/lib/security/token-manager");
        const { jwtUtils } = await import("@/lib/security/jwt-utils");

        const token = await tokenManager.getAccessToken();
        if (token) {
          const metadata = jwtUtils.getTokenMetadata(token);
          setTokenInfo(metadata);
        } else {
          setTokenInfo(null);
        }
      } catch (_error) {
        setTokenInfo({
          isValid: false,
          isExpired: true,
          error: "Failed to load token info",
        });
      }
    };

    updateTokenInfo();
    const interval = setInterval(updateTokenInfo, 5000);

    return () => clearInterval(interval);
  }, [isAuthenticated]);

  return (
    <div className="text-sm space-y-1">
      <div className="flex justify-between">
        <span>Authenticated:</span>
        <span className={isAuthenticated ? "text-green-600" : "text-red-600"}>
          {isAuthenticated ? "Yes" : "No"}
        </span>
      </div>

      {user && (
        <div className="flex justify-between">
          <span>User:</span>
          <span className="truncate max-w-24" title={user.email}>
            {user.name}
          </span>
        </div>
      )}

      {timeUntilExpiry > 0 && (
        <div className="flex justify-between">
          <span>Expires in:</span>
          <span
            className={
              minutesUntilExpiry <= 5 ? "text-yellow-600" : "text-gray-600"
            }
          >
            {minutesUntilExpiry}m
          </span>
        </div>
      )}

      {tokenInfo && (
        <div className="flex justify-between">
          <span>Token valid:</span>
          <span
            className={
              tokenInfo.isValid && !tokenInfo.isExpired
                ? "text-green-600"
                : "text-red-600"
            }
          >
            {tokenInfo.isValid && !tokenInfo.isExpired ? "Yes" : "No"}
          </span>
        </div>
      )}
    </div>
  );
}
