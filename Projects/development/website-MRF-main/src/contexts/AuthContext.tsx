"use client";

/**
 * AuthContext - Secure Authentication with httpOnly Cookies
 *
 * This context provides authentication using server-side httpOnly cookies
 * instead of localStorage for improved security against XSS attacks.
 *
 * Security features:
 * - Tokens stored in httpOnly cookies (not accessible to JavaScript)
 * - CSRF protection via X-Requested-With header
 * - Automatic session validation on mount
 * - Secure cookie settings (httpOnly, secure, sameSite)
 * - Session expiry detection and handling
 * - Cross-tab synchronization via localStorage events
 * - Session refresh functionality with user notification
 */

import { SessionExpiryModal } from "@/components/auth/session-expiry-modal";
import { toast } from "@/hooks/useToast";
import type { LoginRequest, RegisterRequest, User } from "@/types/auth";
import type { GradeLevel } from "@/types/lecture";
import { usePathname, useRouter } from "next/navigation";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

// Session configuration constants
const SESSION_CHECK_INTERVAL = 60 * 1000; // Check every 1 minute
const SESSION_WARNING_THRESHOLD = 5 * 60 * 1000; // Show warning 5 minutes before expiry
const SESSION_MODAL_COUNTDOWN = 60; // Seconds to show in modal before auto-logout
const INACTIVITY_THRESHOLD = 30 * 60 * 1000; // 30 minutes of inactivity

// Storage keys for cross-tab sync
const AUTH_SYNC_KEY = "mrf-auth-sync";
const AUTH_LOGOUT_EVENT = "logout";
const AUTH_SESSION_EXPIRED_EVENT = "session-expired";
const AUTH_SESSION_REFRESHED_EVENT = "session-refreshed";

/** Session expiry reason codes */
type SessionExpiryReason = "expired" | "invalid" | "logout" | "error";

/** Session state information */
interface SessionState {
  expiresAt: number | null;
  timeRemaining: number | null;
  isExpiringSoon: boolean;
  isExpired: boolean;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  /** Reason for session expiry (if any) */
  sessionExpiryReason: SessionExpiryReason | null;
  /** Current session state */
  sessionState: SessionState;

  // Actions
  login: (credentials: LoginRequest) => Promise<void>;
  register: (data: RegisterRequest) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
  /** Refresh the session token to extend expiry */
  refreshSession: () => Promise<boolean>;
  clearError: () => void;
  /** Check if the current session is valid (calls /api/auth/me) */
  checkSession: () => Promise<boolean>;
  /** Clear the session expiry reason */
  clearSessionExpiry: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sessionExpiryReason, setSessionExpiryReason] =
    useState<SessionExpiryReason | null>(null);
  const [sessionState, setSessionState] = useState<SessionState>({
    expiresAt: null,
    timeRemaining: null,
    isExpiringSoon: false,
    isExpired: false,
  });
  const [showExpiryModal, setShowExpiryModal] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Refs for cleanup and state tracking
  const sessionCheckIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const lastActivityTimeRef = useRef<number>(Date.now());
  const warningToastShownRef = useRef(false);

  // Broadcast auth events to other tabs
  const broadcastAuthEvent = useCallback((event: string) => {
    try {
      localStorage.setItem(
        AUTH_SYNC_KEY,
        JSON.stringify({ event, timestamp: Date.now() }),
      );
      // Clean up immediately to allow future events
      setTimeout(() => localStorage.removeItem(AUTH_SYNC_KEY), 100);
    } catch (e) {
      // localStorage might not be available
      console.warn("Could not broadcast auth event:", e);
    }
  }, []);

  // Check session status from server
  const checkSessionStatus = useCallback(async (): Promise<SessionState> => {
    try {
      const response = await fetch("/api/auth/refresh", {
        method: "GET",
        headers: {
          "X-Requested-With": "XMLHttpRequest",
        },
        credentials: "include",
      });

      const data = await response.json();

      if (!response.ok || !data.success || !data.authenticated) {
        return {
          expiresAt: null,
          timeRemaining: null,
          isExpiringSoon: false,
          isExpired: true,
        };
      }

      const timeRemaining = data.timeRemaining || 0;
      const isExpiringSoon =
        timeRemaining <= SESSION_WARNING_THRESHOLD && timeRemaining > 0;

      return {
        expiresAt: data.expiresAt,
        timeRemaining,
        isExpiringSoon,
        isExpired: data.isExpired || false,
      };
    } catch (err) {
      console.error("Failed to check session status:", err);
      return {
        expiresAt: null,
        timeRemaining: null,
        isExpiringSoon: false,
        isExpired: false, // Don't mark as expired on network error
      };
    }
  }, []);

  // Refresh the session token
  const refreshSession = useCallback(async (): Promise<boolean> => {
    try {
      setIsRefreshing(true);

      const response = await fetch("/api/auth/refresh", {
        method: "POST",
        headers: {
          "X-Requested-With": "XMLHttpRequest",
        },
        credentials: "include",
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        toast({
          variant: "destructive",
          title: "فشل تمديد الجلسة",
          description: data.error || "يرجى تسجيل الدخول مرة أخرى",
        });
        return false;
      }

      // Update session state with new expiry
      setSessionState({
        expiresAt: data.expiresAt,
        timeRemaining: data.expiresAt - Date.now(),
        isExpiringSoon: false,
        isExpired: false,
      });

      // Reset warning flag
      warningToastShownRef.current = false;

      // Close expiry modal if open
      setShowExpiryModal(false);

      // Notify other tabs
      broadcastAuthEvent(AUTH_SESSION_REFRESHED_EVENT);

      toast({
        variant: "success",
        title: "تم تمديد الجلسة",
        description: "يمكنك متابعة استخدام المنصة",
      });

      return true;
    } catch (err) {
      console.error("Failed to refresh session:", err);
      toast({
        variant: "destructive",
        title: "خطأ في تمديد الجلسة",
        description: "يرجى المحاولة مرة أخرى",
      });
      return false;
    } finally {
      setIsRefreshing(false);
    }
  }, [broadcastAuthEvent]);

  // Handle session expiry
  const handleSessionExpiry = useCallback(async () => {
    setUser(null);
    setSessionState({
      expiresAt: null,
      timeRemaining: null,
      isExpiringSoon: false,
      isExpired: true,
    });
    setSessionExpiryReason("expired");
    setShowExpiryModal(false);

    // Clear session check interval
    if (sessionCheckIntervalRef.current) {
      clearInterval(sessionCheckIntervalRef.current);
      sessionCheckIntervalRef.current = null;
    }

    // Notify other tabs
    broadcastAuthEvent(AUTH_SESSION_EXPIRED_EVENT);

    toast({
      variant: "warning",
      title: "انتهت جلستك",
      description: "يرجى تسجيل الدخول مرة أخرى",
    });

    const redirectPath =
      pathname && !pathname.includes("/auth") ? pathname : "/ar/dashboard";
    router.push(
      `/ar/auth/login?redirect=${encodeURIComponent(redirectPath)}&message=${encodeURIComponent("انتهت جلستك. يرجى تسجيل الدخول مرة أخرى.")}`,
    );
  }, [broadcastAuthEvent, router, pathname]);

  // Load user from httpOnly cookie on mount
  const loadUser = useCallback(
    async (isSessionCheck = false): Promise<boolean> => {
      try {
        if (!isSessionCheck) {
          setIsLoading(true);
        }

        // Call API to get user from httpOnly cookie
        // Note: 401 responses are expected when user is not authenticated
        const response = await fetch("/api/auth/me", {
          method: "GET",
          headers: {
            "X-Requested-With": "XMLHttpRequest",
          },
          credentials: "include", // Important: include cookies
        });

        const data = await response.json();

        if (response.ok && data.success) {
          // Map API response to User type
          const userData: User = {
            id: data.user.id,
            email: data.user.email,
            name: data.user.name,
            phone: data.user.phone,
            gradeLevel: data.user.gradeLevel as GradeLevel,
            role: data.user.role,
            subscriptionStatus: data.user.subscriptionStatus || "inactive",
            subscriptionPlan: data.user.subscriptionPlan,
            emailVerified: data.user.verified || false,
            phoneVerified: false,
            createdAt: new Date(data.user.createdAt),
            updatedAt: new Date(),
            lastLoginAt: new Date(),
            preferences: {
              language: "ar",
              theme: "system",
              notifications: {
                email: true,
                push: true,
                sms: false,
                newLecture: true,
                quizReminder: true,
                homeworkDeadline: true,
                gradePosted: true,
                teacherFeedback: true,
              },
              privacy: {
                showProfile: true,
                showProgress: true,
                allowMessages: true,
              },
            },
          };
          setUser(userData);
          setSessionExpiryReason(null);

          // Check session status after loading user
          if (!isSessionCheck) {
            const status = await checkSessionStatus();
            setSessionState(status);
          }

          return true;
        } else {
          // Handle specific error codes for session expiry
          if (data.code === "INVALID_TOKEN") {
            setSessionExpiryReason("invalid");
          } else if (data.code === "NO_TOKEN" && user !== null) {
            // Had a user but now no token - session expired
            setSessionExpiryReason("expired");
          }
          setUser(null);
          setSessionState({
            expiresAt: null,
            timeRemaining: null,
            isExpiringSoon: false,
            isExpired: true,
          });
          return false;
        }
      } catch (err) {
        // Suppress console error for expected 401s when checking auth on load
        if (!isSessionCheck) {
          console.error("Failed to load user:", err);
        }
        if (user !== null) {
          setSessionExpiryReason("error");
        }
        setUser(null);
        return false;
      } finally {
        if (!isSessionCheck) {
          setIsLoading(false);
        }
      }
    },
    [user, checkSessionStatus],
  );

  // Check session validity (can be called explicitly)
  const checkSession = useCallback(async (): Promise<boolean> => {
    return await loadUser(true);
  }, [loadUser]);

  // Clear session expiry reason
  const clearSessionExpiry = useCallback(() => {
    setSessionExpiryReason(null);
  }, []);

  // Load user on mount
  useEffect(() => {
    loadUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Track user activity for session management
  useEffect(() => {
    const updateActivity = () => {
      lastActivityTimeRef.current = Date.now();
    };

    // Track user interactions
    window.addEventListener("click", updateActivity);
    window.addEventListener("keydown", updateActivity);
    window.addEventListener("scroll", updateActivity);
    window.addEventListener("touchstart", updateActivity);

    return () => {
      window.removeEventListener("click", updateActivity);
      window.removeEventListener("keydown", updateActivity);
      window.removeEventListener("scroll", updateActivity);
      window.removeEventListener("touchstart", updateActivity);
    };
  }, []);

  // Session monitoring effect
  useEffect(() => {
    if (!user) {
      // Clear interval when no user
      if (sessionCheckIntervalRef.current) {
        clearInterval(sessionCheckIntervalRef.current);
        sessionCheckIntervalRef.current = null;
      }
      return;
    }

    // Check session status periodically
    const checkSessionPeriodically = async () => {
      const timeSinceLastActivity = Date.now() - lastActivityTimeRef.current;

      // Only check session if user has been active recently
      if (timeSinceLastActivity >= INACTIVITY_THRESHOLD) {
        return;
      }

      const status = await checkSessionStatus();
      setSessionState(status);

      if (status.isExpired) {
        handleSessionExpiry();
        return;
      }

      // Show warning toast when approaching expiry (only once)
      if (status.isExpiringSoon && !warningToastShownRef.current) {
        warningToastShownRef.current = true;
        const minutesRemaining = Math.ceil((status.timeRemaining || 0) / 60000);

        toast({
          variant: "warning",
          title: "جلستك على وشك الانتهاء",
          description: `ستنتهي جلستك خلال ${minutesRemaining} دقائق`,
        });

        // Show modal for user action
        setShowExpiryModal(true);
      }
    };

    // Initial check
    checkSessionPeriodically();

    // Set up interval
    sessionCheckIntervalRef.current = setInterval(
      checkSessionPeriodically,
      SESSION_CHECK_INTERVAL,
    );

    return () => {
      if (sessionCheckIntervalRef.current) {
        clearInterval(sessionCheckIntervalRef.current);
        sessionCheckIntervalRef.current = null;
      }
    };
  }, [user, checkSessionStatus, handleSessionExpiry]);

  // Cross-tab synchronization effect
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key !== AUTH_SYNC_KEY || !e.newValue) return;

      try {
        const { event } = JSON.parse(e.newValue);

        switch (event) {
          case AUTH_LOGOUT_EVENT:
          case AUTH_SESSION_EXPIRED_EVENT:
            // Another tab logged out or session expired
            setUser(null);
            setSessionState({
              expiresAt: null,
              timeRemaining: null,
              isExpiringSoon: false,
              isExpired: true,
            });
            setSessionExpiryReason(
              event === AUTH_LOGOUT_EVENT ? "logout" : "expired",
            );
            setShowExpiryModal(false);

            // Clear interval
            if (sessionCheckIntervalRef.current) {
              clearInterval(sessionCheckIntervalRef.current);
              sessionCheckIntervalRef.current = null;
            }

            router.push("/ar/auth/login");
            break;

          case AUTH_SESSION_REFRESHED_EVENT:
            // Another tab refreshed the session, update our state
            checkSessionStatus().then(setSessionState);
            setShowExpiryModal(false);
            warningToastShownRef.current = false;
            break;
        }
      } catch (err) {
        console.warn("Failed to parse auth sync event:", err);
      }
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, [router, checkSessionStatus]);

  const login = useCallback(
    async (credentials: LoginRequest) => {
      try {
        setError(null);
        setIsLoading(true);

        const response = await fetch("/api/auth/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-Requested-With": "XMLHttpRequest",
          },
          credentials: "include",
          body: JSON.stringify(credentials),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "فشل تسجيل الدخول");
        }

        // Cookie is set automatically by the server
        // Reset warning flag for new session
        warningToastShownRef.current = false;

        // Reload user data
        await loadUser();

        router.push("/ar/dashboard");
      } catch (err) {
        const message = err instanceof Error ? err.message : "فشل تسجيل الدخول";
        setError(message);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [loadUser, router],
  );

  const register = useCallback(
    async (data: RegisterRequest) => {
      try {
        setError(null);
        setIsLoading(true);

        const response = await fetch("/api/auth/register", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-Requested-With": "XMLHttpRequest",
          },
          credentials: "include",
          body: JSON.stringify(data),
        });

        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.error || "فشل إنشاء الحساب");
        }

        // Cookie is set automatically by the server
        // Redirect to email verification
        router.push("/ar/auth/verify-email");
      } catch (err) {
        const message = err instanceof Error ? err.message : "فشل إنشاء الحساب";
        setError(message);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [router],
  );

  const logout = useCallback(async () => {
    try {
      setIsLoading(true);

      await fetch("/api/auth/logout", {
        method: "POST",
        headers: {
          "X-Requested-With": "XMLHttpRequest",
        },
        credentials: "include",
      });

      // Clear user state
      setUser(null);
      setSessionState({
        expiresAt: null,
        timeRemaining: null,
        isExpiringSoon: false,
        isExpired: false,
      });
      setSessionExpiryReason("logout");
      setShowExpiryModal(false);

      // Clear session check interval
      if (sessionCheckIntervalRef.current) {
        clearInterval(sessionCheckIntervalRef.current);
        sessionCheckIntervalRef.current = null;
      }

      // Notify other tabs
      broadcastAuthEvent(AUTH_LOGOUT_EVENT);

      // Redirect to login
      router.push("/ar/auth/login");
    } catch (err) {
      console.error("Logout failed:", err);
    } finally {
      setIsLoading(false);
    }
  }, [router, broadcastAuthEvent]);

  const refreshUser = useCallback(async () => {
    await loadUser();
  }, [loadUser]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Handle modal actions
  const handleExtendSession = useCallback(async () => {
    await refreshSession();
  }, [refreshSession]);

  const handleModalLogout = useCallback(async () => {
    setShowExpiryModal(false);
    await logout();
  }, [logout]);

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    error,
    sessionExpiryReason,
    sessionState,
    login,
    register,
    logout,
    refreshUser,
    refreshSession,
    clearError,
    checkSession,
    clearSessionExpiry,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
      {/* Session Expiry Modal */}
      <SessionExpiryModal
        isOpen={showExpiryModal}
        onExtendSession={handleExtendSession}
        onLogout={handleModalLogout}
        secondsRemaining={SESSION_MODAL_COUNTDOWN}
        isRefreshing={isRefreshing}
      />
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
