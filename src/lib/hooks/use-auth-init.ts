// Authentication initialization hook
// Handles app startup authentication, token validation, and automatic refresh

import { useEffect, useState } from "react";
import { useAuthStore } from "@/lib/store/auth-store";
import { tokenManager } from "@/lib/security/token-manager";
import { jwtUtils } from "@/lib/security/jwt-utils";

interface AuthInitState {
  isInitialized: boolean;
  isLoading: boolean;
  error: string | null;
}

/**
 * Hook to initialize authentication on app startup
 * Checks for existing tokens, validates them, and sets up auth state
 */
export function useAuthInit(): AuthInitState {
  const [state, setState] = useState<AuthInitState>({
    isInitialized: false,
    isLoading: true,
    error: null,
  });

  const { initializeAuth, logout } = useAuthStore();

  useEffect(() => {
    let isMounted = true;

    const initializeAuthentication = async () => {
      try {
        setState((prev) => ({ ...prev, isLoading: true, error: null }));

        // Initialize the auth store with existing tokens
        await initializeAuth();

        // Validate current authentication state
        const isAuthenticated = await tokenManager.isAuthenticated();

        if (isAuthenticated) {
          const tokenData = await tokenManager.getTokens();

          if (tokenData) {
            // Validate token format and claims
            const isValidFormat = jwtUtils.isValidTokenFormat(
              tokenData.accessToken,
            );
            const isValidClaims = jwtUtils.validateTokenClaims(
              tokenData.accessToken,
              "mrf-edu-platform", // expected audience
              "mrf-edu-dev", // expected issuer for development
            );

            if (!isValidFormat || !isValidClaims) {
              console.warn("Invalid token detected, clearing authentication");
              logout();
            } else {
              // Check if token is fresh (not too old)
              const isFresh = jwtUtils.isTokenFresh(
                tokenData.accessToken,
                60 * 24,
              ); // 24 hours

              if (!isFresh) {
                console.warn("Token is too old, may need refresh");
                // Token is old but still valid, let automatic refresh handle it
              }
            }
          }
        }

        if (isMounted) {
          setState({
            isInitialized: true,
            isLoading: false,
            error: null,
          });
        }
      } catch (error) {
        console.error("Auth initialization failed:", error);

        // Clear any corrupted auth state
        logout();

        if (isMounted) {
          setState({
            isInitialized: true,
            isLoading: false,
            error:
              error instanceof Error
                ? error.message
                : "Authentication initialization failed",
          });
        }
      }
    };

    initializeAuthentication();

    return () => {
      isMounted = false;
    };
  }, [initializeAuth, logout]);

  return state;
}

/**
 * Hook to monitor authentication state changes
 * Provides real-time auth status and token expiration info
 */
export function useAuthMonitor() {
  const { isAuthenticated, tokenExpiry, user } = useAuthStore();
  const [timeUntilExpiry, setTimeUntilExpiry] = useState<number>(0);
  const [isExpiringSoon, setIsExpiringSoon] = useState(false);

  useEffect(() => {
    if (!isAuthenticated || !tokenExpiry) {
      setTimeUntilExpiry(0);
      setIsExpiringSoon(false);
      return;
    }

    const updateTimer = () => {
      const now = Date.now();
      const remaining = Math.max(0, tokenExpiry - now);
      const minutes = Math.floor(remaining / (1000 * 60));

      setTimeUntilExpiry(remaining);
      setIsExpiringSoon(minutes <= 5 && minutes > 0); // Warn when 5 minutes or less
    };

    // Update immediately
    updateTimer();

    // Update every minute
    const interval = setInterval(updateTimer, 60000);

    return () => clearInterval(interval);
  }, [isAuthenticated, tokenExpiry]);

  return {
    isAuthenticated,
    user,
    timeUntilExpiry,
    isExpiringSoon,
    minutesUntilExpiry: Math.floor(timeUntilExpiry / (1000 * 60)),
  };
}

/**
 * Hook for handling authentication errors and token refresh
 */
export function useAuthErrorHandler() {
  const { refreshToken, logout } = useAuthStore();
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleAuthError = async (error: {
    status?: number;
    message?: string;
  }): Promise<boolean> => {
    // Check if this is an authentication error
    if (error?.status === 401 || error?.message?.includes("Unauthorized")) {
      try {
        setIsRefreshing(true);

        // Try to refresh the token
        await refreshToken();

        setIsRefreshing(false);
        return true; // Successfully refreshed
      } catch (refreshError) {
        console.error("Token refresh failed:", refreshError);

        // Refresh failed, logout user
        logout();
        setIsRefreshing(false);
        return false;
      }
    }

    return false; // Not an auth error or couldn't handle it
  };

  return {
    handleAuthError,
    isRefreshing,
  };
}

/**
 * Hook for secure token operations
 */
export function useSecureToken() {
  const { getAccessToken } = useAuthStore();

  const getTokenForRequest = async (): Promise<string | null> => {
    try {
      return await getAccessToken();
    } catch (error) {
      console.error("Failed to get access token:", error);
      return null;
    }
  };

  const getTokenMetadata = async () => {
    try {
      const token = await getAccessToken();
      if (!token) return null;

      return jwtUtils.getTokenMetadata(token);
    } catch (error) {
      console.error("Failed to get token metadata:", error);
      return null;
    }
  };

  const validateCurrentToken = async (): Promise<boolean> => {
    try {
      const token = await getAccessToken();
      if (!token) return false;

      return (
        jwtUtils.isValidTokenFormat(token) && !jwtUtils.isTokenExpired(token)
      );
    } catch (error) {
      console.error("Token validation failed:", error);
      return false;
    }
  };

  return {
    getTokenForRequest,
    getTokenMetadata,
    validateCurrentToken,
  };
}

/**
 * Hook for development/debugging authentication
 */
export function useAuthDebug() {
  const { user, isAuthenticated, tokenExpiry } = useAuthStore();
  const [debugInfo, setDebugInfo] = useState<{
    isAuthenticated: boolean;
    user: { id: string; email: string; name: string } | null;
    tokenExpiry: string | null;
    hasToken: boolean;
    hasRefreshToken: boolean;
    tokenMetadata: unknown;
    error?: string;
  } | null>(null);

  useEffect(() => {
    if (process.env.NODE_ENV !== "development") return;

    const updateDebugInfo = async () => {
      try {
        const token = await tokenManager.getAccessToken();
        const tokenData = await tokenManager.getTokens();

        const info = {
          isAuthenticated,
          user: user
            ? { id: user.id, email: user.email, name: user.name }
            : null,
          tokenExpiry: tokenExpiry ? new Date(tokenExpiry).toISOString() : null,
          hasToken: !!token,
          hasRefreshToken: !!tokenData?.refreshToken,
          tokenMetadata: token ? jwtUtils.getTokenMetadata(token) : null,
        };

        setDebugInfo(info);
      } catch (error) {
        setDebugInfo((prev) => ({
          ...prev,
          isAuthenticated: false,
          user: null,
          tokenExpiry: null,
          hasToken: false,
          hasRefreshToken: false,
          tokenMetadata: null,
          error: error instanceof Error ? error.message : "Unknown error",
        }));
      }
    };

    updateDebugInfo();

    // Update debug info every 30 seconds in development
    const interval = setInterval(updateDebugInfo, 30000);

    return () => clearInterval(interval);
  }, [isAuthenticated, user, tokenExpiry]);

  // Log debug info to console in development
  useEffect(() => {
    if (process.env.NODE_ENV === "development" && debugInfo) {
      console.group("🔐 Auth Debug Info");
      console.table(debugInfo);
      console.groupEnd();
    }
  }, [debugInfo]);

  return debugInfo;
}
