import { create } from "zustand";
import { persist } from "zustand/middleware";
import { tokenManager } from "@/lib/security/token-manager";
import { jwtUtils, getUserFromJWT } from "@/lib/security/jwt-utils";

interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  grade: string;
  avatar?: string;
  xp: number;
  level: number;
  streak: number;
  isVerified: boolean;
  createdAt: string;
}

interface RegisterData {
  name: string;
  email: string;
  phone: string;
  password: string;
  grade: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  tokenExpiry: number | null;
  login: (
    _email: string,
    _password: string,
    rememberMe?: boolean,
  ) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  verifyOTP: (_email: string, otp: string) => Promise<void>;
  resendOTP: (_email: string) => Promise<void>;
  forgotPassword: (_email: string) => Promise<void>;
  resetPassword: (_token: string, _password: string) => Promise<void>;
  logout: () => void;
  updateUser: (user: Partial<User>) => void;
  refreshToken: () => Promise<void>;
  initializeAuth: () => Promise<void>;
  getAccessToken: () => Promise<string | null>;
}

// Mock API functions - replace with real API calls
const mockAPI = {
  login: async (_email: string, _password: string) => {
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Mock validation
    if (_email === "test@example.com" && _password === "password") {
      // Create a realistic mock JWT token
      const mockToken = jwtUtils.createMockToken({
        sub: "1",
        email: _email,
        name: "أحمد محمد علي",
        grade: "grade3",
      });

      return {
        user: {
          id: "1",
          name: "أحمد محمد علي",
          email: _email,
          phone: "01234567890",
          grade: "grade3",
          xp: 1250,
          level: 5,
          streak: 7,
          isVerified: true,
          createdAt: new Date().toISOString(),
        },
        accessToken: mockToken,
        refreshToken: "mock-refresh-token-" + Date.now(),
        expiresIn: 3600, // 1 hour
      };
    }
    throw new Error("Invalid credentials");
  },

  register: async (data: RegisterData) => {
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Mock email check
    if (data.email === "existing@example.com") {
      throw new Error("Email already exists");
    }

    return {
      message: "Registration successful. Please verify your email.",
      tempUserId: "temp-" + Date.now(),
    };
  },

  verifyOTP: async (_email: string, otp: string) => {
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Mock OTP validation
    if (otp === "123456") {
      const mockToken = jwtUtils.createMockToken({
        sub: "2",
        email: _email,
        name: "مستخدم جديد",
        grade: "grade1",
      });

      return {
        user: {
          id: "2",
          name: "مستخدم جديد",
          email: _email,
          phone: "01234567890",
          grade: "grade1",
          xp: 0,
          level: 1,
          streak: 0,
          isVerified: true,
          createdAt: new Date().toISOString(),
        },
        accessToken: mockToken,
        refreshToken: "mock-refresh-token-" + Date.now(),
        expiresIn: 3600,
      };
    }
    throw new Error("Invalid OTP");
  },

  resendOTP: async (_email: string) => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    return { message: "OTP sent successfully" };
  },

  forgotPassword: async (_email: string) => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return { message: "Password reset link sent to your email" };
  },

  resetPassword: async (_token: string, _password: string) => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return { message: "Password reset successfully" };
  },

  refreshToken: async (refreshToken: string) => {
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Mock refresh token validation
    if (refreshToken.startsWith("mock-refresh-token-")) {
      const newMockToken = jwtUtils.createMockToken({
        sub: "1",
        email: "test@example.com",
        name: "أحمد محمد علي",
        grade: "grade3",
      });

      return {
        accessToken: newMockToken,
        refreshToken: "mock-refresh-token-" + Date.now(),
        expiresIn: 3600,
        userId: "1",
      };
    }

    throw new Error("Invalid refresh _token");
  },
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      tokenExpiry: null,

      initializeAuth: async () => {
        try {
          const tokenData = await tokenManager.getTokens();
          if (tokenData) {
            // Extract user data from JWT token
            const userData = getUserFromJWT(tokenData.accessToken);
            if (userData) {
              set({
                isAuthenticated: true,
                tokenExpiry: tokenData.expiresAt,
                // Keep existing user data from persistence, update with _token data
                user:
                  get().user && (userData as any)?.id
                    ? { ...get().user, ...(userData as User) }
                    : null,
              });
            }
          } else {
            set({
              user: null,
              isAuthenticated: false,
              tokenExpiry: null,
            });
          }
        } catch (error) {
          console.error("Auth initialization failed:", error);
          set({
            user: null,
            isAuthenticated: false,
            tokenExpiry: null,
          });
        }
      },

      login: async (_email: string, _password: string, rememberMe = false) => {
        set({ isLoading: true });
        try {
          const response = await mockAPI.login(_email, _password);

          // Store tokens securely
          await tokenManager.storeTokens(
            response.accessToken,
            response.refreshToken,
            response.expiresIn,
            response.user.id,
            rememberMe,
          );

          set({
            user: response.user,
            isAuthenticated: true,
            isLoading: false,
            tokenExpiry: Date.now() + response.expiresIn * 1000,
          });
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      register: async (data: RegisterData) => {
        set({ isLoading: true });
        try {
          await mockAPI.register(data);
          set({ isLoading: false });
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      verifyOTP: async (_email: string, otp: string) => {
        set({ isLoading: true });
        try {
          const response = await mockAPI.verifyOTP(_email, otp);

          // Store tokens securely
          await tokenManager.storeTokens(
            response.accessToken,
            response.refreshToken,
            response.expiresIn,
            response.user.id,
            true, // Remember user after OTP verification
          );

          set({
            user: response.user,
            isAuthenticated: true,
            isLoading: false,
            tokenExpiry: Date.now() + response.expiresIn * 1000,
          });
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      resendOTP: async (_email: string) => {
        set({ isLoading: true });
        try {
          await mockAPI.resendOTP(_email);
          set({ isLoading: false });
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      forgotPassword: async (_email: string) => {
        set({ isLoading: true });
        try {
          await mockAPI.forgotPassword(_email);
          set({ isLoading: false });
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      resetPassword: async (_token: string, _password: string) => {
        set({ isLoading: true });
        try {
          await mockAPI.resetPassword(_token, _password);
          set({ isLoading: false });
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      logout: () => {
        // Clear secure tokens
        tokenManager.clearTokens();

        set({
          user: null,
          isAuthenticated: false,
          tokenExpiry: null,
        });
      },

      updateUser: (userData: Partial<User>) => {
        const { user } = get();
        if (user) {
          set({
            user: { ...user, ...userData },
          });
        }
      },

      refreshToken: async () => {
        try {
          const tokenData = await tokenManager.getTokens();
          if (!tokenData?.refreshToken) {
            throw new Error("No refresh _token available");
          }

          const response = await mockAPI.refreshToken(tokenData.refreshToken);

          // Store new tokens
          await tokenManager.storeTokens(
            response.accessToken,
            response.refreshToken,
            response.expiresIn,
            response.userId,
            localStorage.getItem("mrf_secure_tokens") !== null,
          );

          set({
            tokenExpiry: Date.now() + response.expiresIn * 1000,
          });
        } catch (error) {
          // If refresh fails, logout user
          get().logout();
          throw error;
        }
      },

      getAccessToken: async () => {
        return await tokenManager.getAccessToken();
      },
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    },
  ),
);
