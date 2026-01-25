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
 */

import type { LoginRequest, RegisterRequest, User } from "@/types/auth";
import type { GradeLevel } from "@/types/lecture";
import { useRouter } from "next/navigation";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;

  // Actions
  login: (credentials: LoginRequest) => Promise<void>;
  register: (data: RegisterRequest) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load user from httpOnly cookie on mount
  const loadUser = useCallback(async () => {
    try {
      setIsLoading(true);

      // Call API to get user from httpOnly cookie
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
      } else {
        // No valid session
        setUser(null);
      }
    } catch (err) {
      console.error("Failed to load user:", err);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Load user on mount
  useEffect(() => {
    loadUser();
  }, [loadUser]);

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
    [loadUser, router]
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
    [router]
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

      // Redirect to login
      router.push("/ar/auth/login");
    } catch (err) {
      console.error("Logout failed:", err);
    } finally {
      setIsLoading(false);
    }
  }, [router]);

  const refreshUser = useCallback(async () => {
    await loadUser();
  }, [loadUser]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    error,
    login,
    register,
    logout,
    refreshUser,
    clearError,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
