import { NextRequest } from "next/server";

interface RateLimitRecord {
  count: number;
  resetTime: number;
}

const rateLimitMap = new Map<string, RateLimitRecord>();

/**
 * Rate limiter to prevent brute force attacks
 * @param request - Next.js request object
 * @param limit - Maximum number of requests allowed in the time window
 * @param windowMs - Time window in milliseconds (default: 60000 = 1 minute)
 * @returns true if request is allowed, false if rate limit exceeded
 */
export function rateLimit(
  request: NextRequest,
  limit: number = 5,
  windowMs: number = 60000
): boolean {
  // Get client IP address
  // Note: request.ip is not available in all Next.js environments
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0].trim() ||
    request.headers.get("x-real-ip") ||
    "unknown";

  const now = Date.now();
  const record = rateLimitMap.get(ip);

  // If no record exists or the time window has expired, create a new record
  if (!record || now > record.resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + windowMs });

    // Clean up old entries periodically
    if (rateLimitMap.size > 10000) {
      cleanupOldEntries();
    }

    return true;
  }

  // If limit is exceeded, deny the request
  if (record.count >= limit) {
    return false;
  }

  // Increment the count
  record.count++;
  return true;
}

/**
 * Clean up expired rate limit entries
 */
function cleanupOldEntries() {
  const now = Date.now();
  const entriesToDelete: string[] = [];

  rateLimitMap.forEach((record, ip) => {
    if (now > record.resetTime) {
      entriesToDelete.push(ip);
    }
  });

  entriesToDelete.forEach((ip) => rateLimitMap.delete(ip));
}

/**
 * Get remaining requests for an IP
 */
export function getRemainingRequests(
  request: NextRequest,
  limit: number = 5
): number {
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0].trim() ||
    request.headers.get("x-real-ip") ||
    "unknown";

  const record = rateLimitMap.get(ip);

  if (!record || Date.now() > record.resetTime) {
    return limit;
  }

  return Math.max(0, limit - record.count);
}

/**
 * Get time until rate limit reset
 */
export function getResetTime(request: NextRequest): number {
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0].trim() ||
    request.headers.get("x-real-ip") ||
    "unknown";

  const record = rateLimitMap.get(ip);

  if (!record) {
    return 0;
  }

  return Math.max(0, record.resetTime - Date.now());
}

/**
 * Reset rate limit for an IP (useful for testing)
 */
export function resetRateLimit(ip: string) {
  rateLimitMap.delete(ip);
}

/**
 * Clear all rate limit records (useful for testing)
 */
export function clearAllRateLimits() {
  rateLimitMap.clear();
}
