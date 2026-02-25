"use client";

/**
 * useRequireAuth Hook - Client-side authentication protection
 *
 * This hook provides client-side route protection as a backup to server-side
 * middleware protection. It handles:
 * - Redirecting unauthenticated users to login
 * - Preserving the intended destination for redirect after login
 * - Showing loading state during authentication check
 * - Handling session expiry
 *
 * Usage:
 * const { isAuthenticated, isLoading, user } = useRequireAuth();
 *
 * if (isLoading) return <LoadingSpinner />;
 * // Component will auto-redirect if not authenticated
 */

import { useEffect, useState, useCallback } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";

interface UseRequireAuthOptions {
  /** Redirect path if not authenticated (default: /ar/auth/login) */
  redirectTo?: string;
  /** If true, redirect authenticated users away (for login/signup pages) */
  redirectIfAuthenticated?: boolean;
  /** Path to redirect authenticated users to (default: /ar/dashboard) */
  authenticatedRedirect?: string;
  /** Required roles for access (optional) */
  allowedRoles?: ("student" | "teacher" | "admin")[];
  /** If true, require active subscription */
  requireSubscription?: boolean;
}

interface UseRequireAuthResult {
  /** Whether the user is authenticated */
  isAuthenticated: boolean;
  /** Whether authentication is being checked */
  isLoading: boolean;
  /** The current user (null if not authenticated) */
  user: ReturnType<typeof useAuth>["user"];
  /** Whether access is authorized (includes role check) */
  isAuthorized: boolean;
  /** Any error message */
  error: string | null;
}

export function useRequireAuth(
  options: UseRequireAuthOptions = {}
): UseRequireAuthResult {
  const {
    redirectTo = "/ar/auth/login",
    redirectIfAuthenticated = false,
    authenticatedRedirect = "/ar/dashboard",
    allowedRoles,
    requireSubscription = false,
  } = options;

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();

  const [isAuthorized, setIsAuthorized] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasChecked, setHasChecked] = useState(false);

  // Build the redirect URL with current path
  const buildLoginUrl = useCallback(() => {
    const url = new URL(redirectTo, window.location.origin);
    url.searchParams.set("redirect", pathname);
    url.searchParams.set("message", "يرجى تسجيل الدخول للوصول إلى هذه الصفحة");
    return url.pathname + url.search;
  }, [redirectTo, pathname]);

  // Handle redirect after login
  const handleRedirectAfterLogin = useCallback(() => {
    const redirectPath = searchParams.get("redirect");
    if (redirectPath && redirectPath !== pathname) {
      router.push(redirectPath);
    } else {
      router.push(authenticatedRedirect);
    }
  }, [searchParams, pathname, router, authenticatedRedirect]);

  useEffect(() => {
    // Wait for auth to finish loading
    if (authLoading) {
      return;
    }

    // Mark that we've done the check
    setHasChecked(true);

    // Handle redirect if authenticated (for login/signup pages)
    if (redirectIfAuthenticated && isAuthenticated) {
      handleRedirectAfterLogin();
      return;
    }

    // Handle unauthenticated users on protected routes
    if (!redirectIfAuthenticated && !isAuthenticated) {
      const loginUrl = buildLoginUrl();
      router.push(loginUrl);
      return;
    }

    // Check role authorization
    if (isAuthenticated && allowedRoles && user) {
      if (!allowedRoles.includes(user.role)) {
        setError("ليس لديك صلاحية للوصول إلى هذه الصفحة");
        setIsAuthorized(false);
        router.push("/ar/dashboard");
        return;
      }
    }

    // Check subscription status
    if (isAuthenticated && requireSubscription && user) {
      if (user.subscriptionStatus !== "active") {
        setError("يرجى الاشتراك للوصول إلى هذه الصفحة");
        setIsAuthorized(false);
        router.push("/ar/subscription");
        return;
      }
    }

    // All checks passed
    if (isAuthenticated) {
      setIsAuthorized(true);
      setError(null);
    }
  }, [
    authLoading,
    isAuthenticated,
    user,
    redirectIfAuthenticated,
    allowedRoles,
    requireSubscription,
    router,
    buildLoginUrl,
    handleRedirectAfterLogin,
  ]);

  return {
    isAuthenticated,
    isLoading: authLoading || !hasChecked,
    user,
    isAuthorized,
    error,
  };
}

/**
 * Hook for pages that should only be accessible when NOT authenticated
 * (login, signup, forgot password, etc.)
 */
export function useRedirectIfAuthenticated(
  redirectTo: string = "/ar/dashboard"
) {
  return useRequireAuth({
    redirectIfAuthenticated: true,
    authenticatedRedirect: redirectTo,
    redirectTo: "/ar/auth/login", // Not used but required
  });
}

/**
 * Hook for pages that require specific roles
 */
export function useRequireRole(roles: ("student" | "teacher" | "admin")[]) {
  return useRequireAuth({
    allowedRoles: roles,
  });
}

/**
 * Hook for pages that require active subscription
 */
export function useRequireSubscription() {
  return useRequireAuth({
    requireSubscription: true,
  });
}

export default useRequireAuth;
