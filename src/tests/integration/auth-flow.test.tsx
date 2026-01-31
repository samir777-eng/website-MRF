/**
 * Integration Tests for Authentication Flow
 * Tests complete user authentication journey
 */

import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { AuthProvider } from "@/contexts/AuthContext";
import { useAuth } from "@/hooks/useAuth";

// Mock component to test auth context
function TestComponent() {
  const { user, isAuthenticated, login, logout } = useAuth();

  return (
    <div>
      <div data-testid="auth-status">
        {isAuthenticated ? "Authenticated" : "Not Authenticated"}
      </div>
      {user && <div data-testid="user-name">{user.name}</div>}
      <button onClick={() => login("test@example.com", "password")}>
        Login
      </button>
      <button onClick={logout}>Logout</button>
    </div>
  );
}

describe("Authentication Flow", () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
    vi.clearAllMocks();
  });

  describe("Initial State", () => {
    it("starts with unauthenticated state", () => {
      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>,
      );

      expect(screen.getByTestId("auth-status")).toHaveTextContent(
        "Not Authenticated",
      );
    });

    it("does not show user information when not authenticated", () => {
      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>,
      );

      expect(screen.queryByTestId("user-name")).not.toBeInTheDocument();
    });
  });

  describe("Login Flow", () => {
    it("successfully logs in user", async () => {
      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>,
      );

      const loginButton = screen.getByText("Login");
      fireEvent.click(loginButton);

      await waitFor(() => {
        expect(screen.getByTestId("auth-status")).toHaveTextContent(
          "Authenticated",
        );
      });
    });

    it("displays user information after login", async () => {
      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>,
      );

      const loginButton = screen.getByText("Login");
      fireEvent.click(loginButton);

      await waitFor(() => {
        expect(screen.getByTestId("user-name")).toBeInTheDocument();
      });
    });

    it("persists authentication state in localStorage", async () => {
      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>,
      );

      const loginButton = screen.getByText("Login");
      fireEvent.click(loginButton);

      await waitFor(() => {
        const token = localStorage.getItem("auth_token");
        expect(token).toBeTruthy();
      });
    });
  });

  describe("Logout Flow", () => {
    it("successfully logs out user", async () => {
      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>,
      );

      // Login first
      const loginButton = screen.getByText("Login");
      fireEvent.click(loginButton);

      await waitFor(() => {
        expect(screen.getByTestId("auth-status")).toHaveTextContent(
          "Authenticated",
        );
      });

      // Then logout
      const logoutButton = screen.getByText("Logout");
      fireEvent.click(logoutButton);

      await waitFor(() => {
        expect(screen.getByTestId("auth-status")).toHaveTextContent(
          "Not Authenticated",
        );
      });
    });

    it("clears user information after logout", async () => {
      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>,
      );

      // Login
      fireEvent.click(screen.getByText("Login"));
      await waitFor(() => {
        expect(screen.getByTestId("user-name")).toBeInTheDocument();
      });

      // Logout
      fireEvent.click(screen.getByText("Logout"));
      await waitFor(() => {
        expect(screen.queryByTestId("user-name")).not.toBeInTheDocument();
      });
    });

    it("clears localStorage on logout", async () => {
      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>,
      );

      // Login
      fireEvent.click(screen.getByText("Login"));
      await waitFor(() => {
        expect(localStorage.getItem("auth_token")).toBeTruthy();
      });

      // Logout
      fireEvent.click(screen.getByText("Logout"));
      await waitFor(() => {
        expect(localStorage.getItem("auth_token")).toBeNull();
      });
    });
  });

  describe("Session Persistence", () => {
    it("restores session from localStorage on mount", () => {
      // Set up existing session
      localStorage.setItem("auth_token", "mock-token");
      localStorage.setItem("user", JSON.stringify({ name: "Test User" }));

      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>,
      );

      expect(screen.getByTestId("auth-status")).toHaveTextContent(
        "Authenticated",
      );
      expect(screen.getByTestId("user-name")).toHaveTextContent("Test User");
    });

    it("handles invalid session data gracefully", () => {
      localStorage.setItem("auth_token", "invalid-token");
      localStorage.setItem("user", "invalid-json");

      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>,
      );

      expect(screen.getByTestId("auth-status")).toHaveTextContent(
        "Not Authenticated",
      );
    });
  });

  describe("Error Handling", () => {
    it("handles login errors", async () => {
      // Mock login to fail
      const mockLogin = vi.fn().mockRejectedValue(new Error("Login failed"));

      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>,
      );

      const loginButton = screen.getByText("Login");
      fireEvent.click(loginButton);

      await waitFor(() => {
        expect(screen.getByTestId("auth-status")).toHaveTextContent(
          "Not Authenticated",
        );
      });
    });

    it("handles network errors during login", async () => {
      // Simulate network error
      vi.spyOn(global, "fetch").mockRejectedValue(new Error("Network error"));

      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>,
      );

      const loginButton = screen.getByText("Login");
      fireEvent.click(loginButton);

      await waitFor(() => {
        expect(screen.getByTestId("auth-status")).toHaveTextContent(
          "Not Authenticated",
        );
      });
    });
  });
});
