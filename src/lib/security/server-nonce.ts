import { headers } from "next/headers";

/**
 * Server-side function to get nonce from headers
 * This must be called from a Server Component
 */
export async function getNonce(): Promise<string | null> {
  try {
    const headersList = await headers();
    return headersList.get("X-Nonce") || null;
  } catch (_error) {
    // Headers not available (client-side or static generation)
    return null;
  }
}

/**
 * Generate a cryptographically secure nonce
 * Server-side version using Node.js crypto
 */
export function generateServerNonce(): string {
  if (typeof crypto !== "undefined" && crypto.getRandomValues) {
    // Use Web Crypto API if available
    const array = new Uint8Array(16);
    crypto.getRandomValues(array);
    return btoa(String.fromCharCode(...array));
  } else {
    // Fallback using Math.random (less secure but synchronous)
    const array = new Array(16);
    for (let i = 0; i < 16; i++) {
      array[i] = Math.floor(Math.random() * 256);
    }
    return btoa(String.fromCharCode(...array));
  }
}
