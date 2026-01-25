// Secure Token Management System for MRF Educational Platform
// Implements JWT token encryption, secure storage, and automatic refresh

interface TokenData {
  accessToken: string;
  refreshToken: string;
  expiresAt: number;
  userId: string;
}

interface EncryptedTokenData {
  data: string;
  iv: string;
  timestamp: number;
}

class SecureTokenManager {
  private readonly STORAGE_KEY = "mrf_secure_tokens";
  private readonly ENCRYPTION_KEY_LENGTH = 32;
  private readonly IV_LENGTH = 16;
  private readonly TOKEN_REFRESH_THRESHOLD = 5 * 60 * 1000; // 5 minutes before expiry

  private encryptionKey: CryptoKey | null = null;
  private refreshTimer: NodeJS.Timeout | null = null;

  constructor() {
    this.initializeEncryption();
  }

  /**
   * Initialize encryption key for token security
   */
  private async initializeEncryption(): Promise<void> {
    if (typeof window === "undefined") return;

    try {
      // Generate or retrieve encryption key
      const keyData = await this.getOrCreateEncryptionKey();
      this.encryptionKey = await window.crypto.subtle.importKey(
        "raw",
        keyData,
        { name: "AES-GCM" },
        false,
        ["encrypt", "decrypt"],
      );
    } catch (_error) {
      console.error("Failed to initialize token encryption:", _error);
      // Fallback to base64 encoding if crypto API fails
    }
  }

  /**
   * Get or create encryption key stored securely
   */
  private async getOrCreateEncryptionKey(): Promise<ArrayBuffer> {
    const keyName = "mrf_encryption_key";

    try {
      // Try to get existing key from IndexedDB (more secure than localStorage)
      const existingKey = await this.getFromIndexedDB(keyName);
      if (existingKey) {
        return existingKey;
      }
    } catch (_error) {
      // IndexedDB not available, continue with generation
    }

    // Generate new key
    const keyData = window.crypto.getRandomValues(
      new Uint8Array(this.ENCRYPTION_KEY_LENGTH),
    );

    try {
      // Store in IndexedDB for persistence
      await this.storeInIndexedDB(keyName, keyData.buffer);
    } catch (_error) {
      // IndexedDB failed, key will be regenerated on next session
      console.warn("Could not persist encryption key:", _error);
    }

    return keyData.buffer;
  }

  /**
   * Encrypt token data using AES-GCM
   */
  private async encryptTokenData(
    tokenData: TokenData,
  ): Promise<EncryptedTokenData> {
    if (!this.encryptionKey || typeof window === "undefined") {
      // Fallback to base64 encoding
      return {
        data: btoa(JSON.stringify(tokenData)),
        iv: "",
        timestamp: Date.now(),
      };
    }

    try {
      const iv = window.crypto.getRandomValues(new Uint8Array(this.IV_LENGTH));
      const encodedData = new TextEncoder().encode(JSON.stringify(tokenData));

      const encryptedData = await window.crypto.subtle.encrypt(
        { name: "AES-GCM", iv },
        this.encryptionKey,
        encodedData,
      );

      return {
        data: this.arrayBufferToBase64(encryptedData),
        iv: this.arrayBufferToBase64(iv.buffer),
        timestamp: Date.now(),
      };
    } catch (_error) {
      console.error("Token encryption failed:", _error);
      // Fallback to base64
      return {
        data: btoa(JSON.stringify(tokenData)),
        iv: "",
        timestamp: Date.now(),
      };
    }
  }

  /**
   * Decrypt token data
   */
  private async decryptTokenData(
    encryptedData: EncryptedTokenData,
  ): Promise<TokenData | null> {
    if (!this.encryptionKey || !encryptedData.iv) {
      // Handle base64 fallback
      try {
        return JSON.parse(atob(encryptedData.data));
      } catch (_error) {
        console.error("Token decryption failed:", _error);
        return null;
      }
    }

    try {
      const iv = this.base64ToArrayBuffer(encryptedData.iv);
      const data = this.base64ToArrayBuffer(encryptedData.data);

      const decryptedData = await window.crypto.subtle.decrypt(
        { name: "AES-GCM", iv },
        this.encryptionKey,
        data,
      );

      const tokenString = new TextDecoder().decode(decryptedData);
      return JSON.parse(tokenString);
    } catch (_error) {
      console.error("Token decryption failed:", _error);
      return null;
    }
  }

  /**
   * Store tokens securely
   */
  async storeTokens(
    accessToken: string,
    refreshToken: string,
    expiresIn: number,
    userId: string,
    rememberMe: boolean = false,
  ): Promise<void> {
    const expiresAt = Date.now() + expiresIn * 1000;

    const tokenData: TokenData = {
      accessToken,
      refreshToken,
      expiresAt,
      userId,
    };

    try {
      const encryptedData = await this.encryptTokenData(tokenData);
      const storage = rememberMe ? localStorage : sessionStorage;

      storage.setItem(this.STORAGE_KEY, JSON.stringify(encryptedData));

      // Set up automatic refresh
      this.scheduleTokenRefresh(expiresAt);
    } catch (_error) {
      console.error("Failed to store tokens:", _error);
      throw new Error("Token storage failed");
    }
  }

  /**
   * Retrieve stored tokens
   */
  async getTokens(): Promise<TokenData | null> {
    try {
      // Try sessionStorage first, then localStorage
      const encryptedDataString =
        sessionStorage.getItem(this.STORAGE_KEY) ||
        localStorage.getItem(this.STORAGE_KEY);

      if (!encryptedDataString) {
        return null;
      }

      const encryptedData: EncryptedTokenData = JSON.parse(encryptedDataString);

      // Check if tokens are too old (security measure)
      const maxAge = 30 * 24 * 60 * 60 * 1000; // 30 days
      if (Date.now() - encryptedData.timestamp > maxAge) {
        this.clearTokens();
        return null;
      }

      const tokenData = await this.decryptTokenData(encryptedData);

      if (!tokenData) {
        this.clearTokens();
        return null;
      }

      // Check if access token is expired
      if (Date.now() >= tokenData.expiresAt) {
        // Try to refresh if we have a refresh token
        if (tokenData.refreshToken) {
          return await this.refreshAccessToken(tokenData.refreshToken);
        } else {
          this.clearTokens();
          return null;
        }
      }

      // Schedule refresh if needed
      this.scheduleTokenRefresh(tokenData.expiresAt);

      return tokenData;
    } catch (_error) {
      console.error("Failed to retrieve tokens:", _error);
      this.clearTokens();
      return null;
    }
  }

  /**
   * Get access token for API requests
   */
  async getAccessToken(): Promise<string | null> {
    const tokenData = await this.getTokens();
    return tokenData?.accessToken || null;
  }

  /**
   * Check if user is authenticated
   */
  async isAuthenticated(): Promise<boolean> {
    const tokenData = await this.getTokens();
    return tokenData !== null && Date.now() < tokenData.expiresAt;
  }

  /**
   * Clear all stored tokens
   */
  clearTokens(): void {
    localStorage.removeItem(this.STORAGE_KEY);
    sessionStorage.removeItem(this.STORAGE_KEY);

    if (this.refreshTimer) {
      clearTimeout(this.refreshTimer);
      this.refreshTimer = null;
    }
  }

  /**
   * Schedule automatic token refresh
   */
  private scheduleTokenRefresh(expiresAt: number): void {
    if (this.refreshTimer) {
      clearTimeout(this.refreshTimer);
    }

    const refreshTime = expiresAt - Date.now() - this.TOKEN_REFRESH_THRESHOLD;

    if (refreshTime > 0) {
      this.refreshTimer = setTimeout(async () => {
        try {
          const tokenData = await this.getTokens();
          if (tokenData?.refreshToken) {
            await this.refreshAccessToken(tokenData.refreshToken);
          }
        } catch (_error) {
          console.error("Automatic token refresh failed:", _error);
        }
      }, refreshTime);
    }
  }

  /**
   * Refresh access token using refresh token
   */
  private async refreshAccessToken(
    refreshToken: string,
  ): Promise<TokenData | null> {
    try {
      // This would call your API endpoint for token refresh
      const response = await fetch("/api/auth/refresh", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ refreshToken }),
      });

      if (!response.ok) {
        throw new Error("Token refresh failed");
      }

      const data = await response.json();

      // Store new tokens
      await this.storeTokens(
        data.accessToken,
        data.refreshToken || refreshToken,
        data.expiresIn,
        data.userId,
        localStorage.getItem(this.STORAGE_KEY) !== null, // rememberMe based on storage location
      );

      return await this.getTokens();
    } catch (_error) {
      console.error("Token refresh failed:", _error);
      this.clearTokens();
      return null;
    }
  }

  // Utility methods for IndexedDB operations
  private async getFromIndexedDB(key: string): Promise<ArrayBuffer | null> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open("MRFSecureStorage", 1);

      request.onerror = () => reject(request.error);

      request.onsuccess = () => {
        const db = request.result;
        const transaction = db.transaction(["keys"], "readonly");
        const store = transaction.objectStore("keys");
        const getRequest = store.get(key);

        getRequest.onsuccess = () => resolve(getRequest.result?.data || null);
        getRequest.onerror = () => reject(getRequest.error);
      };

      request.onupgradeneeded = () => {
        const db = request.result;
        if (!db.objectStoreNames.contains("keys")) {
          db.createObjectStore("keys", { keyPath: "key" });
        }
      };
    });
  }

  private async storeInIndexedDB(
    key: string,
    data: ArrayBuffer,
  ): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open("MRFSecureStorage", 1);

      request.onerror = () => reject(request.error);

      request.onsuccess = () => {
        const db = request.result;
        const transaction = db.transaction(["keys"], "readwrite");
        const store = transaction.objectStore("keys");
        const putRequest = store.put({ key, data });

        putRequest.onsuccess = () => resolve();
        putRequest.onerror = () => reject(putRequest.error);
      };

      request.onupgradeneeded = () => {
        const db = request.result;
        if (!db.objectStoreNames.contains("keys")) {
          db.createObjectStore("keys", { keyPath: "key" });
        }
      };
    });
  }

  // Utility methods for base64 conversion
  private arrayBufferToBase64(buffer: ArrayBuffer): string {
    const bytes = new Uint8Array(buffer);
    let binary = "";
    for (let i = 0; i < bytes.byteLength; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
  }

  private base64ToArrayBuffer(base64: string): ArrayBuffer {
    const binary = atob(base64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
    return bytes.buffer;
  }
}

// Export singleton instance
export const tokenManager = new SecureTokenManager();

// Export types for use in other files
export type { TokenData, EncryptedTokenData };
