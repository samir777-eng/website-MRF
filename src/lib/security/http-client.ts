// Secure HTTP Client with automatic token management
// Handles authentication, token refresh, and request/response interceptors

import { tokenManager } from "./token-manager";
interface RequestConfig extends RequestInit {
  skipAuth?: boolean;
  retryOnUnauthorized?: boolean;
  timeout?: number;
}

interface APIResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

class SecureHTTPClient {
  private baseURL: string;
  private defaultTimeout: number = 30000; // 30 seconds

  constructor(baseURL: string = "/api") {
    this.baseURL = baseURL;
  }

  /**
   * Make authenticated HTTP request
   */
  async request<T = unknown>(
    endpoint: string,
    config: RequestConfig = {},
  ): Promise<APIResponse<T>> {
    const {
      skipAuth = false,
      retryOnUnauthorized = true,
      timeout = this.defaultTimeout,
      ...requestConfig
    } = config;

    const url = `${this.baseURL}${endpoint}`;

    // Set up request configuration
    const requestInit: RequestInit = {
      headers: {
        "Content-Type": "application/json",
        ...requestConfig.headers},
      ...requestConfig};

    // Add authentication header if not skipped
    if (!skipAuth) {
      const token = await tokenManager.getAccessToken();
      if (token) {
        (requestInit.headers as Record<string, string>)["Authorization"] =
          `Bearer ${token}`;
      }
    }

    // Add CSRF protection for state-changing requests
    if (
      ["POST", "PUT", "PATCH", "DELETE"].includes(
        requestInit.method?.toUpperCase() || "GET",
      )
    ) {
      (requestInit.headers as Record<string, string>)["X-Requested-With"] =
        "XMLHttpRequest";
    }

    try {
      const response = await this.fetchWithTimeout(url, requestInit, timeout);

      // Handle 401 Unauthorized - try token refresh
      if (response.status === 401 && retryOnUnauthorized && !skipAuth) {
        try {
          // Try to refresh token
          const tokenData = await tokenManager.getTokens();
          if (tokenData?.refreshToken) {
            // Refresh token and retry request
            await this.refreshTokenAndRetry();

            // Update authorization header with new token
            const newToken = await tokenManager.getAccessToken();
            if (newToken) {
              (requestInit.headers as Record<string, string>)["Authorization"] =
                `Bearer ${newToken}`;

              // Retry the original request
              const retryResponse = await this.fetchWithTimeout(
                url,
                requestInit,
                timeout,
              );
              return await this.handleResponse<T>(retryResponse);
            }
          }
        } catch (refreshError) {
          console.error("Token refresh failed:", refreshError);
          // Clear tokens and redirect to login
          tokenManager.clearTokens();
          this.handleAuthenticationFailure();
        }
      }

      return await this.handleResponse<T>(response);
    } catch (_error) {
      console.error("HTTP request failed:", _error);
      throw this.createAPIError(_error);
    }
  }

  /**
   * GET request
   */
  async get<T = unknown>(
    endpoint: string,
    config?: RequestConfig,
  ): Promise<APIResponse<T>> {
    return this.request<T>(endpoint, { ...config, method: "GET" });
  }

  /**
   * POST request
   */
  async post<T = unknown>(
    endpoint: string,
    data?: unknown,
    config?: RequestConfig,
  ): Promise<APIResponse<T>> {
    return this.request<T>(endpoint, {
      ...config,
      method: "POST",
      body: data ? JSON.stringify(data) : undefined});
  }

  /**
   * PUT request
   */
  async put<T = unknown>(
    endpoint: string,
    data?: unknown,
    config?: RequestConfig,
  ): Promise<APIResponse<T>> {
    return this.request<T>(endpoint, {
      ...config,
      method: "PUT",
      body: data ? JSON.stringify(data) : undefined});
  }

  /**
   * PATCH request
   */
  async patch<T = unknown>(
    endpoint: string,
    data?: unknown,
    config?: RequestConfig,
  ): Promise<APIResponse<T>> {
    return this.request<T>(endpoint, {
      ...config,
      method: "PATCH",
      body: data ? JSON.stringify(data) : undefined});
  }

  /**
   * DELETE request
   */
  async delete<T = unknown>(
    endpoint: string,
    config?: RequestConfig,
  ): Promise<APIResponse<T>> {
    return this.request<T>(endpoint, { ...config, method: "DELETE" });
  }

  /**
   * Upload file with progress tracking
   */
  async uploadFile<T = unknown>(
    endpoint: string,
    file: File,
    onProgress?: (progress: number) => void,
    config?: RequestConfig,
  ): Promise<APIResponse<T>> {
    const formData = new FormData();
    formData.append("file", file);

    const token = await tokenManager.getAccessToken();
    const headers: Record<string, string> = {
      "X-Requested-With": "XMLHttpRequest"};

    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    // Add custom headers from config
    if (config?.headers) {
      Object.assign(headers, config.headers);
    }

    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();

      xhr.upload.addEventListener("progress", (event) => {
        if (event.lengthComputable && onProgress) {
          const progress = (event.loaded / event.total) * 100;
          onProgress(progress);
        }
      });

      xhr.addEventListener("load", async () => {
        try {
          const response = JSON.parse(xhr.responseText);
          resolve(response);
        } catch (_error) {
          reject(new Error("Invalid response format"));
        }
      });

      xhr.addEventListener("error", () => {
        reject(new Error("Upload failed"));
      });

      xhr.open("POST", `${this.baseURL}${endpoint}`);

      // Set headers
      Object.entries(headers).forEach(([key, value]) => {
        xhr.setRequestHeader(key, value);
      });

      xhr.send(formData);
    });
  }

  /**
   * Fetch with timeout support
   */
  private async fetchWithTimeout(
    url: string,
    config: RequestInit,
    timeout: number,
  ): Promise<Response> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
      const response = await fetch(url, {
        ...config,
        signal: controller.signal});
      clearTimeout(timeoutId);
      return response;
    } catch (_error) {
      clearTimeout(timeoutId);
      if (_error instanceof Error && _error.name === "AbortError") {
        throw new Error(`Request timeout after ${timeout}ms`);
      }
      throw _error;
    }
  }

  /**
   * Handle response and convert to API format
   */
  private async handleResponse<T>(response: Response): Promise<APIResponse<T>> {
    const contentType = response.headers.get("content-type");

    try {
      if (contentType?.includes("application/json")) {
        const data = await response.json();

        if (!response.ok) {
          return {
            success: false,
            error: data.message || data.error || `HTTP ${response.status}`,
            message:
              data.message || `Request failed with status ${response.status}`};
        }

        return {
          success: true,
          data: data.data || data,
          message: data.message};
      } else {
        const text = await response.text();

        if (!response.ok) {
          return {
            success: false,
            error: text || `HTTP ${response.status}`,
            message: `Request failed with status ${response.status}`};
        }

        return {
          success: true,
          data: text as T};
      }
    } catch (_error) {
      return {
        success: false,
        error: "Failed to parse response",
        message: _error instanceof Error ? _error.message : "Unknown error"};
    }
  }

  /**
   * Refresh token and handle errors
   */
  private async refreshTokenAndRetry(): Promise<void> {
    const tokenData = await tokenManager.getTokens();
    if (!tokenData?.refreshToken) {
      throw new Error("No refresh token available");
    }

    // Call refresh endpoint
    const response = await fetch(`${this.baseURL}/auth/refresh`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Requested-With": "XMLHttpRequest"},
      body: JSON.stringify({ refreshToken: tokenData.refreshToken })});

    if (!response.ok) {
      throw new Error("Token refresh failed");
    }

    const data = await response.json();

    // Store new tokens
    await tokenManager.storeTokens(
      data.accessToken,
      data.refreshToken || tokenData.refreshToken,
      data.expiresIn,
      data.userId,
      localStorage.getItem("mrf_secure_tokens") !== null,
    );
  }

  /**
   * Handle authentication failure
   */
  private handleAuthenticationFailure(): void {
    // Clear tokens
    tokenManager.clearTokens();

    // Redirect to login page
    if (typeof window !== "undefined") {
      const currentPath = window.location.pathname;
      const loginPath = "/ar/login";

      if (currentPath !== loginPath) {
        window.location.href = `${loginPath}?redirect=${encodeURIComponent(currentPath)}`;
      }
    }
  }

  /**
   * Create standardized API error
   */
  private createAPIError(_error: unknown): Error {
    if (_error instanceof Error) {
      return _error;
    }

    return new Error(typeof _error === "string" ? _error : "Unknown API error");
  }

  /**
   * Set base URL for all requests
   */
  setBaseURL(baseURL: string): void {
    this.baseURL = baseURL;
  }

  /**
   * Set default timeout for all requests
   */
  setDefaultTimeout(timeout: number): void {
    this.defaultTimeout = timeout;
  }
}

// Export singleton instance
export const httpClient = new SecureHTTPClient();

// Export types
export type { RequestConfig, APIResponse };
