// JWT Utilities for token validation and parsing
// Provides client-side JWT validation without exposing secrets

interface JWTHeader {
  alg: string;
  typ: string;
  kid?: string;
}

interface JWTPayload {
  sub: string; // User ID
  email: string;
  name: string;
  grade: string;
  iat: number; // Issued at
  exp: number; // Expires at
  aud: string; // Audience
  iss: string; // Issuer
  jti?: string; // JWT ID
  scope?: string; // Permissions
}

interface ParsedJWT {
  header: JWTHeader;
  payload: JWTPayload;
  signature: string;
  raw: {
    header: string;
    payload: string;
    signature: string;
  };
}

class JWTUtils {
  /**
   * Parse JWT token without verification (client-side only)
   * Note: This is for reading token data, not for security validation
   */
  parseToken(token: string): ParsedJWT | null {
    try {
      const parts = token.split(".");

      if (parts.length !== 3) {
        throw new Error("Invalid JWT format");
      }

      const [headerB64, payloadB64, signature] = parts;

      // Decode header and payload
      const header = JSON.parse(this.base64UrlDecode(headerB64)) as JWTHeader;
      const payload = JSON.parse(
        this.base64UrlDecode(payloadB64),
      ) as JWTPayload;

      return {
        header,
        payload,
        signature,
        raw: {
          header: headerB64,
          payload: payloadB64,
          signature,
        },
      };
    } catch (_error) {
      console.error("Failed to parse JWT:", _error);
      return null;
    }
  }

  /**
   * Check if token is expired (client-side check only)
   */
  isTokenExpired(token: string): boolean {
    const parsed = this.parseToken(token);
    if (!parsed) return true;

    const now = Math.floor(Date.now() / 1000);
    return parsed.payload.exp <= now;
  }

  /**
   * Get token expiration time
   */
  getTokenExpiration(token: string): Date | null {
    const parsed = this.parseToken(token);
    if (!parsed) return null;

    return new Date(parsed.payload.exp * 1000);
  }

  /**
   * Get time until token expires (in milliseconds)
   */
  getTimeUntilExpiration(token: string): number {
    const expiration = this.getTokenExpiration(token);
    if (!expiration) return 0;

    return Math.max(0, expiration.getTime() - Date.now());
  }

  /**
   * Extract user information from token
   */
  getUserFromToken(token: string): Partial<JWTPayload> | null {
    const parsed = this.parseToken(token);
    if (!parsed) return null;

    return {
      sub: parsed.payload.sub,
      email: parsed.payload.email,
      name: parsed.payload.name,
      grade: parsed.payload.grade,
      scope: parsed.payload.scope,
    };
  }

  /**
   * Check if token has specific scope/permission
   */
  hasScope(token: string, requiredScope: string): boolean {
    const parsed = this.parseToken(token);
    if (!parsed || !parsed.payload.scope) return false;

    const scopes = parsed.payload.scope.split(" ");
    return scopes.includes(requiredScope);
  }

  /**
   * Validate token format and basic structure
   */
  isValidTokenFormat(token: string): boolean {
    if (!token || typeof token !== "string") return false;

    const parts = token.split(".");
    if (parts.length !== 3) return false;

    try {
      // Try to decode each part
      this.base64UrlDecode(parts[0]);
      this.base64UrlDecode(parts[1]);

      // Signature should be base64url encoded
      if (!/^[A-Za-z0-9_-]+$/.test(parts[2])) return false;

      return true;
    } catch (_error) {
      return false;
    }
  }

  /**
   * Create a mock JWT for development/testing
   * WARNING: Only use in development environment
   */
  createMockToken(payload: Partial<JWTPayload>): string {
    if (process.env.NODE_ENV === "production") {
      throw new Error("Mock tokens cannot be created in production");
    }

    const header: JWTHeader = {
      alg: "HS256",
      typ: "JWT",
    };

    const now = Math.floor(Date.now() / 1000);
    const mockPayload: JWTPayload = {
      sub: payload.sub || "mock-user-id",
      email: payload.email || "test@example.com",
      name: payload.name || "Test User",
      grade: payload.grade || "grade1",
      iat: now,
      exp: now + 24 * 60 * 60, // 24 hours
      aud: "mrf-edu-platform",
      iss: "mrf-edu-dev",
      scope: payload.scope || "read write",
      ...payload,
    };

    const headerB64 = this.base64UrlEncode(JSON.stringify(header));
    const payloadB64 = this.base64UrlEncode(JSON.stringify(mockPayload));
    const signature = "mock-signature-for-development";

    return `${headerB64}.${payloadB64}.${signature}`;
  }

  /**
   * Sanitize token for logging (removes signature)
   */
  sanitizeTokenForLogging(token: string): string {
    const parts = token.split(".");
    if (parts.length !== 3) return "[invalid-token]";

    return `${parts[0]}.${parts[1]}.[signature-hidden]`;
  }

  /**
   * Get token metadata for debugging
   */
  getTokenMetadata(token: string): {
    isValid: boolean;
    isExpired: boolean;
    expiresAt: Date | null;
    timeUntilExpiration: number;
    userId: string | null;
    algorithm: string | null;
  } {
    const parsed = this.parseToken(token);

    if (!parsed) {
      return {
        isValid: false,
        isExpired: true,
        expiresAt: null,
        timeUntilExpiration: 0,
        userId: null,
        algorithm: null,
      };
    }

    const expiresAt = new Date(parsed.payload.exp * 1000);
    const isExpired = Date.now() >= expiresAt.getTime();
    const timeUntilExpiration = Math.max(0, expiresAt.getTime() - Date.now());

    return {
      isValid: true,
      isExpired,
      expiresAt,
      timeUntilExpiration,
      userId: parsed.payload.sub,
      algorithm: parsed.header.alg,
    };
  }

  /**
   * Base64URL decode
   */
  private base64UrlDecode(str: string): string {
    // Add padding if needed
    let padded = str;
    while (padded.length % 4) {
      padded += "=";
    }

    // Replace URL-safe characters
    const base64 = padded.replace(/-/g, "+").replace(/_/g, "/");

    try {
      return atob(base64);
    } catch (_error) {
      throw new Error("Invalid base64url encoding");
    }
  }

  /**
   * Base64URL encode
   */
  private base64UrlEncode(str: string): string {
    const base64 = btoa(str);
    return base64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=/g, "");
  }

  /**
   * Validate token audience and issuer
   */
  validateTokenClaims(
    token: string,
    expectedAudience?: string,
    expectedIssuer?: string,
  ): boolean {
    const parsed = this.parseToken(token);
    if (!parsed) return false;

    if (expectedAudience && parsed.payload.aud !== expectedAudience) {
      return false;
    }

    if (expectedIssuer && parsed.payload.iss !== expectedIssuer) {
      return false;
    }

    return true;
  }

  /**
   * Check if token was issued recently (helps detect replay attacks)
   */
  isTokenFresh(token: string, maxAgeMinutes: number = 60): boolean {
    const parsed = this.parseToken(token);
    if (!parsed) return false;

    const issuedAt = new Date(parsed.payload.iat * 1000);
    const maxAge = maxAgeMinutes * 60 * 1000;

    return Date.now() - issuedAt.getTime() <= maxAge;
  }
}

// Export singleton instance
export const jwtUtils = new JWTUtils();

// Export types
export type { JWTHeader, JWTPayload, ParsedJWT };

// Export utility functions for common use cases
export const parseJWT = (token: string) => jwtUtils.parseToken(token);
export const isJWTExpired = (token: string) => jwtUtils.isTokenExpired(token);
export const getUserFromJWT = (token: string) =>
  jwtUtils.getUserFromToken(token);
export const validateJWTFormat = (token: string) =>
  jwtUtils.isValidTokenFormat(token);
